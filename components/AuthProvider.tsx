'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: any | null;
  signOut: () => Promise<void>;
  supabase: SupabaseClient | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

let supabase: SupabaseClient | null = null;

function initializeSupabase() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [supabaseInstance, setSupabaseInstance] = useState<SupabaseClient | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = initializeSupabase();
    setSupabaseInstance(supabase);

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (event === 'SIGNED_OUT') {
            router.push('/');
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [router]);

  const signOut = async () => {
    if (supabaseInstance) {
      await supabaseInstance.auth.signOut();
    }
  };

  const value = {
    user,
    signOut,
    supabase: supabaseInstance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

