import React from 'react';
import { Phone, Mail, Award, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Official } from '@shared/types';
export function OfficialsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['officials'],
    queryFn: () => api<{ items: Official[] }>('/api/officials'),
  });
  const captain = data?.items.find(o => 
    o.position.toLowerCase().includes('captain') || o.position.toLowerCase().includes('punong')
  );
  const kagawads = data?.items.filter(o => o.id !== captain?.id) ?? [];
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
        <p className="mt-4 text-muted-foreground font-medium">Accessing PanipOne Governance Roster...</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PanipOne Governance</h1>
        <p className="text-lg text-muted-foreground">
          Transparent leadership for Barangay Panipuan. Our officials are committed to accountability and community-led progress via the PanipOne portal.
        </p>
      </div>
      {captain && (
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <Badge className="bg-sky-500 text-white px-6 py-1 rounded-full text-sm uppercase tracking-widest font-bold shadow-lg shadow-sky-500/20">
              PanipOne Leadership
            </Badge>
          </div>
          <Card className="max-w-4xl mx-auto overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900 group">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto h-full overflow-hidden">
                <img
                  src={captain.image}
                  alt={captain.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{captain.name}</h2>
                  <p className="text-sky-600 font-semibold text-lg uppercase tracking-wide">{captain.position}</p>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "Leading Panipuan towards a sustainable and inclusive future for every resident, ensuring transparency through PanipOne."
                </p>
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg text-sky-600"><Phone className="h-4 w-4" /></div>
                    <span className="text-sm font-medium">Contact verified on PanipOne</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      <div className="space-y-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sangguniang Barangay</h3>
          <p className="text-muted-foreground mt-2">PanipOne Council Registry</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kagawads.map((item) => (
            <Card key={item.id} className="text-center overflow-hidden border-none shadow-soft hover:shadow-lg transition-all group bg-white dark:bg-slate-900">
              <div className="pt-8 pb-4 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-50 dark:border-sky-900/30 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-0 bg-sky-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-sky-600 transition-colors">{item.name}</CardTitle>
                <Badge variant="outline" className="w-fit mx-auto border-sky-200 dark:border-sky-900 text-sky-600 dark:text-sky-400 uppercase text-[10px] tracking-wider">
                  {item.position}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 text-muted-foreground border-t pt-4 mt-2">
                  <Phone className="h-4 w-4" />
                  <Mail className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}