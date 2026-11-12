import { useState, useRef, useEffect } from 'react';
import { getPlatformIcon, getPlatformColor, isKnownPlatform, CATEGORIES, getPlatformCategory, getSafeUrl, isValidHttpUrl } from '../utils/platformIcons';
import { toast } from 'react-hot-toast';

export default function LinkCard({ link, onDelete, onEdit, index, dragIndex, overIndex, dragHandlers, uniqueCategories = [] }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editPlatform, setEditPlatform] = useState(link.platform);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editCategory, setEditCategory] = useState(link.category || getPlatformCategory(link.platform));
  const [faviconError, setFaviconError] = useState(false);
  const platformInputRef = useRef(null);
  
  const colors = getPlatformColor(link.platform);
  const icon = getPlatformIcon(link.platform);
  const isKnown = isKnownPlatform(link.platform);

  // Favicon API URL
  let faviconUrl = '';
  if (!isKnown) {
    try {
      const domain = new URL(link.url).hostname;
      faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      // Keep empty if invalid URL
    }
  }

  useEffect(() => {
    if (editing) platformInputRef.current?.focus();
  }, [editing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success('Link copied');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(async () => {
      try {
        await onDelete(link.id);
        toast.success('Link deleted');
      } catch {
        setDeleting(false);
      }
    }, 200);
  };

  const handleEditStart = () => {
    setEditPlatform(link.platform);
    setEditUrl(link.url);
    setEditCategory(link.category || getPlatformCategory(link.platform));
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
  };

  const handleEditSave = async () => {
    const p = editPlatform.trim();
    const u = editUrl.trim();
    if (!p) return toast.error('Platform name is required');
    if (!u) return toast.error('URL is required');
    if (!isValidHttpUrl(u)) return toast.error('Enter a valid URL');

    try {
      await onEdit(link.id, p, u, editCategory);
      setEditing(false);
      toast.success('Link updated');
    } catch {
      // Handled in hook
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const shortUrl = link.url.length > 44 ? link.url.slice(0, 44) + '…' : link.url;

  // ── Drag state classes ──
  const isDragging = dragIndex === index;
  const isOver = overIndex === index;
  
  let dragStyle = {};
  if (isDragging) {
    dragStyle = { opacity: 0.4 };
  } else if (isOver && dragIndex !== null) {
    if (dragIndex > index) {
      dragStyle = { borderTop: '2px solid var(--accent)' };
    } else {
      dragStyle = { borderBottom: '2px solid var(--accent)' };
    }
  }

  // ── Edit Mode ──
  if (editing) {
    return (
      <div
        id={`link-card-${link.id}`}
        className="w-full animate-fade-in"
      >
        <div
          className="rounded-xl border p-4"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--accent)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Edit link
            </span>
            <span className="text-[10px] font-mono-meta hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>
              Enter to save · Esc to cancel
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Platform
              </label>
              <input
                ref={platformInputRef}
                id={`edit-platform-${link.id}`}
                type="text"
                value={editPlatform}
                onChange={(e) => setEditPlatform(e.target.value)}
                onKeyDown={handleEditKeyDown}
                placeholder="e.g. GitHub"
                className="text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Category
              </label>
              <input
                id={`edit-category-${link.id}`}
                list={`category-suggestions-${link.id}`}
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="text-[13px]"
              />
              <datalist id={`category-suggestions-${link.id}`}>
                {(uniqueCategories.length > 0 ? uniqueCategories : CATEGORIES.filter(c => c !== 'All')).map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                URL
              </label>
              <input
                id={`edit-url-${link.id}`}
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                onKeyDown={handleEditKeyDown}
                placeholder="https://example.com/profile"
                className="text-[13px]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                id={`edit-save-${link.id}`}
                onClick={handleEditSave}
                className="btn-primary px-3 py-1.5 text-[12px]"
              >
                Save
              </button>
              <button
                id={`edit-cancel-${link.id}`}
                onClick={handleEditCancel}
                className="btn-ghost px-3 py-1.5 text-[12px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal Mode ──
  return (
    <div
      id={`link-card-${link.id}`}
      className="group animate-fade-in"
      style={{
        opacity: deleting ? 0 : undefined,
        transition: 'opacity 0.2s ease',
      }}
      draggable={!!dragHandlers}
      onDragStart={(e) => dragHandlers?.onDragStart(e, index)}
      onDragEnter={(e) => dragHandlers?.onDragEnter(e, index)}
      onDragOver={dragHandlers?.onDragOver}
      onDragLeave={(e) => dragHandlers?.onDragLeave(e, index)}
      onDrop={(e) => dragHandlers?.onDrop(e, index)}
      onDragEnd={dragHandlers?.onDragEnd}
    >
      <div
        className="relative flex items-center gap-3 p-3 rounded-xl border transition-colors card-quiet"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border)',
          ...dragStyle
        }}
      >
        {/* Drag Handle */}
        {dragHandlers && (
          <div 
            className="shrink-0 cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 transition-opacity p-0.5" 
            style={{ color: 'var(--text-tertiary)' }}
            title="Drag to reorder"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              <circle cx="3" cy="3" r="1.2" />
              <circle cx="7" cy="3" r="1.2" />
              <circle cx="3" cy="8" r="1.2" />
              <circle cx="7" cy="8" r="1.2" />
              <circle cx="3" cy="13" r="1.2" />
              <circle cx="7" cy="13" r="1.2" />
            </svg>
          </div>
        )}

        {/* Icon */}
        <div
          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border"
          style={{ 
            background: 'var(--surface-2)', 
            borderColor: 'var(--border)',
            color: colors.text 
          }}
        >
          {faviconUrl && !faviconError ? (
            <img 
              src={faviconUrl} 
              alt={link.platform} 
              className="w-4.5 h-4.5 object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            icon
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
            {link.platform}
          </p>
          <a
            href={getSafeUrl(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11.5px] leading-snug font-mono-meta block truncate hover:underline"
            style={{ color: 'var(--text-tertiary)' }}
            title={link.url}
          >
            {shortUrl}
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                id={`confirm-delete-${link.id}`}
                onClick={handleDelete}
                className="px-2 py-1 rounded-md text-[11px] font-medium bg-[var(--danger)] text-white hover:opacity-90"
              >
                Delete
              </button>
              <button
                id={`cancel-delete-${link.id}`}
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded-md text-[11px] font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                id={`copy-${link.id}`}
                onClick={handleCopy}
                className="btn-ghost flex items-center gap-1 px-2.5 py-1 text-[11.5px]"
                title="Copy link to clipboard"
              >
                {copied ? (
                  <>
                    <svg className="w-3 h-3 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                id={`edit-${link.id}`}
                onClick={handleEditStart}
                className="btn-icon p-1 text-[var(--text-secondary)]"
                title="Edit link"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                id={`delete-${link.id}`}
                onClick={() => setConfirmDelete(true)}
                className="btn-icon-danger p-1"
                title="Delete link"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
