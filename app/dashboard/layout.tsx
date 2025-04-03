import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
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

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-56 border-r min-h-screen">
        <nav className="p-4 space-y-2">
          {/* Always show Programs link */}
          <Link href="/dashboard/programs" className="block p-2 hover:bg-gray-400 rounded">
            Programs
          </Link>
          
          {/* Only show these to non-profit users */}
          {isNonProfit && (
            <>
              <Link href="/dashboard" className="block p-2 hover:bg-gray-400 rounded">
                Dashboard
              </Link>
              <Link href="/dashboard/programs/new" className="block p-2 hover:bg-gray-400 rounded">
                Create Program
              </Link>
            </>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}