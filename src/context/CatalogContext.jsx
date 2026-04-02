import React, { createContext, useContext, useState, useEffect } from 'react';

const CatalogContext = createContext();

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider = ({ children }) => {
  const [apps, setApps] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch initial data from backend
  useEffect(() => {
    fetch('http://localhost:8080/api/apps')
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.error("Failed to load apps from backend", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addApp = async (newApp) => {
    try {
      const res = await fetch('http://localhost:8080/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      if (res.ok) {
        const added = await res.json();
        setApps(prev => [...prev, added]);
      }
    } catch (error) {
      console.error("Failed to add app", error);
    }
  };

  const updateApp = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setApps(prev => prev.map(app => app.id === id ? updated : app));
      }
    } catch (error) {
      console.error("Failed to update app", error);
    }
  };

  const deleteApp = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/apps/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setApps(prev => prev.filter(app => app.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete app", error);
    }
  };

  const trackUsage = async (id) => {
    const target = apps.find(app => app.id === id);
    if (!target) return;
    
    // Optimistic update
    setApps(prev => prev.map(app => app.id === id ? { ...app, usageCount: (app.usageCount || 0) + 1 } : app));
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(viewId => viewId !== id);
      return [id, ...filtered].slice(0, 5);
    });

    try {
      await fetch(`http://localhost:8080/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usageCount: (target.usageCount || 0) + 1 })
      });
    } catch (error) {
      console.error("Failed to sync usage tracking", error);
    }
  };

  const value = {
    apps,
    addApp,
    updateApp,
    deleteApp,
    trackUsage,
    recentlyViewed
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
};
