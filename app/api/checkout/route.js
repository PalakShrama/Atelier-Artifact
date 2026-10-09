import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const MAX_QTY = 10;
const MAX_LINES = 20;
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) return bad('Your cart is empty.');

    // Merge duplicate lines and validate each one
    const qtyById = new Map();
    for (const it of items) {
      if (typeof it?.id !== 'string' || !Number.isInteger(it.qty) || it.qty < 1) return bad('Invalid cart.');
      qtyById.set(it.id, (qtyById.get(it.id) || 0) + it.qty);
    }
    for (const qty of qtyById.values()) if (qty > MAX_QTY) return bad(`You can order up to ${MAX_QTY} of each piece.`);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return bad('Payments are not configured.', 500);

    // Prices always come from Sanity, never from the browser
    const products = await sanity.fetch(
      `*[_type == "product" && _id in $ids]{ _id, title, price }`,
      { ids: [...qtyById.keys()] }
    );
    if (products.length !== qtyById.size) return bad('Some items are no longer available. Please refresh your cart.', 409);

    let total = 0;
    for (const p of products) {
      if (!(p.price > 0)) return bad(`"${p.title}" cannot be purchased right now.`, 409);
      total += p.price * qtyById.get(p._id);
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // rupees -> paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { items: products.map((p) => `${p._id}x${qtyById.get(p._id)}`).join(',').slice(0, 250) },
    });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Checkout error:', error);
    return bad('Could not start payment.', 500);
  }
}
