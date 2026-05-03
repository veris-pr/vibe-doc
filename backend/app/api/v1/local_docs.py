from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path

from app.database import get_db
from app.models import Project, Document, User
from app.api.v1.auth import get_current_user
from app.services.local_loader import load_from_folder

router = APIRouter()


class LocalFolderImport(BaseModel):
    project_id: int
    folder_path: str


@router.post("/local")
async def create_document_from_content(
    project_id: int,
    title: str,
    slug: str,
    content: str,
    order: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a document directly from content (no GitHub needed)"""
    
    project_result = await db.execute(
        select(Project)
        .options()
        .where(Project.id == project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    path = f"{slug}.md"
    
    existing = await db.execute(
        select(Document).where(
            Document.project_id == project_id,
            Document.path == path
        )
    )
    doc = existing.scalar_one_or_none()
    
    if doc:
        doc.title = title
        doc.content = content
        doc.slug = slug
        doc.order = order
    else:
        doc = Document(
            project_id=project_id,
            title=title,
            slug=slug,
            path=path,
            content=content,
            ordering=order,
            frontmatter={'title': title, 'order': order}
        )
        db.add(doc)
    
    await db.refresh(doc)
    
    return {
        "id": doc.id,
        "title": doc.title,
        "slug": doc.slug,
        "path": doc.path
    }


@router.post("/local/batch")
async def create_documents_batch(
    project_id: int,
    documents: list[dict],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create multiple documents at once (for bulk local uploads)"""
    
    project_result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    created = []
    
    for doc_data in documents:
        title = doc_data.get('title', 'Untitled')
        slug = doc_data.get('slug', title.lower().replace(' ', '-'))
        content = doc_data.get('content', '')
        order = doc_data.get('order', 0)
        path = f"{slug}.md"
        
        existing = await db.execute(
            select(Document).where(
                Document.project_id == project_id,
                Document.path == path
            )
        )
        doc = existing.scalar_one_or_none()
        
        if doc:
            doc.title = title
            doc.content = content
            doc.slug = slug
            doc.order = order
        else:
            doc = Document(
                project_id=project_id,
                title=title,
                slug=slug,
                path=path,
                content=content,
                ordering=order,
                frontmatter={'title': title, 'order': order}
            )
            db.add(doc)
        
        created.append({'slug': slug, 'title': title})
    
    return {"created": len(created), "documents": created}


@router.post("/local/seed")
async def seed_sample_docs(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Seed a project with sample documentation for testing"""
    
    sample_docs = [
        {
            "title": "Introduction",
            "slug": "introduction",
            "content": """# Welcome to OpenDoc

OpenDoc is an **open source** documentation platform that helps you create beautiful documentation sites.

## Features

- 📝 **MDX Support** - Write in Markdown with React components
- 🔌 **API Docs** - Auto-generate from OpenAPI specs
- 🔍 **Instant Search** - Cmd+K search with Pagefind
- 🎨 **Beautiful UI** - Modern, clean design

## Getting Started

To get started, simply create a new project and add your documentation.

```python
import opendoc

docs = opendoc.create({
    "title": "My Documentation",
    "theme": "modern"
})
```

> [!NOTE]
> This is a sample document to help you get started with OpenDoc.
""",
            "order": 1
        },
        {
            "title": "Installation",
            "slug": "installation",
            "content": """# Installation

Get up and running with OpenDoc in minutes.

## Quick Start

```bash
pip install opendoc
```

## Requirements

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

## Configuration

Create a `opendoc.yaml` file in your project root:

```yaml
title: My Docs
description: Documentation for my project
theme: modern
```

## Next Steps

Once installed, check out the [API Reference](/docs/api-reference) to learn more.
""",
            "order": 2
        },
        {
            "title": "API Reference",
            "slug": "api-reference",
            "content": """# API Reference

Complete reference for the OpenDoc API.

## Authentication

All API requests require authentication using a bearer token.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.opendoc.dev/v1/documents
```

## Endpoints

### List Documents

`GET /api/v1/documents`

Returns a list of all documents in the project.

### Create Document

`POST /api/v1/documents`

Create a new document.

**Request Body:**

```json
{
  "title": "Getting Started",
  "slug": "getting-started",
  "content": "# Hello World"
}
```

### Update Document

`PATCH /api/v1/documents/{id}`

Update an existing document.

### Delete Document

`DELETE /api/v1/documents/{id}`

Delete a document.
""",
            "order": 3
        },
        {
            "title": "Configuration",
            "slug": "configuration",
            "content": """# Configuration

Learn how to configure OpenDoc for your needs.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| REDIS_URL | Redis connection string | - |
| SECRET_KEY | Secret key for JWT signing | - |

## Theme Customization

Customize the look and feel of your documentation:

```yaml
theme:
  primary_color: "#6366f1"
  font_family: "Inter"
  dark_mode: true
```

## Navigation

Define your navigation structure in `opendoc.yaml`:

```yaml
navigation:
  - title: Getting Started
    path: /getting-started
  - title: API Reference
    path: /api-reference
```
""",
            "order": 4
        }
    ]
    
    return await create_documents_batch(
        project_id=project_id,
        documents=sample_docs,
        current_user=current_user,
        db=db
    )


@router.post("/local/folder")
async def import_from_folder(
    project_id: int,
    folder_path: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Import documents from a local folder (no GitHub needed)"""
    
    project_result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not Path(folder_path).exists():
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")
    
    docs = load_from_folder(folder_path)
    
    if not docs:
        return {"imported": 0, "message": "No MDX/MD files found"}
    
    return await create_documents_batch(
        project_id=project_id,
        documents=docs,
        current_user=current_user,
        db=db
    )