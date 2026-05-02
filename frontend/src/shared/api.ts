import type { Project, Document, NavigationItem } from './types';

const API_BASE = '/api/v1';

interface ApiError {
  detail: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(error.detail);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

export class ProjectService {
  constructor(private client: ApiClient) {}

  async list(): Promise<{ projects: Project[] }> {
    return this.client.get<{ projects: Project[] }>('/projects/');
  }

  async get(slug: string): Promise<Project> {
    return this.client.get<Project>(`/projects/${slug}`);
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    github_repo?: string;
    is_public?: boolean;
    organization_id: number;
  }): Promise<Project> {
    return this.client.post<Project>('/projects/', data);
  }

  async update(slug: string, data: Partial<Project>): Promise<Project> {
    return this.client.patch<Project>(`/projects/${slug}`, data);
  }

  async delete(slug: string): Promise<void> {
    return this.client.delete(`/projects/${slug}`);
  }
}

export class DocumentService {
  constructor(private client: ApiClient) {}

  async list(projectId: number): Promise<{ documents: Document[] }> {
    return this.client.get<{ documents: Document[] }>(
      `/projects/${projectId}/documents`
    );
  }

  async get(projectId: number, slug: string): Promise<Document> {
    return this.client.get<Document>(
      `/projects/${projectId}/documents/${slug}`
    );
  }

  async create(
    projectId: number,
    data: {
      title: string;
      slug: string;
      path: string;
      content?: string;
      ordering?: number;
      parent_id?: number;
    }
  ): Promise<Document> {
    return this.client.post<Document>(
      `/projects/${projectId}/documents`,
      data
    );
  }

  async update(
    documentId: number,
    data: {
      title?: string;
      content?: string;
      frontmatter?: Record<string, unknown>;
    }
  ): Promise<Document> {
    return this.client.patch<Document>(
      `/documents/${documentId}`,
      data
    );
  }

  async delete(documentId: number): Promise<void> {
    return this.client.delete(`/documents/${documentId}`);
  }

  async getNavigation(projectId: number): Promise<NavigationItem[]> {
    return this.client.get<NavigationItem[]>(
      `/projects/${projectId}/navigation`
    );
  }
}

export const projectService = new ProjectService(apiClient);
export const documentService = new DocumentService(apiClient);