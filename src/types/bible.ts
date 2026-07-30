export type Testament = 'OT' | 'NT';

export type BookGroup =
  | 'Pentateuch'
  | 'History'
  | 'Poetry'
  | 'Prophets'
  | 'Gospels'
  | 'Epistles'
  | 'Revelation';

export interface Book {
  id: string; // e.g., 'GEN', 'kejadian', '1'
  name: string; // e.g., 'Genesis', 'Kejadian'
  abbreviation: string; // e.g., 'Gen', 'Kej'
  testament: Testament;
  chaptersCount: number;
  group: BookGroup;
  slug?: string;
  file?: string;
}

export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface BookContent {
  bookId: string;
  bookName: string;
  translation: string;
  chapters: Chapter[];
}

export interface Translation {
  id: string; // e.g., 'tb', 'kjv', 'web'
  name: string; // e.g., 'Terjemahan Baru', 'King James Version', 'World English Bible'
  language: string; // e.g., 'Indonesian', 'English'
  shortName: string; // e.g., 'TB', 'KJV', 'WEB'
}

export interface VerseReference {
  translation: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Bookmark extends VerseReference {
  id: string;
  createdAt: number;
  note?: string;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'purple' | 'red';

export interface Highlight extends VerseReference {
  id: string;
  color: HighlightColor;
  createdAt: number;
}

export interface ReadingHistoryItem {
  id: string;
  translation: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse?: number;
  scrollPosition?: number;
  timestamp: number;
}

export interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  matches?: string[];
}

export type ThemeMode = 'light' | 'dark' | 'sepia' | 'system';

export type FontFamily = 'sans' | 'serif' | 'mono';

export type LayoutMode = 'verse-by-verse' | 'paragraph';

export interface ReadingSettings {
  theme: ThemeMode;
  defaultTranslation: string;
  fontSize: number; // in px, e.g., 18
  lineHeight: number; // e.g., 1.6
  fontFamily: FontFamily;
  layoutMode: LayoutMode;
  showVerseNumbers: boolean;
}
