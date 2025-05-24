'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import { Video, getCodeVideos, getYouTubeVideoId } from '../../lib/videoService';

export default function CodeVideosPage() {
  const [codeVideos, setCodeVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  useEffect(() => {
    const fetchCodeVideos = async () => {
      try {
        setLoading(true);
        const ageGroupFilter = selectedAgeGroup === 'all' ? '' : selectedAgeGroup;
        const languageFilter = selectedLanguage === 'all' ? '' : selectedLanguage;

        const videosData = await getCodeVideos(ageGroupFilter, languageFilter, 20);
        console.log("Loaded code videos:", videosData.length);
        setCodeVideos(videosData);
        setError('');
      } catch (err) {
        console.error('Error fetching code videos:', err);
        setError('Failed to load code videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodeVideos();
  }, [selectedLanguage, selectedAgeGroup]);

  return (
    <div>
      <UserTracker contentType="video" contentId={`${selectedLanguage}-${selectedAgeGroup}`} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2">Coding Videos & Tutorials</h1>
        <p className="text-center text-gray-600 mb-8">
          Fun and interactive coding video tutorials designed especially for kids
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

        {/* Code Videos List */}
        {loading ? (
          <div className="text-center py-8">Loading code videos...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : codeVideos.length === 0 ? (
          <div className="text-center py-8">
            No code videos found for {selectedLanguage === 'all' ? 'any language' : selectedLanguage}
            {selectedAgeGroup !== 'all' ? ` and age group ${selectedAgeGroup}` : ''}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {codeVideos.map(video => {
              const videoId = getYouTubeVideoId(video.videoUrl);

              return (
                <Link href={`/videos/${video.id}`} key={video.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <img
                        src={video.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || 'https://placehold.co/400x300/png?text=Code+Video'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                        {video.ageGroup}
                      </div>
                      {video.programmingLanguage && (
                        <div className="absolute bottom-0 left-0 bg-gray-800 text-white px-2 py-1 text-xs rounded-tr-lg">
                          {video.programmingLanguage}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2 text-blue-700">{video.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
