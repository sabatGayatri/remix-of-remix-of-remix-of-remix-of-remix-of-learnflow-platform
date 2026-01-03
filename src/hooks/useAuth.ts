import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'instructor' | 'learner';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data && !error) {
      setProfile(data as UserProfile);
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Verify the user has the correct role
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          return { success: false, error: 'Profile not found' };
        }

        if (profileData.role !== role) {
          await supabase.auth.signOut();
          return { success: false, error: `This account is registered as ${profileData.role}, not ${role}` };
        }
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Failed to create account' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return { 
    user, 
    session,
    profile,
    isLoading, 
    login, 
    signup, 
    logout,
    isAuthenticated: !!session,
    isInstructor: profile?.role === 'instructor',
    isLearner: profile?.role === 'learner',
  };
};
