// src/app/products/page.tsx
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductsContent } from '@/components/products-content';
import { getProducts, getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const allProducts = await getProducts();
  const allCategories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ProductsContent initialProducts={allProducts} categories={allCategories} />
      <Footer />
    </div>
  );
}