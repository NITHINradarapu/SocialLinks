import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from './LinkCard';
import { useDragReorder } from '../hooks/useDragReorder';
import { CATEGORIES, getPlatformCategory } from '../utils/platformIcons';

export default function LinkList({ links, onDelete, onEdit, onReorder }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { dragIndex, overIndex, dragHandlers } = useDragReorder(links, onReorder);

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
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Your Links</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-tertiary)' }}>No links yet — add one to get started.</p>

        <div
          className="text-center py-14 px-8 rounded-2xl"
          style={{ background: 'var(--surface-1)', border: '1.5px dashed var(--border)' }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-glow)' }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Nothing here yet</p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Add your first profile link to get started.</p>
          <button
            id="empty-add-link"
            onClick={() => navigate('/add')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              color: '#fff',
              border: 'none',
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
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Links</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {links.length} link{links.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: 'var(--text-tertiary)' }}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {uniqueCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat 
                ? 'shadow-sm' 
                : 'bg-transparent border'
            }`}
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--surface-1)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              borderColor: selectedCategory === cat ? 'var(--accent)' : 'var(--border)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
