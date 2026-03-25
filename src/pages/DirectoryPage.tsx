import React, { useState } from 'react';
import { Search, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { DirectoryItem } from '@shared/types';
const CATEGORIES = ['All', 'Food', 'Health', 'Services', 'Retail'];
export function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { data, isLoading } = useQuery({
    queryKey: ['directory'],
    queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory'),
  });
  const filtered = (data?.items ?? []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Local Directory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover local businesses, healthcare providers, and essential services within Barangay Panipuan.
        </p>
      </div>
      <div className="sticky top-[4.5rem] z-30 bg-background/95 backdrop-blur-sm py-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses or services..."
              className="pl-10 h-11 bg-secondary border-input focus:ring-sky-500 ring-offset-2 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full whitespace-nowrap transition-all duration-300 hover:scale-105",
                  category === cat ? "bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20" : ""
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-soft animate-pulse">
              <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full border-none shadow-soft hover:-translate-y-1 hover:shadow-lg transition-all group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 right-4 bg-white/95 text-slate-900 backdrop-blur-sm border-none shadow-sm">
                      {item.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl group-hover:text-sky-600 transition-colors">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4 text-sky-500 shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Phone className="h-4 w-4 text-sky-500 shrink-0" />
                        <span>{item.phone}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-colors">
                      View Details <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-muted-foreground">No results found for your search.</p>
          <Button variant="link" className="text-sky-600" onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}