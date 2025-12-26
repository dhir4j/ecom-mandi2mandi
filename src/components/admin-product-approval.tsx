
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  images: string[];
  seller: {
    name: string;
    email: string;
  };
};

export function AdminProductApproval() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.mandi.ramhotravels.com/api/admin/products/pending', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pending products. You may not have access.');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleProductAction = async (productId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/admin/products/${productId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: action === 'approve' ? 'Active' : 'Rejected' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} product`);
      }
      
      toast({
        title: `Product ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The product has been updated successfully.`
      });
      
      // Refresh product list
      fetchPendingProducts();
      
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center p-8">
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription>{error}</CardDescription>
        <Button onClick={fetchPendingProducts} className="mt-4">Retry</Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Product Approvals</CardTitle>
        <CardDescription>Review and approve or reject new products submitted by sellers.</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover" unoptimized />
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{product.seller.name}</div>
                      <div className="text-xs text-muted-foreground">{product.seller.email}</div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleProductAction(product.id, 'approve')}>
                        Approve
                       </Button>
                       <Button variant="destructive" size="sm" onClick={() => handleProductAction(product.id, 'reject')}>
                        Reject
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No products are pending approval.</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
