import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import Swal from 'sweetalert2';
// Background pattern - place your pattern image in public/ folder
// Will try common filenames: background-pattern.jpg, background-pattern.png, pattern.png

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Try different background pattern filenames from public folder
  const getBackgroundPattern = () => {
    return '/background-pattern.png'; // Place your pattern in public/ folder
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const showAlert = (title, text, icon) => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all fields');
      showAlert('Error', 'Please fill in all fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      showAlert('Error', 'Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      showAlert('Error', 'Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting registration with:', { username: formData.username, password: '***' });
      const response = await authAPI.register({
        username: formData.username,
        password: formData.password
      });
      console.log('Registration response:', response);
      
      const { token, user } = response.data;
      
      login(user, token);
      
      showAlert('Success', 'Account created successfully!', 'success')
        .then(() => {
          navigate('/dashboard');
        });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Get specific error message from response or use default
      const message = error.response?.data?.message || 'Registration failed';
      setErrorMessage(message);
      
      console.log('Showing SweetAlert with message:', message);
      showAlert('Registration Failed', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${getBackgroundPattern()})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundColor: 'var(--bg-secondary)'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-secondary)', opacity: 0.95 }}></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="memory-card py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Logo and title */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Logo theme="light" className="w-14 h-14 md:w-16 md:h-16" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Memory Blocks
                </h1>
                <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  Your Personal Knowledge Base
                </span>
              </div>
            </div>
          </div>
          
          {/* Create account heading */}
          <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-center text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Or{' '}
              <Link
                to="/login"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                sign in to existing account
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--accent-color)',
                    borderColor: 'var(--border-color)'
                  }}
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--accent-color)',
                    borderColor: 'var(--border-color)'
                  }}
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--accent-color)',
                    borderColor: 'var(--border-color)'
                  }}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 