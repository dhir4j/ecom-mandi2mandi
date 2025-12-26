'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, ShoppingCart, CalendarDays, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={product.aiHint}
            unoptimized // Necessary for .webp from external sources without domain config
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <h3 className="text-lg font-headline font-semibold leading-tight h-12 overflow-hidden">{product.title}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{product.location}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{product.date}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <UserCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{product.seller}</span>
        </div>
        
        <Badge variant="secondary" className="text-base font-bold text-primary whitespace-normal text-left h-auto">
          ₹{product.price.toLocaleString('en-IN')} / {product.unit}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/order/${product.id}`}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}