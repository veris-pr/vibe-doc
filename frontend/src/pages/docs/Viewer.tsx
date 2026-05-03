import { useState, useEffect } from 'preact/hooks';

interface Document {
  id: number;
  title: string;
  slug: string;
  content: string;
  frontmatter: Record<string, unknown>;
  ordering: number;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export function DocsViewer({ slug }: { slug?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '');
  console.log('DocsViewer projectSlug:', projectSlug);

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoading(true);
        
        console.log('Fetching project:', `/api/v1/projects/slug/${projectSlug}`);
        const projectRes = await fetch(`/api/v1/projects/slug/${projectSlug}`);
        if (!projectRes.ok) {
          throw new Error('Project not found');
        }
        const projectData = await projectRes.json();
        setProject(projectData);

        const docsRes = await fetch(`/api/v1/documents?project_id=${projectData.id}`);
        if (!docsRes.ok) {
          throw new Error('Failed to load documents');
        }
        const docsData = await docsRes.json();
        setDocuments(docsData);
        
        if (docsData.length > 0) {
          setCurrentDoc(docsData[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    
    if (projectSlug) {
      fetchDocs();
    }
  }, [projectSlug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div class="docs-viewer">
        <div class="docs-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="docs-viewer">
        <div class="docs-error">{error}</div>
      </div>
    );
  }

  const sortedDocs = [...documents].sort((a, b) => a.ordering - b.ordering);

  return (
    <div class={`docs-viewer ${darkMode ? 'dark' : ''}`}>
      <header class="docs-header">
        <div class="header-left">
          <button class="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <a href="/" class="docs-logo">{project?.name || 'Docs'}</a>
        </div>
        <div class="header-center">
          <button class="search-trigger">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
        <div class="header-right">
          <button class="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div class="docs-body">
        <aside class={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav class="sidebar-nav">
            {sortedDocs.map(doc => (
              <a 
                key={doc.id} 
                href={`/docs/${projectSlug}/${doc.slug}`}
                class={`nav-link ${currentDoc?.id === doc.id ? 'active' : ''}`}
              >
                {doc.title}
              </a>
            ))}
          </nav>
        </aside>

        <main class="docs-content">
          {currentDoc ? (
            <article class="prose">
              <h1>{currentDoc.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: currentDoc.content }} />
            </article>
          ) : (
            <div class="empty-state">No documents yet</div>
          )}
        </main>
      </div>

      <style>{`
        .docs-viewer {
          min-height: 100vh;
          background: var(--color-bg);
        }
        .docs-loading, .docs-error {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 18px;
          color: var(--color-text-secondary);
        }
        .docs-error {
          color: var(--color-error);
        }
        
        .docs-header {
          position: sticky;
          top: 0;
          height: 60px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: var(--color-bg);
          z-index: 50;
        }
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .menu-toggle, .theme-toggle {
          background: none;
          padding: 8px;
          border-radius: var(--radius-md);
        }
        .menu-toggle:hover, .theme-toggle:hover {
          background: var(--color-bg-secondary);
        }
        .docs-logo {
          font-weight: 600;
          color: var(--color-text);
        }
        .search-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: 14px;
          min-width: 240px;
        }
        .search-trigger kbd {
          margin-left: auto;
          font-size: 11px;
          padding: 2px 6px;
          background: var(--color-border);
          border-radius: 4px;
        }
        
        .docs-body {
          display: flex;
          max-width: 100%;
        }
        
        .docs-sidebar {
          width: 260px;
          border-right: 1px solid var(--color-border);
          padding: 24px 16px;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
          background: var(--color-bg);
        }
        .docs-sidebar:not(.open) {
          display: none;
        }
        
        .nav-link {
          display: block;
          padding: 6px 12px;
          font-size: 14px;
          color: var(--color-text-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
          margin-bottom: 4px;
        }
        .nav-link:hover {
          color: var(--color-text);
          background: var(--color-bg-secondary);
          text-decoration: none;
        }
        .nav-link.active {
          color: var(--color-link);
          background: rgba(0, 114, 245, 0.1);
        }
        
        .docs-content {
          flex: 1;
          padding: 40px 60px;
          max-width: 800px;
          min-width: 0;
        }
        
        .prose h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .prose h2 {
          font-size: 24px;
          font-weight: 600;
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .prose p {
          color: var(--color-text-secondary);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .prose code {
          background: var(--color-bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
        }
        .prose pre {
          background: #1e293b;
          border-radius: var(--radius-lg);
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }
        .prose pre code {
          background: none;
          padding: 0;
          color: #e2e8f0;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px;
          color: var(--color-text-secondary);
        }
        
        @media (max-width: 768px) {
          .docs-sidebar { display: none; }
          .docs-content { padding: 24px; }
          .search-trigger { min-width: auto; }
          .search-trigger span { display: none; }
        }
      `}</style>
    </div>
  );
}