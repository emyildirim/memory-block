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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">{memory.title}</h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(memory)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit memory"
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {memory.tag && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
          {memory.tag}
        </span>
      )}

      {memory.context && (
        <p className="text-gray-600 mb-3 text-sm">{memory.context}</p>
      )}

      {memory.detail && (
        <div className="mb-3">
          <p className={`text-gray-700 text-sm ${!isExpanded && memory.detail.length > 150 ? 'line-clamp-3' : ''}`}>
            {isExpanded ? memory.detail : memory.detail.slice(0, 150)}
            {!isExpanded && memory.detail.length > 150 && '...'}
          </p>
          {memory.detail.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400">
        {formatDate(memory.createdAt)}
      </div>
    </div>
  );
};

export default MemoryCard; 