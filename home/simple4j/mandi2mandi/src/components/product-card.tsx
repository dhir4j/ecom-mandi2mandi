'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, ShoppingCart, CalendarDays, UserCircle, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, minimumQuantity } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(minimumQuantity);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuantityChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setQuantity(num);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 100);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(minimumQuantity, prev - 100));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (quantity < minimumQuantity) {
      toast({
        title: 'Invalid Quantity',
        description: `Minimum purchase quantity is ${minimumQuantity} ${product.unit}`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await addToCart({
        productId: product.id,
        productName: product.title,
        pricePerUnit: product.price,
        unit: product.unit,
        quantity: quantity,
        imageUrl: product.images[0],
        sellerName: product.seller,
        location: product.location,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        // Reset quantity to minimum after adding
        setQuantity(minimumQuantity);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity (Min: {minimumQuantity} {product.unit})</label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= minimumQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min={minimumQuantity}
              step="100"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Total: ₹{(quantity * product.price).toLocaleString('en-IN')}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}