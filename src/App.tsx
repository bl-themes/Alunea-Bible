import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BibleProvider } from './contexts/BibleContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Reader } from './pages/Reader';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BibleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reader" element={<Reader />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BibleProvider>
  );
}
