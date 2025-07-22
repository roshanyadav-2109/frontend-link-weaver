
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type Profile = {
  is_admin: boolean;
  user_type?: 'manufacturer' | 'client';
  gstin?: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  address?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
            .select('is_admin, user_type, gstin, full_name, company_name, phone, address')
            .eq('id', currentSession.user.id)
            .single();
          
          if (!mounted) return;
          
          if (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          } else {
            const typedProfile: Profile = {
              is_admin: profileData.is_admin || false,
              user_type: profileData.user_type as 'manufacturer' | 'client' | undefined,
              gstin: profileData.gstin || undefined,
              full_name: profileData.full_name || undefined,
              company_name: profileData.company_name || undefined,
              phone: profileData.phone || undefined,
              address: profileData.address || undefined,
            };
            setProfile(typedProfile);
            
            // Only navigate on SIGNED_IN event
            if (event === 'SIGNED_IN' && !isNavigating) {
              setIsNavigating(true);
              setTimeout(() => {
                handlePostAuthNavigation(typedProfile);
                setIsNavigating(false);
              }, 100);
            }
          }
        } else {
          setProfile(null);
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
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('is_admin, user_type, gstin, full_name, company_name, phone, address')
            .eq('id', currentSession.user.id)
            .single();
          
          if (!mounted) return;
          
          if (!error && profileData) {
            const typedProfile: Profile = {
              is_admin: profileData.is_admin || false,
              user_type: profileData.user_type as 'manufacturer' | 'client' | undefined,
              gstin: profileData.gstin || undefined,
              full_name: profileData.full_name || undefined,
              company_name: profileData.company_name || undefined,
              phone: profileData.phone || undefined,
              address: profileData.address || undefined,
            };
            setProfile(typedProfile);
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

  const handlePostAuthNavigation = (profileData: Profile) => {
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
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
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
