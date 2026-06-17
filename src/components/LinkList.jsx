import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from './LinkCard';
import { useDragReorder } from '../hooks/useDragReorder';
import { CATEGORIES, getPlatformCategory } from '../utils/platformIcons';

export default function LinkList({ links, onDelete, onEdit, onReorder }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { dragIndex, overIndex, dragHandlers } = useDragReorder(onReorder);

  const filtered = links.filter((link) => {
    const q = search.toLowerCase();
    const matchesSearch = link.platform.toLowerCase().includes(q) || link.url.toLowerCase().includes(q);
    
    if (selectedCategory === 'All') return matchesSearch;
    const category = link.category || getPlatformCategory(link.platform);
    return matchesSearch && category === selectedCategory;
  });

  const isFiltering = search.length > 0 || selectedCategory !== 'All';

  // Compute unique categories from existing links + predefined
  const uniqueCategories = [...new Set([
    ...CATEGORIES,
    ...links.map(l => l.category || getPlatformCategory(l.platform))
  ])];

  // ── Empty state ──
  if (links.length === 0) {
    return (
      <div className="animate-fade-in-up w-full">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Your Links</h1>
        </div>
        <p className="text-sm mb-10" style={{ color: 'var(--text-tertiary)' }}>No links yet — add one to get started.</p>

        <div
          className="text-center py-16 px-8 rounded-2xl"
          style={{
            background: 'var(--glass)',
            border: '1.5px dashed var(--border)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center animate-float"
            style={{
              background: 'var(--accent-glow)',
              border: '1px solid rgba(129,140,248,0.1)',
            }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-base font-semibold mb-1.5 font-display" style={{ color: 'var(--text-primary)' }}>Nothing here yet</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Add your first profile link to get started.</p>
          <button
            id="empty-add-link"
            onClick={() => navigate('/add')}
            className="btn-shimmer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>
      </div>
    );
  }

  // ── With links ──
  return (
    <div className="animate-fade-in-up w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent-dim))' }}></div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Your Links</h1>
          </div>
          <p className="text-xs mt-1 ml-3.5" style={{ color: 'var(--text-tertiary)' }}>
            {links.length} link{links.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors"
          style={{ color: search ? 'var(--accent)' : 'var(--text-tertiary)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="search-links"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search links…"
          className="w-full text-[13px]"
          style={{ paddingLeft: '36px' }}
        />
        {search && (
          <button
            id="clear-search"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md cursor-pointer transition-all duration-200 hover:bg-[var(--surface-3)]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {uniqueCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-250 border"
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--surface-2)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              borderColor: selectedCategory === cat ? 'var(--accent)' : 'var(--border)',
              boxShadow: selectedCategory === cat ? '0 2px 8px var(--accent-glow)' : 'none',
              transform: selectedCategory === cat ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: 'var(--surface-1)', border: '1px dashed var(--border)' }}>
          <svg className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
            No links match your filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 relative">
          {filtered.map((link, i) => (
            <LinkCard 
              key={link.id} 
              link={link} 
              onDelete={onDelete} 
              onEdit={onEdit} 
              index={i}
              dragIndex={dragIndex}
              overIndex={overIndex}
              dragHandlers={isFiltering ? null : dragHandlers}
              uniqueCategories={uniqueCategories.filter(c => c !== 'All')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
