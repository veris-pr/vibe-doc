from pydantic import BaseModel, Field
from typing import Optional


class CreateProjectRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    github_repo: Optional[str] = None
    is_public: bool = True


class UpdateProjectRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    primary_color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    custom_domain: Optional[str] = None
    is_public: Optional[bool] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    logo_url: Optional[str]
    primary_color: str
    github_repo: Optional[str]
    github_branch: str
    custom_domain: Optional[str]
    is_public: bool

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: list[ProjectResponse]