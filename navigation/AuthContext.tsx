import React, { createContext, useState, useEffect } from 'react';
type User = {
  id: string;
  role: string; // 'Coach' or 'Skater'
  coachId?: string;
  skaterId?: string;
};
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;   
  login: (user: User, token: string) => void;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Later you can load saved user token here from AsyncStorage...
  const login = (userInfo: User, token: string) => {
    setIsAuthenticated(true);
    setUser(userInfo); // Optionally: save token and user in AsyncStorage here
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Optionally: remove stored auth info from AsyncStorage
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
       {children} {' '}
    </AuthContext.Provider>
  );
};
