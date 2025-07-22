import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memoryAPI } from '../services/api';
import MemoryCard from '../components/MemoryCard';
import FilterModal from '../components/FilterModal';
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

  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Memory App</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <Link
                to="/settings"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={handleCreateMemory}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Memory
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Search & Filter
            </button>
          </div>
          {(searchQuery || searchFilter !== 'all') && (
            <div className="text-sm text-gray-600">
              {memories.length} result(s) for "{searchQuery}" in {searchFilter}
              <button
                onClick={() => handleSearch('', 'all')}
                className="text-blue-600 hover:text-blue-800 ml-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Memories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading memories...</div>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchQuery ? 'No memories found matching your search' : 'No memories yet'}
            </div>
            {!searchQuery && (
              <button
                onClick={handleCreateMemory}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create your first memory
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingMemory ? 'Edit Memory' : 'Create New Memory'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter memory title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context
                </label>
                <input
                  type="text"
                  value={memoryForm.context}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter context"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  value={memoryForm.tag}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tag (e.g., important, reminder)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail
                </label>
                <textarea
                  value={memoryForm.detail}
                  onChange={(e) => setMemoryForm(prev => ({ ...prev, detail: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter detailed description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingMemory ? 'Update Memory' : 'Create Memory'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
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