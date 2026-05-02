import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';

interface EditorProps {
  initialContent?: string;
  initialPath?: string;
  onSave?: (content: string, path: string) => Promise<void>;
}

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:)/i;
const DANGEROUS_URL_SCHEMES = ['javascript:', 'data:', 'vbscript:'];

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  return DANGEROUS_URL_SCHEMES.every(scheme => !trimmed.startsWith(scheme)) &&
         (SAFE_URL_PATTERN.test(url) || url.startsWith('/') || url.startsWith('#'));
}

function sanitizeHtml(html: string): string {
  let sanitized = html;

  sanitized = sanitized.replace(
    /<a\s+href="([^"]*)"/gi,
    (_, url) => {
      if (isSafeUrl(url)) {
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}"${target}`;
      }
      return '<a href="#"';
    }
  );

  sanitized = sanitized.replace(
    /<img\s+([^>]*)>/gi,
    (_, attrs) => {
      const srcMatch = attrs.match(/src="([^"]*)"/i);
      if (srcMatch && isSafeUrl(srcMatch[1])) {
        return `<img ${attrs}>`;
      }
      return '';
    }
  );

  return sanitized;
}

export function MDXEditor({ initialContent = '', initialPath = '', onSave }: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [path, setPath] = useState(initialPath);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setContent(initialContent);
    setPath(initialPath);
  }, [initialContent, initialPath]);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(content, path);
      setSaved(true);
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      const selection = window.getSelection()?.toString();
      if (selection) {
        const newContent = content.replace(selection, `**${selection}**`);
        handleChange(newContent);
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      const selection = window.getSelection()?.toString();
      if (selection) {
        const newContent = content.replace(selection, `*${selection}*`);
        handleChange(newContent);
      }
    }
  };

  const insertCodeBlock = () => {
    const newContent = content + '\n```python\n# Your code here\n```\n';
    handleChange(newContent);
  };

  const insertCallout = () => {
    const newContent = content + '\n> [!NOTE]\n> Your callout text here\n';
    handleChange(newContent);
  };

  const insertLink = () => {
    const newContent = content + '\n[Link text](https://example.com)\n';
    handleChange(newContent);
  };

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    const newContent = content + '\n' + prefix + 'Heading\n';
    handleChange(newContent);
  };

  const escapeHtml = (str: string): string => {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => htmlEntities[char]);
  };

  const simpleMarkdown = (md: string): string => {
    let html = escapeHtml(md);
    
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="code-block" data-language="${escapeHtml(lang || 'text')}"><code>${code.trim()}</code></pre>`;
    });
    
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const safeUrl = isSafeUrl(url) ? escapeHtml(url) : '#';
      const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${safeUrl}"${target}>${text}</a>`;
    });
    
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    
    return sanitizeHtml(html);
  };

  const renderedContent = useMemo(() => simpleMarkdown(content), [content]);

  return (
    <div class="editor-container">
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <button onClick={() => setShowSidebar(!showSidebar)} title="Toggle sidebar">
            ☰
          </button>
          <input
            type="text"
            value={path}
            onInput={(e) => setPath((e.target as HTMLInputElement).value)}
            placeholder="filename.mdx"
            class="path-input"
          />
          {!saved && <span class="unsaved-dot" title="Unsaved changes" />}
        </div>
        
        <div class="toolbar-center">
          <button onClick={() => insertHeading(1)} title="Heading 1">H1</button>
          <button onClick={() => insertHeading(2)} title="Heading 2">H2</button>
          <button onClick={() => insertHeading(3)} title="Heading 3">H3</button>
          <span class="toolbar-divider" />
          <button onClick={insertCodeBlock} title="Code block">{ }</button>
          <button onClick={insertCallout} title="Callout">💬</button>
          <button onClick={insertLink} title="Link">🔗</button>
          <span class="toolbar-divider" />
          <button onClick={() => handleChange(content + '**bold**')} title="Bold (Cmd+B)"><strong>B</strong></button>
          <button onClick={() => handleChange(content + '*italic*')} title="Italic (Cmd+I)"><em>I</em></button>
        </div>
        
        <div class="toolbar-right">
          <button onClick={() => setShowPreview(!showPreview)} class={showPreview ? 'active' : ''}>
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button onClick={handleSave} disabled={saving || saved} class="save-btn">
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
      
      <div class="editor-body">
        {showSidebar && (
          <div class="editor-sidebar">
            <div class="sidebar-section">
              <h4>Files</h4>
              <ul class="file-list">
                <li class="active">{path || 'untitled.mdx'}</li>
                <li>getting-started.mdx</li>
                <li>api-reference.mdx</li>
              </ul>
            </div>
            <div class="sidebar-section">
              <h4>Components</h4>
              <ul class="component-list">
                <li onClick={insertCodeBlock}>Code Block</li>
                <li onClick={insertCallout}>Callout</li>
                <li onClick={insertLink}>Link</li>
                <li>Tabs</li>
              </ul>
            </div>
          </div>
        )}
        
        <div class="editor-main">
          <div class="editor-pane">
            <textarea
              value={content}
              onInput={(e) => handleChange((e.target as HTMLTextAreaElement).value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your MDX content here..."
              spellcheck={false}
            />
          </div>
          
          {showPreview && (
            <div class="preview-pane">
              <div class="preview-content prose" dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
          gap: 16px;
        }
        
        .toolbar-left, .toolbar-center, .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .toolbar-left {
          flex: 1;
        }
        
        .toolbar-center {
          flex: 2;
          justify-content: center;
        }
        
        .toolbar-right {
          flex: 1;
          justify-content: flex-end;
        }
        
        .path-input {
          width: 180px;
          padding: 4px 8px;
          font-size: 13px;
          font-family: var(--font-mono);
        }
        
        .unsaved-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
        }
        
        .toolbar-divider {
          width: 1px;
          height: 20px;
          background: var(--color-border);
          margin: 0 4px;
        }
        
        .editor-toolbar button {
          padding: 6px 10px;
          font-size: 13px;
          background: transparent;
          color: var(--color-text);
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
        }
        
        .editor-toolbar button:hover {
          background: var(--color-border);
        }
        
        .editor-toolbar button.active {
          background: var(--color-primary);
          color: white;
        }
        
        .editor-toolbar button.save-btn {
          background: var(--color-primary);
          color: white;
        }
        
        .editor-toolbar button.save-btn:disabled {
          background: var(--color-success);
          cursor: default;
        }
        
        .editor-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .editor-sidebar {
          width: 200px;
          border-right: 1px solid var(--color-border);
          padding: 16px;
          background: var(--color-bg-secondary);
          overflow-y: auto;
        }
        
        .sidebar-section {
          margin-bottom: 24px;
        }
        
        .sidebar-section h4 {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        
        .file-list, .component-list {
          list-style: none;
        }
        
        .file-list li, .component-list li {
          padding: 6px 8px;
          font-size: 13px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-mono);
        }
        
        .file-list li:hover, .component-list li:hover {
          background: var(--color-border);
        }
        
        .file-list li.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--color-primary);
        }
        
        .component-list li {
          font-family: var(--font-sans);
        }
        
        .editor-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .editor-pane, .preview-pane {
          flex: 1;
          overflow: auto;
        }
        
        .editor-pane {
          border-right: 1px solid var(--color-border);
        }
        
        .editor-pane textarea {
          width: 100%;
          height: 100%;
          padding: 20px;
          border: none;
          resize: none;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          background: var(--color-bg);
          color: var(--color-text);
        }
        
        .editor-pane textarea:focus {
          outline: none;
        }
        
        .preview-pane {
          padding: 20px;
          background: var(--color-bg);
        }
        
        .preview-content {
          max-width: 100%;
        }
        
        .preview-content h1 { font-size: 28px; margin-bottom: 16px; }
        .preview-content h2 { font-size: 22px; margin: 24px 0 12px; }
        .preview-content h3 { font-size: 18px; margin: 20px 0 10px; }
        .preview-content p { margin-bottom: 12px; line-height: 1.7; }
        .preview-content code { background: var(--color-bg-secondary); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .preview-content pre { background: #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; }
        .preview-content pre code { background: transparent; padding: 0; color: #e2e8f0; }
        .preview-content blockquote { border-left: 3px solid var(--color-primary); padding-left: 16px; color: var(--color-text-secondary); }
        .preview-content ul { padding-left: 20px; margin-bottom: 12px; }
        .preview-content li { margin-bottom: 4px; }
        .preview-content a { color: var(--color-primary); }
      `}</style>
    </div>
  );
}