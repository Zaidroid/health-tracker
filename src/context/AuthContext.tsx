// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (token: string) => Promise<void>; // Google Sign-In
  signInWithEmail: (email: string, password: string) => Promise<void>; // Email/Password Sign-In
  signUp: (email: string, password: string) => Promise<void>; // Email/Password Sign-Up
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the provided Supabase URL and Anon Key
const supabaseUrl = 'https://aojcvcnlnkrhkwulbpkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamN2Y25sbmtyaGt3dWxicGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDUwNTAsImV4cCI6MjA1NTkyMTA1MH0.07q_q4TT1ub-4p9iqjfy8vAKbuMt0AUZEOeXU6qvd7s';

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
          isGuest: false,
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
          isGuest: false,
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

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // You can add initial user metadata here, like trainingStartDate
          training_start_date: new Date().toISOString(), // Example: Set initial training start date
        }
      }
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
    <AuthContext.Provider value={{ user, signIn, signInWithEmail, signUp, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Corrected: Now exporting useAuth ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
