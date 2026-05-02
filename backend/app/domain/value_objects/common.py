from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class Timestamp:
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def now() -> "Timestamp":
        now = datetime.utcnow()
        return Timestamp(created_at=now, updated_at=now)


@dataclass(frozen=True)
class VersionInfo:
    major: int
    minor: int
    patch: int

    def __str__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

    @staticmethod
    def from_string(version: str) -> "VersionInfo":
        parts = version.split(".")
        if len(parts) != 3:
            raise ValueError(f"Invalid version format: {version}")
        return VersionInfo(
            major=int(parts[0]),
            minor=int(parts[1]),
            patch=int(parts[2])
        )


@dataclass(frozen=True)
class Slug:
    value: str

    def __post_init__(self):
        if not self.value:
            raise ValueError("Slug cannot be empty")
        if not self.value.replace("-", "_").replace("/", "").isalnum():
            raise ValueError("Slug contains invalid characters")

    def __str__(self) -> str:
        return self.value