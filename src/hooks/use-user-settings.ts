"use client";

import { useState, useEffect, useCallback } from 'react';

type UserSettings = {
  apiKey: string;
  gender: string;
  birthDate: string;
  modelName: string;
};

const defaultSettings: UserSettings = {
  apiKey: '',
  gender: '',
  birthDate: '',
  modelName: 'gemini-2.0-flash',
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('CyberFengShuiMasterSettings');
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      console.error("Failed to parse user settings from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSettings = useCallback((newSettings: Partial<UserSettings>) => {
    try {
      setSettings(currentSettings => {
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem('CyberFengShuiMasterSettings', JSON.stringify(updatedSettings));
        return updatedSettings;
      });
    } catch (error) {
      console.error("Failed to save user settings to localStorage", error);
    }
  }, []);

  return { settings, saveSettings, isLoaded };
}
