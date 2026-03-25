import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LogOut, Trash2, Plus, Edit, MessageSquare, ShieldCheck, Scale, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AnnouncementForm, BusinessForm, OfficialForm, JobForm } from '@/components/admin/AdminDialogs';
import { DocumentPreview } from '@/components/DocumentPreview';
import type { Announcement, DirectoryItem, Official, Appointment, Resident, SkilledWorker, JobPosting, BlotterReport, LuponCase } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const { data: apps } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents') });
  const { data: blotters } = useQuery({ queryKey: ['blotter'], queryFn: () => api<{ items: BlotterReport[] }>('/api/blotter'), enabled: ['superAdmin', 'secretary'].includes(user?.role || '') });
  const { data: lupon } = useQuery({ queryKey: ['lupon'], queryFn: () => api<{ items: LuponCase[] }>('/api/lupon'), enabled: ['superAdmin', 'secretary'].includes(user?.role || '') });
  const verifyResident = useMutation({
    mutationFn: ({id, status}: {id: string, status: string}) => api(`/api/residents/${id}/verify`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['residents'] }); toast.success('Status updated'); }
  });
  const generateSummons = useMutation({
    mutationFn: (id: string) => api(`/api/lupon/${id}/summons`, { method: 'PUT' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lupon'] }); toast.success('Summons Generated'); }
  });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isManagement = ['superAdmin', 'secretary', 'staff'].includes(user?.role || '');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Logged in as {user?.name} ({user?.role})</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 h-auto flex-wrap">
          <TabsTrigger value="appointments">Queue</TabsTrigger>
          {isManagement && <TabsTrigger value="residents">Residents</TabsTrigger>}
          {['superAdmin', 'secretary'].includes(user?.role || '') && (
            <>
              <TabsTrigger value="blotter">e-Blotter</TabsTrigger>
              <TabsTrigger value="lupon">Lupon Cases</TabsTrigger>
            </>
          )}
          {user?.role === 'resident' && <TabsTrigger value="my-status">My Status</TabsTrigger>}
        </TabsList>
        <TabsContent value="appointments">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Q#</TableHead><TableHead>Resident</TableHead><TableHead>Doc Type</TableHead><TableHead>Est. Wait</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {apps?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">#{item.queueNumber}</TableCell>
                    <TableCell>{item.residentName}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell>{item.estimatedWaitTime}</TableCell>
                    <TableCell><Badge>{item.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {isManagement && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => setSelectedDoc(item)}>
                          <FileText className="h-3 w-3" /> Preview
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="residents">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Verification</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {residents?.items.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">{res.name}</TableCell>
                    <TableCell>
                      <Badge variant={res.verificationStatus === 'verified' ? 'default' : 'secondary'}>{res.verificationStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {res.verificationStatus === 'pending' && (
                        <>
                          <Button size="sm" className="bg-emerald-600" onClick={() => verifyResident.mutate({id: res.id, status: 'verified'})}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => verifyResident.mutate({id: res.id, status: 'rejected'})}>Reject</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="blotter">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Confidential Blotter Records</h3>
            <Button className="bg-sky-600"><Plus className="h-4 w-4 mr-2" /> New Entry</Button>
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Date</TableHead><TableHead>Parties Involved</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {blotters?.items.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.parties.join(' vs ')}</TableCell>
                    <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="lupon">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Case#</TableHead><TableHead>Type</TableHead><TableHead>Summons</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {lupon?.items.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.id.slice(0,8)}</TableCell>
                    <TableCell className="font-medium">{l.caseType}</TableCell>
                    <TableCell>{l.summonsGenerated ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : 'Pending'}</TableCell>
                    <TableCell className="text-right">
                       {!l.summonsGenerated && <Button size="sm" variant="outline" onClick={() => generateSummons.mutate(l.id)}>Generate Summons</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
            <Button variant="ghost" className="absolute top-4 right-4" onClick={() => setSelectedDoc(null)}>Close</Button>
            <DocumentPreview 
              title={selectedDoc.documentType} 
              residentName={selectedDoc.residentName} 
              date={selectedDoc.scheduledDate} 
            />
          </div>
        </div>
      )}
    </div>
  );
}