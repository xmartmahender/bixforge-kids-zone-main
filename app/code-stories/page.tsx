'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Story } from '../../lib/storyService';

// Programming Languages with age recommendations
const PROGRAMMING_LANGUAGES = {
  'html': {
    name: 'HTML',
    icon: '🌐',
    color: 'bg-red-500',
    description: 'Create web pages and websites',
    ageGroups: {
      '0-3': {
        title: 'My First Web Page',
        description: 'Learn about colors, text, and simple web elements',
        difficulty: 'Beginner',
        concepts: ['Colors', 'Text', 'Images', 'Simple Tags']
      },
      '3-6': {
        title: 'HTML for Young Coders',
        description: 'Build your first real web pages with HTML tags',
        difficulty: 'Easy',
        concepts: ['HTML Tags', 'Headings', 'Paragraphs', 'Links', 'Images']
      },
      '6-9': {
        title: 'Web Page Builder',
        description: 'Create interactive web pages with forms and lists',
        difficulty: 'Intermediate',
        concepts: ['Forms', 'Lists', 'Tables', 'Divs', 'Basic Structure']
      },
      '9-12': {
        title: 'Advanced HTML',
        description: 'Master HTML with semantic elements and accessibility',
        difficulty: 'Advanced',
        concepts: ['Semantic HTML', 'Accessibility', 'Meta Tags', 'Advanced Forms']
      }
    }
  },
  'python': {
    name: 'Python',
    icon: '🐍',
    color: 'bg-green-500',
    description: 'Learn programming with Python',
    ageGroups: {
      '3-6': {
        title: 'Python for Little Ones',
        description: 'Fun with colors, shapes, and simple commands',
        difficulty: 'Beginner',
        concepts: ['Print Commands', 'Colors', 'Simple Math', 'Drawing']
      },
      '6-9': {
        title: 'Python Adventures',
        description: 'Variables, loops, and simple games',
        difficulty: 'Easy',
        concepts: ['Variables', 'Input/Output', 'Simple Loops', 'Basic Games']
      },
      '9-12': {
        title: 'Python Programming',
        description: 'Functions, lists, and real programming projects',
        difficulty: 'Intermediate',
        concepts: ['Functions', 'Lists', 'Loops', 'Conditionals', 'Projects']
      }
    }
  },
  'javascript': {
    name: 'JavaScript',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Make websites interactive',
    ageGroups: {
      '6-9': {
        title: 'JavaScript for Kids',
        description: 'Add fun interactions to web pages',
        difficulty: 'Easy',
        concepts: ['Alerts', 'Button Clicks', 'Simple Animations', 'Basic Events']
      },
      '9-12': {
        title: 'Interactive Web Pages',
        description: 'Create games and interactive websites',
        difficulty: 'Intermediate',
        concepts: ['DOM Manipulation', 'Events', 'Simple Games', 'Animations']
      }
    }
  },
  'css': {
    name: 'CSS',
    icon: '🎨',
    color: 'bg-blue-500',
    description: 'Style and design websites',
    ageGroups: {
      '3-6': {
        title: 'Colors and Styles',
        description: 'Make web pages colorful and beautiful',
        difficulty: 'Beginner',
        concepts: ['Colors', 'Fonts', 'Sizes', 'Basic Styling']
      },
      '6-9': {
        title: 'CSS Design',
        description: 'Layout and design web pages',
        difficulty: 'Easy',
        concepts: ['Layout', 'Positioning', 'Borders', 'Backgrounds', 'Spacing']
      },
      '9-12': {
        title: 'Advanced CSS',
        description: 'Responsive design and animations',
        difficulty: 'Intermediate',
        concepts: ['Flexbox', 'Grid', 'Animations', 'Responsive Design', 'Media Queries']
      }
    }
  },
  'scratch': {
    name: 'Scratch',
    icon: '🧩',
    color: 'bg-orange-500',
    description: 'Visual programming with blocks',
    ageGroups: {
      '0-3': {
        title: 'Scratch Jr',
        description: 'Drag and drop programming for little ones',
        difficulty: 'Beginner',
        concepts: ['Drag & Drop', 'Characters', 'Movement', 'Sounds', 'Stories']
      },
      '3-6': {
        title: 'Scratch Basics',
        description: 'Create animations and simple games',
        difficulty: 'Easy',
        concepts: ['Sprites', 'Costumes', 'Sounds', 'Basic Scripts', 'Animations']
      },
      '6-9': {
        title: 'Scratch Games',
        description: 'Build interactive games and stories',
        difficulty: 'Intermediate',
        concepts: ['Game Logic', 'Variables', 'Loops', 'Conditionals', 'Interactive Stories']
      }
    }
  }
};

