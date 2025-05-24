'use client';

import React from 'react';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import Link from 'next/link';
import UserTracker from '../../components/UserTracker';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id;

  // Sample blog post data (in a real app, this would be fetched based on the ID)
  const blogPost = {
    id: postId,
    title: "10 Fun Ways to Encourage Reading in Young Children",
    content: `
      <p>Reading is one of the most important skills a child can develop, and making it fun is key to fostering a lifelong love of books. Here are ten creative ways to encourage reading in young children:</p>
      
      <h2>1. Create a Cozy Reading Nook</h2>
      <p>Set up a special space dedicated to reading. Use soft pillows, blankets, and good lighting to make it inviting. This gives children a sense that reading is special and important.</p>
      
      <h2>2. Read Together Daily</h2>
      <p>Make reading a daily routine. Whether it's bedtime stories or afternoon reading sessions, consistency helps children develop the habit of reading.</p>
      
      <h2>3. Let Children Choose Their Books</h2>
      <p>Give children the freedom to select books that interest them. This autonomy helps them feel more invested in the reading experience.</p>
      
      <h2>4. Use Different Voices for Characters</h2>
      <p>When reading aloud, use different voices and expressions for different characters. This makes the story come alive and keeps children engaged.</p>
      
      <h2>5. Connect Books to Real Life</h2>
      <p>Help children make connections between what they read and their own experiences. This makes stories more meaningful and memorable.</p>
      
      <h2>6. Visit Libraries and Bookstores</h2>
      <p>Regular trips to libraries and bookstores expose children to new books and create positive associations with reading environments.</p>
      
      <h2>7. Use Technology Wisely</h2>
      <p>Interactive e-books and reading apps can complement traditional books, especially for reluctant readers. Just ensure screen time is balanced.</p>
      
      <h2>8. Start a Family Book Club</h2>
      <p>Read the same book as a family and discuss it together. This creates shared experiences and helps develop critical thinking skills.</p>
      
      <h2>9. Reward Reading Achievements</h2>
      <p>Celebrate reading milestones with small rewards or special activities. This positive reinforcement encourages continued reading.</p>
      
      <h2>10. Be a Reading Role Model</h2>
      <p>Children learn by example. When they see adults reading and enjoying books, they're more likely to develop the same habit.</p>
      
      <h2>Conclusion</h2>
      <p>Remember, every child is different, and what works for one may not work for another. The key is to be patient, consistent, and to make reading a positive, enjoyable experience. With these strategies, you can help nurture a love of reading that will benefit your child throughout their life.</p>
    `,
    category: "parenting",
    author: "Dr. Sarah Johnson",
    authorBio: "Dr. Sarah Johnson is a child development specialist with over 15 years of experience in early childhood education.",
    date: "2024-12-15",
    readTime: "5 min read",
    image: "https://placehold.co/800x400/purple/white?text=Reading+Tips",
    tags: ["reading", "parenting", "education", "children", "literacy"]
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Age-Appropriate Screen Time Guidelines for Children",
      image: "https://placehold.co/300x200/blue/white?text=Screen+Time",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "Building Emotional Intelligence Through Storytelling",
      image: "https://placehold.co/300x200/pink/white?text=Emotional+Intelligence",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "The Benefits of Interactive Learning for Young Minds",
      image: "https://placehold.co/300x200/teal/white?text=Interactive+Learning",
      readTime: "5 min read"
    }
  ];

  return (
    <div>
      <UserTracker contentType="general" contentId={postId as string} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                Parenting Tips
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{blogPost.title}</h1>
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <span>By {blogPost.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(blogPost.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{blogPost.readTime}</span>
            </div>
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
            />
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About the Author</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-xl">
                  {blogPost.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{blogPost.author}</h4>
                <p className="text-gray-600 text-sm">{blogPost.authorBio}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Share this article:</h3>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Share on Facebook
              </button>
              <button className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">
                Share on Twitter
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-purple-700 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h4>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg mb-6">
              Get the latest parenting tips and educational insights delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
