import { route } from 'preact-router';

export function AdminLayout({ children }: { children: any }) {
  const handleClick = (path: string, e: Event) => {
    e.preventDefault();
    route(path);
  };

  return (
    <div class="admin-layout">
      <aside class="sidebar">
        <nav>
          <a href="/admin/projects" onClick={(e) => handleClick('/admin/projects', e)}>Projects</a>
          <a href="/admin/settings" onClick={(e) => handleClick('/admin/settings', e)}>Settings</a>
        </nav>
      </aside>
      <main class="admin-content">
        {children}
      </main>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .sidebar {
          width: 220px;
          border-right: 1px solid var(--color-border);
          padding: 24px 16px;
          background: var(--color-bg-secondary);
        }
        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar a {
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
        }
        .sidebar a:hover {
          background: var(--color-border);
          text-decoration: none;
        }
        .admin-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}