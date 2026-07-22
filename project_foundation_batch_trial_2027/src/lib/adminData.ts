import { Test } from '../types';

export interface TestResultRow {
  id?: string;
  user_email: string;
  test_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
}

export interface SessionRow {
  user_email: string;
  device_id: string;
  expires_at: string;
  created_at?: string;
}

export interface DeviceRow {
  user_email: string;
  device_id: string;
  device_type?: string;
  last_active: string;
  is_blocked?: boolean;
}

export type ActivityStatus = 'active' | 'irregular' | 'inactive';
export type SincerityTier = 'high' | 'moderate' | 'low';

export interface StudentSummary {
  email: string;
  courses: string[];
  totalAttempts: number;
  uniqueTestsAttempted: number;
  reattemptCount: number;
  testsWithReattempts: number;
  testsMissed: number;
  totalAvailableTests: number;
  sincerityScore: number;
  sincerityTier: SincerityTier;
  lastActive: string | null;
  activityStatus: ActivityStatus;
  estimatedTimeSpentSec: number;
}

export interface ReattemptRow {
  testName: string;
  timesAttempted: number;
  scores: number[];
  trend: 'up' | 'down' | 'flat';
}

export interface AttemptLogRow {
  date: string;
  testName: string;
  score: number;
  percentage: number;
  timeTakenLabel: string;
  attemptNumber: number;
  submittedAt: string;
}

export interface TestWiseComparisonRow {
  testName: string;
  yourBest: number;
  yourLatest: number;
  yourAttempts: number;
  classAverage: number;
  classTop: number;
  totalStudents: number;
  yourRank: number;
  percentile: number;
  vsAverage: number;
}

function buildBestScoreMap(allResults: TestResultRow[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of allResults) {
    const key = `${row.user_email.toLowerCase()}::${row.test_name}`;
    const pct = Number(row.percentage) || 0;
    const existing = map.get(key);
    if (existing === undefined || pct > existing) {
      map.set(key, pct);
    }
  }
  return map;
}

export function buildTestWiseComparison(
  email: string,
  studentResults: TestResultRow[],
  allResults: TestResultRow[]
): TestWiseComparisonRow[] {
  const normalizedEmail = email.toLowerCase();
  const bestScoreMap = buildBestScoreMap(allResults);
  const studentTestNames = [...new Set(studentResults.map((r) => r.test_name))];

  return studentTestNames
    .map((testName) => {
      const myAttempts = studentResults
        .filter((r) => r.test_name === testName)
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

      const myScores = myAttempts.map((r) => Number(r.percentage) || 0);
      const yourBest = myScores.length ? Math.max(...myScores) : 0;
      const yourLatest = myScores.length ? myScores[0] : 0;

      const peerBests: { email: string; best: number }[] = [];
      for (const [key, best] of bestScoreMap.entries()) {
        const [peerEmail, peerTest] = key.split('::');
        if (peerTest === testName) {
          peerBests.push({ email: peerEmail, best });
        }
      }

      peerBests.sort((a, b) => b.best - a.best);
      const totalStudents = peerBests.length;
      const classAverage =
        totalStudents > 0
          ? peerBests.reduce((sum, p) => sum + p.best, 0) / totalStudents
          : 0;
      const classTop = peerBests[0]?.best ?? 0;
      const rankIndex = peerBests.findIndex((p) => p.email === normalizedEmail);
      const yourRank = rankIndex >= 0 ? rankIndex + 1 : totalStudents;

      const studentsBelow = peerBests.filter((p) => p.best < yourBest).length;
      const percentile =
        totalStudents <= 1 ? 100 : Math.round((studentsBelow / (totalStudents - 1)) * 100);

      return {
        testName,
        yourBest,
        yourLatest,
        yourAttempts: myAttempts.length,
        classAverage: Number(classAverage.toFixed(1)),
        classTop: Number(classTop.toFixed(1)),
        totalStudents,
        yourRank,
        percentile,
        vsAverage: Number((yourBest - classAverage).toFixed(1)),
      };
    })
    .sort((a, b) => b.yourBest - a.yourBest);
}

