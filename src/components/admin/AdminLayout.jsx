import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getAdminPasscode } from '../../utils/storage';

import AdminCollections from './AdminCollections';
import AdminCraft from './AdminCraft';
import AdminSalons from './AdminSalons';
import AdminEnquiries from './AdminEnquiries';
import AdminSettings from './AdminSettings';

import AuthPage from '../AuthPage';

export default function AdminLayout({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lumina_admin_authenticated') === 'true';
  });
  const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'craft' | 'salons' | 'enquiries' | 'settings'

  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const sessionAuth = sessionStorage.getItem('lumina_admin_authenticated') === 'true';
    setIsAuthenticated(sessionAuth);
  }, []);

  useEffect(() => {
    if (isAuthenticated && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-fade');
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
        );
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('lumina_admin_authenticated');
    sessionStorage.removeItem('lumina_logged_in');
    if (onNavigate) onNavigate('login');
  };

  if (!isAuthenticated) {
    return <AuthPage onNavigate={onNavigate} initialMode="login" />;
  }

  return (
    <main ref={containerRef} className="pt-28 pb-32 bg-page min-h-screen">
      {/* Admin Top Bar */}
      <section className="px-6 md:px-16 max-w-[1400px] mx-auto mb-10 border-b border-hairline pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade">
        <div>
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body mb-2">
            <span className="w-8 h-[1px] bg-bronze inline-block" />
            Lumina Atelier Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-editorial font-light text-deep">
            Content & Client Administration
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-graphite hover:text-deep font-body tracking-[0.1em] uppercase cursor-pointer"
          >
            Preview Site ↗
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-hairline-dark text-deep text-xs font-body uppercase tracking-[0.1em] hover:bg-surface transition-all cursor-pointer"
          >
            Lock Portal
          </button>
        </div>
      </section>

      {/* Admin Tabs */}
      <section className="px-6 md:px-16 max-w-[1400px] mx-auto mb-10 animate-fade">
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-4">
          {[
            { id: 'collections', label: '🖼️ Kitchen Collections' },
            { id: 'craft', label: '⚒️ Craft Process' },
            { id: 'salons', label: '🏛️ Global Salons' },
            { id: 'enquiries', label: '📋 Client Dossiers (CRM)' },
            { id: 'settings', label: '⚙️ Security & Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs font-body uppercase tracking-[0.1em] transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-bark text-page font-medium shadow-sm'
                  : 'bg-surface text-graphite hover:text-deep hover:bg-page border border-hairline'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Active Tab View */}
      <section className="px-6 md:px-16 max-w-[1400px] mx-auto">
        {activeTab === 'collections' && <AdminCollections />}
        {activeTab === 'craft' && <AdminCraft />}
        {activeTab === 'salons' && <AdminSalons />}
        {activeTab === 'enquiries' && <AdminEnquiries />}
        {activeTab === 'settings' && <AdminSettings />}
      </section>
    </main>
  );
}
