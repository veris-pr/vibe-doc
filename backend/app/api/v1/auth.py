from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import jwt, JWTError
import httpx

from app.database import get_db, settings
from app.models import User, Organization, OrganizationMember

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")


class Token(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: int
    email: Optional[EmailStr]
    username: str
    avatar_url: Optional[str]

    class Config:
        from_attributes = True


class GitHubUser(BaseModel):
    id: int
    login: str
    avatar_url: str
    email: Optional[str] = None


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    organization_id: int = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=1000)
    primary_color: str = Field("#6366f1", pattern=r"^#[0-9a-fA-F]{6}$")


@router.get("/github")
async def github_login():
    client_id = settings.github_client_id
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth not configured"
        )
    
    import secrets
    state = secrets.token_urlsafe(32)
    
    import urllib.parse
    params = {
        "client_id": client_id,
        "redirect_uri": "http://localhost:8000/api/v1/auth/github/callback",
        "scope": "read:user user:email repo",
        "state": state
    }
    url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
    return {"authorization_url": url}


@router.get("/github/callback", response_model=Token)
async def github_callback(code: str, state: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")
    
    if not settings.github_client_id or not settings.github_client_secret:
        raise HTTPException(status_code=503, detail="GitHub OAuth not configured")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                },
                headers={"Accept": "application/json"}
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                error_description = token_data.get("error_description", "No access token received")
                raise HTTPException(status_code=400, detail=error_description)
            
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from GitHub")
            
            gh_user = GitHubUser(**user_response.json())
            
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if email_response.status_code == 200:
                emails = email_response.json()
                primary_email = next((e["email"] for e in emails if e.get("primary")), None)
            else:
                primary_email = None
            
            result = await db.execute(
                select(User).where(User.github_id == str(gh_user.id))
            )
            user = result.scalar_one_or_none()
            
            if not user:
                user = User(
                    github_id=str(gh_user.id),
                    username=gh_user.login,
                    email=primary_email or gh_user.email,
                    avatar_url=gh_user.avatar_url,
                    github_access_token=access_token
                )
                db.add(user)
                await db.flush()
                
                org = Organization(
                    name=f"{gh_user.login}'s Org",
                    slug=f"{gh_user.login}-org"
                )
                db.add(org)
                await db.flush()
                
                org_member = OrganizationMember(
                    organization_id=org.id,
                    user_id=user.id,
                    role="owner"
                )
                db.add(org_member)
                await db.commit()
            else:
                user.github_access_token = access_token
                await db.commit()
            
            jwt_token = create_access_token(data={"sub": str(user.id)})
            return Token(access_token=jwt_token, token_type="bearer")
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail="Failed to connect to GitHub")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.username == form_data.username)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    jwt_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=jwt_token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user