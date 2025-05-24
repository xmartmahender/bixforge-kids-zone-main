'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  registerUserSession,
  updateUserSession,
  trackContentInteraction,
  trackPageView
} from '../../lib/userTrackingService';

interface UserTrackerProps {
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12';
  contentType?: 'story' | 'video' | 'code' | 'general';
  contentId?: string;
}

export default function UserTracker({ ageGroup, contentType, contentId }: UserTrackerProps) {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const lastPageRef = useRef<string>('');

  // Auto-detect age group from URL if not provided
  const detectAgeGroup = (path: string): '0-3' | '3-6' | '6-9' | '9-12' | undefined => {
    if (ageGroup) return ageGroup;
    if (path.includes('0-3') || path.includes('babies') || path.includes('toddlers')) return '0-3';
    if (path.includes('3-6') || path.includes('preschool')) return '3-6';
    if (path.includes('6-9') || path.includes('elementary')) return '6-9';
    if (path.includes('9-12') || path.includes('tweens') || path.includes('code')) return '9-12';
    return undefined;
  };

  // Auto-detect content type from URL if not provided
  const detectContentType = (path: string): 'story' | 'video' | 'code' | 'general' => {
    if (contentType) return contentType;
    if (path.includes('/stories/') || path.includes('/story/')) return 'story';
    if (path.includes('/videos/') || path.includes('/video/')) return 'video';
    if (path.includes('/code/') || path.includes('/coding/') || path.includes('/programming/')) return 'code';
    return 'general';
  };

  // Auto-extract content ID from URL if not provided
  const extractContentId = (path: string): string | undefined => {
    if (contentId) return contentId;
    const segments = path.split('/');
    if (segments.length >= 3 && (segments[1] === 'stories' || segments[1] === 'videos' || segments[1] === 'code')) {
      return segments[2];
    }
    return undefined;
  };

  // Initialize tracking on mount
  useEffect(() => {
    const initializeTracking = async () => {
      try {
        const detectedAgeGroup = detectAgeGroup(pathname);
        const detectedContentType = detectContentType(pathname);
        const detectedContentId = extractContentId(pathname);

        const sessionId = await registerUserSession(
          pathname,
          detectedAgeGroup,
          detectedContentType,
          detectedContentId
        );

        sessionIdRef.current = sessionId;
        lastPageRef.current = pathname;

        // Track initial content interaction if on content page
        if (sessionId && detectedContentType !== 'general' && detectedContentId) {
          await trackContentInteraction(
            sessionId,
            detectedContentType,
            detectedContentId,
            document.title || 'Unknown Content',
            detectedAgeGroup || '6-9', // Default age group
            'view'
          );
        }
      } catch (error) {
        console.error('Error initializing user tracking:', error);
      }
    };

    initializeTracking();

    // Cleanup function
    return () => {
      const cleanup = (window as { userSessionCleanup?: () => Promise<void> }).userSessionCleanup;
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Track page changes
  useEffect(() => {
    if (lastPageRef.current && lastPageRef.current !== pathname) {
      const handlePageChange = async () => {
        try {
          const detectedAgeGroup = detectAgeGroup(pathname);
          const detectedContentType = detectContentType(pathname);
          const detectedContentId = extractContentId(pathname);

          // Update session with new page
          await updateUserSession(pathname, detectedAgeGroup, detectedContentType, detectedContentId);

          // Track page view
          if (sessionIdRef.current) {
            await trackPageView(sessionIdRef.current, pathname, detectedAgeGroup, detectedContentType, detectedContentId);

            // Track content interaction if on content page
            if (detectedContentType !== 'general' && detectedContentId) {
              await trackContentInteraction(
                sessionIdRef.current,
                detectedContentType,
                detectedContentId,
                document.title || 'Unknown Content',
                detectedAgeGroup || '6-9',
                'view'
              );
            }
          }

          lastPageRef.current = pathname;
        } catch (error) {
          console.error('Error tracking page change:', error);
        }
      };

      handlePageChange();
    }
  }, [pathname, ageGroup, contentType, contentId]);

  // Track user interactions
  useEffect(() => {
    const trackInteraction = (action: 'like' | 'share' | 'complete') => {
      return async () => {
        if (sessionIdRef.current) {
          const detectedContentType = detectContentType(pathname);
          const detectedContentId = extractContentId(pathname);
          const detectedAgeGroup = detectAgeGroup(pathname);

          if (detectedContentType !== 'general' && detectedContentId) {
            await trackContentInteraction(
              sessionIdRef.current,
              detectedContentType,
              detectedContentId,
              document.title || 'Unknown Content',
              detectedAgeGroup || '6-9',
              action
            );
          }
        }
      };
    };

    // Listen for custom events from content components
    const handleLike = trackInteraction('like');
    const handleShare = trackInteraction('share');
    const handleComplete = trackInteraction('complete');

    window.addEventListener('content-liked', handleLike);
    window.addEventListener('content-shared', handleShare);
    window.addEventListener('content-completed', handleComplete);

    return () => {
      window.removeEventListener('content-liked', handleLike);
      window.removeEventListener('content-shared', handleShare);
      window.removeEventListener('content-completed', handleComplete);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
