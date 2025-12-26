
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { Product, CategoryData } from '@/lib/types';

type HomeSearchProps = {
  products: Product[];
  categories: CategoryData;
};

export function HomeSearch({ products, categories }: HomeSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: { type: 'product' | 'category'; label: string; url: string }[] = [];

    // Add matching categories
    Object.keys(categories).forEach(category => {
      if (category.toLowerCase().includes(query)) {
        results.push({
          type: 'category',
          label: category,
          url: `/products?category=${encodeURIComponent(category)}`
        });
      }
    });

    // Add matching products
    products.forEach(product => {
      if (product.title.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query)) {
        results.push({
          type: 'product',
          label: product.title,
          url: `/order/${product.id}`
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery, products, categories]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(searchQuery.trim()){
       router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setShowSuggestions(false);
  }

  const handleSuggestionClick = (url: string) => {
    router.push(url);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in-up duration-1000 delay-200" ref={wrapperRef}>
       <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search for products..."
            className="flex h-11 md:h-14 w-full rounded-full border-2 border-input bg-background/95 backdrop-blur-sm pl-9 md:pl-12 pr-20 md:pr-24 py-2 text-sm md:text-lg shadow-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 flex items-center justify-center px-4 md:px-6 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors text-xs md:text-sm"
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute mt-2 w-full bg-card border rounded-lg md:rounded-xl shadow-xl overflow-hidden z-50 max-h-[60vh] md:max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${index}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.url)}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-left hover:bg-accent transition-colors flex items-center gap-2 md:gap-3 border-b last:border-b-0"
              >
                <div className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${
                  suggestion.type === 'category'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {suggestion.type === 'category' ? 'Category' : 'Product'}
                </div>
                <span className="capitalize text-sm md:text-base truncate">{suggestion.label}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
