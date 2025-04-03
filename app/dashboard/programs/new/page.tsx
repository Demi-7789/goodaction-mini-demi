'use client';
import { createProgram } from '@/app/actions';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/textarea';

const SDG_GOALS = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequality",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals"
];

export default function CreateProgramPage() {
  const [state, formAction] = useActionState(createProgram, null);
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Program</h1>
      <form action={formAction} className="space-y-4">
        <div>
        <Label htmlFor="title">
        Program Title <span className="text-destructive">*</span>
      </Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter program title"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your program"
            required
            rows={5}
          />
        </div>
        <div>
          <Label htmlFor="sdg_goal">SDG Goal <span className="text-destructive">*</span></Label>
          <select
            id="sdg_goal"
            name="sdg_goal"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select an SDG goal </option>
            {SDG_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton className="w-full">Create Program</SubmitButton>
        {state?.error && (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        )}
      </form>
    </div>
  );
}