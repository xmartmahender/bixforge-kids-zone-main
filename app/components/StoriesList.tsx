'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Story, getStories } from '../../lib/storyService';

export default function StoriesList({ selectedAgeGroup = '' }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const storiesData = await getStories(selectedAgeGroup, 10);
        setStories(storiesData);
        setError('');
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [selectedAgeGroup]);

  if (loading) {
    return <div className="p-4 text-center">Loading stories...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (stories.length === 0) {
    return <div className="p-4 text-center">
      {selectedAgeGroup ? `No stories found for age group ${selectedAgeGroup}.` : 'No stories found.'}
    </div>;
  }

  // Group stories by age group
  const storiesByAgeGroup = stories.reduce((acc, story) => {
    const ageGroup = story.ageGroup || 'Other';
    if (!acc[ageGroup]) {
      acc[ageGroup] = [];
    }
    acc[ageGroup].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  // Sort age groups in a specific order
  const ageGroupOrder = ['0-3', '3-6', '6-9', '9-12', 'Other'];
  const sortedAgeGroups = Object.keys(storiesByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b)
  );

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Stories</h2>

      {sortedAgeGroups.map(ageGroup => (
        <div key={ageGroup} className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-blue-700">{ageGroup}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {storiesByAgeGroup[ageGroup].map(story => (
              <Link href={`/stories/${story.id}`} key={story.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <img
                      src={story.imageUrl || 'https://placehold.co/400x300/png?text=Story'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-lg mb-2 text-blue-700">{story.title}</h3>
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
