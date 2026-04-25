import { create } from 'zustand';
import { Book, Chapter, StoryBible, WritingStyle, ConsistencyFlag } from './supabase';

interface AppState {
  user: any | null;
  books: Book[];
  currentBook: Book | null;
  chapters: Chapter[];
  currentChapter: Chapter | null;
  storyBible: StoryBible | null;
  writingStyles: WritingStyle[];
  consistencyFlags: ConsistencyFlag[];
  isLoading: boolean;
  usageCount: number;
  usageLimit: number;
  
  setUser: (user: any | null) => void;
  setBooks: (books: Book[]) => void;
  setCurrentBook: (book: Book | null) => void;
  setChapters: (chapters: Chapter[]) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setStoryBible: (bible: StoryBible | null) => void;
  setWritingStyles: (styles: WritingStyle[]) => void;
  setConsistencyFlags: (flags: ConsistencyFlag[]) => void;
  setIsLoading: (loading: boolean) => void;
  incrementUsage: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  books: [],
  currentBook: null,
  chapters: [],
  currentChapter: null,
  storyBible: null,
  writingStyles: [],
  consistencyFlags: [],
  isLoading: false,
  usageCount: 0,
  usageLimit: 50,
  
  setUser: (user) => set({ user }),
  setBooks: (books) => set({ books }),
  setCurrentBook: (book) => set({ currentBook: book }),
  setChapters: (chapters) => set({ chapters }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setStoryBible: (bible) => set({ storyBible: bible }),
  setWritingStyles: (styles) => set({ writingStyles: styles }),
  setConsistencyFlags: (flags) => set({ consistencyFlags: flags }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
}));