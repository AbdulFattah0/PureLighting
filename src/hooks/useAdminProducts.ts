import { useCallback, useEffect, useState } from 'react';
import { supabase, type Product, type ProductInput } from '@/lib/supabase';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (fetchError) setError(`Could not load products: ${fetchError.message}`);
    else setProducts((data as Product[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function save(input: ProductInput, id?: string, imageFiles: File[] = []) {
    let uploadedImages = input.images || [];
    if (imageFiles.length) {
      const results = await Promise.all(imageFiles.map(async (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const upload = await supabase.storage.from('product-images').upload(fileName, file, { upsert: false });
        if (upload.error) return null;
        return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
      }));
      if (results.some((url) => !url)) { setError('One or more images could not be uploaded. Please run the Supabase image migration and try again.'); return false; }
      uploadedImages = [...uploadedImages, ...results.filter((url): url is string => Boolean(url))];
    }
    const payload = { ...input, images: uploadedImages, image: uploadedImages[0] || input.image };
    let result = id ? await supabase.from('products').update(payload).eq('id', id) : await supabase.from('products').insert(payload);
    if (result.error && id && !imageFiles.length && /images|column/i.test(result.error.message)) {
      const { images: _images, ...legacyPayload } = payload;
      result = await supabase.from('products').update(legacyPayload).eq('id', id);
    }
    if (result.error) {
      const action = id ? 'update' : 'add';
      setError(`Failed to ${action} product: ${result.error.message}`);
      return false;
    }
    await refresh();
    return true;
  }

  async function remove(id: string) {
    const result = await supabase.from('products').delete().eq('id', id);
    if (result.error) { setError(`Failed to delete product: ${result.error.message}`); return false; }
    await refresh();
    return true;
  }

  return { products, loading, error, setError, save, remove };
}
