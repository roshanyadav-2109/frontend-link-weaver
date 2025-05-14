
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type Profile = {
  is_admin: boolean;
  user_type?: 'manufacturer' | 'client';
  gstin?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManufacturer: boolean;
  isClient: boolean;
  loading: boolean;
  resendConfirmationEmail: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch the user profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('is_admin, user_type, gstin')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          } else {
            setProfile(profileData as Profile);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Fetch the user profile data
        supabase
          .from('profiles')
          .select('is_admin, user_type, gstin')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            } else {
              setProfile(profileData as Profile);
            }
            setLoading(false);
          });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        if (error.message === "Email not confirmed") {
          toast.error("Please check your email to confirm your account before signing in.", {
            description: "Need a new confirmation email? Use the resend option below.",
            action: {
              label: "Resend",
              onClick: () => resendConfirmationEmail(email)
            },
            duration: 8000,
          });
          return false;
        }
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        toast.success('Welcome back!', {
          description: "You've successfully signed in.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred during Google sign-in');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    navigate('/');
    toast('You have been logged out', {
      description: 'Successfully signed out of your account'
    });
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Confirmation email has been sent. Please check your inbox.', {
          description: "Didn't receive it? Check your spam folder or try again in a few minutes."
        });
      }
    } catch (error) {
      toast.error('An error occurred while sending the confirmation email.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        signIn,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
        isAdmin: profile?.is_admin || false,
        isManufacturer: profile?.user_type === 'manufacturer',
        isClient: profile?.user_type === 'client',
        loading,
        resendConfirmationEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
