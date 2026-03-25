import React, { useState } from 'react';
import { Search, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_DIRECTORY } from '@shared/mock-data';
import { cn } from '@/lib/utils';
const CATEGORIES = ['All', 'Food', 'Health', 'Services', 'Retail'];
export function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = MOCK_DIRECTORY.filter(item => {
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
              className="pl-10 h-11 bg-secondary border-none"
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
                  "rounded-full whitespace-nowrap",
                  category === cat ? "bg-sky-500 hover:bg-sky-600" : ""
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-soft hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-sm border-none">
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
                <Button variant="ghost" size="sm" className="w-full mt-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50">
                  More Details <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
          <p className="text-muted-foreground">No results found for your search.</p>
          <Button variant="link" onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}