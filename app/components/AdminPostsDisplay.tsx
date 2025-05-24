'use client';

import React, { useState, useEffect } from 'react';
import { getAdminPosts, AdminPost } from '../../lib/adminPostsService';

interface AdminPostsDisplayProps {
  featured?: boolean;
  limit?: number;
  title?: string;
  className?: string;
  type?: 'story' | 'video' | 'general';
}

export default function AdminPostsDisplay({ 
  featured, 
  limit = 10, 
  title = "Admin Posts",
  className = "",
  type
}: AdminPostsDisplayProps) {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const adminPosts = await getAdminPosts();
        let filteredPosts = adminPosts;

        // Filter by featured status if specified
        if (featured !== undefined) {
          filteredPosts = filteredPosts.filter(post => post.featured === featured);
        }

        // Filter by type if specified
        if (type) {
          filteredPosts = filteredPosts.filter(post => post.type === type);
        }

        // Apply limit
        filteredPosts = filteredPosts.slice(0, limit);

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching admin posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [featured, limit, type]);

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`p-6 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="text-gray-600 text-center py-8">No posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h3>
            {post.description && (
              <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.type === 'story' ? 'bg-blue-100 text-blue-800' :
                post.type === 'video' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {post.type}
              </span>
              {post.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                View Content
              </a>
            )}
            <div className="mt-4 text-xs text-gray-500">
              {post.createdAt && new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
