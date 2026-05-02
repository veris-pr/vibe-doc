from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Project, Document, Organization, OrganizationMember, User

router = APIRouter()


class DevCreateProject(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


@router.post("/dev/project")
async def dev_create_project(
    project_data: DevCreateProject,
    db: AsyncSession = Depends(get_db)
):
    """Dev-only endpoint to create project without auth - for testing only"""
    
    slug = project_data.slug.lower().replace(' ', '-')
    
    existing = await db.execute(
        select(Project).where(Project.slug == slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Project already exists")
    
    org = Organization(
        name=project_data.name + " Org",
        slug=slug + "-org"
    )
    db.add(org)
    await db.flush()
    
    project = Project(
        organization_id=org.id,
        name=project_data.name,
        slug=slug,
        description=project_data.description or "Sample documentation project"
    )
    db.add(project)
    await db.flush()
    
    return {"id": project.id, "slug": project.slug}


@router.post("/dev/seed/{slug}")
async def dev_seed_project(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Dev-only endpoint to seed sample docs - for testing only"""
    
    project_result = await db.execute(
        select(Project).where(Project.slug == slug)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing_docs = await db.execute(
        select(Document).where(Document.project_id == project.id)
    )
    if existing_docs.scalars().first():
        return {"message": "Project already has documents"}
    
    sample_docs = [
        {
            "title": "Introduction",
            "slug": "introduction",
            "content": """# Welcome to OpenDoc

OpenDoc is an **open source** documentation platform.

## Features

- Easy MDX documentation
- Beautiful UI
- Dark mode support
- Instant search

```python
# Quick example
def hello():
    print("Hello, OpenDoc!")
```

> [!NOTE]
> This is sample content to help you get started.
""",
            "order": 1
        },
        {
            "title": "Installation", 
            "slug": "installation",
            "content": """# Installation

Get started with OpenDoc in minutes.

## Quick Start

```bash
pip install opendoc
```

## Requirements

- Python 3.11+
- PostgreSQL
- Redis
""",
            "order": 2
        },
        {
            "title": "API Reference",
            "slug": "api-reference",
            "content": """# API Reference

## Authentication

All API requests require authentication.

```bash
curl -H "Authorization: Bearer TOKEN" /api/v1/documents
```

## Endpoints

### GET /api/v1/documents
List all documents.

### POST /api/v1/documents
Create a new document.
""",
            "order": 3
        }
    ]
    
    for doc_data in sample_docs:
        doc = Document(
            project_id=project.id,
            title=doc_data["title"],
            slug=doc_data["slug"],
            path=f"{doc_data['slug']}.md",
            content=doc_data["content"],
            ordering=doc_data["order"],
            frontmatter={"title": doc_data["title"], "order": doc_data["order"]}
        )
        db.add(doc)
    
    await db.commit()
    
    return {"imported": len(sample_docs), "slug": slug}