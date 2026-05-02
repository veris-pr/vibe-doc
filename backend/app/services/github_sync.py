import os
import shutil
import hashlib
import asyncio
from typing import Optional
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import settings
from app.models import Project, Document, Version, Organization, OrganizationMember, User


@dataclass
class SyncResult:
    success: bool
    files_added: int = 0
    files_updated: int = 0
    files_deleted: int = 0
    errors: list[str] = field(default_factory=list)


@dataclass
class WebhookEvent:
    event_type: str
    delivery: str
    payload: dict


class GitHubSync:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repos_dir = Path("/tmp/opendoc-repos")
        self.repos_dir.mkdir(exist_ok=True)

    def verify_webhook_signature(self, payload: bytes, signature: str, secret: str) -> bool:
        if not signature or not secret:
            return False
        import hmac
        expected = hmac.new(
            secret.encode(),
            payload,
            'sha256'
        ).hexdigest()
        return hmac.compare_digest(f"sha256={expected}", signature)

    def parse_webhook(self, event_type: str, payload: dict) -> Optional[WebhookEvent]:
        return WebhookEvent(
            event_type=event_type,
            delivery=payload.get('delivery', ''),
            payload=payload
        )

    async def get_repo_contents(self, owner: str, repo: str, branch: str, token: str, path: str = "") -> list[dict]:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        params = {"ref": branch}
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params, headers=headers)
            if response.status_code != 200:
                return []
            return response.json()

    async def download_file(self, owner: str, repo: str, branch: str, file_path: str, token: str) -> Optional[str]:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{file_path}"
        params = {"ref": branch}
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3.raw"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params, headers=headers)
            if response.status_code == 200:
                return response.text
            return None

    def get_repo_path(self, project_id: int) -> Path:
        return self.repos_dir / f"project_{project_id}"

    async def clone_repo(self, project: Project, branch: str) -> SyncResult:
        result = SyncResult(success=False)
        
        if not project.github_repo or not project.organization:
            result.errors.append("Project has no GitHub repository configured")
            return result
        
        repo_path = self.get_repo_path(project.id)
        repo_path.mkdir(exist_ok=True)
        
        owner, repo_name = project.github_repo.split('/')
        if not repo_name:
            result.errors.append("Invalid repository format")
            return result
        
        user_result = await self.db.execute(
            select(Project)
            .options(
                selectinload(Project.organization)
                .selectinload(Organization.members)
                .selectinload(OrganizationMember.user)
            )
            .where(Project.id == project.id)
        )
        project = user_result.scalar_one_or_none()
        
        if not project or not project.organization or not project.organization.members:
            result.errors.append("No GitHub access token found")
            return result
        
        token = project.organization.members[0].user.github_access_token
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                archive_url = f"https://api.github.com/repos/{owner}/{repo_name}/zipball/{branch}"
                headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
                
                response = await client.get(archive_url, headers=headers)
                if response.status_code != 200:
                    result.errors.append(f"Failed to download repo: {response.status_code}")
                    return result
                
                import zipfile
                import io
                
                with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
                    members = zf.namelist()
                    if not members:
                        result.errors.append("Empty archive")
                        return result
                    
                    common_prefix = members[0].split('/')[0]
                    
                    for name in members:
                        if name.startswith(common_prefix + '/'):
                            target_name = name[len(common_prefix)+1:]
                            if not target_name:
                                continue
                            
                            if target_name.startswith('..') or '/' not in target_name.replace(target_name.split('/')[0], '', 1):
                                continue
                            
                            target_path = repo_path / target_name
                            
                            if name.endswith('/'):
                                target_path.mkdir(parents=True, exist_ok=True)
                            else:
                                target_path.parent.mkdir(parents=True, exist_ok=True)
                                with zf.open(name) as src, open(target_path, 'wb') as dst:
                                    dst.write(src.read())
                
                result.success = True
                result.files_added = len(list(repo_path.rglob("*.md"))) + len(list(repo_path.rglob("*.mdx")))
                
        except Exception as e:
            result.errors.append(f"Clone failed: {str(e)}")
        
        return result

    async def sync_project(self, project_id: int) -> SyncResult:
        result = SyncResult(success=False)
        
        project_result = await self.db.execute(
            select(Project)
            .options()
            .where(Project.id == project_id)
        )
        project = project_result.scalar_one_or_none()
        
        if not project:
            result.errors.append("Project not found")
            return result
        
        branch = project.github_branch or "main"
        clone_result = await self.clone_repo(project, branch)
        
        if not clone_result.success:
            return clone_result
        
        repo_path = self.get_repo_path(project.id)
        md_files = list(repo_path.glob("**/*.md")) + list(repo_path.glob("**/*.mdx"))
        
        for md_file in md_files:
            relative_path = str(md_file.relative_to(repo_path))
            content = md_file.read_text(encoding='utf-8')
            
            from app.services.mdx_parser import parse_mdx
            parsed = parse_mdx(content, relative_path)
            
            existing = await self.db.execute(
                select(Document)
                .where(
                    Document.project_id == project_id,
                    Document.path == relative_path
                )
            )
            doc = existing.scalar_one_or_none()
            
            if doc:
                if doc.content != content:
                    doc.content = content
                    doc.title = parsed.frontmatter.title
                    doc.frontmatter = {
                        'title': parsed.frontmatter.title,
                        'description': parsed.frontmatter.description,
                        'order': parsed.frontmatter.order
                    }
                    result.files_updated += 1
            else:
                doc = Document(
                    project_id=project_id,
                    title=parsed.frontmatter.title,
                    slug=parsed.slug,
                    path=relative_path,
                    content=content,
                    frontmatter={
                        'title': parsed.frontmatter.title,
                        'description': parsed.frontmatter.description,
                        'order': parsed.frontmatter.order
                    }
                )
                self.db.add(doc)
                result.files_added += 1
        
        await self.db.commit()
        result.success = True
        return result

    def cleanup_repo(self, project_id: int):
        repo_path = self.get_repo_path(project_id)
        if repo_path.exists():
            shutil.rmtree(repo_path)


async def handle_push_event(db: AsyncSession, project_id: int, payload: dict) -> SyncResult:
    sync = GitHubSync(db)
    return await sync.sync_project(project_id)