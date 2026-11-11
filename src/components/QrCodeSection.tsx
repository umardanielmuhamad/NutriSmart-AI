import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Printer, 
  Smartphone, 
  AlertCircle, 
  Layers, 
  Sparkles,
  Box,
  Share2
} from 'lucide-react';
import { Language, ProductData } from '../types/product';
import { translations } from '../utils/translations';

interface QrCodeSectionProps {
  currentLang: Language;
  product: ProductData | null;
  onNavigate: (tab: string) => void;
}

export const QrCodeSection: React.FC<QrCodeSectionProps> = ({
  currentLang,
  product,
  onNavigate,
}) => {
  const t = translations[currentLang];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine current public URL
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nutrismart-ai.org';
    const targetPath = product ? product.qrDestinationPath : '/product/sorghubites';
    const fullUrl = `${origin}${targetPath}`;
    setActiveUrl(fullUrl);
    setCustomDomain(origin);
  }, [product]);

  // Generate QR code when activeUrl changes
  useEffect(() => {
    if (!activeUrl) return;

    setIsGenerating(true);
    QRCode.toDataURL(
      activeUrl,
      {
        width: 1024,
        margin: 2,
        color: {
          dark: '#143826', // Forest green brand color
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // High error correction for packaging durability
      },
      (err, url) => {
        setIsGenerating(false);
        if (err) {
          console.error('Failed to generate QR code:', err);
        } else {
          setQrDataUrl(url);
        }
      }
    );
  }, [activeUrl]);

  // Handle custom domain update
  const handleApplyCustomDomain = () => {
    try {
      const cleanDomain = customDomain.trim().replace(/\/+$/, '');
      const targetPath = product ? product.qrDestinationPath : '/product/sorghubites';
      const newUrl = `${cleanDomain}${targetPath}`;
      setActiveUrl(newUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadHighResPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SorghuBites_Packaging_QRCode_1024x1024.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isLocalOrPreview = activeUrl.includes('localhost') || activeUrl.includes('run.app');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-[#E3DCce] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143826] text-[#E9C46A] text-xs font-semibold mb-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>{t.qr.badge}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
          {t.qr.title}
        </h1>
        <p className="text-sm text-[#4A6B53] mt-1 max-w-3xl">
          {t.qr.subtitle}
        </p>

        {/* Domain status banner */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 font-bold">
                {t.qr.deployStatusTitle}
              </strong>
              <span>
                {isLocalOrPreview
                  ? 'Currently resolving to the live cloud runtime URL. For commercial factory packaging print runs, you can specify your dedicated production domain below.'
                  : 'Active public packaging URL is configured.'}
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-bold bg-amber-200/70 text-amber-900 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
            Target: /product/sorghubites
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: QR Code Display & Export Engine */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#143826]">
              Packaging High-Contrast QR
            </h2>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
              Error Correction Level H (30%)
            </span>
          </div>

          {/* QR Code Presentation Canvas Card */}
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border-2 border-dashed border-[#D5C7AA] flex flex-col items-center justify-center text-center">
            
            {/* Branded Packaging QR Frame */}
            <div className="bg-white p-5 rounded-2xl shadow-xl border-4 border-[#143826] relative max-w-[280px] w-full">
              {/* Frame Header */}
              <div className="text-center pb-2 mb-2 border-b border-stone-200">
                <span className="font-heading font-black text-sm tracking-wider text-[#143826] block">
                  SorghuBites
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#40916C]">
                  SCAN FOR FOOD SCIENCE
                </span>
              </div>

              {/* QR Image */}
              <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white">
                {isGenerating || !qrDataUrl ? (
                  <div className="animate-spin w-10 h-10 border-4 border-[#143826] border-t-transparent rounded-full" />
                ) : (
                  <img
                    src={qrDataUrl}
                    alt="SorghuBites Packaging QR Code"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Frame Footer */}
              <div className="text-center pt-2 mt-2 border-t border-stone-200">
                <span className="text-[10px] font-bold text-[#143826] flex items-center justify-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#B38A2E]" />
                  <span>Works with any phone camera</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-[#55695C] mt-4 font-mono">
              300 DPI Ready • High-Contrast Forest Green Matrix
            </p>
          </div>

          {/* URL & Copy Row */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#143826] block">
              {t.qr.destinationUrlLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="flex-1 bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#143826] select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-[#143826] hover:bg-[#1F4E36] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.qr.copied : t.qr.copyUrl}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: High-Res Download */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadHighResPng}
              disabled={!qrDataUrl}
              className="flex-1 py-3 px-5 bg-[#52B788] hover:bg-[#40916C] text-[#0E281B] font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              <span>{t.qr.downloadPng}</span>
            </button>

            <button
              onClick={() => onNavigate('product')}
              className="py-3 px-5 bg-white hover:bg-[#F9F6F0] text-[#143826] font-semibold rounded-xl border border-[#D5C7AA] flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Target Page</span>
            </button>
          </div>

          {/* Custom Domain Override Accordion */}
          <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#ECE5D8] space-y-2">
            <span className="text-xs font-bold text-[#143826] block">
              Configure Custom Packaging Domain:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="https://your-custom-sorghubites-domain.com"
                className="flex-1 bg-white border border-[#D5C7AA] rounded-xl px-3 py-2 text-xs font-mono text-[#143826]"
              />
              <button
                onClick={handleApplyCustomDomain}
                className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-xl"
              >
                Update QR
              </button>
            </div>
            <span className="text-[10px] text-[#6B7280] block">
              Updates QR payload instantaneously without page reload.
            </span>
          </div>

        </div>

        {/* Right Column: Physical Packaging Integration Guide & 3D Mockup */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Packaging Box Visual Mockup */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-[#A66D38]" />
              <h3 className="font-heading text-xl font-bold text-[#143826]">
                {t.qr.packagingMockupTitle}
              </h3>
            </div>
            <p className="text-xs text-[#55695C]">
              {t.qr.packagingNote}
            </p>

            {/* Physical Packaging Integration Visualization */}
            <div className="rounded-2xl bg-gradient-to-br from-[#143826] to-[#1F4E36] p-6 text-white relative overflow-hidden shadow-lg border border-[#2D5A40]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                
                {/* Real Physical Jar Prototype Showcase */}
                <div className="bg-[#FAF7F0] text-[#17261D] rounded-xl p-3 shadow-md border-2 border-[#E9C46A] relative flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase bg-[#143826] text-[#E9C46A] px-2 py-0.5 rounded font-bold">
                      PHYSICAL JAR
                    </span>
                    <span className="text-[9px] font-mono text-[#55695C] font-semibold">
                      Malaysia
                    </span>
                  </div>
                  <div className="w-full h-44 bg-white rounded-lg p-1 border border-[#E5DEC9] flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/aistudio/photo_2026-11-10_15.45.03_ce988b6b.jpeg"
                      alt="Physical Prototype Glass Jar"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#143826] mt-2">
                    40% Sorghum • 30% Dates • 25% Butter • 5% Honey
                  </span>
                </div>

                {/* Back / Tag QR Smart Sticker */}
                <div className="bg-[#FAF7F0] text-[#17261D] rounded-xl p-3 shadow-md border-2 border-[#52B788] relative flex flex-col items-center justify-center text-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase bg-[#2D5A40] text-white px-2 py-0.5 rounded font-bold">
                      JAR LID / SIDE STICKER
                    </span>
                    <span className="text-[9px] font-mono text-emerald-800 font-bold">
                      300 DPI
                    </span>
                  </div>
                  <div className="w-28 h-28 bg-white p-1.5 rounded-lg border-2 border-[#143826] shadow-sm mb-2 flex items-center justify-center">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Back panel QR" className="w-full h-full object-contain" />
                    ) : (
                      <div className="animate-spin w-6 h-6 border-2 border-[#143826] border-t-transparent rounded-full" />
                    )}
                  </div>
                  <span className="font-heading font-extrabold text-xs text-[#143826] block">
                    SCAN WITH SMARTPHONE
                  </span>
                  <span className="text-[10px] text-[#55695C] block mt-0.5">
                    Connects directly to NutriSmart AI without app download
                  </span>
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-white/20 text-center text-xs text-[#D8F3DC]/90">
                Printed on the physical jar seal or lid: scanning instantly opens the full food science dossier and Gemini AI guide.
              </div>
            </div>

            {/* Packaging Specifications Guide */}
            <div className="space-y-3 pt-2">
              <h4 className="font-heading text-sm font-bold text-[#143826] uppercase tracking-wider">
                Print Production Guidelines
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#ECE5D8]">
                  <strong className="block text-[#143826] font-bold mb-0.5">Recommended Size</strong>
                  <span className="text-[#55695C]">Minimum 20mm × 20mm (0.8" × 0.8") with 4-module quiet zone.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#ECE5D8]">
                  <strong className="block text-[#143826] font-bold mb-0.5">Cardstock Contrast</strong>
                  <span className="text-[#55695C]">Deep forest green (#143826) or black over white/kraft background.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#ECE5D8]">
                  <strong className="block text-[#143826] font-bold mb-0.5">Resolution</strong>
                  <span className="text-[#55695C]">Exported at 1024×1024px, delivering &gt;300 DPI vector clarity.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#ECE5D8]">
                  <strong className="block text-[#143826] font-bold mb-0.5">Scanning Technology</strong>
                  <span className="text-[#55695C]">Standard iOS Camera, Android Google Lens, Samsung Camera.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
