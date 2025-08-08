import { useEffect } from 'react';

const MemoryDetailModal = ({ memory, isOpen, onClose, onEdit, onDelete }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen || !memory) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto layout-transition shadow-2xl"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {memory.title}
            </h2>
            {memory.tag && (
              <span 
                className="inline-block text-sm px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white',
                  opacity: '0.9'
                }}
              >
                {memory.tag}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onEdit(memory);
                onClose();
              }}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-20"
              style={{ 
                color: 'var(--accent-color)',
                backgroundColor: 'transparent'
              }}
              title="Edit memory"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.opacity = '0.1';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.opacity = '1';
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <button
              onClick={() => {
                onDelete(memory._id);
                onClose();
              }}
              className="p-2 rounded-lg text-red-600 hover:text-red-800 transition-colors hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
              title="Delete memory"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ color: 'var(--text-secondary)' }}
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Context */}
          {memory.context && (
            <div>
              <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Context
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {memory.context}
              </p>
            </div>
          )}

          {/* Detail */}
          {memory.detail && (
            <div>
              <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Details
              </h3>
              <div 
                className="prose max-w-none leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--text-primary)' }}
              >
                {memory.detail}
              </div>
            </div>
          )}

          {/* If no context or detail */}
          {!memory.context && !memory.detail && (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              <p>No additional details available for this memory.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Created: {formatDate(memory.createdAt)}
            </div>
            
            {memory.updatedAt && memory.updatedAt !== memory.createdAt && (
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Last updated: {formatDate(memory.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetailModal;
