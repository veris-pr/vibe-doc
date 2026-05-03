from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Project, Version, ProjectMember, User
from app.api.v1.auth import get_current_user

router = APIRouter()


class VersionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    branch: Optional[str] = Field(None, max_length=100)
    is_default: bool = False


class VersionOut(BaseModel):
    id: int
    name: str
    branch: Optional[str]
    is_default: bool
    created_at: str

    class Config:
        from_attributes = True


@router.get("", response_model=list[VersionOut])
async def list_versions(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Version)
        .join(Project)
        .join(ProjectMember)
        .where(
            Version.project_id == project_id,
            ProjectMember.user_id == current_user.id
        )
        .order_by(Version.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=VersionOut)
async def create_version(
    project_id: int,
    version_data: VersionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    project_result = await db.execute(
        select(Project)
        .options()
        .where(Project.id == project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if version_data.is_default:
        existing = await db.execute(
            select(Version).where(
                Version.project_id == project_id,
                Version.is_default == True
            )
        )
        for v in existing.scalars():
            v.is_default = False
    
    version = Version(
        project_id=project_id,
        name=version_data.name,
        branch=version_data.branch,
        is_default=version_data.is_default
    )
    db.add(version)
    await db.refresh(version)
    return version


@router.delete("/{version_id}")
async def delete_version(
    project_id: int,
    version_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Version).where(Version.id == version_id)
    )
    version = result.scalar_one_or_none()
    
    if not version or version.project_id != project_id:
        raise HTTPException(status_code=404, detail="Version not found")
    
    await db.delete(version)
    return {"deleted": True}