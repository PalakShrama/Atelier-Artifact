import Link from 'next/link';
import Image from 'next/image';
import cfg from '../store.config.json';
import { getProducts, getCategories } from '../lib/sanity.queries';
import ProductCard from '../components/ProductCard';
import { urlFor } from '../lib/sanity';

export default async function Home() {
  const featured = await getProducts({ featured: true });
  const categories = await getCategories();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
        <Image
          src={cfg.hero.image}
          alt={cfg.hero.title}
          fill
          priority
          className="object-cover brightness-50 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20">
          <h1 className="max-w-2xl font-serif text-5xl leading-tight md:text-7xl text-amber-50">
            {cfg.hero.title}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-neutral-300 font-light">
            {cfg.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={cfg.hero.ctaHref}
              className="rounded-full bg-amber-200 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-amber-100"
            >
              {cfg.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        {/* Trust Badges */}
        <ul className="flex flex-wrap justify-between gap-6 border-b border-white/10 py-8 text-[11px] tracking-wider uppercase text-amber-200/80">
          {cfg.trust.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section id="categories" className="pt-24">
            <h2 className="font-serif text-3xl text-neutral-100 mb-8">Browse Categories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  href={`/shop?category=${c.slug}`}
                  className="group relative h-64 overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
                >
                  {c.image && (
                    <Image
                      src={urlFor(c.image)}
                      alt={c.name}
                      fill
                      className="object-cover brightness-75 transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-6 left-6 font-serif text-2xl text-amber-100">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Artifacts Section */}
        <section id="shop" className="pt-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-widest uppercase text-amber-300">Curated Collection</span>
              <h2 className="font-serif text-4xl text-neutral-100 mt-1">Featured Artifacts</h2>
            </div>
          </div>

          {featured.length === 0 ? (
            <p className="text-neutral-500">No featured artifacts available right now.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Story Section */}
        <section id="story" className="my-28 grid overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 md:grid-cols-2">
          <div className="relative min-h-[400px]">
            <Image src={cfg.story.image} alt="Craftsmanship" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-16">
            <h2 className="font-serif text-4xl text-amber-100">{cfg.story.title}</h2>
            <p className="my-6 text-neutral-400 leading-relaxed text-sm">{cfg.story.body}</p>
            <Link
              href="/shop"
              className="inline-flex w-fit rounded-full border border-amber-200/50 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-amber-200 transition hover:border-amber-200 hover:bg-amber-200 hover:text-black"
            >
              {cfg.story.cta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}