'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UserTracker from '../components/UserTracker';
import Link from 'next/link';

export default function ParentsPage() {
  return (
    <div>
      <UserTracker contentType="general" />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">For Parents</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Our Commitment to Your Children</h2>
            <p className="mb-4 text-gray-700">
              At Kidz Zone, we understand that parents are looking for safe, educational, and engaging content for their children.
              Our platform is designed with your child&apos;s development and safety in mind, providing age-appropriate stories and videos
              that entertain while they educate.
            </p>
            <p className="mb-4 text-gray-700">
              Every piece of content on our platform is carefully reviewed by our team of educators and child development experts
              to ensure it meets our high standards for quality and appropriateness.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Content Safety & Trust</h2>
            <p className="mb-4 text-gray-700">
              We take the safety of our content extremely seriously. Here&apos;s how we ensure our platform remains trustworthy:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>All stories and videos are manually reviewed before being published</li>
              <li>Content is categorized by age group to ensure age-appropriateness</li>
              <li>No advertisements or external links that could lead children away from our safe environment</li>
              <li>No collection of personal information from children</li>
              <li>Regular content audits to maintain our high standards</li>
            </ul>
            <p className="text-gray-700">
              We believe in transparency with parents. If you ever have concerns about any content on our platform,
              please don&apos;t hesitate to contact us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-3 text-green-700">Educational Benefits</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Promotes literacy and language development</li>
                <li>Encourages imagination and creativity</li>
                <li>Teaches important life lessons and values</li>
                <li>Supports cognitive development</li>
                <li>Introduces diverse cultures and perspectives</li>
              </ul>
            </div>

            <div className="bg-pink-50 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-3 text-pink-700">How Parents Can Get Involved</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Explore stories and videos with your child</li>
                <li>Discuss the themes and lessons from the stories</li>
                <li>Suggest new content or topics you&apos;d like to see</li>
                <li>Provide feedback on existing content</li>
                <li>Share your child&apos;s favorite stories with friends and family</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Contact Us</h2>
            <p className="mb-6 text-gray-700">
              We value your input and are always looking to improve our platform. If you have any questions,
              suggestions, or concerns, please don&apos;t hesitate to reach out to us.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <a
                href="mailto:contact@kidzzone.com"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-700 transition"
              >
                Email Us
              </a>
              <a
                href="#"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Feedback Form
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
