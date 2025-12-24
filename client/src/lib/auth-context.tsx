import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'agent' | 'admin';
  avatarUrl?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(userId: string) {
    console.log('Fetching user profile for ID:', userId);
    setIsLoading(true);

    try {
      // Query Supabase directly instead of API endpoint
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('User not found in database, creating profile...', error);
        
        // Get auth user data
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Create user profile in database
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.fullName || 'User',
              role: 'user',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Failed to create user profile:', insertError);
            setUser(null);
            return;
          }

          console.log('User profile created successfully:', newUser);
          
          setUser({
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name,
            role: newUser.role,
            avatarUrl: newUser.avatar_url,
            phone: newUser.phone,
          });
        }
      } else {
        console.log('User data received:', userData);
        
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          role: userData.role,
          avatarUrl: userData.avatar_url,
          phone: userData.phone,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) return { error: error.message };

    if (data.user) {
      try {
        // Insert user into database
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'user',
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Failed to create user profile:', insertError);
          return { error: 'Failed to create user profile' };
        }

        console.log('User profile created successfully');
      } catch (err) {
        console.error('Error creating user profile:', err);
        return { error: 'Error creating user profile' };
      }
    }

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}