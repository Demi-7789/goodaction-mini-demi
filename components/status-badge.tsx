'use client';

import { cn } from '@/lib/utils';

export default function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    planned: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}