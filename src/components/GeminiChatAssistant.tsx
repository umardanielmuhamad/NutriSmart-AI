import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  RotateCcw, 
  Globe, 
  HelpCircle, 
  CheckCircle2, 
  User,
  Wheat,
  Lightbulb
} from 'lucide-react';
import { Language, ProductData, ChatMessage } from '../types/product';
import { translations } from '../utils/translations';

interface GeminiChatAssistantProps {
  currentLang: Language;
  product: ProductData | null;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export const GeminiChatAssistant: React.FC<GeminiChatAssistantProps> = ({
  currentLang,
  product,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: currentLang === 'ms'
        ? 'Salam sejahtera! Saya ialah NutriSmart AI, pembantu sains pemakanan rasmi untuk inovasi SorghuBites. Saya boleh menerangkan fungsi tepung sorgum, kurma, madu, mentega, atau konsep pemakanan berkhasiat. Apakah yang ingin anda ketahui hari ini?'
        : 'Welcome! I am NutriSmart AI, the dedicated food science and nutrition assistant for SorghuBites. I can explain the baking science of sorghum flour, the role of natural fruit sweeteners, and nutrition concepts. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundingStatus: 'GROUNDED_SORGHUBITES',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle passed initial question
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const handleSendMessage = async (userPromptText?: string) => {
    const textToSend = (userPromptText || inputValue).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: currentLang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          language: currentLang,
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to receive reply from NutriSmart AI.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: currentLang,
        groundingStatus: data.groundingStatus || 'GROUNDED_SORGHUBITES',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: currentLang === 'ms'
          ? 'Perbualan telah dibersihkan. Sila ajukan sebarang soalan mengenai formulasi dan sains makanan SorghuBites!'
          : 'Conversation cleared. Feel free to ask any question regarding SorghuBites formulation and food science!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingStatus: 'GROUNDED_SORGHUBITES',
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header Banner */}
      <div className="border-b border-[#E3DCce] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143826] text-[#E9C46A] text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>{t.ai.badge}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
            {t.ai.title}
          </h1>
          <p className="text-sm text-[#4A6B53] mt-1 max-w-2xl">
            {t.ai.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 text-xs font-semibold text-[#55695C] hover:text-[#143826] bg-white rounded-xl border border-[#D5C7AA] hover:bg-[#F4EFE6] transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Grounding Safety Notice */}
      <div className="bg-[#FAF7F0] border border-[#E3DCce] p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#55695C]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2D5A40] shrink-0" />
          <span>
            {t.ai.disclaimer}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase font-bold text-[#2D5A40] bg-emerald-100/80 px-2 py-0.5 rounded-md hidden md:inline">
          Server-Side Gemini 3.8
        </span>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-[#E3DCce] shadow-sm flex flex-col h-[560px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FDFBF7]/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#143826] text-[#E9C46A] flex items-center justify-center shrink-0 shadow-xs border border-[#2D5A40]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#143826] text-white rounded-tr-xs shadow-md'
                      : 'bg-white text-[#17261D] rounded-tl-xs border border-[#E8E1D3] shadow-xs'
                  }`}
                >
                  {/* Assistant Header Tag */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 border-b border-[#F0EBE0] pb-1.5 mb-2 text-[10px] font-mono text-[#52796F]">
                      <span className="font-bold text-[#143826] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#E9C46A]" />
                        NutriSmart AI
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Message Body with clean paragraph breaks */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text}
                  </div>

                  {/* User Timestamp */}
                  {isUser && (
                    <div className="text-right text-[10px] text-[#B7E4C7]/80 mt-1.5 font-mono">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#52B788] text-[#0E281B] flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#143826] text-[#E9C46A] flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl p-4 text-xs text-[#55695C] border border-[#E8E1D3] shadow-xs flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#40916C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-[#40916C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-[#40916C] rounded-full animate-bounce" />
                </div>
                <span>{t.ai.typing}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Bar */}
        <div className="px-4 py-2.5 bg-[#FAF7F0] border-t border-[#ECE5D8] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-[#143826] flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#E9C46A]" />
              {currentLang === 'ms' ? 'Soalan Cadangan:' : 'Suggested:'}
            </span>
            {t.ai.questions.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#F2ECE0] text-[#143826] rounded-lg border border-[#D5C7AA] transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-[#E3DCce] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.ai.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 bg-[#FBF9F4] border border-[#D5C7AA] focus:border-[#143826] focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-[#17261D] placeholder-[#88998C]"
          />
          <button
            type="submit"
            disabled={isLoading || inputValue.trim().length === 0}
            className="px-5 py-3 bg-[#143826] hover:bg-[#1B4332] text-[#D8F3DC] font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4 text-[#52B788]" />
            <span className="hidden sm:inline">{t.ai.send}</span>
          </button>
        </form>

      </div>

      {/* Suggested Questions Grid (Bottom Educational Deck) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E3DCce] shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#143826] uppercase tracking-wider flex items-center gap-2">
          <Wheat className="w-4 h-4 text-[#A66D38]" />
          <span>{t.ai.suggestedQuestionsTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {t.ai.questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-left text-xs p-3 rounded-xl bg-[#FBF9F4] hover:bg-[#F4EFE6] text-[#2D3748] border border-[#ECE5D8] hover:border-[#D5C7AA] transition-all flex items-start gap-2"
            >
              <span className="text-[#52B788] font-bold mt-0.5">•</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
