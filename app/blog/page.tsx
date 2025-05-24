'use client';

import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Fun Ways to Encourage Reading in Young Children",
      excerpt: "Discover creative methods to make reading an exciting adventure for your little ones. From interactive storytelling to creating cozy reading nooks...",
      category: "parenting",
      author: "Dr. Sarah Johnson",
      date: "2024-12-15",
      readTime: "5 min read",
      image: "https://placehold.co/400x250/purple/white?text=Reading+Tips",
      featured: true
    },
    {
      id: 2,
      title: "Age-Appropriate Screen Time Guidelines for Children",
      excerpt: "Learn about healthy screen time limits and how to choose quality digital content that supports your child's development...",
      category: "digital-wellness",
      author: "Mark Thompson",
      date: "2024-12-12",
      readTime: "7 min read",
      image: "https://placehold.co/400x250/blue/white?text=Screen+Time",
      featured: false
    },
    {
      id: 3,
      title: "Introduction to Coding for Kids: Where to Start",
      excerpt: "A beginner's guide to introducing programming concepts to children through fun, interactive activities and games...",
      category: "coding",
      author: "Alex Chen",
      date: "2024-12-10",
      readTime: "6 min read",
      image: "https://placehold.co/400x250/green/white?text=Coding+Kids",
      featured: true
    },
    {
      id: 4,
      title: "Building Emotional Intelligence Through Storytelling",
      excerpt: "How stories help children understand emotions, develop empathy, and build stronger social connections...",
      category: "development",
      author: "Dr. Emily Rodriguez",
      date: "2024-12-08",
      readTime: "4 min read",
      image: "https://placehold.co/400x250/pink/white?text=Emotional+Intelligence",
      featured: false
    },
    {
      id: 5,
      title: "Creating a Safe Digital Environment for Children",
      excerpt: "Essential tips for parents to ensure their children's online safety while exploring educational content...",
      category: "safety",
      author: "Jennifer Lee",
      date: "2024-12-05",
      readTime: "8 min read",
      image: "https://placehold.co/400x250/orange/white?text=Digital+Safety",
      featured: false
    },
    {
      id: 6,
      title: "The Benefits of Interactive Learning for Young Minds",
      excerpt: "Explore how interactive content enhances learning retention and engagement in children's education...",
      category: "education",
      author: "Dr. Michael Brown",
      date: "2024-12-03",
      readTime: "5 min read",
      image: "https://placehold.co/400x250/teal/white?text=Interactive+Learning",
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'parenting', name: 'Parenting Tips', count: blogPosts.filter(post => post.category === 'parenting').length },
    { id: 'education', name: 'Education', count: blogPosts.filter(post => post.category === 'education').length },
    { id: 'coding', name: 'Coding for Kids', count: blogPosts.filter(post => post.category === 'coding').length },
    { id: 'safety', name: 'Digital Safety', count: blogPosts.filter(post => post.category === 'safety').length },
    { id: 'development', name: 'Child Development', count: blogPosts.filter(post => post.category === 'development').length },
    { id: 'digital-wellness', name: 'Digital Wellness', count: blogPosts.filter(post => post.category === 'digital-wellness').length }
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div>
      <UserTracker contentType="general" contentId={selectedCategory} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-purple-800">Educational Blog</h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Expert insights, tips, and resources for parents and educators
          </p>

          {/* Featured Posts */}
          {selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map(post => (
                  <Link href={`/blog/${post.id}`} key={post.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 text-xs rounded-full font-semibold">
                          Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.author}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-purple-700 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Newsletter Signup */}
                <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <h4 className="font-bold text-purple-700 mb-2">Stay Updated</h4>
                  <p className="text-sm text-gray-600 mb-3">Get the latest parenting tips and educational insights.</p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="w-full bg-purple-600 text-white py-2 px-3 text-sm rounded-md hover:bg-purple-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700">
                  {selectedCategory === 'all' ? 'All Posts' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500 text-sm">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <Link href={`/blog/${post.id}`} key={post.id}>
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center mb-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                              {categories.find(c => c.id === post.category)?.name}
                            </span>
                            {post.featured && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-purple-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>By {post.author}</span>
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors">
                  Load More Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
