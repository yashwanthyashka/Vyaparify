import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      const userData = {
        ...res.data.user,
        token: res.data.token
      };

      login(userData);
      localStorage.setItem('token', res.data.token);
      
      // Show success message
      setShowSuccess(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate(userData.isAdmin ? '/admin/dashboard' : '/');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-gray-800/90 text-white px-8 py-6 rounded-2xl shadow-xl 
                        border border-white/10 backdrop-blur-xl animate-fadeIn
                        flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-lg text-emerald-500">Success!</h3>
              <p className="text-gray-300">Login successful! Redirecting...</p>
            </div>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-600/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.8) 2px, transparent 2px), linear-gradient(90deg, rgba(17, 24, 39, 0.8) 2px, transparent 2px)`,
        backgroundSize: '50px 50px',
        opacity: '0.1'
      }} />

      <div className="relative max-w-md w-full">
        {/* Floating elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-xl animate-blob delay-200" />

        {/* Main card */}
        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 p-8 overflow-hidden">
          {/* Gradient line at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

          <div className="text-center relative">
            {/* Animated icon container */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-full">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl p-4 text-sm backdrop-blur-xl animate-fadeIn">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email input */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur group-hover:blur-xl transition-all duration-300" />
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-white/10 rounded-xl 
                             text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-gray-900/70
                             hover:bg-gray-900/70 hover:border-white/20"
                    placeholder="Email address"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur group-hover:blur-xl transition-all duration-300" />
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-white/10 rounded-xl 
                             text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-gray-900/70
                             hover:bg-gray-900/70 hover:border-white/20"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 group-hover:opacity-90 transition-opacity" />
              <div className="relative flex items-center justify-center py-3 px-4 space-x-2">
                <span className="font-medium text-white">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </span>
                {!isLoading && (
                  <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                )}
                {isLoading && (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </div>
            </button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-emerald-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>

     
    </div>
  );
}







