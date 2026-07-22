import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ReactNode } from 'react';
import { Test } from '../../types';
import { TestResultRow } from '../../lib/adminData';

interface StudentPerformanceChartsProps {
  email: string;
  results: TestResultRow[];
  tests: Test[];
  courses: string[];
}

const SECTION_LABELS: Record<string, string> = {
  aptitude: 'Aptitude',
  math: 'Maths',
  drawing: 'Drawing',
};

function getCourseColor(course: string): string {
  const colors: Record<string, string> = {
    foundation: '#7c3aed',
    rank_booster: '#2563eb',
    advance_2026: '#059669',
    nata_2026: '#d97706',
    dheya: '#dc2626',
  };
  return colors[course] || '#6b7280';
}

function matchTestByName(testName: string, tests: Test[]): Test | undefined {
  return tests.find((t) => t.name === testName);
}

export default function StudentPerformanceCharts({
  results,
  tests,
  courses,
}: StudentPerformanceChartsProps) {
  const sorted = [...results].sort(
    (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
  );

  const percentages = sorted.map((r) => Number(r.percentage) || 0);
  const bestScore = percentages.length ? Math.max(...percentages) : 0;
  const averageScore = percentages.length
    ? percentages.reduce((a, b) => a + b, 0) / percentages.length
    : 0;

  const firstThree =
    percentages.length >= 3
      ? percentages.slice(0, 3).reduce((a, b) => a + b, 0) / 3
      : percentages[0] ?? 0;
  const lastThree =
    percentages.length >= 3
      ? percentages.slice(-3).reduce((a, b) => a + b, 0) / 3
      : percentages[percentages.length - 1] ?? 0;
  const improvementRate = lastThree - firstThree;

  const accuracyPct = averageScore;

  const scoreTrendData = sorted.map((row, index) => {
    const test = matchTestByName(row.test_name, tests);
    return {
      attempt: index + 1,
      date: new Date(row.submitted_at).toLocaleDateString(),
      percentage: Number(row.percentage) || 0,
      testName: row.test_name,
      course: test?.course || 'unknown',
    };
  });

  const courseLines = Array.from(new Set(scoreTrendData.map((d) => d.course)));

  const scatterData = sorted.map((row, index) => ({
    attempt: index + 1,
    accuracy: Number(row.percentage) || 0,
    testName: row.test_name,
  }));

  const heatmapMap = sorted.reduce<Record<string, number>>((acc, row) => {
    const day = new Date(row.submitted_at).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const heatmapData = Object.entries(heatmapMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const maxHeat = Math.max(...heatmapData.map((d) => d.count), 1);

  // Section-wise proxy: test_results has no per-section scores.
  // We show avg overall % for tests that include each section type in the student's courses.
  const sectionBuckets: Record<string, { total: number; count: number }> = {};
  for (const row of sorted) {
    const test = matchTestByName(row.test_name, tests);
    if (!test?.sections?.length) continue;
    const pct = Number(row.percentage) || 0;
    for (const section of test.sections) {
      const key = section.type;
      if (!sectionBuckets[key]) sectionBuckets[key] = { total: 0, count: 0 };
      sectionBuckets[key].total += pct;
      sectionBuckets[key].count += 1;
    }
  }

  const sectionChartData = Object.entries(sectionBuckets).map(([type, data]) => ({
    section: SECTION_LABELS[type] || type,
    avgPercentage: data.count ? Number((data.total / data.count).toFixed(1)) : 0,
  }));

  const hasNata = courses.includes('nata_2026');
  const sectionNote = hasNata
    ? 'Note: test_results does not store Part A / B1 / B2 scores separately. Bars show average overall test % for attempts on tests containing each section type (proxy metric).'
    : 'Note: test_results does not store section-wise scores. Bars show average overall test % for attempts on tests containing each section type (proxy metric).';

  if (!results.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No attempt data available for charts.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Best Score" value={`${bestScore.toFixed(1)}%`} />
        <MetricCard label="Average Score" value={`${averageScore.toFixed(1)}%`} />
        <MetricCard label="Total Attempts" value={String(results.length)} />
        <MetricCard label="Accuracy %" value={`${accuracyPct.toFixed(1)}%`} />
        <MetricCard
          label="Improvement"
          value={`${improvementRate >= 0 ? '+' : ''}${improvementRate.toFixed(1)}%`}
          sub="First 3 vs last 3"
        />
      </div>

      <ChartCard title="Score Trend">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={scoreTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attempt" label={{ value: 'Attempt #', position: 'insideBottom', offset: -5 }} />
            <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, 'Score']}
              labelFormatter={(label) => `Attempt ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="percentage" name="Overall %" stroke="#7c3aed" strokeWidth={2} dot />
            {courseLines.length > 1 &&
              courseLines.map((course) => (
                <Line
                  key={course}
                  type="monotone"
                  dataKey="percentage"
                  name={course}
                  stroke={getCourseColor(course)}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  hide
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Section-wise Performance (proxy)">
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">
          {sectionNote}
        </p>
        {sectionChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0)}%`, 'Avg overall %']} />
              <Bar dataKey="avgPercentage" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500">No section metadata found for attempted tests.</p>
        )}
      </ChartCard>

      <ChartCard title="Accuracy vs Attempts">
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="attempt" name="Attempt" domain={['dataMin', 'dataMax']} />
            <YAxis type="number" dataKey="accuracy" name="Accuracy %" domain={[0, 100]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill="#7c3aed" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Test Activity Heatmap">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {heatmapData.map(({ date, count }) => {
            const intensity = count / maxHeat;
            return (
              <div
                key={date}
                className="rounded-lg p-3 text-center text-xs border border-gray-200"
                style={{
                  backgroundColor: `rgba(124, 58, 237, ${0.15 + intensity * 0.75})`,
                }}
                title={`${count} test(s) on ${date}`}
              >
                <div className="font-medium text-gray-800">{date.slice(5)}</div>
                <div className="text-gray-600 mt-1">{count} test{count !== 1 ? 's' : ''}</div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-lg shadow border border-purple-100 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-purple-700 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
