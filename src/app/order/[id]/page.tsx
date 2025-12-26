import { getProductById, getProducts } from '@/lib/products';
import { ProductDetailsPage } from '@/components/product-details-page';
import { notFound } from 'next/navigation';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  if (typeof id !== 'string') {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products from the same category (excluding current product)
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 12); // Get up to 12 related products

  return <ProductDetailsPage product={product} relatedProducts={relatedProducts} />;
}
