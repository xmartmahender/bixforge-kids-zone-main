'use client';

import React, { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Always redirect to external admin site
    window.location.href = '/kidz-zone-admin/admin-login.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-4">Admin Access</h1>
        <p className="text-purple-200 mb-4">
          Admin functions are managed through the separate admin dashboard.
        </p>
        <p className="text-purple-200">
          Redirecting to admin login...
          <a href="/kidz-zone-admin/admin-login.html" className="text-yellow-400 hover:underline ml-1">
            Click here if not redirected
          </a>
        </p>
      </div>
    </div>
  );
}
