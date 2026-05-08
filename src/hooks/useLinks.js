import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  getLinksFromFirestore, 
  addLinkToFirestore, 
  updateLinkInFirestore, 
  deleteLinkFromFirestore, 
  updateLinksOrderInFirestore 
} from '../services/linkService';

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const { user } = useAuth();

  // Fetch links from Firestore on mount or when user changes
  useEffect(() => {
    async function fetchLinks() {
      if (!user) {
        setLinks([]);
        setLoadingLinks(false);
        return;
      }
      try {
        setLoadingLinks(true);
        const data = await getLinksFromFirestore(user.uid);
        setLinks(data);
      } catch (error) {
        console.error("Failed to load links:", error);
      } finally {
        setLoadingLinks(false);
      }
    }
    fetchLinks();
  }, [user]);

  const addLink = useCallback(async (platform, url, category) => {
    if (!user) return;
    const newLink = {
      platform: platform.trim(),
      url: url.trim(),
      category: category || 'Other',
      createdAt: Date.now(),
      order: links.length // Append to end
    };

    try {
      // Add to Firestore first to get the real ID
      const docId = await addLinkToFirestore(user.uid, newLink);
      // Update local state with the Firestore ID
      setLinks((prev) => [...prev, { id: docId, ...newLink }]);
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  }, [user, links.length]);

  const updateLink = useCallback(async (id, platform, url, category) => {
    if (!user) return;
    const updatedData = {
      platform: platform.trim(),
      url: url.trim(),
      category: category || 'Other'
    };

    // Optimistic UI update
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updatedData } : link))
    );

    try {
      await updateLinkInFirestore(user.uid, id, updatedData);
    } catch (error) {
      console.error("Failed to update link:", error);
      // Ideally, revert local state here if it fails
    }
  }, [user]);

  const reorderLinks = useCallback(async (fromIndex, toIndex) => {
    if (!user) return;
    
    // Optimistic UI update
    setLinks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      
      // Fire-and-forget the batch update to Firestore
      updateLinksOrderInFirestore(user.uid, result).catch(err => {
        console.error("Failed to reorder in Firestore:", err);
      });

      return result;
    });
  }, [user]);

  const deleteLink = useCallback(async (id) => {
    if (!user) return;

    // Optimistic UI update
    setLinks((prev) => prev.filter((link) => link.id !== id));

    try {
      await deleteLinkFromFirestore(user.uid, id);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  }, [user]);

  return { links, loadingLinks, addLink, updateLink, deleteLink, reorderLinks };
}
