import { ArrowRight, Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { logo } from '@/data/site';
import type { Collection, Page } from '@/types/shop';

type HeaderProps = {
  wishlistCount: number;
  cartCount: number;
  menuOpen: boolean;
  searchOpen: boolean;
  query: string;
  onNavigate: (page: Page) => void;
  onCollection: (collection: Collection) => void;
  onMenuToggle: () => void;
  onSearchToggle: () => void;
  onQueryChange: (value: string) => void;
  onAccount: () => void;
};

export default function Header({ wishlistCount, cartCount, menuOpen, searchOpen, query, onNavigate, onCollection, onMenuToggle, onSearchToggle, onQueryChange, onAccount }: HeaderProps) {
  const navigation = ['Home', 'Shop', 'Categories', 'New Arrivals', 'Best Sellers', 'About Us', 'Contact'];
  function handleNavigation(item: string) {
    if (item === 'New Arrivals') { onCollection('new'); return; }
    if (item === 'Best Sellers') { onCollection('best'); return; }
    const pages: Record<string, Page> = { Home: 'home', Shop: 'shop', Categories: 'shop', 'About Us': 'about', Contact: 'contact' };
    onNavigate(pages[item]);
  }

  return <>
    <div className="announcement"><span>Complimentary delivery on orders over EGP 5,000</span><span className="announcement-link">Explore our new collection <ArrowRight size={14} /></span></div>
    <header className="site-header">
      <button className="mobile-menu" onClick={onMenuToggle} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
      <button className="brand" onClick={() => onNavigate('home')}><img src={logo} alt="Pure Lighting" /><span>PURE <b>LIGHTING</b></span></button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
        {navigation.map((item) => <button key={item} onClick={() => handleNavigation(item)}>{item}</button>)}

      </nav>
      <div className="header-actions">
        <button aria-label="Search" onClick={onSearchToggle}><Search size={19} /></button>
        <button aria-label="Wishlist" onClick={() => onNavigate('account')}><Heart size={19} /><i>{wishlistCount}</i></button>
        <button aria-label="Account" onClick={onAccount}><UserRound size={19} /></button>
        <button aria-label="Cart" onClick={() => onNavigate('cart')}><ShoppingBag size={19} /><i>{cartCount}</i></button>
      </div>
    </header>
    {searchOpen && <div className="search-drawer"><Search size={20} /><input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && onNavigate('shop')} placeholder="Search by product, category or SKU" /><button onClick={onSearchToggle}><X size={18} /></button></div>}
  </>;
}

