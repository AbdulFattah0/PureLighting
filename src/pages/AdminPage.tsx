import { ArrowLeft, Check, Loader2, Package, Plus, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import ProductFormModal, { emptyProductForm } from '@/components/admin/ProductFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ProductTable from '@/components/admin/ProductTable';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import type { Product, ProductInput } from '@/lib/supabase';

const categoryOptions = ['Pendant Lights', 'Chandeliers', 'Wall Lights', 'Ceiling Lights', 'Floor Lamps', 'Audio Systems'];

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const { products, loading, error, setError, save, remove } = useAdminProducts();
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyProductForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [specsText, setSpecsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  function showToast(message: string) { setNotice(message); window.setTimeout(() => setNotice(''), 2800); }
  function openAdd() { setEditingId(null); setForm({ ...emptyProductForm }); setImageFiles([]); setSpecsText(''); setShowForm(true); }
  function openEdit(product: Product) { const images = product.images?.length ? product.images : [product.image]; setEditingId(product.id); setForm({ name: product.name, category: product.category, price: product.price, old_price: product.old_price, image: images[0] || '', images, badge: product.badge, description: product.description, specs: product.specs || [], sort_order: product.sort_order }); setImageFiles([]); setSpecsText((product.specs || []).join('\n')); setShowForm(true); }
  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.category.trim() || (!form.image.trim() && !form.images.length && !imageFiles.length) || !form.description.trim()) { setError('Please add at least one product photo and fill in all required fields.'); return; }
    setSaving(true);
    const payload = { ...form, price: Number(form.price) || 0, old_price: form.old_price ? Number(form.old_price) : null, badge: form.badge || null, specs: specsText.split('\n').map((item) => item.trim()).filter(Boolean), sort_order: Number(form.sort_order) || 0 };
    try {
      const success = await save(payload, editingId || undefined, imageFiles);
      if (success) { setShowForm(false); setImageFiles([]); showToast(`${payload.name} ${editingId ? 'updated' : 'added'}`); }
    } finally { setSaving(false); }
  }
  async function handleDelete() { if (!deleteId) return; const product = products.find((item) => item.id === deleteId); const success = await remove(deleteId); setDeleteId(null); if (success) showToast(`${product?.name || 'Product'} deleted`); }

  const filteredProducts = products.filter((product) => (filterCategory === 'All' || product.category === filterCategory) && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase()));
  const categories = ['All', ...categoryOptions];

  return <div className="admin-shell"><div className="admin-header"><button className="admin-back" onClick={onBack}><ArrowLeft size={18} /> Back to store</button><div className="admin-header-center"><Package size={22} /><h1>Product Admin</h1></div><button className="button button-dark admin-add-btn" onClick={openAdd}><Plus size={16} /> Add product</button></div><div className="admin-toolbar"><div className="admin-filters">{categories.map((category) => <button key={category} className={filterCategory === category ? 'selected' : ''} onClick={() => setFilterCategory(category)}>{category}</button>)}</div><div className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></div></div>{error && <div className="admin-error">{error}</div>}{loading ? <div className="admin-loading"><Loader2 size={28} className="spin" /><p>Loading products...</p></div> : filteredProducts.length ? <ProductTable products={filteredProducts} onEdit={openEdit} onDelete={setDeleteId} /> : <div className="admin-empty"><Package size={36} /><h3>No products found</h3><p>{products.length === 0 ? 'Add your first product to get started.' : 'Try a different search or filter.'}</p>{products.length === 0 && <button className="button button-dark" onClick={openAdd}><Plus size={16} /> Add product</button>}</div>}<div className="admin-stats"><span><strong>{products.length}</strong> total products</span><span><strong>{products.filter((product) => product.badge === 'New').length}</strong> new arrivals</span><span><strong>{products.filter((product) => product.badge === 'Bestseller').length}</strong> bestsellers</span><span><strong>{categoryOptions.length}</strong> categories</span></div>{showForm && <ProductFormModal editing={Boolean(editingId)} form={form} specsText={specsText} saving={saving} onFormChange={setForm} onSpecsChange={setSpecsText} onImagesChange={setImageFiles} onSubmit={handleSave} onClose={() => !saving && setShowForm(false)} />}{deleteId && <DeleteConfirmModal productName={products.find((product) => product.id === deleteId)?.name || 'This product'} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />}{notice && <div className="toast"><Check size={17} />{notice}</div>}</div>;
}




