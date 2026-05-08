import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

// Get a reference to the user's links subcollection
const getLinksCollection = (uid) => collection(db, "users", uid, "links");

export const getLinksFromFirestore = async (uid) => {
  try {
    const q = query(getLinksCollection(uid), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching links: ", error);
    throw error;
  }
};

export const addLinkToFirestore = async (uid, link) => {
  try {
    const docRef = await addDoc(getLinksCollection(uid), link);
    return docRef.id;
  } catch (error) {
    console.error("Error adding link: ", error);
    throw error;
  }
};

export const updateLinkInFirestore = async (uid, linkId, updatedData) => {
  try {
    const linkRef = doc(db, "users", uid, "links", linkId);
    await updateDoc(linkRef, updatedData);
  } catch (error) {
    console.error("Error updating link: ", error);
    throw error;
  }
};

export const deleteLinkFromFirestore = async (uid, linkId) => {
  try {
    const linkRef = doc(db, "users", uid, "links", linkId);
    await deleteDoc(linkRef);
  } catch (error) {
    console.error("Error deleting link: ", error);
    throw error;
  }
};

export const updateLinksOrderInFirestore = async (uid, links) => {
  try {
    const batch = writeBatch(db);
    links.forEach((link, index) => {
      const linkRef = doc(db, "users", uid, "links", link.id);
      batch.update(linkRef, { order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error updating links order: ", error);
    throw error;
  }
};
