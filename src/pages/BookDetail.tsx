import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, MoreVertical, BookOpen, Sparkles, FileText, Mic, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { Book, Chapter, StoryBible } from '../lib/supabase';

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBook, setCurrentBook, setCurrentChapter } = useStore();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [storyBible, setStoryBible] = useState<StoryBible | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chapters' | 'bible' | 'consistency'>('chapters');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    if (id) fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    setIsLoading(true);
    try {
      // Fetch book
      const bookRes = await fetch(`/api/books`);
      const books = await bookRes.json();
      const foundBook = books.find((b: Book) => b.id === id);
      if (foundBook) {
        setBook(foundBook);
        setCurrentBook(foundBook);
      }

      // Fetch chapters
      const chaptersRes = await fetch(`/api/chapters?book_id=${id}`);
      const chaptersData = await chaptersRes.json();
      setChapters(chaptersData);

      // Fetch story bible
      const bibleRes = await fetch(`/api/story-bibles?book_id=${id}`);
      const bibleData = await bibleRes.json();
      setStoryBible(bibleData);
    } catch (err) {
      console.error('Failed to fetch book data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChapter = async () => {
    const title = prompt('Enter chapter title:');
    if (!title) return;

    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: id,
          title,
          chapter_number: chapters.length + 1,
          content: '',
        }),
      });
      const newChapter = await res.json();
      setChapters([...chapters, newChapter]);
    } catch (err) {
      console.error('Failed to create chapter:', err);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter?')) return;
    try {
      const res = await fetch('/api/chapters', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: chapterId }),
      });
      if (res.ok) {
        setChapters(chapters.filter((c) => c.id !== chapterId));
      }
    } catch (err) {
      console.error('Failed to delete chapter:', err);
    }
  };

  const handleGenerateOutline = async () => {
    setShowGenerateModal(true);
    // Simulate AI outline generation
    setTimeout(() => {
      const outline = [
        { title: 'Chapter 1: The Beginning', number: 1 },
        { title: 'Chapter 2: Rising Tension', number: 2 },
        { title: 'Chapter 3: The Discovery', number: 3 },
        { title: 'Chapter 4: First Conflict', number: 4 },
        { title: 'Chapter 5: The Twist', number: 5 },
      ];
      // Would create chapters from outline
      setShowGenerateModal(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
            <Link to="/books" className="text-cyan-400 hover:text-cyan-300">
              Back to books →
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-8">
          <div className="flex items-start space-x-4">
            <button
              onClick={() => navigate('/books')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{book.genre}</span>
                <span>•</span>
                <span>{book.tone}</span>
                <span>•</span>
                <span>{chapters.length} chapters</span>
                <span>•</span>
                <span>{chapters.reduce((sum, c) => sum + (c.word_count || 0), 0).toLocaleString()} words</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/books/${id}/export`}
              className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </Link>
            <Link
              to={`/books/${id}/audiobook`}
              className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors flex items-center space-x-2"
            >
              <Mic className="w-4 h-4" />
              <span>Audiobook</span>
            </Link>
            <button
              onClick={handleGenerateOutline}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Generate</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-6 border-b border-white/10">
          {[
            { id: 'chapters', label: 'Chapters', icon: BookOpen },
            { id: 'bible', label: 'Story Bible', icon: Sparkles },
            { id: 'consistency', label: 'Consistency', icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'chapters' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chapters</h2>
              <button
                onClick={handleCreateChapter}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Chapter</span>
              </button>
            </div>

            {chapters.length === 0 ? (
              <div className="bg-[#2a2a2a] rounded-lg p-12 text-center border border-white/5">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
                <p className="text-gray-400 mb-4">Start writing or generate an outline with AI</p>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={handleCreateChapter}
                    className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Add Chapter
                  </button>
                  <button
                    onClick={handleGenerateOutline}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    AI Generate Outline
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors group"
                  >
                    <Link
                      to={`/editor/${chapter.id}`}
                      onClick={() => setCurrentChapter(chapter)}
                      className="flex items-center space-x-4 flex-1"
                    >
                      <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sm font-medium text-gray-400">
                        {chapter.chapter_number}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-cyan-400 transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {(chapter.word_count || 0).toLocaleString()} words • {chapter.status}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/editor/${chapter.id}`}
                        onClick={() => setCurrentChapter(chapter)}
                        className="p-2 hover:bg-white/5 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bible' && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
            <h2 className="text-xl font-semibold mb-6">Story Bible</h2>
            {storyBible ? (
              <div className="space-y-6">
                {storyBible.characters?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-purple-400">Characters</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {storyBible.characters.map((char: any, i: number) => (
                        <div key={i} className="p-3 bg-black/30 rounded-lg">
                          <div className="font-medium">{char.name}</div>
                          <div className="text-sm text-gray-400">{char.description}</div>
                          <div className="text-xs text-cyan-400 mt-1">{char.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {storyBible.settings?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-cyan-400">Settings</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {storyBible.settings.map((setting: any, i: number) => (
                        <div key={i} className="p-3 bg-black/30 rounded-lg">
                          <div className="font-medium">{setting.name}</div>
                          <div className="text-sm text-gray-400">{setting.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {storyBible.themes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-pink-400">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {storyBible.themes.map((theme: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {storyBible.raw_idea && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-yellow-400">Raw Idea</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{storyBible.raw_idea}</p>
                  </div>
                )}

                {storyBible.voice_notes && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-green-400">Voice Notes</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{storyBible.voice_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No story bible created yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Consistency Check</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity">
                Run AI Check
              </button>
            </div>
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No consistency issues detected.</p>
              <p className="text-sm text-gray-500 mt-2">Run an AI check to scan for character name, timeline, and setting inconsistencies.</p>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold">Generating Outline...</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Analyzing Story Bible...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Generating chapter structure...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>Finalizing outline...</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}