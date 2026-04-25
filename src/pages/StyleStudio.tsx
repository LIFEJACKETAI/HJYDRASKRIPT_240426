import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Download, Upload, Sparkles, FileText, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';
import { WritingStyle } from '../lib/supabase';

const DEFAULT_PROCEDURAL_STYLE = {
  name: 'Procedural/Technical',
  description: 'Clean, institutional, observational prose without emotional narration',
  author_reference: 'Kafka, Dick, Le Carré',
  tone: 'Disillusioned, Controlled, Observational',
  sentence_length: 'Medium to long, complex constructions',
  vocabulary: 'Concrete, Institutional, Technical',
  pacing: 'Deliberate, measured',
  perspective: 'Third person limited, detached',
  sample_text: 'The system processed the request. Access denied. Badge invalid. He stood at the terminal, watching the red light pulse. Three attempts remained before lockout.',
  rules: [
    'Narrator reports system actions, not internal states',
    'Ban emotional narration',
    'Ban poetic metaphors',
    'Ban "gut/heart/dread"',
    'Enforce procedural language ("access denied", "badge invalid")',
  ],
};

const TEST_PROMPTS = {
  action: 'Write an action scene where the protagonist escapes a facility',
  romantic: 'Write a romantic moment between two characters',
  reveal: 'Write a scene where a secret is discovered',
  emotional: 'Write an emotional confrontation',
};

