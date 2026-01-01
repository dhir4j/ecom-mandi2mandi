'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Package,
  MapPin,
  Calendar,
  User,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

interface ProductBuyContentProps {
  product: Product;
}

export function ProductBuyContent({ product }: ProductBuyContentProps) {
  const { user } = useAuth();
  const { addToCart, minimumQuantity } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [quantity, setQuantity] = useState<number>(minimumQuantity);
  const [loading, setLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // Address form state
  const [formData, setFormData] = useState({
    buyerName: user?.name || '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentOption: 'online',
    gateway: 'payu',
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['buyerName', 'mobile', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: 'destructive',
        });
        return false;
      }
    }

    if (quantity < minimumQuantity) {
      toast({
        title: 'Invalid Quantity',
        description: `Minimum purchase quantity is ${minimumQuantity} ${product.unit}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
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

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to buy products',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    setShowAddressForm(true);
  };

  const handleDirectPurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setBuyNowLoading(true);

    try {
      const totalPrice = quantity * product.price;

      const response = await fetch(`${API_BASE_URL}/api/initiate-payment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.title,
          quantity: quantity,
          unit: product.unit,
          totalPrice: totalPrice,
          amount: totalPrice,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
        setBuyNowLoading(false);
        return;
      }

      // Redirect to payment gateway
      if (formData.gateway === 'sabpaisa') {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.sabpaisa_url;

        Object.keys(data).forEach(key => {
          if (key !== 'sabpaisa_url') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else if (formData.gateway === 'airpay') {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.airpay_url;

        Object.keys(data).forEach(key => {
          if (key !== 'airpay_url') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payu_url;

        Object.keys(data).forEach(key => {
          if (key !== 'payu_url') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
      setBuyNowLoading(false);
    }
  };

  const totalPrice = quantity * product.price;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                unoptimized
              />
            </div>
          </Card>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 2}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{product.seller}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{product.date}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-lg text-muted-foreground">/ {product.unit}</span>
            </div>

            <Badge variant="secondary" className="mb-4">
              <Package className="w-3 h-3 mr-1" />
              Minimum Order: {minimumQuantity} {product.unit}
            </Badge>
          </div>

          <Separator />

          {!showAddressForm ? (
            /* Quantity Selection */
            <Card>
              <CardHeader>
                <CardTitle>Select Quantity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quantity (Minimum: {minimumQuantity} {product.unit})</Label>
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
                      className="text-center text-lg font-semibold"
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
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-2xl font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {quantity} {product.unit} × ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {loading ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Address & Payment Form */
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Payment Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressForm(false)}
                  className="absolute top-4 right-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDirectPurchase} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyerName">Full Name *</Label>
                      <Input
                        id="buyerName"
                        value={formData.buyerName}
                        onChange={(e) => handleInputChange('buyerName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gateway">Payment Gateway</Label>
                    <Select
                      value={formData.gateway}
                      onValueChange={(value) => handleInputChange('gateway', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payu">PayU</SelectItem>
                        <SelectItem value="sabpaisa">SabPaisa</SelectItem>
                        <SelectItem value="airpay">Airpay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-2xl font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={buyNowLoading}
                  >
                    {buyNowLoading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
