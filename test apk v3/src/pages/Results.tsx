// src/pages/Results.tsx
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';

export default function Results() {
  const navigate = useNavigate();
  const { currentTest, answers } = useTest();

  if (!currentTest) {
    navigate('/dashboard');
    return null;
  }

  // Calculate score
  const totalQuestions = currentTest.questions?.length || 0;
  const correctAnswers = Object.entries(answers).filter(
    ([qId, answer]) => {
      const question = currentTest.questions?.find(q => q.id === qId);
      return question && question.correctAnswer === answer;
    }
  ).length;

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Test Completed! 🎉</h1>
            <p className="text-lg opacity-90">{currentTest.name}</p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-8 mb-4">
                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {percentage}%
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">Grade: {grade}</p>
              <p className="text-gray-600">
                {correctAnswers} out of {totalQuestions} correct
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
                <p className="text-sm text-gray-600 mt-1">Correct</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-600">
                  {totalQuestions - correctAnswers}
                </p>
                <p className="text-sm text-gray-600 mt-1">Incorrect</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-6 rounded-lg mb-8 ${
              percentage >= 80 
                ? 'bg-green-50 border-2 border-green-200' 
                : percentage >= 60 
                ? 'bg-yellow-50 border-2 border-yellow-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {percentage >= 80 
                  ? '🌟 Excellent Performance!' 
                  : percentage >= 60 
                  ? '👍 Good Effort!' 
                  : '💪 Keep Practicing!'}
              </p>
              <p className="text-gray-600">
                {percentage >= 80 
                  ? 'You have shown great understanding of the concepts. Keep up the excellent work!'
                  : percentage >= 60 
                  ? 'You are on the right track. Review the incorrect answers and keep practicing.'
                  : 'Don\'t be discouraged! Every test is a learning opportunity. Review the solutions and try again.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📚 Study Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Review all incorrect answers and understand why they were wrong</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Practice similar questions to strengthen weak areas</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Take regular breaks while studying to maintain focus</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Attempt more tests to build speed and accuracy</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}