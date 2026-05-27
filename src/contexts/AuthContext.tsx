import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  user_role: "doctor" | "pharmacy" | "patient" | "admin" | null;
  avatar_url: string | null;
  // Doctor fields
  medical_license?: string | null;
  npi_number?: string | null;
  dea_number?: string | null;
  specialty?: string | null;
  signature_data?: string | null;
  practice_name?: string | null;
  practice_address?: string | null;
  practice_phone?: string | null;
  // Pharmacy fields
  pharmacy_name?: string | null;
  pharmacy_license?: string | null;
  pharmacy_address?: string | null;
  pharmacy_phone?: string | null;
  pharmacy_hours?: string | null;
  // Patient fields
  date_of_birth?: string | null;
  phone?: string | null;
  address?: string | null;
  medical_conditions?: string[] | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; user: UserProfile | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data as UserProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) return { error };

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{
            id: data.user.id,
            email: data.user.email,
            ...metadata
          }]);

        if (profileError) return { error: profileError };
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error, user: null };

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return { error: null, user };
      }

      return { error: null, user: null };
    } catch (error: any) {
      return { error, user: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: new Error("No user logged in") };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) return { error };

      setUser({ ...user, ...updates });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}