import { doc, getDoc, setDoc } from "firebase/firestore";
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
    // We use setDoc with { merge: true } so it creates the document if it doesn't exist,
    // and only updates the "profile" field without overwriting other data like subcollections.
    await setDoc(getProfileRef(uid), { profile: profileData }, { merge: true });
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};
