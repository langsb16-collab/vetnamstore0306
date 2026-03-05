import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, X, Image as ImageIcon, Video, Phone, 
  Calendar, MessageSquare, ChevronRight, Search,
  Briefcase, Home, ShoppingBag, ArrowLeft, Star, Info
} from 'lucide-react';
import { Post } from '../types';
import { useLanguage } from '../LanguageContext';

interface CommunityProps {
  category: 'job' | 'realestate' | 'market';
  onBack?: () => void;
}

const Community: React.FC<CommunityProps> = ({ category, onBack }) => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts?category=${category}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const getCategoryIcon = () => {
    switch (category) {
      case 'job': return <Briefcase className="text-blue-500" />;
      case 'realestate': return <Home className="text-emerald-500" />;
      case 'market': return <ShoppingBag className="text-orange-500" />;
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'job': return t('jobs');
      case 'realestate': return t('realestate');
      case 'market': return t('market');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              {getCategoryIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
              <p className="text-sm text-gray-500">{posts.length} {t('all')}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#1428A0] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0F1E7A] transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          {t('createPost')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#1428A0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500 font-medium">{t('noShops')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-blue-100"
            >
              <div className="flex gap-4">
                {post.image && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={post.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-[#1428A0] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400" />
                      {Math.floor(Math.random() * 50) + 10}
                    </div>
                    {post.video && (
                      <div className="flex items-center gap-1 text-blue-500 font-medium">
                        <Video size={14} />
                        Video
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <PostCreateModal 
            category={category} 
            onClose={() => setIsCreateModalOpen(false)} 
            onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchPosts();
            }}
          />
        )}
        {selectedPost && (
          <PostDetailModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PostCreateModal: React.FC<{ category: string, onClose: () => void, onSuccess: () => void }> = ({ category, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') setImage(reader.result as string);
      else setVideo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, content, contact, image, video })
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t('createPost')}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('postTitle')}</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1428A0] focus:bg-white rounded-2xl outline-none transition-all"
                placeholder={t('postTitle')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('postContent')}</label>
              <textarea 
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1428A0] focus:bg-white rounded-2xl outline-none transition-all resize-none"
                placeholder={t('postContent')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('postContact')}</label>
              <input 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1428A0] focus:bg-white rounded-2xl outline-none transition-all"
                placeholder="Phone, Email, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden" 
                  id="post-image" 
                />
                <label 
                  htmlFor="post-image"
                  className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${image ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
                >
                  <ImageIcon size={24} />
                  <span className="text-xs font-bold">{t('postImage')}</span>
                </label>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden" 
                  id="post-video" 
                />
                <label 
                  htmlFor="post-video"
                  className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${video ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
                >
                  <Video size={24} />
                  <span className="text-xs font-bold">{t('postVideo')}</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#1428A0] text-white rounded-2xl font-bold text-lg hover:bg-[#0F1E7A] transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50"
            >
              {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : t('postSubmit')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const PostDetailModal: React.FC<{ post: Post, onClose: () => void }> = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
          <X size={24} />
        </button>

        {post.image && (
          <div className="w-full h-80 overflow-hidden">
            <img src={post.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
            <Calendar size={14} />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h2>
          
          <div className="prose prose-blue max-w-none mb-8">
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
              {post.content}
            </p>
          </div>

          {post.video && (
            <div className="mb-8 rounded-2xl overflow-hidden bg-black aspect-video">
              <video controls className="w-full h-full">
                <source src={post.video} />
              </video>
            </div>
          )}

          {post.contact && (
            <div className="p-6 bg-blue-50 rounded-2xl flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Contact Info</p>
                  <p className="text-lg font-bold text-gray-900">{post.contact}</p>
                </div>
              </div>
              <a 
                href={`tel:${post.contact}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                Contact Now
              </a>
            </div>
          )}

          <div className="flex justify-end">
            <button className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <Info size={14} />
              Report this post
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Community;
