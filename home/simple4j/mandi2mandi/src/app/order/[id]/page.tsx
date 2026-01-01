import { getProductById } from '@/lib/products';
import { ProductBuyPage } from '@/components/product-buy-page';
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

  return <ProductBuyPage product={product} />;
}
