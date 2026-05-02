import { currentUser } from '../App';

export function Header() {
  const user = currentUser.value;

  return (
    <header class="header">
      <div class="header-content container">
        <a href="/" class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="var(--color-primary)" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>OpenDoc</span>
        </a>
        <nav class="nav">
          <a href="/admin/projects">Dashboard</a>
          {user ? (
            <div class="user-menu">
              <img src={user.avatar_url || '/default-avatar.png'} alt={user.username} class="avatar" />
              <span>{user.username}</span>
            </div>
          ) : (
            <a href="/api/v1/auth/github">Sign in with GitHub</a>
          )}
        </nav>
      </div>
      <style>{`
        .header {
          border-bottom: 1px solid var(--color-border);
          padding: 12px 0;
          background: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 18px;
          color: var(--color-text);
        }
        .logo:hover {
          text-decoration: none;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
      `}</style>
    </header>
  );
}