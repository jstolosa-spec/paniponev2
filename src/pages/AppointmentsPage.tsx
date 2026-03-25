import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, CheckCircle2, Clock, ShieldCheck, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import type { Appointment, Resident, DocumentType } from '@shared/types';
export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [docType, setDocType] = useState<DocumentType>('Clearance');
  const [residentName, setResidentName] = useState('');
  const [searchResident, setSearchResident] = useState('');
  const queryClient = useQueryClient();
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents') });
  const createAppointment = useMutation({
    mutationFn: (data: Partial<Appointment>) => api('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment scheduled successfully');
      setResidentName('');
      setSelectedDate(undefined);
    }
  });
  const verifiedResident = residents?.items.find(r => r.name.toLowerCase() === searchResident.toLowerCase());
  const isEligible = verifiedResident ? differenceInDays(new Date(), new Date(verifiedResident.registrationDate)) > 180 : false;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !residentName) return toast.error('Please fill in all fields');
    const isRegistryMatch = residents?.items.some(r => r.name.toLowerCase() === residentName.toLowerCase());
    if (!isRegistryMatch) {
      toast.error('Name not found in resident registry. Please contact barangay hall.');
      return;
    }
    createAppointment.mutate({
      residentName,
      documentType: docType,
      scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
      status: 'pending'
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Residency Checker */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-sky-100 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-500" />
                Residency Tracker
              </CardTitle>
              <CardDescription>Check if you are eligible for certain certifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter full name..."
                  className="pl-10"
                  value={searchResident}
                  onChange={(e) => setSearchResident(e.target.value)}
                />
              </div>
              {searchResident && (
                <div className={cn("p-4 rounded-xl border text-sm", isEligible ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800")}>
                  {verifiedResident ? (
                    <>
                      <div className="flex justify-between items-start mb-2">
                         <p className="font-bold">{isEligible ? 'Verified Resident' : 'New Resident'}</p>
                         <Badge variant={isEligible ? 'default' : 'outline'} className={isEligible ? 'bg-emerald-600' : 'text-amber-600 border-amber-200'}>
                           {isEligible ? 'Eligible' : 'Pending'}
                         </Badge>
                      </div>
                      <p>Registered: {verifiedResident.registrationDate}</p>
                      <p className="mt-2 text-xs opacity-80 leading-relaxed">
                        {isEligible ? 'Eligible for all barangay certificates.' : 'Requires 6 months residency for full eligibility for some documents.'}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600">
                      <AlertCircle className="h-4 w-4" />
                      <p>Resident not found in official registry.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Appointment Form */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="mb-6">
               <h2 className="text-3xl font-bold">Schedule Document Pickup</h2>
               <p className="text-muted-foreground">Select a date to claim your requested documents at the Barangay Hall.</p>
            </div>
            <Card className="shadow-lg border-none">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name (from registry)</label>
                    <Input value={residentName} onChange={(e) => setResidentName(e.target.value)} placeholder="e.g. Juan Dela Cruz" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Document Type</label>
                    <Select onValueChange={(v) => setDocType(v as DocumentType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Document" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Clearance">Barangay Clearance</SelectItem>
                        <SelectItem value="Indigency">Certificate of Indigency</SelectItem>
                        <SelectItem value="Permits">Business Permit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pick-up Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-50 border-slate-200">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus disabled={{ before: new Date() }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 h-11 font-bold" disabled={createAppointment.isPending}>
                      Confirm Appointment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-4">Ongoing Requests</h3>
            <div className="space-y-3">
              {!appointments?.items.length && <p className="text-sm text-muted-foreground italic">No current appointments found.</p>}
              {appointments?.items.filter(a => a.status !== 'completed').map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-sky-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-sky-50 dark:bg-sky-900/30 p-2.5 rounded-xl text-sky-600"><FileText className="h-5 w-5" /></div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{app.documentType}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {app.scheduledDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant={app.status === 'confirmed' ? 'default' : 'secondary'} className={cn("capitalize px-3", app.status === 'confirmed' ? 'bg-sky-500' : '')}>
                    {app.status === 'confirmed' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}