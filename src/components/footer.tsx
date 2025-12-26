import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Brand Info */}
        <div className="mb-8 lg:mb-0">
          <div className="lg:hidden">
            <Link href="/" className="flex items-center gap-2 mb-4 text-foreground">
              <Leaf className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold font-headline">
              RKR MANTITOMANDI PRIVATE LIMITED
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner for fresh produce, connecting farms directly to you.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Ground floor parag plaza fazalpura ujjain,<br/>
              Madhya Pradesh – 456006,<br/>
              India
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Brand Info for Desktop */}
          <div className="hidden lg:block">
            <Link href="/" className="flex items-center gap-2 mb-4 text-foreground">
              <Leaf className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold font-headline">
              RKR MANTITOMANDI PRIVATE LIMITED
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner for fresh produce, connecting farms directly to you.
            </p>
            <p className="text-muted-foreground text-sm">
              Ground floor parag plaza fazalpura ujjain,<br/>
              Madhya Pradesh – 456006,<br/>
              India
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 lg:mb-4 text-card-foreground text-sm lg:text-base">Company</h3>
            <ul className="space-y-1.5 lg:space-y-2">
              <li><Link href="/about" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 lg:mb-4 text-card-foreground text-sm lg:text-base">Legal</h3>
            <ul className="space-y-1.5 lg:space-y-2">
              <li><Link href="/privacy" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3 lg:mb-4 text-card-foreground text-sm lg:text-base">Explore</h3>
            <ul className="space-y-1.5 lg:space-y-2">
              <li><Link href="/products" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/#roles" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">For Farmers</Link></li>
              <li><Link href="/#roles" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">For Traders</Link></li>
              <li><Link href="/#roles" className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">For Buyers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Mandi2Mandi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
