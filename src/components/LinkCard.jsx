import { useState, useRef, useEffect } from 'react';
import { getPlatformIcon, getPlatformColor, isKnownPlatform, CATEGORIES, getPlatformCategory } from '../utils/platformIcons';
import { toast } from 'react-hot-toast';

export default function LinkCard({ link, onDelete, onEdit, index, dragIndex, overIndex, dragHandlers, uniqueCategories = [] }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
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
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      onDelete(link.id);
      toast.success('Link deleted');
    }, 250);
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

  const validateUrl = (str) => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleEditSave = () => {
    const p = editPlatform.trim();
    const u = editUrl.trim();
    if (!p) return toast.error('Platform name is required.');
    if (!u) return toast.error('URL is required.');
    if (!validateUrl(u)) return toast.error('Enter a valid URL.');
    
    onEdit(link.id, p, u, editCategory);
    setEditing(false);
    toast.success('Link updated!');
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

  const shortUrl = link.url.length > 42 ? link.url.slice(0, 42) + '…' : link.url;

  // ── Drag state classes ──
  const isDragging = dragIndex === index;
  const isOver = overIndex === index;
  
  let dragStyle = {};
  if (isDragging) {
    dragStyle = { opacity: 0.4, transform: 'scale(0.98)' };
  } else if (isOver && dragIndex !== null) {
    // Show visual indicator line where it will be dropped
    if (dragIndex > index) {
      dragStyle = { borderTop: '2px solid var(--accent)', transform: 'translateY(2px)' };
    } else {
      dragStyle = { borderBottom: '2px solid var(--accent)', transform: 'translateY(-2px)' };
    }
  }

  // ── Edit Mode ──
  if (editing) {
    return (
      <div
        id={`link-card-${link.id}`}
        className="group animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div
          className="relative rounded-xl transition-all duration-200"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--accent)',
            boxShadow: '0 0 0 3px var(--accent-glow)',
          }}
        >
          {/* Edit Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl"
            style={{
              background: 'var(--accent-glow)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <svg className="w-3.5 h-3.5" style={{ color: 'var(--accent-bright)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: 'var(--accent-bright)' }}>
              Editing Link
            </span>
          </div>

          {/* Edit Form */}
          <div className="p-4 flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Platform
              </label>
              <input
                ref={platformInputRef}
                id={`edit-platform-${link.id}`}
                type="text"
                value={editPlatform}
                onChange={(e) => setEditPlatform(e.target.value)}
                onKeyDown={handleEditKeyDown}
                placeholder="e.g., GitHub"
                className="text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Category
              </label>
              <input
                id={`edit-category-${link.id}`}
                list={`category-suggestions-${link.id}`}
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full text-[13px] rounded bg-transparent outline-none px-2 py-1.5"
                style={{
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              />
              <datalist id={`category-suggestions-${link.id}`}>
                {(uniqueCategories.length > 0 ? uniqueCategories : CATEGORIES.filter(c => c !== 'All')).map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
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

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id={`edit-save-${link.id}`}
                onClick={handleEditSave}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                  color: '#fff',
                  border: 'none',
                }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save
              </button>
              <button
                id={`edit-cancel-${link.id}`}
                onClick={handleEditCancel}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: 'var(--surface-3)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                Cancel
              </button>
              <span className="text-[10px] ml-auto" style={{ color: 'var(--text-tertiary)' }}>
                <kbd className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--surface-3)', color: 'var(--accent-bright)', border: '1px solid var(--border)' }}>Enter</kbd> save · <kbd className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--surface-3)', color: 'var(--accent-bright)', border: '1px solid var(--border)' }}>Esc</kbd> cancel
              </span>
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
      className="group animate-fade-in-up"
      style={{
        animationDelay: `${index * 50}ms`,
        opacity: deleting ? 0 : undefined,
        transform: deleting ? 'scale(0.96) translateY(-4px)' : undefined,
        transition: 'opacity 0.25s, transform 0.25s',
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
        className="relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl transition-all duration-200"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          ...dragStyle
        }}
        onMouseEnter={(e) => {
          if (isDragging) return;
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.background = 'var(--surface-3)';
        }}
        onMouseLeave={(e) => {
          if (isDragging) return;
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-2)';
        }}
      >
        {/* Drag Handle */}
        {dragHandlers && (
          <div className="shrink-0 cursor-grab active:cursor-grabbing text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity p-1 -ml-2">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
              <circle cx="4" cy="4" r="1.5" />
              <circle cx="8" cy="4" r="1.5" />
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="8" cy="10" r="1.5" />
              <circle cx="4" cy="16" r="1.5" />
              <circle cx="8" cy="16" r="1.5" />
            </svg>
          </div>
        )}

        {/* Icon (Favicon or SVG) */}
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
          style={{ background: colors.bg, color: colors.text }}
        >
          {faviconUrl && !faviconError ? (
            <img 
              src={faviconUrl} 
              alt={link.platform} 
              className="w-5 h-5 object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            icon
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {link.platform}
          </p>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] leading-tight mt-0.5 block truncate hover:underline"
            style={{ color: 'var(--text-tertiary)' }}
            title={link.url}
          >
            {shortUrl}
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id={`copy-${link.id}`}
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all duration-150 active:scale-95"
            style={{
              background: copied ? 'var(--success-bg)' : 'transparent',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              border: `1px solid ${copied ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
            }}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3 animate-copied-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>

          <button
            id={`edit-${link.id}`}
            onClick={handleEditStart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all duration-150 active:scale-95 opacity-50 hover:opacity-100"
            style={{
              background: 'transparent',
              color: 'var(--accent-bright)',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-glow)';
              e.currentTarget.style.borderColor = 'rgba(129,140,248,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            id={`delete-${link.id}`}
            onClick={handleDelete}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all duration-150 active:scale-95 opacity-50 hover:opacity-100"
            style={{
              background: 'transparent',
              color: 'var(--danger)',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--danger-bg)';
              e.currentTarget.style.borderColor = 'rgba(251,113,133,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
