import Script from 'next/script';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource-variable/manrope';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartProvider from '../components/CartProvider';
import cfg from '../store.config.json';
import './globals.css';

export const metadata = {
  title: cfg.site.name,
  description: cfg.site.description,
};

// Runs before first paint so the saved theme shows with no flash. Light is the default.
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'light'}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className="bg-[#0D0D0D] text-[#E5E5E0] antialiased"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
