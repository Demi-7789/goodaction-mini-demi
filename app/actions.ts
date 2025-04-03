"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function createProgram(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'You must be logged in to create a program' };
  }

  // Create program
  const { error } = await supabase.from('programs').insert({
    nonprofit_id: user.id,
    title: formData.get('title'),
    description: formData.get('description'),
    sdg_goal: formData.get('sdg_goal'),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/programs');
  redirect('/dashboard/programs');
}

export async function createInitiative(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to create an initiative' };
  }

  // Validate form data
  const program_id = formData.get('program_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const goal = formData.get('goal') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;

  if (!program_id || !title || !description || !type || !goal || !start_date || !end_date) {
    return { error: 'All fields are required' };
  }

  // Validate dates
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const today = new Date();
  
  if (startDate > endDate) {
    return { error: 'End date must be after start date' };
  }

  // Determine status based on dates
  let status = 'planned';
  if (today >= startDate && today <= endDate) {
    status = 'active';
  } else if (today > endDate) {
    status = 'completed';
  }

  try {
    // Create initiative
    const { error } = await supabase.from('initiatives').insert({
      program_id,
      title,
      description,
      type,
      goal: type === 'volunteer' ? parseInt(goal) : parseFloat(goal),
      start_date: start_date,
      end_date: end_date,
      status,
      created_by: user.id,
    });

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    revalidatePath(`/dashboard/programs/${program_id}`);
    redirect(`/dashboard/programs/${program_id}`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}