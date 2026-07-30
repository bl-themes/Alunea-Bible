import {
  Book,
  BookContent,
  BookGroup,
  Chapter,
  SearchResult,
  Translation,
  Verse,
} from '../types/bible';

export const TRANSLATIONS: Translation[] = [
  { id: 'tb', name: 'Terjemahan Baru', language: 'Indonesian', shortName: 'TB' },
  { id: 'tm', name: 'Terjemahan Lama', language: 'Indonesian', shortName: 'TM' },
];

interface RawBookItem {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  testament: 'OT' | 'NT';
  chapters: number;
  file: string;
}

interface RawBookJson {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  testament: string;
  chapters: Record<string, Record<string, string>>;
}

const LEGACY_CODE_TO_INDEX: Record<string, number> = {
  GEN: 1, EXO: 2, LEV: 3, NUM: 4, DEU: 5,
  JOS: 6, JOSH: 6, JDG: 7, JUDG: 7, RUT: 8, RUTH: 8,
  '1SAM': 9, '2SAM': 10, '1KGS': 11, '2KGS': 12, '1CHR': 13, '2CHR': 14,
  EZR: 15, EZRA: 15, NEH: 16, EST: 17, AYB: 18, JOB: 18,
  MZM: 19, PSA: 19, PS: 19, AMS: 20, PROV: 20, PKH: 21, ECC: 21,
  KID: 22, SNG: 22, SONG: 22, YES: 23, ISA: 23, YER: 24, JER: 24,
  RAT: 25, LAM: 25, YEH: 26, EZEK: 26, DAN: 27, HOS: 28,
  YL: 29, JOEL: 29, AM: 30, AMOS: 30, OB: 31, OBAD: 31,
  YUN: 32, JON: 32, MI: 33, MIC: 33, NAH: 34, HAB: 35,
  ZEF: 36, ZEPH: 36, HAG: 37, ZA: 38, ZECH: 38, MAL: 39,
  MAT: 40, MATT: 40, MRK: 41, MARK: 41, LUK: 42, LUKE: 42,
  YOH: 43, JOHN: 43, KIS: 44, ACTS: 44, RM: 45, ROM: 45,
  '1KOR': 46, '1COR': 46, '2KOR': 47, '2COR': 47, GAL: 48, EF: 49, EPH: 49,
  FLP: 50, PHIL: 50, KOL: 51, COL: 51, '1TES': 52, '1THESS': 52,
  '2TES': 53, '2THESS': 53, '1TIM': 54, '2TIM': 55, TIT: 56, TITUS: 56,
  FLM: 57, PHILEM: 57, IBR: 58, HEB: 58, YAK: 59, JAS: 59,
  '1PTR': 60, '1PET': 60, '2PTR': 61, '2PET': 61, '1YOH': 62, '1JOHN': 62,
  '2YOH': 63, '2JOHN': 63, '3YOH': 64, '3JOHN': 64, YUD: 65, JUDE: 65,
  WHY: 66, REV: 66,
};

function getBookGroup(id: number, testament: string): BookGroup {
  if (testament === 'OT' || id <= 39) {
    if (id <= 5) return 'Pentateuch';
    if (id <= 17) return 'History';
    if (id <= 22) return 'Poetry';
    return 'Prophets';
  } else {
    if (id <= 43) return 'Gospels';
    if (id === 44) return 'History';
    if (id <= 65) return 'Epistles';
    return 'Revelation';
  }
}

class BibleDataService {
  private booksCache: Book[] | null = null;
  private bookContentCache: Map<string, BookContent> = new Map();

  getTranslations(): Translation[] {
    return TRANSLATIONS;
  }