export function formatCourseLabel(course: string): string {
  const labels: Record<string, string> = {
    foundation: 'Foundation',
    rank_booster: 'Rank Booster',
    advance_2026: 'Advance 2026',
    nata_2026: 'NATA 2026',
    dheya: 'Dheya',
    free_tests: 'Free Tests',
  };
  return labels[course] || course;
}

export function getTestTypeLabel(test: Test): string {
  if (test.course === 'nata_2026' || test.category === 'nata') return 'NATA';
  if (test.category === 'topic') return 'Topic Test';
  return 'JEE';
}

export function getTestsForStudentCourses(courses: string[], allTests: Test[]): Test[] {
  if (!courses.length) return [];
  return allTests.filter((t) => t.course && courses.includes(t.course));
}

export function matchTestByName(testName: string, allTests: Test[]): Test | undefined {
  return allTests.find((t) => t.name === testName);
}

function daysSince(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getActivityStatus(lastActive: string | null): ActivityStatus {
  const days = daysSince(lastActive);
  if (days === null) return 'inactive';
  if (days <= 7) return 'active';
  if (days <= 30) return 'irregular';
  return 'inactive';
}

export function getActivityBadge(status: ActivityStatus): { emoji: string; label: string; className: string } {
  switch (status) {
    case 'active':
      return { emoji: '🔥', label: 'Active', className: 'bg-green-100 text-green-800' };
    case 'irregular':
      return { emoji: '⚠️', label: 'Irregular', className: 'bg-yellow-100 text-yellow-800' };
    default:
      return { emoji: '😴', label: 'Inactive', className: 'bg-gray-100 text-gray-600' };
  }
}

function getRecencyScore(lastActive: string | null): number {
  const days = daysSince(lastActive);
  if (days === null) return 0;
  if (days <= 7) return 1;
  if (days <= 30) return 0.5;
  return 0;
}

export function computeSincerityScore(
  uniqueTestsAttempted: number,
  testsWithReattempts: number,
  totalAvailableTests: number,
  lastActive: string | null
): number {
  if (totalAvailableTests === 0) return 0;

  const reattemptRatio = testsWithReattempts / totalAvailableTests;
  const completionRatio = uniqueTestsAttempted / totalAvailableTests;
  const recency = getRecencyScore(lastActive);

  const score = reattemptRatio * 40 + completionRatio * 30 + recency * 30;
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function getSincerityTier(score: number): SincerityTier {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function getSincerityColor(score: number): string {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getSincerityLabel(score: number): string {
  if (score >= 70) return 'Dedicated';
  if (score >= 40) return 'Moderate';
  return 'Low effort';
}

function getLastActive(
  email: string,
  devices: DeviceRow[],
  sessions: SessionRow[]
): string | null {
  const deviceDates = devices
    .filter((d) => d.user_email.toLowerCase() === email)
    .map((d) => d.last_active);
  const sessionDates = sessions
    .filter((s) => s.user_email.toLowerCase() === email)
    .map((s) => s.expires_at);
  const allDates = [...deviceDates, ...sessionDates].filter(Boolean);
  if (!allDates.length) return null;
  return new Date(Math.max(...allDates.map((d) => new Date(d).getTime()))).toISOString();
}

function estimateTimeSpent(results: TestResultRow[], allTests: Test[]): number {
  return results.reduce((total, row) => {
    const test = matchTestByName(row.test_name, allTests);
    return total + (test?.duration ?? 3600);
  }, 0);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function computeTrend(scores: number[]): 'up' | 'down' | 'flat' {
  if (scores.length < 2) return 'flat';
  const first = scores[0];
  const last = scores[scores.length - 1];
  const diff = last - first;
  if (diff > 2) return 'up';
  if (diff < -2) return 'down';
  return 'flat';
}

export function buildStudentSummaries(
  students: { email: string; courses?: string[] }[],
  results: TestResultRow[],
  devices: DeviceRow[],
  sessions: SessionRow[],
  allTests: Test[]
): StudentSummary[] {
  return students.map((student) => {
    const email = student.email.toLowerCase();
    const courses = student.courses ?? [];
    const studentResults = results.filter((r) => r.user_email.toLowerCase() === email);
    const availableTests = getTestsForStudentCourses(courses, allTests);
    const totalAvailableTests = availableTests.length;

    const attemptedNames = new Set(studentResults.map((r) => r.test_name));
    const uniqueTestsAttempted = attemptedNames.size;

    const attemptCounts = studentResults.reduce<Record<string, number>>((acc, row) => {
      acc[row.test_name] = (acc[row.test_name] || 0) + 1;
      return acc;
    }, {});

    const testsWithReattempts = Object.values(attemptCounts).filter((c) => c > 1).length;
    const reattemptCount = Object.values(attemptCounts).reduce(
      (sum, count) => sum + Math.max(0, count - 1),
      0
    );

    const availableNames = new Set(availableTests.map((t) => t.name));
    const testsMissed = [...availableNames].filter((name) => !attemptedNames.has(name)).length;

    const lastActive = getLastActive(email, devices, sessions);
    const sincerityScore = computeSincerityScore(
      uniqueTestsAttempted,
      testsWithReattempts,
      totalAvailableTests,
      lastActive
    );

    return {
      email,
      courses,
      totalAttempts: studentResults.length,
      uniqueTestsAttempted,
      reattemptCount,
      testsWithReattempts,
      testsMissed,
      totalAvailableTests,
      sincerityScore,
      sincerityTier: getSincerityTier(sincerityScore),
      lastActive,
      activityStatus: getActivityStatus(lastActive),
      estimatedTimeSpentSec: estimateTimeSpent(studentResults, allTests),
    };
  });
}

export function groupResultsByTestName(results: TestResultRow[]): Record<string, TestResultRow[]> {
  return results.reduce<Record<string, TestResultRow[]>>((acc, row) => {
    if (!acc[row.test_name]) acc[row.test_name] = [];
    acc[row.test_name].push(row);
    return acc;
  }, {});
}

export function buildReattemptRows(results: TestResultRow[]): ReattemptRow[] {
  const grouped = groupResultsByTestName(results);

  return Object.entries(grouped)
    .map(([testName, attempts]) => {
      const sorted = [...attempts].sort(
        (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      );
      const scores = sorted.map((a) => Number(a.percentage) || 0);
      return {
        testName,
        timesAttempted: sorted.length,
        scores,
        trend: computeTrend(scores),
      };
    })
    .sort((a, b) => b.timesAttempted - a.timesAttempted);
}

export function buildAttemptLog(results: TestResultRow[]): AttemptLogRow[] {
  const orderedByTest: Record<string, TestResultRow[]> = {};
  for (const row of [...results].sort(
    (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
  )) {
    if (!orderedByTest[row.test_name]) orderedByTest[row.test_name] = [];
    orderedByTest[row.test_name].push(row);
  }

  const chronological = [...results].sort(
    (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  const attemptNumberLookup = new Map<string, number>();
  for (const [testName, attempts] of Object.entries(orderedByTest)) {
    attempts.forEach((attempt, idx) => {
      attemptNumberLookup.set(`${testName}::${attempt.submitted_at}`, idx + 1);
    });
  }

  return chronological.map((row) => {
    const key = `${row.test_name}::${row.submitted_at}`;
    const attemptNumber = attemptNumberLookup.get(key) || 1;
    return {
      date: new Date(row.submitted_at).toLocaleString(),
      testName: row.test_name,
      score: row.score,
      percentage: Number(row.percentage) || 0,
      timeTakenLabel: '—',
      attemptNumber,
      submittedAt: row.submitted_at,
    };
  });
}

export function getAttemptLabel(n: number): string {
  if (n === 1) return '1st attempt';
  if (n === 2) return '2nd attempt';
  if (n === 3) return '3rd attempt';
  return `${n}th attempt`;
}
