from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Project, ProjectMember, User, Organization, Document
from app.api.v1.auth import get_current_user

router = APIRouter()


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    organization_id: int = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=1000)
    primary_color: str = Field("#6366f1", pattern=r"^#[0-9a-fA-F]{6}$")


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    logo_url: Optional[str] = Field(None, max_length=500)
    primary_color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")
    github_repo: Optional[str] = Field(None, max_length=500)
    github_branch: Optional[str] = Field(None, max_length=100)
    custom_domain: Optional[str] = Field(None, max_length=255)
    is_public: Optional[bool] = None


class ProjectOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    logo_url: Optional[str]
    primary_color: str
    github_repo: Optional[str]
    custom_domain: Optional[str]
    is_public: bool
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=List[ProjectOut])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project)
        .join(ProjectMember)
        .where(ProjectMember.user_id == current_user.id)
        .options(selectinload(Project.members))
    )
    projects = result.scalars().all()
    return projects


@router.post("", response_model=ProjectOut)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    project = Project(
        name=project_data.name,
        slug=project_data.slug,
        organization_id=project_data.organization_id,
        description=project_data.description,
        primary_color=project_data.primary_color
    )
    db.add(project)
    await db.flush()
    
    member = ProjectMember(
        project_id=project.id,
        user_id=current_user.id,
        role="owner"
    )
    db.add(member)
    
    return {
        "id": project.id,
        "name": project.name,
        "slug": project.slug,
        "description": project.description,
        "logo_url": project.logo_url,
        "primary_color": project.primary_color,
        "github_repo": project.github_repo,
        "custom_domain": project.custom_domain,
        "is_public": project.is_public,
        "created_at": project.created_at
    }


@router.get("/slug/{slug}", response_model=ProjectOut)
async def get_project_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project)
        .where(Project.slug == slug)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.members))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    member = next((m for m in project.members if m.user_id == current_user.id), None)
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.members))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    member = next((m for m in project.members if m.user_id == current_user.id), None)
    if not member or member.role not in ("owner", "editor"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = project_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    return project


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.members))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    member = next((m for m in project.members if m.user_id == current_user.id), None)
    if not member or member.role != "owner":
        raise HTTPException(status_code=403, detail="Only owner can delete")
    
    await db.delete(project)
    return {"deleted": True}