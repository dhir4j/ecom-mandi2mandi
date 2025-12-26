// src/app/products/page.tsx
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductsContentEnhanced } from '@/components/products-content-enhanced';
import { getProducts, getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const allProducts = await getProducts();
  const allCategories = await getCategories();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ProductsContentEnhanced initialProducts={allProducts} categories={allCategories} />
      <Footer />
    </div>
  );
}
