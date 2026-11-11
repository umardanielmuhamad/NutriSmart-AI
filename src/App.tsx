import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductPage } from './components/ProductPage';
import { NutritionDashboard } from './components/NutritionDashboard';
import { IngredientExplorer } from './components/IngredientExplorer';
import { GeminiChatAssistant } from './components/GeminiChatAssistant';
import { QrCodeSection } from './components/QrCodeSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Language, ProductData } from './types/product';
import { translations } from './utils/translations';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrismart_lang');
      if (saved === 'ms' || saved === 'en') return saved;
    }
    return 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingAiQuestion, setPendingAiQuestion] = useState<string | null>(null);

  // Sync language with localStorage
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrismart_lang', lang);
    }
  };

  // Resolve initial tab based on window pathname
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname.toLowerCase();
    if (path.includes('/product')) {
      setActiveTab('product');
    } else if (path.includes('/nutrition')) {
      setActiveTab('nutrition');
    } else if (path.includes('/ingredients')) {
      setActiveTab('ingredients');
    } else if (path.includes('/ai')) {
      setActiveTab('ai');
    } else if (path.includes('/qr')) {
      setActiveTab('qr');
    } else if (path.includes('/admin')) {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }

    // Listen for browser forward/back buttons
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/product')) setActiveTab('product');
      else if (p.includes('/nutrition')) setActiveTab('nutrition');
      else if (p.includes('/ingredients')) setActiveTab('ingredients');
      else if (p.includes('/ai')) setActiveTab('ai');
      else if (p.includes('/qr')) setActiveTab('qr');
      else if (p.includes('/admin')) setActiveTab('admin');
      else setActiveTab('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL on navigation
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined') {
      let path = '/';
      if (tab === 'product') path = '/product/sorghubites';
      else if (tab === 'nutrition') path = '/nutrition';
      else if (tab === 'ingredients') path = '/ingredients';
      else if (tab === 'ai') path = '/ai';
      else if (tab === 'qr') path = '/qr';
      else if (tab === 'admin') path = '/admin';

      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    }
  };

  // Fetch product data from persistent backend
  const fetchProductData = async () => {
    try {
      const res = await fetch('/api/products/sorghubites');
      const data = await res.json();
      if (data.success && data.product) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error('Failed to load product data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  // Handler for jumping straight to AI assistant with a prefilled question
  const handleAskAiQuestion = (question: string) => {
    setPendingAiQuestion(question);
    handleNavigate('ai');
  };

  // Handler for competition evaluator live status toggle
  const handleToggleVerification = async () => {
    try {
      const res = await fetch('/api/products/sorghubites/toggle-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'nutrismart2026',
        },
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error('Error toggling verification status:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-[#17261D] selection:bg-[#52B788]/30 selection:text-[#143826]">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        product={product}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              currentLang={currentLang}
              product={product}
              onNavigate={handleNavigate}
            />

            {/* Quick Teaser of SorghuBites Product Page on Home */}
            <div className="bg-[#FAF7F0] border-t border-[#E8E1D3]">
              <ProductPage
                currentLang={currentLang}
                product={product}
                onNavigate={handleNavigate}
                onAskAiQuestion={handleAskAiQuestion}
              />
            </div>
          </>
        )}

        {activeTab === 'product' && (
          <ProductPage
            currentLang={currentLang}
            product={product}
            onNavigate={handleNavigate}
            onAskAiQuestion={handleAskAiQuestion}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionDashboard
            currentLang={currentLang}
            product={product}
            onNavigate={handleNavigate}
            onToggleVerification={handleToggleVerification}
          />
        )}

        {activeTab === 'ingredients' && (
          <IngredientExplorer
            currentLang={currentLang}
            product={product}
            onAskAiAboutIngredient={(ingName) =>
              handleAskAiQuestion(`What is the nutritional role and function of ${ingName} in SorghuBites?`)
            }
          />
        )}

        {activeTab === 'ai' && (
          <GeminiChatAssistant
            currentLang={currentLang}
            product={product}
            initialQuestion={pendingAiQuestion}
            onClearInitialQuestion={() => setPendingAiQuestion(null)}
          />
        )}

        {activeTab === 'qr' && (
          <QrCodeSection
            currentLang={currentLang}
            product={product}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentLang={currentLang}
            product={product}
            onProductUpdate={(updated) => setProduct(updated)}
            onToggleVerification={handleToggleVerification}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer currentLang={currentLang} onNavigate={handleNavigate} />
    </div>
  );
}
