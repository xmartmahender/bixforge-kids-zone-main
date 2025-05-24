'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminPasswordReset from '../components/admin/AdminPasswordReset';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('admin123');

  // Load saved password from localStorage on component mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setCurrentPassword(savedPassword);
    }
  }, []);

  const handleLogin = (password: string) => {
    // Check against current password (default or reset password)
    if (password === currentPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handlePasswordReset = (newPassword: string) => {
    setCurrentPassword(newPassword);
    setShowPasswordReset(false);
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show password reset component
  if (showPasswordReset) {
    return (
      <AdminPasswordReset
        onBack={handleBackToLogin}
        onPasswordReset={handlePasswordReset}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">🔐 Admin Access</h1>
              <p className="text-white/90">Enter your password to access the admin dashboard</p>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const password = formData.get('password') as string;
              handleLogin(password);
            }} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
              >
                🚀 Login to Admin Dashboard
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-6 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
              >
                🔑 Forgot Password? Reset Here
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-center">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  💡 Default Admin Credentials
                </p>
                <p className="text-xs text-blue-600">
                  Password: <code className="bg-blue-100 px-2 py-1 rounded">admin123</code>
                </p>
                <p className="text-xs text-blue-500 mt-2">
                  You can reset this password using the &quot;Forgot Password&quot; option above
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">🔐 Admin Panel</h1>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>Password: {currentPassword === 'admin123' ? 'Default' : 'Custom'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPasswordReset(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                🔑 Change Password
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminDashboard />
    </div>
  );
}
