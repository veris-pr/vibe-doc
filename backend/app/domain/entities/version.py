from dataclasses import dataclass
from typing import Optional, List
from app.domain.value_objects import Timestamp, VersionInfo


@dataclass
class Version:
    id: int
    project_id: int
    name: str
    branch: Optional[str]
    is_default: bool
    timestamp: Timestamp
    documents: List["Document"] = None

    def __post_init__(self):
        if self.documents is None:
            self.documents = []

    @staticmethod
    def create(
        project_id: int,
        name: str,
        branch: Optional[str] = None,
        is_default: bool = False,
    ) -> "Version":
        return Version(
            id=0,
            project_id=project_id,
            name=name,
            branch=branch,
            is_default=is_default,
            timestamp=Timestamp.now(),
            documents=[],
        )

    def set_default(self) -> None:
        self.is_default = True

    def get_version_info(self) -> VersionInfo:
        return VersionInfo.from_string(self.name)