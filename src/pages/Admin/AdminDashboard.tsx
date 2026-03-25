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
import { LogOut, Trash2, Plus, Edit, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Console</h1>
          <p className="text-muted-foreground">Managing PanipuanConnect community services.</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2 border-slate-200 hover:bg-slate-50 transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger value="appointments" className="rounded-lg">Appointments</TabsTrigger>
          <TabsTrigger value="news" className="rounded-lg">Announcements</TabsTrigger>
          <TabsTrigger value="businesses" className="rounded-lg">Businesses</TabsTrigger>
          <TabsTrigger value="officials" className="rounded-lg">Officials</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-lg">Job Bulletin</TabsTrigger>
          <TabsTrigger value="residents" className="rounded-lg">Residents</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-lg">Skills Registry</TabsTrigger>
          <TabsTrigger value="feedback" className="rounded-lg"><MessageSquare className="h-4 w-4 mr-2" /> Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-6">
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50"><TableRow><TableHead>Resident</TableHead><TableHead>Document</TableHead><TableHead>Scheduled</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {apps?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.residentName}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell>{item.scheduledDate}</TableCell>
                    <TableCell><Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Community News</h3>
            <AnnouncementForm trigger={<Button className="bg-sky-600 hover:bg-sky-700"><Plus className="h-4 w-4 mr-2" /> New Post</Button>} />
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {news?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">{item.category}</Badge></TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <AnnouncementForm initialData={item} trigger={<Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'announcements', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="businesses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Local Directory</h3>
            <BusinessForm trigger={<Button className="bg-sky-600 hover:bg-sky-700"><Plus className="h-4 w-4 mr-2" /> Add Business</Button>} />
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
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
        <TabsContent value="officials" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Barangay Roster</h3>
            <OfficialForm trigger={<Button className="bg-sky-600"><Plus className="h-4 w-4 mr-2" /> Add Official</Button>} />
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead>Term</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {officials?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell className="text-sky-600 font-medium">{item.position}</TableCell>
                    <TableCell>{item.term}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <OfficialForm initialData={item} trigger={<Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'officials', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Job Postings</h3>
            <JobForm trigger={<Button className="bg-sky-600"><Plus className="h-4 w-4 mr-2" /> New Job</Button>} />
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Business</TableHead><TableHead>Title</TableHead><TableHead>Deadline</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {jobs?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.businessName}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.deadline}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <JobForm initialData={item} trigger={<Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'jobs', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="residents" className="space-y-6">
          <h3 className="text-2xl font-bold">Resident Registry</h3>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Address</TableHead><TableHead>Reg. Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {residents?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.registrationDate}</TableCell>
                    <TableCell><Badge variant={item.residencyStatus ? 'default' : 'secondary'}>{item.residencyStatus ? 'Verified' : 'Probation'}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'residents', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="skills" className="space-y-6">
          <h3 className="text-2xl font-bold">Skills Registry</h3>
          <Card className="border-none shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50"><TableRow><TableHead>Name</TableHead><TableHead>Skill</TableHead><TableHead>Contact</TableHead><TableHead>Verified</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {skills?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.skill}</Badge></TableCell>
                    <TableCell>{item.contact}</TableCell>
                    <TableCell>
                      <Switch checked={item.isVerified} onCheckedChange={() => toggleVerify.mutate(item.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate({ type: 'skills', id: item.id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-6">
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No Feedback Yet</h3>
            <p className="text-slate-500">Resident inquiries will appear here as they are submitted.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}