  /**
   * Loads books metadata list from public/data/bible/books.json
   */
  async getBooks(): Promise<Book[]> {
    if (this.booksCache) {
      return this.booksCache;
    }

    try {
      const response = await fetch('/data/bible/books.json');
      if (!response.ok) {
        throw new Error(`Failed to load books.json (${response.status})`);
      }
      const rawData: RawBookItem[] = await response.json();
      
      const mappedBooks: Book[] = rawData.map((item) => ({
        id: item.slug,
        name: item.name,
        abbreviation: item.short_name || item.name,
        testament: item.testament,
        chaptersCount: item.chapters,
        group: getBookGroup(item.id, item.testament),
        slug: item.slug,
        file: item.file,
      }));

      this.booksCache = mappedBooks;
      return mappedBooks;
    } catch (error) {
      console.error('Error fetching /data/bible/books.json:', error);
      return [];
    }
  }

  /**
   * Retrieves single book metadata by ID, slug, name, or legacy code
   */
  async getBook(bookId: string): Promise<Book | undefined> {
    const books = await this.getBooks();
    if (!bookId) return books[0];

    const q = bookId.trim().toLowerCase();

    // 1. Check slug match
    let found = books.find((b) => b.slug?.toLowerCase() === q);
    if (found) return found;

    // 2. Check id match
    found = books.find((b) => b.id.toLowerCase() === q);
    if (found) return found;

    // 3. Check file match
    found = books.find(
      (b) => b.file?.toLowerCase() === q || b.file?.toLowerCase() === `${q}.json`
    );
    if (found) return found;

    // 4. Check name or abbreviation match
    found = books.find(
      (b) => b.name.toLowerCase() === q || b.abbreviation.toLowerCase() === q
    );
    if (found) return found;

    // 5. Check legacy code mapping
    const numId = LEGACY_CODE_TO_INDEX[bookId.toUpperCase()];
    if (numId && books[numId - 1]) {
      return books[numId - 1];
    }

    // 6. Check numeric index
    const parsedNum = parseInt(bookId, 10);
    if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= books.length) {
      return books[parsedNum - 1];
    }

