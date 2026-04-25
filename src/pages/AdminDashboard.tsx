import { useEffect, useState } from 'react';
import { Users, BookOpen, Activity, Zap, AlertTriangle, Trash2, Ban, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';

interface Analytics {
  active_users: number;
  total_books: number;
  completed_books: number;
  total_words_generated: number;
  total_exports: number;
  total_audiobooks: number;
  system_health: {
    openrouter: string;
    fal_ai: string;
    gemini_tts: string;
  };
}

export function AdminDashboard() {
  const { user } = useStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    const adminEmails = ['admin@hydraskript.com', 'demo@hydraskript.com'];
    if (user && adminEmails.includes(user.email)) {
      setIsAdmin(true);
      fetchAnalytics();
    } else {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Admin Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">System administration and monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                Admin Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-500">Users</span>
            </div>
            <div className="text-2xl font-bold">{analytics?.active_users || 0}</div>
            <div className="text-sm text-gray-400">Active users</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-500">Books</span>
            </div>
            <div className="text-2xl font-bold">{analytics?.total_books || 0}</div>
            <div className="text-sm text-gray-400">{analytics?.completed_books || 0} completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-500">Words</span>
            </div>
            <div className="text-2xl font-bold">
              {(analytics?.total_words_generated || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Generated</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-500">Exports</span>
            </div>
            <div className="text-2xl font-bold">{analytics?.total_exports || 0}</div>
            <div className="text-sm text-gray-400">{analytics?.total_audiobooks || 0} audiobooks</div>
          </motion.div>
        </div>

        {/* System Health */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5 mb-8">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {analytics?.system_health && Object.entries(analytics.system_health).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <span className="capitalize">{service.replace('_', ' ')}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  status === 'operational' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Actions */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">Maintenance</h2>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Flush Cache</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <Ban className="w-4 h-4" />
              <span>Pause Queue</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Clear Failed Jobs</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Admin Mode Active:</strong> This dashboard is designed for system administrators. 
            All actions are logged. Current server costs: $0 (using free tiers).
          </p>
        </div>
      </div>
    </div>
  );
}