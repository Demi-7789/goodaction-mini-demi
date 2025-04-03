// app/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Platform</h1>
      {user ? (
        <Link 
          href="/dashboard/programs" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link 
            href="/sign-in" 
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-gray-700"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-700"
          >
            Sign Up
          </Link>
          <Link 
            href="/dashboard/programs" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-700"
          >
            See Programs
          </Link>
        </div>
      )}
    </div>
  );
}