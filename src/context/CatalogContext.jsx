import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialApps } from '../utils/mockData';

const CatalogContext = createContext();

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider = ({ children }) => {
  const [apps, setApps] = useState(() => {
    const saved = localStorage.getItem('cloudApps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local apps", e);
        return initialApps;
      }
    }
    return initialApps;
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cloudApps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addApp = (newApp) => {
    setApps(prev => [...prev, { ...newApp, createdAt: new Date().toISOString() }]);
  };

  const updateApp = (id, updatedData) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...updatedData } : app));
  };

  const deleteApp = (id) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const trackUsage = (id) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, usageCount: (app.usageCount || 0) + 1 } : app));
    
    // Add to recently viewed logic
    setRecentlyViewed(prev => {
      const filtered = prev.filter(viewId => viewId !== id);
      return [id, ...filtered].slice(0, 5); // keep last 5
    });
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
