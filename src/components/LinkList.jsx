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
      <div className="w-full animate-fade-in">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-xl font-medium font-display" style={{ color: 'var(--text-primary)' }}>Your links</h1>
          <span className="text-[12px] font-mono-meta" style={{ color: 'var(--text-tertiary)' }}>0 links</span>
        </div>

        <div
          className="text-center py-14 px-6 rounded-2xl border"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-12 h-12 mx-auto mb-3.5 rounded-xl flex items-center justify-center border"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-[14px] font-medium mb-1 font-display" style={{ color: 'var(--text-primary)' }}>No links saved yet</p>
          <p className="text-[12px] mb-5" style={{ color: 'var(--text-secondary)' }}>Add your first profile link to start your directory.</p>
          <button
            id="empty-add-link"
            onClick={() => navigate('/add')}
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-[12.5px]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add link</span>
          </button>
        </div>
      </div>
    );
  }

  // ── With links ──
  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-xl font-medium font-display" style={{ color: 'var(--text-primary)' }}>Your links</h1>
        <span className="text-[12px] font-mono-meta" style={{ color: 'var(--text-tertiary)' }}>
          {links.length} {links.length === 1 ? 'link' : 'links'}
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
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
          placeholder="Search links..."
          className="w-full text-[13px]"
          style={{ paddingLeft: '36px' }}
        />
        {search && (
          <button
            id="clear-search"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Categories — quiet segmented control */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {uniqueCategories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap px-3 py-1 rounded-lg text-[12px] font-medium transition-colors border"
              style={{
                backgroundColor: isSelected ? 'var(--surface-2)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                borderColor: isSelected ? 'var(--border-hover)' : 'transparent',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 rounded-xl border border-dashed" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <p className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            No links match your search
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
