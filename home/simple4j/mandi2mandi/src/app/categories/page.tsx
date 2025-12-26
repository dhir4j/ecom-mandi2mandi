import { getCategories } from '@/lib/products';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, LayoutGrid } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await getCategories();
  const categoryNames = Object.keys(categories);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
                <LayoutGrid className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold font-headline">Product Categories</h1>
                <p className="text-muted-foreground">Browse products by category.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryNames.map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>{`View all sub-categories under ${category}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/categories/${encodeURIComponent(category)}`} className="flex items-center justify-between text-primary font-semibold">
                  <span>Explore {categories[category].length} sub-categories</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}