from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.domain.repositories import DocumentRepository, ProjectRepository
from app.infrastructure import SQLAlchemyDocumentRepository, SQLAlchemyProjectRepository
from app.application.use_cases import (
    CreateDocument,
    CreateDocumentInput,
    UpdateDocument,
    UpdateDocumentInput,
)
from app.transport.schemas import (
    CreateDocumentRequest,
    UpdateDocumentRequest,
    DocumentResponse,
    DocumentListResponse,
)


async def get_document_repository(session: AsyncSession) -> DocumentRepository:
    return SQLAlchemyDocumentRepository(session)


async def get_project_handler_repository(session: AsyncSession) -> ProjectRepository:
    return SQLAlchemyProjectRepository(session)


class DocumentHandlers:
    def __init__(
        self,
        document_repository: DocumentRepository,
        project_repository: ProjectRepository,
    ):
        self.document_repository = document_repository
        self.project_repository = project_repository

    async def create_document(
        self,
        request: CreateDocumentRequest,
        project_id: int,
    ) -> DocumentResponse:
        use_case = CreateDocument(
            document_repository=self.document_repository,
            project_repository=self.project_repository,
        )

        input_data = CreateDocumentInput(
            project_id=project_id,
            title=request.title,
            slug=request.slug,
            path=request.path,
            content=request.content,
            ordering=request.ordering,
            parent_id=request.parent_id,
        )

        try:
            result = await use_case.execute(input_data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return DocumentResponse(
            id=result.document.id,
            project_id=result.document.project_id,
            version_id=result.document.version_id,
            title=result.document.title,
            slug=result.document.slug,
            path=result.document.path,
            content=result.document.content,
            ordering=result.document.ordering,
            parent_id=result.document.parent_id,
        )

    async def update_document(
        self,
        request: UpdateDocumentRequest,
        document_id: int,
    ) -> DocumentResponse:
        use_case = UpdateDocument(document_repository=self.document_repository)

        input_data = UpdateDocumentInput(
            document_id=document_id,
            title=request.title,
            content=request.content,
            frontmatter=request.frontmatter,
        )

        try:
            result = await use_case.execute(input_data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

        return DocumentResponse(
            id=result.document.id,
            project_id=result.document.project_id,
            version_id=result.document.version_id,
            title=result.document.title,
            slug=result.document.slug,
            path=result.document.path,
            content=result.document.content,
            ordering=result.document.ordering,
            parent_id=result.document.parent_id,
        )

    async def list_documents(self, project_id: int) -> DocumentListResponse:
        documents = await self.document_repository.list_by_project(project_id)
        return DocumentListResponse(
            documents=[
                DocumentResponse(
                    id=d.id,
                    project_id=d.project_id,
                    version_id=d.version_id,
                    title=d.title,
                    slug=d.slug,
                    path=d.path,
                    content=d.content,
                    ordering=d.ordering,
                    parent_id=d.parent_id,
                )
                for d in documents
            ]
        )


async def get_document_handlers(
    doc_repo: DocumentRepository = Depends(get_document_repository),
    proj_repo: ProjectRepository = Depends(get_project_handler_repository),
) -> DocumentHandlers:
    return DocumentHandlers(doc_repo, proj_repo)