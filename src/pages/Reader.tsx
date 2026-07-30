import React, { useEffect, useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Languages,
} from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { bibleDataService } from '../services/BibleDataService';
import { Chapter, VerseReference } from '../types/bible';
import { VerseBottomSheet } from '../components/VerseBottomSheet';
import { formatBookName } from '../utils/bibleUtils';
import { ShareModal } from '../components/ShareModal';
import { ReaderSettingsModal } from '../components/ReaderSettingsModal';
import { BookChapterSelectorModal } from '../components/BookChapterSelectorModal';
import { TranslationSelectorModal } from '../components/TranslationSelectorModal';
import { motion } from 'motion/react';

export const Reader: React.FC = () => {
  const {
    currentTranslation,
    setTranslation,
    currentBookId,
    currentChapter,
    navigateTo,
    settings,
    books,
    getHighlightForVerse,
    isBookmarked,
  } = useBible();

  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [activeVerseRef, setActiveVerseRef] = useState<VerseReference | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [shareVerseRef, setShareVerseRef] = useState<VerseReference | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentBookName = formatBookName(currentBookId, books);

  // Load Chapter Data on translation, book, or chapter change
  useEffect(() => {
    let isMounted = true;
    async function loadChapter() {
      setIsLoading(true);
      const data = await bibleDataService.getChapter(
        currentTranslation,
        currentBookId,
        currentChapter
      );
      if (isMounted) {
        setChapterData(data);
        setIsLoading(false);
        // Scroll to top of reading area smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    loadChapter();

    // Preload next chapter in memory
    bibleDataService.nextChapter(currentTranslation, currentBookId, currentChapter).then((next) => {
      if (next) {
        bibleDataService.preloadBook(currentTranslation, next.bookId);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentTranslation, currentBookId, currentChapter]);

  // Handle Chapter Prev / Next
  const handlePrevChapter = async () => {
    const prev = await bibleDataService.previousChapter(
      currentTranslation,
      currentBookId,
      currentChapter
    );
    if (prev) {
      navigateTo(currentTranslation, prev.bookId, prev.chapter);
    }
  };

  const handleNextChapter = async () => {
    const next = await bibleDataService.nextChapter(
      currentTranslation,
      currentBookId,
      currentChapter
    );
    if (next) {
      navigateTo(currentTranslation, next.bookId, next.chapter);
    }
  };

  const handleVerseClick = (verseNumber: number, verseText: string) => {
    setActiveVerseRef({
      translation: currentTranslation,
      bookId: currentBookId,
      bookName: currentBookName,
      chapter: currentChapter,
      verse: verseNumber,
      text: verseText,
    });
    setIsBottomSheetOpen(true);
  };

  // Font styling mapping based on Settings
  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF2F6] dark:bg-[#181A1F] text-[#1E293B] dark:text-zinc-100">
      {/* Sticky Reader Top Bar */}
      <header className="sticky top-0 z-30 bg-[#EEF2F6]/95 dark:bg-[#181A1F]/95 backdrop-blur-md px-4 py-3 border-b border-transparent">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Translation Button */}
          <button
            onClick={() => setIsTranslationModalOpen(true)}
            className="neu-button px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5"
          >
            <Languages size={15} />
            <span>{currentTranslation.toUpperCase()}</span>
          </button>

          {/* Book & Chapter Selector Center Pill */}
          <button
            onClick={() => setIsBookSelectorOpen(true)}
            className="neu-flat px-5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-white flex items-center gap-2 transition-transform active:scale-95"
          >
            <BookOpen size={16} className="text-red-600 dark:text-red-400" />
            <span>
              {currentBookName} {currentChapter}
            </span>
          </button>

          {/* Reader Display Settings Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="neu-button p-2.5 rounded-xl text-[#64748B] dark:text-zinc-300"
            title="Pengaturan Tampilan"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Main Chapter Content Viewport */}
      <main ref={containerRef} className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 md:py-8">
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#64748B]">Memuat ayat...</p>
          </div>
        ) : chapterData ? (
          <div className="neu-flat p-6 sm:p-10 rounded-3xl space-y-8">
            {/* Chapter Header Banner */}
            <div className="text-center space-y-1.5 border-b border-[#CBD5E1]/40 dark:border-zinc-800 pb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400">
                {currentBookName}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
                Pasal {currentChapter}
              </h1>
            </div>

            {/* Verses Container */}
            <div
              className={`space-y-4 ${getFontFamilyClass()}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
            >
              {settings.layoutMode === 'verse-by-verse' ? (
                /* Verse by Verse Mode */
                chapterData.verses.map((v) => {
                  const highlightColor = getHighlightForVerse(
                    currentBookId,
                    currentChapter,
                    v.verse
                  );
                  const isBm = isBookmarked(currentBookId, currentChapter, v.verse);

                  let highlightClass = '';
                  if (highlightColor) {
                    highlightClass = `highlight-${highlightColor}`;
                  }

                  return (
                    <div
                      key={v.verse}
                      onClick={() => handleVerseClick(v.verse, v.text)}
                      className={`group relative p-3 rounded-2xl cursor-pointer transition-all hover:neu-inset-sm flex items-start gap-3.5 ${highlightClass}`}
                    >
                      {/* Verse Number */}
                      <span className="select-none text-xs font-extrabold text-red-600 dark:text-red-400 mt-1 min-w-[20px] text-right">
                        {v.verse}
                      </span>

                      {/* Verse Text */}
                      <p className="flex-1 text-[#1E293B] dark:text-zinc-200 font-medium">
                        {v.text}
                      </p>

                      {/* Bookmark Indicator */}
                      {isBm && (
                        <Bookmark
                          size={16}
                          className="text-red-600 dark:text-red-400 fill-red-600/20 shrink-0 mt-1.5"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                /* Paragraph Reading Mode */
                <div className="leading-relaxed text-[#1E293B] dark:text-zinc-200 font-medium space-x-1">
                  {chapterData.verses.map((v) => {
                    const highlightColor = getHighlightForVerse(
                      currentBookId,
                      currentChapter,
                      v.verse
                    );

                    let highlightClass = '';
                    if (highlightColor) {
                      highlightClass = `highlight-${highlightColor}`;
                    }

                    return (
                      <span
                        key={v.verse}
                        onClick={() => handleVerseClick(v.verse, v.text)}
                        className={`inline cursor-pointer hover:underline p-0.5 rounded-sm ${highlightClass}`}
                      >
                        <sup className="text-xs font-extrabold text-red-600 dark:text-red-400 mr-1 select-none">
                          {v.verse}
                        </sup>
                        <span>{v.text} </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="pt-8 border-t border-[#CBD5E1]/40 dark:border-zinc-800 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevChapter}
                className="neu-button px-5 py-3 rounded-2xl text-[#1E293B] dark:text-zinc-200 font-bold text-xs flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Pasal Sebelumnya</span>
              </button>

              <button
                onClick={handleNextChapter}
                className="neu-button-primary px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2"
              >
                <span>Pasal Berikutnya</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-sm font-semibold text-[#64748B]">Gagal memuat isi pasal.</p>
          </div>
        )}
      </main>

      {/* Verse Action Bottom Sheet */}
      <VerseBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        verseRef={activeVerseRef}
        onOpenShare={(ref) => {
          setShareVerseRef(ref);
          setIsShareModalOpen(true);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        verseRef={shareVerseRef}
      />

      {/* Reader Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Book & Chapter Selector Modal */}
      <BookChapterSelectorModal
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
        onSelect={(bId, chNum) => {
          navigateTo(currentTranslation, bId, chNum);
        }}
      />

      {/* Translation Selector Modal */}
      <TranslationSelectorModal
        isOpen={isTranslationModalOpen}
        onClose={() => setIsTranslationModalOpen(false)}
        onSelect={(transId) => {
          setTranslation(transId);
        }}
      />
    </div>
  );
};
