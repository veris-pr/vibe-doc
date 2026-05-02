from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.domain.entities import Project
from app.domain.repositories import ProjectRepository as ProjectRepositoryContract
from app.domain.value_objects import Timestamp, Slug
from app.models import Project as ProjectModel


class SQLAlchemyProjectRepository(ProjectRepositoryContract):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _map_to_domain(self, model: ProjectModel) -> Project:
        return Project(
            id=model.id,
            organization_id=model.organization_id,
            name=model.name,
            slug=Slug(model.slug),
            description=model.description,
            logo_url=model.logo_url,
            primary_color=model.primary_color,
            github_repo=model.github_repo,
            github_branch=model.github_branch,
            custom_domain=model.custom_domain,
            is_public=model.is_public,
            timestamp=Timestamp(
                created_at=model.created_at,
                updated_at=model.updated_at,
            ),
        )

    async def get_by_id(self, project_id: int) -> Optional[Project]:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.id == project_id)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_slug(self, slug: str) -> Optional[Project]:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.slug == slug)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_custom_domain(self, domain: str) -> Optional[Project]:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.custom_domain == domain)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def save(self, project: Project) -> Project:
        if project.id == 0:
            model = ProjectModel(
                organization_id=project.organization_id,
                name=project.name,
                slug=str(project.slug),
                description=project.description,
                logo_url=project.logo_url,
                primary_color=project.primary_color,
                github_repo=project.github_repo,
                github_branch=project.github_branch,
                custom_domain=project.custom_domain,
                is_public=project.is_public,
            )
            self.session.add(model)
            await self.session.flush()
            await self.session.refresh(model)
            project.id = model.id
        else:
            result = await self.session.execute(
                select(ProjectModel).where(ProjectModel.id == project.id)
            )
            model = result.scalar_one()
            model.name = project.name
            model.description = project.description
            model.logo_url = project.logo_url
            model.primary_color = project.primary_color
            model.github_repo = project.github_repo
            model.github_branch = project.github_branch
            model.custom_domain = project.custom_domain
            model.is_public = project.is_public
        return project

    async def delete(self, project_id: int) -> None:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.id == project_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self.session.delete(model)

    async def list_all(self) -> List[Project]:
        result = await self.session.execute(select(ProjectModel))
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def list_by_organization(self, org_id: int) -> List[Project]:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.organization_id == org_id)
        )
        return [self._map_to_domain(m) for m in result.scalars().all()]

    async def list_by_user(self, user_id: int) -> List[Project]:
        from app.models import ProjectMember
        result = await self.session.execute(
            select(ProjectModel)
            .join(ProjectMember, ProjectMember.project_id == ProjectModel.id)
            .where(ProjectMember.user_id == user_id)
        )
        return [self._map_to_domain(m) for m in result.scalars().all()]