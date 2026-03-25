import React, { useState } from 'react';
import { ArrowRight, Bell, ShieldAlert, Store, Users, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { Announcement } from '@shared/types';
export function HomePage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => api<{ items: Announcement[] }>('/api/announcements'),
  });
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Badge variant="outline" className="px-4 py-1 text-sky-600 border-sky-200 bg-sky-50/50">
                Official Community Portal
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Serving the People of <span className="text-sky-500">Panipuan</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Access local services, stay updated with community news, and connect with your barangay leadership all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8" asChild>
                  <Link to="/directory">Explore Directory <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                  <Link to="/officials">Meet Officials</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=1200"
                  alt="Barangay Landscape"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-sky-100 p-2 rounded-lg"><MapPin className="h-5 w-5 text-sky-600" /></div>
                  <span className="font-bold">San Fernando</span>
                </div>
                <p className="text-sm text-muted-foreground">Heart of Pampanga's thriving communities.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Announcements */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Announcements</h2>
              <p className="text-muted-foreground">Stay informed about what's happening in our barangay.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              [1, 2].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-slate-200 dark:bg-slate-800" />
              ))
            ) : (
              announcements?.items.slice(0, 4).map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setSelectedAnnouncement(item)}
                >
                  <div className="flex h-full">
                    <div className={cn(
                      "w-2 shrink-0 transition-all group-hover:w-4",
                      item.category === 'Alert' ? "bg-rose-500" : "bg-sky-500"
                    )} />
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-sky-600 transition-colors">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2 leading-relaxed">
                        {item.content}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-xs font-bold text-sky-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Full Story <ExternalLink className="ml-2 h-3 w-3" />
                      </div>
                    </CardHeader>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Feature Grids (Omitted inner content for brevity, same as previous Phase 4) */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-soft hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="bg-sky-100 dark:bg-sky-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="h-6 w-6 text-sky-600" />
                </div>
                <CardTitle>Local Directory</CardTitle>
                <CardDescription>Support local businesses and find essential services nearby.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/directory" className="text-sky-600 font-medium flex items-center gap-1 hover:underline">
                  Browse Listings <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Transparency</CardTitle>
                <CardDescription>Get to know your elected officials and their commitment to you.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/officials" className="text-emerald-600 font-medium flex items-center gap-1 hover:underline">
                  View Roster <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="border-none shadow-soft bg-rose-50 dark:bg-rose-950/20 hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="bg-rose-100 dark:bg-rose-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle>Emergency Help</CardTitle>
                <CardDescription>Quick access to hotlines, medical, and fire response services.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/emergency" className="text-rose-600 font-medium flex items-center gap-1 hover:underline">
                  Emergency Info <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Announcement Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={(o) => !o && setSelectedAnnouncement(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={selectedAnnouncement.category === 'Alert' ? 'bg-rose-500' : 'bg-sky-500'}>
                    {selectedAnnouncement.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{selectedAnnouncement.date}</span>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedAnnouncement.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {selectedAnnouncement.content}
              </div>
              <div className="pt-6 border-t flex justify-end">
                <Button onClick={() => setSelectedAnnouncement(null)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}