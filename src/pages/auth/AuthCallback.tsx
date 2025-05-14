
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth/client', { replace: true }), 3000);
          return;
        }
        
        if (session) {
          // Check if user is admin or manufacturer
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, user_type')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
          }
          
          if (profile?.is_admin) {
            // Redirect admin users to admin dashboard
            navigate('/admin', { replace: true });
          } else if (profile?.user_type === 'manufacturer') {
            // Redirect manufacturers to manufacturer dashboard
            navigate('/manufacturer/dashboard', { replace: true });
          } else {
            // Redirect normal users to user dashboard
            navigate('/dashboard', { replace: true });
          }
        } else {
          setError('No session found. Please try logging in again.');
          setTimeout(() => navigate('/auth/client', { replace: true }), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/auth/client', { replace: true }), 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-fit mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-gray-500">Redirecting you back to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-blue" />
        <h2 className="text-xl font-medium">Completing authentication...</h2>
        <p className="text-gray-500 mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
