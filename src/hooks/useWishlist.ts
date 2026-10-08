import { useState } from 'react';

function readWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem('pure-wishlist') || '[]') as string[]; } catch { return []; }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(readWishlist);

  function toggleWishlist(id: string) {
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id];
    localStorage.setItem('pure-wishlist', JSON.stringify(next));
    setWishlist(next);
  }

  return { wishlist, toggleWishlist };
}
