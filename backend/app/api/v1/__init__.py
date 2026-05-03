from fastapi import APIRouter
from app.api.v1 import auth, projects, documents, health, webhooks, openapi, versions, local_docs

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(openapi.router, prefix="/openapi", tags=["openapi"])
api_router.include_router(versions.router, prefix="/versions", tags=["versions"])
api_router.include_router(local_docs.router, prefix="/local", tags=["local"])
api_router.include_router(health.router, prefix="/health", tags=["health"])