import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Announcement, DirectoryItem, Official } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('announcements');
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => api<{ items: Announcement[] }>('/api/announcements') });
  const { data: directory } = useQuery({ queryKey: ['directory'], queryFn: () => api<{ items: DirectoryItem[] }>('/api/directory') });
  const { data: officials } = useQuery({ queryKey: ['officials'], queryFn: () => api<{ items: Official[] }>('/api/officials') });
  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => api(`/api/${type}/${id}`, { method: 'DELETE' }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type] });
      toast.success(`Item deleted successfully`);
    },
  });
  const addAnnouncement = useMutation({
    mutationFn: (data: Partial<Announcement>) => api('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement posted');
    },
  });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground">Manage your community's digital portal.</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 rounded-xl">
          <TabsTrigger value="announcements" className="rounded-lg px-6">Announcements</TabsTrigger>
          <TabsTrigger value="directory" className="rounded-lg px-6">Directory</TabsTrigger>
          <TabsTrigger value="officials" className="rounded-lg px-6">Officials</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Public Notices</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-sky-600 hover:bg-sky-700"><Plus className="mr-2 h-4 w-4" /> New Announcement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Post New Announcement</DialogTitle></DialogHeader>
                <form onSubmit={(e: any) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  addAnnouncement.mutate({
                    title: formData.get('title') as string,
                    content: formData.get('content') as string,
                    category: formData.get('category') as any,
                  });
                }} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select name="category" className="w-full p-2 border rounded-md">
                      <option value="News">News</option>
                      <option value="Alert">Alert</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <textarea name="content" className="w-full p-2 border rounded-md min-h-[100px]" required />
                  </div>
                  <Button type="submit" className="w-full">Publish Now</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate({ type: 'announcements', id: item.id })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="directory" className="space-y-6">
           <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Directory Listings</h3>
            <Button disabled className="bg-sky-600 opacity-50"><Plus className="mr-2 h-4 w-4" /> Add Listing</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directory?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="mr-2"><Edit className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate({ type: 'directory', id: item.id })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="officials" className="space-y-6">
           <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Barangay Officials</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officials?.items.map((official) => (
              <Card key={official.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img src={official.image} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <CardTitle className="text-lg">{official.name}</CardTitle>
                    <CardDescription>{official.position}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end gap-2">
                   <Button variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}