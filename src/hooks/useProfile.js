import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
  const [profileError, setProfileError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(DEFAULT_PROFILE);
        setLoadingProfile(false);
        setProfileError(null);
        return;
      }
      try {
        setLoadingProfile(true);
        setProfileError(null);
        const data = await getProfileFromFirestore(user.uid);
        if (data) {
          setProfile(data);
        } else {
          setProfile(DEFAULT_PROFILE);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfileError(error);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;

    // Snapshot the current profile before any mutation to avoid stale closure
    // and to have a reliable rollback target on failure.
    const previousProfile = profile;
    const updatedProfile = { ...previousProfile, ...updates };

    // Optimistic UI update
    setProfile(updatedProfile);

    try {
      await updateProfileInFirestore(user.uid, updatedProfile);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Rollback to previous state on failure
      setProfile(previousProfile);
      toast.error('Failed to save profile. Please try again.');
      throw error;
    }
  }, [user, profile]);

  return { profile, loadingProfile, profileError, updateProfile };
}

