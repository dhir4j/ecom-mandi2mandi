'use client';

import { useState, useRef } from 'react';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CategoryProductCarouselProps = {
  products: Product[];
};

export function CategoryProductCarousel({ products }: CategoryProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + itemsPerPage));
  };

  if (products.length === 0) return null;

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="relative">
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[45%] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid with Navigation */}
      <div className="hidden md:block relative">
        {/* Previous Button */}
        {canGoPrev && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Next Button */}
        {canGoNext && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Indicator Dots */}
        {products.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => {
              const isActive = Math.floor(currentIndex / itemsPerPage) === index;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`h-2 rounded-full transition-all ${
                    isActive ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
