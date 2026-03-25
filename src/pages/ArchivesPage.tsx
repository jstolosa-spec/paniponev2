import React, { useState } from 'react';
import { Search, Archive, FileText, Calendar, Filter, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export default function ArchivesPage() {
  const [search, setSearch] = useState('');
  // Mock public archives
  const publicRecords = [
    { id: 'R1', title: 'Community Resolution 2023-04', date: '2023-11-01', category: 'Resolution', summary: 'Approval of the new solar street lighting project.' },
    { id: 'R2', title: 'Public Notice: Road Closure', date: '2023-10-15', category: 'Notice', summary: 'Temporary closure of Purok 3 main road for maintenance.' },
    { id: 'R3', title: 'Case Summary: Boundary Dispute Resolved', date: '2023-09-20', category: 'Lupon', summary: 'Successful mediation between parties regarding fence alignment.' },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Public Archives</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Transparent access to non-confidential community records, resolutions, and public notices.
        </p>
      </div>
      <div className="sticky top-[4.5rem] z-30 bg-background/95 backdrop-blur-sm py-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records by title, date, or keyword..."
            className="pl-10 h-12 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-soft">
            <CardHeader><CardTitle className="text-sm">Filter by Type</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sky-600 bg-sky-50 font-bold">All Records</Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-slate-50">Resolutions</Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-slate-50">Public Notices</Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-slate-50">Lupon Summaries</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3 space-y-6">
          {publicRecords.map(record => (
            <Card key={record.id} className="border-none shadow-soft hover:shadow-md transition-shadow group cursor-pointer overflow-hidden">
              <div className="flex h-full">
                <div className="w-1 bg-sky-500 group-hover:w-2 transition-all" />
                <div className="p-6 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-sky-50 text-sky-700 uppercase tracking-tighter text-[10px] px-2">
                      {record.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {record.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition-colors">{record.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{record.summary}</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-sky-600 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Document Details <FileText className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}