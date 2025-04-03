import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get programs count
  const { count: programsCount } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true })
    .eq('nonprofit_id', user?.id);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white"> {/* Text white for contrast against black background */}
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Programs" 
          value={programsCount || 0} 
          href="/dashboard/programs"
        />
        <DashboardCard 
          title="Supporters" 
          value="0" 
          href="/dashboard/supporters"
        />
        <DashboardCard 
          title="Impact" 
          value="0" 
          href="/dashboard/impact"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow"> {/* Darker background for card */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400">No recent activity</p> {/* Lighter gray for readability */}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, href }: { title: string; value: string | number; href: string }) {
  return (
    <Link href={href}>
      <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"> {/* Darker background for card */}
        <h3 className="text-lg font-medium text-gray-400">{title}</h3> {/* Lighter gray for readability */}
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
    </Link>
  );
}