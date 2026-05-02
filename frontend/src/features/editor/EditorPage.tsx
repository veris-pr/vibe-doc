import { useEffect } from 'preact/hooks';
import { EditorView } from './ui/EditorView';
import { editorStore } from './stores';

export function EditorPage({ projectId, slug }: { projectId: number; slug: string }) {
  useEffect(() => {
    editorStore.loadDocument(projectId, slug);
    return () => editorStore.reset();
  }, [projectId, slug]);

  const handleInsertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    editorStore.setContent(editorStore.content.value + '\n' + prefix + 'Heading\n');
  };

  const handleInsertCodeBlock = () => {
    editorStore.setContent(editorStore.content.value + '\n```python\n# Your code here\n```\n');
  };

  const handleInsertCallout = () => {
    editorStore.setContent(editorStore.content.value + '\n> [!NOTE]\n> Your callout text here\n');
  };

  const handleInsertLink = () => {
    editorStore.setContent(editorStore.content.value + '\n[Link text](https://example.com)\n');
  };

  const handleFormatBold = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      editorStore.setContent(editorStore.content.value.replace(selection, `**${selection}**`));
    }
  };

  const handleFormatItalic = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      editorStore.setContent(editorStore.content.value.replace(selection, `*${selection}*`));
    }
  };

  const handlePathChange = (path: string) => {
    editorStore.setPath(path);
  };

  return (
    <EditorView
      content={editorStore.content.value}
      path={editorStore.path.value}
      title={editorStore.title.value}
      hasUnsavedChanges={editorStore.hasUnsavedChanges.value}
      isSaving={editorStore.isSaving.value}
      canSave={editorStore.canSave.value}
      showPreview={editorStore.showPreview.value}
      showSidebar={editorStore.showSidebar.value}
      onContentChange={(content) => editorStore.setContent(content)}
      onPathChange={handlePathChange}
      onSave={() => editorStore.save()}
      onTogglePreview={() => editorStore.togglePreview()}
      onToggleSidebar={() => editorStore.toggleSidebar()}
      onInsertHeading={handleInsertHeading}
      onInsertCodeBlock={handleInsertCodeBlock}
      onInsertCallout={handleInsertCallout}
      onInsertLink={handleInsertLink}
      onFormatBold={handleFormatBold}
      onFormatItalic={handleFormatItalic}
    />
  );
}