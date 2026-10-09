'use client';

import { useCart } from './CartProvider';

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      className="relative rounded-full border border-white/10 p-2 transition hover:border-amber-200 hover:text-amber-200"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7a3 3 0 016 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full bg-amber-200 px-1 text-center text-[10px] font-semibold leading-[18px] text-black">
          {count}
        </span>
      )}
    </button>
  );
}
