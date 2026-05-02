import { signal, computed } from '@preact/signals';
import type { Document, NavigationItem } from '../../../shared/types';
import { documentService } from '../../../shared/api';

export type DocumentStatus = 'idle' | 'loading' | 'success' | 'error';

class DocumentListStore {
  documents = signal<Document[]>([]);
  navigation = signal<NavigationItem[]>([]);
  status = signal<DocumentStatus>('idle');
  error = signal<string | null>(null);
  currentProjectId = signal<number | null>(null);

  visibleDocuments = computed(() => this.documents.value);
  
  isLoading = computed(() => this.status.value === 'loading');
  hasError = computed(() => this.status.value === 'error');
  isEmpty = computed(() => this.status.value === 'success' && this.documents.value.length === 0);

  async load(projectId: number) {
    this.currentProjectId.value = projectId;
    this.status.value = 'loading';
    this.error.value = null;
    
    try {
      const [docsResponse, navResponse] = await Promise.all([
        documentService.list(projectId),
        documentService.getNavigation(projectId),
      ]);
      
      this.documents.value = docsResponse.documents;
      this.navigation.value = navResponse;
      this.status.value = 'success';
    } catch (e) {
      this.error.value = e instanceof Error ? e.message : 'Failed to load documents';
      this.status.value = 'error';
    }
  }

  async createDocument(data: {
    title: string;
    slug: string;
    path: string;
    content?: string;
    ordering?: number;
    parent_id?: number;
  }): Promise<Document> {
    const projectId = this.currentProjectId.value;
    if (!projectId) throw new Error('No project selected');

    const document = await documentService.create(projectId, data);
    this.documents.value = [...this.documents.value, document];
    return document;
  }

  async updateDocument(
    documentId: number,
    data: {
      title?: string;
      content?: string;
      frontmatter?: Record<string, unknown>;
    }
  ): Promise<Document> {
    const document = await documentService.update(documentId, data);
    this.documents.value = this.documents.value.map(d =>
      d.id === documentId ? document : d
    );
    return document;
  }

  async deleteDocument(documentId: number): Promise<void> {
    await documentService.delete(documentId);
    this.documents.value = this.documents.value.filter(d => d.id !== documentId);
  }

  getDocumentBySlug(slug: string): Document | undefined {
    return this.documents.value.find(d => d.slug === slug);
  }

  clearError() {
    this.error.value = null;
  }
}

export const documentListStore = new DocumentListStore();