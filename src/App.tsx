import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { NewBook } from './pages/NewBook';
import { BookDetail } from './pages/BookDetail';
import { Editor } from './pages/Editor';
import { StyleStudio } from './pages/StyleStudio';
import { Audiobooks } from './pages/Audiobooks';
import { ExportHub } from './pages/ExportHub';
import { AdminDashboard } from './pages/AdminDashboard';
import { supabase } from './lib/supabase';
import { useStore } from './lib/store';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // First check store
      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Then check session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { setUser } = useStore();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
      <Route path="/books/new" element={<ProtectedRoute><NewBook /></ProtectedRoute>} />
      <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
      <Route path="/books/:id/export" element={<ProtectedRoute><ExportHub /></ProtectedRoute>} />
      <Route path="/books/:id/audiobook" element={<ProtectedRoute><Audiobooks /></ProtectedRoute>} />
      <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
      <Route path="/styles" element={<ProtectedRoute><StyleStudio /></ProtectedRoute>} />
      <Route path="/audiobooks" element={<ProtectedRoute><Audiobooks /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;