/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Image as GalleryIcon, 
  Settings as SettingsIcon, 
  Info as AboutIcon,
  ChevronRight,
  Download,
  Share2,
  Heart,
  Moon,
  Sun,
  Bell,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { Page, Wallpaper } from './types';
import { WALLPAPERS } from './constants';

// --- Components ---

const SafeImage = ({ src, alt, className, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to picsum with a seed based on the filename
      const seed = src.split('/').pop()?.split('.')[0] || 'wallpaper';
      setImgSrc(`https://picsum.photos/seed/${seed}/800/1200`);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={handleError}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

const Navbar = ({ activePage, onNavigate }: { activePage: Page, onNavigate: (p: Page) => void }) => {
  const navItems: { id: Page; icon: any; label: string }[] = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'gallery', icon: GalleryIcon, label: 'Start' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'about', icon: AboutIcon, label: 'About' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl py-4 px-6 shadow-2xl z-50 flex justify-between items-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-neutral-900 scale-110' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-neutral-900 rounded-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
  <header className="sticky top-0 w-full px-6 py-8 flex items-center justify-between z-40 bg-neutral-50/80 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      {showBack && (
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    </div>
    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
      <SafeImage src="/wallpapers/user-profile.jpeg" alt="User" />
    </div>
  </header>
);

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="px-6 pb-32"
  >
    <div className="mb-10">
      <p className="text-neutral-500 font-medium mb-2">Welcome back,</p>
      <h2 className="text-4xl font-bold leading-tight">Find your <span className="text-neutral-400 italic">vibe</span> today.</h2>
    </div>

    <div className="grid gap-4">
      <button 
        onClick={() => onNavigate('gallery')}
        className="group relative w-full h-48 rounded-[2.5rem] overflow-hidden shadow-lg transition-transform active:scale-95"
      >
        <SafeImage 
          src="/wallpapers/hero-banner.jpeg" 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-8 text-left">
          <h3 className="text-white text-2xl font-bold mb-1">Start Exploring</h3>
          <p className="text-white/80 text-sm">Browse the psychedelic collection</p>
        </div>
        <div className="absolute bottom-6 right-8 w-10 h-10 glass rounded-full flex items-center justify-center text-white">
          <ChevronRight size={20} />
        </div>
      </button>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'gallery', label: 'Features', icon: Bell, color: 'bg-orange-50' },
          { id: 'settings', label: 'Settings', icon: SettingsIcon, color: 'bg-blue-50' },
          { id: 'about', label: 'About', icon: AboutIcon, color: 'bg-green-50' },
          { id: 'gallery', label: 'Favorites', icon: Heart, color: 'bg-red-50' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.id as Page)}
            className="flex flex-col items-start p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
              <item.icon size={24} className="text-neutral-700" />
            </div>
            <span className="font-semibold text-neutral-800">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

const GalleryPage = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', '1970s', 'Trippy', 'Psychedelic'];
  const filteredWallpapers = filter === 'All' 
    ? WALLPAPERS 
    : WALLPAPERS.filter(w => w.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 pb-32"
    >
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === cat 
                ? 'bg-neutral-900 text-white shadow-lg' 
                : 'bg-white/30 backdrop-blur-md text-neutral-600 border border-white/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {filteredWallpapers.map((wp) => (
          <motion.div
            layout
            key={wp.id}
            onClick={() => setSelectedWallpaper(wp)}
            className="relative rounded-3xl overflow-hidden shadow-sm cursor-pointer group"
          >
            <SafeImage 
              src={wp.url} 
              alt={wp.title} 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-white text-xs font-medium">{wp.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="absolute top-10 left-6 z-10">
              <button 
                onClick={() => setSelectedWallpaper(null)}
                className="w-12 h-12 glass rounded-full flex items-center justify-center text-white"
              >
                <ArrowLeft size={24} />
              </button>
            </div>
            
            <SafeImage 
              src={selectedWallpaper.url} 
              alt={selectedWallpaper.title} 
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass rounded-[2.5rem] p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">{selectedWallpaper.title}</h3>
                <p className="text-neutral-500 text-sm">by {selectedWallpaper.author} • {selectedWallpaper.category}</p>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-neutral-900 text-white h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Download size={20} />
                  Download
                </button>
                <button className="w-14 h-14 bg-neutral-100 text-neutral-600 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                  <Heart size={20} />
                </button>
                <button className="w-14 h-14 bg-neutral-100 text-neutral-600 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const SettingItem = ({ icon: Icon, label, value, onToggle }: any) => (
    <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm mb-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-600">
          <Icon size={20} />
        </div>
        <span className="font-medium text-neutral-800">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-neutral-900' : 'bg-neutral-200'}`}
      >
        <motion.div 
          animate={{ x: value ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-6 pb-32"
    >
      <div className="mb-8">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Preferences</h3>
        <SettingItem 
          icon={darkMode ? Moon : Sun} 
          label="Dark Appearance" 
          value={darkMode} 
          onToggle={() => setDarkMode(!darkMode)} 
        />
        <SettingItem 
          icon={Bell} 
          label="Push Notifications" 
          value={notifications} 
          onToggle={() => setNotifications(!notifications)} 
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Security</h3>
        <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-600">
              <Shield size={20} />
            </div>
            <span className="font-medium text-neutral-800">Privacy Policy</span>
          </div>
          <ChevronRight size={20} className="text-neutral-300" />
        </div>
      </div>
    </motion.div>
  );
};

const AboutPage = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="px-6 pb-32"
  >
    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm text-center">
      <div className="w-24 h-24 bg-neutral-900 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white">
        <GalleryIcon size={40} />
      </div>
      <h2 className="text-2xl font-bold mb-2">Retro & Psychedelic Pro</h2>
      <p className="text-neutral-400 text-sm mb-8">Version 1.0.4 • Premium Edition</p>
      
      <div className="text-left space-y-6">
        <p className="text-neutral-600 leading-relaxed">
          The ultimate destination for high-quality, curated wallpapers inspired by the vibrant aesthetics of the 1970s and the mind-bending world of psychedelic art.
        </p>
        <div className="pt-6 border-t border-neutral-50">
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Developed by</h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-200" />
            <span className="font-medium">Aesthetic Labs Studio</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'gallery': return <GalleryPage />;
      case 'settings': return <SettingsPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const getTitle = () => {
    switch (currentPage) {
      case 'home': return 'Discover';
      case 'gallery': return 'Gallery';
      case 'settings': return 'Settings';
      case 'about': return 'About';
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-neutral-50 relative">
      <Header 
        title={getTitle()} 
        showBack={currentPage !== 'home'} 
        onBack={() => setCurrentPage('home')} 
      />
      
      <main className="pt-4">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <Navbar activePage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
