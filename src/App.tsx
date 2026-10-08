import { useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';
import type { Collection, Page, StoreProduct } from '@/types/shop';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Account from '@/pages/Account';
import AdminPage from '@/pages/AdminPage';

const ADMIN_PATH = '/pure-lighting-control';
const ADMIN_HASH = '#pure-lighting-control';

export default function App() {
  const { products, loading } = useProducts();
  const { cart, cartCount, cartTotal, addToCart, updateQuantity, clearCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [page, setPage] = useState<Page>(() => (window.location.pathname.endsWith(ADMIN_PATH) || window.location.hash === ADMIN_HASH) ? 'admin' : 'home');
  const [collection, setCollection] = useState<Collection>('all');
  const [category, setCategory] = useState('All products');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [notice, setNotice] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All products' || product.category === category;
    const matchesCollection = collection === 'all' || (collection === 'new' ? product.badge === 'New' : product.badge === 'Bestseller');
    const matchesQuery = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesCollection && matchesQuery;
  }), [products, collection, category, query]);

  function navigate(nextPage: Page) {
    setPage(nextPage);
    setMenuOpen(false);
    window.history.pushState({}, '', nextPage === 'admin' ? window.location.pathname + ADMIN_HASH : import.meta.env.BASE_URL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAddToCart(product: StoreProduct) {
    addToCart(product);
    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(''), 2600);
  }

  function openProduct(product: StoreProduct) {
    setSelectedProduct(product);
    navigate('product');
  }

  function showCollection(nextCollection: Collection) {
    setCollection(nextCollection);
    setCategory('All products');
    navigate('shop');
  }

  if (page === 'admin') return <AdminPage onBack={() => navigate('home')} />;

  return <div className="app-shell"><Header wishlistCount={wishlist.length} cartCount={cartCount} menuOpen={menuOpen} searchOpen={searchOpen} query={query} onNavigate={(nextPage) => { if (nextPage === 'shop') showCollection('all'); else navigate(nextPage); }} onCollection={showCollection} onMenuToggle={() => setMenuOpen((open) => !open)} onSearchToggle={() => setSearchOpen((open) => !open)} onQueryChange={setQuery} onAccount={() => setAuthOpen(true)} />
    <main>{loading ? <div className="loading-state"><Loader2 size={32} className="spin" /><p>Loading the collection...</p></div> : <>
      {page === 'home' && <Home products={products} wishlist={wishlist} onShop={() => showCollection('all')} onCategory={(name) => { setCategory(name === 'Lighting' ? 'All products' : name); navigate('shop'); }} onProduct={openProduct} onToggleWishlist={toggleWishlist} onAddToCart={handleAddToCart} />}
      {page === 'shop' && <Shop products={filteredProducts} collection={collection} query={query} category={category} onQueryChange={setQuery} onCategoryChange={(value) => { setCategory(value); setCollection('all'); }} wishlist={wishlist} onProduct={openProduct} onToggleWishlist={toggleWishlist} onAddToCart={handleAddToCart} />}
      {page === 'product' && selectedProduct && <ProductDetails product={selectedProduct} relatedProducts={products.filter((item) => item.id !== selectedProduct.id).slice(0, 4)} wishlist={wishlist} onBack={() => navigate('shop')} onProduct={openProduct} onAddToCart={handleAddToCart} onToggleWishlist={toggleWishlist} />}
      {page === 'cart' && <Cart cart={cart} total={cartTotal} onUpdateQuantity={updateQuantity} onContinue={() => showCollection('all')} onCheckout={() => navigate('checkout')} />}
      {page === 'checkout' && <Checkout cart={cart} total={cartTotal} orderPlaced={orderPlaced} onBack={() => navigate('cart')} onComplete={() => { setOrderPlaced(true); clearCart(); }} onHome={() => window.location.reload()} />}
      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}
      {page === 'account' && <Account wishlist={wishlist} products={products} onProduct={openProduct} onRemove={toggleWishlist} onSignIn={() => setAuthOpen(true)} onAddToCart={handleAddToCart} />}
    </>}</main>
    <Footer onNavigate={(nextPage) => nextPage === 'shop' ? showCollection('all') : navigate(nextPage)} />
    {notice && <div className="toast"><Check size={17} />{notice}</div>}
    {authOpen && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthOpen(false)} />}
  </div>;
}




