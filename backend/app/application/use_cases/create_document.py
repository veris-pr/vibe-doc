from dataclasses import dataclass
from typing import Optional
from app.domain.entities import Document
from app.domain.repositories import DocumentRepository, ProjectRepository


@dataclass
class CreateDocumentInput:
    project_id: int
    title: str
    slug: str
    path: str
    content: str = ""
    ordering: int = 0
    parent_id: Optional[int] = None


@dataclass
class CreateDocumentOutput:
    document: Document


class CreateDocument:
    def __init__(
        self,
        document_repository: DocumentRepository,
        project_repository: ProjectRepository,
    ):
        self.document_repository = document_repository
        self.project_repository = project_repository

    async def execute(self, input_data: CreateDocumentInput) -> CreateDocumentOutput:
        project = await self.project_repository.get_by_id(input_data.project_id)
        if not project:
            raise ValueError(f"Project {input_data.project_id} not found")

        existing = await self.document_repository.get_by_path(
            input_data.project_id, input_data.path
        )
        if existing:
            raise ValueError(f"Document with path '{input_data.path}' already exists")

        document = Document.create(
            project_id=input_data.project_id,
            title=input_data.title,
            slug=input_data.slug,
            path=input_data.path,
            content=input_data.content,
            ordering=input_data.ordering,
            parent_id=input_data.parent_id,
        )

        saved_document = await self.document_repository.save(document)

        return CreateDocumentOutput(document=saved_document)