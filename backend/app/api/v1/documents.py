from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Document, Project, ProjectMember, User
from app.api.v1.auth import get_current_user

router = APIRouter()


class DocumentCreate(BaseModel):
    project_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=200)
    path: str = Field(..., min_length=1, max_length=500)
    content: Optional[str] = Field("")
    frontmatter: dict = Field(default_factory=dict)
    parent_id: Optional[int] = Field(None, gt=0)
    ordering: int = Field(0)


class DocumentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    frontmatter: Optional[dict] = None
    parent_id: Optional[int] = Field(None, gt=0)
    ordering: Optional[int] = None


class DocumentOut(BaseModel):
    id: int
    project_id: int
    title: str
    slug: str
    path: str
    content: Optional[str]
    frontmatter: dict
    parent_id: Optional[int]
    ordering: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


@router.get("", response_model=List[DocumentOut])
async def list_documents(
    project_id: int = Query(..., description="Project ID"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document)
        .options(selectinload(Document.project))
        .where(Document.project_id == project_id)
        .order_by(Document.ordering, Document.title)
    )
    return result.scalars().all()


@router.post("", response_model=DocumentOut)
async def create_document(
    doc_data: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    project_result = await db.execute(
        select(Project)
        .options(selectinload(Project.members))
        .where(Project.id == doc_data.project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    member = next((m for m in project.members if m.user_id == current_user.id), None)
    if not member or member.role not in ("owner", "editor"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    doc = Document(
        project_id=doc_data.project_id,
        title=doc_data.title,
        slug=doc_data.slug,
        path=doc_data.path,
        content=doc_data.content,
        frontmatter=doc_data.frontmatter,
        parent_id=doc_data.parent_id,
        ordering=doc_data.ordering
    )
    db.add(doc)
    await db.flush()
    
    return {
        "id": doc.id,
        "project_id": doc.project_id,
        "title": doc.title,
        "slug": doc.slug,
        "path": doc.path,
        "content": doc.content,
        "frontmatter": doc.frontmatter,
        "parent_id": doc.parent_id,
        "ordering": doc.ordering,
        "created_at": doc.created_at,
        "updated_at": doc.updated_at
    }


@router.get("/{doc_id}", response_model=DocumentOut)
async def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document)
        .join(Project)
        .join(ProjectMember)
        .where(
            Document.id == doc_id,
            ProjectMember.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return doc


@router.patch("/{doc_id}", response_model=DocumentOut)
async def update_document(
    doc_id: int,
    doc_data: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document)
        .join(Project)
        .join(ProjectMember)
        .where(
            Document.id == doc_id,
            ProjectMember.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    member = next((m for m in doc.project.members if m.user_id == current_user.id), None)
    if not member or member.role not in ("owner", "editor"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = doc_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doc, key, value)
    
    return doc


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document)
        .join(Project)
        .join(ProjectMember)
        .where(
            Document.id == doc_id,
            ProjectMember.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    member = next((m for m in doc.project.members if m.user_id == current_user.id), None)
    if not member or member.role not in ("owner", "editor"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.delete(doc)
    return {"deleted": True}