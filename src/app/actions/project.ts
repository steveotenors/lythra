'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().optional(),
});

export async function createProject(formData: FormData) {
  try {
    // Validate input
    const validated = projectSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
    });
    
    // Create database client
    const supabase = createClient();
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Insert data
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...validated,
        user_id: session.user.id
      })
      .select()
      .single();
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Revalidate the projects list
    revalidatePath('/projects');
    
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || 'Invalid form data' 
      };
    }
    return { success: false, error: 'Failed to create project' };
  }
}