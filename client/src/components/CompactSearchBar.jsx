import { useState, useEffect, useCallback } from 'react';

const CompactSearchBar = ({ onSearch, onAddMemory, onOpenFilter, searchQuery, searchFilter }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  // Update local query when searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Debounced search function
  const debouncedSearch = useCallback(() => {
    const timeoutId = setTimeout(() => {
      onSearch(localQuery.trim(), searchFilter);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [localQuery, searchFilter, onSearch]);

  // Trigger search when localQuery changes
  useEffect(() => {
    const cleanup = debouncedSearch();
    return cleanup;
  }, [debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery.trim(), searchFilter);
  };

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="compact-search-container mobile-full-width">
        {/* Search Icon */}
        <svg 
          className="w-5 h-5 mr-3 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: 'var(--text-secondary)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="compact-search-input"
          placeholder="Search your memories..."
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-3">
          {/* Filter Button */}
          <button
            type="button"
            onClick={onOpenFilter}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)'
            }}
            title="Filter options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </button>

          {/* Divider */}
          <div 
            className="w-px h-6"
            style={{ backgroundColor: 'var(--border-color)' }}
          ></div>

          {/* Add Memory Button */}
          <button
            type="button"
            onClick={onAddMemory}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg btn-primary transition-all"
            title="Add new memory"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="mobile-hide">Add</span>
          </button>
        </div>
      </form>
      
      {/* Search Status */}
      {(searchQuery || searchFilter !== 'all') && (
        <div className="mt-3 text-sm flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
          <span>
            Searching for "{searchQuery}" in {searchFilter === 'all' ? 'all fields' : searchFilter}
          </span>
          <button
            onClick={() => {
              setLocalQuery('');
              onSearch('', 'all');
            }}
            className="transition-colors"
            style={{ color: 'var(--accent-color)' }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactSearchBar; 