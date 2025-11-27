import { createContext, useContext, useState, type ReactNode } from "react";
import { UserRole, type Alumni, type Student, type College } from "../types";
import { mockAlumni, mockStudents, mockCollege } from "../data/mockData";

type User = Alumni | Student | College;

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, _email?: string) => {
    // In a real app, we would verify credentials.
    // Here we just pick a mock user based on role to simulate login.
    let loggedInUser: User | undefined;

    switch (role) {
      case UserRole.Alumni:
        loggedInUser = mockAlumni[0];
        break;
      case UserRole.Student:
        loggedInUser = mockStudents[0];
        break;
      case UserRole.College:
        loggedInUser = mockCollege;
        break;
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      console.log(`Logged in as ${role}:`, loggedInUser.name);
    }
  };

  const logout = () => {
    setUser(null);
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
