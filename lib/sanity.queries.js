import { sanityClient } from './sanity';

export async function getProducts({ featured, categorySlug } = {}) {
  let filter = '*[_type == "product"';
  if (featured) filter += ' && featured == true';
  if (categorySlug) filter += ` && category->slug.current == "${categorySlug}"`;
  filter += ']';

  const query = `${filter}{
    _id,
    title,
    "slug": slug.current,
    price,
    material,
    dimensions,
    "image": images[0],
    "category": category->name
  }`;

  try {
    return await sanityClient.fetch(query);
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
    material,
    dimensions,
    description,
    "images": images[],
    "category": category->name
  }`;

  try {
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return null;
  }
}

export async function getCategories() {
  const query = `*[_type == "category"]{
    _id,
    name,
    "slug": slug.current,
    image
  }`;

  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return [];
  }
}