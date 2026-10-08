import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '../lib/sanity';
import CheckoutButton from './CheckoutButton';
import cfg from '../store.config.json';

export default function ProductCard({ product }) {
  // Determine image URL: direct imageUrl string -> Sanity asset reference -> placeholder
  const imageUrl =
    product.imageUrl ||
    (product.image ? urlFor(product.image).url() : '/placeholder.jpg');

  return (
    <div className="group flex flex-col rounded-xl border border-white/5 bg-neutral-900/50 p-4 transition duration-300 hover:border-amber-400/30">
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.title || 'Product Image'}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <p className="text-[10px] text-amber-200 uppercase tracking-widest">{product.category || 'Artifact'}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-lg text-neutral-100 transition hover:text-amber-200">{product.title}</h3>
          </Link>
          {product.material && <p className="text-xs text-neutral-500 mt-1">{product.material}</p>}
        </div>
        <div className="mt-5 pt-3 border-t border-white/5 flex flex-col gap-3">
          <span className="font-medium text-neutral-200 text-sm">
            {cfg.site.currencySymbol}{product.price?.toLocaleString('en-IN')}
          </span>
          <CheckoutButton product={product} />
        </div>
      </div>
    </div>
  );
}