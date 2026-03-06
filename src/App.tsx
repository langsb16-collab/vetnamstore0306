import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, Utensils, Sparkles, GraduationCap, ShoppingBag, 
  Truck, Banknote, Smartphone, FileText, Gamepad2, Home,
  Search, MapPin, Star, MessageCircle, Info, X, Send, 
  Globe, Phone, Video, Mic, Image as ImageIcon, Bot, ChevronDown,
  Activity, Camera
} from 'lucide-react';
// Socket.io removed for Cloudflare Pages
import { Category, Shop, Message, Language } from './types';
import { useLanguage } from './LanguageContext';
import { translateText, getFAQResponse } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, any> = {
  LayoutGrid, Utensils, Sparkles, GraduationCap, ShoppingBag, 
  Truck, Banknote, Smartphone, FileText, Gamepad2, Home, Activity
};

import MapView from './components/MapView';
import MedicalAI from './components/MedicalAI';
import PhotoRestore from './components/PhotoRestore';
import Community from './components/Community';

// --- Components ---

const Header = ({ onRegisterClick, onMedicalClick, onPhotoClick, activeTab, onTabChange }: { 
  onRegisterClick: () => void;
  onMedicalClick: () => void;
  onPhotoClick: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langs: { code: Language; label: string }[] = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: '히न्दी' },
    { code: 'pt', label: 'Português' },
    { code: 'id', label: 'Indonesia' },
  ];

  const tabs = [
    { id: 'shops', label: t('shops') },
    { id: 'jobs', label: t('jobs') },
    { id: 'realestate', label: t('realestate') },
    { id: 'market', label: t('market') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('shops')}>
            <div className="w-10 h-10 bg-[#1428A0] rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
            <h1 className="text-xl font-bold text-[#1428A0] hidden sm:block">K & V Connect</h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-xl transition-all",
                  activeTab === tab.id 
                    ? "text-[#1428A0] bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all",
                activeTab === tab.id 
                  ? "text-[#1428A0] bg-blue-50" 
                  : "text-gray-500"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 mr-4">
            <button 
              onClick={onMedicalClick}
              className="px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Activity size={16} />
              {t('medicalAI')}
            </button>
            <button 
              onClick={onPhotoClick}
              className="px-3 py-2 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} />
              {t('photoRestore')}
            </button>
          </div>

          <button 
            onClick={onRegisterClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FF6A00] text-white rounded-full font-medium hover:bg-[#e65f00] transition-colors"
          >
            <Home size={18} />
            {t('registerShop')}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Globe size={18} className="text-gray-500" />
              <span className="text-sm font-medium uppercase">{language}</span>
              <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2"
                >
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                        language === l.code ? "text-[#1428A0] font-semibold bg-blue-50" : "text-gray-600"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">{t('registerTitle')}</h2>
        <div className="space-y-4">
          <input placeholder={t('registerName')} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1428A0]" />
          <textarea placeholder={t('registerDesc')} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1428A0] h-32" />
          <input placeholder={t('registerAddr')} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1428A0]" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder={t('registerPhone')} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1428A0]" />
            <input placeholder={t('registerHours')} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1428A0]" />
          </div>
          <button className="w-full py-4 bg-[#1428A0] text-white rounded-xl font-bold hover:bg-[#0d1b6b] transition-all mt-4">
            {t('registerSubmit')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CAT_KEY_MAP: Record<string, string> = {
  "음식점": "cats.restaurant",
  "뷰티": "cats.beauty",
  "교육": "cats.education",
  "한국식품마트": "cats.mart",
  "국제택배": "cats.delivery",
  "환전/송금": "cats.exchange",
  "휴대폰": "cats.mobile",
  "행정대행": "cats.agency",
  "오락": "cats.entertainment",
  "생활편의": "cats.convenience"
};

const CategoryFilter = ({ categories, selected, onSelect }: { categories: Category[], selected: number, onSelect: (id: number) => void }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || LayoutGrid;
        const isSelected = selected === cat.id;
        const translationKey = CAT_KEY_MAP[cat.name_ko] || 'cats.restaurant';
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[80px] p-3 rounded-2xl transition-all duration-300 border-2",
              isSelected 
                ? "bg-white border-[#1428A0] shadow-lg scale-105" 
                : "bg-white border-transparent hover:border-gray-200 text-gray-500"
            )}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
              style={{ backgroundColor: isSelected ? cat.color : `${cat.color}15`, color: isSelected ? 'white' : cat.color }}
            >
              <Icon size={24} />
            </div>
            <span className={cn("text-xs font-semibold whitespace-nowrap", isSelected ? "text-[#1428A0]" : "text-gray-500")}>
              {t(translationKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const ShopCard = ({ shop, onOpenDetail, onOpenChat }: { shop: Shop, onOpenDetail: (s: Shop) => void, onOpenChat: (s: Shop) => void }) => {
  const { t, language } = useLanguage();
  const [translatedName, setTranslatedName] = useState(shop.name);

  useEffect(() => {
    if (language !== 'ko') {
      translateText(shop.name, language).then(setTranslatedName);
    } else {
      setTranslatedName(shop.name);
    }
  }, [language, shop.name]);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={shop.thumbnail} 
          alt={shop.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1428A0] uppercase tracking-wider">
          {t(CAT_KEY_MAP[shop.category_name] || 'cats.restaurant')}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{translatedName}</h3>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold text-gray-700">4.8</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin size={14} />
          <span className="truncate">{shop.address}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onOpenDetail(shop)}
            className="py-2.5 px-4 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            {t('detail')}
          </button>
          <button 
            onClick={() => onOpenChat(shop)}
            className="py-2.5 px-4 bg-[#1428A0] text-white rounded-xl font-semibold text-sm hover:bg-[#0d1b6b] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            {t('reservation')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ShopDetailModal = ({ shop, onClose, onOpenChat, onUpdate }: { shop: Shop, onClose: () => void, onOpenChat: (s: Shop) => void, onUpdate: (s: Shop) => void }) => {
  const { t, language } = useLanguage();
  const [translatedName, setTranslatedName] = useState(shop.name);
  const [translatedDesc, setTranslatedDesc] = useState(shop.description);
  const [translatedAddr, setTranslatedAddr] = useState(shop.address);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (language !== 'ko') {
      Promise.all([
        translateText(shop.name, language),
        translateText(shop.description, language),
        translateText(shop.address, language)
      ]).then(([name, desc, addr]) => {
        setTranslatedName(name);
        setTranslatedDesc(desc);
        setTranslatedAddr(addr);
      });
    } else {
      setTranslatedName(shop.name);
      setTranslatedDesc(shop.description);
      setTranslatedAddr(shop.address);
    }
  }, [language, shop.name, shop.description, shop.address]);
  
  const handleVisit = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`, '_blank');
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`/api/shops/${shop.id}/thumbnail`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thumbnail: base64 })
        });
        if (res.ok) {
          onUpdate({ ...shop, thumbnail: base64 });
        }
      } catch (err) {
        console.error("Failed to update thumbnail:", err);
      } finally {
        setIsUpdating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
          <X size={20} />
        </button>
        
        <div className="h-64 sm:h-80 overflow-hidden relative group/img">
          <img src={shop.thumbnail} alt={shop.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => document.getElementById('thumbnail-edit')?.click()}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/40 transition-all transform hover:scale-110 flex flex-col items-center gap-1"
              disabled={isUpdating}
            >
              {isUpdating ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={32} />}
              <span className="text-[10px] font-bold uppercase tracking-tighter">{t('editPhoto')}</span>
            </button>
            <input 
              id="thumbnail-edit"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-bold text-[#1428A0] uppercase tracking-widest mb-1 block">
                {t(CAT_KEY_MAP[shop.category_name] || 'cats.restaurant')}
              </span>
              <h2 className="text-3xl font-bold text-gray-900">{translatedName}</h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl text-amber-600 font-bold">
              <Star size={20} fill="currentColor" />
              <span className="text-lg">4.8</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed">{translatedDesc}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1428A0] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">{t('registerAddr')}</p>
                  <p className="text-sm font-medium text-gray-700">{translatedAddr}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">{t('registerPhone')}</p>
                  <p className="text-sm font-medium text-gray-700">{shop.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Home size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">{t('registerHours')}</p>
                  <p className="text-sm font-medium text-gray-700">{shop.open_hours}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {shop.facebook && <a href={shop.facebook} className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"><Globe size={20} /></a>}
                {shop.instagram && <a href={shop.instagram} className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 hover:scale-110 transition-transform"><Globe size={20} /></a>}
                {shop.whatsapp && <a href={shop.whatsapp} className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 hover:scale-110 transition-transform"><Globe size={20} /></a>}
              </div>
              <button 
                onClick={() => document.getElementById('thumbnail-edit')?.click()}
                className="mt-2 w-full py-2 px-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 text-xs font-bold hover:border-[#1428A0] hover:text-[#1428A0] transition-all flex items-center justify-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating ? <div className="w-4 h-4 border-2 border-[#1428A0] border-t-transparent rounded-full animate-spin" /> : <Camera size={14} />}
                {t('editPhoto')}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleVisit}
              className="py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              {t('visit')}
            </button>
            <button 
              onClick={() => { onOpenChat(shop); onClose(); }}
              className="py-4 px-6 bg-[#1428A0] text-white rounded-2xl font-bold hover:bg-[#0d1b6b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <MessageCircle size={20} />
              {t('reservation')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ChatWindow = ({ shop, onClose }: { shop: Shop, onClose: () => void }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`chat_${shop.id}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [shop.id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      shop_id: shop.id,
      sender: "User",
      text: input,
      translated_text: input,
      created_at: new Date().toISOString()
    };
    
    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem(`chat_${shop.id}`, JSON.stringify(updated));
    setInput("");
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed bottom-0 left-0 w-full sm:w-[400px] h-[60vh] sm:h-[50vh] bg-white border-t sm:border-x border-gray-200 shadow-2xl z-[110] flex flex-col sm:rounded-t-3xl overflow-hidden"
    >
      <div className="p-4 bg-[#1428A0] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {shop.name[0]}
          </div>
          <div>
            <h3 className="font-bold leading-tight">{shop.name}</h3>
            <p className="text-[10px] opacity-70 uppercase tracking-widest">{t('chatTitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Phone size={18} /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Video size={18} /></button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col", msg.sender === "User" ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl shadow-sm",
              msg.sender === "User" ? "bg-[#1428A0] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"
            )}>
              <p className="text-sm">{msg.text}</p>
              {msg.translated_text && (
                <div className={cn("mt-1 pt-1 border-t text-[10px] italic opacity-70", msg.sender === "User" ? "border-white/20" : "border-gray-100")}>
                  {t('translate')}: {msg.translated_text}
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-400 mt-1 px-1">
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <button className="p-2 text-gray-400 hover:text-[#1428A0] transition-colors"><ImageIcon size={20} /></button>
          <button className="p-2 text-gray-400 hover:text-[#1428A0] transition-colors"><Mic size={20} /></button>
          <button className="p-2 text-gray-400 hover:text-[#1428A0] transition-colors"><Globe size={20} /></button>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ko' ? "메시지를 입력하세요..." : "Type a message..."}
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1428A0] transition-all"
          />
          <button 
            onClick={handleSend}
            className="p-2.5 bg-[#1428A0] text-white rounded-xl hover:bg-[#0d1b6b] transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FAQBot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      { role: 'bot', text: language === 'ko' 
        ? "안녕하세요! C-Korea Connect AI 도우미입니다. 상점 정보, AI 의료 영상 분석, 사진 복원 등 무엇이든 물어보세요!" 
        : "Hello! I'm the C-Korea Connect AI Assistant. Ask me anything about shop info, AI medical analysis, or photo restoration!" }
    ]);
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    const response = await getFAQResponse(userMsg, language);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] h-[450px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-[#FF6A00] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <span className="font-bold">{t('faqTitle')}</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' ? "bg-[#FF6A00] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('faqQuestion')}
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF6A00]"
              />
              <button onClick={handleSend} className="p-2 bg-[#FF6A00] text-white rounded-xl"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#FF6A00] text-white rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Bot size={28} />
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeChat, setActiveChat] = useState<Shop | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMedicalOpen, setIsMedicalOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shops');

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    fetch(`/api/shops?categoryId=${selectedCategory}`).then(res => res.json()).then(setShops);
  }, [selectedCategory]);

  const filteredShops = shops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleUpdateShop = (updatedShop: Shop) => {
    setShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));
    if (selectedShop?.id === updatedShop.id) setSelectedShop(updatedShop);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900">
        <Header 
          onRegisterClick={() => setIsRegisterOpen(true)} 
          onMedicalClick={() => setIsMedicalOpen(true)}
          onPhotoClick={() => setIsPhotoOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="max-w-7xl mx-auto px-4 py-8 mt-12 md:mt-0">
          {activeTab === 'shops' ? (
            <>
              {/* Hero Section */}
              <section className="mb-12 text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-extrabold text-[#1428A0] mb-4 tracking-tight"
                >
                  K & V Connect
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-500 max-w-2xl mx-auto"
                >
                  {t('subtitle')}
                </motion.p>
              </section>

              {/* Search & Filter */}
              <div className="mb-10 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#1428A0] focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                        viewMode === 'grid' ? "bg-[#1428A0] text-white" : "text-gray-400 hover:text-gray-600"
                      )}
                      title={t('gridView')}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode('map')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                        viewMode === 'map' ? "bg-[#1428A0] text-white" : "text-gray-400 hover:text-gray-600"
                      )}
                      title={t('mapView')}
                    >
                      <MapPin size={18} />
                    </button>
                  </div>
                </div>
                
                <CategoryFilter 
                  categories={categories} 
                  selected={selectedCategory} 
                  onSelect={setSelectedCategory} 
                />
              </div>

              {/* Content Area */}
              <div className="min-h-[500px]">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredShops.map((shop) => (
                        <ShopCard 
                          key={shop.id} 
                          shop={shop} 
                          onOpenDetail={setSelectedShop} 
                          onOpenChat={setActiveChat}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-[600px] rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl">
                    <MapView 
                      shops={filteredShops} 
                      onMarkerClick={(shop) => setSelectedShop(shop)} 
                    />
                  </div>
                )}
                
                {filteredShops.length === 0 && (
                  <div className="text-center py-20">
                    <Info size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">{t('noShops')}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Community 
              category={activeTab as 'job' | 'realestate' | 'market'} 
              onBack={() => setActiveTab('shops')}
            />
          )}
        </main>

        {/* Modals & Overlays */}
        <AnimatePresence>
          {isRegisterOpen && (
            <RegisterModal onClose={() => setIsRegisterOpen(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMedicalOpen && (
            <MedicalAI onClose={() => setIsMedicalOpen(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPhotoOpen && (
            <PhotoRestore onClose={() => setIsPhotoOpen(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedShop && (
            <ShopDetailModal 
              shop={selectedShop} 
              onClose={() => setSelectedShop(null)} 
              onOpenChat={setActiveChat}
              onUpdate={handleUpdateShop}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {activeChat && (
            <ChatWindow 
              shop={activeChat} 
              onClose={() => setActiveChat(null)} 
            />
          )}
        </AnimatePresence>

        <FAQBot />

        <div className="fixed bottom-24 right-6 z-[120] flex flex-col gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMedicalOpen(true)}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center"
            title={t('medicalAI')}
          >
            <Activity size={24} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPhotoOpen(true)}
            className="w-12 h-12 bg-purple-600 text-white rounded-2xl shadow-lg flex items-center justify-center"
            title={t('photoRestore')}
          >
            <Sparkles size={24} />
          </motion.button>
        </div>

        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#1428A0] rounded-lg flex items-center justify-center text-white font-bold">C</div>
              <span className="text-lg font-bold text-[#1428A0]">K & V Connect</span>
            </div>
            <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
              베트남 거주 한국인 소상공인을 위한 무료 홍보 플랫폼입니다. 
              우리는 지역 경제 활성화와 교민 사회의 연결을 지향합니다.
            </p>
            <div className="flex justify-center gap-6 text-gray-400 text-sm font-medium">
              <a href="#" className="hover:text-[#1428A0]">Terms</a>
              <a href="#" className="hover:text-[#1428A0]">Privacy</a>
              <a href="#" className="hover:text-[#1428A0]">Contact</a>
            </div>
            <p className="text-[10px] text-gray-300 mt-12 uppercase tracking-widest">© 2026 K & V Connect. All rights reserved.</p>
          </div>
        </footer>
      </div>
  );
}
