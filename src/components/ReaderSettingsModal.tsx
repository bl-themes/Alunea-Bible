import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Type, Moon, Sun, Coffee, Monitor } from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { FontFamily, LayoutMode, ThemeMode } from '../types/bible';

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, theme, setTheme } = useBible();

  if (!isOpen) return null;

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(14, Math.min(28, settings.fontSize + delta));
    updateSettings({ fontSize: newSize });
  };

  const handleLineHeightChange = (val: number) => {
    updateSettings({ lineHeight: val });
  };

  const handleFontFamilyChange = (font: FontFamily) => {
    updateSettings({ fontFamily: font });
  };

  const handleLayoutModeChange = (mode: LayoutMode) => {
    updateSettings({ layoutMode: mode });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-sm bg-[#EEF2F6] dark:bg-[#181A1F] rounded-[32px] p-6 neu-flat shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-zinc-100 flex items-center gap-2">
              <Type size={18} className="text-red-600 dark:text-red-400" />
              Tampilan Membaca
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl neu-button text-[#64748B]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Theme Selector */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] dark:text-zinc-400 mb-2.5 block">
                Tema Warna
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'neu-flat text-red-600 dark:text-red-400'
                      : 'neu-button text-[#64748B]'
                  }`}
                >
                  <Sun size={16} />
                  Terang
                </button>

                <button
                  onClick={() => setTheme('sepia')}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    theme === 'sepia'
                      ? 'neu-flat text-amber-600'
                      : 'neu-button text-[#64748B]'
                  }`}
                >
                  <Coffee size={16} />
                  Sepia
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'neu-flat text-red-600 dark:text-red-400'
                      : 'neu-button text-[#64748B]'
                  }`}
                >
                  <Moon size={16} />
                  Gelap
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    theme === 'system'
                      ? 'neu-flat text-red-600 dark:text-red-400'
                      : 'neu-button text-[#64748B]'
                  }`}
                >
                  <Monitor size={16} />
                  Sistem
                </button>
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] dark:text-zinc-400">
                  Ukuran Huruf
                </label>
                <span className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-200">
                  {settings.fontSize}px
                </span>
              </div>
              <div className="flex items-center gap-3 neu-inset p-2 rounded-2xl">
                <button
                  onClick={() => handleFontSizeChange(-1)}
                  className="p-2 rounded-xl neu-button text-[#1E293B] dark:text-zinc-200"
                  aria-label="Kecilkan ukuran huruf"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center font-serif text-sm font-medium text-[#1E293B] dark:text-zinc-200">
                  Aa (Contoh Teks)
                </div>
                <button
                  onClick={() => handleFontSizeChange(1)}
                  className="p-2 rounded-xl neu-button text-[#1E293B] dark:text-zinc-200"
                  aria-label="Besarkan ukuran huruf"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Font Family Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">
                Jenis Huruf
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleFontFamilyChange('sans')}
                  className={`p-2.5 rounded-xl border text-xs font-sans font-medium transition-all ${
                    settings.fontFamily === 'sans'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Sans-Serif
                </button>
                <button
                  onClick={() => handleFontFamilyChange('serif')}
                  className={`p-2.5 rounded-xl border text-xs font-serif font-medium transition-all ${
                    settings.fontFamily === 'serif'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => handleFontFamilyChange('mono')}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                    settings.fontFamily === 'mono'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Monospace
                </button>
              </div>
            </div>

            {/* Layout Mode */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">
                Tata Letak Bacaan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLayoutModeChange('verse-by-verse')}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    settings.layoutMode === 'verse-by-verse'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Ayat per baris
                </button>
                <button
                  onClick={() => handleLayoutModeChange('paragraph')}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    settings.layoutMode === 'paragraph'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Tampilan Paragraf
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
