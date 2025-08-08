
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useAuthStore } from '@/stores/authStore';

type AuthContextType = {
  user: User | null;
  profile: any | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManufacturer: boolean;
  isClient: boolean;
  loading: boolean;
  resendConfirmationEmail: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, profile, isLoading, setUser, setProfile, setLoading, clearAuth } = useAuthStore();
  
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (!mounted) return;
          
          if (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          } else {
            setProfile(profileData as any);
            
            // Only navigate on SIGNED_IN event
            if (event === 'SIGNED_IN' && !isNavigating) {
              setIsNavigating(true);
              setTimeout(() => {
                handlePostAuthNavigation(profileData);
                setIsNavigating(false);
              }, 100);
            }
          }
        } else {
          clearAuth();
        }
        
        setLoading(false);
      }
    );
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (!mounted) return;
          
          if (!error && profileData) {
            setProfile(profileData as any);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handlePostAuthNavigation = (profileData: any) => {
    const currentPath = location.pathname;
    
    // Don't redirect if on admin login page or already on admin pages
    if (currentPath.includes('/admin')) {
      return;
    }
    
    // Check if profile is complete
    const isProfileComplete = profileData.full_name && profileData.user_type;
    
    if (!isProfileComplete) {
      navigate(`/auth/profile-completion?type=${profileData.user_type || 'client'}`);
      return;
    }

    // Only redirect from auth pages or root
    if (currentPath.includes('/auth/') || currentPath === '/') {
      if (profileData.is_admin) {
        navigate('/admin', { replace: true });
      } else if (profileData.user_type === 'manufacturer') {  
        navigate('/manufacturer/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
    try {
      setLoading(true);
      
      clearAuth();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Error signing out. Please try again.');
        return;
      }
      
      navigate('/', { replace: true });
      
      toast.success('Successfully signed out', {
        description: 'You have been logged out of your account'
      });
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An unexpected error occurred during sign out');
    } finally {
      setLoading(false);
    }
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
        loading: isLoading,
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
