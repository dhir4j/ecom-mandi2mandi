'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ArrowLeft, IndianRupee, ChevronsRight, MapPin, CalendarDays, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function OrderClientPage({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState(product.unit);
  
  // Address state
  const [buyerName, setBuyerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setBuyerName(user.name);
    }
  }, [isAuthenticated, user]);

  const { totalPrice } = useMemo(() => {
    const numericQuantity = parseInt(quantity) || 0;
    const finalPrice = product.price * numericQuantity;
    return { totalPrice: finalPrice };
  }, [product, quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
        const num = parseInt(value);
        if (num > 0) {
            setQuantity(value);
        } else if (value === '') {
            setQuantity('');
        }
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with your order.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!buyerName || !mobile || !addressLine1 || !city || !state || !pincode || parseInt(quantity) <= 0) {
      toast({
        title: "Incomplete Details",
        description: "Please fill all the required address fields and ensure quantity is positive.",
        variant: "destructive",
      });
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return;
    }

    const query = new URLSearchParams({
      productId: product.id,
      quantity: quantity,
      unit: selectedUnit,
      totalPrice: String(totalPrice.toFixed(2)),
      amountToPay: String(totalPrice.toFixed(2)),
      paymentOption: 'full_advance',
      buyerName,
      mobile,
      pincode,
      addressLine1,
      addressLine2,
      city,
      state
    });
    router.push(`/checkout?${query.toString()}`);
  };

  const unitOptions = ['kg', 'piece', 'quintal', 'ton', 'box', 'crate'];
  const displayUnitOptions = unitOptions.includes(product.unit.toLowerCase()) ? unitOptions : [product.unit, ...unitOptions];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[300px] md:h-full">
              <Image 
                src={product.images[0]} 
                alt={product.title} 
                fill style={{objectFit: "cover"}} 
                data-ai-hint={product.aiHint}
                unoptimized
              />
            </div>
            <div className="p-8 flex flex-col">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl font-headline">{product.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/>{product.location}</div>
                    <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2"/>{product.date}</div>
                    <div className="flex items-center"><UserCircle className="w-4 h-4 mr-2"/>{product.seller}</div>
                </div>
                 <Badge variant="secondary" className="text-lg font-bold text-primary whitespace-normal text-left h-auto mt-4 w-fit capitalize">
                    ₹{product.price.toLocaleString('en-IN')} / {product.unit}
                </Badge>
              </CardHeader>

              <CardContent className="p-0 flex-grow space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="text" 
                      value={quantity} 
                      onChange={handleQuantityChange} 
                      placeholder="e.g., 5"
                      pattern="\d+"
                      inputMode="numeric"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                     <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                        <SelectTrigger id="unit">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {displayUnitOptions.map(u => (
                             <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-dashed pt-6">
                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                    <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="buyerName">Full Name</Label>
                                <Input id="buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Your full name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" required/>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1</Label>
                            <Input id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="House No., Building, Street" required/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                            <Input id="addressLine2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Apartment, suite, landmark, etc." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Mumbai" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g., Maharashtra" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" required/>
                            </div>
                        </div>
                    </div>
                </div>

              </CardContent>
              <CardFooter className="p-0 mt-8 flex flex-col items-stretch bg-secondary rounded-lg p-4">
                <div className="flex justify-between items-center text-xl font-bold text-primary mt-2">
                  <span className="font-headline">TOTAL AMOUNT</span>
                  <span className="flex items-center"><IndianRupee size={20} className="mr-1"/>{totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleProceedToCheckout} className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                  Proceed to Checkout <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
