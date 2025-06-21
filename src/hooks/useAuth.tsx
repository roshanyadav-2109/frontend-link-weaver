
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  company_name?: string;
  user_type?: string;
  is_admin?: boolean;
  verification_status?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.warn('Error in refreshProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle profile loading asynchronously
        if (session?.user) {
          setTimeout(() => {
            refreshProfile();
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          refreshProfile();
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Successfully signed in!');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account');
      } else if (data.user) {
        toast.success('Account created successfully!');
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Error signing out');
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        toast.success('Successfully signed out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = profile?.is_admin ?? false;

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
