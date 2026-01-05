
'use client';

import { Menu, Leaf, LogOut, Shield, ShoppingCart, User, Package, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header({ className }: { className?: string }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const isPrivilegedUser = user?.role === 'trader';
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { href: '/trader-list', label: 'Traders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const renderAdminView = () => (
    <>
      {/* Admin Desktop */}
      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <Shield size={16}/> Admin Panel
          </Link>
        </Button>
        <Button variant="outline" onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </Button>
        <ThemeToggle />
      </nav>

      {/* Admin Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle asChild>
                <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                  <SheetClose asChild>
                    <>
                      <Leaf className="w-6 h-6 text-primary" />
                      <span className="text-lg font-bold font-headline">Mandi2Mandi</span>
                    </>
                  </SheetClose>
                </Link>
              </SheetTitle>
              <SheetDescription>
                Admin Mode
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow p-4">
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/admin" className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <Shield size={16} /> Admin Panel
                  </Link>
                </SheetClose>
              </nav>
            </div>
            <Separator />
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Separator/>
              <SheetClose asChild>
                <Button variant="ghost" onClick={logout} className="w-full justify-start text-lg font-medium p-0 text-destructive hover:text-destructive">
                  <div className="w-full text-left p-4 flex items-center">
                    Sign Out <LogOut className="ml-2 h-5 w-5" />
                  </div>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );

  return (
    <header className={`py-4 px-6 bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Leaf className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">
            Mandi2Mandi
          </h1>
        </Link>
        
        {isAdmin ? renderAdminView() : (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Button variant="ghost" asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              {isAuthenticated ? (
                <>
                  {isPrivilegedUser && (
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  )}
                  {/* Cart Button */}
                  <Button variant="ghost" size="icon" asChild className="relative">
                    <Link href="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {cartCount}
                        </Badge>
                      )}
                      <span className="sr-only">Cart ({cartCount} items)</span>
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cart" className="w-full cursor-pointer">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          My Cart
                          {cartCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {cartCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-orders" className="w-full cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-inquiries" className="w-full cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          My Inquiries
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
              <ThemeToggle />
            </nav>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle asChild>
                      <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <SheetClose asChild>
                          <>
                            <Leaf className="w-6 h-6 text-primary" />
                            <span className="text-lg font-bold font-headline">Mandi2Mandi</span>
                          </>
                        </SheetClose>
                      </Link>
                    </SheetTitle>
                    {isAuthenticated && user ? (
                      <SheetDescription>
                        Signed in as {user.name}
                      </SheetDescription>
                    ) : (
                      <SheetDescription className="sr-only">A list of navigation links and actions for Mandi2Mandi.</SheetDescription>
                    )}
                  </SheetHeader>
                  <div className="flex-grow p-4">
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link href={link.href} className="text-lg font-medium text-muted-foreground hover:text-foreground">
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                      {isAuthenticated && (
                        <>
                          {isPrivilegedUser && (
                            <SheetClose asChild>
                              <Link href="/dashboard" className="text-lg font-medium text-muted-foreground hover:text-foreground">Dashboard</Link>
                            </SheetClose>
                          )}
                          <SheetClose asChild>
                            <Link href="/account" className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                              <User className="h-5 w-5" />
                              My Profile
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/cart" className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                              <ShoppingCart className="h-5 w-5" />
                              My Cart
                              {cartCount > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                  {cartCount}
                                </Badge>
                              )}
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/my-orders" className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Order History
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/my-inquiries" className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              My Inquiries
                            </Link>
                          </SheetClose>
                        </>
                      )}
                    </nav>
                  </div>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Theme</span>
                        <ThemeToggle />
                      </div>
                      <Separator/>
                    {isAuthenticated ? (
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={logout} className="w-full justify-start text-lg font-medium p-0 text-destructive hover:text-destructive">
                          <div className="w-full text-left p-4 flex items-center">
                            Sign Out <LogOut className="ml-2 h-5 w-5" />
                          </div>
                        </Button>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                            <Button variant="ghost" className="w-full justify-start text-lg font-medium p-0" asChild>
                                <Link href="/login" className="w-full text-left p-4">Sign In</Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button className="w-full text-lg" asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
