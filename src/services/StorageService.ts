import {
  Bookmark,
  Highlight,
  HighlightColor,
  ReadingHistoryItem,
  ReadingSettings,
} from '../types/bible';

const STORAGE_KEYS = {
  BOOKMARKS: 'alunea_bookmarks',
  HIGHLIGHTS: 'alunea_highlights',
  HISTORY: 'alunea_history',
  SETTINGS: 'alunea_settings',
} as const;

export const DEFAULT_SETTINGS: ReadingSettings = {
  theme: 'system',
  defaultTranslation: 'tb',
  fontSize: 18,
  lineHeight: 1.7,
  fontFamily: 'sans',
  layoutMode: 'verse-by-verse',
  showVerseNumbers: true,
};

export class StorageService {
  // --- Bookmarks ---
  static getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const bookmarks = this.getBookmarks();
    const id = `${bookmark.translation}_${bookmark.bookId}_${bookmark.chapter}_${bookmark.verse}`;
    
    // Check if exists
    const existingIndex = bookmarks.findIndex((b) => b.id === id);
    const newBookmark: Bookmark = {
      ...bookmark,
      id,
      createdAt: Date.now(),
    };

    if (existingIndex >= 0) {
      bookmarks[existingIndex] = newBookmark;
    } else {
      bookmarks.unshift(newBookmark);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmark to storage', e);
    }

    return newBookmark;
  }

  static removeBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to remove bookmark from storage', e);
    }
  }

  static isBookmarked(translation: string, bookId: string, chapter: number, verse: number): boolean {
    const id = `${translation}_${bookId}_${chapter}_${verse}`;
    return this.getBookmarks().some((b) => b.id === id);
  }

  // --- Highlights ---
  static getHighlights(): Highlight[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setHighlight(
    highlight: Omit<Highlight, 'id' | 'createdAt'>
  ): Highlight {
    const highlights = this.getHighlights();
    const id = `${highlight.translation}_${highlight.bookId}_${highlight.chapter}_${highlight.verse}`;

    const existingIndex = highlights.findIndex((h) => h.id === id);
    const newHighlight: Highlight = {
      ...highlight,
      id,
      createdAt: Date.now(),
    };

    if (existingIndex >= 0) {
      highlights[existingIndex] = newHighlight;
    } else {
      highlights.unshift(newHighlight);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (e) {
      console.error('Failed to save highlight to storage', e);
    }

    return newHighlight;
  }

  static removeHighlight(translation: string, bookId: string, chapter: number, verse: number): void {
    const id = `${translation}_${bookId}_${chapter}_${verse}`;
    const highlights = this.getHighlights().filter((h) => h.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (e) {
      console.error('Failed to remove highlight from storage', e);
    }
  }

  static getHighlightForVerse(
    translation: string,
    bookId: string,
    chapter: number,
    verse: number
  ): HighlightColor | null {
    const id = `${translation}_${bookId}_${chapter}_${verse}`;
    const found = this.getHighlights().find((h) => h.id === id);
    return found ? found.color : null;
  }

  // --- Reading History ---
  static getHistory(): ReadingHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addHistory(
    item: Omit<ReadingHistoryItem, 'id' | 'timestamp'>
  ): ReadingHistoryItem {
    let history = this.getHistory();
    // Unique key per translation/book/chapter
    const id = `${item.translation}_${item.bookId}_${item.chapter}`;

    // Remove old entry for same chapter if present
    history = history.filter((h) => h.id !== id);

    const newItem: ReadingHistoryItem = {
      ...item,
      id,
      timestamp: Date.now(),
    };

    history.unshift(newItem);
    // Keep last 50 entries
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to storage', e);
    }

    return newItem;
  }

  static getLastRead(): ReadingHistoryItem | null {
    const history = this.getHistory();
    return history.length > 0 ? history[0] : null;
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }

  // --- Settings ---
  static getSettings(): ReadingSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: Partial<ReadingSettings>): ReadingSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings to storage', e);
    }
    return updated;
  }

  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
      localStorage.removeItem(STORAGE_KEYS.HIGHLIGHTS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear user data', e);
    }
  }
}
