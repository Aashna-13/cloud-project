import React, { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Lightbulb, ArrowRight, AppWindow } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const RecommendationEngine = () => {
  const { apps, recentlyViewed } = useCatalog();

  const recommendations = useMemo(() => {
    if (recentlyViewed.length === 0) {
      // Default recommendation: Most popular apps
      return [...apps].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 3);
    }

    // Map viewed IDs to full app objects
    const viewedApps = recentlyViewed.map(id => apps.find(a => a.id === id)).filter(Boolean);
    
    // Find dominant categories in recently viewed
    const categoryCounts = {};
    viewedApps.forEach(app => {
      categoryCounts[app.category] = (categoryCounts[app.category] || 0) + 1;
    });

    // Find the most frequent category
    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];

    // Find apps in top category that haven't been viewed recently
    const suggested = apps.filter(app => app.category === topCategory && !recentlyViewed.includes(app.id));

    // If not enough suggestions, fallback to overall popular apps not viewed
    if (suggested.length < 3) {
      const fallback = apps
        .filter(app => !recentlyViewed.includes(app.id) && !suggested.find(s => s.id === app.id))
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        
      return [...suggested, ...fallback].slice(0, 3);
    }

    return suggested.slice(0, 3);
  }, [apps, recentlyViewed]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Intelligent Recommendations</h1>
          <p className="page-subtitle">Based on your recent activity and organization trends</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--accent-primary)' }}>
            <Lightbulb size={48} weight="duotone" />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Why these apps?</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Our recommendation engine analyzes your organization's application usage patterns. 
            By looking at <strong>frequently used categories</strong> and your <strong>recent activity</strong>, 
            we suggest tools that can integrate well with your current workflow.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Active User Context</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recently Viewed: {recentlyViewed.length} items</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Catalog: {apps.length} items</span>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Suggested Applications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map(app => (
              <div key={app.id} className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px' }}>
                    <AppWindow size={32} color="var(--accent-primary)" weight="duotone" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{app.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', maxWidth: '500px' }}>{app.description}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="tag tag-accent">{app.category}</span>
                      {app.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Link to="/catalog" className="btn btn-secondary">
                    View in Catalog <ArrowRight weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
            
            {recommendations.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
                Not enough data to provide recommendations. Explore the catalog to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;
