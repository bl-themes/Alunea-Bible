import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Bookmark as BookmarkIcon,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Library,
  Share2,
} from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { Book, Testament } from '../types/bible';
import { formatBookName } from '../utils/bibleUtils';
import { motion } from 'motion/react';

const VERSE_OF_THE_DAY = {
  text: '"Tetapi orang-orang yang menanti-nantikan TUHAN mendapat kekuatan baru: mereka seumpama rajawali yang naik terbang dengan kekuatan sayapnya..."',
  reference: 'Yesaya 40:31',
  translation: 'tb',
  bookId: 'yesaya',
  chapter: 40,
  verse: 31,
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    books,
    isLoadingBooks,
    lastRead,
    history,
    bookmarks,
    highlights,
    translations,
    currentTranslation,
    setTranslation,
    navigateTo,
  } = useBible();

  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleContinueReading = () => {
    if (lastRead) {
      navigateTo(
        lastRead.translation,
        lastRead.bookId,
        lastRead.chapter,
        lastRead.verse
      );
    } else {
      navigateTo(currentTranslation, 'kejadian', 1);
    }
    navigate('/reader');
  };

  const handleBookClick = (book: Book) => {
    navigateTo(currentTranslation, book.id, 1);
    navigate('/reader');
  };

  const handleVOTDClick = () => {
    navigateTo(VERSE_OF_THE_DAY.translation, VERSE_OF_THE_DAY.bookId, VERSE_OF_THE_DAY.chapter, VERSE_OF_THE_DAY.verse);
    navigate('/reader');
  };

  const filteredBooks = books.filter((b) => {
    const matchesTestament =
      testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Quick Search Input Pill (Neumorphic Inset) */}
        <div
          onClick={() => navigate('/search')}
          className="neu-inset flex items-center px-5 py-3 max-w-md w-full cursor-pointer hover:opacity-90 transition-all group"
        >
          <Search size={18} className="text-[#64748B] dark:text-zinc-400 mr-3 group-hover:text-red-600 transition-colors" />
          <span className="text-xs sm:text-sm text-[#64748B] dark:text-zinc-400 font-medium flex-1">
            Cari ayat, kitab, atau topik...
          </span>
          <kbd className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold text-[#64748B] dark:text-zinc-400 neu-flat-sm rounded-lg">
            ⌘K
          </kbd>
        </div>

        {/* Translation Selector Pill (Neumorphic Button) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="neu-flat px-2 py-1 rounded-2xl">
            <select
              value={currentTranslation}
              onChange={(e) => setTranslation(e.target.value)}
              className="px-3 py-2 bg-transparent rounded-xl text-xs font-bold text-[#1E293B] dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              {translations.map((tr) => (
                <option key={tr.id} value={tr.id} className="bg-[#EEF2F6] dark:bg-[#181A1F]">
                  {tr.shortName} ({tr.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Box 1: Hero Continue Reading (Large 8-col span) */}
        <div className="lg:col-span-8 neu-flat p-7 sm:p-9 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} />
              Lanjut Membaca
            </span>
            <span className="text-[#64748B] dark:text-zinc-400 text-xs font-semibold neu-inset-sm px-3 py-1 rounded-full">
              {lastRead ? `Aktif: ${lastRead.translation.toUpperCase()}` : 'Siap membaca'}
            </span>
          </div>

          <div className="space-y-3 mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
              {lastRead ? `${formatBookName(lastRead.bookName || lastRead.bookId, books)} Pasal ${lastRead.chapter}` : 'Kejadian Pasal 1'}
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-[#64748B] dark:text-zinc-300">
              {lastRead
                ? `Melanjutkan bacaan Anda di ${formatBookName(lastRead.bookName || lastRead.bookId, books)} pasal ${lastRead.chapter}.`
                : '1 Pada mulanya Allah menciptakan langit dan bumi. 2 Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya...'}
            </p>
          </div>

          <div>
            <button
              onClick={handleContinueReading}
              className="neu-button-primary px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5"
            >
              <span>{lastRead ? 'Lanjut Membaca' : 'Mulai Membaca'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Box 2: Verse of the Day (Dark Neumorphic Card - 4-col span) */}
        <div className="lg:col-span-4 bg-[#121316] text-white rounded-3xl p-7 flex flex-col justify-between shadow-[8px_8px_20px_rgba(0,0,0,0.15)] min-h-[300px] border border-zinc-800/80 relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Ayat Hari Ini
              </span>
              <Sparkles size={18} className="text-zinc-400" />
            </div>
            <p className="text-lg sm:text-xl font-serif font-medium leading-relaxed italic text-zinc-100">
              {VERSE_OF_THE_DAY.text}
            </p>
            <p className="text-xs text-zinc-400 font-bold tracking-wide">
              — {VERSE_OF_THE_DAY.reference} (TB)
            </p>
          </div>

          <button
            onClick={handleVOTDClick}
            className="w-full mt-6 neu-button-primary py-3 px-5 rounded-2xl text-xs font-bold tracking-wider flex items-center justify-center gap-2"
          >
            <span>Baca Konteks Ayat</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick Stats Grid Row (4 Neumorphic Stat Cards) */}
        <div className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="neu-flat p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 neu-inset rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 font-semibold">Sudah Dibaca</p>
              <p className="text-xl font-extrabold text-[#1E293B] dark:text-white">
                {history.length || 1} <span className="text-xs font-medium text-[#64748B]">Pasal</span>
              </p>
            </div>
          </div>

          <div className="neu-flat p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 neu-inset rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
              <BookmarkIcon size={22} />
            </div>
            <div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 font-semibold">Penanda</p>
              <p className="text-xl font-extrabold text-[#1E293B] dark:text-white">
                {bookmarks.length} <span className="text-xs font-medium text-[#64748B]">Ayat</span>
              </p>
            </div>
          </div>

          <div className="neu-flat p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 neu-inset rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 font-semibold">Sorotan</p>
              <p className="text-xl font-extrabold text-[#1E293B] dark:text-white">
                {highlights.length} <span className="text-xs font-medium text-[#64748B]">Ayat</span>
              </p>
            </div>
          </div>

          <div className="neu-flat p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 neu-inset rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 font-semibold">Riwayat</p>
              <p className="text-xl font-extrabold text-[#1E293B] dark:text-white">
                {history.length} <span className="text-xs font-medium text-[#64748B]">Item</span>
              </p>
            </div>
          </div>
        </div>

        {/* Box 3: Recent Reading History */}
        <div className="lg:col-span-12 neu-flat p-7 rounded-3xl">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[#1E293B] dark:text-white text-base font-extrabold tracking-tight flex items-center gap-2">
              <Clock size={18} className="text-red-600 dark:text-red-400" />
              Riwayat Bacaan Terakhir
            </span>
            <button
              onClick={() => navigate('/bookmarks')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              Lihat Semua Penanda
            </button>
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.translation, item.bookId, item.chapter, item.verse);
                    navigate('/reader');
                  }}
                  className="neu-button p-4 rounded-2xl flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 neu-inset rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 font-extrabold text-xs">
                      {formatBookName(item.bookName || item.bookId, books).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E293B] dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                        {formatBookName(item.bookName || item.bookId, books)} {item.chapter}
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-zinc-400 font-semibold uppercase">
                        Terjemahan: {item.translation.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 neu-inset rounded-xl flex items-center justify-center text-[#64748B] group-hover:text-red-600">
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs font-medium text-[#64748B]">
              Riwayat bacaan Anda akan otomatis muncul di sini.
            </div>
          )}
        </div>
      </div>

      {/* Books Catalog Grid Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
              Perpustakaan Alkitab
            </h2>
            <p className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">
              Jelajahi seluruh 66 kitab Perjanjian Lama dan Perjanjian Baru
            </p>
          </div>

          {/* Filter Pills in Neumorphic Inset container */}
          <div className="neu-inset p-1.5 rounded-2xl flex items-center gap-1 self-start sm:self-auto">
            {(['ALL', 'OT', 'NT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTestamentFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  testamentFilter === t
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'text-[#64748B] dark:text-zinc-400 hover:text-[#1E293B]'
                }`}
              >
                {t === 'ALL' ? 'Semua (66)' : t === 'OT' ? 'Perjanjian Lama' : 'Perjanjian Baru'}
              </button>
            ))}
          </div>
        </div>

        {/* Search input for books (Neumorphic Inset) */}
        <div className="neu-inset px-5 py-3 rounded-2xl flex items-center">
          <Search size={18} className="text-[#64748B] mr-3" />
          <input
            type="text"
            placeholder="Cari kitab berdasarkan nama atau singkatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1E293B] dark:text-zinc-100 focus:outline-none placeholder-[#94A3B8]"
          />
        </div>

        {/* Books Grid */}
        {isLoadingBooks ? (
          <div className="py-12 text-center text-xs font-semibold text-[#64748B]">
            Memuat daftar kitab...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBooks.map((book) => (
              <motion.button
                key={book.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBookClick(book)}
                className="neu-button p-4 rounded-2xl text-left flex flex-col justify-between h-28 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg neu-inset-sm text-[10px] font-extrabold text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors uppercase">
                    {book.abbreviation}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B] dark:text-zinc-400">
                    {book.chaptersCount} ps
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xs text-[#1E293B] dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                    {book.name}
                  </h3>
                  <span className="text-[10px] font-medium text-[#64748B] dark:text-zinc-400">
                    {book.group}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
