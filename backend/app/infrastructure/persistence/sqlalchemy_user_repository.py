from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.domain.entities import User
from app.domain.repositories import UserRepository as UserRepositoryContract
from app.domain.value_objects import Timestamp
from app.models import User as UserModel


class SQLAlchemyUserRepository(UserRepositoryContract):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _map_to_domain(self, model: UserModel) -> User:
        return User(
            id=model.id,
            email=model.email,
            username=model.username,
            github_id=model.github_id,
            avatar_url=model.avatar_url,
            timestamp=Timestamp(
                created_at=model.created_at,
                updated_at=model.updated_at,
            ),
        )

    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.username == username)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def get_by_github_id(self, github_id: str) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.github_id == github_id)
        )
        model = result.scalar_one_or_none()
        return self._map_to_domain(model) if model else None

    async def save(self, user: User) -> User:
        if user.id == 0:
            model = UserModel(
                email=user.email,
                username=user.username,
                github_id=user.github_id,
                github_access_token=None,
                avatar_url=user.avatar_url,
            )
            self.session.add(model)
            await self.session.flush()
            await self.session.refresh(model)
            user.id = model.id
        else:
            result = await self.session.execute(
                select(UserModel).where(UserModel.id == user.id)
            )
            model = result.scalar_one()
            model.email = user.email
            model.username = user.username
            model.github_id = user.github_id
            model.avatar_url = user.avatar_url
        return user

    async def delete(self, user_id: int) -> None:
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self.session.delete(model)

    async def list_all(self) -> List[User]:
        result = await self.session.execute(select(UserModel))
        return [self._map_to_domain(m) for m in result.scalars().all()]