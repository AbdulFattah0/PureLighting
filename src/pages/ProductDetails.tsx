import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { money, type StoreProduct } from '@/types/shop';
import ProductCard from '@/components/ProductCard';

type ProductDetailsProps = { product: StoreProduct; relatedProducts: StoreProduct[]; wishlist: string[]; onBack: () => void; onProduct: (product: StoreProduct) => void; onAddToCart: (product: StoreProduct) => void; onToggleWishlist: (id: string) => void };

export default function ProductDetails({ product, relatedProducts, wishlist, onBack, onProduct, onAddToCart, onToggleWishlist }: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(product.images[0] || product.image);
  useEffect(() => setActiveImage(product.images[0] || product.image), [product.id, product.image, product.images]);
  const wishlisted = wishlist.includes(product.id);
  return <section className="product-detail section-pad"><button className="back-link" onClick={onBack}><ChevronLeft size={17} /> Back to collection</button><div className="product-detail-grid"><div><div className="detail-image"><img src={activeImage} alt={product.name} /><span className="image-stamp">PURE<br /><small>LIGHTING</small></span></div>{product.images.length > 1 && <div className="detail-thumbnails">{product.images.map((image) => <button type="button" className={activeImage === image ? "active" : ""} key={image} onClick={() => setActiveImage(image)}><img src={image} alt="" /></button>)}</div>}</div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><div className="detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <><del>{money(product.oldPrice)}</del><span>Save {money(product.oldPrice - product.price)}</span></>}</div><p className="availability"><span /> In stock · Ready to dispatch</p><p className="detail-description">{product.description}</p><div className="detail-actions"><div className="quantity"><Minus size={15} /><span>1</span><Plus size={15} /></div><button className="button button-dark add-large" onClick={() => onAddToCart(product)}>Add to bag <ShoppingBag size={17} /></button><button className={`detail-wish ${wishlisted ? 'active' : ''}`} onClick={() => onToggleWishlist(product.id)}><Heart size={19} fill={wishlisted ? 'currentColor' : 'none'} /></button></div><div className="delivery-note"><Truck size={20} /><div><b>Delivered with care</b><span>Complimentary delivery on orders over EGP 5,000</span></div></div><div className="detail-specs"><div className="spec-title">Details <ChevronDown size={17} /></div>{product.specs.map((spec) => <div className="spec-row" key={spec}><span>•</span>{spec}</div>)}</div></div></div><div className="related-heading"><p className="eyebrow">COMPLETE THE ROOM</p><h2>You may also <i>like.</i></h2></div><div className="product-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} wishlist={wishlist} onProduct={onProduct} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />)}</div></section>;
}




