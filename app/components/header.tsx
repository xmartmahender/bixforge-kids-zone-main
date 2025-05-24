'use client';

import React from 'react';
import MainNavigation from './MainNavigation';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <MainNavigation />
      </div>
    </header>
  );
}
