import { createContext } from 'react';
import { User } from '../types';

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | null>(null);
