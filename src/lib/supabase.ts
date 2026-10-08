import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  image: string;
  images: string[];
  badge: string | null;
  description: string;
  specs: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;


