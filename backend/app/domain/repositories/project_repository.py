from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.entities import Project


class ProjectRepository(ABC):
    @abstractmethod
    def get_by_id(self, project_id: int) -> Optional[Project]:
        pass

    @abstractmethod
    def get_by_slug(self, slug: str) -> Optional[Project]:
        pass

    @abstractmethod
    def get_by_custom_domain(self, domain: str) -> Optional[Project]:
        pass

    @abstractmethod
    def save(self, project: Project) -> Project:
        pass

    @abstractmethod
    def delete(self, project_id: int) -> None:
        pass

    @abstractmethod
    def list_all(self) -> List[Project]:
        pass

    @abstractmethod
    def list_by_organization(self, org_id: int) -> List[Project]:
        pass

    @abstractmethod
    def list_by_user(self, user_id: int) -> List[Project]:
        pass