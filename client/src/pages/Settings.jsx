import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, memoryAPI } from '../services/api';
import Logo from '../components/Logo';
import Swal from 'sweetalert2';

const Settings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Swal.fire('Error', 'Failed to fetch user profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const response = await memoryAPI.exportCSV();
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'memories.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      Swal.fire('Success', 'Memories exported successfully!', 'success');
    } catch (error) {
      const message = error.response?.data?.message || 'Export failed';
      Swal.fire('Error', message, 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account?',
      html: `
        <p><strong>This action cannot be undone!</strong></p>
        <p>This will permanently delete:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>• Your account</li>
          <li>• All your memories</li>
          <li>• All associated data</li>
        </ul>
        <p>Type <strong>"DELETE"</strong> to confirm:</p>
      `,
      input: 'text',
      inputPlaceholder: 'Type DELETE to confirm',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete Account',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (value !== 'DELETE') {
          return 'Please type "DELETE" to confirm';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        await userAPI.deleteAccount();
        
        Swal.fire({
          title: 'Account Deleted',
          text: 'Your account and all data have been permanently deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          logout();
          navigate('/login');
        });
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete account';
        Swal.fire('Error', message, 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center layout-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen layout-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="shadow layout-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <Logo theme={theme} className="w-10 h-10 md:w-12 md:h-12" />
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Settings
                </h1>
                <span className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Manage Your Memory Blocks
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
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
              
              <Link
                to="/dashboard"
                className="transition-colors"
                style={{ color: 'var(--accent-color)' }}
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          {/* User Profile Section */}
          <div className="memory-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Username</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{userProfile?.user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Account Created</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {userProfile?.user?.createdAt && formatDate(userProfile.user.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span style={{ color: 'var(--text-secondary)' }}>Total Memories</span>
                <span className="font-medium" style={{ color: 'var(--accent-color)' }}>
                  {userProfile?.memoryCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="memory-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Data Management</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Export Data</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Download all your memories as a CSV file
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={exportLoading || userProfile?.memoryCount === 0}
                  className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportLoading ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              {userProfile?.memoryCount === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No memories to export. Create some memories first!
                </p>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="memory-card rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Delete Account</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Permanently delete your account and all associated data.
                    <br />
                    <strong className="text-red-600">This action cannot be undone!</strong>
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="memory-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>About Memory Blocks</h2>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>Version 1.2.0</p>
              <p>A simple and secure way to store and organize your thoughts and memories.</p>
              <p>© 2025 Memory Blocks. All rights reserved.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 