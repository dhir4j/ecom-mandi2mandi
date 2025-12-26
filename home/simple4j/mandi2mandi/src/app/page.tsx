
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { getProducts, getCategories } from '@/lib/products';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import type { Product, CategoryData } from '@/lib/types';
import { HomeSearch } from '@/components/home-search';

// Helper function to get 4 unique products from a category
function getFeaturedProductsForCategory(products: Product[], category: string, allCategories: CategoryData): Product[] {
  const productsInCategory = products.filter(p => p.category === category);
  const subcategories = allCategories[category] || [];
  
  const featuredProducts: Product[] = [];
  const usedSubcategories = new Set<string>();

  // Prioritize one product from each subcategory
  for (const sub of subcategories) {
    if (featuredProducts.length >= 4) break;
    const product = productsInCategory.find(p => p.subcategory === sub && !usedSubcategories.has(sub));
    if (product) {
      featuredProducts.push(product);
      usedSubcategories.add(sub);
    }
  }

  // If not enough products, fill with remaining products from the category
  let i = 0;
  while (featuredProducts.length < 4 && i < productsInCategory.length) {
    const product = productsInCategory[i];
    if (!featuredProducts.some(fp => fp.id === product.id)) {
      featuredProducts.push(product);
    }
    i++;
  }
  
  return featuredProducts.slice(0, 4);
}


export default async function Home() {
  const allProducts = await getProducts();
  const allCategories = await getCategories();

  const categoryOrder: string[] = [
    "Oil & Oilseeds", "spices", "grains", "pulses", "vegetables", "fruits", "flowers", "others", "animal"
  ];

  const featuredCategories = categoryOrder.filter(cat => allCategories[cat]).slice(0, 9);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-[60vh] text-center px-4">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/landing1.jpg"
                alt="A vibrant agricultural marketplace"
                fill
                style={{objectFit: "cover"}}
                className="brightness-50"
              />
            </div>
            <div className="relative z-10 w-full max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tighter mb-8 animate-in fade-in-down duration-1000 text-white">
                Find Quality Agricultural Products
              </h1>
              <HomeSearch products={allProducts} categories={allCategories} />
            </div>
             <div className="absolute bottom-12 z-10 text-white">
                <a href="#leads" aria-label="Scroll down" className="animate-bounce block">
                    <ChevronDown className="h-6 w-6" />
                </a>
            </div>
        </section>

        {/* Featured Leads Section */}
        <section id="leads" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 space-y-16">
            {featuredCategories.map(category => {
              const categoryProducts = getFeaturedProductsForCategory(allProducts, category, allCategories);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline capitalize">Latest Leads on {category}</h2>
                    <Link href={`/categories/${encodeURIComponent(category)}`} className="text-primary hover:underline flex items-center gap-1 font-semibold">
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
