import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getProfileFromFirestore, updateProfileInFirestore } from '../services/profileService';

const DEFAULT_PROFILE = { 
  name: 'My Profile', 
  bio: 'Welcome to my LinkHub!', 
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix' 
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(DEFAULT_PROFILE);
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        const data = await getProfileFromFirestore(user.uid);
        if (data) {
          setProfile(data);
        } else {
          setProfile(DEFAULT_PROFILE);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    
    // Optimistic UI update
    setProfile((prev) => ({ ...prev, ...updates }));

    try {
      const updatedProfile = { ...profile, ...updates };
      await updateProfileInFirestore(user.uid, updatedProfile);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }, [user, profile]);

  return { profile, loadingProfile, updateProfile };
}
