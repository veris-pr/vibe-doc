from dataclasses import dataclass
from typing import Optional, List
from app.domain.value_objects import Timestamp, Slug


class OrganizationRole:
    OWNER = "owner"
    MEMBER = "member"


@dataclass
class OrganizationMember:
    user_id: int
    role: str
    timestamp: Timestamp


@dataclass
class Organization:
    id: int
    name: str
    slug: Slug
    logo_url: Optional[str]
    timestamp: Timestamp
    members: List[OrganizationMember] = None

    def __post_init__(self):
        if self.members is None:
            self.members = []

    @staticmethod
    def create(name: str, slug_value: str, logo_url: Optional[str] = None) -> "Organization":
        return Organization(
            id=0,
            name=name,
            slug=Slug(slug_value),
            logo_url=logo_url,
            timestamp=Timestamp.now(),
            members=[],
        )

    def add_member(self, user_id: int, role: str = OrganizationRole.MEMBER) -> None:
        if any(m.user_id == user_id for m in self.members):
            raise ValueError(f"User {user_id} is already a member")
        self.members.append(
            OrganizationMember(
                user_id=user_id,
                role=role,
                timestamp=Timestamp.now(),
            )
        )

    def remove_member(self, user_id: int) -> None:
        self.members = [m for m in self.members if m.user_id != user_id]

    def is_owner(self, user_id: int) -> bool:
        return any(m.user_id == user_id and m.role == OrganizationRole.OWNER for m in self.members)

    def is_member(self, user_id: int) -> bool:
        return any(m.user_id == user_id for m in self.members)