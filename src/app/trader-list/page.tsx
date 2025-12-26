
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Handshake } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Trader = {
  id: number;
  name: string;
  shop_name: string;
  contact_number: string;
  address: string;
  commodity: string;
  license_number: string;
};

const maskContactNumber = (number: string) => {
  if (number.length === 10) {
    return `${number.substring(0, 2)}xxxxx${number.substring(7)}`;
  }
  return number;
};

export default function TraderListPage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTraders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/db/trader_list.json');
        const data = await response.json();
        const processedData = data.map((trader: Trader) => ({
          ...trader,
          contact_number: maskContactNumber(trader.contact_number),
        }));
        setTraders(processedData);
      } catch (error) {
        console.error('Failed to fetch traders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTraders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-headline">Registered Traders</CardTitle>
                <CardDescription>A list of verified traders on our platform.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop Name</TableHead>
                      <TableHead>Proprietor</TableHead>
                      <TableHead>Primary Commodity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {traders.map((trader) => (
                      <TableRow key={trader.id}>
                        <TableCell className="font-medium">{trader.shop_name}</TableCell>
                        <TableCell>{trader.name}</TableCell>
                        <TableCell>{trader.commodity}</TableCell>
                        <TableCell>{trader.address}</TableCell>
                        <TableCell>{trader.contact_number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
