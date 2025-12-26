'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, MapPin, Calendar, User, Phone, Mail, CheckCircle, XCircle, Clock, Search, MessageSquare, Plus, Eye, Truck, IndianRupee, Info } from 'lucide-react';
import Link from 'next/link';
import { convertToKg } from '@/lib/shipping';
import { useAuth } from '@/hooks/use-auth';

// Demo enquiries data
const demoEnquiries = [
  {
    id: 1,
    inquiryId: 'INQ000087',
    productName: 'Wheat (Grade A)',
    buyerName: 'Rajesh Kumar',
    buyerLocation: 'Mumbai, Maharashtra',
    quantity: 500,
    unit: 'Kg',
    estimatedPrice: 12500,
    status: 'Pending',
    createdOn: '2025-01-20T10:30:00',
    mobile: '9876543210',
    email: 'rajesh.kumar@example.com',
    address: 'Shop No. 12, Market Yard, Mumbai - 400001',
  },
  {
    id: 2,
    inquiryId: 'INQ000086',
    productName: 'Rice (Basmati)',
    buyerName: 'Priya Sharma',
    buyerLocation: 'Delhi, Delhi',
    quantity: 1000,
    unit: 'Kg',
    estimatedPrice: 50000,
    status: 'Approved',
    createdOn: '2025-01-19T14:20:00',
    respondedOn: '2025-01-19T15:30:00',
    mobile: '9876543211',
    email: 'priya.sharma@example.com',
    address: 'Building 5, APMC Market, Delhi - 110001',
  },
  {
    id: 3,
    inquiryId: 'INQ000085',
    productName: 'Turmeric Powder',
    buyerName: 'Amit Patel',
    buyerLocation: 'Ahmedabad, Gujarat',
    quantity: 200,
    unit: 'Kg',
    estimatedPrice: 8600,
    status: 'Pending',
    createdOn: '2025-01-19T09:15:00',
    mobile: '9876543212',
    email: 'amit.patel@example.com',
    address: 'Warehouse 7, Spice Market, Ahmedabad - 380001',
  },
  {
    id: 4,
    inquiryId: 'INQ000084',
    productName: 'Soybean',
    buyerName: 'Sunita Desai',
    buyerLocation: 'Pune, Maharashtra',
    quantity: 750,
    unit: 'Kg',
    estimatedPrice: 30000,
    status: 'Rejected',
    createdOn: '2025-01-18T16:45:00',
    respondedOn: '2025-01-18T17:00:00',
    mobile: '9876543213',
    email: 'sunita.desai@example.com',
    address: 'Plot 15, Agricultural Market, Pune - 411001',
  },
  {
    id: 5,
    inquiryId: 'INQ000083',
    productName: 'Wheat (Grade A)',
    buyerName: 'Vikram Singh',
    buyerLocation: 'Jaipur, Rajasthan',
    quantity: 300,
    unit: 'Kg',
    estimatedPrice: 7500,
    status: 'Approved',
    createdOn: '2025-01-18T11:20:00',
    respondedOn: '2025-01-18T12:00:00',
    mobile: '9876543214',
    email: 'vikram.singh@example.com',
    address: 'Shop 22, Grain Market, Jaipur - 302001',
  },
];

