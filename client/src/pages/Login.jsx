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
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Try different background pattern filenames from public folder
  const getBackgroundPattern = () => {
    return '/background-pattern.jpg'; // Place your pattern in public/ folder
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      login(user, token);
      
      Swal.fire('Success', 'Logged in successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      Swal.fire('Error', message, 'error');
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
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <Logo theme="light" className="w-10 h-10" />
            <div className="flex flex-col">
              <h1 
                className="text-2xl font-bold text-gray-900 leading-tight"
                style={{
                  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8), 1px -1px 2px rgba(255, 255, 255, 0.8), -1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}
              >
                Memory Blocks
              </h1>
              <span 
                className="text-sm text-gray-600"
                style={{
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.8)'
                }}
              >
                Your Personal Knowledge Base
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 
            className="text-center text-lg font-semibold text-gray-900"
            style={{
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8), 1px -1px 2px rgba(255, 255, 255, 0.8), -1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            Sign in to your account
          </h2>
          <p 
            className="mt-2 text-center text-sm text-gray-600"
            style={{
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.8)'
            }}
          >
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
              style={{
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.8)'
              }}
            >
              create a new account
            </Link>
          </p>
        </div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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