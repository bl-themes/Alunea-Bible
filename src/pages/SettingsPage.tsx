import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Coffee,
  Monitor,
  Type,
  Trash2,
  BookOpen,
  Info,
  Check,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { useBible } from '../contexts/BibleContext';
import { FontFamily, LayoutMode, ThemeMode } from '../types/bible';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    theme,
    setTheme,
    translations,
    currentTranslation,
    setTranslation,
    clearHistory,
    clearAllUserData,
  } = useBible();

  const [confirmClear, setConfirmClear] = useState<string | null>(null);

  const handleFontFamilyChange = (font: FontFamily) => {
    updateSettings({ fontFamily: font });
  };

  const handleLayoutModeChange = (mode: LayoutMode) => {
    updateSettings({ layoutMode: mode });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
          Pengaturan & Preferensi
        </h1>
        <p className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">
          Atur tampilan membaca, tema, dan kelola data lokal
        </p>
      </div>

      {/* Section 1: Appearance Theme */}
      <section className="neu-flat rounded-3xl p-6 sm:p-7 space-y-5">
        <h2 className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Sun size={18} className="text-red-600 dark:text-red-400" />
          Tema Warna
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'light'
                ? 'neu-flat text-red-600 dark:text-red-400'
                : 'neu-button text-[#64748B]'
            }`}
          >
            <Sun size={20} />
            Terang
          </button>

          <button
            onClick={() => setTheme('sepia')}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'sepia'
                ? 'neu-flat text-amber-600'
                : 'neu-button text-[#64748B]'
            }`}
          >
            <Coffee size={20} />
            Sepia
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'neu-flat text-red-600 dark:text-red-400'
                : 'neu-button text-[#64748B]'
            }`}
          >
            <Moon size={20} />
            Gelap
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'system'
                ? 'neu-flat text-red-600 dark:text-red-400'
                : 'neu-button text-[#64748B]'
            }`}
          >
            <Monitor size={20} />
            Ikuti Sistem
          </button>
        </div>
      </section>

      {/* Section 2: Default Bible Translation */}
      <section className="neu-flat rounded-3xl p-6 sm:p-7 space-y-5">
        <h2 className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Languages size={18} className="text-red-600 dark:text-red-400" />
          Versi Terjemahan Utama
        </h2>

        <div className="space-y-3">
          {translations.map((tr) => {
            const isSelected = tr.id.toLowerCase() === currentTranslation.toLowerCase();
            return (
              <button
                key={tr.id}
                onClick={() => setTranslation(tr.id)}
                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                  isSelected
                    ? 'neu-flat text-red-600 dark:text-red-400 font-extrabold'
                    : 'neu-button text-[#1E293B] dark:text-zinc-200'
                }`}
              >
                <div className="text-left">
                  <span className="text-sm font-bold block">{tr.name}</span>
                  <span className="text-xs text-[#64748B] font-medium">
                    {tr.language} ({tr.shortName})
                  </span>
                </div>
                {isSelected && <Check size={18} className="text-red-600 dark:text-red-400" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Typography Options */}
      <section className="neu-flat rounded-3xl p-6 sm:p-7 space-y-5">
        <h2 className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Type size={18} className="text-red-600 dark:text-red-400" />
          Tipografi Bacaan
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-extrabold text-[#64748B] dark:text-zinc-400 uppercase tracking-wider mb-3 block">
              Jenis Huruf
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleFontFamilyChange('sans')}
                className={`p-3 rounded-2xl text-xs font-sans font-bold transition-all ${
                  settings.fontFamily === 'sans'
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'neu-button text-[#64748B]'
                }`}
              >
                Sans-Serif
              </button>
              <button
                onClick={() => handleFontFamilyChange('serif')}
                className={`p-3 rounded-2xl text-xs font-serif font-bold transition-all ${
                  settings.fontFamily === 'serif'
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'neu-button text-[#64748B]'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => handleFontFamilyChange('mono')}
                className={`p-3 rounded-2xl text-xs font-mono font-bold transition-all ${
                  settings.fontFamily === 'mono'
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'neu-button text-[#64748B]'
                }`}
              >
                Monospace
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#64748B] dark:text-zinc-400 uppercase tracking-wider mb-3 block">
              Tampilan Tata Letak Ayat
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLayoutModeChange('verse-by-verse')}
                className={`p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  settings.layoutMode === 'verse-by-verse'
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'neu-button text-[#64748B]'
                }`}
              >
                Baris per Ayat
              </button>
              <button
                onClick={() => handleLayoutModeChange('paragraph')}
                className={`p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  settings.layoutMode === 'paragraph'
                    ? 'neu-flat text-red-600 dark:text-red-400'
                    : 'neu-button text-[#64748B]'
                }`}
              >
                Paragraf
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Local Storage Data Management */}
      <section className="neu-flat rounded-3xl p-6 sm:p-7 space-y-5 border-2 border-rose-500/20">
        <h2 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <Trash2 size={18} />
          Kelola Data & Penyimpanan
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 neu-flat rounded-2xl">
            <div>
              <p className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-200">
                Hapus Riwayat Bacaan
              </p>
              <p className="text-[11px] font-medium text-[#64748B]">
                Menghapus daftar pasal yang baru saja Anda baca.
              </p>
            </div>
            <button
              onClick={() => {
                clearHistory();
                setConfirmClear('history');
                setTimeout(() => setConfirmClear(null), 2000);
              }}
              className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-rose-600"
            >
              {confirmClear === 'history' ? 'Dihapus!' : 'Hapus'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 neu-flat rounded-2xl">
            <div>
              <p className="text-xs font-extrabold text-[#1E293B] dark:text-zinc-200">
                Reset Seluruh Data Aplikasi
              </p>
              <p className="text-[11px] font-medium text-[#64748B]">
                Menghapus seluruh penanda, sorotan, dan riwayat secara permanen.
              </p>
            </div>
            <button
              onClick={() => {
                clearAllUserData();
                setConfirmClear('all');
                setTimeout(() => setConfirmClear(null), 2000);
              }}
              className="neu-button-primary px-4 py-2 rounded-xl text-xs font-bold"
            >
              {confirmClear === 'all' ? 'Direset!' : 'Reset'}
            </button>
          </div>
        </div>
      </section>

      {/* About App */}
      <section className="text-center py-6 space-y-2 text-[#64748B] text-xs">
        <div className="flex items-center justify-center gap-2 text-[#1E293B] dark:text-zinc-300 font-extrabold">
          <BookOpen size={16} className="text-red-600 dark:text-red-400" />
          <span>Alunea Alkitab • Versi 1.0.0</span>
        </div>
        <p className="font-medium max-w-md mx-auto">
          Dirancang untuk pengalaman membaca Alkitab yang cepat, fokus, dan nyaman dengan gaya Neumorphism. Semua data tersimpan aman secara lokal di perangkat Anda.
        </p>
      </section>
    </div>
  );
};
