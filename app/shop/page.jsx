import { getProducts } from '../../lib/sanity.queries';
import ProductCard from '../../components/ProductCard';

export default async function ShopPage({ searchParams }) {
  const categorySlug = searchParams?.category;
  const products = await getProducts({ categorySlug });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-serif text-5xl text-amber-100 mb-2">Artisanal Gallery</h1>
      <p className="text-neutral-400 text-sm mb-12">
        {categorySlug ? `Filtering by category: ${categorySlug}` : 'Explore our complete collection of decor pieces.'}
      </p>

      {products.length === 0 ? (
        <p className="text-neutral-500 py-12">No products found in this category.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}