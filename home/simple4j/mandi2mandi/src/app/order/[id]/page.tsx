import { getProductById } from '@/lib/products';
import { ProductBuyContent } from '@/components/product-buy-content';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  if (typeof id !== 'string') {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProductBuyContent product={product} />
      <Footer />
    </div>
  );
}
// Build: 1767302156
