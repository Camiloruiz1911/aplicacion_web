import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
  photo?: string | null;
  loggedIn: boolean;
};

type UserContextType = {
  user: User;
  setUser: (u: Partial<User>) => Promise<void>;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  theme: 'dark' | 'light';
  ready: boolean;
};

const defaultUser: User = {
  name: 'Invitado',
  email: '',
  photo: null,
  loggedIn: false,
};

const STORAGE_KEY = '@myapp_user';
const THEME_KEY = '@myapp_theme';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(defaultUser);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUserState(JSON.parse(raw));
        const t = await AsyncStorage.getItem(THEME_KEY);
        if (t === 'light' || t === 'dark') setTheme(t);
      } catch (e) {
        console.warn('UserProvider load error', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = async (u: User) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const setUser = async (partial: Partial<User>) => {
    const newUser = { ...user, ...partial };
    setUserState(newUser);
    await persist(newUser);
  };

  const login = async (name: string, email: string) => {
    const newUser = { ...user, name, email, loggedIn: true };
    setUserState(newUser);
    await persist(newUser);
  };

  const logout = async () => {
    const newUser: User = { name: 'Invitado', email: '', photo: null, loggedIn: false };
    setUserState(newUser);
    await persist(newUser);
  };

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, toggleTheme, theme, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
};
