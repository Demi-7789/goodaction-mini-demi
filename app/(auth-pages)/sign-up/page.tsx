'use client';
import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Wrap the component that uses useSearchParams
function SignUpForm() {
  const [userType, setUserType] = useState('nonprofit');
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'corporate') {
      setUserType('nonprofit');
      alert("Corporate accounts are not available at this time. Please sign up as a nonprofit.");
    } else {
      setUserType(e.target.value);
    }
  };

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      
      {message && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      {/* Rest of your form fields */}
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {/* User Type Selection */}
        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="nonprofit"
                name="user_type"
                value="nonprofit"
                checked={userType === 'nonprofit'}
                onChange={handleUserTypeChange}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="nonprofit">Nonprofit</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="corporate"
                name="user_type"
                value="corporate"
                checked={userType === 'corporate'}
                onChange={handleUserTypeChange}
                className="h-4 w-4 text-primary"
                disabled
              />
              <Label htmlFor="corporate">Corporate (Unavailable)</Label>
            </div>
          </div>
        </div>

        {/* Organization Name */}
        <Label htmlFor="name">Organization Name</Label>
        <Input
          name="name"
          placeholder="Your organization name"
          required
        />

        {/* Email */}
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        {/* Password */}
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />

        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>
      </div>
    </form>
  );
}

// Main page component with Suspense
export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}