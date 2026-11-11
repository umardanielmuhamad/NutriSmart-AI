import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  AlertCircle, 
  FileText, 
  Scale, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { Language, ProductData, VerificationStatus } from '../types/product';
import { translations } from '../utils/translations';

interface AdminDashboardProps {
  currentLang: Language;
  product: ProductData | null;
  onProductUpdate: (updated: ProductData) => void;
  onToggleVerification: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  product,
  onProductUpdate,
  onToggleVerification,
}) => {
  const t = translations[currentLang];
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form editable states
  const [formData, setFormData] = useState<ProductData | null>(product);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Sync formData if product changes externally
  React.useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.trim() === 'nutrismart2026') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect passkey. Please enter the authorized administrator key (Demo: nutrismart2026).');
    }
  };

  const handleSaveProduct = async () => {
    if (!formData) return;
    setSaveStatus('saving');
    setSaveErrorMessage(null);

    try {
      const response = await fetch(`/api/products/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': passkey || 'nutrismart2026',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to persist product data.');
      }

      setSaveStatus('success');
      onProductUpdate(data.product);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveErrorMessage(err.message || 'Error updating product data.');
    }
  };

  if (!formData) return null;

  const isVerified = formData.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#E3DCce] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143826] text-[#E9C46A] text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{t.admin.badge}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
            {t.admin.title}
          </h1>
          <p className="text-sm text-[#4A6B53] mt-1 max-w-3xl">
            {t.admin.subtitle}
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPasskey('');
            }}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.admin.logoutBtn}</span>
          </button>
        )}
      </div>

      {/* Login Screen if not authenticated */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E3DCce] shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FBF9F4] border-2 border-[#143826] flex items-center justify-center mx-auto text-[#143826]">
            <Lock className="w-8 h-8 text-[#143826]" />
          </div>

          <div>
            <h2 className="font-heading font-bold text-2xl text-[#143826]">
              Administrator Authentication
            </h2>
            <p className="text-xs text-[#55695C] mt-1">
              Authorized food science supervisors and competition evaluators only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-[#143826] block mb-1.5">
                {t.admin.passkeyLabel}
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder={t.admin.passkeyPlaceholder}
                className="w-full bg-[#FBF9F4] border border-[#D5C7AA] focus:border-[#143826] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#143826]"
                autoFocus
              />
              <span className="text-[11px] text-[#718096] block mt-1.5">
                Evaluator Passkey Hint: <code className="font-mono font-bold text-[#143826]">nutrismart2026</code>
              </span>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#143826] hover:bg-[#1F4E36] text-[#D8F3DC] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-[#52B788]" />
              <span>{t.admin.loginBtn}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Management Interface */
        <div className="space-y-8">
          
          {/* Competition Demo: Live Verification Status Toggle Card */}
          <div className="bg-gradient-to-br from-[#143826] to-[#1F4E36] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#E9C46A]/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E281B] text-[#E9C46A] text-xs font-mono font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Competition Evaluation Feature</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {t.admin.testToggleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#D8F3DC]/80 max-w-2xl">
                  {t.admin.testToggleDesc}
                </p>
              </div>

              {/* Toggle Action */}
              <button
                onClick={onToggleVerification}
                className={`px-6 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                  isVerified
                    ? 'bg-amber-400 hover:bg-amber-300 text-[#143826]'
                    : 'bg-[#52B788] hover:bg-[#40916C] text-[#0E281B]'
                }`}
              >
                {isVerified ? (
                  <>
                    <RotateCcw className="w-5 h-5 text-[#143826]" />
                    <span>{t.admin.toggleBtnPending}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#0E281B]" />
                    <span>{t.admin.toggleBtnVerified}</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-mono text-[#95D5B2]">
              <span>Active Status: <strong className="text-white">{formData.verificationStatus}</strong></span>
              <span>•</span>
              <span>Lab Certificate: <strong className="text-white">{formData.labCertificateNo}</strong></span>
              <span>•</span>
              <span>Last Synchronized: <strong className="text-white">{new Date(formData.lastUpdated).toLocaleTimeString()}</strong></span>
            </div>
          </div>

          {/* Form: General Product & Packaging Specs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E3DCce] pb-4">
              <h3 className="font-heading text-xl font-bold text-[#143826]">
                {t.admin.editProductTitle}
              </h3>
              <span className="text-xs font-mono text-[#55695C]">
                Target: /data/products.json
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="font-bold text-[#143826] block mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#143826]"
                />
              </div>

              <div>
                <label className="font-bold text-[#143826] block mb-1">Serving Size</label>
                <input
                  type="text"
                  value={formData.servingSize}
                  onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                  className="w-full bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-sm text-[#143826]"
                />
              </div>

              <div>
                <label className="font-bold text-[#143826] block mb-1">Net Weight</label>
                <input
                  type="text"
                  value={formData.netWeight}
                  onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
                  className="w-full bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-sm text-[#143826]"
                />
              </div>

              <div>
                <label className="font-bold text-[#143826] block mb-1">Lab Certificate / Protocol ID</label>
                <input
                  type="text"
                  value={formData.labCertificateNo}
                  onChange={(e) => setFormData({ ...formData, labCertificateNo: e.target.value })}
                  className="w-full bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#143826]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-[#143826] block mb-1">Verification Testing Source / Facility</label>
                <input
                  type="text"
                  value={formData.verificationSource}
                  onChange={(e) => setFormData({ ...formData, verificationSource: e.target.value })}
                  className="w-full bg-[#FBF9F4] border border-[#D5C7AA] rounded-xl px-3.5 py-2.5 text-sm text-[#143826]"
                />
              </div>
            </div>

            {/* Nutrition Metrics Numerical Editors */}
            <div className="pt-4 border-t border-[#E3DCce]">
              <h4 className="font-heading text-base font-bold text-[#143826] mb-3">
                Laboratory Metric Values (per 30g serving)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.nutritionMetrics.map((metric, idx) => (
                  <div key={metric.key} className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#DFD6C2] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#143826]">{metric.label.en}</span>
                      <span className="font-mono text-[#55695C]">({metric.unit})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={metric.value !== null ? metric.value : ''}
                        placeholder="Pending (null)"
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          const newMetrics = [...formData.nutritionMetrics];
                          newMetrics[idx] = {
                            ...newMetrics[idx],
                            value: val,
                            status: val !== null ? 'VERIFIED' : 'PENDING',
                          };
                          setFormData({ ...formData, nutritionMetrics: newMetrics });
                        }}
                        className="w-full bg-white border border-[#D5C7AA] rounded-lg px-3 py-1.5 text-sm font-mono text-[#143826]"
                      />
                    </div>

                    <div className="text-[10px] text-[#6B7280]">
                      Status: <strong className={metric.value !== null ? 'text-emerald-700' : 'text-amber-700'}>
                        {metric.value !== null ? 'VERIFIED' : 'PENDING'}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Status & Action Row */}
            <div className="pt-4 border-t border-[#E3DCce] flex flex-wrap items-center justify-between gap-4">
              <div>
                {saveStatus === 'success' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.admin.successMessage}</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-2 rounded-xl border border-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{saveErrorMessage || t.admin.errorMessage}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveProduct}
                disabled={saveStatus === 'saving'}
                className="px-6 py-3 bg-[#143826] hover:bg-[#1F4E36] text-[#D8F3DC] font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#52B788]" />
                <span>{saveStatus === 'saving' ? 'Persisting...' : t.admin.saveChanges}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
