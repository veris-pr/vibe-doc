from fastapi import APIRouter, Depends, HTTPException
from app.transport.handlers import (
    ProjectHandlers,
    get_project_handlers,
    DocumentHandlers,
    get_document_handlers,
)
from app.transport.schemas import (
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectResponse,
    ProjectListResponse,
    CreateDocumentRequest,
    UpdateDocumentRequest,
    DocumentResponse,
    DocumentListResponse,
)
from app.api.v1.auth import get_current_user
from app.models import User

projects_router = APIRouter(prefix="/projects", tags=["projects"])
documents_router = APIRouter(tags=["documents"])


@projects_router.post("/", response_model=ProjectResponse)
async def create_project(
    request: CreateProjectRequest,
    organization_id: int,
    handlers: ProjectHandlers = Depends(get_project_handlers),
    current_user: User = Depends(get_current_user),
):
    return await handlers.create_project(request, organization_id, current_user.id)


@projects_router.get("/", response_model=ProjectListResponse)
async def list_projects(
    organization_id: int,
    handlers: ProjectHandlers = Depends(get_project_handlers),
    current_user: User = Depends(get_current_user),
):
    return await handlers.list_projects(organization_id)


@documents_router.post("/projects/{project_id}/documents", response_model=DocumentResponse)
async def create_document(
    request: CreateDocumentRequest,
    project_id: int,
    handlers: DocumentHandlers = Depends(get_document_handlers),
    current_user: User = Depends(get_current_user),
):
    return await handlers.create_document(request, project_id)


@documents_router.get("/projects/{project_id}/documents", response_model=DocumentListResponse)
async def list_documents(
    project_id: int,
    handlers: DocumentHandlers = Depends(get_document_handlers),
    current_user: User = Depends(get_current_user),
):
    return await handlers.list_documents(project_id)


@documents_router.patch("/documents/{document_id}", response_model=DocumentResponse)
async def update_document(
    request: UpdateDocumentRequest,
    document_id: int,
    handlers: DocumentHandlers = Depends(get_document_handlers),
    current_user: User = Depends(get_current_user),
):
    return await handlers.update_document(request, document_id)