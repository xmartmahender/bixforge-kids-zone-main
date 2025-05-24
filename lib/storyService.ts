// lib/storyService.ts
import { db } from "./firebase";
import {
  collection, getDocs, getDoc, doc, query,
  orderBy, Timestamp, addDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export type Story = {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  ageGroup: string;
  content?: string;
  category?: string[];
  illustrations?: string[];
  audioUrl?: string;
  language?: string;
  isCodeStory?: boolean;
  codeSnippet?: string;
  programmingLanguage?: string;
  disabled?: boolean;
  isAdminPost?: boolean;
  featured?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  translations?: {
    [language: string]: {
      title?: string;
      description?: string;
      content?: string;
    }
  };
}

export const getStories = async (ageGroup?: string, limitCount = 10) => {
  try {
    // Get all stories first, then filter in memory to avoid complex Firebase queries
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const stories: Story[] = [];

    querySnapshot.forEach((doc) => {
      const storyData = { id: doc.id, ...doc.data() } as Story;

      // Filter out code stories and disabled stories
      const isCodeStory = storyData.isCodeStory === true;
      const isDisabled = storyData.disabled === true;
      const matchesAgeGroup = !ageGroup || ageGroup === '' || storyData.ageGroup === ageGroup;

      if (!isCodeStory && !isDisabled && matchesAgeGroup) {
        stories.push(storyData);
      }
    });

    // Sort by featured first, then by creation date
    stories.sort((a, b) => {
      // Featured stories first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by creation date (newest first)
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    return stories.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting stories: ", error);
    throw error;
  }
};

export const getStoryById = async (id: string) => {
  try {
    const storyDoc = await getDoc(doc(db, "stories", id));

    if (storyDoc.exists()) {
      return { id: storyDoc.id, ...storyDoc.data() } as Story;
    } else {
      throw new Error("Story not found");
    }
  } catch (error) {
    console.error("Error getting story: ", error);
    throw error;
  }
};

export const getAdminPosts = async (limitCount = 5) => {
  try {
    console.log('getAdminPosts: Starting to fetch admin posts...');

    // Get all stories first, then filter in memory to avoid complex Firebase queries
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc")
    );

    console.log('getAdminPosts: Executing Firebase query...');
    const querySnapshot = await getDocs(q);
    console.log('getAdminPosts: Query completed, total documents:', querySnapshot.size);

    const stories: Story[] = [];
    let totalStories = 0;
    let adminStories = 0;

    querySnapshot.forEach((doc) => {
      totalStories++;
      const storyData = { id: doc.id, ...doc.data() } as Story;

      console.log(`getAdminPosts: Story ${totalStories}: ${storyData.title}, isAdminPost: ${storyData.isAdminPost}, disabled: ${storyData.disabled}`);

      // Filter for admin posts that are not disabled
      if (storyData.isAdminPost === true && storyData.disabled !== true) {
        adminStories++;
        stories.push(storyData);
        console.log(`getAdminPosts: Added admin story: ${storyData.title}`);
      }
    });

    console.log(`getAdminPosts: Found ${adminStories} admin stories out of ${totalStories} total stories`);

    // Sort by creation date (newest first) and limit
    stories.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    const result = stories.slice(0, limitCount);
    console.log(`getAdminPosts: Returning ${result.length} stories`);
    return result;
  } catch (error) {
    console.error("Error getting admin posts: ", error);
    throw error;
  }
};



export const addStory = async (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>, coverFile?: File) => {
  try {
    // Handle cover image upload if provided
    let imageUrl = story.imageUrl || '';

    if (coverFile) {
      const fileName = `${Date.now()}_${coverFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `covers/${fileName}`);

      await uploadBytes(storageRef, coverFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const storyData = {
      ...story,
      imageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, "stories"), storyData);
    return { id: docRef.id, ...storyData };
  } catch (error) {
    console.error("Error adding story: ", error);
    throw error;
  }
};

export const updateStory = async (id: string, story: Partial<Story>, coverFile?: File) => {
  try {
    // Handle cover image upload if provided
    let imageUrl = story.imageUrl;

    if (coverFile) {
      const fileName = `${Date.now()}_${coverFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `covers/${fileName}`);

      await uploadBytes(storageRef, coverFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const storyData = {
      ...story,
      ...(imageUrl && { imageUrl }),
      updatedAt: Timestamp.now()
    };

    await updateDoc(doc(db, "stories", id), storyData);
    return { id, ...storyData };
  } catch (error) {
    console.error("Error updating story: ", error);
    throw error;
  }
};

export const deleteStory = async (id: string, imageUrl?: string) => {
  try {
    // Delete cover image from storage if it's a Firebase URL
    if (imageUrl && imageUrl.includes("firebasestorage")) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (err) {
        console.error("Error deleting cover image", err);
      }
    }

    // Delete story document
    await deleteDoc(doc(db, "stories", id));
    return true;
  } catch (error) {
    console.error("Error deleting story: ", error);
    throw error;
  }
};