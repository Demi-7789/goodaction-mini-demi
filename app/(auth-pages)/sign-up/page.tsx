"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Signup() {
  const [userType, setUserType] = useState('nonprofit'); // Default to nonprofit
  const searchParams = useSearchParams();
  
  // Create a message object based on the search parameters
  const messageParam = searchParams.get('message');
  let messageObj: Message | null = null;
  
  if (messageParam) {
    // Based on the error, it seems Message might be a string or have a message property
    // but doesn't have a status property as we tried to assign
    messageObj = { message: messageParam } as Message;
  }

  if (messageObj) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={messageObj} />
      </div>
    );
  }

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'corporate') {
      setUserType('nonprofit'); // Force back to nonprofit for now
      alert("Corporate accounts are not available at this time. Please sign up as a nonprofit."); // Inform the user
    } else {
      setUserType(e.target.value);
    }
  };

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
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
                  disabled // Disable corporate option to ensure it's not accidentally selected
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
          {messageObj && <FormMessage message={messageObj} />}
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}