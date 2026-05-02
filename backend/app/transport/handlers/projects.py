from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.domain.repositories import ProjectRepository, UserRepository
from app.infrastructure import SQLAlchemyProjectRepository, SQLAlchemyUserRepository
from app.application.use_cases import (
    CreateProject,
    CreateProjectInput,
)
from app.transport.schemas import CreateProjectRequest, ProjectResponse, ProjectListResponse


async def get_project_repository(session: AsyncSession) -> ProjectRepository:
    return SQLAlchemyProjectRepository(session)


async def get_user_repository(session: AsyncSession) -> UserRepository:
    return SQLAlchemyUserRepository(session)


class ProjectHandlers:
    def __init__(
        self,
        project_repository: ProjectRepository,
        user_repository: UserRepository,
    ):
        self.project_repository = project_repository
        self.user_repository = user_repository

    async def create_project(
        self,
        request: CreateProjectRequest,
        organization_id: int,
        current_user_id: int,
    ) -> ProjectResponse:
        use_case = CreateProject(
            project_repository=self.project_repository,
            user_repository=self.user_repository,
        )

        input_data = CreateProjectInput(
            organization_id=organization_id,
            name=request.name,
            slug=request.slug,
            description=request.description,
            github_repo=request.github_repo,
            is_public=request.is_public,
        )

        try:
            result = await use_case.execute(input_data, current_user_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return ProjectResponse(
            id=result.project.id,
            name=result.project.name,
            slug=str(result.project.slug),
            description=result.project.description,
            logo_url=result.project.logo_url,
            primary_color=result.project.primary_color,
            github_repo=result.project.github_repo,
            github_branch=result.project.github_branch,
            custom_domain=result.project.custom_domain,
            is_public=result.project.is_public,
        )

    async def list_projects(self, organization_id: int) -> ProjectListResponse:
        projects = await self.project_repository.list_by_organization(organization_id)
        return ProjectListResponse(
            projects=[
                ProjectResponse(
                    id=p.id,
                    name=p.name,
                    slug=str(p.slug),
                    description=p.description,
                    logo_url=p.logo_url,
                    primary_color=p.primary_color,
                    github_repo=p.github_repo,
                    github_branch=p.github_branch,
                    custom_domain=p.custom_domain,
                    is_public=p.is_public,
                )
                for p in projects
            ]
        )


async def get_project_handlers(
    project_repo: ProjectRepository = Depends(get_project_repository),
    user_repo: UserRepository = Depends(get_user_repository),
) -> ProjectHandlers:
    return ProjectHandlers(project_repo, user_repo)