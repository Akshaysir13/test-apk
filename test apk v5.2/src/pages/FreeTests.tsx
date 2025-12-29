// src/pages/FreeTests.tsx - CONVERSION OPTIMIZED
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';

export default function FreeTests() {
  const navigate = useNavigate();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPopup, setShowPopup] = useState(false);

  // Show upgrade popup after viewing 3 tests
  useEffect(() => {
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    if (viewCount >= 3) {
      setShowPopup(true);
    }
  }, []);

  const dheyaTests = tests.filter(test => test.course === 'dheya');
  const filteredTests = selectedCategory === 'all' 
    ? dheyaTests 
    : dheyaTests.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Tests', icon: '📚', color: 'bg-blue-600' },
    { id: 'pyq', name: 'PYQ (2023-2025)', icon: '📚', color: 'bg-yellow-600' },
  ];

  const handleStartTest = (test: any) => {
    // Track views for popup
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    localStorage.setItem('freeTestViews', String(viewCount + 1));
    
    selectTest(test);
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upgrade Popup - Appears after 3 test views */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative animate-bounce-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Loving the Free Tests?
              </h3>
              <p className="text-gray-600 text-lg">
                Get 70+ more tests and ace JEE B.Arch 2026!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <span className="text-4xl mb-2 block">🚀</span>
                <h4 className="text-xl font-bold mb-2">Rank Booster</h4>
                <p className="text-3xl font-bold text-blue-600 mb-3">₹99</p>
                <p className="text-sm text-gray-600 mb-3">₹3/day for 30 days!</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✓ 10+ Premium Tests</li>
                  <li>✓ 2023-2025 Complete PYQs</li>
                  <li>✓ Detailed Analytics</li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Upgrade Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <span className="text-4xl mb-2 block">💎</span>
                <h4 className="text-xl font-bold mb-2">Foundation</h4>
                <p className="text-3xl font-bold text-purple-600 mb-3">₹4,999</p>
                <p className="text-sm text-gray-600 mb-3 line-through">₹12,000</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✓ 80+ Complete Test Series</li>
                  <li>✓ 2005-2025 PYQ Bank</li>
                  <li>✓ 99 Percentile Strategy</li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
                >
                  Get Foundation
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              🔒 Limited time offer • ⏰ Expires in 48 hours
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Moghe's Institute
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold text-sm md:text-base"
              >
                ← Home
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm md:text-base"
              >
                🚀 Upgrade
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold flex items-center justify-center gap-2 flex-wrap">
            <span className="animate-pulse">🔥</span>
            <span>FLASH SALE: 60% OFF Foundation Course</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Ends in 48 hours</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎁 Free Practice Tests - JEE B.Arch 2026
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Start your preparation journey • No payment required
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">{dheyaTests.length}</p>
              <p className="text-xs md:text-sm">Free Tests</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-xs md:text-sm">Free Forever</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">∞</p>
              <p className="text-xs md:text-sm">Unlimited Attempts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span><strong className="text-gray-900">10,000+</strong> Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span><strong className="text-gray-900">4.8/5</strong> Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span><strong className="text-gray-900">500+</strong> Success Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Locked Content Teaser */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🔒 70+ Premium Tests Locked
              </h3>
              <p className="text-gray-600">
                Upgrade to access complete test series (2005-2025 PYQs)
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg whitespace-nowrap"
            >
              Unlock Now →
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Category</h3>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Test Grid */}
        {filteredTests.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Available Tests ({filteredTests.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-green-200 hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-gray-900 flex-1">
                      {test.name}
                    </h4>
                    <span className="text-2xl">🆓</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {test.description}
                  </p>
                  
                  <div className="flex gap-2 mb-4 text-sm flex-wrap">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                      📚 {test.category?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                      ✓ {test.questions?.length || 50} Questions
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg"
                  >
                    Start Test →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">😢</span>
            <p className="text-xl text-gray-600">No tests in this category.</p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">
              📊 Compare Plans - Choose What's Best For You
            </h3>
            <p className="text-blue-100">Free vs Premium - See the difference</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">🆓</span>
                      <span>Dheya</span>
                      <span className="text-green-600 text-sm">FREE</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold bg-blue-50">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">🚀</span>
                      <span>Rank Booster</span>
                      <span className="text-blue-600 text-sm">₹99</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold bg-purple-50">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">💎</span>
                      <span>Foundation</span>
                      <span className="text-purple-600 text-sm">₹4,999</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4">Number of Tests</td>
                  <td className="px-6 py-4 text-center">{dheyaTests.length}</td>
                  <td className="px-6 py-4 text-center bg-blue-50 font-bold">10+</td>
                  <td className="px-6 py-4 text-center bg-purple-50 font-bold">80+</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-6 py-4">PYQ Coverage</td>
                  <td className="px-6 py-4 text-center">2023-2025</td>
                  <td className="px-6 py-4 text-center bg-blue-50">2023-2025</td>
                  <td className="px-6 py-4 text-center bg-purple-50 font-bold">2005-2025 ✓</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Detailed Solutions</td>
                  <td className="px-6 py-4 text-center">✓ Basic</td>
                  <td className="px-6 py-4 text-center bg-blue-50">✓ Detailed</td>
                  <td className="px-6 py-4 text-center bg-purple-50">✓ Expert Level</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-6 py-4">Performance Analytics</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center bg-blue-50">✓</td>
                  <td className="px-6 py-4 text-center bg-purple-50">✓ Advanced</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Latest Pattern Tests</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center bg-blue-50">✓</td>
                  <td className="px-6 py-4 text-center bg-purple-50">✓ All Patterns</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-6 py-4">Support</td>
                  <td className="px-6 py-4 text-center">Community</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Email Support</td>
                  <td className="px-6 py-4 text-center bg-purple-50">Priority 24/7</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-semibold">
                      Current Plan
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                    >
                      Upgrade →
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center bg-purple-50">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
                    >
                      Get Now →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            🌟 What Our Students Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rahul S.", score: "250/400", text: "Foundation course helped me crack JEE B.Arch! Mock tests were exactly like the real exam." },
              { name: "Priya M.", score: "245/400", text: "Worth every rupee! Got into SPA Delhi thanks to these tests." },
              { name: "Arjun K.", score: "238/400", text: "Started with free tests, upgraded to Foundation. Best decision ever!" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-green-600 font-semibold">Scored {testimonial.score}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            🚀 Ready to Ace JEE B.Arch 2026?
          </h3>
          <p className="text-xl mb-6">
            Join 10,000+ students preparing with our premium test series
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-transform"
            >
              🚀 Get Rank Booster - ₹99
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-transform"
            >
              💎 Get Foundation - ₹4,999
            </button>
          </div>
          <p className="mt-4 text-sm text-white/80">
            ⏰ Limited time offer • 💯 Money-back guarantee • 🔒 Secure payment
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📞 Need Help?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">📧 Email:</span> admin@moghes.com
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">📱 WhatsApp:</span> +91 7028140857
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">⏰ Response Time:</span> Within 2 hours
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">🕐 Available:</span> 9 AM - 9 PM (7 days)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">© 2024 Moghes Institute. All rights reserved.</p>
          <p className="text-sm text-gray-500">Trusted by 10,000+ JEE B.Arch aspirants</p>
        </div>
      </footer>
    </div>
  );
}