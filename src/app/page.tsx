
import { Header } from '@/components/header';
import { getProducts, getCategories } from '@/lib/products';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import type { Product, CategoryData } from '@/lib/types';
import { HomeSearch } from '@/components/home-search';
import { CategoryProductCarousel } from '@/components/category-product-carousel';

// Helper function to get random products from a category (up to 12 for carousel)
function getFeaturedProductsForCategory(products: Product[], category: string): Product[] {
  const productsInCategory = products.filter(p => p.category === category);

  // Shuffle the products using Fisher-Yates algorithm
  const shuffled = [...productsInCategory];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 12); // Get up to 12 products for carousel navigation
}


export default async function Home() {
  const allProducts = await getProducts();
  const allCategories = await getCategories();

  const categoryOrder: string[] = [
    "Oil & Oilseeds", "spices", "grains", "pulses", "vegetables", "fruits", "flowers", "others", "animal"
  ];

  // Show all available categories, not just first 9
  const featuredCategories = categoryOrder.filter(cat => allCategories[cat]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-[45vh] md:h-[60vh] text-center px-3 md:px-4">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/landing1.jpg"
                alt="A vibrant agricultural marketplace"
                fill
                style={{objectFit: "cover"}}
                className="brightness-50"
              />
            </div>
            <div className="relative z-10 w-full max-w-4xl px-2">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-extrabold font-headline tracking-tighter mb-4 md:mb-8 animate-in fade-in-down duration-1000 text-white">
                Find Quality Agricultural Products
              </h1>
              <HomeSearch products={allProducts} categories={allCategories} />
            </div>
             <div className="absolute bottom-6 md:bottom-12 z-10 text-white">
                <a href="#leads" aria-label="Scroll down" className="animate-bounce block">
                    <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
                </a>
            </div>
        </section>

        {/* Featured Leads Section */}
        <section id="leads" className="py-8 md:py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-3 md:px-4 space-y-8 md:space-y-16">
            {featuredCategories.map(category => {
              const categoryProducts = getFeaturedProductsForCategory(allProducts, category);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold font-headline capitalize">Latest Leads on {category}</h2>
                    <Link href={`/products?category=${encodeURIComponent(category)}`} className="text-primary hover:underline flex items-center gap-1 font-semibold text-xs md:text-sm">
                      View All <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  </div>
                  <CategoryProductCarousel products={categoryProducts} />
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
