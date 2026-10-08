import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { toStoreProduct, type StoreProduct } from '@/types/shop';

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
      if (!cancelled && !error) setProducts((data as Product[]).map(toStoreProduct));
      if (!cancelled) setLoading(false);
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  return { products, loading };
}
