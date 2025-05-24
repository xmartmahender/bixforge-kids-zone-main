'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video } from '../../lib/videoService';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface VideoDetailProps {
  videoId: string;
}

export default function VideoDetail({ videoId }: VideoDetailProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const videoDoc = await getDoc(doc(db, "videos", videoId));

        if (videoDoc.exists()) {
          setVideo({ id: videoDoc.id, ...videoDoc.data() } as Video);
        } else {
          setError("Video not found");
        }
      } catch (err) {
        console.error("Error loading video", err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading video...</div>;
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error || "Video not found"}</div>
        <Link href="/" className="text-pink-500 hover:underline">Return to home</Link>
      </div>
    );
  }

  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const embedUrl = getYoutubeEmbedUrl(video.videoUrl);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/" className="inline-block mb-6 text-pink-600 hover:underline">
        &larr; Back to Videos
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 relative">
          <iframe
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-96"
          ></iframe>
        </div>

        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-pink-700">{video.title}</h1>

          <div className="flex items-center mb-4">
            <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full">
              Age: {video.ageGroup}
            </span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}