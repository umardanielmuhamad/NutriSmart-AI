import React from 'react';
import { Leaf, Sparkles, ShieldAlert, CheckCircle2, QrCode, MessageSquare, BarChart3, Lock, Menu, X, Globe } from 'lucide-react';
import { Language, ProductData } from '../types/product';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  product: ProductData | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onNavigate,
  product,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[currentLang];

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'product', label: t.nav.product },
    { id: 'nutrition', label: t.nav.nutrition },
    { id: 'ingredients', label: t.nav.ingredients },
    { id: 'ai', label: t.nav.aiChat },
    { id: 'qr', label: t.nav.qrGenerator },
  ];

  const isVerified = product?.verificationStatus === 'VERIFIED';

  return (
    <header className="sticky top-0 z-50 bg-[#143826]/95 backdrop-blur-md border-b border-[#2D5A40] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#52B788] to-[#1B4332] p-0.5 shadow-md flex items-center justify-center border border-[#74C69D]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0E281B] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Leaf className="w-5 h-5 text-[#52B788] -rotate-12 group-hover:rotate-0 transition-transform" />
                <Sparkles className="w-3 h-3 text-[#E9C46A] absolute top-1 right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-[#D8F3DC] transition-colors">
                  NutriSmart <span className="text-[#52B788]">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#1B4332] text-[#95D5B2] px-2 py-0.5 rounded border border-[#40916C]/40">
                  SorghuBites
                </span>
              </div>
              <p className="text-xs text-[#B7E4C7]/80 hidden sm:block">
                Smart Food Information System
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#1F4E36] text-[#D8F3DC] shadow-inner font-semibold'
                      : 'text-[#D8F3DC]/80 hover:text-white hover:bg-[#1B4332]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Status Indicator Badge */}
            <div
              onClick={() => onNavigate('nutrition')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                isVerified
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900/80'
              }`}
              title="Click to view full laboratory protocol details"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lab: {t.hero.verifiedLabel}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Lab: {t.hero.pendingLabel}</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#0E281B] p-0.5 rounded-lg border border-[#2D5A40]">
              <Globe className="w-3.5 h-3.5 text-[#74C69D] ml-2 mr-1 hidden sm:block" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  currentLang === 'en'
                    ? 'bg-[#52B788] text-[#0E281B] shadow-sm'
                    : 'text-[#95D5B2] hover:text-white'
                }`}
                aria-label="English"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ms')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  currentLang === 'ms'
                    ? 'bg-[#52B788] text-[#0E281B] shadow-sm'
                    : 'text-[#95D5B2] hover:text-white'
                }`}
                aria-label="Bahasa Melayu"
              >
                BM
              </button>
            </div>

            {/* Admin Portal Quick Icon */}
            <button
              onClick={() => onNavigate('admin')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-[#E9C46A] text-[#143826] border-[#E9C46A]'
                  : 'bg-[#1B4332] text-[#D8F3DC] border-[#2D5A40] hover:bg-[#2D5A40]'
              }`}
              title={t.nav.admin}
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#1B4332] text-white border border-[#2D5A40]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E281B] border-b border-[#2D5A40] px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#52B788] text-[#0E281B] font-bold'
                    : 'text-[#D8F3DC] hover:bg-[#1B4332]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#1F4E36] flex items-center justify-between">
            <span className="text-xs text-[#95D5B2]">
              {isVerified ? t.hero.verifiedLabel : t.hero.pendingLabel}
            </span>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#E9C46A] flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              {t.nav.admin}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
