import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark, PhoneCall, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@shared/types';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // Strict primitive selectors for Zustand v5
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const userRole = useAuthStore(s => s.user?.role) as UserRole | undefined;
  const getNavLinks = () => {
    const base = [
      { label: 'Home', href: '/' },
      { label: 'Archives', href: '/archives' },
      { label: 'Services', href: '/appointments' },
      { label: 'Directory', href: '/directory' },
    ];
    if (isAuthenticated) {
      if (userRole && ['superAdmin', 'secretary', 'staff'].includes(userRole)) {
        base.push({ label: 'Management', href: '/admin' });
      } else {
        base.push({ label: 'My Portal', href: '/admin' });
        base.push({ label: 'Profile', href: '/profile' });
      }
    } else {
      base.push({ label: 'Register', href: '/register' });
      base.push({ label: 'Contact', href: '/contact' });
    }
    return base;
  };
  const navLinks = getNavLinks();
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="rounded-lg bg-primary p-1.5 transition-transform group-hover:scale-110">
                <Landmark className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Panipuan<span className="text-primary">Connect</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary font-semibold underline underline-offset-4 decoration-2"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 border-l pl-6">
                <ThemeToggle className="relative top-0 right-0" />
                {isAuthenticated ? (
                  <Badge variant="outline" className="gap-2 bg-accent text-accent-foreground border-primary/20 py-1">
                    <UserIcon className="h-3 w-3" />
                    {userRole?.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ) : (
                  <Button variant="destructive" size="sm" className="gap-2" asChild>
                    <a href="tel:911"><PhoneCall className="h-4 w-4" /> 911</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle className="relative top-0 right-0" />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-muted-foreground hover:text-foreground">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, h: 0 }}
            animate={{ opacity: 1, h: 'auto' }}
            exit={{ opacity: 0, h: 0 }}
            className="md:hidden border-b bg-background px-4 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.href
                    ? "bg-accent text-accent-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button variant="destructive" className="w-full mt-4 gap-2" asChild>
                <a href="tel:911"><PhoneCall className="h-4 w-4" /> Emergency 911</a>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}