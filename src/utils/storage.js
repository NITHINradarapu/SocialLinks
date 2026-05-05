const STORAGE_KEY = 'linkhub_links';

/**
 * Load links from localStorage.
 * @returns {Array} Array of link objects
 */
export function loadLinks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    console.warn('Failed to load links from localStorage');
    return [];
  }
}

/**
 * Save links to localStorage.
 * @param {Array} links - Array of link objects
 */
export function saveLinks(links) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    console.warn('Failed to save links to localStorage');
  }
}
