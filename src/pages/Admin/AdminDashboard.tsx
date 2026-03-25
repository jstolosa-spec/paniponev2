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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LogOut, Trash2, Plus, Edit, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { AnnouncementForm, BusinessForm, OfficialForm, JobForm } from '@/components/admin/AdminDialogs';
import type { Announcement, DirectoryItem, Official, Appointment, Resident, SkilledWorker, JobPosting } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const { data: apps } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents') });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: () => api<{ items: SkilledWorker[] }>('/api/skills') });
  const { data: news } = useQuery({ queryKey: ['announcements'], queryFn: () => api<{ items: Announcement[] }>('/api/announcements') });
  const { data: businesses } = useQuery({ queryKey: ['directory'], queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory') });
  const { data: officials } = useQuery({ queryKey: ['officials'], queryFn: () => api<{ items: Official[] }>('/api/officials') });
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: () => api<{ items: JobPosting[] }>('/api/jobs') });
  const deleteItem = useMutation({
    mutationFn: ({ type, id }: { type: string, id: string }) => api(`/api/${type}/${id}`, { method: 'DELETE' }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type === 'directory' ? 'directory' : variables.type] });
      toast.success('Deleted successfully');
    }
  });
  const toggleVerify = useMutation({
    mutationFn: (id: string) => api(`/api/skills/${id}/verify`, { method: 'PUT' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); }
  });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground">Managing community services & registry.</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="news">Announcements</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="officials">Officials</TabsTrigger>
          <TabsTrigger value="jobs">Job Bulletin</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          <TabsTrigger value="skills">Skills Registry</TabsTrigger>
          <TabsTrigger value="feedback"><MessageSquare className="h-4 w-4 mr-2" /> Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Community News</h3>
            <AnnouncementForm trigger={<Button className="bg-sky-600"><Plus className="h-4 w-4 mr-2" /> New Post</Button>} />
          </div>
          <Card>
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {news?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <AnnouncementForm initialData={item} trigger={<Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete Announcement?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteItem.mutate({ type: 'announcements', id: item.id })} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        {/* Similar patterns for Businesses, Officials, and Jobs */}
        <TabsContent value="businesses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Local Directory</h3>
            <BusinessForm trigger={<Button className="bg-sky-600"><Plus className="h-4 w-4 mr-2" /> Add Business</Button>} />
          </div>
          <Card>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {businesses?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <BusinessForm initialData={item} trigger={<Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'directory', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-6">
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No Feedback Yet</h3>
            <p className="text-slate-500">Resident inquiries will appear here as they are submitted.</p>
          </div>
        </TabsContent>
        {/* Existing Content for Appointments, Residents, Skills */}
        <TabsContent value="appointments" className="space-y-6">
           <Card>
            <Table>
              <TableHeader><TableRow><TableHead>Resident</TableHead><TableHead>Document</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {apps?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.residentName}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell><Badge>{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}