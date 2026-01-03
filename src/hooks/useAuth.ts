import { useState, useEffect } from 'react';

export type UserRole = 'instructor' | 'learner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const STORAGE_KEY = 'learnsolve_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string, role: UserRole): { success: boolean; error?: string } => {
    const usersData = localStorage.getItem('learnsolve_users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    
    const existingUser = users.find(u => u.email === email && u.role === role);
    
    if (!existingUser) {
      return { success: false, error: 'Invalid credentials or role' };
    }
    
    setUser(existingUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
    return { success: true };
  };

  const signup = (name: string, email: string, password: string, role: UserRole): { success: boolean; error?: string } => {
    const usersData = localStorage.getItem('learnsolve_users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role
    };
    
    users.push(newUser);
    localStorage.setItem('learnsolve_users', JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, isLoading, login, signup, logout };
};
