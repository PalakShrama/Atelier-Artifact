import { sanityClient } from './sanity';

export async function getProducts({ featured, categorySlug } = {}) {
  let filter = '*[_type == "product"';
  if (featured) filter += ' && isFeatured == true';
  if (categorySlug) filter += ` && category->slug.current == "${categorySlug}"`;
  filter += ']';

  const query = `${filter}{
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    imageUrl,
    "image": image.asset->url,
    "category": category->title
  }`;

  try {
    return await sanityClient.fetch(query, {}, { next: { revalidate: 0 } });
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return [];
  }
}

export async function getProductBySlug(slug) {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    imageUrl,
    "image": image.asset->url,
    "images": images[],
    "category": category->title
  }`;

  try {
    return await sanityClient.fetch(query, { slug }, { next: { revalidate: 0 } });
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return null;
  }
}

export async function getCategories() {
  const query = `*[_type == "category"]{
    _id,
    title,
    "slug": slug.current,
    imageUrl
  }`;

  try {
    return await sanityClient.fetch(query, {}, { next: { revalidate: 0 } });
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return [];
  }
}