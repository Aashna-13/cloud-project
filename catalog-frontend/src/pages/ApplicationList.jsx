import React, { useState, useEffect } from 'react';
import { appService } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Filter, Box, Edit, Trash2, ExternalLink, Flame, Globe } from 'lucide-react';

const ApplicationList = () => {
  const [apps, setApps] = useState([]);
  const [recommendedApps, setRecommendedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchApps();
    fetchRecommendations();
  }, []);

  const trackView = (app) => {
    try {
      if (!app || !app.appId) return;
      
      let stored = [];
      const raw = localStorage.getItem('recentlyViewed');
      if (raw) stored = JSON.parse(raw);
      
      // Remove if already exists to push to front
      stored = stored.filter(a => a.appId !== app.appId);
      
      // Add to front
      stored.unshift({
        appId: app.appId,
        name: app.name,
        category: app.category,
        url: app.url
      });
      
      // Keep only top 5
      if (stored.length > 5) stored = stored.slice(0, 5);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(stored));
      
      // Notify sidebar to refresh
      window.dispatchEvent(new CustomEvent('recentlyViewedUpdated'));
    } catch (e) {
      console.error("Failed to save view:", e);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await appService.getGlobalRecommendations();
      setRecommendedApps(res.data);
    } catch (err) {
      console.error("Error fetching recommendations", err);
    }
  };

  const fetchApps = async (searchKw = '') => {
    setLoading(true);
    try {
      let response;
      if (searchKw) {
        response = await appService.search(searchKw);
        setApps(response.data);
      } else {
        response = await appService.getAll(0, 50); // Fetch up to 50
        setApps(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching apps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await appService.delete(id);
        fetchApps(keyword);
      } catch (error) {
        console.error("Error deleting app:", error);
      }
    }
  };

  const handleLaunch = async (app) => {
    if (app.url) {
      trackView(app);
      window.open(app.url, '_blank');
      try {
        await appService.launch(app.appId);
        // Refresh apps to update usage count
        fetchApps(keyword);
      } catch (error) {
        console.error("Error launching app:", error);
      }
    } else {
      alert("No URL configured for this application.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApps(keyword);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Catalog</h1>
          <p className="text-slate-500">Discover and manage cloud applications.</p>
        </div>
        <Link to="/apps/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer">
          Add Application
        </Link>
      </div>

      {/* Recommended Section */}
      {!loading && !keyword && recommendedApps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" size={20} /> Recommended For You
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
            {recommendedApps.map(app => {
              const isExternal = app.tags && app.tags.includes('external');
              return (
              <div key={`rec-${app.appId}`} className={`min-w-[300px] max-w-[300px] bg-gradient-to-br ${isExternal ? 'from-emerald-50' : 'from-indigo-50'} to-white rounded-xl border ${isExternal ? 'border-emerald-200' : 'border-indigo-100'} shadow-sm hover:shadow transition-shadow overflow-hidden flex flex-col flex-shrink-0`}>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 ${isExternal ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-700'} text-xs font-bold rounded-full flex items-center gap-1`}>
                      {isExternal && <Globe size={12} />} {app.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{isExternal ? 'Web Discovery' : `v${app.version}`}</span>
                  </div>
                  <h3 className="text-md font-bold text-slate-900 mb-1 truncate">{app.name}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2 mb-3">{app.description}</p>
                </div>
                <div className={`px-4 py-3 bg-white border-t ${isExternal ? 'border-emerald-50' : 'border-indigo-50'} flex justify-between items-center`}>
                   <span className="text-xs font-medium text-slate-500">Usage: <span className={`${isExternal ? 'text-emerald-600' : 'text-indigo-600'} font-bold`}>{app.usageCount}</span></span>
                   <button 
                     onClick={() => handleLaunch(app)}
                     className={`px-3 py-1.5 ${isExternal ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white text-xs font-medium rounded transition-colors flex items-center gap-1`}
                   >
                     {isExternal ? 'Explore' : 'Launch'} <ExternalLink size={12} />
                   </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, category, tags..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <button type="submit" className="hidden">Search</button>
        </form>
        <button 
          onClick={() => { setKeyword(''); fetchApps(''); }}
          className="px-4 py-2 flex items-center gap-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <Filter size={18} /> Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Box className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
          <p className="text-slate-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.appId} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {app.category}
                  </span>
                  <div className="flex space-x-1">
                    <Link to={`/apps/edit/${app.appId}`} onClick={() => trackView(app)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(app.appId)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{app.name}</h3>
                <p className="text-sm border text-slate-500 inline-block px-1 rounded bg-slate-50 mb-3">v{app.version}</p>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">{app.description}</p>
                
                {app.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                    {app.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => handleLaunch(app)}
                  className="mt-auto w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} /> Launch App
                </button>
              </div>
              <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Usage Count: <span className="text-blue-600 font-bold">{app.usageCount}</span></span>
                {app.dependencies && app.dependencies.length > 0 && (
                  <span className="text-xs text-slate-500">{app.dependencies.length} dependencies</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
