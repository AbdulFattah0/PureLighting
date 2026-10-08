import { Heart, Plus } from 'lucide-react';
import { money, type StoreProduct } from '@/types/shop';

type ProductCardProps = { product: StoreProduct; wishlist: string[]; onProduct: (product: StoreProduct) => void; onToggleWishlist: (id: string) => void; onAddToCart: (product: StoreProduct) => void };

export default function ProductCard({ product, wishlist, onProduct, onToggleWishlist, onAddToCart }: ProductCardProps) {
  const isWishlisted = wishlist.includes(product.id);
  return <article className="product-card"><div className="product-image" onClick={() => onProduct(product)}><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<button className={`wish ${isWishlisted ? 'active' : ''}`} onClick={(event) => { event.stopPropagation(); onToggleWishlist(product.id); }} aria-label="Add to wishlist"><Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={(event) => { event.stopPropagation(); onAddToCart(product); }}>Quick add <Plus size={15} /></button></div><div className="product-info" onClick={() => onProduct(product)}><p>{product.category}</p><h3>{product.name}</h3><div><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div></div></article>;
}
