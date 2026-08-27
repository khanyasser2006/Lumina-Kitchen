import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSequence from './components/HeroSequence';
import Statement from './components/Statement';
import Pillars from './components/Pillars';
import Numbers from './components/Numbers';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import { initAnalytics } from './config/analytics';

// Subpage Imports
import CollectionsPage from './components/CollectionsPage';
import CraftPage from './components/CraftPage';
import AtelierPage from './components/AtelierPage';
import EnquirePage from './components/EnquirePage';
import AuthPage from './components/AuthPage';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [authInitialMode, setAuthInitialMode] = useState('login');

  // Sync hash routing on initial load and popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['collections', 'craft', 'atelier', 'enquire', 'admin', 'auth', 'login', 'register'].includes(hash)) {
        if (hash === 'login') {
          setAuthInitialMode('login');
          setActivePage('auth');
        } else if (hash === 'register') {
          setAuthInitialMode('register');
          setActivePage('auth');
        } else {
          setActivePage(hash);
        }
      } else {
        setActivePage('home');
      }
    };

    handleHashChange();
    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

  useEffect(() => {
    initAnalytics();
  }, []);

  const handleNavigate = (pageId, mode) => {
    if (mode) setAuthInitialMode(mode);
    if (pageId === 'login' || pageId === 'register') {
      setAuthInitialMode(pageId);
      setActivePage('auth');
      window.history.pushState(null, '', `#${pageId}`);
    } else {
      setActivePage(pageId);
      if (pageId === 'home') {
        window.history.pushState(null, '', window.location.pathname);
      } else {
        window.history.pushState(null, '', `#${pageId}`);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-page text-deep selection:bg-bronze selection:text-page">
      {/* Global Navbar */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* View Routing */}
      {activePage === 'home' && (
        <>
          {/* Main Hero Page Untouched */}
          <HeroSequence />
          <Statement />
          <Pillars />
          <Numbers />
        </>
      )}

      {activePage === 'collections' && (
        <CollectionsPage onNavigate={handleNavigate} />
      )}

      {activePage === 'craft' && (
        <CraftPage onNavigate={handleNavigate} />
      )}

      {activePage === 'atelier' && (
        <AtelierPage onNavigate={handleNavigate} />
      )}

      {activePage === 'enquire' && (
        <EnquirePage onNavigate={handleNavigate} />
      )}

      {activePage === 'auth' && (
        <AuthPage onNavigate={handleNavigate} initialMode={authInitialMode} />
      )}

      {activePage === 'admin' && (
        <AdminLayout onNavigate={handleNavigate} />
      )}

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Cookie Consent */}
      <CookieBanner />
    </div>
  );
}

export default App;
