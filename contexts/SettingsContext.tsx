import { createContext } from 'react';

export interface SettingsContextType {
  settings: { autoSaveEnabled: boolean };
  setSettings: (settings: { autoSaveEnabled: boolean }) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);
