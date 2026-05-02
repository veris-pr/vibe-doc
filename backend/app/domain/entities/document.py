from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from app.domain.value_objects import Timestamp


@dataclass
class Frontmatter:
    title: str = ""
    description: str = ""
    order: int = 0
    slug: str = ""
    hidden: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Document:
    id: int
    project_id: int
    version_id: Optional[int]
    title: str
    slug: str
    path: str
    content: str
    frontmatter: Frontmatter
    ordering: int
    parent_id: Optional[int]
    timestamp: Timestamp
    children: List["Document"] = field(default_factory=list)

    @staticmethod
    def create(
        project_id: int,
        title: str,
        slug: str,
        path: str,
        content: str = "",
        ordering: int = 0,
        parent_id: Optional[int] = None,
    ) -> "Document":
        return Document(
            id=0,
            project_id=project_id,
            version_id=None,
            title=title,
            slug=slug,
            path=path,
            content=content,
            frontmatter=Frontmatter(title=title, slug=slug),
            ordering=ordering,
            parent_id=parent_id,
            timestamp=Timestamp.now(),
            children=[],
        )

    def update_content(self, content: str, title: Optional[str] = None) -> None:
        self.content = content
        if title is not None:
            self.title = title
            self.frontmatter.title = title

    def update_frontmatter(self, **kwargs) -> None:
        for key, value in kwargs.items():
            if hasattr(self.frontmatter, key):
                setattr(self.frontmatter, key, value)

    def reorder(self, new_ordering: int) -> None:
        self.ordering = new_ordering

    def move_to_parent(self, new_parent_id: Optional[int]) -> None:
        self.parent_id = new_parent_id

    def is_hidden(self) -> bool:
        return self.frontmatter.hidden

    def get_headings(self) -> List[Dict[str, Any]]:
        headings = []
        lines = self.content.split("\n")
        for line in lines:
            if line.startswith("#"):
                level = len(line) - len(line.lstrip("#"))
                text = line.lstrip("#").strip()
                anchor = text.lower().replace(" ", "-")
                headings.append({"level": level, "text": text, "anchor": anchor})
        return headings