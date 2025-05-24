'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import { Story, getAdminPosts } from '../../lib/storyService';
import { Video, getAdminVideoPosts, getYouTubeVideoId } from '../../lib/videoService';

export default function AdminPostsPage() {
  const [adminStories, setAdminStories] = useState<Story[]>([]);
  const [adminVideos, setAdminVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchAdminPosts = async () => {
      try {
        setLoading(true);
        const [storiesData, videosData] = await Promise.all([
          getAdminPosts(20), // Get more admin stories
          getAdminVideoPosts(20) // Get more admin videos
        ]);
        
        setAdminStories(storiesData);
        setAdminVideos(videosData);
        setError('');
      } catch (err) {
        console.error('Error fetching admin posts:', err);
        setError('Failed to load admin posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminPosts();
  }, []);

  const filteredStories = adminStories.filter(story => 
    activeTab === 'all' || 
    (activeTab === 'featured' && story.featured) ||
    (activeTab === 'code' && story.isCodeStory)
  );

  const filteredVideos = adminVideos.filter(video => 
    activeTab === 'all' || 
    (activeTab === 'featured' && video.featured) ||
    (activeTab === 'code' && video.isCodeVideo)
  );

  return (
    <div>
      <UserTracker contentType="general" contentId={activeTab} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2">Admin Posts</h1>
        <p className="text-center text-gray-600 mb-8">
          Latest content added by our administrators
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-md">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'featured'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Code Content
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading admin posts...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-12">
            {/* Admin Stories */}
            {filteredStories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-purple-700">Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredStories.map(story => (
                    <Link href={`/stories/${story.id}`} key={story.id}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                        <div className="relative h-48 w-full">
                          <img 
                            src={story.imageUrl || 'https://placehold.co/400x300/png?text=Story'} 
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-purple-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                            {story.ageGroup}
                          </div>
                          {story.featured && (
                            <div className="absolute top-0 left-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded-br-lg">
                              Featured
                            </div>
                          )}
                          {story.isCodeStory && (
                            <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-tr-lg">
                              Code Story
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow">
                          <h3 className="font-bold text-lg mb-2 text-purple-700">{story.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{story.description}</p>
                        </div>
                        <div className="px-4 pb-4">
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Read Story
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Videos */}
            {filteredVideos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-pink-700">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredVideos.map(video => {
                    const videoId = getYouTubeVideoId(video.videoUrl);
                    
                    return (
                      <Link href={`/videos/${video.id}`} key={video.id}>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                          <div className="relative h-48 w-full">
                            <img 
                              src={video.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || 'https://placehold.co/400x300/png?text=Video'} 
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
                            <div className="absolute top-0 right-0 bg-pink-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                              {video.ageGroup}
                            </div>
                            {video.featured && (
                              <div className="absolute top-0 left-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded-br-lg">
                                Featured
                              </div>
                            )}
                            {video.isCodeVideo && (
                              <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-tr-lg">
                                Code Video
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-grow">
                            <h3 className="font-bold text-lg mb-2 text-pink-700">{video.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                          </div>
                          <div className="px-4 pb-4">
                            <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                              Watch Video
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredStories.length === 0 && filteredVideos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No admin posts found for the selected filter.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
