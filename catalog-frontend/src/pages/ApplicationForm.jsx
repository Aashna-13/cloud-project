import React, { useState, useEffect } from 'react';
import { appService } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allApps, setAllApps] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    version: '',
    url: '',
    description: '',
    tags: '',
    dependencyIds: []
  });

  useEffect(() => {
    // Fetch all apps for dependencies
    appService.getAll(0, 100).then(res => setAllApps(res.data.content));

    if (id) {
      // Edit mode
      appService.getById(id).then(res => {
        const app = res.data;
        setFormData({
          name: app.name,
          category: app.category,
          version: app.version,
          url: app.url || '',
          description: app.description || '',
          tags: app.tags || '',
          dependencyIds: app.dependencies?.map(d => d.appId) || []
        });
      }).catch(err => {
        setError("Failed to load application data.");
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDependencyChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({ ...prev, dependencyIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await appService.update(id, formData);
      } else {
        await appService.create(formData);
      }
      navigate('/apps');
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while saving.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Application' : 'Add New Application'}</h1>
        <p className="text-slate-500">Provide details for the cloud application catalog.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
            <AlertCircle className="mr-2 mt-0.5 shrink-0" size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Application Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Identity Provider"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Security"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Version *</label>
              <input
                type="text"
                name="version"
                required
                value={formData.version}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. 1.0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. react, ui, frontend"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. https://aws.amazon.com/s3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Briefly describe the application's purpose..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dependencies (Hold Ctrl/Cmd to select multiple)</label>
            <select
              multiple
              name="dependencyIds"
              value={formData.dependencyIds}
              onChange={handleDependencyChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-32"
            >
              {allApps.filter(app => app.appId !== parseInt(id)).map(app => (
                <option key={app.appId} value={app.appId}>
                  {app.name} (v{app.version})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/apps')}
              className="px-4 py-2 flex items-center justify-center space-x-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 flex items-center justify-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              <span>{loading ? 'Saving...' : 'Save Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
