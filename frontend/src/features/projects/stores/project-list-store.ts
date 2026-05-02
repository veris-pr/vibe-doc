import { signal, computed } from '@preact/signals';
import type { Project } from '../../../shared/types';
import { projectService } from '../../../shared/api';

export type ProjectStatus = 'idle' | 'loading' | 'success' | 'error';

class ProjectListStore {
  projects = signal<Project[]>([]);
  status = signal<ProjectStatus>('idle');
  error = signal<string | null>(null);
  filter = signal<string>('');

  visibleProjects = computed(() => {
    const filter = this.filter.value.toLowerCase();
    if (!filter) return this.projects.value;
    return this.projects.value.filter(
      p => p.name.toLowerCase().includes(filter) ||
           p.slug.toLowerCase().includes(filter)
    );
  });

  isLoading = computed(() => this.status.value === 'loading');
  hasError = computed(() => this.status.value === 'error');
  isEmpty = computed(() => this.status.value === 'success' && this.projects.value.length === 0);

  async load() {
    this.status.value = 'loading';
    this.error.value = null;
    
    try {
      const response = await projectService.list();
      this.projects.value = response.projects;
      this.status.value = 'success';
    } catch (e) {
      this.error.value = e instanceof Error ? e.message : 'Failed to load projects';
      this.status.value = 'error';
    }
  }

  async createProject(data: {
    name: string;
    slug: string;
    description?: string;
    github_repo?: string;
    is_public?: boolean;
    organization_id: number;
  }): Promise<Project> {
    const project = await projectService.create(data);
    this.projects.value = [...this.projects.value, project];
    return project;
  }

  setFilter(filter: string) {
    this.filter.value = filter;
  }

  clearError() {
    this.error.value = null;
  }
}

export const projectListStore = new ProjectListStore();