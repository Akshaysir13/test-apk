import { Test } from '../types';
import {
  TestResultRow,
  buildAttemptLog,
  buildReattemptRows,
  buildStudentSummaries,
  formatCourseLabel,
  formatDuration,
  getActivityBadge,
  getAttemptLabel,
  getTestTypeLabel,
  getTestsForStudentCourses,
  buildTestWiseComparison,
} from '../lib/adminData';
import SincerityBar from './admin/SincerityBar';
import ScoreSparkline from './admin/ScoreSparkline';
import StudentPerformanceCharts from './admin/StudentPerformanceCharts';
import TestWiseComparisonSection from './TestWiseComparisonSection';

interface StudentPerformanceContentProps {
  email: string;
  courses: string[];
  results: TestResultRow[];
  allResults?: TestResultRow[];
  tests: Test[];
  sessions?: { user_email: string; expires_at: string }[];
  devices?: { user_email: string; last_active: string }[];
  showCharts?: boolean;
}

export default function StudentPerformanceContent({
  email,
  courses,
  results,
  allResults,
  tests,
  sessions = [],
  devices = [],
  showCharts = true,
}: StudentPerformanceContentProps) {
  const studentResults = results.filter(
    (r) => r.user_email.toLowerCase() === email.toLowerCase()
  );

  const peerResults = allResults ?? results;
  const testWiseComparison = buildTestWiseComparison(email, studentResults, peerResults);

  const summary = buildStudentSummaries(
    [{ email, courses }],
    studentResults.length ? studentResults : results,
    devices,
    sessions,
    tests
  )[0];

  const availableTests = getTestsForStudentCourses(courses, tests);
  const attemptedNames = new Set(studentResults.map((r) => r.test_name));
  const missedTests = availableTests.filter((t) => !attemptedNames.has(t.name));
  const reattemptRows = buildReattemptRows(studentResults);
  const attemptLog = buildAttemptLog(studentResults);
  const maxAttempts = Math.max(...reattemptRows.map((r) => r.timesAttempted), 0);
  const activityBadge = getActivityBadge(summary.activityStatus);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Performance</h2>
            <p className="text-gray-600 mt-1">
              Courses: {courses.map(formatCourseLabel).join(', ') || '—'}
            </p>
            <span
              className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-sm font-medium ${activityBadge.className}`}
            >
              {activityBadge.emoji} {activityBadge.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard label="Total Tests Taken" value={String(summary.totalAttempts)} />
        <SummaryCard label="Unique Tests" value={String(summary.uniqueTestsAttempted)} />
        <SummaryCard label="Tests Re-attempted" value={String(summary.testsWithReattempts)} />
        <SummaryCard label="Never Attempted" value={String(summary.testsMissed)} />
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 col-span-2 md:col-span-1 lg:col-span-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sincerity Score</p>
          <SincerityBar score={summary.sincerityScore} large />
        </div>
        <SummaryCard
          label="Est. Time on Tests"
          value={formatDuration(summary.estimatedTimeSpentSec)}
          sub="Based on test durations"
        />
      </div>

      <TestWiseComparisonSection rows={testWiseComparison} />

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Re-attempt Tracker</h3>
        {reattemptRows.length === 0 ? (
          <p className="text-gray-500">No test attempts recorded yet. Start a test to track progress.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 font-semibold">Test Title</th>
                  <th className="p-3 font-semibold">Times Attempted</th>
                  {Array.from({ length: maxAttempts }, (_, i) => (
                    <th key={i} className="p-3 font-semibold whitespace-nowrap">
                      Attempt {i + 1} Score
                    </th>
                  ))}
                  <th className="p-3 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {reattemptRows.map((row) => (
                  <tr
                    key={row.testName}
                    className={`border-t ${row.timesAttempted >= 3 ? 'bg-orange-50' : ''}`}
                  >
                    <td className="p-3 font-medium text-gray-900">{row.testName}</td>
                    <td className="p-3 text-center font-semibold">{row.timesAttempted}</td>
                    {Array.from({ length: maxAttempts }, (_, i) => (
                      <td key={i} className="p-3 text-center text-gray-700">
                        {row.scores[i] !== undefined ? `${row.scores[i].toFixed(1)}%` : '—'}
                      </td>
                    ))}
                    <td className="p-3">
                      <ScoreSparkline scores={row.scores} trend={row.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-4 italic border-t border-gray-100 pt-4">
          Re-attempting tests helps you improve. Taking a test 3+ times shows strong dedication.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tests Not Yet Attempted ({missedTests.length})
        </h3>
        {missedTests.length === 0 ? (
          <p className="text-gray-500">You have attempted every available test in your course(s).</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {missedTests.slice(0, 20).map((test) => (
              <li
                key={test.id}
                className="flex flex-wrap items-center gap-2 text-sm border-b border-gray-100 pb-2"
              >
                <span className="font-medium text-gray-900">{test.name}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {formatCourseLabel(test.course || '')}
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                  {getTestTypeLabel(test)}
                </span>
              </li>
            ))}
            {missedTests.length > 20 && (
              <p className="text-xs text-gray-400 pt-2">+ {missedTests.length - 20} more tests</p>
            )}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Attempt Log</h3>
        {attemptLog.length === 0 ? (
          <p className="text-gray-500">No attempts logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 font-semibold">Date & Time</th>
                  <th className="p-3 font-semibold">Test Title</th>
                  <th className="p-3 font-semibold">Score</th>
                  <th className="p-3 font-semibold">Attempt #</th>
                </tr>
              </thead>
              <tbody>
                {attemptLog.map((row) => (
                  <tr key={`${row.testName}-${row.submittedAt}`} className="border-t">
                    <td className="p-3 text-gray-600">{row.date}</td>
                    <td className="p-3 font-medium">{row.testName}</td>
                    <td className="p-3">
                      {row.score} ({row.percentage.toFixed(1)}%)
                    </td>
                    <td className="p-3">
                      <AttemptBadge attemptNumber={row.attemptNumber} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showCharts && studentResults.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Charts</h3>
          <StudentPerformanceCharts
            email={email}
            courses={courses}
            results={studentResults}
            tests={tests}
          />
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function AttemptBadge({ attemptNumber }: { attemptNumber: number }) {
  const label = getAttemptLabel(attemptNumber);
  const className =
    attemptNumber === 1
      ? 'bg-gray-100 text-gray-700'
      : attemptNumber === 2
      ? 'bg-blue-100 text-blue-800'
      : 'bg-orange-100 text-orange-800';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>{label}</span>
  );
}
