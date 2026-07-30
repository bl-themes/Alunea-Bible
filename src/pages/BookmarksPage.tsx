import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Highlighter,
  Trash2,
  ChevronRight,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { Bookmark as BookmarkType, Highlight as HighlightType } from '../types/bible';
import { formatBookName } from '../utils/bibleUtils';
import { motion } from 'motion/react';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    bookmarks,
    removeBookmark,
    highlights,
    removeHighlight,
    navigateTo,
    books,
  } = useBible();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const sortedBookmarks = [...bookmarks].sort((a, b) =>
    sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );

  const sortedHighlights = [...highlights].sort((a, b) =>
    sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );

  const handleJumpToVerse = (
    translation: string,
    bookId: string,
    chapter: number,
    verse: number
  ) => {
    navigateTo(translation, bookId, chapter, verse);
    navigate('/reader');
  };

  const getHighlightColorBadge = (color: string) => {
    let colorName = 'Kuning';
    if (color === 'green') colorName = 'Hijau';
    if (color === 'blue') colorName = 'Biru';
    if (color === 'purple') colorName = 'Ungu';
    if (color === 'red') colorName = 'Merah';

    switch (color) {
      case 'yellow':
        return { style: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-300', name: colorName };
      case 'green':
        return { style: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300', name: colorName };
      case 'blue':
        return { style: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300', name: colorName };
      case 'purple':
        return { style: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-300', name: colorName };
      case 'red':
        return { style: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border-rose-300', name: colorName };
      default:
        return { style: 'bg-[#EFEEE8] text-[#1A1A1A]', name: colorName };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
            Penanda & Sorotan
          </h1>
          <p className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">
            Akses ayat yang ditandai dan perikop yang disorot
          </p>
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
          }
          className="neu-button px-4 py-2.5 rounded-2xl text-xs font-bold text-[#1E293B] dark:text-zinc-200 flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowUpDown size={15} />
          <span>Urutkan: {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="neu-inset p-1.5 rounded-2xl flex items-center gap-2">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'bookmarks'
              ? 'neu-flat text-red-600 dark:text-red-400'
              : 'text-[#64748B] dark:text-zinc-400 hover:text-[#1E293B]'
          }`}
        >
          <Bookmark size={16} />
          <span>Penanda ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'highlights'
              ? 'neu-flat text-red-600 dark:text-red-400'
              : 'text-[#64748B] dark:text-zinc-400 hover:text-[#1E293B]'
          }`}
        >
          <Highlighter size={16} />
          <span>Sorotan ({highlights.length})</span>
        </button>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {sortedBookmarks.length === 0 ? (
            <div className="py-16 text-center space-y-2 neu-flat rounded-3xl p-6">
              <Bookmark size={36} className="mx-auto text-[#64748B] dark:text-zinc-600" />
              <p className="text-sm font-extrabold text-[#1E293B] dark:text-zinc-300">
                Belum ada penanda tersimpan
              </p>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 max-w-xs mx-auto font-medium">
                Saat membaca pasal Alkitab, ketuk pada ayat untuk menandainya agar mudah diakses di sini.
              </p>
            </div>
          ) : (
            sortedBookmarks.map((bm) => (
              <motion.div
                key={bm.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl neu-flat space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold text-red-600 dark:text-red-400">
                      {formatBookName(bm.bookName || bm.bookId, books)} {bm.chapter}:{bm.verse}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg neu-inset-sm text-[#64748B]">
                      {bm.translation}
                    </span>
                  </div>

                  <button
                    onClick={() => removeBookmark(bm.id)}
                    className="p-2 rounded-xl neu-button text-[#64748B] hover:text-rose-600 transition-colors"
                    title="Hapus penanda"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-sm text-[#1E293B] dark:text-zinc-200 font-medium leading-relaxed">
                  "{bm.text}"
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() =>
                      handleJumpToVerse(bm.translation, bm.bookId, bm.chapter, bm.verse)
                    }
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span>Baca di Alkitab</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Highlights Tab Content */}
      {activeTab === 'highlights' && (
        <div className="space-y-4">
          {sortedHighlights.length === 0 ? (
            <div className="py-16 text-center space-y-2 neu-flat rounded-3xl p-6">
              <Highlighter size={36} className="mx-auto text-[#64748B] dark:text-zinc-600" />
              <p className="text-sm font-extrabold text-[#1E293B] dark:text-zinc-300">
                Belum ada sorotan ayat
              </p>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 max-w-xs mx-auto font-medium">
                Pilih ayat di pembaca Alkitab dan tentukan warna sorotan untuk menandai ayat penting.
              </p>
            </div>
          ) : (
            sortedHighlights.map((hl) => {
              const badge = getHighlightColorBadge(hl.color);
              return (
                <motion.div
                  key={hl.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl neu-flat space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-red-600 dark:text-red-400">
                        {formatBookName(hl.bookName || hl.bookId, books)} {hl.chapter}:{hl.verse}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${badge.style}`}
                      >
                        {badge.name}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        removeHighlight(hl.bookId, hl.chapter, hl.verse)
                      }
                      className="p-2 rounded-xl neu-button text-[#64748B] hover:text-rose-600 transition-colors"
                      title="Hapus sorotan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-[#1E293B] dark:text-zinc-200 font-medium leading-relaxed">
                    "{hl.text}"
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() =>
                        handleJumpToVerse(hl.translation, hl.bookId, hl.chapter, hl.verse)
                      }
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <span>Baca di Alkitab</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
