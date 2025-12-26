'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from './ui/button';
import { Download } from 'lucide-react';

type Order = {
  id: number;
  order_id_display: string;
  date: string;
  product_name: string;
  total: string;
  status: string;
  buyer: {
    name: string;
    email: string;
  };
};

export function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async (filter = 'All') => {
    setIsLoading(true);
    setError(null);
    let url = 'https://www.mandi.ramhotravels.com/api/admin/orders';
    if (filter !== 'All') {
        url += `?status=${filter}`;
    }

    try {
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders. You may not have access.');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}.`
      });
      
      fetchOrders(statusFilter);

    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCsv = async () => {
    try {
        const response = await fetch('https://www.mandi.ramhotravels.com/api/admin/orders/download', {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to download CSV.');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'orders.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({ title: 'Download Started', description: 'Your order data is being downloaded.' });
    } catch (error) {
        toast({ title: 'Download Failed', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'booked':
        return 'default';
      case 'cancelled':
      case 'failed':
        return 'destructive';
      case 'shipped':
      case 'in transit':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const orderStatuses = ["All", "Pending", "Booked", "Processing", "In Transit", "Shipped", "Delivered", "Cancelled", "Failed"];

  if (error) {
    return (
      <Card className="text-center p-8">
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription>{error}</CardDescription>
        <Button onClick={() => fetchOrders(statusFilter)} className="mt-4">Retry</Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Manage All Orders</CardTitle>
            <CardDescription>View and update the status of all orders in the system.</CardDescription>
        </div>
        <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDownloadCsv}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_id_display}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                        <div>{order.buyer.name}</div>
                        <div className="text-xs text-muted-foreground">{order.buyer.email}</div>
                    </TableCell>
                    <TableCell>{order.product_name}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={order.status} 
                        onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Booked">Booked</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No orders found for this filter.</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
