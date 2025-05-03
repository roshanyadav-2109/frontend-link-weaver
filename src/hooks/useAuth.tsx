
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Auth context type
interface AuthContextType {
  user: any | null; // Replace with your user type
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;
  const isAdmin = !!user?.app_metadata?.isAdmin;

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut, 
      loading,
      isAuthenticated,
      isAdmin,
      signInWithGoogle 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
