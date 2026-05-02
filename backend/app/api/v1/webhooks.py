from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Project
from app.services.github_sync import handle_push_event

router = APIRouter()


class WebhookPayload(BaseModel):
    project_id: int
    action: str = "push"


@router.post("/github")
async def github_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    event_type = request.headers.get("X-GitHub-Event", "")
    signature = request.headers.get("X-Hub-Signature-256", "")
    delivery = request.headers.get("X-GitHub-Delivery", "")
    
    body = await request.body()
    payload = await request.json() if body else {}
    
    if event_type == "ping":
        return {"event": "ping", "delivery": delivery}
    
    if event_type != "push":
        return {"event": event_type, "message": "ignored"}
    
    repo_name = payload.get("repository", {}).get("full_name", "")
    
    project_result = await db.execute(
        select(Project).where(Project.github_repo == repo_name)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found for this repository")
    
    background_tasks.add_task(handle_push_event, db, project.id, payload)
    
    return {"event": "push", "delivery": delivery, "status": "processing"}