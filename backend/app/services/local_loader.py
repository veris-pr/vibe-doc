import os
import asyncio
from pathlib import Path
from typing import Optional
from dataclasses import dataclass

from app.services.mdx_parser import MDXParser, parse_mdx


@dataclass
class LocalFolderLoader:
    folder_path: str
    
    def scan(self) -> list[dict]:
        """Scan folder for MDX/MD files"""
        docs = []
        path = Path(self.folder_path)
        
        if not path.exists():
            return []
        
        for file_path in path.rglob("*.md"):
            relative = file_path.relative_to(path)
            content = file_path.read_text(encoding='utf-8')
            
            parsed = parse_mdx(content, str(relative))
            
            docs.append({
                'title': parsed.frontmatter.title or file_path.stem.replace('-', ' ').title(),
                'slug': parsed.slug or file_path.stem,
                'path': str(relative),
                'content': content,
                'order': parsed.frontmatter.order
            })
        
        for file_path in path.rglob("*.mdx"):
            relative = file_path.relative_to(path)
            content = file_path.read_text(encoding='utf-8')
            
            parsed = parse_mdx(content, str(relative))
            
            docs.append({
                'title': parsed.frontmatter.title or file_path.stem.replace('-', ' ').title(),
                'slug': parsed.slug or file_path.stem,
                'path': str(relative),
                'content': content,
                'order': parsed.frontmatter.order
            })
        
        return sorted(docs, key=lambda d: d.get('order', 0))


def load_from_folder(folder_path: str) -> list[dict]:
    """Convenience function to load docs from a local folder"""
    loader = LocalFolderLoader(folder_path)
    return loader.scan()


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        docs = load_from_folder(sys.argv[1])
        print(f"Found {len(docs)} documents:")
        for doc in docs:
            print(f"  - {doc['title']} ({doc['slug']})")