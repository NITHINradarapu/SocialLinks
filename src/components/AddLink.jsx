import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getPlatformCategory, isValidHttpUrl } from '../utils/platformIcons';
import { toast } from 'react-hot-toast';

export default function AddLink({ onAdd, links = [] }) {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const platformRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { platformRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = platform.trim(), u = url.trim();
    if (!p) return toast.error('Enter a platform name');
    if (!u) return toast.error('Enter a URL');
    if (!isValidHttpUrl(u)) return toast.error('Enter a valid URL (e.g. https://github.com/user)');
    
    setIsSubmitting(true);
    try {
      await onAdd(p, u, category);
      setPlatform('');
      setUrl('');
      setCategory('Other');
      toast.success('Link added');
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const presets = [
    { name: 'GitHub', ph: 'https://github.com/username' },
    { name: 'LinkedIn', ph: 'https://linkedin.com/in/username' },
    { name: 'LeetCode', ph: 'https://leetcode.com/username' },
    { name: 'Twitter', ph: 'https://x.com/username' },
    { name: 'Portfolio', ph: 'https://yoursite.com' },
  ];

  const selectPreset = (p) => {
    setPlatform(p.name);
    setCategory(getPlatformCategory(p.name));
    setUrl('');
    setTimeout(() => document.getElementById('url-input')?.focus(), 50);
  };

  return (
    <div className="flex justify-center animate-fade-in w-full">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium font-display" style={{ color: 'var(--text-primary)' }}>
            Add new link
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Add a profile or project to your directory
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-5 sm:p-6 card-quiet"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Quick presets */}
          <div className="mb-5">
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Quick presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => {
                const isSelected = platform === p.name;
                return (
                  <button
                    key={p.name}
                    id={`preset-${p.name.toLowerCase()}`}
                    type="button"
                    onClick={() => selectPreset(p)}
                    disabled={isSubmitting}
                    className="px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors border"
                    style={{
                      background: isSelected ? 'var(--surface-3)' : 'var(--surface-2)',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      borderColor: isSelected ? 'var(--border-hover)' : 'var(--border)',
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 border-t" style={{ borderColor: 'var(--border)' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="platform-input" className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Platform name
              </label>
              <input
                ref={platformRef}
                id="platform-input"
                type="text"
                value={platform}
                onChange={(e) => { 
                  const val = e.target.value;
                  setPlatform(val); 
                  setCategory(getPlatformCategory(val));
                }}
                disabled={isSubmitting}
                placeholder="e.g. GitHub"
              />
            </div>

            <div>
              <label htmlFor="category-input" className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <input
                id="category-input"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                placeholder="Select or enter category"
                className="text-[13px]"
              />
              <datalist id="category-suggestions">
                {[...new Set([...CATEGORIES.filter(c => c !== 'All'), ...links.map(l => l.category || getPlatformCategory(l.platform))])].map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="url-input" className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                URL
              </label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmitting}
                placeholder={presets.find(x => x.name === platform)?.ph || 'https://example.com/profile'}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                id="add-link-submit"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 py-2 text-[13px] flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add link</span>
                  </>
                )}
              </button>
              <button
                id="add-link-cancel"
                type="button"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
                className="btn-ghost px-4 py-2 text-[13px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
