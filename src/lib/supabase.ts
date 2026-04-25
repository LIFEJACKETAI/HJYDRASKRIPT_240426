import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: string;
  title: string;
  genre: string;
  target_length: number;
  tone: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  word_count: number;
  user_id: string | null;
  created_at: string;
  chapters?: Chapter[];
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  content: string;
  chapter_number: number;
  summary: string;
  word_count: number;
  status: 'draft' | 'review' | 'completed';
  created_at: string;
  updated_at: string;
};

export type StoryBible = {
  id: string;
  book_id: string;
  characters: any[];
  settings: any[];
  themes: string[];
  voice_notes: string;
  raw_idea: string;
  outline: any;
  created_at: string;
  updated_at: string;
};

export type WritingStyle = {
  id: string;
  name: string;
  description: string;
  author_reference: string;
  tone: string;
  sentence_length: string;
  vocabulary: string;
  pacing: string;
  perspective: string;
  sample_text: string;
  rules: string[];
  user_id: string | null;
  created_at: string;
};

export type Export = {
  id: string;
  book_id: string;
  format: 'pdf' | 'epub' | 'docx' | 'markdown';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url: string;
  file_size: number;
  created_at: string;
};

export type AudiobookJob = {
  id: string;
  book_id: string;
  chapter_id: string;
  voice_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  audio_url: string;
  duration: number;
  created_at: string;
};

export type ConsistencyFlag = {
  id: string;
  book_id: string;
  chapter_id: string;
  flag_type: 'character' | 'timeline' | 'setting' | 'plot';
  description: string;
  original_text: string;
  suggested_fix: string;
  ai_confidence: number;
  status: 'open' | 'fixed' | 'ignored';
  created_at: string;
};