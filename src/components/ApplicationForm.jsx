import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from '../utils/mockData';
import { X } from '@phosphor-icons/react';

const ApplicationForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0],
    version: '1.0.0',
    tags: '',
    dependencies: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags,
        dependencies: Array.isArray(initialData.dependencies) ? initialData.dependencies.join(', ') : initialData.dependencies
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: CATEGORIES[0],
        version: '1.0.0',
        tags: '',
        dependencies: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process string into array for tags and deps
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const depsArray = formData.dependencies ? formData.dependencies.split(',').map(d => d.trim()).filter(Boolean) : [];

    const finalData = {
      ...formData,
      id: initialData?.id || uuidv4(),
      tags: tagsArray,
      dependencies: depsArray,
      usageCount: initialData?.usageCount || 0
    };

    onSubmit(finalData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem' }}>{initialData ? 'Edit Application' : 'Add New Application'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={24} weight="bold" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label className="input-label">Application Name *</label>
              <input required type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="e.g., AWS EC2" />
            </div>
            
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea name="description" className="input-field" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the application..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Version</label>
                <input type="text" name="version" className="input-field" value={formData.version} onChange={handleChange} placeholder="1.0.0" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Tags (comma separated)</label>
              <input type="text" name="tags" className="input-field" value={formData.tags} onChange={handleChange} placeholder="infrastructure, vm, cloud" />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Dependencies (comma separated)</label>
              <input type="text" name="dependencies" className="input-field" value={formData.dependencies} onChange={handleChange} placeholder="AWS IAM, Terraform" />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Create Application'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
