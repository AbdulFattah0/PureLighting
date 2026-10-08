import { Edit3, Image as ImageIcon, Trash2 } from 'lucide-react';
import { money } from '@/types/shop';
import type { Product } from '@/lib/supabase';

type ProductTableProps = { products: Product[]; onEdit: (product: Product) => void; onDelete: (id: string) => void };

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Old Price</th><th>Badge</th><th>Order</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="admin-thumb">{product.image ? <img src={product.image} alt={product.name} /> : <ImageIcon size={18} />}</div></td><td className="admin-name-cell"><strong>{product.name}</strong><span>{product.description.slice(0, 60)}{product.description.length > 60 ? '...' : ''}</span></td><td>{product.category}</td><td className="admin-price-cell">{money(product.price)}</td><td className="admin-price-cell">{product.old_price ? money(product.old_price) : <span className="admin-dash">—</span>}</td><td>{product.badge ? <span className={`admin-badge admin-badge-${product.badge.toLowerCase()}`}>{product.badge}</span> : <span className="admin-dash">—</span>}</td><td className="admin-order-cell">{product.sort_order}</td><td><div className="admin-row-actions"><button className="admin-edit" onClick={() => onEdit(product)} aria-label="Edit"><Edit3 size={16} /></button><button className="admin-delete" onClick={() => onDelete(product.id)} aria-label="Delete"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>;
}
