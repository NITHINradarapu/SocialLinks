import { useState, useEffect, useCallback } from 'react';
import { loadLinks, saveLinks } from '../utils/storage';

/**
 * Custom hook to manage links state with localStorage sync.
 * @returns {{ links, addLink, deleteLink }}
 */
export function useLinks() {
  const [links, setLinks] = useState(() => loadLinks());

  // Sync to localStorage whenever links change
  useEffect(() => {
    saveLinks(links);
  }, [links]);

  const addLink = useCallback((platform, url) => {
    const newLink = {
      id: crypto.randomUUID(),
      platform: platform.trim(),
      url: url.trim(),
      createdAt: Date.now(),
    };
    setLinks((prev) => [newLink, ...prev]);
  }, []);

  const deleteLink = useCallback((id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  return { links, addLink, deleteLink };
}
