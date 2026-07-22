// src/pages/Login.tsx - FIXED VERSION
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PAID_COURSES = ['foundation', 'rank_booster', 'advance_2026', 'nata_2026'];

function getCoursesForEmail(email: string, accounts: { email: string; courses?: string[] }[]): string[] {
  const match = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  return match?.courses ?? ['free_tests'];
}

function requiresDheyaPasswordRules(courses: string[]): boolean {
  const hasPaid = courses.some((c) => PAID_COURSES.includes(c));
  if (hasPaid) return false;
  return courses.includes('dheya') || courses.includes('free_tests');
}

export default function Login() {
  const { login, accounts } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const prospectiveCourses = useMemo(
    () => getCoursesForEmail(email, accounts),
    [email, accounts]
  );

  const dheyaPasswordRules = requiresDheyaPasswordRules(prospectiveCourses);

  const validatePassword = (value: string): string => {
    if (!dheyaPasswordRules) return '';
    if (value.length < 8 || value.length > 15) {
      return 'Password must be 8–15 characters';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (dheyaPasswordRules) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const pwdErr = validatePassword(password);
    if (dheyaPasswordRules && pwdErr) {
      setPasswordError(pwdErr);
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moghes Institute</h1>
          <p className="text-gray-600 mt-2">Mock Test Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="student@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                passwordError ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              required
              minLength={dheyaPasswordRules ? 8 : undefined}
              maxLength={dheyaPasswordRules ? 15 : undefined}
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!passwordError}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>⚠️ Note: Each account can only be used on one device</p>
        </div>
      </div>
    </div>
  );
}
