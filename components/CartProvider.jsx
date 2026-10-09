'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import cfg from '../store.config.json';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const MAX_QTY = 10;
const money = (n) => `${cfg.site.currencySymbol}${n.toLocaleString('en-IN')}`;

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ busy: false, msg: '', ok: false });

  // Load the saved cart once, then keep it saved on every change
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('cart', JSON.stringify(items)); } catch {}
  }, [items, ready]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const add = (p, image) => {
    setStatus({ busy: false, msg: '', ok: false });
    setItems((prev) => {
      const found = prev.find((i) => i.id === p._id);
      if (found) return prev.map((i) => (i.id === p._id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i));
      return [...prev, { id: p._id, slug: p.slug, title: p.title, price: p.price, image: image || '', qty: 1 }];
    });
    setOpen(true);
  };
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : i)));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const checkout = async () => {
    if (!items.length || status.busy) return;
    setStatus({ busy: true, msg: '', ok: false });
    try {
      if (!window.Razorpay) throw new Error('Payment window did not load. Refresh and try again.');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) }), // prices are looked up on the server
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment.');

      const rz = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: cfg.site.name,
        description: `${count} item${count > 1 ? 's' : ''}`,
        order_id: data.orderId,
        theme: { color: '#B45309' },
        handler: async (response) => {
          const v = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (v.ok) {
            setItems([]);
            setStatus({ busy: false, ok: true, msg: `Payment confirmed. Reference: ${response.razorpay_payment_id}` });
          } else {
            setStatus({ busy: false, ok: false, msg: 'We could not verify your payment. Please contact us with your payment ID.' });
          }
        },
        modal: { ondismiss: () => setStatus({ busy: false, ok: false, msg: 'Checkout closed. Your cart is saved.' }) },
      });
      rz.on('payment.failed', () => setStatus({ busy: false, ok: false, msg: 'Payment failed. Please try again.' }));
      rz.open();
    } catch (err) {
      setStatus({ busy: false, ok: false, msg: err.message || 'Checkout failed to start.' });
    }
  };

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, remove, setQty, open, setOpen }}>
      {children}

      {open && <div className="fixed inset-0 z-[60] bg-black/60" onClick={() => setOpen(false)} />}
      <aside
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0D0D0D] text-neutral-100 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-serif text-2xl">Your Cart {count > 0 && <span className="text-sm text-neutral-400">({count})</span>}</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-2xl leading-none transition hover:text-amber-200">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              {status.msg ? (
                <p role="status" className={`text-sm ${status.ok ? 'text-amber-200' : 'text-neutral-400'}`}>{status.msg}</p>
              ) : (
                <p className="text-sm text-neutral-400">Your cart is empty.</p>
              )}
              <Link href="/shop" onClick={() => setOpen(false)} className="mt-6 inline-flex rounded-full border border-amber-200/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-200 transition hover:border-amber-200">
                Browse the gallery
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-5">
                  <div className="h-20 w-20 flex-none overflow-hidden rounded-lg bg-neutral-800">
                    {i.image && <img src={i.image} alt={i.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-3">
                      <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="font-serif text-lg transition hover:text-amber-200">{i.title}</Link>
                      <span className="text-sm">{money(i.price * i.qty)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <button onClick={() => setQty(i.id, i.qty - 1)} disabled={i.qty <= 1} aria-label={`Decrease ${i.title}`} className="h-7 w-7 rounded-full border border-white/10 transition hover:border-amber-200 hover:text-amber-200 disabled:opacity-40">−</button>
                        <span aria-live="polite">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= MAX_QTY} aria-label={`Increase ${i.title}`} className="h-7 w-7 rounded-full border border-white/10 transition hover:border-amber-200 hover:text-amber-200 disabled:opacity-40">+</button>
                      </div>
                      <button onClick={() => remove(i.id)} className="text-xs uppercase tracking-wider text-neutral-400 transition hover:text-amber-200">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-lg">{money(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">Final amount is confirmed securely at payment.</p>
            <button
              onClick={checkout}
              disabled={status.busy}
              className="mt-4 w-full rounded-full bg-amber-200 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-amber-100 disabled:opacity-50"
            >
              {status.busy ? 'Opening payment…' : `Pay ${money(subtotal)}`}
            </button>
            {status.msg && <p role="status" className="mt-3 text-center text-xs text-amber-200">{status.msg}</p>}
          </div>
        )}
      </aside>
    </CartContext.Provider>
  );
}
