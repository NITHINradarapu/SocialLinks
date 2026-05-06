import { useState, useEffect, useCallback } from 'react';
import { loadProfile, saveProfile } from '../utils/storage';

export function useProfile() {
  const [profile, setProfile] = useState(() => loadProfile());

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return { profile, updateProfile };
}
