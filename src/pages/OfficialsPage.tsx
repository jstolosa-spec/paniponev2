import React from 'react';
import { User, Phone, Mail, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_OFFICIALS } from '@shared/mock-data';
export function OfficialsPage() {
  const captain = MOCK_OFFICIALS.find(o => o.position === 'Punong Barangay');
  const kagawads = MOCK_OFFICIALS.filter(o => o.position !== 'Punong Barangay');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Barangay Governance</h1>
        <p className="text-lg text-muted-foreground">
          Dedicated leaders committed to the progress and welfare of Barangay Panipuan. 
          Contact our officials for assistance and community concerns.
        </p>
      </div>
      {/* Barangay Captain Highlight */}
      {captain && (
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <Badge className="bg-sky-500 text-white px-6 py-1 rounded-full text-sm uppercase tracking-widest font-bold">
              Leadership
            </Badge>
          </div>
          <Card className="max-w-4xl mx-auto overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto h-full">
                <img src={captain.image} alt={captain.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{captain.name}</h2>
                  <p className="text-sky-600 font-semibold text-lg uppercase tracking-wide">{captain.position}</p>
                </div>
                <p className="text-muted-foreground italic">
                  "Leading Panipuan towards a sustainable and inclusive future for every resident."
                </p>
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600"><Phone className="h-4 w-4" /></div>
                    <span className="text-sm font-medium">(045) 999-0001</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600"><Mail className="h-4 w-4" /></div>
                    <span className="text-sm font-medium">captain@panipuan.gov.ph</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Council Members */}
      <div className="space-y-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">The Sangguniang Barangay</h3>
          <p className="text-muted-foreground mt-2">Honorable Members of the Barangay Council</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kagawads.map((item) => (
            <Card key={item.id} className="text-center overflow-hidden border-none shadow-soft hover:shadow-lg transition-all group">
              <div className="pt-8 pb-4 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-50 dark:border-sky-900/30">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute -bottom-2 right-0 bg-sky-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <Badge variant="outline" className="w-fit mx-auto border-sky-200 text-sky-600 uppercase text-[10px] tracking-wider">
                  {item.position}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 text-muted-foreground border-t pt-4 mt-2">
                  <button className="hover:text-sky-500 transition-colors"><Phone className="h-4 w-4" /></button>
                  <button className="hover:text-sky-500 transition-colors"><Mail className="h-4 w-4" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}