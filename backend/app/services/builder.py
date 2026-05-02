import os
import re
import json
import shutil
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field
from datetime import datetime

from jinja2 import Environment, FileSystemLoader, select_autoescape, Markup

from app.services.mdx_parser import MDXParser, ParsedDocument, NavigationItem


CODE_BLOCK_PATTERN = re.compile(r'```(\w+)?\n(.*?)```', re.DOTALL)
INLINE_CODE_PATTERN = re.compile(r'`([^`]+)`')
LINK_PATTERN = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
HEADING_PATTERN = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)


@dataclass
class BuildResult:
    success: bool
    pages_built: int = 0
    errors: list[str] = field(default_factory=list)
    output_dir: str = ""


class MarkdownRenderer:
    def __init__(self):
        self.parser = MDXParser()
    
    def escape_html(self, text: str) -> str:
        text = text.replace('&', '&amp;')
        text = text.replace('<', '&lt;')
        text = text.replace('>', '&gt;')
        text = text.replace('"', '&quot;')
        return text

    def render_code_block(self, match) -> str:
        lang = match.group(1) or 'text'
        code = match.group(2)
        code = self.escape_html(code)
        return f'<pre class="code-block" data-language="{lang}"><code>{code}</code></pre>'

    def render_inline_code(self, match) -> str:
        code = self.escape_html(match.group(1))
        return f'<code class="inline-code">{code}</code>'

    def render_link(self, match) -> str:
        text = match.group(1)
        href = match.group(2)
        if href.startswith('http'):
            return f'<a href="{href}" target="_blank" rel="noopener">{text}</a>'
        return f'<a href="{href}">{text}</a>'

    def render_heading(self, match) -> str:
        level = len(match.group(1))
        text = match.group(2).strip()
        anchor = text.lower().replace(' ', '-')
        anchor = re.sub(r'[^\w-]', '', anchor)
        return f'<h{level} id="{anchor}">{text}</h{level}>'

    def render_callout(self, content: str) -> str:
        info_match = re.search(r'\[!NOTE\](.*?)(?=\n\n|\n\[!|$)', content, re.DOTALL)
        warning_match = re.search(r'\[!WARNING\]\s*\n(.*?)(?=\n\n|\n\[!|$)', content, re.DOTALL)
        
        if info_match:
            text = info_match.group(1).strip()
            return f'<div class="callout callout-info"><strong>Note:</strong> {text}</div>'
        elif warning_match:
            text = warning_match.group(1).strip()
            return f'<div class="callout callout-warning"><strong>Warning:</strong> {text}</div>'
        
        return content

    def render(self, markdown: str) -> str:
        html = markdown
        
        html = self.render_callout(html)
        html = CODE_BLOCK_PATTERN.sub(self.render_code_block, html)
        html = INLINE_CODE_PATTERN.sub(self.render_inline_code, html)
        html = LINK_PATTERN.sub(self.render_link, html)
        html = HEADING_PATTERN.sub(self.render_heading, html)
        
        html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
        
        html = re.sub(r'^>\s+(.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
        
        html = re.sub(r'^\d+\.\s+(.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
        
        html = re.sub(r'^-\s+(.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
        
        html = re.sub(r'\n\n+', '\n\n', html)
        html = re.sub(r'(<li>.*</li>)', r'<ul>\1</ul>', html)
        
        html = re.sub(r'---', '<hr>', html)
        
        return html


class StaticSiteGenerator:
    def __init__(self, output_dir: str = "/tmp/opendoc-build"):
        self.output_dir = Path(output_dir)
        self.renderer = MarkdownRenderer()
        self.env = Environment(
            loader=FileSystemLoader("/app/templates"),
            autoescape=select_autoescape(['html', 'xml'])
        )
        
        self._setup_filters()

    def _setup_filters(self):
        self.env.filters['json'] = json.dumps

    def generate_navigation(self, docs: list[ParsedDocument]) -> list[dict]:
        nav_map = {}
        
        for doc in docs:
            if doc.frontmatter.hidden:
                continue
            
            path_parts = doc.path.replace('\\', '/').split('/')
            
            if len(path_parts) == 1:
                nav_map[doc.slug] = {
                    'title': doc.frontmatter.title,
                    'slug': doc.slug,
                    'path': doc.slug + '.html',
                    'order': doc.frontmatter.order,
                    'children': []
                }
            else:
                section = path_parts[0]
                if section not in nav_map:
                    nav_map[section] = {
                        'title': section.replace('-', ' ').title(),
                        'slug': section,
                        'path': section + '/',
                        'order': 0,
                        'children': []
                    }
                
                nav_map[section]['children'].append({
                    'title': doc.frontmatter.title,
                    'slug': doc.slug,
                    'path': f"{section}/{doc.slug}.html",
                    'order': doc.frontmatter.order,
                    'children': []
                })
        
        result = list(nav_map.values())
        for item in result:
            item['children'].sort(key=lambda x: x.get('order', 0))
        return sorted(result, key=lambda x: x.get('order', 0))

    def generate_toc(self, content: str) -> list[dict]:
        toc = []
        for match in HEADING_PATTERN.finditer(content):
            level = len(match.group(1))
            text = match.group(2).strip()
            anchor = text.lower().replace(' ', '-')
            anchor = re.sub(r'[^\w-]', '', anchor)
            if level <= 3:
                toc.append({'level': level, 'text': text, 'anchor': anchor})
        return toc

    def generate_search_index(self, docs: list[ParsedDocument]) -> list[dict]:
        index = []
        for doc in docs:
            index.append({
                'title': doc.frontmatter.title,
                'description': doc.frontmatter.description,
                'slug': doc.slug,
                'path': doc.slug + '.html',
                'content': doc.content[:500]
            })
        return index

    def render_document(self, doc: ParsedDocument, all_docs: list[ParsedDocument], navigation: list[dict]) -> str:
        content_html = self.renderer.render(doc.content)
        toc = self.generate_toc(doc.content)
        
        try:
            template = self.env.get_template('document.html')
        except:
            template_content = self._get_default_template()
            template = self.env.from_string(template_content)
        
        prev_doc = None
        next_doc = None
        all_slugs = [d.slug for d in all_docs]
        current_idx = all_slugs.index(doc.slug) if doc.slug in all_slugs else -1
        
        if current_idx > 0:
            prev_doc = all_docs[current_idx - 1]
        if current_idx >= 0 and current_idx < len(all_docs) - 1:
            next_doc = all_docs[current_idx + 1]
        
        return template.render(
            title=doc.frontmatter.title,
            description=doc.frontmatter.description,
            content=Markup(content_html),
            navigation=navigation,
            toc=toc,
            prev_page=prev_doc.slug + '.html' if prev_doc else None,
            prev_title=prev_doc.frontmatter.title if prev_doc else None,
            next_page=next_doc.slug + '.html' if next_doc else None,
            next_title=next_doc.frontmatter.title if next_doc else None,
            project_name="Documentation",
            current_year=datetime.now().year
        )

    def _get_default_template(self) -> str:
        return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} - {{ project_name }}</title>
    <meta name="description" content="{{ description }}">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self';">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <link rel="stylesheet" href="/assets/styles.css">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <header class="docs-header">
        <div class="header-content">
            <a href="/" class="logo">{{ project_name }}</a>
            <div class="header-right">
                <button class="search-trigger" onclick="openSearch()">
                    <span>Search...</span>
                    <kbd>⌘K</kbd>
                </button>
            </div>
        </div>
    </header>
    
    <div class="docs-body">
        <aside class="docs-sidebar">
            <nav class="sidebar-nav">
                {% for item in navigation %}
                <div class="nav-section">
                    <h4>{{ item.title }}</h4>
                    {% for child in item.children %}
                    <a href="/{{ child.path }}" class="nav-link">{{ child.title }}</a>
                    {% endfor %}
                </div>
                {% endfor %}
            </nav>
        </aside>
        
        <main class="docs-content">
            <article class="prose">
                <h1>{{ title }}</h1>
                {{ content }}
            </article>
            
            <footer class="docs-footer">
                <div class="footer-nav">
                    {% if prev_page %}
                    <a href="/{{ prev_page }}">← {{ prev_title }}</a>
                    {% endif %}
                    {% if next_page %}
                    <a href="/{{ next_page }}">{{ next_title }} →</a>
                    {% endif %}
                </div>
            </footer>
        </main>
        
        <aside class="docs-toc">
            <h4>On this page</h4>
            <nav>
                {% for item in toc %}
                <a href="#{{ item.anchor }}" class="toc-link" style="padding-left: {{ (item.level - 1) * 12 }}px">{{ item.text }}</a>
                {% endfor %}
            </nav>
        </aside>
    </div>
    
    <script src="/assets/main.js"></script>
</body>
</html>'''

    def build(self, docs: list[ParsedDocument], project_slug: str) -> BuildResult:
        result = BuildResult(success=False)
        
        project_dir = self.output_dir / project_slug
        assets_dir = project_dir / "assets"
        assets_dir.mkdir(parents=True, exist_ok=True)
        
        navigation = self.generate_navigation(docs)
        
        for doc in docs:
            try:
                html = self.render_document(doc, docs, navigation)
                output_path = project_dir / f"{doc.slug}.html"
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text(html, encoding='utf-8')
                result.pages_built += 1
            except Exception as e:
                result.errors.append(f"Error building {doc.path}: {str(e)}")
        
        try:
            search_index = self.generate_search_index(docs)
            search_path = project_dir / "search-index.json"
            search_path.write_text(json.dumps(search_index, indent=2), encoding='utf-8')
        except Exception as e:
            result.errors.append(f"Error generating search index: {str(e)}")
        
        self._copy_assets(assets_dir)
        
        result.success = True
        result.output_dir = str(project_dir)
        return result

    def _copy_assets(self, assets_dir: Path):
        css_content = '''
:root {
    --color-bg: #ffffff;
    --color-bg-secondary: #f9fafb;
    --color-text: #111827;
    --color-text-secondary: #6b7280;
    --color-border: #e5e7eb;
    --color-primary: #6366f1;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
@media (prefers-color-scheme: dark) {
    :root {
        --color-bg: #0f172a;
        --color-bg-secondary: #1e293b;
        --color-text: #f1f5f9;
        --color-text-secondary: #94a3b8;
        --color-border: #334155;
    }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); line-height: 1.6; }
a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.docs-header { position: sticky; top: 0; height: 60px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; padding: 0 16px; background: var(--color-bg); z-index: 50; }
.docs-header .header-content { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1400px; margin: 0 auto; }
.docs-header .logo { font-weight: 600; font-size: 18px; color: var(--color-text); }
.search-trigger { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-text-secondary); font-size: 14px; }
.search-trigger kbd { font-size: 11px; padding: 2px 6px; background: var(--color-border); border-radius: 4px; }
.docs-body { display: flex; max-width: 1400px; margin: 0 auto; }
.docs-sidebar { width: 260px; border-right: 1px solid var(--color-border); padding: 24px 16px; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
.nav-section { margin-bottom: 24px; }
.nav-section h4 { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 8px; letter-spacing: 0.05em; }
.nav-link { display: block; padding: 6px 12px; font-size: 14px; color: var(--color-text-secondary); border-radius: 6px; }
.nav-link:hover { color: var(--color-text); background: var(--color-bg-secondary); }
.nav-link.active { color: var(--color-primary); background: rgba(99, 102, 241, 0.1); }
.docs-content { flex: 1; padding: 40px 60px; max-width: 800px; }
.prose h1 { font-size: 36px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em; }
.prose h2 { font-size: 24px; font-weight: 600; margin-top: 40px; margin-bottom: 16px; }
.prose h3 { font-size: 20px; font-weight: 600; margin-top: 32px; margin-bottom: 12px; }
.prose p { color: var(--color-text-secondary); font-size: 16px; line-height: 1.7; margin-bottom: 16px; }
.prose li { margin-bottom: 8px; color: var(--color-text-secondary); }
.prose code.inline-code { background: var(--color-bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 14px; }
.prose pre.code-block { background: #1e293b; border-radius: 8px; padding: 20px; overflow-x: auto; margin: 20px 0; }
.prose pre code { font-family: var(--font-mono); font-size: 14px; color: #e2e8f0; }
.prose blockquote { border-left: 4px solid var(--color-primary); padding-left: 16px; margin: 16px 0; color: var(--color-text-secondary); }
.prose hr { border: none; border-top: 1px solid var(--color-border); margin: 32px 0; }
.docs-toc { width: 220px; padding: 24px 16px; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
.docs-toc h4 { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 12px; }
.docs-toc nav { display: flex; flex-direction: column; gap: 8px; }
.docs-toc a { font-size: 13px; color: var(--color-text-secondary); text-decoration: none; }
.docs-footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid var(--color-border); }
.footer-nav { display: flex; justify-content: space-between; }
.callout { padding: 16px 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid; }
.callout-info { background: rgba(99, 102, 241, 0.1); border-color: var(--color-primary); }
.callout-warning { background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
@media (max-width: 1024px) { .docs-toc { display: none; } }
@media (max-width: 768px) { .docs-sidebar { display: none; } .docs-content { padding: 24px; } }
'''
        
        js_content = '''
function openSearch() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-box" onclick="event.stopPropagation()">
            <input type="text" placeholder="Search documentation..." autofocus>
            <div class="search-results"></div>
            <div class="search-footer">
                <kbd>↑</kbd><kbd>↓</kbd> navigate
                <kbd>↵</kbd> select
                <kbd>esc</kbd> close
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', () => modal.remove());
    document.querySelector('.search-box input').focus();
}
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
});
'''
        
        (assets_dir / "styles.css").write_text(css_content)
        (assets_dir / "main.js").write_text(js_content)
        
        favicon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366f1"/><path d="M8 10h16M8 16h16M8 22h10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'''
        (assets_dir.parent / "favicon.ico").write_text(favicon_svg)


async def build_project(db, project_id: int) -> BuildResult:
    from sqlalchemy import select
    from app.models import Document, Project
    
    project_result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        return BuildResult(success=False, errors=["Project not found"])
    
    docs_result = await db.execute(
        select(Document).where(Document.project_id == project_id)
    )
    docs = docs_result.scalars().all()
    
    parser = MDXParser()
    parsed_docs = []
    for doc in docs:
        parsed = parser.parse(doc.content or "", doc.path)
        parsed.frontmatter.title = doc.title
        parsed_docs.append(parsed)
    
    ssg = StaticSiteGenerator()
    return ssg.build(parsed_docs, project.slug)