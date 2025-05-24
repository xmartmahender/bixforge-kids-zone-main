'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Video, getVideos } from '../../lib/videoService';

interface VideosListProps {
  selectedAgeGroup?: string;
  showAdminContent?: boolean;
}

export default function VideosList({ selectedAgeGroup = '', showAdminContent = false }: VideosListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        if (showAdminContent) {
          // Fetch admin-created videos from Firebase
          const videosQuery = query(
            collection(db, 'videos'),
            orderBy('createdAt', 'desc')
          );

          const querySnapshot = await getDocs(videosQuery);
          const adminVideos: Video[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Only include non-disabled videos
            if (!data.disabled) {
              adminVideos.push({
                id: doc.id,
                title: data.title || 'Untitled Video',
                description: data.description || 'No description available',
                ageGroup: data.ageGroup || '3-6',
                videoUrl: data.videoUrl || '',
                thumbnailUrl: data.thumbnailUrl,
                isCodeVideo: data.isCodeVideo || false,
                programmingLanguage: data.programmingLanguage,
                disabled: data.disabled || false,
                featured: data.featured || false,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
              });
            }
          });

          // Filter by age group if specified
          const filteredVideos = selectedAgeGroup
            ? adminVideos.filter(video => video.ageGroup === selectedAgeGroup)
            : adminVideos;

          setVideos(filteredVideos);
        } else {
          // Use existing video service for mock data
          const videosData = await getVideos(selectedAgeGroup, 10);
          setVideos(videosData);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedAgeGroup, showAdminContent]);

  if (loading) {
    return <div className="p-4 text-center">Loading videos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="p-4 text-center">
      {showAdminContent
        ? 'No videos have been added by the admin yet. Check back later!'
        : selectedAgeGroup
          ? `No videos found for age group ${selectedAgeGroup}.`
          : 'No videos found.'
      }
    </div>;
  }

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Group videos by age group
  const videosByAgeGroup = videos.reduce((acc, video) => {
    const ageGroup = video.ageGroup || 'Other';
    if (!acc[ageGroup]) {
      acc[ageGroup] = [];
    }
    acc[ageGroup].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  // Sort age groups in a specific order
  const ageGroupOrder = ['0-3', '3-6', '6-9', '9-12', 'Other'];
  const sortedAgeGroups = Object.keys(videosByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b)
  );

  return (
    <div className="p-4 bg-pink-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-800">Videos</h2>

      {sortedAgeGroups.map(ageGroup => (
        <div key={ageGroup} className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-pink-700">{ageGroup}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videosByAgeGroup[ageGroup].map(video => {
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
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2 text-pink-700">{video.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
