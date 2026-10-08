import cfg from '../store.config.json';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] py-12 text-center text-xs text-neutral-500">
      <p>© {new Date().getFullYear()} {cfg.site.name}. All rights reserved.</p>
    </footer>
  );
}