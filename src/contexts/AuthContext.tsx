import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  companyName: string;
  role: string;
  licenseType: "quarterly" | "semi-annually" | "annually" | null;
  licenseStartDate: string | null;
  licenseEndDate: string | null;
  status: "active" | "expired" | "trial";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignupData {
  email: string;
  password: string;
  companyName: string;
  licenseType: "quarterly" | "semi-annually" | "annually";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("cannabis_track_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Check if license is expired
      if (parsedUser.licenseEndDate) {
        const endDate = new Date(parsedUser.licenseEndDate);
        const today = new Date();
        if (today > endDate) {
          parsedUser.status = "expired";
        }
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem("cannabis_track_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("cannabis_track_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    // Calculate license end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch (data.licenseType) {
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "semi-annually":
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case "annually":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password,
      companyName: data.companyName,
      role: "vendor",
      licenseType: data.licenseType,
      licenseStartDate: startDate.toISOString(),
      licenseEndDate: endDate.toISOString(),
      status: "active" as const,
    };

    // Store in localStorage (simulating database)
    const users = JSON.parse(localStorage.getItem("cannabis_track_users") || "[]");
    users.push(newUser);
    localStorage.setItem("cannabis_track_users", JSON.stringify(users));

    // Set current user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("cannabis_track_user", JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cannabis_track_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}