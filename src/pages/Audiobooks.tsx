import { useEffect, useState } from 'react';
import { Mic, Play, Pause, Download, Clock, CheckCircle, AlertCircle, Sparkles, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { AudiobookJob, Book, Chapter } from '../lib/supabase';

const VOICES = [
  { id: 'en-US-Neural2-A', name: 'Alex (US Male)', preview: 'Professional, warm' },
  { id: 'en-US-Neural2-C', name: 'Catherine (US Female)', preview: 'Clear, articulate' },
  { id: 'en-US-Neural2-D', name: 'David (US Male)', preview: 'Deep, authoritative' },
  { id: 'en-GB-Neural2-B', name: 'Emma (UK Female)', preview: 'British accent, crisp' },
  { id: 'en-GB-Neural2-D', name: 'James (UK Male)', preview: 'British accent, refined' },
];

export function Audiobooks() {
  const { books, chapters } = useStore();
  const [jobs, setJobs] = useState<AudiobookJob[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/audiobooks');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch audiobook jobs:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedBook) return;
    setIsGenerating(true);

    try {
      const bookChapters = chapters.filter((c: Chapter) => c.book_id === selectedBook && c.content);
      
      for (const chapter of bookChapters) {
        await fetch('/api/audiobooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_id: selectedBook,
            chapter_id: chapter.id,
            voice_id: selectedVoice,
            status: 'queued',
            progress: 0,
          }),
        });
      }

      // Simulate processing
      setTimeout(() => {
        fetchJobs();
        setIsGenerating(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to generate audiobook:', err);
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing': return <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Audiobook Studio</h1>
            <p className="text-gray-400">Convert your books to speech with AI narration</p>
          </div>
        </div>

        {/* Generation Panel */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Mic className="w-5 h-5 text-purple-400" />
            <span>Generate New Audiobook</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Book</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg"
              >
                <option value="">Choose a book...</option>
                {books.map((book: Book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.chapters?.length || 0} chapters)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg"
              >
                {VOICES.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.preview}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-sm text-purple-300">
              <strong>How it works:</strong> Text is chunked into ≤250 character segments, synthesized via Gemini AI Studio, 
              then stitched together with FFmpeg. Audio files are stored in Cloudflare R2 for zero egress costs.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedBook || isGenerating}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Queueing...</span>
              </>
            ) : (
              <>
                <Headphones className="w-5 h-5" />
                <span>Generate Audiobook</span>
              </>
            )}
          </button>
        </div>

        {/* Jobs List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Production Queue</h2>

          {jobs.length === 0 ? (
            <div className="bg-[#2a2a2a] rounded-lg p-12 text-center border border-white/5">
              <Headphones className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No audiobooks yet</h3>
              <p className="text-gray-400">Generate your first audiobook above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, index) => {
                const book = books.find((b: Book) => b.id === job.book_id);
                const chapter = chapters.find((c: Chapter) => c.id === job.chapter_id);
                const voice = VOICES.find((v) => v.id === job.voice_id);

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-white/5"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <h3 className="font-medium">{book?.title || 'Unknown Book'}</h3>
                        <p className="text-sm text-gray-500">
                          {chapter?.title || 'Unknown Chapter'} • {voice?.name || 'Default Voice'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {job.status === 'processing' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">{job.progress}%</span>
                        </div>
                      )}

                      {job.duration > 0 && (
                        <span className="text-sm text-gray-400">
                          {formatDuration(job.duration)}
                        </span>
                      )}

                      {job.status === 'completed' && job.audio_url && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPlayingAudio(playingAudio === job.id ? null : job.id)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {playingAudio === job.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={job.audio_url}
                            download
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}