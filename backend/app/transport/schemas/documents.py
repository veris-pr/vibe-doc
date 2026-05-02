from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class CreateDocumentRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=200)
    path: str = Field(..., min_length=1, max_length=500)
    content: str = ""
    ordering: int = 0
    parent_id: Optional[int] = None


class UpdateDocumentRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    frontmatter: Optional[Dict[str, Any]] = None


class DocumentResponse(BaseModel):
    id: int
    project_id: int
    version_id: Optional[int]
    title: str
    slug: str
    path: str
    content: str
    ordering: int
    parent_id: Optional[int]

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]