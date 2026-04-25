import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Search, Filter, MoreVertical, Edit2, Trash2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { Book } from '../lib/supabase';

export function Books() {
  const { books, setBooks, setCurrentBook } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch('/api/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchBooks();
    } catch (err) {
      console.error('Failed to delete book:', err);
    }
  };

  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in_progress': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Books</h1>
            <p className="text-gray-400">Manage your writing projects</p>
          </div>
          <Link
            to="/books/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Book</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5 animate-pulse">
                <div className="h-40 bg-white/5 rounded-lg mb-4" />
                <div className="h-6 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[#2a2a2a] rounded-lg p-12 text-center border border-white/5">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Start your first writing project'}
            </p>
            {!searchQuery && (
              <Link
                to="/books/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span>Create Book</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book: Book, index: number) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#2a2a2a] rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors group"
              >
                <Link to={`/books/${book.id}`} onClick={() => setCurrentBook(book)}>
                  <div className="h-40 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-t-lg flex items-center justify-center">
                    <FileText className="w-16 h-16 text-gray-600" />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link 
                      to={`/books/${book.id}`} 
                      onClick={() => setCurrentBook(book)}
                      className="flex-1"
                    >
                      <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors truncate">
                        {book.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{book.genre || 'No genre'}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(book.status)}`}>
                      {book.status === 'in_progress' ? 'In Progress' : book.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(book.word_count || 0).toLocaleString()} words
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
                    <span>{book.chapters?.length || 0} chapters</span>
                    <span>{book.target_length || 150} target</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}