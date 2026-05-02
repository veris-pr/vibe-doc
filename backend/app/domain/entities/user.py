from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from app.domain.value_objects import Timestamp, Slug


class UserRole:
    OWNER = "owner"
    MEMBER = "member"


@dataclass
class User:
    id: int
    email: Optional[str]
    username: str
    github_id: Optional[str]
    avatar_url: Optional[str]
    timestamp: Timestamp

    @staticmethod
    def create(
        username: str,
        email: Optional[str] = None,
        github_id: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> "User":
        return User(
            id=0,
            email=email,
            username=username,
            github_id=github_id,
            avatar_url=avatar_url,
            timestamp=Timestamp.now(),
        )

    def update_profile(
        self,
        email: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> None:
        if email is not None:
            self.email = email
        if avatar_url is not None:
            self.avatar_url = avatar_url

    def link_github(self, github_id: str, access_token: str) -> None:
        self.github_id = github_id

    @property
    def display_name(self) -> str:
        return self.username