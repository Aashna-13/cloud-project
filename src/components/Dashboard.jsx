import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { ChartLineUp, Package, HardDrives, Fire } from '@phosphor-icons/react';

const Dashboard = () => {
  const { apps } = useCatalog();

  const totalApps = apps.length;
  const totalUsage = apps.reduce((acc, app) => acc + (app.usageCount || 0), 0);
  const computeApps = apps.filter(app => app.category === 'Compute').length;
  
  const mostUsed = [...apps].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to the Cloud Application Catalog system</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-primary)', padding: '16px', borderRadius: '12px' }}>
            <Package size={32} weight="duotone" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Applications</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800 }}>{totalApps}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', padding: '16px', borderRadius: '12px' }}>
            <ChartLineUp size={32} weight="duotone" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total App Uses</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800 }}>{totalUsage}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', padding: '16px', borderRadius: '12px' }}>
            <HardDrives size={32} weight="duotone" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Compute Instances</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800 }}>{computeApps}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Fire color="var(--accent-danger)" weight="fill" /> Most Used Applications
        </h2>
        
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Application Name</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Category</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Version</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Usage Count</th>
              </tr>
            </thead>
            <tbody>
              {mostUsed.map((app, index) => (
                <tr key={app.id} style={{ borderBottom: index < mostUsed.length - 1 ? '1px solid var(--glass-border)' : 'none', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{app.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="tag">{app.category}</span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.version}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'right', color: 'var(--accent-primary)' }}>{app.usageCount || 0}</td>
                </tr>
              ))}
              {mostUsed.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
