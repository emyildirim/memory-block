import { useState } from 'react';
import Swal from 'sweetalert2';

const MemoryCard = ({ memory, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      onDelete(memory._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="memory-card rounded-lg shadow-md p-6 layout-transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{memory.title}</h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(memory)}
            className="transition-colors"
            style={{ color: 'var(--accent-color)' }}
            title="Edit memory"
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete memory"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>

      {memory.tag && (
        <span 
          className="inline-block text-xs px-3 py-1 rounded-full mb-3"
          style={{ 
            backgroundColor: 'var(--accent-color)', 
            color: 'white',
            opacity: '0.9'
          }}
        >
          {memory.tag}
        </span>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex-1">
          {memory.context && (
            <p className="text-sm mb-2 sm:mb-0" style={{ color: 'var(--text-secondary)' }}>{memory.context}</p>
          )}
        </div>
        <div className="text-xs flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(memory.createdAt)}
        </div>
      </div>

      {memory.detail && (
        <div className="mb-3">
          <p 
            className={`text-sm ${!isExpanded && memory.detail.length > 150 ? 'line-clamp-3' : ''}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {isExpanded ? memory.detail : memory.detail.slice(0, 150)}
            {!isExpanded && memory.detail.length > 150 && '...'}
          </p>
          {memory.detail.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm mt-1 transition-colors"
              style={{ color: 'var(--accent-color)' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoryCard; 