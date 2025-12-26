// src/components/products-content-enhanced.tsx
'use client';

import { useState, useMemo, Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import type { Product, CategoryData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type ProductsContentProps = {
  initialProducts: Product[];
  categories: CategoryData;
};

function ProductsContentEnhancedInner({ initialProducts, categories }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredByFilters, setFilteredByFilters] = useState<Product[]>(initialProducts);

  // Apply search on top of filter results
  const finalProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredByFilters;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    return filteredByFilters.filter(product =>
      product.title.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery) ||
      product.subcategory.toLowerCase().includes(lowercasedQuery) ||
      product.location.toLowerCase().includes(lowercasedQuery) ||
      product.seller.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, filteredByFilters]);

  return (
    <main className="flex-grow container mx-auto py-8 px-4">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline text-foreground">
            All Products
          </h2>
          <p className="text-muted-foreground mt-1">
            {finalProducts.length} {finalProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, categories, locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters
                  products={initialProducts}
                  categories={categories}
                  onFilterChange={setFilteredByFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </h3>
            <ProductFilters
              products={initialProducts}
              categories={categories}
              onFilterChange={setFilteredByFilters}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {finalProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or{' '}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    window.location.reload();
                  }}
                  className="text-primary hover:underline"
                >
                  reset all filters
                </button>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {finalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function ProductsContentEnhanced({ initialProducts, categories }: ProductsContentProps) {
  return (
    <Suspense fallback={
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-full md:w-1/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </main>
    }>
      <ProductsContentEnhancedInner initialProducts={initialProducts} categories={categories} />
    </Suspense>
  );
}