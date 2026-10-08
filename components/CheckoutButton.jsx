'use client';

import { useState } from 'react';
import cfg from '../store.config.json';

export default function CheckoutButton({ product }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          productId: product._id,
          title: product.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create payment session');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: cfg.site.name,
        description: product.title,
        order_id: data.orderId,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        theme: { color: '#FDE68A' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Checkout failed to initialize. Please check API keys.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-full bg-amber-200 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-amber-100 disabled:opacity-50"
    >
      {loading ? 'Initializing...' : `Acquire Piece — ${cfg.site.currencySymbol}${product.price.toLocaleString('en-IN')}`}
    </button>
  );
}