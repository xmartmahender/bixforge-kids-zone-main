'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCrown, FaCheck, FaTimes, FaShoppingCart,
  FaGift, FaUsers, FaDownload, FaHeadset, FaMoneyBillWave
} from 'react-icons/fa';
import Header from '../components/header';
import Footer from '../components/footer';
import { FeedbackButton } from '../components/FeedbackForm';
import { getSubscriptionPackages, SubscriptionPackage } from '../../lib/subscriptionService';

export default function SubscriptionsPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const allPackages = await getSubscriptionPackages();
      // Only show active packages to users
      const activePackages = allPackages.filter(pkg => pkg.isActive);
      setPackages(activePackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'text-green-600 bg-green-100';
      case 'premium': return 'text-blue-600 bg-blue-100';
      case 'pro': return 'text-purple-600 bg-purple-100';
      case 'unlimited': return 'text-gold-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'basic': return '🌱';
      case 'premium': return '⭐';
      case 'pro': return '💎';
      case 'unlimited': return '👑';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription packages...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <FaCrown className="text-4xl mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Subscription Plans</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Choose the perfect plan for your child&apos;s learning journey
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                <span>Age-appropriate content</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                <span>Educational stories & videos</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                <span>Coding tutorials</span>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="container mx-auto px-4 py-16">
          {packages.length === 0 ? (
            <div className="text-center py-16">
              <FaGift className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Packages Available</h3>
              <p className="text-gray-500 mb-6">
                We&apos;re working on creating amazing subscription packages for you!
              </p>
              <FeedbackButton
                contentId="subscriptions-page"
                contentType="story"
                contentTitle="Subscription Packages Request"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`
                    relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
                    border-2 hover:border-purple-300 transform hover:-translate-y-2
                    ${pkg.accessLevel === 'unlimited' ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-gray-200'}
                  `}
                >
                  {/* Popular Badge */}
                  {pkg.accessLevel === 'premium' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Best Value Badge */}
                  {pkg.accessLevel === 'unlimited' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Best Value
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Package Header */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">{getAccessLevelIcon(pkg.accessLevel)}</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                      {/* Access Level Badge */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getAccessLevelColor(pkg.accessLevel)}`}>
                        {pkg.accessLevel.charAt(0).toUpperCase() + pkg.accessLevel.slice(1)} Plan
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-2">
                        <FaMoneyBillWave className="text-green-500 mr-2" />
                        <span className="text-3xl font-bold text-gray-800">
                          ${pkg.price}
                        </span>
                        <span className="text-gray-500 ml-1">
                          {pkg.price === 0 ? '' : `/${pkg.duration} days`}
                        </span>
                      </div>
                      {pkg.price > 0 && (
                        <p className="text-sm text-gray-500">
                          ${(pkg.price / pkg.duration * 30).toFixed(2)}/month
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {pkg.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}

                      {/* Content Access */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Content Access:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(pkg.contentAccess).map(([content, hasAccess]) => (
                            <div key={content} className="flex items-center">
                              {hasAccess ? (
                                <FaCheck className="text-green-500 mr-1" />
                              ) : (
                                <FaTimes className="text-red-400 mr-1" />
                              )}
                              <span className={hasAccess ? 'text-gray-700' : 'text-gray-400'}>
                                {content.charAt(0).toUpperCase() + content.slice(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="pt-3 border-t border-gray-200 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaDownload className="mr-2" />
                          <span>{pkg.maxDownloads} downloads/month</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaHeadset className="mr-2" />
                          <span>{pkg.supportLevel} support</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-2" />
                          <span>Ages: {pkg.ageGroupAccess.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(pkg)}
                      className={`
                        w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300
                        flex items-center justify-center space-x-2
                        ${pkg.price === 0
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : pkg.accessLevel === 'unlimited'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }
                      `}
                    >
                      <FaShoppingCart />
                      <span>{pkg.price === 0 ? 'Get Free Plan' : 'Subscribe Now'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Feedback Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-6">
              Have questions about our subscription plans? We&apos;d love to help you find the perfect fit for your child!
            </p>
            <FeedbackButton
              contentId="subscriptions-help"
              contentType="story"
              contentTitle="Subscription Plans Help Request"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPackage && (
        <PurchaseModal
          package={selectedPackage}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedPackage(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

// Purchase Modal Component
interface PurchaseModalProps {
  package: SubscriptionPackage;
  onClose: () => void;
}

function PurchaseModal({ package: pkg, onClose }: PurchaseModalProps) {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    childAge: '',
    paymentMethod: 'card'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);

    // Simulate purchase process
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Store user subscription info
      const userId = localStorage.getItem('user_id') || `user_${Date.now()}`;
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', userId);
      }

      const subscriptionData = {
        userId,
        packageId: pkg.id,
        packageName: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000).toISOString(),
        userInfo
      };

      localStorage.setItem('userSubscription', JSON.stringify(subscriptionData));

      // Close modal after success message
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Purchase Successful!</h3>
          <p className="text-gray-600 mb-4">
            Welcome to {pkg.name}! Your subscription is now active.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              You now have access to all {pkg.name} features. Enjoy learning!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Complete Purchase</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Package Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-purple-800 mb-2">{pkg.name}</h4>
          <div className="flex justify-between items-center">
            <span className="text-purple-600">Total:</span>
            <span className="text-2xl font-bold text-purple-800">
              ${pkg.price} {pkg.price > 0 && `for ${pkg.duration} days`}
            </span>
          </div>
        </div>

        {/* User Information Form */}
        <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent/Guardian Name *
            </label>
            <input
              type="text"
              required
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Child&apos;s Age Group
            </label>
            <select
              value={userInfo.childAge}
              onChange={(e) => setUserInfo({ ...userInfo, childAge: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select age group</option>
              <option value="0-3">0-3 years</option>
              <option value="3-6">3-6 years</option>
              <option value="6-9">6-9 years</option>
              <option value="9-12">9-12 years</option>
            </select>
          </div>

          {pkg.price > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={userInfo.paymentMethod}
                onChange={(e) => setUserInfo({ ...userInfo, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300
              ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }
              text-white flex items-center justify-center space-x-2
            `}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaShoppingCart />
                <span>{pkg.price === 0 ? 'Activate Free Plan' : 'Complete Purchase'}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By purchasing, you agree to our Terms of Service and Privacy Policy.
          {pkg.price === 0 ? ' This is a free plan with no charges.' : ' Secure payment processing.'}
        </p>
      </div>
    </div>
  );
}
