'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StoryDetail from '../../components/StoryDetail';
import UserTracker from '../../components/UserTracker';

export default function StoryPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <UserTracker contentType="story" contentId={params.id} />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <StoryDetail storyId={params.id} />
      </div>
      <Footer />
    </div>
  );
}
