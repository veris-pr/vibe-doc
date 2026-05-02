from dataclasses import dataclass
from typing import Optional, Dict, Any
from app.domain.entities import Document, Frontmatter
from app.domain.repositories import DocumentRepository


@dataclass
class UpdateDocumentInput:
    document_id: int
    title: Optional[str] = None
    content: Optional[str] = None
    frontmatter: Optional[Dict[str, Any]] = None


@dataclass
class UpdateDocumentOutput:
    document: Document


class UpdateDocument:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    async def execute(self, input_data: UpdateDocumentInput) -> UpdateDocumentOutput:
        document = await self.document_repository.get_by_id(input_data.document_id)
        if not document:
            raise ValueError(f"Document {input_data.document_id} not found")

        if input_data.title is not None:
            document.title = input_data.title

        if input_data.content is not None:
            document.content = input_data.content

        if input_data.frontmatter is not None:
            for key, value in input_data.frontmatter.items():
                if hasattr(document.frontmatter, key):
                    setattr(document.frontmatter, key, value)

        saved_document = await self.document_repository.save(document)

        return UpdateDocumentOutput(document=saved_document)