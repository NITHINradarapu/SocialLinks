import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
  const [linksError, setLinksError] = useState(null);
  const { user } = useAuth();

  // Fetch links from Firestore on mount or when user changes
  useEffect(() => {
    async function fetchLinks() {
      if (!user) {
        setLinks([]);
        setLoadingLinks(false);
        setLinksError(null);
        return;
      }
      try {
        setLoadingLinks(true);
        setLinksError(null);
        const data = await getLinksFromFirestore(user.uid);
        setLinks(data);
      } catch (error) {
        console.error("Failed to load links:", error);
        setLinksError(error);
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
      order: links.length > 0 ? Math.max(...links.map(l => l.order ?? 0)) + 1 : 0
    };

    try {
      // Add to Firestore first to get the real ID
      const docId = await addLinkToFirestore(user.uid, newLink);
      // Update local state with the Firestore ID
      setLinks((prev) => [...prev, { id: docId, ...newLink }]);
      return docId;
    } catch (error) {
      console.error("Failed to add link:", error);
      toast.error('Failed to add link. Please try again.');
      throw error;
    }
  }, [user, links]);

  const updateLink = useCallback(async (id, platform, url, category) => {
    if (!user) return;
    const updatedData = {
      platform: platform.trim(),
      url: url.trim(),
      category: category || 'Other'
    };

    // Snapshot current state for rollback on failure
    const previousLinks = links;

    // Optimistic UI update
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updatedData } : link))
    );

    try {
      await updateLinkInFirestore(user.uid, id, updatedData);
    } catch (error) {
      console.error("Failed to update link:", error);
      // Rollback to previous state
      setLinks(previousLinks);
      toast.error('Failed to update link. Please try again.');
      throw error;
    }
  }, [user, links]);

  const reorderLinks = useCallback(async (fromIndex, toIndex) => {
    if (!user) return;
    
    const previousLinks = links;
    
    const reordered = Array.from(links);
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);
    
    const updatedLinks = reordered.map((link, idx) => ({
      ...link,
      order: idx
    }));
    
    setLinks(updatedLinks);
    
    try {
      await updateLinksOrderInFirestore(user.uid, updatedLinks);
    } catch (err) {
      console.error("Failed to reorder links in Firestore:", err);
      setLinks(previousLinks);
      toast.error("Failed to update links order. Please try again.");
    }
  }, [user, links]);

  const deleteLink = useCallback(async (id) => {
    if (!user) return;

    // Snapshot current state for rollback on failure
    const previousLinks = links;

    // Optimistic UI update
    setLinks((prev) => prev.filter((link) => link.id !== id));

    try {
      await deleteLinkFromFirestore(user.uid, id);
    } catch (error) {
      console.error("Failed to delete link:", error);
      // Rollback to previous state
      setLinks(previousLinks);
      toast.error('Failed to delete link. Please try again.');
      throw error;
    }
  }, [user, links]);

  return { links, loadingLinks, linksError, addLink, updateLink, deleteLink, reorderLinks };
}
