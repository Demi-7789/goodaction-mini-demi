// app/dashboard/initiatives/[initiativeId]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import StatusBadge from '@/components/status-badge';
import { ShowMoreText } from '@/components/show-more-text';

export default async function InitiativeDetailsPage({
  params: { initiativeId },
}: {
  params: { initiativeId: string };
}) {
  const supabase = await createClient();
  
  // Get initiative details
  const { data: initiative } = await supabase
    .from('initiatives')
    .select(`
      *,
      program:programs(title, sdg_goal)
    `)
    .eq('id', initiativeId)
    .single();

  if (!initiative) {
    notFound();
  }

  // Get participants/count if needed
  const { count: participantCount } = await supabase
    .from('participants')
    .select('*', { count: 'exact' })
    .eq('initiative_id', initiativeId);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="mb-8">
        <Link
          href={`/dashboard/programs/${initiative.program_id}`}
          className="inline-block mb-4 text-sm text-gray-400 hover:text-gray-300"
        >
          ← Back to Program
        </Link>
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{initiative.title}</h1>
              <StatusBadge status={initiative.status} />
            </div>
            
            <div className="mt-2">
              <ShowMoreText 
                text={initiative.description} 
                className="text-gray-400"
              />
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 bg-blue-900 text-blue-300 text-sm rounded-full">
                {initiative.program.sdg_goal}
              </span>
              <span className="inline-block px-3 py-1 bg-green-900 text-green-300 text-sm rounded-full">
                {initiative.type === 'volunteer' 
                  ? `${participantCount || 0} participants` 
                  : `$${initiative.goal} target`}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Program</h3>
              <p className="text-gray-300">{initiative.program.title}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400">Dates</h3>
              <p className="text-gray-300">
                {format(new Date(initiative.start_date), 'MMM d, yyyy')} - 
                {format(new Date(initiative.end_date), 'MMM d, yyyy')}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400">Goal</h3>
              <p className="text-gray-300">
                {initiative.type === 'volunteer' 
                  ? `${initiative.goal} volunteers needed` 
                  : `Raise $${initiative.goal}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="text-center py-8 text-gray-400">
            {participantCount || 0} participants joined
          </div>
        </div>
      </div>
    </div>
  );
}