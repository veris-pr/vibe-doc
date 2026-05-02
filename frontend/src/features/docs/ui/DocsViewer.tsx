import type { NavigationItem } from '../../../shared/types';

export interface DocsViewerProps {
  sidebarOpen: boolean;
  searchOpen: boolean;
  darkMode: boolean;
  navigation: NavigationItem[];
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
  onToggleDarkMode: () => void;
}

export function DocsViewer({
  sidebarOpen,
  searchOpen,
  darkMode,
  navigation,
  onToggleSidebar,
  onToggleSearch,
  onToggleDarkMode,
}: DocsViewerProps) {
  return (
    <div class={`docs-viewer ${darkMode ? 'dark' : ''}`}>
      <header class="docs-header">
        <div class="header-left">
          <button class="menu-toggle" onClick={onToggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <a href="/" class="docs-logo">Docs</a>
        </div>
        <div class="header-center">
          <button class="search-trigger" onClick={onToggleSearch}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
        <div class="header-right">
          <button class="theme-toggle" onClick={onToggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <a href="https://github.com" class="github-link" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </header>

      <div class="docs-body">
        {sidebarOpen && (
          <aside class="docs-sidebar">
            <nav class="sidebar-nav">
              {navigation.map(section => (
                <div class="nav-section" key={section.slug}>
                  <h4>{section.title}</h4>
                  {section.children.map(child => (
                    <a key={child.slug} href={`/docs/${child.slug}`} class="nav-link">
                      {child.title}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        )}

        <main class="docs-content">
          <slot name="content" />
        </main>

        <aside class="docs-toc">
          <slot name="toc" />
        </aside>
      </div>

      {searchOpen && (
        <div class="search-modal" onClick={onToggleSearch}>
          <div class="search-box" onClick={(e) => e.stopPropagation()}>
            <input type="text" placeholder="Search documentation..." autoFocus />
            <slot name="search-results" />
            <div class="search-footer">
              <kbd>↑</kbd><kbd>↓</kbd> navigate
              <kbd>↵</kbd> select
              <kbd>esc</kbd> close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}