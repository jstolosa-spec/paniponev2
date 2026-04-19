import React, { useState } from 'react';
import { Search, Archive, FileText, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
export default function ArchivesPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const publicRecords = [
    { id: 'R1', title: 'Community Resolution 2023-04', date: '2023-11-01', category: 'Resolution', summary: 'Approval of the new solar street lighting project.' },
    { id: 'R2', title: 'Public Notice: Road Closure', date: '2023-10-15', category: 'Notice', summary: 'Temporary closure of Purok 3 main road for maintenance.' },
    { id: 'R3', title: 'Case Summary: Boundary Dispute Resolved', date: '2023-09-20', category: 'Lupon', summary: 'Successful mediation between parties regarding fence alignment.' },
  ];
  const filteredRecords = publicRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(search.toLowerCase()) ||
                          record.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || record.category === activeFilter;
    return matchesSearch && matchesFilter;
  });
  const filterOptions = [
    { label: 'All Records', value: 'All' },
    { label: 'Resolutions', value: 'Resolution' },
    { label: 'Public Notices', value: 'Notice' },
    { label: 'Lupon Summaries', value: 'Lupon' },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-12 space-y-4">
          <Badge variant="outline" className="px-4 py-1 text-sky-600 border-sky-200 bg-sky-50/50">
            PanipOne Digital Repository
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Public Archives</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Transparent access to non-confidential community records, resolutions, and public notices approved by the Barangay Council.
          </p>
        </div>
        <div className="sticky top-[4.5rem] z-30 bg-background/95 backdrop-blur-sm py-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records by title, date, or keyword..."
              className="pl-10 h-12 shadow-sm text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-40 space-y-6">
              <Card className="border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Filter by Type</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {filterOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-medium transition-all",
                        activeFilter === opt.value
                          ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 font-bold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                      onClick={() => setActiveFilter(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            {filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredRecords.map((record, idx) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border-none shadow-soft hover:shadow-md transition-all group cursor-pointer overflow-hidden bg-white dark:bg-slate-900">
                      <div className="flex h-full">
                        <div className="w-1.5 bg-sky-500 group-hover:w-3 transition-all" />
                        <div className="p-6 w-full">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="secondary" className="bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 uppercase tracking-tighter text-[10px] px-2 font-bold">
                              {record.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3" /> {record.date}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition-colors text-slate-900 dark:text-white">
                            {record.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {record.summary}
                          </p>
                          <div className="mt-4 flex items-center text-xs font-bold text-sky-600 gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                            Request Detailed Copy <FileText className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-full shadow-sm mb-6">
                  <Archive className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Records Found</h3>
                <p className="text-muted-foreground max-w-xs text-center">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); setActiveFilter('All'); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}