// Helper function to check if content is age-appropriate
const isAgeAppropriate = (contentAgeGroup: string, userAgeGroup: string): boolean => {
  if (userAgeGroup === 'all') return true;

  const ageRanges = {
    '0-3': { min: 0, max: 3 },
    '3-6': { min: 3, max: 6 },
    '6-9': { min: 6, max: 9 },
    '9-12': { min: 9, max: 12 }
  };

  const userRange = ageRanges[userAgeGroup as keyof typeof ageRanges];
  const contentRange = ageRanges[contentAgeGroup as keyof typeof ageRanges];

  if (!userRange || !contentRange) return true;

  // Allow content that's at or below the user's level
  return contentRange.max <= userRange.max;
};

// Helper function to get recommended languages for age group
const getRecommendedLanguages = (ageGroup: string): string[] => {
  const ageGroupLanguages = {
    '0-3': ['scratch', 'html'],
    '3-6': ['scratch', 'html', 'css'],
    '6-9': ['html', 'css', 'python', 'javascript'],
    '9-12': ['python', 'javascript', 'html', 'css']
  };
  return ageGroupLanguages[ageGroup as keyof typeof ageGroupLanguages] || [];
};

export default function CodeStoriesPage() {
  const [codeStories, setCodeStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step-by-step selection
  const [step, setStep] = useState(1); // 1: Select Language, 2: Select Age, 3: View Stories
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [currentCurriculum, setCurrentCurriculum] = useState<any>(null);

  // Fetch code stories when language and age are selected
  useEffect(() => {
    if (step === 3 && selectedLanguage && selectedAgeGroup) {
      fetchCodeStories();
    }
  }, [step, selectedLanguage, selectedAgeGroup]);

  const fetchCodeStories = async () => {
    try {
      setLoading(true);
      setError('');

      // Query stories with specific language and age group
      const storiesQuery = query(
        collection(db, "stories"),
        where("programmingLanguage", "==", selectedLanguage),
        where("ageGroup", "==", selectedAgeGroup)
      );

      const storiesSnapshot = await getDocs(storiesQuery);
      const stories: Story[] = [];

      storiesSnapshot.forEach((doc) => {
        const storyData = { id: doc.id, ...doc.data() } as Story;
        // Only include published stories
        if (!storyData.disabled) {
          stories.push(storyData);
        }
      });

      // Sort by creation date (newest first)
      stories.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });

      setCodeStories(stories);
    } catch (err) {
      console.error('Error fetching code stories:', err);
      setError('Failed to load code stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setStep(2);
  };

  // Handle age selection
  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
    const langData = PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES];
    const curriculum = langData?.ageGroups[ageGroup as keyof typeof langData.ageGroups];
    setCurrentCurriculum(curriculum);
    setStep(3);
  };

  // Reset to start
  const resetSelection = () => {
    setStep(1);
    setSelectedLanguage('');
    setSelectedAgeGroup('');
    setCurrentCurriculum(null);
    setCodeStories([]);
    setError('');
  };

  return (
    <div>
      <UserTracker contentType="code" contentId={`${selectedLanguage}-${selectedAgeGroup}`} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 Code Stories Adventure
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Learn programming step by step with age-appropriate coding stories!
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="font-bold">1</span>
              <span>Choose Language</span>
            </div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="font-bold">2</span>
              <span>Select Age</span>
            </div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="font-bold">3</span>
              <span>Learn & Code</span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Programming Language */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              🎯 Choose Your Programming Language
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Pick a programming language you want to learn!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(PROGRAMMING_LANGUAGES).map(([key, lang]) => (
                <div
                  key={key}
                  onClick={() => handleLanguageSelect(key)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-blue-300"
                >
                  <div className={`${lang.color} text-white p-6 rounded-t-xl`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{lang.icon}</div>
                      <h3 className="text-xl font-bold">{lang.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center mb-4">{lang.description}</p>
                    <div className="text-center">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Click to Select
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Age Group */}
        {step === 2 && selectedLanguage && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
              >
                ← Change Language
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                👶 Select Your Age Group
              </h2>
              <p className="text-gray-600 mb-2">
                Learning <span className="font-bold text-blue-600">
                  {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name}
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Choose your age to get the perfect difficulty level!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.ageGroups || {}).map(([ageGroup, curriculum]) => (
                <div
                  key={ageGroup}
                  onClick={() => handleAgeSelect(ageGroup)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-green-300"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Ages {ageGroup}
                      </h3>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">
                        {curriculum.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {curriculum.description}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        curriculum.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        curriculum.difficulty === 'Easy' ? 'bg-blue-100 text-blue-800' :
                        curriculum.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {curriculum.difficulty}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">You'll Learn:</h5>
                      <div className="flex flex-wrap gap-1">
                        {curriculum.concepts.map((concept: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        Start Learning!
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: View Code Stories */}
        {step === 3 && selectedLanguage && selectedAgeGroup && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Change Language
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Change Age
                </button>
                <button
                  onClick={resetSelection}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🔄 Start Over
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🎉 Perfect! Here's Your Learning Path
                </h2>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <span className={`${PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.color} text-white px-4 py-2 rounded-full font-bold`}>
                    {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.icon} {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name}
                  </span>
                  <span className="text-gray-500">for</span>
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    👶 Ages {selectedAgeGroup}
                  </span>
                </div>

                {currentCurriculum && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h3 className="font-bold text-lg text-blue-600 mb-2">{currentCurriculum.title}</h3>
                    <p className="text-gray-600 mb-3">{currentCurriculum.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentCurriculum.concepts.map((concept: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-lg text-gray-600">Loading your coding stories...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😞</div>
                <p className="text-lg text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchCodeStories}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Stories Found */}
            {!loading && !error && codeStories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Stories Yet!</h3>
                <p className="text-gray-600 mb-6">
                  We're still creating {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name} stories for ages {selectedAgeGroup}.
                  <br />
                  Check back soon or try a different age group!
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Different Age
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Try Different Language
                  </button>
                </div>
              </div>
            )}

            {/* Stories Grid */}
            {!loading && !error && codeStories.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                  🚀 Your Coding Adventures ({codeStories.length} stories)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {codeStories.map(story => (
                    <Link href={`/stories/${story.id}`} key={story.id}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:scale-105">
                        <div className="relative h-48 w-full">
                          <img
                            src={story.imageUrl || 'https://placehold.co/400x300/png?text=Code+Story'}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-lg font-bold">
                            Ages {story.ageGroup}
                          </div>
                          <div className={`absolute bottom-2 left-2 text-white px-2 py-1 text-xs rounded-lg font-bold ${PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.color}`}>
                            {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.icon} {story.programmingLanguage || selectedLanguage}
                          </div>
                        </div>
                        <div className="p-4 flex-grow">
                          <h3 className="font-bold text-lg mb-2 text-gray-800">{story.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-3">{story.description}</p>
                        </div>
                        <div className="px-4 pb-4">
                          <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium w-full text-center">
                            🚀 Start Coding!
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
