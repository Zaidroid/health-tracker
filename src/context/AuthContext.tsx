import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsGuest: () => void; // Add signInAsGuest
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button in the top right.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name,
          googleToken: session.provider_token!,
          trainingStartDate: new Date(session.user.user_metadata.training_start_date),
          isGuest: false, // Ensure isGuest is set for authenticated users
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name,
          googleToken: session.provider_token!,
          trainingStartDate: new Date(session.user.user_metadata.training_start_date),
          isGuest: false, // Ensure isGuest is set for authenticated users
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (token: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
        },
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const signInAsGuest = () => {
    setUser({
      id: 'guest-id',
      name: 'Guest User',
      email: 'guest@example.com',
      googleToken: '', // No token for guests
      trainingStartDate: new Date(),
      isGuest: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
