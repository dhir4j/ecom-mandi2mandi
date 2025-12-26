// src/components/product-card.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

// Simple gray placeholder as data URI
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageError ? PLACEHOLDER_IMAGE : (product.images[0] || PLACEHOLDER_IMAGE);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group border-border/40 hover:border-primary/50">
      {/* Image Section */}
      <Link href={`/order/${product.id}`} className="block">
        <div className="relative w-full aspect-square md:aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            unoptimized
            onError={() => {
              setImageError(true);
            }}
          />
          {/* Category Badge */}
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-10">
            <Badge
              variant="secondary"
              className="hidden md:inline-block px-2 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm capitalize"
            >
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex-grow p-2 md:p-3 space-y-1.5 md:space-y-2">
        {/* Title */}
        <Link href={`/order/${product.id}`} className="block">
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 leading-tight hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Subcategory badge */}
        <Badge
          variant="outline"
          className="text-xs capitalize line-clamp-1 inline-flex w-fit max-w-full"
        >
          <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{product.subcategory}</span>
        </Badge>

        {/* Location - Compact on mobile */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{product.location}</span>
        </div>

        {/* Seller & Date - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block space-y-1 text-xs text-muted-foreground">
          <p className="line-clamp-1">Seller: {product.seller}</p>
          <p>{product.date}</p>
        </div>

        {/* Price Section */}
        <Link href={`/order/${product.id}`} className="block mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-bold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted-foreground">
              /{product.unit}
            </span>
          </div>
        </Link>
      </div>
    </Card>
  );
}