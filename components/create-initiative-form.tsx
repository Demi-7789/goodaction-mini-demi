'use client';
import { useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from './textarea'; // Assuming this is correctly imported
import { createInitiative } from '@/app/actions';
import { format, addDays } from 'date-fns'; // Import addDays

export default function CreateInitiativeForm({
  programId,
  onSuccess
}: {
  programId: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(createInitiative, null);

  // --- Corrected useState initializer ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'volunteer',
    goal: '',
    start_date: format(new Date(), 'yyyy-MM-dd'), // Default to today
    // Calculate the date 7 days from now, THEN format it
    end_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  });
  // --- End of correction ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden program_id field */}
      <input type="hidden" name="program_id" value={programId} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-white">
          Type <span className="text-destructive">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        >
          <option value="volunteer">Volunteer</option>
          <option value="fundraise">Fundraise</option>
        </select>
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-white">
          Goal ({formData.type === 'volunteer' ? 'people' : 'dollars'}) <span className="text-destructive">*</span>
        </label>
        <Input
          id="goal"
          name="goal"
          type="number"
          min="1"
          value={formData.goal}
          onChange={handleChange}
          placeholder={formData.type === 'volunteer' ? 'Number of volunteers needed' : 'Amount to raise in dollars'}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-white">
            Start Date <span className="text-destructive">*</span>
          </label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            min={format(new Date(), 'yyyy-MM-dd')} // Keep minimum as today's formatted date
            required
          />
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-white">
            End Date <span className="text-destructive">*</span>
          </label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            min={formData.start_date} // Ensure end date is not before start date
            required
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? 'Creating...' : 'Create Initiative'}
      </Button>
    </form>
  );
}