'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Listing = {
  id: string;
  name: string;
  location: string;
  price: string;
  status: string;
};

export function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://www.mandi.ramhotravels.com/api/my-listings', {
          credentials: 'include',
        });
        if (!response.ok) {
            if (response.status === 401) {
                setError("You need to be logged in to view your listings.");
                return;
            }
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Product Listings</CardTitle>
          <CardDescription>Here is a list of products you have for sale.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg text-center p-8">
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription>{error}</CardDescription>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>My Product Listings</CardTitle>
            <CardDescription>Here is a list of products you have for sale.</CardDescription>
        </CardHeader>
        <CardContent>
        {listings.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {listings.map((listing) => (
                    <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.name}</TableCell>
                    <TableCell>{listing.location}</TableCell>
                    <TableCell>{listing.price}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                            {listing.status}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
            <h3 className="mt-4 text-lg font-medium">You haven't listed any products yet.</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Switch to the "Add New Product" tab to create your first listing.
            </p>
            </div>
        )}
        </CardContent>
    </Card>
  );
}
