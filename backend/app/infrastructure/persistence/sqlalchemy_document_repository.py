from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.domain.entities import Document, Frontmatter
from app.domain.repositories import DocumentRepository as DocumentRepositoryContract
from app.domain.value_objects import Timestamp
from app.models import Document as DocumentModel


class SQLAlchemyDocumentRepository(DocumentRepositoryContract):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _map_to_domain(self, model: DocumentModel) -> Document:
        fm = Frontmatter(
            title=model.frontmatter.get("title", "") if model.frontmatter else "",
            description=model.frontmatter.get("description", "") if model.frontmatter else "",
            order=model.frontmatter.get("order", 0) if model.frontmatter else 0,
            slug=model.frontmatter.get("slug", "") if model.frontmatter else "",
            hidden=model.frontmatter.get("hidden", False) if model.frontmatter else False,
            metadata=model.frontmatter if model.frontmatter else {},
        )
        return Document(
            id=model.id,
            project_id=model.project_id,
            version_id=model.version_id,
            title=model.title,
            slug=model.slug,
            path=model.path,
            content=model.content or "",
            frontmatter=fm,
            ordering=model.ordering,
            parent_id=model.parent_id,
            timestamp=Timestamp(
                created_at=model.created_at,
                updated_at=model.updated_at,
            ),
        )

    async def get_by_id(self, document_id: int) -> Optional[Document]:
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.id == document_id)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_slug(self, project_id: int, slug: str) -> Optional[Document]:
        result = await self.session.execute(
            select(DocumentModel).where(
                DocumentModel.project_id == project_id,
                DocumentModel.slug == slug
            )
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_path(self, project_id: int, path: str) -> Optional[Document]:
        result = await self.session.execute(
            select(DocumentModel).where(
                DocumentModel.project_id == project_id,
                DocumentModel.path == path
            )
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def save(self, document: Document) -> Document:
        frontmatter = {
            "title": document.frontmatter.title,
            "description": document.frontmatter.description,
            "order": document.frontmatter.order,
            "slug": document.frontmatter.slug,
            "hidden": document.frontmatter.hidden,
            **document.frontmatter.metadata,
        }
        
        if document.id == 0:
            model = DocumentModel(
                project_id=document.project_id,
                version_id=document.version_id,
                title=document.title,
                slug=document.slug,
                path=document.path,
                content=document.content,
                frontmatter=frontmatter,
                ordering=document.ordering,
                parent_id=document.parent_id,
            )
            self.session.add(model)
            await self.session.flush()
            await self.session.refresh(model)
            document.id = model.id
        else:
            result = await self.session.execute(
                select(DocumentModel).where(DocumentModel.id == document.id)
            )
            model = result.scalar_one()
            model.title = document.title
            model.slug = document.slug
            model.path = document.path
            model.content = document.content
            model.frontmatter = frontmatter
            model.ordering = document.ordering
            model.parent_id = document.parent_id
        return document

    async def delete(self, document_id: int) -> None:
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.id == document_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self.session.delete(model)

    async def list_all(self) -> List[Document]:
        result = await self.session.execute(select(DocumentModel))
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def list_by_project(self, project_id: int) -> List[Document]:
        result = await self.session.execute(
            select(DocumentModel)
            .where(DocumentModel.project_id == project_id)
            .order_by(DocumentModel.ordering)
        )
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def list_by_version(self, version_id: int) -> List[Document]:
        result = await self.session.execute(
            select(DocumentModel)
            .where(DocumentModel.version_id == version_id)
            .order_by(DocumentModel.ordering)
        )
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def list_by_parent(self, project_id: int, parent_id: Optional[int]) -> List[Document]:
        if parent_id is None:
            result = await self.session.execute(
                select(DocumentModel)
                .where(
                    DocumentModel.project_id == project_id,
                    DocumentModel.parent_id.is_(None)
                )
                .order_by(DocumentModel.ordering)
            )
        else:
            result = await self.session.execute(
                select(DocumentModel)
                .where(
                    DocumentModel.project_id == project_id,
                    DocumentModel.parent_id == parent_id
                )
                .order_by(DocumentModel.ordering)
            )
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def search(self, project_id: int, query: str) -> List[Document]:
        result = await self.session.execute(
            select(DocumentModel)
            .where(
                DocumentModel.project_id == project_id,
                DocumentModel.title.ilike(f"%{query}%")
            )
        )
        return [self._map_to_domain(m) for m in result.scalars().all()]