export function SellerEnquiries() {
  const { user, isAuthenticated } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Shipping rate dialog state
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [shippingRatePerKg, setShippingRatePerKg] = useState('');
  const [shippingError, setShippingError] = useState('');

  // Fetch seller enquiries from API
  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          'https://www.mandi.ramhotravels.com/api/inquiries/seller-inquiries',
          {
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEnquiries(data.inquiries || []);
        } else {
          console.error('Failed to fetch enquiries');
          setEnquiries([]);
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
        setEnquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquiries();
  }, [isAuthenticated]);

  const hasEnquiries = enquiries.length > 0;

  // Calculate shipping and final total
  const calculateShipping = (quantity: number, unit: string, ratePerKg: number) => {
    const weightInKg = convertToKg(quantity, unit);
    const shippingCharge = weightInKg * ratePerKg;
    return Math.round(shippingCharge);
  };

  const handleApproveClick = (enquiry: typeof demoEnquiries[0]) => {
    setSelectedEnquiry(enquiry);
    setShippingRatePerKg('');
    setShippingError('');
    setShowShippingDialog(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedEnquiry) return;

    const rate = parseFloat(shippingRatePerKg);

    if (!shippingRatePerKg || rate <= 0) {
      setShippingError('Please enter a valid shipping rate per kg (mandatory)');
      return;
    }

    const shippingCharge = calculateShipping(selectedEnquiry.quantity, selectedEnquiry.unit, rate);
    const finalTotal = selectedEnquiry.estimatedPrice + shippingCharge;

    try {
      // Call backend API to approve inquiry with shipping data
      const response = await fetch(
        `https://www.mandi.ramhotravels.com/api/inquiries/${selectedEnquiry.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            shippingRatePerKg: rate,
            shippingCharge: shippingCharge,
            finalTotal: finalTotal,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        setShippingError(error.error || 'Failed to approve inquiry');
        return;
      }

      const data = await response.json();

      // Update local state with the approved inquiry data from server
      setEnquiries(prev =>
        prev.map(enq =>
          enq.id === selectedEnquiry.id
            ? data.inquiry // Use the updated inquiry from server response
            : enq
        )
      );

      setShowShippingDialog(false);
      setSelectedEnquiry(null);
      setShippingRatePerKg('');
      setShippingError('');

      // Optional: Show success message
      console.log('✅ Inquiry approved successfully with shipping charges');
    } catch (error) {
      console.error('Error approving inquiry:', error);
      setShippingError('Failed to approve inquiry. Please try again.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(
        `https://www.mandi.ramhotravels.com/api/inquiries/${id}/reject`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnquiries(prev =>
          prev.map(enq =>
            enq.id === id ? data.inquiry : enq
          )
        );
        console.log('✅ Inquiry rejected successfully');
      } else {
        console.error('Failed to reject inquiry');
      }
    } catch (error) {
      console.error('Error rejecting inquiry:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      Pending: { variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      Approved: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-300' },
      Rejected: { variant: 'destructive' as const, icon: XCircle, className: 'bg-red-100 text-red-800 border-red-300' },
    };

    const config = configs[status as keyof typeof configs] || configs.Pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = filterStatus === 'all' || enq.status.toLowerCase() === filterStatus;
    const matchesSearch = enq.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enq.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enq.inquiryId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasEnquiries && !showDemo) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <MessageSquare className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Enquiries Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Once you list products, buyers will send you enquiries. They will appear here for you to review and respond.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="?tab=add-product">
                <Plus className="mr-2 h-5 w-5" />
                List Your First Product
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
              <Eye className="mr-2 h-5 w-5" />
              View Demo Enquiries
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showDemo && !hasEnquiries && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                You're viewing demo enquiries. List products to receive actual enquiries.
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
              <CardTitle>Incoming Enquiries</CardTitle>
              <CardDescription>Manage buyer enquiries for your products</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search enquiries..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Enquiries Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No buyer enquiries have been received yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Side - Enquiry Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{enquiry.productName}</h3>
                            <p className="text-sm text-muted-foreground">{enquiry.inquiryId}</p>
                          </div>
                          {getStatusBadge(enquiry.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Buyer</p>
                              <p className="text-sm font-medium truncate">{enquiry.buyerName}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Quantity</p>
                              <p className="text-sm font-medium">
                                {enquiry.quantity} {enquiry.unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="text-sm font-medium truncate">
                                {enquiry.address?.city}, {enquiry.address?.state}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">Sent On</p>
                              <p className="text-sm font-medium">
                                {new Date(enquiry.createdOn).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{enquiry.mobile}</span>
                          </div>
                          {enquiry.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {enquiry.address.line1}, {enquiry.address.city} - {enquiry.address.pincode}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Product Cost</p>
                            <p className="font-semibold text-base">
                              ₹{enquiry.estimatedPrice.toLocaleString('en-IN')}
                            </p>
                          </div>

                          {enquiry.status === 'Approved' && enquiry.shippingCharge && (
                            <>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Truck className="h-3 w-3 text-blue-600" />
                                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100">Shipping Charges</p>
                                </div>
                                <p className="font-semibold text-base text-blue-900 dark:text-blue-100">
                                  ₹{enquiry.shippingCharge.toLocaleString('en-IN')}
                                </p>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                                  @ ₹{enquiry.shippingRatePerKg}/kg × {convertToKg(enquiry.quantity, enquiry.unit).toFixed(2)}kg
                                </p>
                              </div>

                              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-3 rounded-lg border-2 border-green-500">
                                <p className="text-xs text-green-700 dark:text-green-300">Final Total (incl. shipping)</p>
                                <p className="font-bold text-green-900 dark:text-green-100 text-xl">
                                  ₹{enquiry.finalTotal.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </>
                          )}

                          {enquiry.status === 'Pending' && (
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">Product Total (excl. shipping)</p>
                              <p className="font-bold text-primary text-lg">
                                ₹{enquiry.estimatedPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none lg:w-full"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Button>

                        {enquiry.status === 'Pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveClick(enquiry)}
                              size="sm"
                              className="flex-1 lg:flex-none lg:w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve & Add Shipping
                            </Button>
                            <Button
                              onClick={() => handleReject(enquiry.id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1 lg:flex-none lg:w-full"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Rate Dialog */}
      <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Add Shipping Charges
            </DialogTitle>
            <DialogDescription>
              Set the shipping rate per kg for this inquiry. The final total will be calculated automatically.
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-4 py-4">
              {/* Inquiry Details */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{selectedEnquiry.productName}</p>
                    <p className="text-xs text-muted-foreground">{selectedEnquiry.inquiryId}</p>
                  </div>
                  <Badge variant="secondary">{selectedEnquiry.buyerName}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-sm font-semibold">
                      {selectedEnquiry.quantity} {selectedEnquiry.unit}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      ({convertToKg(selectedEnquiry.quantity, selectedEnquiry.unit).toFixed(2)} kg)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Product Cost</p>
                    <p className="text-sm font-semibold">
                      ₹{selectedEnquiry.estimatedPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {selectedEnquiry.address && (
                  <div className="bg-background p-2 rounded border">
                    <p className="text-[10px] text-muted-foreground">Delivery Address</p>
                    <p className="text-xs font-medium">
                      {selectedEnquiry.address.line1}
                      {selectedEnquiry.address.line2 && `, ${selectedEnquiry.address.line2}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedEnquiry.address.city}, {selectedEnquiry.address.state} - {selectedEnquiry.address.pincode}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Rate Input */}
              <div className="space-y-2">
                <Label htmlFor="shippingRate" className="text-sm font-medium">
                  Shipping Rate (per kg) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="shippingRate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter rate per kg (e.g., 2.50)"
                    value={shippingRatePerKg}
                    onChange={(e) => {
                      setShippingRatePerKg(e.target.value);
                      setShippingError('');
                    }}
                    className={`pl-9 ${shippingError ? 'border-destructive' : ''}`}
                  />
                </div>
                {shippingError && (
                  <p className="text-sm text-destructive">{shippingError}</p>
                )}
              </div>

              {/* Live Calculation Preview */}
              {shippingRatePerKg && parseFloat(shippingRatePerKg) > 0 && (
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="space-y-2">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Calculated Charges:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Product Cost:</span>
                        <span className="font-semibold">₹{selectedEnquiry.estimatedPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-blue-700 dark:text-blue-300">
                        <span>Shipping ({convertToKg(selectedEnquiry.quantity, selectedEnquiry.unit).toFixed(2)}kg @ ₹{shippingRatePerKg}/kg):</span>
                        <span className="font-semibold">
                          ₹{calculateShipping(selectedEnquiry.quantity, selectedEnquiry.unit, parseFloat(shippingRatePerKg)).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-blue-300 dark:border-blue-700 font-bold">
                        <span>Final Total:</span>
                        <span className="text-green-700 dark:text-green-400">
                          ₹{(selectedEnquiry.estimatedPrice + calculateShipping(selectedEnquiry.quantity, selectedEnquiry.unit, parseFloat(shippingRatePerKg))).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowShippingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApproval}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
