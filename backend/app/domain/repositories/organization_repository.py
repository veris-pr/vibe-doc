from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.entities import Organization


class OrganizationRepository(ABC):
    @abstractmethod
    def get_by_id(self, org_id: int) -> Optional[Organization]:
        pass

    @abstractmethod
    def get_by_slug(self, slug: str) -> Optional[Organization]:
        pass

    @abstractmethod
    def save(self, organization: Organization) -> Organization:
        pass

    @abstractmethod
    def delete(self, org_id: int) -> None:
        pass

    @abstractmethod
    def list_all(self) -> List[Organization]:
        pass

    @abstractmethod
    def list_by_user(self, user_id: int) -> List[Organization]:
        pass