import { signal } from '@preact/signals';
import Router, { Route } from 'preact-router';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { AdminLayout } from './pages/admin/Layout';
import { ProjectsPage } from './pages/admin/Projects';
import { DocsViewer } from './pages/docs/Viewer';

export const currentUser = signal<{ id: number; username: string; avatar_url?: string } | null>(null);

export function App() {
  return (
    <div class="app">
      <Header />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminLayout}>
          <Route path="/projects" component={ProjectsPage} />
        </Route>
        <Route path="/docs/:projectSlug/*" component={DocsViewer} />
      </Router>
    </div>
  );
}