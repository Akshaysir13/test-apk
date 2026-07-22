import { getSincerityColor, getSincerityLabel } from '../../lib/adminData';

interface SincerityBarProps {
  score: number;
  showLabel?: boolean;
  large?: boolean;
}

export default function SincerityBar({ score, showLabel = true, large = false }: SincerityBarProps) {
  const color = getSincerityColor(score);
  const label = getSincerityLabel(score);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`font-semibold text-gray-800 ${large ? 'text-2xl' : 'text-sm'}`}>
          {score}
        </span>
        {showLabel && (
          <span className={`text-xs ${score >= 70 ? 'text-green-700' : score >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>
            {label}
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${large ? 'h-4' : 'h-2'}`}>
        <div
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
