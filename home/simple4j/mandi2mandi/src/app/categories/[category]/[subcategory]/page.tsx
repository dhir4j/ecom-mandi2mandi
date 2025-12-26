import { getProductsBySubcategory } from '@/lib/products';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function ProductsBySubcategoryPage({ params }: { params: { category: string; subcategory: string } }) {
  const { category, subcategory } = params;
  
  const decodedCategory = decodeURIComponent(category);
  const decodedSubcategory = decodeURIComponent(subcategory);

  const products = await getProductsBySubcategory(decodedCategory, decodedSubcategory);

  if (!products) {
    notFound(); 
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <Breadcrumb className="mb-8">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href={`/categories/${category}`} className="capitalize">{decodedCategory}</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <span className="capitalize text-foreground font-medium">{decodedSubcategory}</span>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-bold mb-8 font-headline text-foreground capitalize">
          {decodedSubcategory}
        </h2>

        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold">No products found in this category.</h3>
                <p className="text-muted-foreground mt-2">Check back later or browse other categories.</p>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}