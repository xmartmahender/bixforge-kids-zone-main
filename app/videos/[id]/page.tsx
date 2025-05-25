'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import VideoDetail from '../../components/VideoDetail';
import UserTracker from '../../components/UserTracker';

export default function VideoPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <UserTracker contentType="video" contentId={params.id} />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <VideoDetail videoId={params.id} />
      </div>
      <Footer />
    </div>
  );
}
