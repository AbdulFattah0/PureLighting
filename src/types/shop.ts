import type { Product as DatabaseProduct } from '@/lib/supabase';

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[];
  badge: string | null;
  description: string;
  specs: string[];
};

export type CartItem = { product: StoreProduct; quantity: number };
export type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'about' | 'contact' | 'admin';
export type Collection = 'all' | 'new' | 'best';

export function toStoreProduct(product: DatabaseProduct): StoreProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.old_price,
    image: product.image,
    images: product.images?.length ? product.images : [product.image],
    badge: product.badge,
    description: product.description,
    specs: Array.isArray(product.specs) ? product.specs : [],
  };
}

export function money(value: number) {
  return `EGP ${value.toLocaleString('en-US')}`;
}


