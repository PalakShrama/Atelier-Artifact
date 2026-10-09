'use client';

import { useCart } from './CartProvider';

export default function AddToCartButton({ product, imageUrl }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(product, imageUrl)}
      className="w-full rounded-full bg-amber-200 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-amber-100"
    >
      Add to Cart
    </button>
  );
}
