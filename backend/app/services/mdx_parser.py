import os
import re
from typing import Optional
from dataclasses import dataclass, field
from pathlib import Path


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max file size
MAX_CONTENT_SIZE = 5 * 1024 * 1024  # 5MB max content after frontmatter


class ContentSizeError(Exception):
    pass


class InvalidContentError(Exception):
    pass


@dataclass
class Frontmatter:
    title: str = ""
    description: str = ""
    order: int = 0
    slug: str = ""
    hidden: bool = False


@dataclass
class ParsedDocument:
    frontmatter: Frontmatter
    content: str
    path: str
    slug: str


@dataclass 
class NavigationItem:
    title: str
    slug: str
    path: str
    order: int = 0
    children: list = field(default_factory=list)


class MDXParser:
    FRONTMATTER_REGEX = re.compile(r'^---\s*\n(.*?)\n---\s*\n(.*)$', re.DOTALL)
    HEADING_REGEX = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
    CODE_BLOCK_REGEX = re.compile(r'```(\w+)?\n(.*?)```', re.DOTALL)
    COMPONENT_REGEX = re.compile(r'<(\w+)(?:\s+[^>]*)?>', re.DOTALL)
    
    COMPONENT_MAPPING = {
        'callout': 'div',
        'tabs': 'div',
        'tab': 'div',
        'codegroup': 'div',
        'codeblock': 'pre',
    }

    def parse_frontmatter(self, raw: str) -> tuple[Frontmatter, str]:
        match = self.FRONTMATTER_REGEX.match(raw)
        if not match:
            return Frontmatter(), raw
        
        fm_text, content = match.groups()
        fm = Frontmatter()
        
        for line in fm_text.split('\n'):
            if ':' not in line:
                continue
            key, _, value = line.partition(':')
            key = key.strip().lower()
            value = value.strip()
            
            if key == 'title':
                fm.title = value
            elif key == 'description':
                fm.description = value
            elif key == 'order':
                try:
                    fm.order = int(value)
                except ValueError:
                    pass
            elif key == 'slug':
                fm.slug = value
            elif key == 'hidden':
                fm.hidden = value.lower() == 'true'
        
        return fm, content

    def extract_headings(self, content: str) -> list[dict]:
        headings = []
        for match in self.HEADING_REGEX.finditer(content):
            level = len(match.group(1))
            text = match.group(2).strip()
            anchor = text.lower().replace(' ', '-')
            anchor = re.sub(r'[^\w-]', '', anchor)
            headings.append({
                'level': level,
                'text': text,
                'anchor': anchor
            })
        return headings

    def extract_code_languages(self, content: str) -> list[str]:
        languages = []
        for match in self.CODE_BLOCK_REGEX.finditer(content):
            lang = match.group(1) or 'text'
            if lang not in languages:
                languages.append(lang)
        return languages

    def generate_navigation(self, docs: list[ParsedDocument]) -> list[NavigationItem]:
        nav_map: dict[str, NavigationItem] = {}
        
        for doc in docs:
            if doc.frontmatter.hidden:
                continue
                
            parts = doc.path.replace('\\', '/').split('/')
            
            if len(parts) == 1:
                item = NavigationItem(
                    title=doc.frontmatter.title or Path(doc.path).stem,
                    slug=doc.slug,
                    path=doc.path,
                    order=doc.frontmatter.order
                )
                nav_map[doc.slug] = item
            else:
                parent_slug = parts[0]
                if parent_slug not in nav_map:
                    nav_map[parent_slug] = NavigationItem(
                        title=parent_slug.title(),
                        slug=parent_slug,
                        path=parent_slug,
                        order=0
                    )
                item = NavigationItem(
                    title=doc.frontmatter.title or Path(doc.path).stem,
                    slug=doc.slug,
                    path=doc.path,
                    order=doc.frontmatter.order
                )
                nav_map[parent_slug].children.append(item)
        
        result = list(nav_map.values())
        for item in result:
            item.children.sort(key=lambda x: x.order)
        return sorted(result, key=lambda x: x.order)

    def parse(self, content: str, path: str) -> ParsedDocument:
        if not content:
            raise InvalidContentError("Content cannot be empty")
        
        if len(content) > MAX_CONTENT_SIZE:
            raise ContentSizeError(f"Content exceeds maximum size of {MAX_CONTENT_SIZE} bytes")
        
        fm, content = self.parse_frontmatter(content)
        
        if not fm.title:
            fm.title = Path(path).stem.replace('-', ' ').title()
        
        slug = fm.slug or Path(path).stem
        
        if not slug or not slug.replace('-', '').replace('_', '').isalnum():
            slug = Path(path).stem
        
        return ParsedDocument(
            frontmatter=fm,
            content=content,
            path=path,
            slug=slug
        )

    def parse_file(self, file_path: str) -> ParsedDocument:
        file_size = os.path.getsize(file_path)
        if file_size > MAX_FILE_SIZE:
            raise ContentSizeError(f"File {file_path} exceeds maximum size of {MAX_FILE_SIZE} bytes")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if len(content) > MAX_CONTENT_SIZE:
            raise ContentSizeError(f"Content in {file_path} exceeds maximum size of {MAX_CONTENT_SIZE} bytes")
        
        return self.parse(content, file_path)

    def parse_directory(self, dir_path: str, extensions: list[str] = ['.md', '.mdx']) -> list[ParsedDocument]:
        docs = []
        for root, _, files in os.walk(dir_path):
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    full_path = os.path.join(root, file)
                    try:
                        doc = self.parse_file(full_path)
                        docs.append(doc)
                    except Exception as e:
                        print(f"Error parsing {full_path}: {e}")
        return docs


def parse_mdx(content: str, path: str) -> ParsedDocument:
    parser = MDXParser()
    return parser.parse(content, path)


def parse_mdx_directory(dir_path: str) -> tuple[list[ParsedDocument], list[NavigationItem]]:
    parser = MDXParser()
    docs = parser.parse_directory(dir_path)
    nav = parser.generate_navigation(docs)
    return docs, nav


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        docs, nav = parse_mdx_directory(sys.argv[1])
        print(f"Parsed {len(docs)} documents")
        for item in nav:
            print(f"  {item.title}: {len(item.children)} children")