from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.entities import Version


class VersionRepository(ABC):
    @abstractmethod
    def get_by_id(self, version_id: int) -> Optional[Version]:
        pass

    @abstractmethod
    def get_by_name(self, project_id: int, name: str) -> Optional[Version]:
        pass

    @abstractmethod
    def get_default(self, project_id: int) -> Optional[Version]:
        pass

    @abstractmethod
    def save(self, version: Version) -> Version:
        pass

    @abstractmethod
    def delete(self, version_id: int) -> None:
        pass

    @abstractmethod
    def list_all(self) -> List[Version]:
        pass

    @abstractmethod
    def list_by_project(self, project_id: int) -> List[Version]:
        pass