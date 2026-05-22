import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

const getProfileRef = (uid) => doc(db, "users", uid);

export const getProfileFromFirestore = async (uid) => {
  try {
    const docSnap = await getDoc(getProfileRef(uid));
    if (docSnap.exists()) {
      return docSnap.data().profile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile: ", error);
    throw error;
  }
};

export const updateProfileInFirestore = async (uid, profileData) => {
  try {
    await setDoc(getProfileRef(uid), { profile: profileData }, { merge: true });
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};

export const RESERVED_USERNAMES = ['login', 'add', 'p', 'admin', 'dashboard', 'settings', 'profile', 'api', 'help', 'static', 'assets', 'about'];

export const checkUsernameAvailability = async (username) => {
  if (!username || username.length < 3) return false;
  const usernameLower = username.toLowerCase();
  if (RESERVED_USERNAMES.includes(usernameLower)) return false;
  
  const docRef = doc(db, "usernames", usernameLower);
  const docSnap = await getDoc(docRef);
  return !docSnap.exists();
};

export const claimUsername = async (uid, username, oldUsername = null) => {
  const batch = writeBatch(db);
  
  if (!username) {
    // We are clearing the username
    if (oldUsername) {
      const oldUsernameRef = doc(db, "usernames", oldUsername.toLowerCase());
      batch.delete(oldUsernameRef);
    }
    const userRef = doc(db, "users", uid);
    batch.set(userRef, { profile: { username: null } }, { merge: true });
    await batch.commit();
    return;
  }

  const usernameLower = username.toLowerCase();
  
  // 1. Add to usernames collection
  const usernameRef = doc(db, "usernames", usernameLower);
  batch.set(usernameRef, { uid });
  
  // 2. Remove old username if it exists and is different
  if (oldUsername && oldUsername.toLowerCase() !== usernameLower) {
    const oldUsernameRef = doc(db, "usernames", oldUsername.toLowerCase());
    batch.delete(oldUsernameRef);
  }
  
  // 3. Update user profile's username field specifically
  const userRef = doc(db, "users", uid);
  batch.set(userRef, { profile: { username: usernameLower } }, { merge: true });
  
  await batch.commit();
};

export const getUidByUsername = async (username) => {
  if (!username) return null;
  const docRef = doc(db, "usernames", username.toLowerCase());
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().uid;
  }
  return null;
};
