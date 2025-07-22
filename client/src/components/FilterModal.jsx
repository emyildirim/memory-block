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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Search & Filter</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="filter-select" className="block text-sm font-medium text-gray-700 mb-2">
              Search In
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Fields</option>
              <option value="title">Title Only</option>
              <option value="context">Context Only</option>
              <option value="tag">Tag Only</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
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