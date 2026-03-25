import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const announcementSchema = z.object({
  title: z.string().min(2),
  date: z.string(),
  content: z.string().min(5),
  category: z.enum(['News', 'Alert', 'Event']),
});
export function AnnouncementForm({ initialData, trigger }: { initialData?: any, trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: initialData || { title: '', date: new Date().toISOString().split('T')[0], content: '', category: 'News' },
  });
  const mutation = useMutation({
    mutationFn: (data: any) => initialData
      ? api(`/api/announcements/${initialData.id}`, { method: 'PUT', body: JSON.stringify(data) })
      : api('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement saved');
      setOpen(false);
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{initialData ? 'Edit' : 'Create'} Announcement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="News">News</SelectItem><SelectItem value="Alert">Alert</SelectItem><SelectItem value="Event">Event</SelectItem></SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full bg-sky-600" disabled={mutation.isPending}>Save Announcement</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
const businessSchema = z.object({
  name: z.string().min(2),
  category: z.enum(['Food', 'Health', 'Services', 'Retail']),
  address: z.string(),
  phone: z.string(),
  image: z.string().url(),
  description: z.string().optional(),
});
export function BusinessForm({ initialData, trigger }: { initialData?: any, trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData || { name: '', category: 'Retail', address: '', phone: '', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800' },
  });
  const mutation = useMutation({
    mutationFn: (data: any) => initialData
      ? api(`/api/directory/${initialData.id}`, { method: 'PUT', body: JSON.stringify(data) })
      : api('/api/directory', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directory'] });
      toast.success('Business listing saved');
      setOpen(false);
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Business Listing</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="Food">Food</SelectItem><SelectItem value="Health">Health</SelectItem><SelectItem value="Services">Services</SelectItem><SelectItem value="Retail">Retail</SelectItem></SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
             <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <Button type="submit" className="w-full bg-sky-600">Save Business</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
const officialSchema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  image: z.string().url(),
  term: z.string().optional(),
});
export function OfficialForm({ initialData, trigger }: { initialData?: any, trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof officialSchema>>({
    resolver: zodResolver(officialSchema),
    defaultValues: initialData || { name: '', position: '', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', term: '2023-2025' },
  });
  const mutation = useMutation({
    mutationFn: (data: any) => initialData
      ? api(`/api/officials/${initialData.id}`, { method: 'PUT', body: JSON.stringify(data) })
      : api('/api/officials', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast.success('Official roster updated');
      setOpen(false);
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initialData ? 'Edit' : 'Add'} Official</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="position" render={({ field }) => (
              <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="term" render={({ field }) => (
              <FormItem><FormLabel>Term of Office</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <Button type="submit" className="w-full bg-sky-600">Save Official</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
const jobSchema = z.object({
  businessName: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(10),
  deadline: z.string(),
  skillsRequired: z.string().transform(val => val.split(',').map(s => s.trim())),
});
export function JobForm({ initialData, trigger }: { initialData?: any, trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData ? { ...initialData, skillsRequired: initialData.skillsRequired.join(', ') } : { businessName: '', title: '', description: '', deadline: '', skillsRequired: '' },
  });
  const mutation = useMutation({
    mutationFn: (data: any) => initialData
      ? api(`/api/jobs/${initialData.id}`, { method: 'PUT', body: JSON.stringify(data) })
      : api('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posting saved');
      setOpen(false);
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Job Posting</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4">
            <FormField control={form.control} name="businessName" render={({ field }) => (
              <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="deadline" render={({ field }) => (
              <FormItem><FormLabel>Deadline</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="skillsRequired" render={({ field }) => (
              <FormItem><FormLabel>Skills Required (comma-separated)</FormLabel><FormControl><Input placeholder="Driver, Cleaner, etc" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl></FormItem>
            )} />
            <Button type="submit" className="w-full bg-sky-600">Save Job Posting</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}