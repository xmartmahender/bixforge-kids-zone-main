'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionDashboard from '../components/admin/SubscriptionDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const sessionData = localStorage.getItem('bixforge_admin_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (now < expiresAt) {
        // User is authenticated, show integrated dashboard
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
    }

    // User is not authenticated, redirect to login
    window.location.href = '/admin-login.html';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <SubscriptionDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting to Admin Login...</h1>
        <p className="text-purple-200">
          If you&apos;re not redirected automatically,
          <a href="/admin-login.html" className="text-yellow-400 hover:underline ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
