'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db, storage } from '../../lib/firebase';
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Story } from '../../lib/storyService';
import { Video } from '../../lib/videoService';
import AdvancedAnalytics from './admin/AdvancedAnalytics';
import TrendingStoriesAdmin from './admin/TrendingStoriesAdmin';
import AdminSettings from './admin/AdminSettings';
import {
  FaBook,
  FaVideo,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRegStar,
  FaImage,
  FaUpload,
  FaCode,
  FaPlay,
  FaCog,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFire
} from 'react-icons/fa';

export default function AdminDashboard() {
  // State for stories
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    ageGroup: '0-3',
    isCodeStory: false,
    programmingLanguage: '',
    content: ''
  });
  const [storyImage, setStoryImage] = useState<File | null>(null);

  // State for videos
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    ageGroup: '0-3',
    videoUrl: '',
    isCodeVideo: false,
    programmingLanguage: ''
  });
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState('analytics');

  // State for connected users
  const [connectedUsers, setConnectedUsers] = useState<{
    id: string;
    contentType?: string;
    contentId?: string;
    lastActive?: { seconds: number };
    [key: string]: unknown;
  }[]>([]);

  // State for editing
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  // Collections
  const storiesCollection = collection(db, 'stories');
  const videosCollection = collection(db, 'videos');
  const usersCollection = collection(db, 'users');

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    // Fetch stories
    const storiesData = await getDocs(storiesCollection);
    setStories(storiesData.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story)));

    // Fetch videos
    const videosData = await getDocs(videosCollection);
    setVideos(videosData.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));

    // Fetch users
    const usersData = await getDocs(usersCollection);
    setConnectedUsers(usersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, [storiesCollection, videosCollection, usersCollection]);

  useEffect(() => {
    fetchData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle story form changes
  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setNewStory(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setNewStory(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle story image upload
  const handleStoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStoryImage(e.target.files[0]);
    }
  };

  // Add new story
  const addStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newStory.title.trim() === '') return;

    try {
      let imageUrl = '';

      // Upload image if provided
      if (storyImage) {
        const fileName = `${Date.now()}_${storyImage.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `covers/${fileName}`);

        await uploadBytes(storageRef, storyImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Determine if it's a code story based on content or explicit flag
      const isCodeRelated =
        newStory.isCodeStory ||
        !!newStory.programmingLanguage ||
        (newStory.content && newStory.content.toLowerCase().includes('code')) ||
        (newStory.title && newStory.title.toLowerCase().includes('cod')) ||
        (newStory.description && newStory.description.toLowerCase().includes('cod'));

      // Create story document
      await addDoc(storiesCollection, {
        ...newStory,
        isCodeStory: isCodeRelated,
        isAdminPost: true, // Mark as admin post
        disabled: false,
        featured: false,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Reset form
      setNewStory({
        title: '',
        description: '',
        ageGroup: '0-3',
        isCodeStory: false,
        programmingLanguage: '',
        content: ''
      });
      setStoryImage(null);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error adding story:', error);
      alert('Failed to add story. Please try again.');
    }
  };

  // Edit a story
  const editStory = (story: Story) => {
    setEditingStory(story);
    setNewStory({
      title: story.title,
      description: story.description,
      ageGroup: story.ageGroup,
      isCodeStory: story.isCodeStory || false,
      programmingLanguage: story.programmingLanguage || '',
      content: story.content || ''
    });
  };

  // Update a story
  const updateStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStory || newStory.title.trim() === '') return;

    try {
      let imageUrl = editingStory.imageUrl;

      // Upload new image if provided
      if (storyImage) {
        const fileName = `${Date.now()}_${storyImage.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `covers/${fileName}`);

        await uploadBytes(storageRef, storyImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Determine if it's a code story based on content or explicit flag
      const isCodeRelated =
        newStory.isCodeStory ||
        !!newStory.programmingLanguage ||
        (newStory.content && newStory.content.toLowerCase().includes('code')) ||
        (newStory.title && newStory.title.toLowerCase().includes('cod')) ||
        (newStory.description && newStory.description.toLowerCase().includes('cod'));

      // Update story document
      await updateDoc(doc(db, 'stories', editingStory.id!), {
        ...newStory,
        isCodeStory: isCodeRelated,
        imageUrl,
        updatedAt: Timestamp.now()
      });

      // Reset form and editing state
      setNewStory({
        title: '',
        description: '',
        ageGroup: '0-3',
        isCodeStory: false,
        programmingLanguage: '',
        content: ''
      });
      setStoryImage(null);
      setEditingStory(null);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating story:', error);
      alert('Failed to update story. Please try again.');
    }
  };

  // Toggle story disabled status
  const toggleStoryDisabled = async (story: Story) => {
    try {
      await updateDoc(doc(db, 'stories', story.id!), {
        disabled: !story.disabled,
        updatedAt: Timestamp.now()
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling story status:', error);
      alert('Failed to update story status. Please try again.');
    }
  };

  // Toggle story featured status
  const toggleStoryFeatured = async (story: Story) => {
    try {
      await updateDoc(doc(db, 'stories', story.id!), {
        featured: !story.featured,
        updatedAt: Timestamp.now()
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling story featured status:', error);
      alert('Failed to update story featured status. Please try again.');
    }
  };

  // Delete a story
  const deleteStory = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteDoc(doc(db, 'stories', id));
        fetchData();
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      }
    }
  };

  // Handle video form changes
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setNewVideo(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setNewVideo(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle video thumbnail upload
  const handleVideoThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoThumbnail(e.target.files[0]);
    }
  };

  // Add new video
  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newVideo.title.trim() === '' || newVideo.videoUrl.trim() === '') return;

    try {
      let thumbnailUrl = '';

      // Upload thumbnail if provided
      if (videoThumbnail) {
        const fileName = `${Date.now()}_${videoThumbnail.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `thumbnails/${fileName}`);

        await uploadBytes(storageRef, videoThumbnail);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      // Determine if it's a code video based on content or explicit flag
      const isCodeRelated =
        newVideo.isCodeVideo ||
        !!newVideo.programmingLanguage ||
        (newVideo.title && newVideo.title.toLowerCase().includes('cod')) ||
        (newVideo.description && newVideo.description.toLowerCase().includes('cod'));

      // Create video document
      await addDoc(videosCollection, {
        ...newVideo,
        isCodeVideo: isCodeRelated,
        isAdminPost: true, // Mark as admin post
        disabled: false,
        featured: false,
        thumbnailUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Reset form
      setNewVideo({
        title: '',
        description: '',
        ageGroup: '0-3',
        videoUrl: '',
        isCodeVideo: false,
        programmingLanguage: ''
      });
      setVideoThumbnail(null);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video. Please try again.');
    }
  };

  // Delete a video
  const deleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteDoc(doc(db, 'videos', id));
        fetchData();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl border-b border-purple-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-5 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <FaCog className="w-10 h-10 text-white animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 via-pink-600 to-indigo-800 bg-clip-text text-transparent">
                  ✨ Admin Dashboard
                </h1>
                <p className="text-gray-700 font-medium text-lg mt-1">Manage your magical content kingdom</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold flex items-center space-x-3 shadow-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>🟢 System Online</span>
              </div>
              <div className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-lg shadow-sm">
                🕒 {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">📚 Total Stories</p>
                <p className="text-4xl font-black text-blue-600 mt-2">{stories.length}</p>
                <div className="flex items-center mt-3 space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600 font-medium">
                    {stories.filter(s => !s.disabled).length} active stories
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <FaBook className="text-white text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">🎥 Total Videos</p>
                <p className="text-4xl font-black text-purple-600 mt-2">{videos.length}</p>
                <div className="flex items-center mt-3 space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600 font-medium">
                    {videos.filter(v => !v.disabled).length} active videos
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
                <FaVideo className="text-white text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">👥 Active Users</p>
                <p className="text-4xl font-black text-green-600 mt-2">{connectedUsers.length}</p>
                <div className="flex items-center mt-3 space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600 font-medium">Currently online</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <FaUsers className="text-white text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200/50 mb-10">
          <div className="p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('stories')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'stories'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl border-2 border-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent'
                }`}
              >
                <FaBook className="text-xl" />
                <span>📚 Stories Management</span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl border-2 border-purple-300'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 border-2 border-transparent'
                }`}
              >
                <FaVideo className="text-xl" />
                <span>🎥 Videos Management</span>
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'trending'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border-2 border-orange-300'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 border-2 border-transparent'
                }`}
              >
                <FaFire className="text-xl" />
                <span>🔥 Trending Stories</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl border-2 border-green-300'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50 border-2 border-transparent'
                }`}
              >
                <FaUsers className="text-xl" />
                <span>📊 User Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl border-2 border-purple-300'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 border-2 border-transparent'
                }`}
              >
                <FaCog className="text-xl" />
                <span>⚙️ Admin Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            {/* Add/Edit Story Form */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-b border-purple-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                      {editingStory ? <FaEdit className="text-white text-xl" /> : <FaPlus className="text-white text-xl" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                        {editingStory ? '✏️ Edit Story' : '✨ Create New Story'}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {editingStory ? 'Update story details and content' : 'Add a magical new story to your collection'}
                      </p>
                    </div>
                  </div>
                  {editingStory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStory(null);
                        setNewStory({
                          title: '',
                          description: '',
                          ageGroup: '0-3',
                          isCodeStory: false,
                          programmingLanguage: '',
                          content: ''
                        });
                        setStoryImage(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimesCircle className="text-xl" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={editingStory ? updateStory : addStory} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <FaBook className="text-blue-500" />
                          <span>Story Title</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newStory.title}
                          onChange={handleStoryChange}
                          placeholder="Enter an engaging story title..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <FaUsers className="text-green-500" />
                          <span>Target Age Group</span>
                        </label>
                        <select
                          name="ageGroup"
                          value={newStory.ageGroup}
                          onChange={handleStoryChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                        >
                          <option value="0-3">👶 0-3 Years (Toddlers)</option>
                          <option value="3-6">🧒 3-6 Years (Preschool)</option>
                          <option value="6-9">👦 6-9 Years (Early Elementary)</option>
                          <option value="9-12">👧 9-12 Years (Late Elementary)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <FaImage className="text-purple-500" />
                          <span>Cover Image</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleStoryImageChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/50 backdrop-blur-sm"
                          />
                          <FaUpload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Upload a thumbnail image for your story</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={newStory.description}
                          onChange={handleStoryChange}
                          placeholder="Write a brief description of your story..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/50 backdrop-blur-sm"
                          rows={4}
                        />
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <input
                            type="checkbox"
                            name="isCodeStory"
                            checked={newStory.isCodeStory}
                            onChange={handleStoryChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <FaCode className="text-green-500" />
                            <span>This is a coding story</span>
                          </label>
                        </div>

                        {newStory.isCodeStory && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
                            <select
                              name="programmingLanguage"
                              value={newStory.programmingLanguage}
                              onChange={handleStoryChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                            >
                              <option value="">Select Language</option>
                              <option value="scratch">🎨 Scratch</option>
                              <option value="html">🌐 HTML</option>
                              <option value="css">🎨 CSS</option>
                              <option value="javascript">⚡ JavaScript</option>
                              <option value="python">🐍 Python</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Story Content</label>
                    <textarea
                      name="content"
                      value={newStory.content}
                      onChange={handleStoryChange}
                      placeholder="Write your story content here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/50 backdrop-blur-sm"
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Write the full story content that children will read</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FaExclamationTriangle className="text-yellow-500" />
                      <span>All fields marked with * are required</span>
                    </div>
                    <div className="flex space-x-3">
                      {editingStory && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStory(null);
                            setNewStory({
                              title: '',
                              description: '',
                              ageGroup: '0-3',
                              isCodeStory: false,
                              programmingLanguage: '',
                              content: ''
                            });
                            setStoryImage(null);
                          }}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <FaTimesCircle />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center space-x-2"
                      >
                        {editingStory ? <FaEdit /> : <FaPlus />}
                        <span>{editingStory ? 'Update Story' : 'Create Story'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Stories List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                      <FaBook className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Stories Library</h3>
                      <p className="text-sm text-gray-600">Manage all your published stories</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search stories..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaFilter />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first story</p>
                    <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <FaPlus />
                      <span>Create First Story</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stories.map(story => (
                          <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {story.imageUrl ? (
                                    <img
                                      src={story.imageUrl}
                                      alt={story.title}
                                      className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                      <FaImage className="text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {story.title}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {story.description || 'No description'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {story.ageGroup}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {story.isCodeStory ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FaCode className="mr-1" />
                                  Code Story
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <FaBook className="mr-1" />
                                  Regular
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <FaCalendarAlt className="mr-2" />
                                {story.createdAt ? new Date(story.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {story.disabled ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <FaEyeSlash className="mr-1" />
                                    Disabled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FaEye className="mr-1" />
                                    Active
                                  </span>
                                )}
                                {story.featured && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <FaStar className="mr-1" />
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => editStory(story)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Story"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => toggleStoryFeatured(story)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    story.featured
                                      ? 'text-yellow-600 hover:bg-yellow-50'
                                      : 'text-gray-400 hover:bg-gray-50'
                                  }`}
                                  title={story.featured ? 'Remove from Featured' : 'Add to Featured'}
                                >
                                  {story.featured ? <FaStar /> : <FaRegStar />}
                                </button>
                                <button
                                  onClick={() => toggleStoryDisabled(story)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    story.disabled
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-orange-600 hover:bg-orange-50'
                                  }`}
                                  title={story.disabled ? 'Enable Story' : 'Disable Story'}
                                >
                                  {story.disabled ? <FaEye /> : <FaEyeSlash />}
                                </button>
                                <button
                                  onClick={() => deleteStory(story.id!)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Story"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Add Video Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                    <FaVideo className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Video</h3>
                    <p className="text-sm text-gray-600">Upload and manage video content</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={addVideo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaVideo className="text-purple-500" />
                        <span>Video Title</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newVideo.title}
                        onChange={handleVideoChange}
                        placeholder="Enter video title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaUsers className="text-green-500" />
                        <span>Age Group</span>
                      </label>
                      <select
                        name="ageGroup"
                        value={newVideo.ageGroup}
                        onChange={handleVideoChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      >
                        <option value="0-3">👶 0-3 Years</option>
                        <option value="3-6">🧒 3-6 Years</option>
                        <option value="6-9">👦 6-9 Years</option>
                        <option value="9-12">👧 9-12 Years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={newVideo.description}
                      onChange={handleVideoChange}
                      placeholder="Video Description"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                      <FaPlay className="text-red-500" />
                      <span>Video URL (YouTube)</span>
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={newVideo.videoUrl}
                      onChange={handleVideoChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaImage className="text-indigo-500" />
                        <span>Thumbnail Image (Optional)</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVideoThumbnailChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-white/50 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="isCodeVideo"
                          checked={newVideo.isCodeVideo}
                          onChange={handleVideoChange}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <FaCode className="text-green-500" />
                          <span>Is Code Video</span>
                        </label>
                      </div>

                      {newVideo.isCodeVideo && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
                          <select
                            name="programmingLanguage"
                            value={newVideo.programmingLanguage}
                            onChange={handleVideoChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          >
                            <option value="">Select Language</option>
                            <option value="scratch">🎨 Scratch</option>
                            <option value="html">🌐 HTML</option>
                            <option value="css">🎨 CSS</option>
                            <option value="javascript">⚡ JavaScript</option>
                            <option value="python">🐍 Python</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center space-x-2"
                    >
                      <FaPlus />
                      <span>Add Video</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Videos List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                    <FaVideo className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Videos Library</h3>
                    <p className="text-sm text-gray-600">Manage all your video content</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {videos.length === 0 ? (
                  <div className="text-center py-12">
                    <FaVideo className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
                    <p className="text-gray-500">Start by adding your first video</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {videos.map(video => (
                          <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {video.thumbnailUrl ? (
                                    <img
                                      src={video.thumbnailUrl}
                                      alt={video.title}
                                      className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                      <FaVideo className="text-purple-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">{video.title}</div>
                                  <div className="text-sm text-gray-500 truncate">{video.description || 'No description'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {video.ageGroup}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {video.isCodeVideo ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FaCode className="mr-1" />
                                  Code Video
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <FaVideo className="mr-1" />
                                  Regular Video
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <FaCalendarAlt className="mr-2" />
                                {video.createdAt ? new Date(video.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => deleteVideo(video.id!)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Video"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trending Stories Tab */}
        {activeTab === 'trending' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-200/50 overflow-hidden">
            <TrendingStoriesAdmin />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200/50 overflow-hidden">
            <AdvancedAnalytics />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden">
            <AdminSettings />
          </div>
        )}
      </div>
    </div>
  );
}