import React from 'react';
import { Phone, ShieldAlert, Flame, Stethoscope, Zap, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const EMERGENCY_CONTACTS = [
  {
    category: 'Police & Security',
    icon: ShieldAlert,
    color: 'bg-blue-100 text-blue-600',
    contacts: [
      { name: 'San Fernando Police Station', phone: '(045) 961-1234', desc: 'Main Police Hotline' },
      { name: 'Barangay Tanod (Panipuan)', phone: '0912-345-6789', desc: 'Local Community Watch' },
    ]
  },
  {
    category: 'Fire & Rescue',
    icon: Flame,
    color: 'bg-rose-100 text-rose-600',
    contacts: [
      { name: 'San Fernando Fire Dept', phone: '(045) 961-2345', desc: 'Fire Emergency' },
      { name: 'Panipuan Rescue Team', phone: '0998-765-4321', desc: 'Disaster Response' },
    ]
  },
  {
    category: 'Medical Services',
    icon: Stethoscope,
    color: 'bg-emerald-100 text-emerald-600',
    contacts: [
      { name: 'Panipuan Health Center', phone: '(045) 123-4567', desc: 'Primary Health Care' },
      { name: 'JBL Memorial Hospital', phone: '(045) 961-2616', desc: 'Provincial Hospital' },
    ]
  },
  {
    category: 'Utilities',
    icon: Zap,
    color: 'bg-amber-100 text-amber-600',
    contacts: [
      { name: 'PELCO II (Electricity)', phone: '(045) 961-3456', desc: 'Power Interruptions' },
      { name: 'City Water District', phone: '(045) 961-4567', desc: 'Water Service' },
    ]
  }
];
export function EmergencyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-12 text-center space-y-4">
        <Badge variant="destructive" className="px-4 py-1 animate-pulse">PanipOne 24/7 Hotlines</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Emergency Portal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Immediate help is just a call away. PanipOne ensures critical lifelines are accessible for every resident of Barangay Panipuan.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-rose-600 text-white border-none shadow-xl transform hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><Phone className="h-8 w-8" /></div>
            <div>
              <CardTitle className="text-3xl font-black">911</CardTitle>
              <CardDescription className="text-rose-100 font-medium uppercase tracking-wider">National Hotline</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold h-12 text-lg" asChild>
              <a href="tel:911">Call Emergency Now</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 text-white border-none shadow-xl transform hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><MapPin className="h-8 w-8" /></div>
            <div>
              <CardTitle className="text-2xl font-bold">Barangay Hall</CardTitle>
              <CardDescription className="text-slate-400">Direct Response Team</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold h-12 text-lg" asChild>
              <a href="tel:0451234567">Call Brgy Hall</a>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {EMERGENCY_CONTACTS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", section.color)}><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-lg">{section.category}</h3>
              </div>
              <div className="space-y-4">
                {section.contacts.map((contact) => (
                  <Card key={contact.name} className="shadow-soft border-none bg-white dark:bg-slate-900">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-bold">{contact.name}</CardTitle>
                      <CardDescription className="text-xs">{contact.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button variant="secondary" size="sm" className="w-full gap-2 text-sky-600" asChild>
                        <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}>
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}