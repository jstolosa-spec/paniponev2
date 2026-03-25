import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, Trash2, FileText, CheckCircle, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentPreview } from '@/components/DocumentPreview';
import { AnnouncementForm, BusinessForm, OfficialForm, JobForm } from '@/components/admin/AdminDialogs';
import type { Appointment, Resident, BlotterReport, LuponCase, Announcement, DirectoryItem, Official, JobPosting } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role);
  const userName = useAuthStore((s) => s.user?.name);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const isManagement = ['superAdmin', 'secretary', 'staff'].includes(userRole || '');
  const isSuperAdmin = userRole === 'superAdmin';
  // Core Data Queries
  const { data: apps } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents'), enabled: isManagement });
  const { data: blotters } = useQuery({ queryKey: ['blotter'], queryFn: () => api<{ items: BlotterReport[] }>('/api/blotter'), enabled: isManagement });
  const { data: lupon } = useQuery({ queryKey: ['lupon'], queryFn: () => api<{ items: LuponCase[] }>('/api/lupon'), enabled: isManagement });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => api<{ items: Announcement[] }>('/api/announcements'), enabled: isManagement });
  const { data: directory } = useQuery({ queryKey: ['directory'], queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory'), enabled: isManagement });
  const { data: officials } = useQuery({ queryKey: ['officials'], queryFn: () => api<{ items: Official[] }>('/api/officials'), enabled: isManagement });
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: () => api<{ items: JobPosting[] }>('/api/jobs'), enabled: isManagement });
  // Mutations
  const verifyResident = useMutation({
    mutationFn: ({id, status}: {id: string, status: string}) => api(`/api/residents/${id}/verify`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['residents'] }); toast.success('Status updated'); }
  });
  const generateSummons = useMutation({
    mutationFn: (id: string) => api(`/api/lupon/${id}/summons`, { method: 'PUT' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lupon'] }); toast.success('Summons Generated'); }
  });
  const deleteRecord = useMutation({
    mutationFn: ({ type, id }: { type: string, id: string }) => api(`/api/${type}/${id}`, { method: 'DELETE' }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type === 'blotter' ? 'blotter' : variables.type] });
      toast.success('Record deleted successfully');
    }
  });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Logged in as {userName} ({userRole})</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 h-auto flex-wrap">
          <TabsTrigger value="appointments">Queue</TabsTrigger>
          {isManagement && <TabsTrigger value="residents">Residents</TabsTrigger>}
          {isManagement && <TabsTrigger value="content">Content Manager</TabsTrigger>}
          {['superAdmin', 'secretary'].includes(userRole || '') && (
            <>
              <TabsTrigger value="blotter">e-Blotter</TabsTrigger>
              <TabsTrigger value="lupon">Lupon Cases</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="appointments">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Q#</TableHead><TableHead>Resident</TableHead><TableHead>Doc Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {apps?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">#{item.queueNumber}</TableCell>
                    <TableCell>{item.residentName}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell><Badge>{item.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setSelectedDoc(item)}>
                        <FileText className="h-3 w-3" /> Preview
                      </Button>
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
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Address</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {residents?.items.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">{res.name}</TableCell>
                    <TableCell>{res.address}</TableCell>
                    <TableCell><Badge variant={res.verificationStatus === 'verified' ? 'default' : 'secondary'}>{res.verificationStatus}</Badge></TableCell>
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
        <TabsContent value="content" className="space-y-12">
          {/* Announcements Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Announcements</h3>
              <AnnouncementForm trigger={<Button size="sm" className="bg-sky-600"><Plus className="h-4 w-4 mr-1" /> Add New</Button>} />
            </div>
            <Card className="border-none shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50"><TableRow><TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {announcements?.items.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs">{a.date}</TableCell>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        <AnnouncementForm initialData={a} trigger={<Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button>} />
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'announcements', id: a.id })}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
          {/* Directory Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Business Directory</h3>
              <BusinessForm trigger={<Button size="sm" className="bg-sky-600"><Plus className="h-4 w-4 mr-1" /> Add New</Button>} />
            </div>
            <Card className="border-none shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {directory?.items.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell>{b.category}</TableCell>
                      <TableCell className="text-xs">{b.phone}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <BusinessForm initialData={b} trigger={<Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button>} />
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'directory', id: b.id })}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
          {/* Officials Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Barangay Officials</h3>
              <OfficialForm trigger={<Button size="sm" className="bg-sky-600"><Plus className="h-4 w-4 mr-1" /> Add New</Button>} />
            </div>
            <Card className="border-none shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {officials?.items.map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.name}</TableCell>
                      <TableCell>{o.position}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <OfficialForm initialData={o} trigger={<Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button>} />
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'officials', id: o.id })}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
          {/* Jobs Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Job Bulletin</h3>
              <JobForm trigger={<Button size="sm" className="bg-sky-600"><Plus className="h-4 w-4 mr-1" /> Add New</Button>} />
            </div>
            <Card className="border-none shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50"><TableRow><TableHead>Title</TableHead><TableHead>Business</TableHead><TableHead>Deadline</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {jobs?.items.map(j => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>{j.businessName}</TableCell>
                      <TableCell className="text-xs">{j.deadline}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <JobForm initialData={j} trigger={<Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button>} />
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'jobs', id: j.id })}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="blotter">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Date</TableHead><TableHead>Parties Involved</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {blotters?.items.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.parties.join(' vs ')}</TableCell>
                    <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {isSuperAdmin && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'blotter', id: b.id })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
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
                    <TableCell className="text-right flex items-center justify-end gap-2">
                       {!l.summonsGenerated && <Button size="sm" variant="outline" onClick={() => generateSummons.mutate(l.id)}>Generate Summons</Button>}
                       {isSuperAdmin && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'lupon', id: l.id })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
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