'use client';
import { useFormStatus } from 'react-dom';
import { useTransition } from 'react';

// Define the extended props type
type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingText?: string;
  formAction?: (formData: FormData) => Promise<any>;
};

export function SubmitButton({
  children,
  pendingText = "Processing...",
  formAction,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [isPending, startTransition] = useTransition();
  
  const isLoading = pending || isPending;
  
  // Handle the form action if provided
  const handleClick = formAction 
    ? (e: React.MouseEvent<HTMLButtonElement>) => {
        if (formAction && !isLoading) {
          const form = (e.target as HTMLButtonElement).closest('form');
          if (form) {
            startTransition(() => {
              formAction(new FormData(form));
            });
          }
        }
      }
    : undefined;

  return (
    <button
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 ${props.className || ''}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/*"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}*/
