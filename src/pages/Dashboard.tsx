import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, CheckCircle, BarChart3, Headphones, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { Book } from '../lib/supabase';

export function Dashboard() {
  const { books, setBooks, setCurrentBook } = useStore();
  const [stats, setStats] = useState({
    total_books: 0,
    total_words: 0,
    total_audio_minutes: 0,
    completed_books: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'in_progress': return 'text-cyan-400 bg-cyan-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Draft';
    }
  };

  const recentBooks = books.slice(0, 4);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Creator
            </span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your writing projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold">{stats.total_books}</div>
            <div className="text-sm text-gray-400">Books</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-gray-500">Written</span>
            </div>
            <div className="text-2xl font-bold">{stats.total_words.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Words</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-500">Done</span>
            </div>
            <div className="text-2xl font-bold">{stats.completed_books}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Headphones className="w-5 h-5 text-pink-400" />
              <span className="text-xs text-gray-500">Audio</span>
            </div>
            <div className="text-2xl font-bold">{stats.total_audio_minutes}</div>
            <div className="text-sm text-gray-400">Minutes</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/books/new"
            className="group flex items-center space-x-4 p-6 bg-gradient-to-br from-purple-900/30 to-purple-900/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Create New Book</h3>
              <p className="text-gray-400 text-sm">Start a new AI-assisted writing project</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/styles"
            className="group flex items-center space-x-4 p-6 bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Train Writing Style</h3>
              <p className="text-gray-400 text-sm">Upload samples and define your voice</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Recent Books */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link to="/books" className="text-sm text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>

          {recentBooks.length === 0 ? (
            <div className="bg-[#2a2a2a] rounded-lg p-12 text-center border border-white/5">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No books yet</h3>
              <p className="text-gray-400 mb-4">Start your first AI-assisted writing project</p>
              <Link
                to="/books/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span>Create Book</span>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentBooks.map((book: Book, index: number) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/books/${book.id}`}
                    onClick={() => setCurrentBook(book)}
                    className="block bg-[#2a2a2a] rounded-lg p-4 border border-white/5 hover:border-purple-500/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(book.status)}`}>
                        {getStatusLabel(book.status)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-cyan-400 transition-colors truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{book.genre || 'No genre'}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{(book.word_count || 0).toLocaleString()} words</span>
                      <span>{book.chapters?.length || 0} chapters</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}