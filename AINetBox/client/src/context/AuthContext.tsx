
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  userName: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userId: null,
    userName: null
  });

  useEffect(() => {
    // Check for Replit auth
    const userId = document.querySelector('meta[name="replit-user-id"]')?.getAttribute('content');
    const userName = document.querySelector('meta[name="replit-user-name"]')?.getAttribute('content');
    
    setAuth({
      isAuthenticated: !!userId,
      userId,
      userName
    });
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
