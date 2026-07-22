import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, LogOut, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTest } from '../contexts/TestContext';
import { supabase } from '../lib/supabase';
import {
  buildStudentSummaries,
  DeviceRow,
  formatCourseLabel,
  getActivityBadge,
  SessionRow,
  StudentSummary,
  TestResultRow,
} from '../lib/adminData';
import StudentDetailView from '../components/admin/StudentDetailView';
import SincerityBar from '../components/admin/SincerityBar';

type SincerityFilter = 'all' | 'high' | 'moderate' | 'low';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser, logout, accounts } = useAuth();
  const { tests } = useTest();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResultRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState('all');
  const [sincerityFilter, setSincerityFilter] = useState<SincerityFilter>('all');

  const students = useMemo(
    () => accounts.filter((a) => a.role === 'student'),
    [accounts]
  );

  const summaries = useMemo(
    () => buildStudentSummaries(students, results, devices, sessions, tests),
    [students, results, devices, sessions, tests]
  );

  const filteredSummaries = useMemo(() => {
    let list = summaries;

    if (courseFilter !== 'all') {
      list = list.filter((s) => s.courses.includes(courseFilter));
    }

    if (sincerityFilter !== 'all') {
      list = list.filter((s) => s.sincerityTier === sincerityFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.email.toLowerCase().includes(q));
    }

    return list.sort((a, b) => b.sincerityScore - a.sincerityScore);
  }, [summaries, courseFilter, sincerityFilter, search]);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const [resultsRes, sessionsRes] = await Promise.all([
          supabase.from('test_results').select('*').order('submitted_at', { ascending: false }),
          supabase.from('user_sessions').select('user_email, device_id, expires_at, created_at'),
        ]);

        if (!resultsRes.error && resultsRes.data) setResults(resultsRes.data as TestResultRow[]);
        if (!sessionsRes.error && sessionsRes.data) setSessions(sessionsRes.data as SessionRow[]);

        const devicesRes = await supabase
          .from('user_devices')
          .select('user_email, device_id, device_type, last_active, is_blocked');
        if (!devicesRes.error && devicesRes.data) setDevices(devicesRes.data as DeviceRow[]);
      } catch (err) {
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const selectedStudent = selectedEmail
    ? students.find((s) => s.email.toLowerCase() === selectedEmail.toLowerCase())
    : null;

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  if (selectedEmail && selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <StudentDetailView
            email={selectedStudent.email}
            courses={selectedStudent.courses ?? []}
            results={results}
            tests={tests}
            sessions={sessions}
            devices={devices}
            onBack={() => setSelectedEmail(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Performance Tracker</h1>
            <p className="text-gray-600 text-sm mt-1">
              {students.length} students · sorted by sincerity score
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/attendance')}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Legacy attendance table →
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Courses</option>
            <option value="foundation">Foundation</option>
            <option value="nata_2026">NATA 2026</option>
            <option value="rank_booster">Rank Booster</option>
            <option value="advance_2026">Advance 2026</option>
            <option value="dheya">Dheya</option>
          </select>
          <select
            value={sincerityFilter}
            onChange={(e) => setSincerityFilter(e.target.value as SincerityFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Sincerity</option>
            <option value="high">High Sincerity (70+)</option>
            <option value="moderate">Moderate (40–69)</option>
            <option value="low">Low (&lt;40)</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-purple-50 text-left">
                    <th className="p-3 font-semibold text-gray-700">Email</th>
                    <th className="p-3 font-semibold text-gray-700">Course(s)</th>
                    <th className="p-3 font-semibold text-gray-700">Total Attempts</th>
                    <th className="p-3 font-semibold text-gray-700">Unique Tests</th>
                    <th className="p-3 font-semibold text-gray-700">Re-attempts</th>
                    <th className="p-3 font-semibold text-gray-700 min-w-[140px]">Sincerity</th>
                    <th className="p-3 font-semibold text-gray-700">Last Active</th>
                    <th className="p-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSummaries.map((row: StudentSummary) => {
                    const badge = getActivityBadge(row.activityStatus);
                    return (
                      <tr
                        key={row.email}
                        onClick={() => setSelectedEmail(row.email)}
                        className="border-t border-gray-100 hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-medium text-purple-700">{row.email}</td>
                        <td className="p-3 text-gray-600">
                          {row.courses.map(formatCourseLabel).join(', ') || '—'}
                        </td>
                        <td className="p-3 text-center">{row.totalAttempts}</td>
                        <td className="p-3 text-center">{row.uniqueTestsAttempted}</td>
                        <td className="p-3 text-center">{row.reattemptCount}</td>
                        <td className="p-3">
                          <SincerityBar score={row.sincerityScore} />
                        </td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">
                          {row.lastActive
                            ? new Date(row.lastActive).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.emoji} {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredSummaries.length === 0 && (
              <p className="text-center text-gray-500 py-12">No students match your filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Moghes Institute — Admin</h2>
          <p className="text-xs text-gray-500">Student Performance Tracker</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
