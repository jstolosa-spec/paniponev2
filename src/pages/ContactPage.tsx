import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! Our barangay staff will review your inquiry shortly.');
    (e.target as HTMLFormElement).reset();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, feedback, or need to report a community issue? We're here to listen and serve the residents of Panipuan.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600 h-fit"><MapPin className="h-6 w-6" /></div>
              <div>
                <h3 className="font-bold text-lg">Visit Us</h3>
                <p className="text-muted-foreground">Barangay Hall, Panipuan Road,<br />San Fernando, Pampanga 2000</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 h-fit"><Phone className="h-6 w-6" /></div>
              <div>
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-muted-foreground">(045) 123-4567 • (045) 999-0001</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 h-fit"><Mail className="h-6 w-6" /></div>
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-muted-foreground">hello@panipuan.gov.ph</p>
              </div>
            </div>
          </div>
          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-sky-400" /> Office Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Monday - Friday</span><span className="font-bold">8:00 AM - 5:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-bold">8:00 AM - 12:00 PM</span></div>
                <div className="flex justify-between text-slate-400"><span>Sunday</span><span>Closed</span></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-2 bg-sky-500" />
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24-48 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Juan Dela Cruz" required /></div>
                  <div className="space-y-2"><Label>Contact Number</Label><Input placeholder="0912-345-6789" required /></div>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="What is this regarding?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feedback"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> General Feedback</div></SelectItem>
                      <SelectItem value="inquiry"><div className="flex items-center gap-2"><Info className="h-4 w-4" /> Inquiry</div></SelectItem>
                      <SelectItem value="report"><div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Incident Report</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Your Message</Label><Textarea rows={6} placeholder="Tell us more about your concern..." required /></div>
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 h-12 text-lg font-bold">
                  <Send className="h-5 w-5 mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}