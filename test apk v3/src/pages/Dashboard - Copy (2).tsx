// src/pages/Dashboard.tsx - UPDATED WITH COURSE ACCESS CONTROL

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import { canAccessTest, getCourseInfo } from '../utils/courseAccess';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeCourse, setUpgradeCourse] = useState<'foundation' | 'rank_booster' | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Filter tests by access
  const accessibleTests = tests.filter(test => 
    canAccessTest(currentUser.courses, test.course)
  );
  
  const lockedTests = tests.filter(test => 
    !canAccessTest(currentUser.courses, test.course)
  );

  // Apply category filter
  const filteredAccessibleTests = selectedCategory === 'all' 
    ? accessibleTests 
    : accessibleTests.filter(t => t.category === selectedCategory);

  const filteredLockedTests = selectedCategory === 'all'
    ? lockedTests
    : lockedTests.filter(t => t.category === selectedCategory);

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

  const handleUpgrade = (course: 'foundation' | 'rank_booster') => {
    setUpgradeCourse(course);
    setShowUpgradeModal(true);
  };

  const courseInfo = upgradeCourse ? getCourseInfo(upgradeCourse) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser.email}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                {currentUser.courses?.includes('foundation') && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    💎 Foundation Course
                  </span>
                )}
                {currentUser.courses?.includes('rank_booster') && !currentUser.courses?.includes('foundation') && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    🚀 Rank Booster Course
                  </span>
                )}
                {(!currentUser.courses || currentUser.courses.length === 0 || (currentUser.courses.length === 1 && currentUser.courses.includes('dheya'))) && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    📚 Dheya Course (Free)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Accessible Tests
            </h3>
            <p className="text-4xl font-bold text-blue-600">
              {accessibleTests.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Tests
            </h3>
            <p className="text-4xl font-bold text-gray-600">
              {tests.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Locked Tests
            </h3>
            <p className="text-4xl font-bold text-orange-600">
              {lockedTests.length}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Tests
            </button>
            {testCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Accessible Tests */}
        {filteredAccessibleTests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Available Tests ({filteredAccessibleTests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccessibleTests.map(test => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-green-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {test.name}
                    </h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {test.category?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {test.questions?.length || 50} Questions
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Tests */}
        {filteredLockedTests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔒 Locked Tests - Upgrade Required ({filteredLockedTests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLockedTests.map(test => (
                <div
                  key={test.id}
                  className="bg-gray-50 p-6 rounded-lg shadow border-2 border-gray-300 opacity-75"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-700 flex-1">
                      {test.name}
                    </h3>
                    <span className="text-2xl">🔒</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded">
                      {test.category?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold">
                      {test.course === 'foundation' ? '₹6,000' : '₹99'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleUpgrade(test.course as 'foundation' | 'rank_booster')}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
                  >
                    🔒 Upgrade to Access
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Tests Message */}
        {filteredAccessibleTests.length === 0 && filteredLockedTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No tests found in this category.
            </p>
          </div>
        )}

        {/* Upgrade Cards */}
        {lockedTests.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              🚀 Unlock More Tests!
            </h2>
            <p className="text-lg mb-6">
              Get access to {lockedTests.length} more premium tests
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {!currentUser.courses?.includes('rank_booster') && !currentUser.courses?.includes('foundation') && (
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">🚀 Rank Booster</h3>
                  <p className="text-3xl font-bold mb-3">₹99</p>
                  <p className="mb-4">40+ Selected Tests</p>
                  <button
                    onClick={() => handleUpgrade('rank_booster')}
                    className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-bold"
                  >
                    Get Rank Booster
                  </button>
                </div>
              )}
              
              {!currentUser.courses?.includes('foundation') && (
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">💎 Foundation</h3>
                  <p className="text-3xl font-bold mb-3">₹6,000</p>
                  <p className="mb-4">ALL 80+ Tests</p>
                  <button
                    onClick={() => handleUpgrade('foundation')}
                    className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold"
                  >
                    Get Foundation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && courseInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <span className="text-5xl">{courseInfo.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
                Upgrade to {courseInfo.name}
              </h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">{courseInfo.price}</p>
              <p className="text-gray-600 mb-6">{courseInfo.description}</p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Payment Instructions:</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Make payment via UPI/Bank Transfer</li>
                  <li>2. Send payment screenshot to admin</li>
                  <li>3. Wait for admin approval</li>
                  <li>4. Access will be granted within 24 hours</li>
                </ol>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Contact Admin:</p>
                <p className="text-sm text-gray-600">Email: admin@moghes.com</p>
                <p className="text-sm text-gray-600">Phone: +91 XXXXX XXXXX</p>
              </div>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}