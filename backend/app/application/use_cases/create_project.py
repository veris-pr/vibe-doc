from dataclasses import dataclass
from typing import Optional
from app.domain.entities import Project
from app.domain.repositories import ProjectRepository, UserRepository
from app.domain.value_objects import Slug


@dataclass
class CreateProjectInput:
    organization_id: int
    name: str
    slug: str
    description: Optional[str] = None
    github_repo: Optional[str] = None
    is_public: bool = True


@dataclass
class CreateProjectOutput:
    project: Project


class CreateProject:
    def __init__(
        self,
        project_repository: ProjectRepository,
        user_repository: UserRepository,
    ):
        self.project_repository = project_repository
        self.user_repository = user_repository

    async def execute(self, input_data: CreateProjectInput, actor_id: int) -> CreateProjectOutput:
        user = await self.user_repository.get_by_id(actor_id)
        if not user:
            raise ValueError("User not found")

        existing = await self.project_repository.get_by_slug(input_data.slug)
        if existing:
            raise ValueError(f"Project with slug '{input_data.slug}' already exists")

        project = Project.create(
            organization_id=input_data.organization_id,
            name=input_data.name,
            slug_value=input_data.slug,
            description=input_data.description,
            github_repo=input_data.github_repo,
            is_public=input_data.is_public,
        )

        project.add_member(actor_id, "owner")

        saved_project = await self.project_repository.save(project)

        return CreateProjectOutput(project=saved_project)