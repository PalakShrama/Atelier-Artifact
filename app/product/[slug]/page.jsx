import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '../../../lib/sanity.queries';
import { urlFor } from '../../../lib/sanity';
import CheckoutButton from '../../../components/CheckoutButton';
import cfg from '../../../store.config.json';

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            {product.images && product.images[0] && (
              <Image
                src={urlFor(product.images[0])}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest text-amber-300">{product.category || 'Artifact'}</span>
          <h1 className="font-serif text-4xl text-neutral-100 mt-2">{product.title}</h1>
          <p className="text-2xl font-medium text-amber-200 mt-4">
            {cfg.site.currencySymbol}{product.price?.toLocaleString('en-IN')}
          </p>

          <div className="my-8 space-y-3 border-y border-white/10 py-6 text-sm text-neutral-400">
            {product.material && <p><strong className="text-neutral-200">Material:</strong> {product.material}</p>}
            {product.dimensions && <p><strong className="text-neutral-200">Dimensions:</strong> {product.dimensions}</p>}
            {product.description && <p className="mt-4 leading-relaxed">{product.description}</p>}
          </div>

          <CheckoutButton product={product} />
        </div>
      </div>
    </main>
  );
}