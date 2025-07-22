import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, memoryAPI } from '../services/api';
import Swal from 'sweetalert2';

const Settings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const { user, logout } = useAuth();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Username</span>
                <span className="font-medium">{userProfile?.user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Account Created</span>
                <span className="font-medium">
                  {userProfile?.user?.createdAt && formatDate(userProfile.user.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Memories</span>
                <span className="font-medium text-blue-600">
                  {userProfile?.memoryCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Export Data</h3>
                  <p className="text-sm text-gray-600">
                    Download all your memories as a CSV file
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={exportLoading || userProfile?.memoryCount === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportLoading ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              {userProfile?.memoryCount === 0 && (
                <p className="text-sm text-gray-500">
                  No memories to export. Create some memories first!
                </p>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data.
                    <br />
                    <strong className="text-red-600">This action cannot be undone!</strong>
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Memory App</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Version 1.0.0</p>
              <p>A simple and secure way to store and organize your memories.</p>
              <p>Built with React, Node.js, Express, and MongoDB.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 