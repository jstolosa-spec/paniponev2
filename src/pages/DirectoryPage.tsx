import React, { useState } from 'react';
import { Search, Phone, MapPin, Briefcase, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { DirectoryItem, SkilledWorker, JobPosting } from '@shared/types';
export function DirectoryPage() {
  const [search, setSearch] = useState('');
  const { data: businesses } = useQuery({ queryKey: ['directory'], queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory') });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: () => api<{ items: SkilledWorker[] }>('/api/skills') });
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: () => api<{ items: JobPosting[] }>('/api/jobs') });
  const filteredBusinesses = businesses?.items.filter(b => b.name.toLowerCase().includes(search.toLowerCase())) || [];
  const filteredSkills = skills?.items.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.skill.toLowerCase().includes(search.toLowerCase())) || [];
  const filteredJobs = jobs?.items.filter(j => j.title.toLowerCase().includes(search.toLowerCase())) || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PanipOne Community Directory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Connecting Panipuan residents with verified local businesses, skilled professionals, and growth opportunities.
        </p>
      </div>
      <div className="sticky top-[4.5rem] z-30 bg-background/95 backdrop-blur-sm py-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PanipOne registry..."
            className="pl-10 h-12 text-lg shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="businesses" className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 w-full md:w-auto p-1 h-auto grid grid-cols-3">
          <TabsTrigger value="businesses" className="py-2.5">Local Business</TabsTrigger>
          <TabsTrigger value="skills" className="py-2.5">Skills Registry</TabsTrigger>
          <TabsTrigger value="jobs" className="py-2.5">Job Bulletin</TabsTrigger>
        </TabsList>
        <TabsContent value="businesses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map(item => (
              <Card key={item.id} className="overflow-hidden border-none shadow-soft hover:-translate-y-1 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader><CardTitle className="text-xl">{item.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {item.address}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-500"><Phone className="h-4 w-4" /> {item.phone}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSkills.map(worker => (
              <Card key={worker.id} className="text-center p-6 border-none shadow-soft hover:shadow-lg transition-all group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={worker.image} className="w-full h-full rounded-full object-cover border-4 border-sky-50" />
                  {worker.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{worker.name}</h3>
                <Badge variant="outline" className="mb-4">{worker.skill}</Badge>
                <Button variant="secondary" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> Contact
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <Card key={job.id} className="border-l-4 border-l-sky-500 shadow-soft">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <p className="text-sky-600 font-medium text-sm">{job.businessName}</p>
                    </div>
                    <Badge variant="secondary"><Briefcase className="h-3 w-3 mr-1" /> Hiring</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map(s => <Badge key={s} variant="outline" className="bg-sky-50/50">{s}</Badge>)}
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Deadline: {job.deadline}</span>
                    <Button size="sm" className="bg-sky-500">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}