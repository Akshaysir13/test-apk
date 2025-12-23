// src/pages/LandingPage.tsx
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 'dheya',
      name: 'Dheya Course',
      icon: '📚',
      price: 'FREE',
      originalPrice: null,
      description: 'Foundation tests to start your journey',
      features: [
        '6+ Free Practice Tests',
        'Basic Question Bank',
        'Instant Results',
        'Self-paced Learning'
      ],
      highlight: false,
      buttonText: 'Start Free Tests',
      buttonAction: () => navigate('/free-tests')
    },
    {
      id: 'rank_booster',
      name: 'Rank Booster',
      icon: '🚀',
      price: '₹99',
      originalPrice: '₹299',
      description: 'Selected high-quality tests for focused preparation',
      features: [
        '10+ Premium Tests',
        '400+ Practice Questions',
        'Detailed Solutions',
        'Performance Analytics',
        'All Dheya Tests Included'
      ],
      highlight: true,
      popular: true,
      buttonText: 'Get Rank Booster',
      buttonAction: () => navigate('/login')
    },
    {
      id: 'foundation',
      name: 'Foundation Course',
      icon: '💎',
      price: '₹6,000',
      originalPrice: '₹12,000',
      description: 'Complete test series for serious aspirants',
      features: [
        '80+ Comprehensive Tests',
        '6000+ Practice Questions',
        'All Topics Covered',
        'Mock Tests & PYQs',
        'Expert Solutions & Daily Disccusions',
        '99 Percentile Guarantee',
        'All Previous Tests Included'
      ],
      highlight: true,
      popular: true,
      buttonText: 'Get Foundation',
      buttonAction: () => navigate('/login')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
         <div className="flex items-center gap-2">
         <img src="/logo.png" alt="Moghes Institute Logo" className="w-10 h-10" />
         <h1 className="text-2xl font-bold text-gray-900">Moghe's Institute ( JEE B.Arch & NATA )</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/free-tests')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Free Tests
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Master JEE B.Arch 2026 with Expert
          <span className="text-blue-600"> Mock Tests</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Practice with our comprehensive test series designed by SPA & NIT experts. 
          Choose the plan that fits your preparation needs.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="text-gray-700">80+ Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="text-gray-700">Detailed Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-gray-700">Topic-wise Practice</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                course.highlight ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              {/* Popular Badge */}
              {course.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  🔥 POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Icon & Name */}
                <div className="text-center mb-6">
                  <span className="text-6xl">{course.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-4">
                    {course.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        {course.originalPrice}
                      </span>
                    )}
                  </div>
                  {course.originalPrice && (
                    <p className="text-green-600 font-semibold mt-1">
                      Save {Math.round((1 - parseInt(course.price.replace(/[^\d]/g, '')) / parseInt(course.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                  {course.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={course.buttonAction}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                    course.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : course.id === 'dheya'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {course.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Students Trust Us
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-2">Expert Content</h4>
              <p className="text-blue-100">Questions designed by IIT graduates</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-2">Detailed Analytics</h4>
              <p className="text-blue-100">Track your progress with insights</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold mb-2">Instant Results</h4>
              <p className="text-blue-100">Get immediate feedback on tests</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold mb-2">Secure Access</h4>
              <p className="text-blue-100">One device policy for fairness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Moghes Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}