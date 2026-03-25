import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, MapPin, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
export default function RegisterResident() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    idUploadUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/residents/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStep(3);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Resident Profiling</h1>
          <p className="text-lg text-muted-foreground">Register your digital profile to access official barangay services.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-2xl">
            <div className="h-2 bg-sky-500" />
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                {[1, 2].map((i) => (
                  <div key={i} className={`h-1 flex-1 mx-1 rounded-full ${step >= i ? 'bg-sky-500' : 'bg-slate-200'}`} />
                ))}
              </div>
              <CardTitle>
                {step === 1 && "Personal Information"}
                {step === 2 && "Identity Verification"}
                {step === 3 && "Submission Complete"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Full Legal Name</Label>
                    <Input 
                      placeholder="Juan Dela Cruz" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Barangay Address (Purok / Street)</Label>
                    <Input 
                      placeholder="Purok 1, Panipuan Road" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <Button className="w-full bg-sky-600" onClick={() => setStep(2)}>Next Step</Button>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-50 border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Upload Government ID</p>
                      <p className="text-xs text-muted-foreground">Passport, Driver's License, or National ID</p>
                    </div>
                    <Input 
                      placeholder="Paste image URL for demo..." 
                      className="max-w-xs" 
                      value={formData.idUploadUrl}
                      onChange={(e) => setFormData({...formData, idUploadUrl: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button 
                      className="flex-1 bg-sky-600" 
                      disabled={loading || !formData.idUploadUrl}
                      onClick={handleSubmit}
                    >
                      {loading ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="py-12 text-center space-y-6">
                  <div className="mx-auto bg-emerald-100 text-emerald-600 p-4 rounded-full w-fit">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Registration Received</h3>
                    <p className="text-muted-foreground">Your profile is now pending verification by the Barangay Secretary. You will be notified once approved.</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/">Return to Home</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}