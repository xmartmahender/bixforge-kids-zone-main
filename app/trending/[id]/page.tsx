'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/header';
import Footer from '../../components/footer';
import UserTracker from '../../components/UserTracker';
import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { FaFire, FaEye, FaHeart, FaClock, FaArrowLeft, FaShare, FaStar } from 'react-icons/fa';

type TrendingStory = {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  ageGroup: string;
  category?: string[] | string; // Can be array or string
  views: number;
  likes: number;
  priority: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
};

export default function TrendingStoryPage() {
  const params = useParams();
  const storyId = params.id as string;
  const [story, setStory] = useState<TrendingStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;

      try {
        setLoading(true);

        // Fetch story from Firebase
        const storyDoc = await getDoc(doc(db, 'trending_stories', storyId));

        if (storyDoc.exists()) {
          const storyData = { id: storyDoc.id, ...storyDoc.data() } as TrendingStory;
          setStory(storyData);

          // Increment view count
          await updateDoc(doc(db, 'trending_stories', storyId), {
            views: increment(1)
          });

          console.log('📖 Trending story loaded:', storyData.title);
        } else {
          setError('Trending story not found');
        }
      } catch (err) {
        console.error('Error fetching trending story:', err);
        setError('Failed to load trending story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  const handleLike = async () => {
    if (!story || liked) return;

    try {
      await updateDoc(doc(db, 'trending_stories', story.id), {
        likes: increment(1)
      });

      setStory(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setLiked(true);

      // Store in localStorage to prevent multiple likes
      localStorage.setItem(`liked_trending_${story.id}`, 'true');
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    // Check if user already liked this story
    if (story) {
      const hasLiked = localStorage.getItem(`liked_trending_${story.id}`);
      setLiked(!!hasLiked);
    }
  }, [story]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trending story...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The trending story you\'re looking for doesn\'t exist.'}</p>
              <Link href="/trending" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Back to Trending Stories
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UserTracker contentType="trending_story" contentId={story.id} />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/trending" className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors group">
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Trending Stories
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <FaShare className="mr-1" />
                Share
              </button>
            </div>
          </div>

          {/* Story Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={story.imageUrl || 'https://placehold.co/800x400/orange/white?text=Trending+Story'}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Trending Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <FaFire className="mr-2" />
                  Trending Story
                </div>
              </div>

              {/* Priority Badge */}
              {story.priority > 5 && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center">
                    <FaStar className="mr-1" />
                    Hot
                  </div>
                </div>
              )}
            </div>

            {/* Story Info */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Ages {story.ageGroup}
                </span>
                {story.category && Array.isArray(story.category) && story.category.map((cat, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
                {story.category && typeof story.category === 'string' && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {story.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {story.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {story.description}
              </p>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between border-t pt-6">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    {story.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="mr-1 text-red-500" />
                    {story.likes.toLocaleString()} likes
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    5 min read
                  </div>
                </div>

                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-red-100 text-red-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <FaHeart className="mr-2" />
                  {liked ? 'Liked!' : 'Like'}
                </button>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              {story.content ? (
                <div dangerouslySetInnerHTML={{ __html: story.content }} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Story Content Coming Soon</h3>
                  <p className="text-gray-500">
                    The full content for this trending story will be available soon.
                    Check back later for the complete story!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Stories */}
          <div className="mt-8 text-center">
            <Link
              href="/trending"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
            >
              <FaFire className="mr-2" />
              Explore More Trending Stories
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
