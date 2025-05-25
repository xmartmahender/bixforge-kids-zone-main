'use client';

import React, { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Check if user is already authenticated
    const sessionData = localStorage.getItem('bixforge_admin_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (now < expiresAt) {
        // User is authenticated, redirect to dashboard
        window.location.href = '/admin-dashboard.html';
        return;
      }
    }

    // User is not authenticated, redirect to login
    window.location.href = '/admin-login.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting to Admin Login...</h1>
        <p className="text-purple-200">
          If you're not redirected automatically,
          <a href="/admin-login.html" className="text-yellow-400 hover:underline ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
