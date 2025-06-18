
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
  const location = useLocation();
  
  useEffect(() => {
    let mounted = true;

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch the user profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('is_admin, user_type, gstin, full_name, company_name, phone, address')
            .eq('id', currentSession.user.id)
            .single();
          
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
            
            // Handle post-authentication navigation
            if (event === 'SIGNED_IN' && profileData) {
              setTimeout(() => {
                handlePostAuthNavigation(typedProfile);
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        supabase
          .from('profiles')
          .select('is_admin, user_type, gstin, full_name, company_name, phone, address')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
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
            }
            setLoading(false);
          });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handlePostAuthNavigation = (profileData: Profile) => {
    // Don't redirect if already on auth-related pages
    if (location.pathname.includes('/auth/') || location.pathname.includes('/profile-completion')) {
      return;
    }

    // Check if profile is complete
    const isProfileComplete = profileData.full_name && profileData.user_type;
    
    if (!isProfileComplete) {
      navigate(`/profile-completion?type=${profileData.user_type || 'client'}`);
      return;
    }

    // Redirect based on user type
    if (profileData.is_admin) {
      navigate('/admin');
    } else if (profileData.user_type === 'manufacturer') {
      navigate('/manufacturer/dashboard');
    } else {
      navigate('/dashboard');
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
