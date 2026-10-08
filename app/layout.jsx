import Script from 'next/script';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cfg from '../store.config.json';
import './globals.css';

export const metadata = {
  title: cfg.site.name,
  description: cfg.site.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#0D0D0D] text-[#E5E5E0] antialiased">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}