import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, LogOut, Heart, Home, Building2, Users, Phone, BookOpen, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/agents', label: 'About', icon: Users },
  { href: '/blog', label: 'Insights', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location === '/';
  const showTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showTransparent
          ? 'bg-transparent'
          : 'bg-[#111111]/95 backdrop-blur-sm shadow-lg'
      )}
      data-testid="navbar"
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/"
            className={cn(
              'text-xl lg:text-2xl font-bold tracking-tight transition-colors',
              showTransparent ? 'text-white' : 'text-white'
            )}
            data-testid="link-logo"
          >
            JW<span className="text-gold">REALTY</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                  showTransparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-white/80 hover:text-white',
                  location === link.href && 'text-gold'
                )}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full',
                    location === link.href && 'w-full'
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center gap-2',
                      showTransparent ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
                    )}
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gold text-white text-xs">
                        {user.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline">{user.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/favorites" className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-favorites">
                      <Heart className="h-4 w-4" />
                      Saved Properties
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'agent' || user.role === 'admin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-admin">
                          <Building2 className="h-4 w-4" />
                          Manage Listings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive cursor-pointer"
                    data-testid="button-signout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={cn(
                      showTransparent ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
                    )}
                    data-testid="button-login"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="bg-gold hover:bg-gold/90 text-white"
                    data-testid="button-signup"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={showTransparent ? 'text-white' : 'text-white'}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#111111] border-l border-white/10">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold text-white">
                    LUXE<span className="text-gold">ESTATES</span>
                  </span>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors',
                        location === link.href && 'bg-white/10 text-gold'
                      )}
                      data-testid={`link-mobile-${link.label.toLowerCase()}`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-gold text-white">
                            {user.fullName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.fullName}</p>
                          <p className="text-white/60 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button
                          className="w-full bg-gold hover:bg-gold/90 text-white"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
