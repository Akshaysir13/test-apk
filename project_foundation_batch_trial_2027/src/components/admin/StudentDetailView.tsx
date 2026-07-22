import { ArrowLeft } from 'lucide-react';
import { Test } from '../../types';
import { TestResultRow } from '../../lib/adminData';
import StudentPerformanceContent from '../StudentPerformanceContent';

interface StudentDetailViewProps {
  email: string;
  courses: string[];
  results: TestResultRow[];
  tests: Test[];
  sessions: { user_email: string; expires_at: string }[];
  devices: { user_email: string; last_active: string }[];
  onBack: () => void;
}

export default function StudentDetailView({
  email,
  courses,
  results,
  tests,
  sessions,
  devices,
  onBack,
}: StudentDetailViewProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Student List
      </button>

      <div className="bg-white rounded-lg shadow border border-purple-200 p-4">
        <h2 className="text-2xl font-bold text-gray-900">{email}</h2>
        <p className="text-sm text-gray-500 mt-1">Admin view — student performance detail</p>
      </div>

      <StudentPerformanceContent
        email={email}
        courses={courses}
        results={results.filter((r) => r.user_email.toLowerCase() === email.toLowerCase())}
        allResults={results}
        tests={tests}
        sessions={sessions}
        devices={devices}
        showCharts={true}
      />
    </div>
  );
}
