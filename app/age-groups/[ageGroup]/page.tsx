'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StoriesList from '../../components/StoriesList';
import VideosList from '../../components/VideosList';
import UserTracker from '../../components/UserTracker';
import Link from 'next/link';

export default function AgeGroupPage({ params }: { params: { ageGroup: string } }) {
  const ageGroup = params.ageGroup;

  // Function to get a readable age group title
  const getAgeGroupTitle = (ageGroup: string) => {
    switch(ageGroup) {
      case '0-3':
        return 'Toddlers (0-3 years)';
      case '3-6':
        return 'Preschoolers (3-6 years)';
      case '6-9':
        return 'Early Elementary (6-9 years)';
      case '9-12':
        return 'Pre-Teens (9-12 years)';
      default:
        return 'All Ages';
    }
  };

  return (
    <div>
      <UserTracker ageGroup={ageGroup as '0-3' | '3-6' | '6-9' | '9-12'} contentType="general" />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center mb-2">{getAgeGroupTitle(ageGroup)}</h1>
          <p className="text-center text-gray-600 mb-8">
            Stories and videos specially selected for children aged {ageGroup} years
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Link
              href="/age-groups/0-3"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                ageGroup === '0-3' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-purple-100'
              }`}
            >
              0-3 years
            </Link>
            <Link
              href="/age-groups/3-6"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                ageGroup === '3-6' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-purple-100'
              }`}
            >
              3-6 years
            </Link>
            <Link
              href="/age-groups/6-9"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                ageGroup === '6-9' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-purple-100'
              }`}
            >
              6-9 years
            </Link>
            <Link
              href="/age-groups/9-12"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                ageGroup === '9-12' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-purple-100'
              }`}
            >
              9-12 years
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          <StoriesList selectedAgeGroup={ageGroup} />
          <VideosList selectedAgeGroup={ageGroup} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
