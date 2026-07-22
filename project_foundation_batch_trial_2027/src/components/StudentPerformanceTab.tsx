import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTest } from '../contexts/TestContext';
import { supabase } from '../lib/supabase';
import { TestResultRow } from '../lib/adminData';
import StudentPerformanceContent from './StudentPerformanceContent';

export default function StudentPerformanceTab() {
  const { currentUser } = useAuth();
  const { tests } = useTest();
  const [myResults, setMyResults] = useState<TestResultRow[]>([]);
  const [allResults, setAllResults] = useState<TestResultRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchPerformanceData() {
      setLoading(true);
      try {
        const email = currentUser!.email.toLowerCase();
        const [myRes, allRes] = await Promise.all([
          supabase
            .from('test_results')
            .select('*')
            .eq('user_email', email)
            .order('submitted_at', { ascending: false }),
          supabase
            .from('test_results')
            .select('user_email, test_name, score, total_questions, percentage, submitted_at')
            .order('submitted_at', { ascending: false }),
        ]);

        if (!myRes.error && myRes.data) setMyResults(myRes.data as TestResultRow[]);
        if (!allRes.error && allRes.data) setAllResults(allRes.data as TestResultRow[]);
      } catch (err) {
        console.error('Failed to load performance data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformanceData();
  }, [currentUser]);

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <StudentPerformanceContent
      email={currentUser.email}
      courses={currentUser.courses ?? []}
      results={myResults}
      allResults={allResults}
      tests={tests}
      showCharts={true}
    />
  );
}
