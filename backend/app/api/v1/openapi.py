from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Request
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import get_db
from app.models import Project, ProjectMember, User
from app.api.v1.auth import get_current_user
from app.services.openapi_renderer import parse_openapi

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max upload size


class OpenAPIUpload(BaseModel):
    project_id: int
    version: str = "1.0.0"


class OpenAPIUploadResponse(BaseModel):
    success: bool
    title: str
    version: str
    base_url: str
    endpoints_count: int
    schemas_count: int


async def handle_rate_limit_exceed(request: Request, exc: RateLimitExceeded):
    raise HTTPException(
        status_code=429,
        detail="Rate limit exceeded. Please try again later."
    )


@router.post("/upload", response_model=OpenAPIUploadResponse)
@limiter.limit("10/minute")
async def upload_openapi_spec(
    request: Request,
    background_tasks: BackgroundTasks,
    project_id: int = Field(..., gt=0),
    file: UploadFile = File(..., max_size=MAX_FILE_SIZE),
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
    
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    if not content:
        raise HTTPException(status_code=400, detail="Empty file provided")
    
    try:
        import json
        spec_data = json.loads(content)
    except json.JSONDecodeError:
        import yaml
        try:
            spec_data = yaml.safe_load(content)
        except:
            raise HTTPException(status_code=400, detail="Invalid JSON or YAML")
    
    try:
        spec = parse_openapi(spec_data)
        
        return {
            "success": True,
            "title": spec.title,
            "version": spec.version,
            "base_url": spec.base_url,
            "endpoints_count": len(spec.endpoints),
            "schemas_count": len(spec.schemas)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse OpenAPI spec: {str(e)}")