import { signal, computed } from '@preact/signals';
import { documentService } from '../../../shared/api';
import type { Document } from '../../../shared/types';

export type EditorStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

class EditorStore {
  document = signal<Document | null>(null);
  originalContent = signal<string>('');
  status = signal<EditorStatus>('idle');
  error = signal<string | null>(null);
  hasUnsavedChanges = signal<boolean>(false);
  showPreview = signal<boolean>(true);
  showSidebar = signal<boolean>(true);

  content = signal<string>('');
  path = signal<string>('');
  title = signal<string>('');

  canSave = computed(() => this.hasUnsavedChanges.value && this.status.value !== 'saving');
  isSaving = computed(() => this.status.value === 'saving');
  isLoading = computed(() => this.status.value === 'loading');

  loadDocument(projectId: number, slug: string) {
    this.status.value = 'loading';
    
    documentService.get(projectId, slug)
      .then(doc => {
        this.document.value = doc;
        this.content.value = doc.content;
        this.originalContent.value = doc.content;
        this.path.value = doc.path;
        this.title.value = doc.title;
        this.hasUnsavedChanges.value = false;
        this.status.value = 'success';
      })
      .catch(e => {
        this.error.value = e instanceof Error ? e.message : 'Failed to load document';
        this.status.value = 'error';
      });
  }

  setContent(newContent: string) {
    this.content.value = newContent;
    this.hasUnsavedChanges.value = newContent !== this.originalContent.value;
  }

  setPath(newPath: string) {
    this.path.value = newPath;
  }

  setTitle(newTitle: string) {
    this.title.value = newTitle;
  }

  togglePreview() {
    this.showPreview.value = !this.showPreview.value;
  }

  toggleSidebar() {
    this.showSidebar.value = !this.showSidebar.value;
  }

  async save() {
    const doc = this.document.value;
    if (!doc) return;

    this.status.value = 'saving';
    
    try {
      const updated = await documentService.update(doc.id, {
        title: this.title.value,
        content: this.content.value,
      });
      
      this.document.value = updated;
      this.originalContent.value = this.content.value;
      this.hasUnsavedChanges.value = false;
      this.status.value = 'success';
    } catch (e) {
      this.error.value = e instanceof Error ? e.message : 'Failed to save';
      this.status.value = 'error';
    }
  }

  clearError() {
    this.error.value = null;
  }

  reset() {
    this.document.value = null;
    this.content.value = '';
    this.originalContent.value = '';
    this.path.value = '';
    this.title.value = '';
    this.hasUnsavedChanges.value = false;
    this.status.value = 'idle';
  }
}

export const editorStore = new EditorStore();