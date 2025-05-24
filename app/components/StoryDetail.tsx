'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story } from '../../lib/storyService';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface StoryDetailProps {
  storyId: string;
}

export default function StoryDetail({ storyId }: StoryDetailProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['English']);
  const [translationStatus, setTranslationStatus] = useState<'available' | 'unavailable'>('available');

  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) return;

      setLoading(true);
      try {
        const storyDoc = await getDoc(doc(db, 'stories', storyId));
        if (storyDoc.exists()) {
          const storyData = {
            id: storyDoc.id,
            ...storyDoc.data()
          } as Story;
          setStory(storyData);

          // Determine available languages
          const available = ['English']; // Default
          if (storyData.translations) {
            // If there are translations stored, add those languages
            Object.keys(storyData.translations).forEach(lang => {
              if (!available.includes(lang)) {
                available.push(lang);
              }
            });
          }
          setAvailableLanguages(available);
        }
      } catch (error) {
        console.error("Error loading story:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  // Check if translation is available when language changes
  useEffect(() => {
    if (!story) return;

    if (selectedLanguage === 'English' ||
        (story.translations && story.translations[selectedLanguage])) {
      setTranslationStatus('available');
    } else {
      setTranslationStatus('unavailable');
    }
  }, [selectedLanguage, story]);

  // Get content in the selected language
  const getTranslatedContent = () => {
    if (!story) return '';

    if (selectedLanguage === 'English') {
      return story.content || '';
    }

    if (story.translations && story.translations[selectedLanguage] &&
        story.translations[selectedLanguage].content) {
      return story.translations[selectedLanguage].content;
    }

    return story.content || ''; // Fallback to English
  };

  // Get title in the selected language
  const getTranslatedTitle = () => {
    if (!story) return '';

    if (selectedLanguage === 'English') {
      return story.title;
    }

    if (story.translations && story.translations[selectedLanguage] &&
        story.translations[selectedLanguage].title) {
      return story.translations[selectedLanguage].title;
    }

    return story.title; // Fallback to English
  };

  // Get description in the selected language
  const getTranslatedDescription = () => {
    if (!story) return '';

    if (selectedLanguage === 'English') {
      return story.description || '';
    }

    if (story.translations && story.translations[selectedLanguage] &&
        story.translations[selectedLanguage].description) {
      return story.translations[selectedLanguage].description;
    }

    return story.description || ''; // Fallback to English
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading story...</div>;
  }

  if (!story) {
    return <div className="flex justify-center items-center min-h-screen">Story not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/" className="inline-block mb-6 text-blue-600 hover:underline">
        &larr; Back to Stories
      </Link>

      {/* Language selector */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Translation unavailable message */}
      {translationStatus === 'unavailable' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            This story is not available in {selectedLanguage}. Showing English version instead.
          </p>
        </div>
      )}

      {/* Story Image */}
      <div className="mb-8">
        <img
          src={story.imageUrl || "https://placehold.co/800x400/png?text=Story+Image"}
          alt={getTranslatedTitle()}
          className="w-full h-auto rounded-lg shadow-md object-cover max-h-96"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/800x400/png?text=Story+Image";
          }}
        />
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
          {getTranslatedTitle()}
        </h1>
        <p className="text-gray-600 mb-6">Age group: {story.ageGroup}</p>

        {getTranslatedDescription() && (
          <div className="bg-purple-50 p-4 rounded-md mb-6 italic text-gray-700">
            {getTranslatedDescription()}
          </div>
        )}

        {getTranslatedContent() ? (
          <div className="prose max-w-none">
            {getTranslatedContent().split('\n').map((paragraph: string, idx: number) => {
              // Process text formatting
              let content = paragraph;

              // Format emphasis
              content = content.replace(/\*([^*]+)\*/g,
                '<span class="font-semibold text-purple-700">$1</span>'
              );

              // Format sound effects
              content = content.replace(/\b([A-Z]{2,}!+)\b/g,
                '<span class="font-bold text-lg text-red-600">$1</span>'
              );

              // Format dialogue
              content = content.replace(/"([^"]+)"/g,
                '<span class="text-blue-600">"$1"</span>'
              );

              return (
                <p key={idx} className="mb-4 text-lg"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            })}
          </div>
        ) : (
          <p>No content available for this story.</p>
        )}
      </div>
    </div>
  );
}