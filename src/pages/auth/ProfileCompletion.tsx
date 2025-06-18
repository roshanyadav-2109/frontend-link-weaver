
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientProfileForm from '@/components/auth/ClientProfileForm';
import ManufacturerProfileForm from '@/components/auth/ManufacturerProfileForm';
import { supabase } from '@/integrations/supabase/client';

const ProfileCompletion = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/initial');
      return;
    }

    if (user) {
      checkProfileCompletion();
    }
  }, [user, loading, navigate]);

  const checkProfileCompletion = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, user_type')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking profile:', error);
        setCheckingProfile(false);
        return;
      }

      // If profile has full_name and user_type, consider it complete
      if (profile?.full_name && profile?.user_type) {
        setIsProfileComplete(true);
        // Redirect to appropriate dashboard
        if (profile.user_type === 'manufacturer') {
          navigate('/manufacturer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    } finally {
      setCheckingProfile(false);
    }
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isProfileComplete) {
    return null; // Will be redirected
  }

  if (!userType || (userType !== 'client' && userType !== 'manufacturer')) {
    navigate('/auth/initial');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      {userType === 'client' ? <ClientProfileForm /> : <ManufacturerProfileForm />}
    </div>
  );
};

export default ProfileCompletion;
