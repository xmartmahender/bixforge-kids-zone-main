'use client';

import React from 'react';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import StoryDetail from '../../components/StoryDetail';
import UserTracker from '../../components/UserTracker';

export default function StoryPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <UserTracker contentType="story" contentId={params.id} />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <StoryDetail storyId={params.id} />
      </div>
      <Footer />
    </div>
  );
}