export function StyleStudio() {
  const { writingStyles, setWritingStyles, incrementUsage } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingStyle, setEditingStyle] = useState<WritingStyle | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author_reference: '',
    tone: '',
    sentence_length: '',
    vocabulary: '',
    pacing: '',
    perspective: '',
    sample_text: '',
    rules: [''],
  });

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      const res = await fetch('/api/styles');
      const data = await res.json();
      setWritingStyles(data);
    } catch (err) {
      console.error('Failed to fetch styles:', err);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      rules: formData.rules.filter((r) => r.trim()),
    };

    try {
      if (editingStyle) {
        await fetch('/api/styles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStyle.id, ...payload }),
        });
      } else {
        await fetch('/api/styles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      fetchStyles();
      setIsCreating(false);
      setEditingStyle(null);
      setFormData({
        name: '',
        description: '',
        author_reference: '',
        tone: '',
        sentence_length: '',
        vocabulary: '',
        pacing: '',
        perspective: '',
        sample_text: '',
        rules: [''],
      });
    } catch (err) {
      console.error('Failed to save style:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this style?')) return;
    try {
      await fetch('/api/styles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchStyles();
    } catch (err) {
      console.error('Failed to delete style:', err);
    }
  };

  const loadProceduralTemplate = () => {
    setFormData({
      ...DEFAULT_PROCEDURAL_STYLE,
      rules: [...DEFAULT_PROCEDURAL_STYLE.rules],
    });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const removeRule = (index: number) => {
    setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) });
  };

  const testStyle = async (type: string) => {
    setIsTesting(type);
    incrementUsage();
    
    // Simulate AI generation
    setTimeout(() => {
      const responses: Record<string, string> = {
        action: 'The security door engaged. Lockdown protocol initiated. He checked his watch: thirty seconds until the next patrol. Corridor B-7 remained unguarded according to the duty roster. He moved.',
        romantic: 'They stood in the observation room. The city lights flickered below. She checked her credentials. Valid. He checked his. Also valid. Their hands touched the same console. No protocol existed for this.',
        reveal: 'The file downloaded. Classification: RESTRICTED. He scrolled. Subject: PROJECT HYDRA. Status: TERMINATED. Date of termination matched his birth date. System error, he thought. System errors do not match dates.',
        emotional: 'The notification appeared. TERMINATION EFFECTIVE IMMEDIATELY. He read it three times. The words remained static. His access card still functioned. For now. He gathered his personal effects. Three items. Regulations permitted five.',
      };
      setTestResults({ ...testResults, [type]: responses[type] });
      setIsTesting(null);
    }, 1500);
  };

  const exportStyles = () => {
    const dataStr = JSON.stringify(writingStyles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'hydraskript-styles.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Style Studio</h1>
            <p className="text-gray-400">Train AI on your writing style or reference authors</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportStyles}
              className="flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>New Style</span>
            </button>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {(isCreating || editingStyle) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#2a2a2a] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingStyle ? 'Edit Style' : 'Create New Style'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingStyle(null);
                    }}
                    className="p-2 hover:bg-white/5 rounded-lg"
                  >
                    ×
                  </button>
                </div>

                {!editingStyle && (
                  <button
                    onClick={loadProceduralTemplate}
                    className="w-full mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    Load Procedural Style Template (Kafka/Dick style)
                  </button>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Style Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                      placeholder="e.g., My Prose Style"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg h-20 resize-none"
                      placeholder="Describe this style..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Author Reference</label>
                      <input
                        type="text"
                        value={formData.author_reference}
                        onChange={(e) => setFormData({ ...formData, author_reference: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., Hemingway, King"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tone</label>
                      <input
                        type="text"
                        value={formData.tone}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., Dark, Humorous"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sentence Length</label>
                      <input
                        type="text"
                        value={formData.sentence_length}
                        onChange={(e) => setFormData({ ...formData, sentence_length: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., Short and punchy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Vocabulary</label>
                      <input
                        type="text"
                        value={formData.vocabulary}
                        onChange={(e) => setFormData({ ...formData, vocabulary: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., Simple, Technical"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Pacing</label>
                      <input
                        type="text"
                        value={formData.pacing}
                        onChange={(e) => setFormData({ ...formData, pacing: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., Fast, Deliberate"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Perspective</label>
                      <input
                        type="text"
                        value={formData.perspective}
                        onChange={(e) => setFormData({ ...formData, perspective: e.target.value })}
                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg"
                        placeholder="e.g., First person"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Sample Text</label>
                    <textarea
                      value={formData.sample_text}
                      onChange={(e) => setFormData({ ...formData, sample_text: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg h-32 resize-none font-serif"
                      placeholder="Paste a sample of your writing..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Style Rules</label>
                      <button onClick={addRule} className="text-sm text-cyan-400 hover:text-cyan-300">
                        + Add Rule
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={rule}
                            onChange={(e) => updateRule(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                            placeholder="e.g., No adverbs"
                          />
                          <button
                            onClick={() => removeRule(index)}
                            className="px-2 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingStyle(null);
                    }}
                    className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {editingStyle ? 'Update Style' : 'Create Style'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Styles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {writingStyles.map((style: WritingStyle, index: number) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{style.name}</h3>
                  <p className="text-sm text-gray-500">{style.author_reference}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setEditingStyle(style);
                      setFormData({
                        name: style.name,
                        description: style.description || '',
                        author_reference: style.author_reference || '',
                        tone: style.tone || '',
                        sentence_length: style.sentence_length || '',
                        vocabulary: style.vocabulary || '',
                        pacing: style.pacing || '',
                        perspective: style.perspective || '',
                        sample_text: style.sample_text || '',
                        rules: style.rules || [''],
                      });
                    }}
                    className="p-1.5 hover:bg-white/5 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(style.id)}
                    className="p-1.5 hover:bg-white/5 rounded text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Tone:</span>
                  <span>{style.tone || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Pacing:</span>
                  <span>{style.pacing || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Rules:</span>
                  <span>{(style.rules || []).length} defined</span>
                </div>
              </div>

              {style.sample_text && (
                <div className="mt-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-sm text-gray-400 italic line-clamp-3 font-serif">
                    "{style.sample_text}"
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Test Generator */}
        {writingStyles.length > 0 && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
            <h2 className="text-xl font-semibold mb-4">Style Test Generator</h2>
            <p className="text-gray-400 mb-4">Test your styles with different scene types</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {Object.entries(TEST_PROMPTS).map(([type, prompt]) => (
                <button
                  key={type}
                  onClick={() => testStyle(type)}
                  disabled={isTesting === type}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors capitalize disabled:opacity-50"
                >
                  {isTesting === type ? 'Generating...' : type}
                </button>
              ))}
            </div>

            {Object.entries(testResults).map(([type, result]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-black/30 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-medium capitalize">{type} Scene</span>
                </div>
                <p className="text-gray-300 font-serif">{result}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}