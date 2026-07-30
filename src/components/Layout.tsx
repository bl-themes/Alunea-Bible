import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Search,
  Bookmark,
  Settings,
  Book,
} from 'lucide-react';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/reader', label: 'Alkitab', icon: BookOpen },
  { path: '/search', label: 'Pencarian', icon: Search },
  { path: '/bookmarks', label: 'Penanda', icon: Bookmark },
  { path: '/settings', label: 'Pengaturan', icon: Settings },
];

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EEF2F6] dark:bg-[#181A1F] text-[#1E293B] dark:text-zinc-100 transition-colors selection:bg-red-600 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#EEF2F6] dark:bg-[#181A1F] p-6 sticky top-0 h-screen z-30 justify-between">
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3.5 px-2 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-[4px_6px_16px_rgba(220,38,38,0.35)]">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-[#1E293B] dark:text-white leading-tight">
                Alkitab Alunea
              </h1>
              <p className="text-[11px] font-medium text-[#64748B] dark:text-zinc-400">
                Firman Tuhan Dalam Genggaman
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'neu-flat text-red-600 dark:text-red-400'
                      : 'text-[#64748B] dark:text-zinc-400 hover:text-[#1E293B] dark:hover:text-zinc-100 hover:neu-flat-sm'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-red-600 dark:text-red-400' : 'text-[#64748B] dark:text-zinc-400'} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute right-3 w-1.5 h-5 bg-red-600 dark:bg-red-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info card in Neumorphic sidebar */}
        <div className="neu-flat p-4 rounded-2xl text-xs space-y-1 text-[#64748B] dark:text-zinc-400">
          <p className="font-bold text-[#1E293B] dark:text-zinc-200">Alkitab Alunea</p>
          <p className="text-[11px]">Versi 1.0.0 • Offline Mode</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#EEF2F6]/95 dark:bg-[#181A1F]/95 backdrop-blur-lg safe-pb px-4 py-2 border-t border-transparent">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto neu-flat px-2 rounded-2xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-[#64748B] dark:text-zinc-400 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavPill"
                    className="absolute inset-0 neu-flat rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={20} />
                <span className="text-[10px] mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
