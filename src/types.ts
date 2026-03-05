export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'ru' | 'hi' | 'pt' | 'id';

export interface Category {
  id: number;
  name_ko: string;
  name_en: string;
  icon: string;
  color: string;
}

export interface Shop {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  description: string;
  address: string;
  phone: string;
  open_hours: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  facebook?: string;
  instagram?: string;
  x_link?: string;
  whatsapp?: string;
  created_at: string;
}

export interface Message {
  id: number;
  shop_id: number;
  sender: string;
  text: string;
  translated_text?: string;
  created_at: string;
}

export interface Post {
  id: number;
  category: string;
  title: string;
  content: string;
  image?: string;
  video?: string;
  contact?: string;
  created_at: string;
}
