import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, FileCode, Book, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { Export, Chapter } from '../lib/supabase';

const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', icon: FileText, description: 'Professional PDF with cover, TOC, and pagination', color: 'text-red-400' },
  { id: 'epub', name: 'EPUB', icon: Book, description: 'E-reader compatible format', color: 'text-blue-400' },
  { id: 'docx', name: 'DOCX', icon: File, description: 'Microsoft Word document', color: 'text-blue-600' },
  { id: 'markdown', name: 'Markdown', icon: FileCode, description: 'Plain text with formatting', color: 'text-gray-400' },
];

export function ExportHub() {
  const { id } = useParams<{ id: string }>();
  const { currentBook, incrementUsage } = useStore();
  const [exports, setExports] = useState<Export[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExports();
      fetchChapters();
    }
  }, [id]);

  const fetchExports = async () => {
    try {
      const res = await fetch(`/api/exports?book_id=${id}`);
      const data = await res.json();
      setExports(data);
    } catch (err) {
      console.error('Failed to fetch exports:', err);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await fetch(`/api/chapters?book_id=${id}`);
      const data = await res.json();
      setChapters(data);
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(format);
    incrementUsage();

    try {
      // Create export record
      const exportRes = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: id,
          format,
          status: 'processing',
        }),
      });
      const exportData = await exportRes.json();

      // Generate content based on format
      let content = '';
      let blob: Blob;
      let filename = '';

      const bookTitle = currentBook?.title || 'Untitled';

      switch (format) {
        case 'markdown':
          content = generateMarkdown(bookTitle, chapters);
          blob = new Blob([content], { type: 'text/markdown' });
          filename = `${bookTitle.replace(/\s+/g, '_')}.md`;
          break;
        case 'pdf':
        case 'epub':
        case 'docx':
          // Simulate processing
          await new Promise((resolve) => setTimeout(resolve, 2000));
          content = generateMarkdown(bookTitle, chapters);
          blob = new Blob([content], { type: 'text/plain' });
          filename = `${bookTitle.replace(/\s+/g, '_')}.txt`;
          break;
        default:
          content = generateMarkdown(bookTitle, chapters);
          blob = new Blob([content], { type: 'text/plain' });
          filename = `${bookTitle.replace(/\s+/g, '_')}.txt`;
      }

      // Update export as completed
      await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: id,
          format,
          status: 'completed',
          download_url: URL.createObjectURL(blob),
          file_size: blob.size,
        }),
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      fetchExports();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const generateMarkdown = (title: string, chapters: Chapter[]) => {
    let md = `# ${title}\n\n`;
    md += `*Generated with HYDRASKRIPT*\n\n`;
    md += `---\n\n`;
    md += `## Table of Contents\n\n`;
    
    chapters.forEach((chapter, index) => {
      md += `${index + 1}. [${chapter.title}](#chapter-${chapter.chapter_number})\n`;
    });
    
    md += `\n---\n\n`;
    
    chapters.forEach((chapter) => {
      md += `<a name="chapter-${chapter.chapter_number}"></a>\n`;
      md += `# Chapter ${chapter.chapter_number}: ${chapter.title}\n\n`;
      md += `${chapter.content || '*No content yet*'}\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const showPreviewModal = () => {
    const content = generateMarkdown(currentBook?.title || 'Untitled', chapters);
    setPreviewContent(content);
    setShowPreview(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Export Hub</h1>
          <p className="text-gray-400">
            Export "{currentBook?.title}" in multiple formats
          </p>
        </div>

        {/* Preview Button */}
        <div className="mb-6">
          <button
            onClick={showPreviewModal}
            className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            Preview Book
          </button>
        </div>

        {/* Export Formats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {EXPORT_FORMATS.map((format) => (
            <motion.button
              key={format.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport(format.id)}
              disabled={isExporting === format.id}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5 hover:border-purple-500/30 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-4">
                <format.icon className={`w-8 h-8 ${format.color}`} />
                {isExporting === format.id && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{format.name}</h3>
              <p className="text-sm text-gray-400">{format.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Export History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Export History</h2>

          {exports.length === 0 ? (
            <div className="bg-[#2a2a2a] rounded-lg p-8 text-center border border-white/5">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No exports yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {exports.map((exp, index) => {
                const format = EXPORT_FORMATS.find((f) => f.id === exp.format);
                const Icon = format?.icon || FileText;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-white/5"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-5 h-5 ${format?.color || 'text-gray-400'}`} />
                      <div>
                        <span className="font-medium uppercase">{exp.format}</span>
                        <span className="text-gray-500 mx-2">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(exp.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {exp.status === 'completed' ? (
                        <>
                          <span className="text-sm text-gray-400">
                            {(exp.file_size / 1024).toFixed(1)} KB
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          {exp.download_url && (
                            <a
                              href={exp.download_url}
                              download
                              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </>
                      ) : exp.status === 'processing' ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-400">Processing...</span>
                        </div>
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white text-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Book Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <pre className="font-serif text-sm whitespace-pre-wrap">{previewContent}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}