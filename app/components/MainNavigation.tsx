'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector, { useLanguage } from './LanguageSelector';
import { useTranslation } from '../lib/translations';

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentLanguage = useLanguage();
  const t = useTranslation(currentLanguage);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Kidz Zone
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-purple-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex space-x-6">
              <Link
                href="/"
                className={`${isActive('/') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/age-groups/0-3"
                className={`${pathname.startsWith('/age-groups') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.ageGroups')}
              </Link>
              <Link
                href="/code-stories"
                className={`${isActive('/code-stories') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.codeStories')}
              </Link>
              <Link
                href="/code-videos"
                className={`${isActive('/code-videos') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.codeVideos')}
              </Link>
              <Link
                href="/poems"
                className={`${isActive('/poems') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.poems')}
              </Link>
              <Link
                href="/blog"
                className={`${isActive('/blog') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.blog')}
              </Link>
              <Link
                href="/parents"
                className={`${isActive('/parents') ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-purple-700'} transition-colors`}
              >
                {t('nav.parents')}
              </Link>
            </div>
            <div className="flex items-center">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`${isActive('/') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/age-groups/0-3"
                className={`${pathname.startsWith('/age-groups') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.ageGroups')}
              </Link>
              <Link
                href="/code-stories"
                className={`${isActive('/code-stories') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.codeStories')}
              </Link>
              <Link
                href="/code-videos"
                className={`${isActive('/code-videos') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.codeVideos')}
              </Link>
              <Link
                href="/poems"
                className={`${isActive('/poems') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.poems')}
              </Link>
              <Link
                href="/blog"
                className={`${isActive('/blog') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                href="/parents"
                className={`${isActive('/parents') ? 'text-purple-700 font-semibold' : 'text-gray-600'} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.parents')}
              </Link>
              <div className="py-2 border-t border-gray-200 mt-2 pt-4">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
