import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TestWiseComparisonRow } from '../lib/adminData';

interface TestWiseComparisonSectionProps {
  rows: TestWiseComparisonRow[];
}

export default function TestWiseComparisonSection({ rows }: TestWiseComparisonSectionProps) {
  if (rows.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test-wise Performance vs Peers</h3>
        <p className="text-gray-500">Complete at least one test to see how you compare with other students.</p>
      </section>
    );
  }

  const chartData = rows.slice(0, 10).map((row) => ({
    name: truncate(row.testName, 22),
    fullName: row.testName,
    you: row.yourBest,
    average: row.classAverage,
    top: row.classTop,
  }));

  return (
    <section className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Test-wise Performance vs Peers</h3>
        <p className="text-sm text-gray-500 mt-1">
          Your best score on each test compared to all other students who attempted it.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-purple-50 text-left">
              <th className="p-3 font-semibold">Test</th>
              <th className="p-3 font-semibold text-center">Your Best</th>
              <th className="p-3 font-semibold text-center">Class Avg</th>
              <th className="p-3 font-semibold text-center">Top Score</th>
              <th className="p-3 font-semibold text-center">Your Rank</th>
              <th className="p-3 font-semibold text-center">Percentile</th>
              <th className="p-3 font-semibold text-center">vs Avg</th>
              <th className="p-3 font-semibold text-center">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.testName} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900 max-w-xs">{row.testName}</td>
                <td className="p-3 text-center font-semibold text-purple-700">
                  {row.yourBest.toFixed(1)}%
                </td>
                <td className="p-3 text-center text-gray-600">{row.classAverage.toFixed(1)}%</td>
                <td className="p-3 text-center text-gray-600">{row.classTop.toFixed(1)}%</td>
                <td className="p-3 text-center">
                  <RankBadge rank={row.yourRank} total={row.totalStudents} />
                </td>
                <td className="p-3 text-center">
                  <PercentileBadge percentile={row.percentile} />
                </td>
                <td className="p-3 text-center">
                  <VsAverageBadge diff={row.vsAverage} />
                </td>
                <td className="p-3 text-center text-gray-500">{row.yourAttempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {chartData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Your Best vs Class Average (top {chartData.length} tests)
          </h4>
          <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 36)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName || ''
                }
              />
              <Legend />
              <Bar dataKey="you" name="Your Best" fill="#7c3aed" radius={[0, 4, 4, 0]} />
              <Bar dataKey="average" name="Class Avg" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              <Bar dataKey="top" name="Top Score" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
        Rank and percentile use each student&apos;s best score per test. Class average is the mean of
        all students&apos; best scores on that test.
      </p>
    </section>
  );
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function RankBadge({ rank, total }: { rank: number; total: number }) {
  const isTop = rank <= 3;
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        isTop ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
      }`}
    >
      #{rank} / {total}
    </span>
  );
}

function PercentileBadge({ percentile }: { percentile: number }) {
  const color =
    percentile >= 75
      ? 'bg-green-100 text-green-800'
      : percentile >= 40
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{percentile}th</span>;
}

function VsAverageBadge({ diff }: { diff: number }) {
  if (diff > 0) {
    return <span className="text-green-600 font-medium">+{diff.toFixed(1)}%</span>;
  }
  if (diff < 0) {
    return <span className="text-red-600 font-medium">{diff.toFixed(1)}%</span>;
  }
  return <span className="text-gray-500">0%</span>;
}
