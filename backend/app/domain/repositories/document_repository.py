from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.entities import Document


class DocumentRepository(ABC):
    @abstractmethod
    def get_by_id(self, document_id: int) -> Optional[Document]:
        pass

    @abstractmethod
    def get_by_slug(self, project_id: int, slug: str) -> Optional[Document]:
        pass

    @abstractmethod
    def get_by_path(self, project_id: int, path: str) -> Optional[Document]:
        pass

    @abstractmethod
    def save(self, document: Document) -> Document:
        pass

    @abstractmethod
    def delete(self, document_id: int) -> None:
        pass

    @abstractmethod
    def list_all(self) -> List[Document]:
        pass

    @abstractmethod
    def list_by_project(self, project_id: int) -> List[Document]:
        pass

    @abstractmethod
    def list_by_version(self, version_id: int) -> List[Document]:
        pass

    @abstractmethod
    def list_by_parent(self, project_id: int, parent_id: Optional[int]) -> List[Document]:
        pass

    @abstractmethod
    def search(self, project_id: int, query: str) -> List[Document]:
        pass