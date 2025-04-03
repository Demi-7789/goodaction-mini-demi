import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import InitiativesList from '@/components/initiatives-list';
import CreateInitiativeForm from '@/components/create-initiative-form';
import Link from 'next/link';
import InitiativeFormModal from '@/components/initiative-form-modal';

export default async function ProgramDetailsPage({ params }: { params: Promise<{ programId: string }> }) {

  const { programId } = await params;

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
    isNonProfit = profile?.user_type === 'nonprofit';
  }

  // Get program details
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', programId)
    .single();

  if (!program) {
    notFound();
  }

  // Get initiatives for this program
  const { data: initiatives } = await supabase
    .from('initiatives')
    .select('*')
    .eq('program_id', programId)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Link
          href="/dashboard/programs"
          className="inline-block mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Programs
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{program.title}</h1>
            <p className="text-gray-600 mt-2">{program.description}</p>
            <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {program.sdg_goal}
            </span>
          </div>

          {isNonProfit && (
            <>
              <Suspense fallback={<div>Loading...</div>}>
                <InitiativeFormModal programId={programId} />
              </Suspense>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Initiatives</h2>
        <InitiativesList initiatives={initiatives || []} />
      </div>
    </div>
  );
}