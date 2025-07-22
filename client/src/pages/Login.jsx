import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import Swal from 'sweetalert2';
// Background pattern - place your pattern image in public/ folder
// Will try common filenames: background-pattern.jpg, background-pattern.png, pattern.png

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    
    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill in all fields');
      showAlert('Error', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting login with:', { username: formData.username, password: '***' });
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      const { token, user } = response.data;
      
      login(user, token);
      
      showAlert('Success', 'Logged in successfully!', 'success')
        .then(() => {
          navigate('/dashboard');
        });
    } catch (error) {
      console.error('Login error:', error);
      
      // Get specific error message from response or use default
      const message = error.response?.data?.message || 'Invalid username or password';
      setErrorMessage(message);
      
      console.log('Showing SweetAlert with message:', message);
      showAlert('Login Failed', message, 'error');
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
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Overlay for better readability */}
      {/* Overlay for better readability - adjust opacity value (0-100) to change background transparency */}
      <div className="absolute inset-0 bg-white bg-opacity-75"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Logo and title */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Logo theme="light" className="w-14 h-14 md:w-16 md:h-16" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  Memory Blocks
                </h1>
                <span className="text-base text-gray-600">
                  Your Personal Knowledge Base
                </span>
              </div>
            </div>
          </div>
          
          {/* Sign in heading */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-center text-lg font-semibold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 