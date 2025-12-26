
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, CategoryData } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type HomeSearchProps = {
  products: Product[];
  categories: CategoryData;
};

export function HomeSearch({ products, categories }: HomeSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allSearchableItems = useMemo(() => {
    const items: { type: 'product' | 'category' | 'subcategory'; label: string; value: string, url: string }[] = [];

    // Add products
    products.forEach(p => {
      items.push({ type: 'product', label: p.title, value: p.title.toLowerCase(), url: `/order/${p.id}` });
    });

    // Add categories and subcategories
    for (const category in categories) {
      items.push({ type: 'category', label: category, value: category.toLowerCase(), url: `/categories/${encodeURIComponent(category)}` });
      categories[category].forEach(sub => {
        items.push({ type: 'subcategory', label: `${sub} (in ${category})`, value: sub.toLowerCase(), url: `/categories/${encodeURIComponent(category)}/${encodeURIComponent(sub)}` });
      });
    }

    return items;
  }, [products, categories]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allSearchableItems;
    const lowercasedQuery = searchQuery.toLowerCase();
    return allSearchableItems.filter(item => item.value.includes(lowercasedQuery));
  }, [searchQuery, allSearchableItems]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(searchQuery){
       setOpen(false);
       router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in-up duration-1000 delay-200">
       <form onSubmit={handleFormSubmit}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
               <CommandInput
                  asChild
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  onFocus={() => setOpen(true)}
                >
                 <Input
                  placeholder="Search for products or categories..."
                  className="h-14 text-lg pr-12"
                />
              </CommandInput>
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary font-bold">
                 Search
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
            <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search for products or categories..."
                  className="h-14 text-lg pr-12"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                {searchQuery && filteredItems.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                <CommandGroup heading="Suggestions">
                    {filteredItems.slice(0, 10).map((item) => (
                    <CommandItem
                        key={item.url}
                        onSelect={() => handleSelect(item.url)}
                        className="cursor-pointer"
                    >
                        <span className="capitalize">{item.label}</span>
                    </CommandItem>
                    ))}
                </CommandGroup>
                </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
}
