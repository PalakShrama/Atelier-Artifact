import { sanityClient } from './sanity';

// These queries work with either field layout:
//   imageUrl                      (a direct link)
//   image.asset->url              (a single uploaded image)
//   images[].asset->url           (an uploaded gallery)
// and with either "title" or "name" on products and categories.

export async function getProducts({ featured, categorySlug } = {}) {
  const conditions = ['_type == "product"'];
  if (featured) conditions.push('featured == true');
  if (categorySlug) conditions.push('category->slug.current == $categorySlug');

  const query = `*[${conditions.join(' && ')}] | order(_createdAt desc){
    _id,
    "title": coalesce(title, name),
    "slug": slug.current,
    price,
    material,
    dimensions,
    description,
    imageUrl,
    "image": coalesce(image.asset->url, images[0].asset->url),
    "category": coalesce(category->title, category->name)
  }`;

  try {
    const items = await sanityClient.fetch(query, { categorySlug: categorySlug ?? '' });
    return items.filter((p) => typeof p.price === 'number');
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return [];
  }
}

export async function getProductBySlug(slug) {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    "title": coalesce(title, name),
    "slug": slug.current,
    price,
    material,
    dimensions,
    description,
    imageUrl,
    "image": coalesce(image.asset->url, images[0].asset->url),
    "images": images[].asset->url,
    "category": coalesce(category->title, category->name)
  }`;

  try {
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return null;
  }
}

export async function getCategories() {
  const query = `*[_type == "category"] | order(_createdAt asc){
    _id,
    "name": coalesce(name, title),
    "slug": slug.current,
    imageUrl,
    "image": image.asset->url
  }`;

  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return [];
  }
}
