'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector, { useLanguage } from './LanguageSelector';
import { useTranslation } from '../lib/translations';

interface MainNavigationProps {
  isScrolled: boolean;
}

export default function MainNavigation({ isScrolled }: MainNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const currentLanguage = useLanguage();
  const t = useTranslation(currentLanguage);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigationItems = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/age-groups/0-3', label: t('nav.ageGroups'), icon: '👶' },
    { href: '/code-stories', label: t('nav.codeStories'), icon: '📚' },
    { href: '/code-videos', label: t('nav.codeVideos'), icon: '🎥' },
    { href: '/code-playground', label: 'Code IDE', icon: '💻' },
    { href: '/poems', label: t('nav.poems'), icon: '🎪' },
    { href: '/blog', label: t('nav.blog'), icon: '✍️' },
    { href: '/parents', label: t('nav.parents'), icon: '👪' },
  ];

  return (
    <nav className="relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className={`
            flex items-center space-x-3 text-2xl font-bold transition-all duration-300
            ${isScrolled
              ? 'text-purple-700 hover:text-purple-800'
              : 'text-white hover:text-yellow-200'
            }
          `}
        >
          <div className="relative">
            <span className="text-3xl">🌟</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
            BixForge Solutions
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className={`
            md:hidden p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
            ${isScrolled
              ? 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'
              : 'text-white hover:text-yellow-200 hover:bg-white/10'
            }
          `}
          onClick={toggleMenu}
        >
          <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActiveItem = item.href === '/' ? isActive('/') : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                    flex items-center space-x-2
                    ${isActiveItem
                      ? isScrolled
                        ? 'text-purple-700 bg-purple-100'
                        : 'text-yellow-200 bg-white/20'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                    }
                  `}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>

                  {/* Active indicator */}
                  {isActiveItem && (
                    <div className={`
                      absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full
                      ${isScrolled ? 'bg-purple-600' : 'bg-yellow-300'}
                    `} />
                  )}

                  {/* Hover effect */}
                  {hoveredItem === item.href && !isActiveItem && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className={`
              px-3 py-2 rounded-lg transition-all duration-300
              ${isScrolled ? 'bg-purple-50' : 'bg-white/10'}
            `}>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className={`
          md:hidden absolute top-full left-0 right-0 z-40
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-t border-purple-100'
            : 'bg-gradient-to-b from-purple-600/95 to-pink-500/95 backdrop-blur-md'
          }
          shadow-lg rounded-b-2xl mx-4 mt-2
        `}>
          <div className="p-6 space-y-4">
            {navigationItems.map((item) => {
              const isActiveItem = item.href === '/' ? isActive('/') : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-300
                    ${isActiveItem
                      ? isScrolled
                        ? 'text-purple-700 bg-purple-100'
                        : 'text-yellow-200 bg-white/20'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                  {isActiveItem && (
                    <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}

            <div className={`
              mt-6 pt-4 border-t
              ${isScrolled ? 'border-purple-200' : 'border-white/20'}
            `}>
              <div className={`
                p-3 rounded-xl
                ${isScrolled ? 'bg-purple-50' : 'bg-white/10'}
              `}>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
