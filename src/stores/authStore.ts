
import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  is_admin: boolean;
  user_type?: 'manufacturer' | 'client';
  full_name?: string;
  email: string;
  phone?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
  gstin?: string;
  verification_status?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearAuth: () => set({ user: null, profile: null, isLoading: false }),
}));
