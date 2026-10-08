import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  // Gracefully fallback to category.imageUrl or local placeholder
  const categoryImage = category.imageUrl || category.image || '/placeholder.jpg';
  const categoryTitle = category.title || 'Category';

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800"
    >
      <Image
        src={categoryImage}
        alt={categoryTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex items-end">
        <h3 className="font-serif text-xl font-medium text-neutral-100">
          {categoryTitle}
        </h3>
      </div>
    </Link>
  );
}