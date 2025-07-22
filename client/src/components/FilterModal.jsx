import { useState, useEffect } from 'react';

const FilterModal = ({ isOpen, onClose, onSearch, currentQuery, currentFilter }) => {
  const [query, setQuery] = useState(currentQuery || '');
  const [filter, setFilter] = useState(currentFilter || 'all');

  useEffect(() => {
    setQuery(currentQuery || '');
    setFilter(currentFilter || 'all');
  }, [currentQuery, currentFilter, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim(), filter);
    onClose();
  };

  const handleClear = () => {
    setQuery('');
    setFilter('all');
    onSearch('', 'all');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg p-6 w-full max-w-md layout-transition"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Search & Filter</h3>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="search-query" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Search Query
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms..."
              className="w-full px-3 py-2 rounded-md focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="filter-select" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Search In
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="all">All Fields</option>
              <option value="title">Title Only</option>
              <option value="context">Context Only</option>
              <option value="tag">Tag Only</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary py-2 px-4 rounded-lg"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 btn-secondary py-2 px-4 rounded-lg"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal; 