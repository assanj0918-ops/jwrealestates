import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signUp: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
    signOut: async () => {},
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: async () => ({ error: null }),
    }),
  },
}) as unknown as SupabaseClient;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export async function uploadImage(file: File, bucket: string = 'property-images'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'property-images'): Promise<boolean> {
  const path = url.split('/').pop();
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  return !error;
}
