import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, Trash2, FileText, CheckCircle, Plus, Edit2, Settings, UserPlus, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentPreview } from '@/components/DocumentPreview';
import { AnnouncementForm, BusinessForm, OfficialForm, JobForm } from '@/components/admin/AdminDialogs';
import type { Appointment, Resident, BlotterReport, LuponCase, Announcement, DirectoryItem, Official, JobPosting } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const hasRole = useAuthStore(s => s.hasRole);
  const canManageContent = useAuthStore(s => s.canManageContent);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const userRole = user?.role;
  const userName = user?.name;
  // Permissions
  const isManagement = canManageContent();
  const isSuperAdmin = hasRole(['superAdmin']);
  const isHighLevel = hasRole(['superAdmin', 'secretary']);
  // Core Data Queries
  const { data: apps } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents'), enabled: isManagement });
  const { data: blotters } = useQuery({ queryKey: ['blotter'], queryFn: () => api<{ items: BlotterReport[] }>('/api/blotter'), enabled: isHighLevel });
  const { data: lupon } = useQuery({ queryKey: ['lupon'], queryFn: () => api<{ items: LuponCase[] }>('/api/lupon'), enabled: isHighLevel });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => api<{ items: Announcement[] }>('/api/announcements'), enabled: isManagement });
  const { data: directory } = useQuery({ queryKey: ['directory'], queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory'), enabled: isManagement });
  const { data: officials } = useQuery({ queryKey: ['officials'], queryFn: () => api<{ items: Official[] }>('/api/officials'), enabled: isManagement });
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: () => api<{ items: JobPosting[] }>('/api/jobs'), enabled: isManagement });
  // Mutations
  const deleteRecord = useMutation({
    mutationFn: ({ type, id }: { type: string, id: string }) => api(`/api/${type}/${id}`, { 
      method: 'DELETE',
      headers: { 'X-User-Role': userRole || '' } 
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type] });
      toast.success('Record deleted successfully');
    },
    onError: () => toast.error('Unauthorized: Action restricted to SuperAdmin')
  });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Logged in as {userName} 
            <Badge variant="secondary" className="capitalize">{userRole?.replace(/([A-Z])/g, ' $1').trim()}</Badge>
          </p>
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
          {isHighLevel && (
            <>
              <TabsTrigger value="blotter">e-Blotter</TabsTrigger>
              <TabsTrigger value="lupon">Lupon Cases</TabsTrigger>
            </>
          )}
          {isSuperAdmin && <TabsTrigger value="settings">System Settings</TabsTrigger>}
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
                      {isSuperAdmin && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'residents', id: res.id })}><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="space-y-12">
          {/* Announcements */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Announcements</h3>
              <AnnouncementForm trigger={<Button size="sm" className="bg-sky-600"><Plus className="h-4 w-4 mr-1" /> Add New</Button>} />
            </div>
            <Card className="border-none shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50"><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {announcements?.items.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                      <TableCell className="text-right">
                         {isSuperAdmin && (
                           <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'announcements', id: a.id })}><Trash2 className="h-4 w-4" /></Button>
                         )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
        {isHighLevel && (
          <>
            <TabsContent value="blotter">
               <Card className="border-none shadow-soft overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50"><TableRow><TableHead>Date</TableHead><TableHead>Parties</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {blotters?.items.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>{b.date}</TableCell>
                        <TableCell>{b.parties.join(' vs ')}</TableCell>
                        <TableCell className="text-right">
                          {isSuperAdmin && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'blotter', id: b.id })}><Trash2 className="h-4 w-4" /></Button>}
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
                  <TableHeader className="bg-slate-50"><TableRow><TableHead>Case#</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {lupon?.items.map(l => (
                      <TableRow key={l.id}>
                        <TableCell>{l.id.slice(0,8)}</TableCell>
                        <TableCell>{l.caseType}</TableCell>
                        <TableCell className="text-right">
                          {isSuperAdmin && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRecord.mutate({ type: 'lupon', id: l.id })}><Trash2 className="h-4 w-4" /></Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}
        {isSuperAdmin && (
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-sky-500" /> Staff Management</CardTitle>
                  <CardDescription>Generate invitation codes for new Barangay staff and officials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex gap-4">
                     <Select defaultValue="staff">
                       <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="secretary">Secretary</SelectItem>
                         <SelectItem value="staff">Staff</SelectItem>
                       </SelectContent>
                     </Select>
                     <Button className="bg-sky-600">Generate Code</Button>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl text-xs font-mono text-slate-500 italic">No active codes.</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-soft border-l-4 border-l-rose-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-rose-500" /> Security Logs</CardTitle>
                  <CardDescription>System access and critical record modifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">Full audit trails are available in the archives.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
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