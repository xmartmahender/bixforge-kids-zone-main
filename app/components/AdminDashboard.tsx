'use client';

import React, { useEffect, useState } from 'react';
import { db, storage } from '../../lib/firebase';
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Story } from '../../lib/storyService';
import { Video } from '../../lib/videoService';

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
  const [activeTab, setActiveTab] = useState('stories');

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
  const fetchData = async () => {
    // Fetch stories
    const storiesData = await getDocs(storiesCollection);
    setStories(storiesData.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story)));

    // Fetch videos
    const videosData = await getDocs(videosCollection);
    setVideos(videosData.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));

    // Fetch users
    const usersData = await getDocs(usersCollection);
    setConnectedUsers(usersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'stories' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('stories')}
        >
          Stories
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'videos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manage Stories</h2>

          {/* Add/Edit Story Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingStory ? 'Edit Story' : 'Add New Story'}
            </h3>
            <form onSubmit={editingStory ? updateStory : addStory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newStory.title}
                    onChange={handleStoryChange}
                    placeholder="Story Title"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select
                    name="ageGroup"
                    value={newStory.ageGroup}
                    onChange={handleStoryChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="0-3">0-3 Years</option>
                    <option value="3-6">3-6 Years</option>
                    <option value="6-9">6-9 Years</option>
                    <option value="9-12">9-12 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newStory.description}
                  onChange={handleStoryChange}
                  placeholder="Story Description"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={newStory.content}
                  onChange={handleStoryChange}
                  placeholder="Story Content"
                  className="w-full p-2 border rounded-md"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStoryImageChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isCodeStory"
                      checked={newStory.isCodeStory}
                      onChange={handleStoryChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Is Code Story</label>
                  </div>

                  {newStory.isCodeStory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Programming Language</label>
                      <select
                        name="programmingLanguage"
                        value={newStory.programmingLanguage}
                        onChange={handleStoryChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Language</option>
                        <option value="scratch">Scratch</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  {editingStory ? 'Update Story' : 'Add Story'}
                </button>
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
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stories List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Stories</h3>

            {stories.length === 0 ? (
              <p className="text-gray-500">No stories found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stories.map(story => (
                      <tr key={story.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {story.imageUrl && (
                              <img src={story.imageUrl} alt={story.title} className="h-10 w-10 rounded-full mr-3 object-cover" />
                            )}
                            <div className="text-sm font-medium text-gray-900">{story.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{story.ageGroup}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {story.isCodeStory ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Code Story
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Regular Story
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {story.createdAt ? new Date(story.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            {story.disabled && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Disabled
                              </span>
                            )}
                            {story.featured && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                            {story.isAdminPost && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Admin Post
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => editStory(story)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStoryDisabled(story)}
                              className={`${story.disabled ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                            >
                              {story.disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => toggleStoryFeatured(story)}
                              className={`${story.featured ? 'text-gray-600 hover:text-gray-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                            >
                              {story.featured ? 'Unfeature' : 'Feature'}
                            </button>
                            <button
                              onClick={() => deleteStory(story.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
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
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manage Videos</h2>

          {/* Add Video Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Video</h3>
            <form onSubmit={addVideo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newVideo.title}
                    onChange={handleVideoChange}
                    placeholder="Video Title"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select
                    name="ageGroup"
                    value={newVideo.ageGroup}
                    onChange={handleVideoChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="0-3">0-3 Years</option>
                    <option value="3-6">3-6 Years</option>
                    <option value="6-9">6-9 Years</option>
                    <option value="9-12">9-12 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newVideo.description}
                  onChange={handleVideoChange}
                  placeholder="Video Description"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube)</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={newVideo.videoUrl}
                  onChange={handleVideoChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVideoThumbnailChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isCodeVideo"
                      checked={newVideo.isCodeVideo}
                      onChange={handleVideoChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Is Code Video</label>
                  </div>

                  {newVideo.isCodeVideo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Programming Language</label>
                      <select
                        name="programmingLanguage"
                        value={newVideo.programmingLanguage}
                        onChange={handleVideoChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Language</option>
                        <option value="scratch">Scratch</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                Add Video
              </button>
            </form>
          </div>

          {/* Videos List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Videos</h3>

            {videos.length === 0 ? (
              <p className="text-gray-500">No videos found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {videos.map(video => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {video.thumbnailUrl && (
                              <img src={video.thumbnailUrl} alt={video.title} className="h-10 w-10 rounded-full mr-3 object-cover" />
                            )}
                            <div className="text-sm font-medium text-gray-900">{video.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{video.ageGroup}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {video.isCodeVideo ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Code Video
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                              Regular Video
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {video.createdAt ? new Date(video.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteVideo(video.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
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
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Connected Users</h2>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Current Users</h3>

            {connectedUsers.length === 0 ? (
              <p className="text-gray-500">No users currently connected.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {connectedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.contentType || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.contentId || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.lastActive ? new Date(user.lastActive.seconds * 1000).toLocaleString() : 'Unknown'}
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
      )}
    </div>
  );
}