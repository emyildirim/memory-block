import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memoryAPI } from '../services/api';
import MemoryCard from '../components/MemoryCard';
import FilterModal from '../components/FilterModal';
import CompactSearchBar from '../components/CompactSearchBar';
import Logo from '../components/Logo';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    context: '',
    tag: '',
    detail: ''
  });

  const { user, logout, theme, toggleTheme, layout, toggleLayout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemories();
  }, [searchQuery, searchFilter]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery && searchFilter) {
        params.query = searchQuery;
        params.filter = searchFilter;
      }
      
      const response = await memoryAPI.getAll(params);
      setMemories(response.data);
    } catch (error) {
      console.error('Error fetching memories:', error);
      Swal.fire('Error', 'Failed to fetch memories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, filter) => {
    setSearchQuery(query);
    setSearchFilter(filter);
  };

  const handleCreateMemory = () => {
    setMemoryForm({
      title: '',
      context: '',
      tag: '',
      detail: ''
    });
    setEditingMemory(null);
    setIsCreateModalOpen(true);
  };

  const handleEditMemory = (memory) => {
    setMemoryForm({
      title: memory.title,
      context: memory.context || '',
      tag: memory.tag || '',
      detail: memory.detail || ''
    });
    setEditingMemory(memory);
    setIsCreateModalOpen(true);
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    
    if (!memoryForm.title.trim()) {
      Swal.fire('Error', 'Title is required', 'error');
      return;
    }

    try {
      if (editingMemory) {
        await memoryAPI.update(editingMemory._id, memoryForm);
        Swal.fire('Success', 'Memory updated successfully!', 'success');
      } else {
        await memoryAPI.create(memoryForm);
        Swal.fire('Success', 'Memory created successfully!', 'success');
      }
      
      setIsCreateModalOpen(false);
      setEditingMemory(null);
      fetchMemories();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save memory';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    try {
      await memoryAPI.delete(memoryId);
      Swal.fire('Success', 'Memory deleted successfully!', 'success');
      fetchMemories();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete memory';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen layout-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="shadow layout-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-3">
              <Logo theme={theme} />
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Memory Blocks
                </h1>
                <span className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your Personal Knowledge Base
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop navigation */}
              <div className="mobile-hide flex items-center space-x-4">
                <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.username}</span>
              </div>

              {/* Control buttons - Same order on mobile and desktop */}
              <div className="flex items-center space-x-2">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>

                {/* Layout toggle */}
                <button
                  onClick={toggleLayout}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  title={`Switch to ${layout === 'classic' ? 'compact' : 'classic'} layout`}
                >
                  {layout === 'classic' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V17m0-10a2 2 0 012 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                    </svg>
                  )}
                </button>

                {/* Settings - Now visible on both mobile and desktop */}
                <Link
                  to="/settings"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--accent-color)' }}
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>

                {/* Desktop logout button */}
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-3 py-2 rounded-lg text-sm mobile-hide"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {layout === 'compact' ? (
          // Compact Layout
          <>
            <CompactSearchBar
              onSearch={handleSearch}
              onAddMemory={handleCreateMemory}
              onOpenFilter={() => setIsFilterModalOpen(true)}
              searchQuery={searchQuery}
              searchFilter={searchFilter}
            />
          </>
        ) : (
          // Classic Layout
          <>
            <div className="mobile-stack flex justify-between items-center mb-8">
              <div className="flex space-x-4 mobile-full-width">
                <button
                  onClick={handleCreateMemory}
                  className="btn-primary px-6 py-2 rounded-lg mobile-full-width"
                >
                  Add Memory
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="btn-secondary px-6 py-2 rounded-lg mobile-full-width"
                >
                  Search & Filter
                </button>
              </div>
              {(searchQuery || searchFilter !== 'all') && (
                <div className="text-sm mobile-full-width mt-4 md:mt-0" style={{ color: 'var(--text-secondary)' }}>
                  {memories.length} result(s) for "{searchQuery}" in {searchFilter === 'all' ? 'all fields' : searchFilter}
                  <button
                    onClick={() => handleSearch('', 'all')}
                    className="ml-2 transition-colors"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Memories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div style={{ color: 'var(--text-secondary)' }}>Loading memories...</div>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'No memories found matching your search' : 'No memories yet'}
            </div>
            {!searchQuery && (
              <button
                onClick={handleCreateMemory}
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Create your first memory
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {memories.map(memory => (
              <MemoryCard
                key={memory._id}
                memory={memory}
                onEdit={handleEditMemory}
                onDelete={handleDeleteMemory}
              />
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onSearch={handleSearch}
        currentQuery={searchQuery}
        currentFilter={searchFilter}
      />

      {/* Create/Edit Memory Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto layout-transition"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {editingMemory ? 'Edit Memory' : 'Create New Memory'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Enter memory title"
                  required
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
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Context
                </label>
                <input
                  type="text"
                  value={memoryForm.context}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Enter context"
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
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Tag
                </label>
                <input
                  type="text"
                  value={memoryForm.tag}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Enter tag (e.g., important, reminder)"
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
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Detail
                </label>
                <textarea
                  value={memoryForm.detail}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, detail: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md focus:outline-none transition-all resize-vertical"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Enter detailed description"
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

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2 px-4 rounded-lg"
                >
                  {editingMemory ? 'Update Memory' : 'Create Memory'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 btn-secondary py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 