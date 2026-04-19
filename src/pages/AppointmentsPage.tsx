import React, { useState, useMemo } from 'react';
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
import { format, differenceInDays, parseISO } from 'date-fns';
import { toast } from 'sonner';
import type { Appointment, Resident, DocumentType } from '@shared/types';
export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [docType, setDocType] = useState<DocumentType>('Clearance');
  const [residentName, setResidentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents') });
  const createAppointment = useMutation({
    mutationFn: (data: Partial<Appointment>) => api('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('PanipOne Appointment scheduled successfully');
      setResidentName('');
      setSelectedDate(undefined);
    }
  });
  const verifiedResident = useMemo(() => {
    if (!searchQuery?.trim()) return null;
    return residents?.items?.find(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())) ?? null;
  }, [searchQuery, residents]);
  const isEligible = useMemo(() => {
    if (!verifiedResident?.registrationDate) return false;
    try {
      const regDate = parseISO(verifiedResident.registrationDate);
      if (isNaN(regDate.getTime())) return false;
      return differenceInDays(new Date(), regDate) > 180;
    } catch (e) {
      console.warn('Date parsing failed', e);
      return false;
    }
  }, [verifiedResident]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !residentName?.trim()) return toast.error('Please fill in all fields');
    const registryMatch = residents?.items?.find(r => r.name.toLowerCase() === residentName.trim().toLowerCase());
    if (!registryMatch) {
      toast.error('Resident not found. Please register on PanipOne first.');
      return;
    }
    createAppointment.mutate({
      residentId: registryMatch.id,
      residentName: registryMatch.name,
      documentType: docType,
      scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
      status: 'pending'
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                Residency Tracker
              </CardTitle>
              <CardDescription>PanipOne verified residency lookup.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter full name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <div className={cn(
                  "p-4 rounded-xl border text-sm transition-colors",
                  verifiedResident && isEligible
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    : verifiedResident
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                  {verifiedResident ? (
                    <>
                      <div className="flex justify-between items-start mb-2">
                         <p className="font-bold">{isEligible ? 'Verified Resident' : 'New Resident'}</p>
                         <Badge variant={isEligible ? 'default' : 'outline'} className={isEligible ? 'bg-emerald-600' : 'text-amber-600 border-amber-500'}>
                           {isEligible ? 'Eligible' : 'Pending'}
                         </Badge>
                      </div>
                      <p>Registered: {verifiedResident.registrationDate}</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <p>Resident not found in PanipOne registry.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="mb-6">
               <h2 className="text-3xl font-bold text-foreground">Schedule Document Pickup</h2>
               <p className="text-muted-foreground">Claim your requested certificates via PanipOne at the Barangay Hall.</p>
            </div>
            <Card className="shadow-lg border-none bg-card">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Registry Name</label>
                    <Input value={residentName} onChange={(e) => setResidentName(e.target.value)} placeholder="e.g. Juan Dela Cruz" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Document Type</label>
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
                    <label className="text-sm font-medium text-foreground">Pick-up Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-secondary">
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
                    <Button type="submit" className="w-full h-11 font-bold" disabled={createAppointment.isPending}>
                      Confirm Appointment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground">Current Requests</h3>
            <div className="space-y-3">
              {(!appointments?.items || appointments.items.length === 0) && <p className="text-sm text-muted-foreground italic">No current appointments found.</p>}
              {appointments?.items?.filter(a => a.status !== 'completed').map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm transition-all hover:border-primary/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><FileText className="h-5 w-5" /></div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{app.documentType}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {app.scheduledDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant={app.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize px-3">
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