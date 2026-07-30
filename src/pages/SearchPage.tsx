import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { bibleDataService } from '../services/BibleDataService';
import { SearchResult } from '../types/bible';
import { formatBookName } from '../utils/bibleUtils';
import { motion } from 'motion/react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTranslation, navigateTo, books } = useBible();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await bibleDataService.search(query, currentTranslation);
      setResults(res);
      setIsSearching(false);
    }, 250); // 250ms debounced instant search

    return () => clearTimeout(timer);
  }, [query, currentTranslation]);

  const handleSelectResult = (item: SearchResult) => {
    navigateTo(item.translation, item.bookId, item.chapter, item.verse);
    navigate('/reader');
  };

  // Helper to highlight matching text in snippet
  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-red-500/20 text-red-700 dark:text-red-300 px-1 rounded-sm font-bold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-1">
          Pencarian Alkitab
        </h1>
        <p className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">
          Cari kitab, ayat (mis. Yohanes 3:16), atau kata kunci dalam versi {currentTranslation.toUpperCase()}
        </p>
      </div>

      {/* Input Search Field (Neumorphic Inset) */}
      <div className="neu-inset rounded-2xl flex items-center px-4 py-2">
        <Search
          size={20}
          className="text-[#64748B] mr-3 shrink-0"
        />
        <input
          type="text"
          autoFocus
          placeholder="Ketik kata kunci, nama kitab, atau perikop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm font-medium text-[#1E293B] dark:text-white focus:outline-none placeholder-[#94A3B8]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1.5 rounded-xl neu-button text-[#64748B] ml-2"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      {!query && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase text-[#64748B] tracking-wider">
            Pencarian Populer
          </span>
          <div className="flex flex-wrap gap-3">
            {['Kejadian 1', 'Yohanes 3:16', 'Mazmur 23', 'Kasih', 'Terang', 'Damai'].map(
              (chip) => (
                <button
                  key={chip}
                  onClick={() => setQuery(chip)}
                  className="neu-button px-4 py-2.5 rounded-2xl text-xs font-bold text-[#1E293B] dark:text-zinc-200 hover:text-red-600 transition-all"
                >
                  {chip}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results List */}
      {isSearching ? (
        <div className="py-12 text-center text-xs text-[#64748B] flex items-center justify-center gap-2 font-semibold">
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span>Mencari ayat Alkitab...</span>
        </div>
      ) : query && results.length === 0 ? (
        <div className="py-12 text-center space-y-2 neu-flat rounded-3xl p-6">
          <p className="text-sm font-bold text-[#1E293B] dark:text-zinc-300">
            Tidak ditemukan hasil untuk "{query}".
          </p>
          <p className="text-xs text-[#64748B] font-medium">
            Coba cari nama kitab seperti "Yohanes", "Mazmur", atau kata seperti "Kasih", "Terang".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((res, idx) => (
            <motion.div
              key={`${res.bookId}_${res.chapter}_${res.verse}_${idx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => handleSelectResult(res)}
              className="p-6 rounded-3xl neu-button cursor-pointer flex items-start justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-red-600 dark:text-red-400">
                    {formatBookName(res.bookName || res.bookId, books)} {res.chapter}:{res.verse}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg neu-inset-sm text-[#64748B]">
                    {res.translation}
                  </span>
                </div>
                <p className="text-sm text-[#1E293B] dark:text-zinc-200 leading-relaxed font-medium">
                  "{highlightMatch(res.text, query)}"
                </p>
              </div>

              <div className="w-8 h-8 neu-inset rounded-xl flex items-center justify-center text-[#64748B] group-hover:text-red-600 shrink-0 mt-1">
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
