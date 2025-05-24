'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Story {
  id?: string;
  title: string;
  description: string;
  ageGroup: string;
  imageUrl?: string;
  rating?: number;
  readCount?: number;
  category?: string;
  isCodeStory?: boolean;
  programmingLanguage?: string;
  content?: string;
  disabled?: boolean;
  featured?: boolean;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

interface StoriesListProps {
  selectedAgeGroup: string;
  showAdminContent?: boolean;
}

export default function StoriesList({ selectedAgeGroup, showAdminContent = false }: StoriesListProps) {
  const [adminStories, setAdminStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin-created stories from Firebase
  useEffect(() => {
    if (showAdminContent) {
      fetchAdminStories();
    }
  }, [showAdminContent]);

  const fetchAdminStories = async () => {
    setLoading(true);
    try {
      const storiesQuery = query(
        collection(db, 'stories'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(storiesQuery);
      const stories: Story[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include non-disabled stories
        if (!data.disabled) {
          stories.push({
            id: doc.id,
            title: data.title || 'Untitled Story',
            description: data.description || 'No description available',
            ageGroup: data.ageGroup || '3-6',
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            rating: 4.5, // Default rating
            readCount: Math.floor(Math.random() * 1000) + 100, // Random read count
            category: data.isCodeStory ? 'Code Story' : 'Story',
            isCodeStory: data.isCodeStory || false,
            programmingLanguage: data.programmingLanguage,
            content: data.content,
            disabled: data.disabled || false,
            featured: data.featured || false,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        }
      });

      setAdminStories(stories);
    } catch (error) {
      console.error('Error fetching admin stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock stories data (fallback when not showing admin content)
  const mockStories: Story[] = useMemo(() => [
    {
      id: '1',
      title: 'The Brave Little Lion',
      description: 'A young lion learns about courage and friendship in the African savanna.',
      ageGroup: '3-6',
      imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=300&fit=crop',
      rating: 4.8,
      readCount: 1250,
      category: 'Adventure'
    },
    {
      id: '2',
      title: 'Space Adventure Quest',
      description: 'Join Captain Stella on an exciting journey through the galaxy.',
      ageGroup: '6-9',
      imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
      rating: 4.9,
      readCount: 980,
      category: 'Science Fiction'
    },
    {
      id: '3',
      title: 'The Magic Forest',
      description: 'Discover the secrets of an enchanted forest filled with magical creatures.',
      ageGroup: '3-6',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      rating: 4.7,
      readCount: 1100,
      category: 'Fantasy'
    },
    {
      id: '4',
      title: 'Coding with Ruby Robot',
      description: 'Learn basic programming concepts with Ruby the friendly robot.',
      ageGroup: '6-9',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      rating: 4.6,
      readCount: 750,
      category: 'Educational'
    },
    {
      id: '5',
      title: 'The Little Seed\'s Journey',
      description: 'Follow a tiny seed as it grows into a magnificent tree.',
      ageGroup: '0-3',
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      rating: 4.5,
      readCount: 890,
      category: 'Nature'
    },
    {
      id: '6',
      title: 'Detective Max Mystery',
      description: 'Help Detective Max solve the case of the missing cookies.',
      ageGroup: '9-12',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      rating: 4.8,
      readCount: 650,
      category: 'Mystery'
    },
    {
      id: '7',
      title: 'Princess Luna\'s Dream',
      description: 'A princess discovers the power of dreams and imagination.',
      ageGroup: '3-6',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.7,
      readCount: 1200,
      category: 'Fantasy'
    },
    {
      id: '8',
      title: 'Ocean Explorer',
      description: 'Dive deep into the ocean and meet amazing sea creatures.',
      ageGroup: '6-9',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      rating: 4.6,
      readCount: 820,
      category: 'Adventure'
    }
  ], []);

  // Filter stories based on selected age group
  const filteredStories = useMemo(() => {
    const allStories = showAdminContent ? adminStories : mockStories;

    if (!selectedAgeGroup || selectedAgeGroup === 'all') {
      return allStories;
    }
    return allStories.filter(story => story.ageGroup === selectedAgeGroup);
  }, [selectedAgeGroup, showAdminContent, adminStories, mockStories]);

  // Group stories by age group
  const storiesByAgeGroup = useMemo(() => {
    return filteredStories.reduce((acc, story) => {
      const ageGroup = story.ageGroup || 'Other';
      if (!acc[ageGroup]) {
        acc[ageGroup] = [];
      }
      acc[ageGroup].push(story);
      return acc;
    }, {} as Record<string, Story[]>);
  }, [filteredStories]);

  // Sort age groups in a specific order
  const ageGroupOrder = ['0-3', '3-6', '6-9', '9-12', 'Other'];
  const sortedAgeGroups = Object.keys(storiesByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b)
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-pulse">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading stories...</h3>
        <p className="text-gray-500">Please wait while we fetch the latest content.</p>
      </div>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories found</h3>
        <p className="text-gray-500">
          {showAdminContent
            ? 'No stories have been added by the admin yet. Check back later!'
            : selectedAgeGroup
              ? `No stories available for age group ${selectedAgeGroup}.`
              : 'No stories available.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedAgeGroups.map(ageGroup => (
        <div key={ageGroup} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Ages {ageGroup}
            </div>
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500">{storiesByAgeGroup[ageGroup].length} stories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storiesByAgeGroup[ageGroup].map(story => (
              <Link href={`/stories/${story.id}`} key={story.id} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {story.category || (story.isCodeStory ? 'Code Story' : 'Story')}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {story.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{story.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{(story.readCount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
