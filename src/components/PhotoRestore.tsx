import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Sparkles, Download, Play, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { restorePhotoAI } from '../services/geminiService';

export default function PhotoRestore({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ restoredImageUrl: string; videoUrl: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleRestore = async () => {
    if (!preview) return;
    setIsLoading(true);
    const base64 = preview.split(',')[1];
    const mimeType = file?.type || 'image/jpeg';
    const restoration = await restorePhotoAI(base64, mimeType);
    if (restoration) {
      setResult({
        restoredImageUrl: restoration.restoredImageUrl,
        videoUrl: restoration.videoUrl,
        description: restoration.description || ""
      });
    }
    setIsLoading(false);
  };

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
        className="relative w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('photoTitle')}</h2>
            <p className="text-sm text-gray-500">{t('photoDesc')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden group"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {preview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">{t('original')}</p>
                  <img src={preview} alt="Original" className="rounded-xl w-full aspect-square object-cover" />
                </div>
                {result && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-purple-500 uppercase">{t('restored')}</p>
                    <img src={result.restoredImageUrl} alt="Restored" className="rounded-xl w-full aspect-square object-cover border-2 border-purple-200" />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8">
                <Upload size={48} className="mx-auto text-gray-300 mb-4 group-hover:text-purple-400 transition-colors" />
                <p className="text-gray-500 font-medium">{t('photoDesc')}</p>
              </div>
            )}
            <input 
              id="photo-upload"
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button 
            onClick={handleRestore}
            disabled={!file || isLoading}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={20} />
            )}
            {t('restore')}
          </button>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100"
            >
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                <video 
                  src={result.videoUrl} 
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Play size={48} className="text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <ImageIcon size={18} />
                  {t('downloadReport')}
                </button>
                <button className="py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />
                  {t('downloadVideo')}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
