import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, Search, Clock, Box, ExternalLink, Trash2 } from 'lucide-react';

// Placeholder imports for pages we will create shortly
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import ApplicationForm from './pages/ApplicationForm';

function App() {
  const location = useLocation();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    loadRecentlyViewed();
    
    // Listen for updates from other components
    const handleUpdate = () => loadRecentlyViewed();
    window.addEventListener('recentlyViewedUpdated', handleUpdate);
    return () => window.removeEventListener('recentlyViewedUpdated', handleUpdate);
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentlyViewed([]);
    // Notify other components (if they care)
    window.dispatchEvent(new CustomEvent('recentlyViewedUpdated'));
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/apps', label: 'Catalog', icon: <List size={20} /> },
    { path: '/apps/new', label: 'Add App', icon: <PlusCircle size={20} /> }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            CloudList
          </h1>
          <p className="text-xs text-slate-400 mt-1">Intelligent Catalog</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Recently Viewed Sidebar Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-8 px-6 pb-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} /> History
              </h2>
              <button 
                onClick={clearRecentlyViewed}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
                title="Clear History"
              >
                Clear
              </button>
            </div>
            <div className="space-y-3">
              {recentlyViewed.filter(app => app && app.name).length > 0 ? (
                recentlyViewed
                  .filter(app => app && app.name)
                  .map((app) => (
                    <a
                      key={`side-rec-${app.appId}`}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                      title={`Launch ${app.name}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-slate-700 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 transition-colors">
                          <Box size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-200 truncate">{app.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{app.category}</p>
                        </div>
                        <ExternalLink size={12} className="text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </a>
                  ))
              ) : (
                <div className="bg-slate-800/20 border border-dashed border-slate-800 rounded-lg p-4 text-center">
                  <p className="text-[10px] text-slate-500 italic">No recent activity. Launch an app to see it here!</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center uppercase tracking-widest mt-auto">
          © 2026 CloudList Tech
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-stretch overflow-hidden">
        {/* Navbar for mobile and top actions */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center md:hidden">
            <h1 className="text-xl font-bold text-slate-900">CloudList</h1>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Global search applications..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apps" element={<ApplicationList />} />
            <Route path="/apps/new" element={<ApplicationForm />} />
            <Route path="/apps/edit/:id" element={<ApplicationForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
