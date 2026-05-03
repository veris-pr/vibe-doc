import { useEffect, useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import Router, { Route } from 'preact-router';
import { Home } from './pages/Home';
import { ProjectsPage } from './pages/admin/Projects';
import { DocsViewer } from './pages/docs/Viewer';

export const currentUser = signal<{ id: number; username: string; avatar_url?: string } | null>(null);

function ProtectedRoute({ component: Component }: { component: any }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/v1/auth/me');
        if (res.ok) {
          const user = await res.json();
          currentUser.value = user;
          setAuthorized(true);
        }
      } catch (e) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!authorized) {
    window.location.href = '/?redirect=/admin/projects';
    return null;
  }

  return <Component />;
}

export function App() {
  return (
    <div class="app">
      <Router>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/docs/:slug" component={DocsViewer} />
        
        {/* Private routes */}
        <Route path="/admin/projects" component={() => <ProtectedRoute component={ProjectsPage} />} />
      </Router>
    </div>
  );
}