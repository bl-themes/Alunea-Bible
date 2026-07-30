import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Share2,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { HighlightColor, VerseReference } from '../types/bible';
import { useBible } from '../contexts/BibleContext';
import { formatBookName } from '../utils/bibleUtils';

interface VerseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  verseRef: VerseReference | null;
  onOpenShare: (verseRef: VerseReference) => void;
}

const HIGHLIGHT_COLORS: { id: HighlightColor; bgClass: string; label: string }[] = [
  { id: 'yellow', bgClass: 'bg-yellow-300 dark:bg-yellow-500/80', label: 'Kuning' },
  { id: 'green', bgClass: 'bg-emerald-300 dark:bg-emerald-500/80', label: 'Hijau' },
  { id: 'blue', bgClass: 'bg-sky-300 dark:bg-sky-500/80', label: 'Biru' },
  { id: 'purple', bgClass: 'bg-purple-300 dark:bg-purple-500/80', label: 'Ungu' },
  { id: 'red', bgClass: 'bg-rose-300 dark:bg-rose-500/80', label: 'Merah' },
];

export const VerseBottomSheet: React.FC<VerseBottomSheetProps> = ({
  isOpen,
  onClose,
  verseRef,
  onOpenShare,
}) => {
  const {
    addBookmark,
    removeBookmark,
    isBookmarked,
    setHighlight,
    removeHighlight,
    getHighlightForVerse,
    bookmarks,
    books,
  } = useBible();

  const [copied, setCopied] = React.useState(false);

  if (!verseRef) return null;

  const cleanBookName = formatBookName(verseRef.bookName || verseRef.bookId, books);

  const bookmarked = isBookmarked(
    verseRef.bookId,
    verseRef.chapter,
    verseRef.verse
  );

  const activeHighlight = getHighlightForVerse(
    verseRef.bookId,
    verseRef.chapter,
    verseRef.verse
  );

  const handleToggleBookmark = () => {
    if (bookmarked) {
      // Find ID to remove
      const found = bookmarks.find(
        (b) =>
          b.bookId === verseRef.bookId &&
          b.chapter === verseRef.chapter &&
          b.verse === verseRef.verse
      );
      if (found) removeBookmark(found.id);
    } else {
      addBookmark(
        verseRef.bookId,
        verseRef.bookName,
        verseRef.chapter,
        verseRef.verse,
        verseRef.text
      );
    }
  };

  const handleSelectHighlight = (color: HighlightColor) => {
    if (activeHighlight === color) {
      removeHighlight(verseRef.bookId, verseRef.chapter, verseRef.verse);
    } else {
      setHighlight(
        verseRef.bookId,
        verseRef.bookName,
        verseRef.chapter,
        verseRef.verse,
        verseRef.text,
        color
      );
    }
  };

  const handleCopy = async () => {
    const formatted = `"${verseRef.text}"\n— ${cleanBookName} ${verseRef.chapter}:${verseRef.verse} (${verseRef.translation.toUpperCase()})`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#EEF2F6] dark:bg-[#181A1F] rounded-t-[32px] p-6 safe-pb max-w-xl mx-auto neu-flat border-t border-transparent shadow-2xl"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 neu-inset rounded-full mx-auto mb-5" />

            {/* Verse Reference Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-extrabold tracking-wider uppercase text-red-600 dark:text-red-400">
                  {verseRef.translation.toUpperCase()}
                </span>
                <h3 className="text-xl font-extrabold text-[#1E293B] dark:text-zinc-100">
                  {cleanBookName} {verseRef.chapter}:{verseRef.verse}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl neu-button text-[#64748B]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Verse Snippet */}
            <div className="p-4 neu-inset rounded-2xl mb-6 text-sm leading-relaxed text-[#1E293B] dark:text-zinc-200 italic font-medium max-h-32 overflow-y-auto">
              "{verseRef.text}"
            </div>

            {/* Highlights Color Bar */}
            <div className="mb-6">
              <label className="text-xs font-extrabold uppercase text-[#64748B] dark:text-zinc-400 tracking-wider mb-3 block">
                Warna Sorotan
              </label>
              <div className="flex items-center gap-3">
                {HIGHLIGHT_COLORS.map((c) => {
                  const isSelected = activeHighlight === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectHighlight(c.id)}
                      className={`relative w-10 h-10 rounded-2xl ${c.bgClass} flex items-center justify-center transition-transform active:scale-95 shadow-md`}
                      title={c.label}
                    >
                      {isSelected && (
                        <Check size={18} className="text-zinc-900 font-bold" />
                      )}
                    </button>
                  );
                })}
                {activeHighlight && (
                  <button
                    onClick={() =>
                      removeHighlight(
                        verseRef.bookId,
                        verseRef.chapter,
                        verseRef.verse
                      )
                    }
                    className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline ml-auto"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-3 gap-3.5">
              {/* Bookmark Toggle */}
              <button
                onClick={handleToggleBookmark}
                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl transition-all ${
                  bookmarked
                    ? 'neu-flat text-red-600 dark:text-red-400 font-extrabold'
                    : 'neu-button text-[#1E293B] dark:text-zinc-300'
                }`}
              >
                {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                <span className="text-xs font-bold">
                  {bookmarked ? 'Tersimpan' : 'Tandai'}
                </span>
              </button>

              {/* Copy Verse */}
              <button
                onClick={handleCopy}
                className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl neu-button text-[#1E293B] dark:text-zinc-300 font-bold"
              >
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                <span className="text-xs font-bold">{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>

              {/* Share Verse */}
              <button
                onClick={() => {
                  onClose();
                  onOpenShare(verseRef);
                }}
                className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl neu-button-primary"
              >
                <Share2 size={20} />
                <span className="text-xs font-bold">Bagikan</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
