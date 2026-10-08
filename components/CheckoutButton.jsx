'use client';

import { useState } from 'react';
import cfg from '../store.config.json';

// Helper function to dynamically load the Razorpay script if not loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutButton({ product }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Ensure Client-side Environment Variable exists
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert('Payment configuration error: NEXT_PUBLIC_RAZORPAY_KEY_ID is missing.');
        setLoading(false);
        return;
      }

      // 3. Create Checkout session via backend API
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

      // 4. Options config
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: cfg.site?.name || 'Atelier & Artifact',
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
      {loading ? 'Initializing...' : `Acquire Piece — ${cfg.site?.currencySymbol || '₹'}${product.price?.toLocaleString('en-IN')}`}
    </button>
  );
}