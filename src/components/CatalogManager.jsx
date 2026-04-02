import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/mockData';
import ApplicationForm from './ApplicationForm';
import { Plus, MagnifyingGlass, Tag, PencilSimple, Trash, Eye } from '@phosphor-icons/react';

const CatalogManager = () => {
  const { apps, trackUsage, addApp, updateApp, deleteApp } = useCatalog();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Filter apps
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.tags && app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = categoryFilter === 'All' ? true : app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (app = null) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (formData) => {
    if (editingApp) {
      updateApp(formData.id, formData);
    } else {
      addApp(formData);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteApp(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Application Catalog</h1>
          <p className="page-subtitle">Manage, search, and track your cloud applications</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => handleOpenForm()}>
            <Plus size={20} weight="bold" /> Add Application
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
          <MagnifyingGlass size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by name, description, or tags..." 
            className="input-field" 
            style={{ paddingLeft: '48px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '250px' }}>
          <select 
            className="input-field" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="catalog-grid">
        {filteredApps.map(app => (
          <div key={app.id} className="glass-panel glass-panel-hover app-card">
            <div className="app-card-header">
              <div>
                <h3 className="app-card-title">{app.name}</h3>
                <span className="app-card-category">{app.category} • v{app.version}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => trackUsage(app.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'white' }} title="Simulate App Usage">
                  <Eye size={18} />
                </button>
              </div>
            </div>
            
            <div className="app-card-body">
              <p className="app-card-desc">{app.description}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {app.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="tag tag-accent"><Tag size={12} weight="bold" style={{marginRight: '4px'}}/> {tag}</span>
                ))}
                {app.tags?.length > 3 && <span className="tag">+{app.tags.length - 3}</span>}
              </div>

              {app.dependencies?.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Deps:</strong> {app.dependencies.join(', ')}
                </div>
              )}
            </div>
            
            <div className="app-card-footer">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Used {app.usageCount || 0} times
              </span>
              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenForm(app)} className="btn btn-secondary" style={{ padding: '6px', title: 'Edit' }}>
                    <PencilSimple size={18} />
                  </button>
                  <button onClick={() => handleDelete(app.id, app.name)} className="btn btn-danger" style={{ padding: '6px', title: 'Delete' }}>
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredApps.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
            No applications found matching your criteria.
          </div>
        )}
      </div>

      <ApplicationForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmitForm}
        initialData={editingApp}
      />
    </div>
  );
};

export default CatalogManager;
