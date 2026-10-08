import Link from 'next/link';
import cfg from '../store.config.json';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-widest text-amber-100 uppercase">
          {cfg.site.name}
        </Link>
        <nav className="flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-neutral-300">
          {cfg.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-amber-200">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}