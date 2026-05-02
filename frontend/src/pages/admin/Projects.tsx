import { useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import '../../styles/admin.css';

interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string;
  primary_color: string;
}

const projects = signal<Project[]>([]);
const isLoading = signal(false);

export function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', slug: '', description: '' });

  const createProject = async () => {
    if (!newProject.name || !newProject.slug) return;
    
    isLoading.value = true;
    try {
      const res = await fetch('/api/v1/dev/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProject,
        }),
      });
      if (res.ok) {
        const project = await res.json();
        project.primary_color = '#6366f1';
        projects.value = [...projects.value, project];
        setShowCreate(false);
        setNewProject({ name: '', slug: '', description: '' });
      }
    } catch (e) {
      console.error('Failed to create project:', e);
    } finally {
      isLoading.value = false;
    }
  };

  const createSampleProject = async () => {
    isLoading.value = true;
    try {
      const slug = 'sample-docs';
      
      const res = await fetch('/api/v1/dev/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sample Documentation',
          slug: slug,
          description: 'Sample docs to get started quickly',
        }),
      });
      
      if (res.ok) {
        const project = await res.json();
        
        const seedRes = await fetch(`/api/v1/dev/seed/${slug}`, {
          method: 'POST',
        });
        
        if (seedRes.ok) {
          projects.value = [...projects.value, { ...project, primary_color: '#6366f1' }];
          window.location.href = `/docs/${slug}`;
        }
      }
    } catch (e) {
      console.error('Failed to create sample project:', e);
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div>
      <div class="page-header">
        <h1>Projects</h1>
        <div class="header-actions">
          <button class="secondary" onClick={createSampleProject} disabled={isLoading.value}>
            {isLoading.value ? 'Creating...' : 'Try Sample Docs'}
          </button>
          <button class="primary" onClick={() => setShowCreate(true)} disabled={isLoading.value}>
            {isLoading.value ? 'Creating...' : '+ New Project'}
          </button>
        </div>
      </div>

      {showCreate && (
        <div class="modal-overlay">
          <div class="modal">
            <h2>Create New Project</h2>
            <div class="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newProject.name}
                onInput={(e) => setNewProject({ ...newProject, name: (e.target as HTMLInputElement).value })}
                placeholder="My Documentation"
              />
            </div>
            <div class="form-group">
              <label>Slug</label>
              <input
                type="text"
                value={newProject.slug}
                onInput={(e) => setNewProject({ ...newProject, slug: (e.target as HTMLInputElement).value })}
                placeholder="my-docs"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                value={newProject.description}
                onInput={(e) => setNewProject({ ...newProject, description: (e.target as HTMLTextAreaElement).value })}
                placeholder="Optional description..."
              />
            </div>
            <div class="modal-actions">
              <button class="secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button class="primary" onClick={createProject}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div class="projects-grid">
        {projects.value.length === 0 ? (
          <div class="empty-state">
            <p>No projects yet. Create your first project to get started.</p>
          </div>
        ) : (
          projects.value.map((project) => (
            <a href={`/docs/${project.slug}`} class="project-card" key={project.id}>
              <div class="project-color" style={{ background: project.primary_color }} />
              <h3>{project.name}</h3>
              <p>{project.description || 'No description'}</p>
              <span class="project-slug">/{project.slug}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}