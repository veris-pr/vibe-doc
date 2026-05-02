from dataclasses import dataclass, field
from typing import Optional, List
from app.domain.value_objects import Timestamp, Slug


class ProjectRole:
    OWNER = "owner"
    EDITOR = "editor"
    VIEWER = "viewer"


@dataclass
class ProjectMember:
    user_id: int
    role: str
    timestamp: Timestamp


@dataclass
class Project:
    id: int
    organization_id: int
    name: str
    slug: Slug
    description: Optional[str]
    logo_url: Optional[str]
    primary_color: str
    github_repo: Optional[str]
    github_branch: str
    custom_domain: Optional[str]
    is_public: bool
    timestamp: Timestamp
    members: List[ProjectMember] = field(default_factory=list)

    @staticmethod
    def create(
        organization_id: int,
        name: str,
        slug_value: str,
        description: Optional[str] = None,
        github_repo: Optional[str] = None,
        is_public: bool = True,
    ) -> "Project":
        return Project(
            id=0,
            organization_id=organization_id,
            name=name,
            slug=Slug(slug_value),
            description=description,
            logo_url=None,
            primary_color="#6366f1",
            github_repo=github_repo,
            github_branch="main",
            custom_domain=None,
            is_public=is_public,
            timestamp=Timestamp.now(),
            members=[],
        )

    def add_member(self, user_id: int, role: str = ProjectRole.VIEWER) -> None:
        if any(m.user_id == user_id for m in self.members):
            raise ValueError(f"User {user_id} is already a member")
        self.members.append(
            ProjectMember(
                user_id=user_id,
                role=role,
                timestamp=Timestamp.now(),
            )
        )

    def remove_member(self, user_id: int) -> None:
        self.members = [m for m in self.members if m.user_id != user_id]

    def update_settings(
        self,
        name: Optional[str] = None,
        description: Optional[str] = None,
        primary_color: Optional[str] = None,
        custom_domain: Optional[str] = None,
        is_public: Optional[bool] = None,
    ) -> None:
        if name is not None:
            self.name = name
        if description is not None:
            self.description = description
        if primary_color is not None:
            self.primary_color = primary_color
        if custom_domain is not None:
            self.custom_domain = custom_domain
        if is_public is not None:
            self.is_public = is_public

    def can_edit(self, user_id: int) -> bool:
        return any(
            m.user_id == user_id and m.role in (ProjectRole.OWNER, ProjectRole.EDITOR)
            for m in self.members
        )

    def can_view(self, user_id: int) -> bool:
        if self.is_public:
            return True
        return any(m.user_id == user_id for m in self.members)