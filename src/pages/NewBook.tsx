import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Users, MapPin, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useStore } from '../lib/store';

const steps = [
  { id: 1, title: 'Project Details', icon: BookOpen },
  { id: 2, title: 'Story Bible', icon: Sparkles },
  { id: 3, title: 'Review', icon: Check },
];

const genres = [
  'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance',
  'Horror', 'Historical Fiction', 'Literary Fiction', 'Young Adult', 'Non-Fiction',
  'Biography', 'Self-Help', 'Business', 'Technology', 'Education',
];

const tones = [
  'Formal', 'Casual', 'Dark', 'Humorous', 'Inspirational', 'Mysterious',
  'Romantic', 'Suspenseful', 'Whimsical', 'Grim', 'Hopeful', 'Cynical',
];

const targetLengths = [90, 120, 150, 200, 300];

export function NewBook() {
  const navigate = useNavigate();
  const { incrementUsage } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    tone: '',
    target_length: 150,
    description: '',
    characters: [{ name: '', description: '', role: 'protagonist' }],
    settings: [{ name: '', description: '' }],
    themes: [''],
    raw_idea: '',
    voice_notes: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'characters' | 'settings', index: number, key: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[field] as any[];
      return {
        ...prev,
        [field]: arr.map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        ),
      };
    });
  };

  const addArrayItem = (field: 'characters' | 'settings' | 'themes', defaultItem: any) => {
    setFormData((prev) => {
      const arr = prev[field] as any[];
      return {
        ...prev,
        [field]: [...arr, defaultItem],
      };
    });
  };

  const removeArrayItem = (field: 'characters' | 'settings' | 'themes', index: number) => {
    setFormData((prev) => {
      const arr = prev[field] as any[];
      return {
        ...prev,
        [field]: arr.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create book
      const bookRes = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          genre: formData.genre,
          tone: formData.tone,
          target_length: formData.target_length,
          description: formData.description,
        }),
      });
      const book = await bookRes.json();

      // Create story bible
      await fetch('/api/story-bibles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: book.id,
          characters: formData.characters.filter(c => c.name),
          settings: formData.settings.filter(s => s.name),
          themes: formData.themes.filter(t => t),
          raw_idea: formData.raw_idea,
          voice_notes: formData.voice_notes,
        }),
      });

      incrementUsage();
      navigate(`/books/${book.id}`);
    } catch (err) {
      console.error('Failed to create book:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.title && formData.genre && formData.tone;
    }
    return true;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/books')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Create New Book</h1>
            <p className="text-gray-400 text-sm">Set up your writing project</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                    : 'border-white/20 text-gray-500'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm hidden sm:block ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-purple-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
                <h2 className="text-xl font-semibold mb-6">Project Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Book Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter your book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                      placeholder="Brief description of your book..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Genre *</label>
                      <select
                        value={formData.genre}
                        onChange={(e) => handleInputChange('genre', e.target.value)}
                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">Select genre</option>
                        {genres.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Tone *</label>
                      <select
                        value={formData.tone}
                        onChange={(e) => handleInputChange('tone', e.target.value)}
                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">Select tone</option>
                        {tones.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Target Length</label>
                    <div className="grid grid-cols-5 gap-2">
                      {targetLengths.map((length) => (
                        <button
                          key={length}
                          onClick={() => handleInputChange('target_length', length)}
                          className={`px-4 py-3 rounded-lg border transition-colors ${
                            formData.target_length === length
                              ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          {length}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Target pages (estimated)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
                <h2 className="text-xl font-semibold mb-6">Story Bible</h2>
                
                {/* Characters */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Characters</label>
                    <button
                      onClick={() => addArrayItem('characters', { name: '', description: '', role: 'supporting' })}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      + Add Character
                    </button>
                  </div>
                  {formData.characters.map((char, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => handleArrayChange('characters', index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={char.description}
                        onChange={(e) => handleArrayChange('characters', index, 'description', e.target.value)}
                        className="flex-[2] px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                        placeholder="Brief description"
                      />
                      <select
                        value={char.role}
                        onChange={(e) => handleArrayChange('characters', index, 'role', e.target.value)}
                        className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                      >
                        <option value="protagonist">Protagonist</option>
                        <option value="antagonist">Antagonist</option>
                        <option value="supporting">Supporting</option>
                      </select>
                      {formData.characters.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('characters', index)}
                          className="px-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Settings */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Settings</label>
                    <button
                      onClick={() => addArrayItem('settings', { name: '', description: '' })}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      + Add Setting
                    </button>
                  </div>
                  {formData.settings.map((setting, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={setting.name}
                        onChange={(e) => handleArrayChange('settings', index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                        placeholder="Location name"
                      />
                      <input
                        type="text"
                        value={setting.description}
                        onChange={(e) => handleArrayChange('settings', index, 'description', e.target.value)}
                        className="flex-[2] px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                        placeholder="Description"
                      />
                      {formData.settings.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('settings', index)}
                          className="px-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Themes */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Themes</label>
                    <button
                      onClick={() => addArrayItem('themes', '')}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      + Add Theme
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.themes.map((theme, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={theme}
                          onChange={(e) => {
                            const newThemes = [...formData.themes];
                            newThemes[index] = e.target.value;
                            setFormData((prev) => ({ ...prev, themes: newThemes }));
                          }}
                          className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm w-32"
                          placeholder="Theme"
                        />
                        {formData.themes.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('themes', index)}
                            className="ml-1 px-2 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw Idea */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Raw Idea / Synopsis</label>
                  <textarea
                    value={formData.raw_idea}
                    onChange={(e) => handleInputChange('raw_idea', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                    placeholder="Describe your story idea, plot points, or anything else..."
                  />
                </div>

                {/* Voice Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Voice Notes</label>
                  <textarea
                    value={formData.voice_notes}
                    onChange={(e) => handleInputChange('voice_notes', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                    placeholder="Specific writing instructions, phrases to use, or avoid..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5">
                <h2 className="text-xl font-semibold mb-6">Review & Create</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Title</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Genre</span>
                    <span className="font-medium">{formData.genre}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Tone</span>
                    <span className="font-medium">{formData.tone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Target Length</span>
                    <span className="font-medium">{formData.target_length} pages</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Characters</span>
                    <span className="font-medium">{formData.characters.filter(c => c.name).length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Settings</span>
                    <span className="font-medium">{formData.settings.filter(s => s.name).length}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-300">
                    Creating this book will use 1 AI generation from your daily limit.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-white/20 rounded-lg font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create Book'}</span>
              {!isSubmitting && <Check className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}