    return undefined;
  }

  /**
   * Loads full content for a given book & translation from public/data/bible/{tb|tm}/{file}
   */
  async getBookContent(translation: string, bookId: string): Promise<BookContent> {
    const normTrans = translation.toLowerCase() === 'tm' ? 'tm' : 'tb';
    const book = await this.getBook(bookId);

    if (!book) {
      throw new Error(`Kitab "${bookId}" tidak ditemukan dalam daftar kitab.`);
    }

    const cacheKey = `${normTrans}_${book.slug}`;

    if (this.bookContentCache.has(cacheKey)) {
      return this.bookContentCache.get(cacheKey)!;
    }

    const url = `/data/bible/${normTrans}/${book.file}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Gagal memuat data kitab ${book.name} (${normTrans.toUpperCase()}). File ${url} tidak ditemukan.`
      );
    }

    const rawJson: RawBookJson = await response.json();

    const chapters: Chapter[] = Object.entries(rawJson.chapters || {})
      .map(([chapKey, versesObj]) => {
        const chapterNum = parseInt(chapKey, 10);
        const verses: Verse[] = Object.entries(versesObj || {})
          .map(([verseKey, text]) => ({
            verse: parseInt(verseKey, 10),
            text: String(text),
          }))
          .sort((a, b) => a.verse - b.verse);

        return {
          chapter: chapterNum,
          verses,
        };
      })
      .sort((a, b) => a.chapter - b.chapter);

    const content: BookContent = {
      bookId: book.id,
      bookName: book.name,
      translation: normTrans,
      chapters,
    };

    this.bookContentCache.set(cacheKey, content);
    return content;
  }

  /**
   * Retrieves verses for a given chapter
   */
  async getChapter(
    translation: string,
    bookId: string,
    chapterNumber: number
  ): Promise<Chapter | null> {
    try {
      const content = await this.getBookContent(translation, bookId);
      const chapter = content.chapters.find((c) => c.chapter === chapterNumber);
      return chapter || null;
    } catch (e) {
      console.error(`Error loading chapter ${bookId} ${chapterNumber}:`, e);
      return null;
    }
  }

  /**
   * Retrieves a specific verse
   */
  async getVerse(
    translation: string,
    bookId: string,
    chapterNumber: number,
    verseNumber: number
  ): Promise<Verse | null> {
    const chapter = await this.getChapter(translation, bookId, chapterNumber);
    if (!chapter) return null;
    return chapter.verses.find((v) => v.verse === verseNumber) || null;
  }

  /**
   * Search across book metadata and cached verse contents
   */
  async search(query: string, translation: string): Promise<SearchResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const normTrans = translation.toLowerCase() === 'tm' ? 'tm' : 'tb';
    const results: SearchResult[] = [];
    const books = await this.getBooks();

    // 1. Direct book match search
    for (const b of books) {
      if (
        b.name.toLowerCase().includes(trimmed) ||
        b.abbreviation.toLowerCase().includes(trimmed) ||
        (b.slug && b.slug.toLowerCase().includes(trimmed))
      ) {
        results.push({
          bookId: b.id,
          bookName: b.name,
          chapter: 1,
          verse: 1,
          text: `${b.name} (${b.testament} - ${b.chaptersCount} pasal)`,
          translation: normTrans,
        });
      }
    }

    // 2. Search in loaded/cached book contents
    for (const [cacheKey, content] of this.bookContentCache.entries()) {
      if (cacheKey.startsWith(`${normTrans}_`)) {
        for (const ch of content.chapters) {
          for (const v of ch.verses) {
            if (v.text.toLowerCase().includes(trimmed)) {
              const exists = results.some(
                (r) =>
                  r.bookId === content.bookId &&
                  r.chapter === ch.chapter &&
                  r.verse === v.verse
              );
              if (!exists) {
                results.push({
                  bookId: content.bookId,
                  bookName: content.bookName,
                  chapter: ch.chapter,
                  verse: v.verse,
                  text: v.text,
                  translation: normTrans,
                });
              }
            }
          }
        }
      }
    }

    return results.slice(0, 50);
  }

  /**
   * Helper to calculate the next chapter
   */
  async nextChapter(
    translation: string,
    currentBookId: string,
    currentChapter: number
  ): Promise<{ bookId: string; chapter: number } | null> {
    const books = await this.getBooks();
    const currentBook = await this.getBook(currentBookId);
    if (!currentBook) return null;

    const currentIndex = books.findIndex((b) => b.slug === currentBook.slug);
    if (currentIndex === -1) return null;

    if (currentChapter < currentBook.chaptersCount) {
      return { bookId: currentBook.id, chapter: currentChapter + 1 };
    } else if (currentIndex < books.length - 1) {
      const nextBook = books[currentIndex + 1];
      return { bookId: nextBook.id, chapter: 1 };
    }

    return null;
  }

  /**
   * Helper to calculate the previous chapter
   */
  async previousChapter(
    translation: string,
    currentBookId: string,
    currentChapter: number
  ): Promise<{ bookId: string; chapter: number } | null> {
    const books = await this.getBooks();
    const currentBook = await this.getBook(currentBookId);
    if (!currentBook) return null;

    const currentIndex = books.findIndex((b) => b.slug === currentBook.slug);
    if (currentIndex === -1) return null;

    if (currentChapter > 1) {
      return { bookId: currentBook.id, chapter: currentChapter - 1 };
    } else if (currentIndex > 0) {
      const prevBook = books[currentIndex - 1];
      return { bookId: prevBook.id, chapter: prevBook.chaptersCount };
    }

    return null;
  }

  /**
   * Preload a book into memory cache
   */
  async preloadBook(translation: string, bookId: string): Promise<void> {
    try {
      await this.getBookContent(translation, bookId);
    } catch {
      // Silent catch for preloading
    }
  }

  /**
   * Clear in-memory cache
   */
  clearCache(): void {
    this.bookContentCache.clear();
    this.booksCache = null;
  }
}

export const bibleDataService = new BibleDataService();

