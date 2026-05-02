import { useState, useEffect } from 'preact/hooks';

export function DocsViewer({ projectSlug }: { projectSlug: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log('Loading docs for project:', projectSlug);
  }, [projectSlug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div class={`docs-viewer ${darkMode ? 'dark' : ''}`}>
      <header class="docs-header">
        <div class="header-left">
          <button class="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <a href="/" class="docs-logo">Docs</a>
        </div>
        <div class="header-center">
          <button class="search-trigger" onClick={() => setSearchOpen(true)}>
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
          <a href="https://github.com" class="github-link" target="_blank">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </header>

      <div class="docs-body">
        <aside class={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav class="sidebar-nav">
            <div class="nav-section">
              <h4>Getting Started</h4>
              <a href="#" class="nav-link active">Introduction</a>
              <a href="#" class="nav-link">Installation</a>
              <a href="#" class="nav-link">Quick Start</a>
            </div>
            <div class="nav-section">
              <h4>API Reference</h4>
              <a href="#" class="nav-link">Authentication</a>
              <a href="#" class="nav-link">Users</a>
              <a href="#" class="nav-link">Projects</a>
            </div>
          </nav>
        </aside>

        <main class="docs-content">
          <article class="prose">
            <h1>Welcome to OpenDoc</h1>
            <p class="lead">
              Beautiful documentation made easy. OpenDoc helps you create stunning 
              documentation sites with MDX support, API reference docs, and a polished UI.
            </p>

            <h2>Features</h2>
            <ul>
              <li><strong>MDX Support</strong> - Write in Markdown with React components</li>
              <li><strong>API Docs</strong> - Auto-generate from OpenAPI specs</li>
              <li><strong>Search</strong> - Instant Cmd+K search</li>
              <li><strong>Dark Mode</strong> - Automatic theme support</li>
              <li><strong>Self-Hosted</strong> - Full control with Docker</li>
            </ul>

            <h2>Code Example</h2>
            <pre class="code-block"><code><span class="keyword">import</span> {'{ createDocs }'} <span class="keyword">from</span> <span class="string">'opendoc'</span>;

<span class="keyword">const</span> docs = <span class="function">createDocs</span>({'{'}
  title: <span class="string">'My Docs'</span>,
  description: <span class="string">'Documentation for my project'</span>,
  theme: <span class="string">'modern'</span>
{'}'});

<span class="function">await</span> docs.<span class="function">build</span>();</code></pre>

            <div class="callout callout-info">
              <strong>Note:</strong> This is a beautiful callout component that draws attention to important information.
            </div>

            <h2>Next Steps</h2>
            <p>
              Ready to get started? Check out the <a href="#">Installation Guide</a> to set up 
              your first documentation project.
            </p>
          </article>

          <footer class="docs-footer">
            <div class="footer-nav">
              <a href="#" class="prev">← Previous</a>
              <a href="#" class="next">Next →</a>
            </div>
          </footer>
        </main>

        <aside class="docs-toc">
          <h4>On this page</h4>
          <nav>
            <a href="#" class="active">Features</a>
            <a href="#">Code Example</a>
            <a href="#">Next Steps</a>
          </nav>
        </aside>
      </div>

      {searchOpen && (
        <div class="search-modal" onClick={() => setSearchOpen(false)}>
          <div class="search-box" onClick={(e) => e.stopPropagation()}>
            <input type="text" placeholder="Search documentation..." autoFocus />
            <div class="search-results">
              <div class="search-result">
                <span class="result-title">Introduction</span>
                <span class="result-path">Getting Started / Introduction</span>
              </div>
              <div class="search-result">
                <span class="result-title">Installation</span>
                <span class="result-path">Getting Started / Installation</span>
              </div>
            </div>
            <div class="search-footer">
              <kbd>↑</kbd><kbd>↓</kbd> navigate
              <kbd>↵</kbd> select
              <kbd>esc</kbd> close
            </div>
          </div>
        </div>
      )}

      <style>{`
        .docs-viewer {
          min-height: 100vh;
          background: var(--color-bg);
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
        
        .nav-section {
          margin-bottom: 24px;
        }
        .nav-section h4 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .nav-link {
          display: block;
          padding: 6px 12px;
          font-size: 14px;
          color: var(--color-text-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--color-text);
          background: var(--color-bg-secondary);
          text-decoration: none;
        }
        .nav-link.active {
          color: var(--color-primary);
          background: rgba(99, 102, 241, 0.1);
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
          margin-bottom: 16px;
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
        .prose .lead {
          font-size: 20px;
          color: var(--color-text);
        }
        .prose ul {
          margin: 16px 0;
          padding-left: 24px;
        }
        .prose li {
          margin-bottom: 8px;
          color: var(--color-text-secondary);
        }
        .prose li strong {
          color: var(--color-text);
        }
        
        .code-block {
          background: #1e293b;
          border-radius: var(--radius-lg);
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }
        .code-block code {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          color: #e2e8f0;
        }
        .code-block .keyword { color: #c084fc; }
        .code-block .string { color: #86efac; }
        .code-block .function { color: #60a5fa; }
        
        .callout {
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin: 20px 0;
          border-left: 4px solid;
        }
        .callout-info {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--color-primary);
        }
        
        .docs-toc {
          width: 220px;
          padding: 24px 16px;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }
        .docs-toc h4 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }
        .docs-toc nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .docs-toc a {
          font-size: 13px;
          color: var(--color-text-secondary);
          text-decoration: none;
        }
        .docs-toc a:hover, .docs-toc a.active {
          color: var(--color-text);
        }
        
        .docs-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }
        .footer-nav {
          display: flex;
          justify-content: space-between;
        }
        .footer-nav a {
          font-size: 14px;
          color: var(--color-primary);
        }
        
        .search-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          z-index: 200;
          backdrop-filter: blur(4px);
        }
        .search-box {
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 560px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .search-box input {
          width: 100%;
          padding: 20px 24px;
          font-size: 18px;
          border: none;
          border-bottom: 1px solid var(--color-border);
          border-radius: 0;
        }
        .search-results {
          max-height: 400px;
          overflow-y: auto;
        }
        .search-result {
          padding: 12px 24px;
          cursor: pointer;
        }
        .search-result:hover {
          background: var(--color-bg-secondary);
        }
        .result-title {
          display: block;
          font-weight: 500;
        }
        .result-path {
          display: block;
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-top: 2px;
        }
        .search-footer {
          padding: 12px 24px;
          border-top: 1px solid var(--color-border);
          font-size: 12px;
          color: var(--color-text-secondary);
          display: flex;
          gap: 12px;
        }
        .search-footer kbd {
          background: var(--color-bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }
        
        @media (max-width: 1024px) {
          .docs-toc { display: none; }
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