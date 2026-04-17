import React, { useState, useEffect } from 'react';
import { appService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Layers, Activity, Clock, Box, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await appService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  if (!analytics) return <div className="text-red-500">Failed to load analytics.</div>;

  const categoryData = Object.entries(analytics.categoryDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your cloud catalog ecosystem.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{analytics.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Layers size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Applications</p>
            <p className="text-2xl font-bold text-slate-900">{analytics.totalApps}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Most Used App</p>
            <p className="text-lg font-bold text-slate-900 truncate w-32">
              {analytics.mostUsedApplications[0]?.name || 'N/A'}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Box size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{Object.keys(analytics.categoryDistribution).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recently Added</p>
            <p className="text-lg font-bold text-slate-900 truncate w-32">
              {analytics.recentlyAdded[0]?.name || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Most Used Applications</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.mostUsedApplications}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="usageCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Category Distribution</h2>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
