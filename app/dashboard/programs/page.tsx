import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function ProgramsPage() {
  const supabase = await createClient();
  
  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if user is authenticated and has non-profit role
  let isNonProfit = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
    isNonProfit = profile?.user_type === 'nonprofit'; // Adjust based on your role system
  }

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Programs</h1>
        {isNonProfit && (
            <>
          <Link
            href="/dashboard/programs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Program
          </Link>
          </>
        )}
      </div>

      {programs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't created any programs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {programs?.map((program) => (
            <div key={program.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold">{program.title}</h2>
              <p className="text-gray-600 mt-2">{program.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {program.sdg_goal}
                </span>
                <Link
                  href={`/dashboard/programs/${program.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}