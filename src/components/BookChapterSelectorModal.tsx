import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { Book, Testament } from '../types/bible';

interface BookChapterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bookId: string, chapter: number) => void;
}

export const BookChapterSelectorModal: React.FC<BookChapterSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { books, currentBookId, currentChapter } = useBible();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = books.filter((b) => {
    const matchesTestament =
      testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleChapterClick = (chapNumber: number) => {
    if (selectedBook) {
      onSelect(selectedBook.id, chapNumber);
      setSelectedBook(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#EEF2F6] dark:bg-[#181A1F] rounded-[32px] p-6 neu-flat shadow-2xl z-10 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            {selectedBook ? (
              <button
                onClick={() => setSelectedBook(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                <ArrowLeft size={18} />
                Kembali ke Daftar Kitab
              </button>
            ) : (
              <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-zinc-100 flex items-center gap-2">
                <BookOpen size={20} className="text-red-600 dark:text-red-400" />
                Pilih Kitab & Pasal
              </h3>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-2xl neu-button text-[#64748B]"
            >
              <X size={18} />
            </button>
          </div>

          {!selectedBook ? (
            /* STEP 1: Book Selection List */
            <div className="flex-1 flex flex-col min-h-0 pt-2">
              {/* Search Bar (Neumorphic Inset) */}
              <div className="neu-inset rounded-2xl flex items-center px-3.5 py-1 mb-4">
                <Search
                  size={18}
                  className="text-[#64748B] mr-2.5 shrink-0"
                />
                <input
                  type="text"
                  placeholder="Cari nama kitab..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 text-sm font-medium text-[#1E293B] dark:text-white focus:outline-none placeholder-[#94A3B8]"
                />
              </div>

              {/* Testament Tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {(['ALL', 'OT', 'NT'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTestamentFilter(t)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      testamentFilter === t
                        ? 'neu-flat text-red-600 dark:text-red-400'
                        : 'neu-button text-[#64748B]'
                    }`}
                  >
                    {t === 'ALL'
                      ? 'Semua Kitab (66)'
                      : t === 'OT'
                      ? 'Perjanjian Lama'
                      : 'Perjanjian Baru'}
                  </button>
                ))}
              </div>

              {/* Books Grid / List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {filteredBooks.map((book) => {
                  const isCurrent =
                    book.id.toString().toLowerCase() === currentBookId.toLowerCase() ||
                    book.slug.toLowerCase() === currentBookId.toLowerCase() ||
                    book.abbreviation.toLowerCase() === currentBookId.toLowerCase();
                  return (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'neu-flat text-red-600 dark:text-red-400 font-extrabold'
                          : 'neu-button text-[#1E293B] dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl neu-inset text-xs font-extrabold flex items-center justify-center text-red-600 dark:text-red-400 uppercase">
                          {book.abbreviation}
                        </span>
                        <div className="text-left">
                          <span className="text-sm font-bold block">
                            {book.name}
                          </span>
                          <span className="text-xs text-[#64748B] font-medium">
                            {book.chaptersCount} pasal • {book.group}
                          </span>
                        </div>
                      </div>

                      <ChevronRight size={18} className="text-[#64748B]" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* STEP 2: Chapter Selection Grid */
            <div className="flex-1 flex flex-col min-h-0 pt-2">
              <div className="mb-4">
                <span className="text-xs uppercase font-extrabold text-red-600 dark:text-red-400 tracking-wider">
                  {selectedBook.testament === 'OT' ? 'Perjanjian Lama' : 'Perjanjian Baru'} • {selectedBook.group}
                </span>
                <h4 className="text-2xl font-extrabold text-[#1E293B] dark:text-zinc-100 mt-0.5">
                  {selectedBook.name}
                </h4>
                <p className="text-xs text-[#64748B] font-medium">
                  Pilih pasal untuk mulai membaca
                </p>
              </div>

              {/* Chapters Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 sm:grid-cols-6 gap-3 pb-2">
                {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map(
                  (chapNum) => {
                    const isCurrent =
                      selectedBook.id.toUpperCase() === currentBookId.toUpperCase() &&
                      chapNum === currentChapter;

                    return (
                      <button
                        key={chapNum}
                        onClick={() => handleChapterClick(chapNum)}
                        className={`h-12 rounded-2xl font-extrabold text-sm flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'neu-button-primary scale-105'
                            : 'neu-button text-[#1E293B] dark:text-zinc-200'
                        }`}
                      >
                        {chapNum}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
