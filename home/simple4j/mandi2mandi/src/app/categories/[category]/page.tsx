import { getCategories } from '@/lib/products';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, Folder } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function SubCategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);
  const categories = await getCategories();
  const subcategories = categories[decodedCategory];

  if (!subcategories) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Breadcrumb className="mb-8">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <span className="capitalize text-foreground font-medium">{decodedCategory}</span>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
                <Folder className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold font-headline capitalize">{decodedCategory}</h1>
                <p className="text-muted-foreground">Select a sub-category to view products.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link key={subcategory} href={`/categories/${category}/${encodeURIComponent(subcategory)}`} className="block">
                <Card className="hover:shadow-lg hover:border-primary transition-all h-full">
                <CardHeader>
                    <CardTitle className="capitalize">{subcategory}</CardTitle>
                    <CardDescription>View products in this category</CardDescription>
                </CardHeader>
                 <CardContent>
                     <div className="flex items-center justify-end text-primary font-semibold">
                        <span className="mr-2">View Products</span>
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}