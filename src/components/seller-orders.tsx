'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, MapPin, Calendar, User, Phone, Truck, CheckCircle, Clock, Search, Edit, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

// Demo orders data
const demoOrders = [
  {
    id: 142,
    orderId: 'ORD000142',
    productName: 'Wheat (Grade A)',
    buyerName: 'Rajesh Kumar',
    buyerMobile: '9876543210',
    quantity: 500,
    unit: 'Kg',
    totalPrice: 12500,
    status: 'Booked',
    deliveryStatus: 'Pending Shipment',
    orderedOn: '2025-01-20T10:30:00',
    address: 'Shop No. 12, Market Yard, Mumbai - 400001',
    trackingId: '',
    courierService: '',
    estimatedDelivery: '',
  },
  {
    id: 141,
    orderId: 'ORD000141',
    productName: 'Rice (Basmati)',
    buyerName: 'Priya Sharma',
    buyerMobile: '9876543211',
    quantity: 1000,
    unit: 'Kg',
    totalPrice: 50000,
    status: 'Booked',
    deliveryStatus: 'In Transit',
    orderedOn: '2025-01-19T14:20:00',
    address: 'Building 5, APMC Market, Delhi - 110001',
    trackingId: 'DELHIVERY123456789',
    courierService: 'Delhivery',
    estimatedDelivery: '2025-01-23',
  },
  {
    id: 140,
    orderId: 'ORD000140',
    productName: 'Turmeric Powder',
    buyerName: 'Amit Patel',
    buyerMobile: '9876543212',
    quantity: 200,
    unit: 'Kg',
    totalPrice: 8600,
    status: 'Completed',
    deliveryStatus: 'Delivered',
    orderedOn: '2025-01-18T09:15:00',
    deliveredOn: '2025-01-20T15:30:00',
    address: 'Warehouse 7, Spice Market, Ahmedabad - 380001',
    trackingId: 'BLUEDART987654321',
    courierService: 'Blue Dart',
    estimatedDelivery: '2025-01-20',
  },
  {
    id: 139,
    orderId: 'ORD000139',
    productName: 'Soybean',
    buyerName: 'Vikram Singh',
    buyerMobile: '9876543214',
    quantity: 300,
    unit: 'Kg',
    totalPrice: 12000,
    status: 'Booked',
    deliveryStatus: 'Preparing',
    orderedOn: '2025-01-18T11:20:00',
    address: 'Shop 22, Grain Market, Jaipur - 302001',
    trackingId: '',
    courierService: '',
    estimatedDelivery: '',
  },
];

export function SellerOrders() {
  const [showDemo, setShowDemo] = useState(false);
  const [orders, setOrders] = useState(demoOrders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof demoOrders[0] | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    deliveryStatus: '',
    trackingId: '',
    courierService: '',
    estimatedDelivery: '',
    notes: '',
  });

  // Check if user has any orders (in real app, this would come from API)
  const hasOrders = false; // Set to true when user has actual orders

  const handleUpdateStatus = (order: typeof demoOrders[0]) => {
    setSelectedOrder(order);
    setUpdateForm({
      deliveryStatus: order.deliveryStatus,
      trackingId: order.trackingId,
      courierService: order.courierService,
      estimatedDelivery: order.estimatedDelivery,
      notes: '',
    });
    setUpdateDialogOpen(true);
  };

  const handleSaveUpdate = () => {
    if (!selectedOrder) return;

    setOrders(prev =>
      prev.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              deliveryStatus: updateForm.deliveryStatus,
              trackingId: updateForm.trackingId,
              courierService: updateForm.courierService,
              estimatedDelivery: updateForm.estimatedDelivery,
              status: updateForm.deliveryStatus === 'Delivered' ? 'Completed' : order.status,
            }
          : order
      )
    );
    setUpdateDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      Booked: { className: 'bg-blue-100 text-blue-800 border-blue-300' },
      Completed: { className: 'bg-green-100 text-green-800 border-green-300' },
      Cancelled: { className: 'bg-red-100 text-red-800 border-red-300' },
    };

    const config = configs[status as keyof typeof configs] || configs.Booked;

    return (
      <Badge className={config.className}>
        {status}
      </Badge>
    );
  };

  const getDeliveryStatusBadge = (status: string) => {
    const configs = {
      'Pending Shipment': { className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      'Preparing': { className: 'bg-orange-100 text-orange-800 border-orange-300', icon: Package },
      'In Transit': { className: 'bg-blue-100 text-blue-800 border-blue-300', icon: Truck },
      'Delivered': { className: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
    };

    const config = configs[status as keyof typeof configs] || configs['Pending Shipment'];
    const Icon = config.icon;

    return (
      <Badge className={`gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesSearch = order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!hasOrders && !showDemo) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Once buyers approve your enquiries and make purchases, orders will appear here for you to manage and fulfill.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="?tab=add-product">
                <Plus className="mr-2 h-5 w-5" />
                List Your Products
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
              <Eye className="mr-2 h-5 w-5" />
              View Demo Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showDemo && !hasOrders && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                You're viewing demo orders. List products and receive enquiries to get actual orders.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDemo(false)}>
              Hide Demo
            </Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage and update delivery status for your orders</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No orders have been received yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Side - Order Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{order.productName}</h3>
                            <p className="text-sm text-muted-foreground">{order.orderId}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(order.status)}
                            {getDeliveryStatusBadge(order.deliveryStatus)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Buyer</p>
                              <p className="text-sm font-medium truncate">{order.buyerName}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Quantity</p>
                              <p className="text-sm font-medium">
                                {order.quantity} {order.unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Ordered On</p>
                              <p className="text-sm font-medium">
                                {new Date(order.orderedOn).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Contact</p>
                              <p className="text-sm font-medium">{order.buyerMobile}</p>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Information */}
                        {(order.trackingId || order.courierService) && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-1">Delivery Information</p>
                                {order.courierService && (
                                  <p className="text-sm font-medium">
                                    Courier: {order.courierService}
                                  </p>
                                )}
                                {order.trackingId && (
                                  <p className="text-sm font-mono text-muted-foreground truncate">
                                    Tracking: {order.trackingId}
                                  </p>
                                )}
                                {order.estimatedDelivery && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Address */}
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-muted-foreground">{order.address}</p>
                        </div>

                        <div className="bg-primary/10 p-3 rounded-lg inline-block">
                          <p className="text-xs text-muted-foreground">Order Total</p>
                          <p className="font-bold text-primary text-lg">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button
                          onClick={() => handleUpdateStatus(order)}
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none lg:w-full"
                          disabled={order.status === 'Completed'}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the delivery information for order {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <Select
                value={updateForm.deliveryStatus}
                onValueChange={(value) => setUpdateForm({ ...updateForm, deliveryStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Shipment">Pending Shipment</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courierService">Courier Service</Label>
              <Input
                id="courierService"
                placeholder="e.g., Delhivery, Blue Dart, DTDC"
                value={updateForm.courierService}
                onChange={(e) => setUpdateForm({ ...updateForm, courierService: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="Enter tracking/AWB number"
                value={updateForm.trackingId}
                onChange={(e) => setUpdateForm({ ...updateForm, trackingId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={updateForm.estimatedDelivery}
                onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information for the buyer..."
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate} className="flex-1">
              Save Updates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
