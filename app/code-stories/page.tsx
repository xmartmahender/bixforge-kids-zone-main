'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import { db } from '../../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Story } from '../../lib/storyService';

export default function CodeStoriesPage() {
  const [codeStories, setCodeStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  useEffect(() => {
    const fetchCodeStories = async () => {
      try {
        setLoading(true);

        // Get all stories first
        const allStoriesQuery = query(collection(db, "stories"));
        const allStoriesSnapshot = await getDocs(allStoriesQuery);
        const allStories: Story[] = [];

        allStoriesSnapshot.forEach((doc) => {
          const storyData = { id: doc.id, ...doc.data() } as Story;

          // Check if it's a code story or has programming language tags
          const isCodeRelated =
            storyData.isCodeStory === true ||
            storyData.programmingLanguage ||
            (storyData.category && storyData.category.some(cat =>
              ['coding', 'programming', 'code', 'computer science', 'tech'].includes(cat.toLowerCase())
            )) ||
            (storyData.title && storyData.title.toLowerCase().includes('cod')) ||
            (storyData.description && storyData.description.toLowerCase().includes('cod'));

          // Check if it matches the age group filter
          const matchesAgeGroup =
            selectedAgeGroup === 'all' ||
            storyData.ageGroup === selectedAgeGroup;

          if (isCodeRelated && matchesAgeGroup) {
            if (selectedLanguage === 'all' ||
                (storyData.programmingLanguage && storyData.programmingLanguage.toLowerCase() === selectedLanguage.toLowerCase())) {
              allStories.push(storyData);
            }
          }
        });

        // Sort by creation date (newest first)
        allStories.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });

        console.log("Loaded code stories:", allStories.length);
        setCodeStories(allStories);
        setError('');
      } catch (err) {
        console.error('Error fetching code stories:', err);
        setError('Failed to load code stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodeStories();
  }, [selectedLanguage, selectedAgeGroup]);

  return (
    <div>
      <UserTracker contentType="code" contentId={`${selectedLanguage}-${selectedAgeGroup}`} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2">Coding Stories & Tutorials</h1>
        <p className="text-center text-gray-600 mb-8">
          Fun and interactive coding tutorials designed especially for kids
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          {/* Programming Language Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-gray-700">Filter by Programming Language:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-blue-100'
                }`}
              >
                All Languages
              </button>
              <button
                onClick={() => setSelectedLanguage('scratch')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'scratch'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 hover:bg-orange-100'
                }`}
              >
                Scratch
              </button>
              <button
                onClick={() => setSelectedLanguage('html')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'html'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 hover:bg-red-100'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setSelectedLanguage('css')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'css'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-blue-100'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setSelectedLanguage('javascript')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'javascript'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 hover:bg-yellow-100'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setSelectedLanguage('python')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === 'python'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-green-100'
                }`}
              >
                Python
              </button>
            </div>
          </div>

          {/* Age Group Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-gray-700">Filter by Age Group:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedAgeGroup('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgeGroup === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 hover:bg-purple-100'
                }`}
              >
                All Ages
              </button>
              <button
                onClick={() => setSelectedAgeGroup('0-3')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgeGroup === '0-3'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 hover:bg-purple-100'
                }`}
              >
                0-3 Years
              </button>
              <button
                onClick={() => setSelectedAgeGroup('3-6')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgeGroup === '3-6'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 hover:bg-purple-100'
                }`}
              >
                3-6 Years
              </button>
              <button
                onClick={() => setSelectedAgeGroup('6-9')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgeGroup === '6-9'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 hover:bg-purple-100'
                }`}
              >
                6-9 Years
              </button>
              <button
                onClick={() => setSelectedAgeGroup('9-12')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgeGroup === '9-12'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 hover:bg-purple-100'
                }`}
              >
                9-12 Years
              </button>
            </div>
          </div>
        </div>

        {/* Code Stories List */}
        {loading ? (
          <div className="text-center py-8">Loading code stories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : codeStories.length === 0 ? (
          <div className="text-center py-8">
            No code stories found for {selectedLanguage === 'all' ? 'any language' : selectedLanguage}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {codeStories.map(story => (
              <Link href={`/stories/${story.id}`} key={story.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <img
                      src={story.imageUrl || 'https://placehold.co/400x300/png?text=Code+Story'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                      {story.ageGroup}
                    </div>
                    <div className="absolute bottom-0 left-0 bg-gray-800 text-white px-2 py-1 text-xs rounded-tr-lg">
                      {story.programmingLanguage || 'Coding'}
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-lg mb-2 text-blue-700">{story.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{story.description}</p>
                  </div>
                  <div className="px-4 pb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      View Tutorial
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
