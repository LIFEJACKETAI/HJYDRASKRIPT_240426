import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Type, AlignLeft, Wand2, ChevronRight, BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { Chapter, StoryBible } from '../lib/supabase';

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentBook, incrementUsage } = useStore();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [storyBible, setStoryBible] = useState<StoryBible | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showBiblePanel, setShowBiblePanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (id) fetchChapterData();
  }, [id]);

  useEffect(() => {
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
  }, [content]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && chapter) {
        saveContent();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [content]);

  const fetchChapterData = async () => {
    try {
      // Fetch chapter
      const chapterRes = await fetch(`/api/chapters`);
      const allChapters = await chapterRes.json();
      const foundChapter = allChapters.find((c: Chapter) => c.id === id);
      if (foundChapter) {
        setChapter(foundChapter);
        setContent(foundChapter.content || '');
      }

      // Fetch all chapters for this book
      if (foundChapter?.book_id) {
        const bookChapters = allChapters.filter((c: Chapter) => c.book_id === foundChapter.book_id);
        setChapters(bookChapters.sort((a: Chapter, b: Chapter) => a.chapter_number - b.chapter_number));

        // Fetch story bible
        const bibleRes = await fetch(`/api/story-bibles?book_id=${foundChapter.book_id}`);
        const bibleData = await bibleRes.json();
        setStoryBible(bibleData);
      }
    } catch (err) {
      console.error('Failed to fetch chapter:', err);
    }
  };

  const saveContent = async () => {
    if (!chapter) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/chapters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: chapter.id,
          content,
          word_count: wordCount,
        }),
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setIsSaving(false);
    }
  };

      const handleAiAction = async (action: 'continue' | 'rewrite' | 'expand') => {
    if (!content.trim()) return;
    setIsAiGenerating(true);
    incrementUsage();
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action,
          book_id: currentBook?.id,
          context: {
            bookTitle: currentBook?.title,
            genre: currentBook?.genre,
            tone: currentBook?.tone,
            storyBible,
            content,
            chapterTitle: chapter?.title,
            chapterNumber: chapter?.chapter_number,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      if (action === 'continue') {
        setContent(content + '\n\n' + data.generated_text);
      } else {
        setContent(data.generated_text);
      }
    } catch (err) {
      console.error('AI action failed:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const insertAiText = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    incrementUsage();
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'default',
          prompt: aiPrompt,
          book_id: currentBook?.id,
          context: {
            bookTitle: currentBook?.title,
            genre: currentBook?.genre,
            tone: currentBook?.tone,
            storyBible,
            content,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setContent(content + '\n\n' + data.generated_text);
      setAiPrompt('');
    } catch (err) {
      console.error('AI prompt failed:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

      console.error('AI action failed:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const insertAiText = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    incrementUsage();
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'default',
          prompt: aiPrompt,
          book_id: currentBook?.id,
          context: {
            bookTitle: currentBook?.title,
            genre: currentBook?.genre,
            tone: currentBook?.tone,
            storyBible,
            content,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setContent(content + '\n\n' + data.generated_text);
      setAiPrompt('');
    } catch (err) {
      console.error('AI prompt failed:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };


  if (!chapter) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/5 rounded w-1/3 mb-4" />
            <div className="h-64 bg-white/5 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-[#DCDFD5] text-gray-900">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#2a2a2a] text-white flex items-center justify-between px-4 z-40 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Link to={`/books/${chapter.book_id}`} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-medium text-sm">{currentBook?.title || 'Untitled Book'}</h1>
            <p className="text-xs text-gray-400">Chapter {chapter.chapter_number}: {chapter.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400">
            {wordCount.toLocaleString()} words
          </span>
          <span className="text-xs text-gray-400">
            {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved'}
          </span>
          <button
            onClick={saveContent}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="pt-14 flex h-screen">
        {/* Chapter Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#2a2a2a] text-white border-r border-white/10 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-gray-400">Chapters</h3>
                  <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {chapters.map((ch) => (
                    <Link
                      key={ch.id}
                      to={`/editor/${ch.id}`}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                        ch.id === id
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span className="w-5 text-xs text-gray-500">{ch.chapter_number}</span>
                      <span className="truncate flex-1">{ch.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 space-x-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2" />
            <button
              onClick={() => setShowBiblePanel(!showBiblePanel)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                showBiblePanel ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Story Bible</span>
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2" />
            <button
              onClick={() => handleAiAction('continue')}
              disabled={isAiGenerating}
              className="flex items-center space-x-1 px-2 py-1 rounded text-sm hover:bg-purple-50 text-purple-700 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue</span>
            </button>
            <button
              onClick={() => handleAiAction('expand')}
              disabled={isAiGenerating}
              className="flex items-center space-x-1 px-2 py-1 rounded text-sm hover:bg-purple-50 text-purple-700 disabled:opacity-50"
            >
              <Type className="w-4 h-4" />
              <span>Expand</span>
            </button>
            <button
              onClick={() => handleAiAction('rewrite')}
              disabled={isAiGenerating}
              className="flex items-center space-x-1 px-2 py-1 rounded text-sm hover:bg-purple-50 text-purple-700 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              <span>Rewrite</span>
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto">
                <input
                  type="text"
                  value={chapter.title}
                  onChange={async (e) => {
                    const newTitle = e.target.value;
                    setChapter({ ...chapter, title: newTitle });
                    await fetch('/api/chapters', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: chapter.id, title: newTitle }),
                    });
                  }}
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-4 placeholder-gray-400"
                  placeholder="Chapter Title"
                />
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[60vh] bg-transparent border-none outline-none resize-none text-lg leading-relaxed font-serif"
                  placeholder="Start writing your chapter here..."
                />
              </div>
            </div>

            {/* Story Bible Panel */}
            <AnimatePresence>
              {showBiblePanel && storyBible && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-white border-l border-gray-200 overflow-y-auto"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">Story Bible</h3>
                      <button onClick={() => setShowBiblePanel(false)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {storyBible.characters?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-purple-600 mb-2">Characters</h4>
                        <div className="space-y-2">
                          {storyBible.characters.map((char: any, i: number) => (
                            <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium">{char.name}</div>
                              <div className="text-xs text-gray-500">{char.role}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {storyBible.settings?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-cyan-600 mb-2">Settings</h4>
                        <div className="space-y-2">
                          {storyBible.settings.map((setting: any, i: number) => (
                            <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium">{setting.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {storyBible.themes?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-pink-600 mb-2">Themes</h4>
                        <div className="flex flex-wrap gap-1">
                          {storyBible.themes.map((theme: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded text-xs">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Input Bar */}
          <div className="h-14 bg-white border-t border-gray-200 px-4 flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && insertAiText()}
              placeholder="Ask AI to write something..."
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={insertAiText}
              disabled={!aiPrompt.trim() || isAiGenerating}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isAiGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}