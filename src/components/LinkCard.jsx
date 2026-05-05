import { useState } from 'react';
import { getPlatformIcon, getPlatformColor } from '../utils/platformIcons';

export default function LinkCard({ link, onDelete, index }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const colors = getPlatformColor(link.platform);
  const icon = getPlatformIcon(link.platform);

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
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(link.id), 250);
  };

  const shortUrl = link.url.length > 42 ? link.url.slice(0, 42) + '…' : link.url;

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
    >
      <div
        className="relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl transition-all duration-200"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.background = 'var(--surface-3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-2)';
        }}
      >
        {/* Icon */}
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: colors.bg, color: colors.text }}
        >
          {icon}
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
