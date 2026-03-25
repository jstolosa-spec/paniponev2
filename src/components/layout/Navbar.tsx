import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Directory', href: '/directory' },
  { label: 'Services', href: '/appointments' },
  { label: 'Officials', href: '/officials' },
  { label: 'Contact', href: '/contact' },
];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="rounded-lg bg-sky-500 p-1.5 transition-transform group-hover:scale-110">
                <Landmark className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Panipuan<span className="text-sky-500">Connect</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-sky-500",
                    location.pathname === link.href
                      ? "text-sky-600 dark:text-sky-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 border-l pl-6">
                <ThemeToggle className="relative top-0 right-0" />
                <Button variant="destructive" size="sm" className="gap-2" asChild>
                  <a href="tel:911">
                    <PhoneCall className="h-4 w-4" />
                    Emergency
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle className="relative top-0 right-0" />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-400">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b bg-white dark:bg-slate-950 px-4 py-4 space-y-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.href
                    ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="destructive" className="w-full mt-4 gap-2" asChild>
              <a href="tel:911"><PhoneCall className="h-4 w-4" /> Emergency Call</a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}