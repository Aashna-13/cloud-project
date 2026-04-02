import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Layout, SquaresFour, Lightbulb, GridFour, SignOut, UserCircle } from '@phosphor-icons/react';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import CatalogManager from './components/CatalogManager';
import RecommendationEngine from './components/RecommendationEngine';
import Login from './components/Login';

function App() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <Layout size={24} weight="bold" color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>CloudCatalog</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <SquaresFour size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/catalog" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <GridFour size={20} />
            Applications
          </NavLink>
          <NavLink to="/recommendations" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Lightbulb size={20} />
            Recommendations
          </NavLink>
        </nav>

        {/* User Profile & Logout Box */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <UserCircle size={32} color="var(--text-secondary)" weight="duotone" />
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.username}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currentUser.role}</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <SignOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/catalog" element={<CatalogManager />} />
          <Route path="/recommendations" element={<RecommendationEngine />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
