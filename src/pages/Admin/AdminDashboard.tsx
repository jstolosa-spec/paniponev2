import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LogOut, CheckCircle, Clock, Trash2, Download, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { Announcement, DirectoryItem, Official, Appointment, Resident, SkilledWorker } from '@shared/types';
export function AdminDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const { data: apps } = useQuery({ queryKey: ['appointments'], queryFn: () => api<{ items: Appointment[] }>('/api/appointments') });
  const { data: residents } = useQuery({ queryKey: ['residents'], queryFn: () => api<{ items: Resident[] }>('/api/residents') });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: () => api<{ items: SkilledWorker[] }>('/api/skills') });
  const updateAppStatus = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); toast.success('Status updated'); }
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
        <TabsList className="bg-sky-50 dark:bg-slate-900 p-1 rounded-xl">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          <TabsTrigger value="skills">Skills Registry</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Document Requests</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.residentName}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell>{item.scheduledDate}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      {item.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => updateAppStatus.mutate({ id: item.id, status: 'confirmed' })}>
                          Confirm
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="residents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Official Resident Registry</h3>
            <Button className="bg-sky-600"><UserPlus className="h-4 w-4 mr-2" /> Add Resident</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents?.items.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-bold">{res.name}</TableCell>
                    <TableCell>{res.address}</TableCell>
                    <TableCell>{res.registrationDate}</TableCell>
                    <TableCell>
                      {res.residencyStatus ? <Badge className="bg-emerald-500">6+ Mo</Badge> : <Badge variant="outline">New</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills?.items.map(worker => (
              <Card key={worker.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={worker.image} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.skill}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm">Verified Status</span>
                    <Switch checked={worker.isVerified} onCheckedChange={() => toggleVerify.mutate(worker.id)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}