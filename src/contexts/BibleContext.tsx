import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  Book,
  Bookmark,
  Highlight,
  HighlightColor,
  ReadingHistoryItem,
  ReadingSettings,
  ThemeMode,
  Translation,
} from '../types/bible';
import { bibleDataService, TRANSLATIONS } from '../services/BibleDataService';
import { StorageService } from '../services/StorageService';
import { formatBookName } from '../utils/bibleUtils';

interface BibleContextType {
  books: Book[];
  isLoadingBooks: boolean;
  translations: Translation[];
  currentTranslation: string;
  setTranslation: (trans: string) => void;
  currentBookId: string;
  currentChapter: number;
  navigateTo: (translation: string, bookId: string, chapter: number, verse?: number) => void;
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookId: string, bookName: string, chapter: number, verse: number, text: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;
  highlights: Highlight[];
  setHighlight: (
    bookId: string,
    bookName: string,
    chapter: number,
    verse: number,
    text: string,
    color: HighlightColor
  ) => void;
  removeHighlight: (bookId: string, chapter: number, verse: number) => void;
  getHighlightForVerse: (bookId: string, chapter: number, verse: number) => HighlightColor | null;
  history: ReadingHistoryItem[];
  lastRead: ReadingHistoryItem | null;
  clearHistory: () => void;
  clearAllUserData: () => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => StorageService.getSettings());
  const [currentTranslation, setCurrentTranslation] = useState<string>(settings.defaultTranslation || 'tb');
  const [currentBookId, setCurrentBookId] = useState<string>('kejadian');
  const [currentChapter, setCurrentChapter] = useState<number>(1);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.getBookmarks());
  const [highlights, setHighlights] = useState<Highlight[]>(() => StorageService.getHighlights());
  const [history, setHistory] = useState<ReadingHistoryItem[]>(() => StorageService.getHistory());

  const lastRead = history.length > 0 ? history[0] : null;

  // Sync theme with DOM document
  const applyThemeToDOM = useCallback((themeMode: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia');

    let effectiveTheme = themeMode;
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else if (effectiveTheme === 'sepia') {
      root.classList.add('sepia');
    }
  }, []);

  useEffect(() => {
    applyThemeToDOM(settings.theme);
  }, [settings.theme, applyThemeToDOM]);

  // Load books metadata on launch
  useEffect(() => {
    let isMounted = true;
    async function loadBooks() {
      setIsLoadingBooks(true);
      const bList = await bibleDataService.getBooks();
      if (isMounted) {
        setBooks(bList);
        setIsLoadingBooks(false);
      }
    }
    loadBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync current reader state from last read on initial mount if available
  useEffect(() => {
    const lr = StorageService.getLastRead();
    if (lr) {
      if (lr.translation) setCurrentTranslation(lr.translation);
      if (lr.bookId) setCurrentBookId(lr.bookId);
      if (lr.chapter) setCurrentChapter(lr.chapter);
    }
  }, []);

  const navigateTo = useCallback(
    (translation: string, bookId: string, chapter: number, verse?: number) => {
      const trans = translation || currentTranslation;
      setCurrentTranslation(trans);
      setCurrentBookId(bookId);
      setCurrentChapter(chapter);

      // Save to reading history
      const bookName = formatBookName(bookId, books);

      const newHistoryItem = StorageService.addHistory({
        translation: trans,
        bookId,
        bookName,
        chapter,
        verse,
      });

      setHistory(StorageService.getHistory());
    },
    [currentTranslation, books]
  );

  const updateSettings = useCallback((newPartial: Partial<ReadingSettings>) => {
    const updated = StorageService.saveSettings(newPartial);
    setSettings(updated);
    if (newPartial.defaultTranslation) {
      setCurrentTranslation(newPartial.defaultTranslation);
    }
  }, []);

  const setTheme = useCallback((themeMode: ThemeMode) => {
    updateSettings({ theme: themeMode });
  }, [updateSettings]);

  const setTranslation = useCallback((trans: string) => {
    setCurrentTranslation(trans);
    updateSettings({ defaultTranslation: trans });
  }, [updateSettings]);

  // Bookmarks handlers
  const addBookmark = useCallback(
    (bookId: string, bookName: string, chapter: number, verse: number, text: string) => {
      const cleanBookName = formatBookName(bookName || bookId, books);
      StorageService.addBookmark({
        translation: currentTranslation,
        bookId,
        bookName: cleanBookName,
        chapter,
        verse,
        text,
      });
      setBookmarks(StorageService.getBookmarks());
    },
    [currentTranslation, books]
  );

  const removeBookmark = useCallback((id: string) => {
    StorageService.removeBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  }, []);

  const isBookmarked = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      return StorageService.isBookmarked(currentTranslation, bookId, chapter, verse);
    },
    [currentTranslation]
  );

  // Highlights handlers
  const setHighlight = useCallback(
    (
      bookId: string,
      bookName: string,
      chapter: number,
      verse: number,
      text: string,
      color: HighlightColor
    ) => {
      const cleanBookName = formatBookName(bookName || bookId, books);
      StorageService.setHighlight({
        translation: currentTranslation,
        bookId,
        bookName: cleanBookName,
        chapter,
        verse,
        text,
        color,
      });
      setHighlights(StorageService.getHighlights());
    },
    [currentTranslation, books]
  );

  const removeHighlight = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      StorageService.removeHighlight(currentTranslation, bookId, chapter, verse);
      setHighlights(StorageService.getHighlights());
    },
    [currentTranslation]
  );

  const getHighlightForVerse = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      return StorageService.getHighlightForVerse(currentTranslation, bookId, chapter, verse);
    },
    [currentTranslation]
  );

  const clearHistory = useCallback(() => {
    StorageService.clearHistory();
    setHistory([]);
  }, []);

  const clearAllUserData = useCallback(() => {
    StorageService.clearAllData();
    setBookmarks([]);
    setHighlights([]);
    setHistory([]);
  }, []);

  return (
    <BibleContext.Provider
      value={{
        books,
        isLoadingBooks,
        translations: TRANSLATIONS,
        currentTranslation,
        setTranslation,
        currentBookId,
        currentChapter,
        navigateTo,
        settings,
        updateSettings,
        theme: settings.theme,
        setTheme,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        highlights,
        setHighlight,
        removeHighlight,
        getHighlightForVerse,
        history,
        lastRead,
        clearHistory,
        clearAllUserData,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
