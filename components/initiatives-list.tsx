// components/initiatives-list.tsx
import Link from 'next/link';
import { Initiative } from '@/types';
import { format } from 'date-fns';

export default function InitiativesList({ initiatives }: { initiatives: Initiative[] }) {
  if (initiatives.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400">No initiatives created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initiatives.map((initiative) => (
        <Link 
          key={initiative.id} 
          href={`/dashboard/initiative-details/${initiative.id}`}
          className="block border rounded-lg p-4 hover:bg-gray-700 transition-colors"
          style={{ borderColor: 'rgb(55 65 81)'}} // Adjust border color to match dark mode feel
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{initiative.title}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-400">Type:</span>
                  <span className="capitalize text-gray-300">{initiative.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-400">Goal:</span>
                  <span className="text-gray-300">
                    {initiative.type === 'volunteer'
                      ? `${initiative.goal} volunteers`
                      : `$${initiative.goal} to raise`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-400">Dates:</span>
                  <span className="text-gray-300">
                    {format(new Date(initiative.start_date), 'MMM d')} - {format(new Date(initiative.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              initiative.status === 'active' ? 'bg-green-100 text-green-800' :
              initiative.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {initiative.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}




           