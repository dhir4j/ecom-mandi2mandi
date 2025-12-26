// src/components/products-content.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import type { Product, CategoryData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProductsContentProps = {
  initialProducts: Product[];
  categories: CategoryData;
};

export function ProductsContent({ initialProducts, categories }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const catParam = searchParams.get('category');
    return catParam ? [catParam] : [];
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const catParam = searchParams.get('category');
    return catParam ? new Set([catParam]) : new Set();
  });
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Search query filter
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery) ||
        product.subcategory.toLowerCase().includes(lowercasedQuery) ||
        product.location.toLowerCase().includes(lowercasedQuery) ||
        product.seller.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategories.includes(product.subcategory)
      );
    }

    // Price range filter
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;

    if (minPrice || maxPrice) {
      filtered = filtered.filter(product =>
        product.price >= minPriceNum && product.price <= maxPriceNum
      );
    }

    return filtered;
  }, [searchQuery, selectedCategories, selectedSubcategories, minPrice, maxPrice, initialProducts]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];

      // Clear subcategories when category is deselected
      if (!newCategories.includes(category)) {
        setSelectedSubcategories(prevSubs =>
          prevSubs.filter(sub => !categories[category]?.includes(sub))
        );
      }

      return newCategories;
    });

    // Clear search query when selecting/deselecting a category
    setSearchQuery('');
  };

  const handleCategoryExpand = (category: string) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return newExpanded;
    });
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );

    // Clear search query when selecting/deselecting a subcategory
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setExpandedCategories(new Set());
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full"
              min="0"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Category Filter with Accordion-style Subcategories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Categories</Label>
        <div className="space-y-1">
          {Object.keys(categories).sort().map(category => (
            <div key={category} className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={`cat-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex-1"
                >
                  {category}
                </label>
                {categories[category] && categories[category].length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleCategoryExpand(category)}
                    className="p-1 hover:bg-accent rounded"
                  >
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Subcategories beneath the category */}
              {expandedCategories.has(category) && categories[category] && (
                <div className="ml-6 space-y-1 mt-1">
                  {categories[category].map(subcategory => (
                    <div key={subcategory} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subcat-${category}-${subcategory}`}
                        checked={selectedSubcategories.includes(subcategory)}
                        onCheckedChange={() => handleSubcategoryToggle(subcategory)}
                        disabled={!selectedCategories.includes(category)}
                      />
                      <label
                        htmlFor={`subcat-${category}-${subcategory}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                      >
                        {subcategory}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || searchQuery || minPrice || maxPrice) && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <main className="flex-grow">
      <div className="container mx-auto py-4 md:py-8 px-3 md:px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-3xl font-bold font-headline text-foreground">
                All Products
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 md:pl-10 h-10 md:h-11 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h3>
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <FilterContent />
              </ScrollArea>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-2xl px-8 h-12 text-base font-semibold">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                  {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || searchQuery || minPrice || maxPrice) && (
                    <span className="ml-2 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {selectedCategories.length + selectedSubcategories.length + (searchQuery ? 1 : 0) + (minPrice || maxPrice ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
                  <FilterContent />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1 pb-20 lg:pb-0">
            {!searchQuery && selectedCategories.length === 0 && selectedSubcategories.length === 0 && !minPrice && !maxPrice ? (
              <div className="text-center py-12 md:py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted mb-3 md:mb-4">
                  <SlidersHorizontal className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Select filters to browse products</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 px-4">
                  Use the filters to find products by category, subcategory, or price range
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted mb-3 md:mb-4">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">No products found</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 px-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}