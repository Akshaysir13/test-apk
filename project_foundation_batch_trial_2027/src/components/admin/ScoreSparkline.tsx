import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface ScoreSparklineProps {
  scores: number[];
  trend: 'up' | 'down' | 'flat';
}

export default function ScoreSparkline({ scores, trend }: ScoreSparklineProps) {
  if (scores.length < 2) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  const width = 64;
  const height = 24;
  const padding = 2;
  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 100);
  const range = max - min || 1;

  const points = scores
    .map((score, i) => {
      const x = padding + (i / (scores.length - 1)) * (width - padding * 2);
      const y = height - padding - ((score - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const trendColor =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#ca8a04'}
          strokeWidth="2"
          points={points}
        />
        {scores.map((score, i) => {
          const x = padding + (i / (scores.length - 1)) * (width - padding * 2);
          const y = height - padding - ((score - min) / range) * (height - padding * 2);
          return <circle key={i} cx={x} cy={y} r="2" fill="#7c3aed" />;
        })}
      </svg>
      {trend === 'up' && <TrendingUp className={`w-4 h-4 ${trendColor}`} />}
      {trend === 'down' && <TrendingDown className={`w-4 h-4 ${trendColor}`} />}
      {trend === 'flat' && <Minus className={`w-4 h-4 ${trendColor}`} />}
    </div>
  );
}
