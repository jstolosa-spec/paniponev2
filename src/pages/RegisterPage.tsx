import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wrench, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
type Step = 'role' | 'details' | 'success';
type Role = 'resident' | 'skilledWorker';
export default function RegisterPage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    skill: 'Plumber',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  });
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep('details');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (role === 'resident') {
        await api('/api/residents/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
          }),
        });
      } else {
        await api('/api/skills/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            skill: formData.skill,
            contact: formData.phone,
            image: formData.image,
          }),
        });
      }
      setStep('success');
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 min-h-[80vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl"
            >
              <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Join PanipuanConnect</h1>
                <p className="text-xl text-muted-foreground">Select your primary role to begin the registration process.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card 
                  className="cursor-pointer hover:border-sky-500 transition-all hover:shadow-xl group"
                  onClick={() => handleRoleSelect('resident')}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-sky-100 p-6 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-transform">
                      <User className="h-12 w-12 text-sky-600" />
                    </div>
                    <CardTitle className="text-2xl">Resident</CardTitle>
                    <CardDescription>Register as a local resident to access barangay services and documents.</CardDescription>
                  </CardHeader>
                </Card>
                <Card 
                  className="cursor-pointer hover:border-emerald-500 transition-all hover:shadow-xl group"
                  onClick={() => handleRoleSelect('skilledWorker')}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-emerald-100 p-6 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-transform">
                      <Wrench className="h-12 w-12 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl">Skilled Worker</CardTitle>
                    <CardDescription>Join our community registry to offer your services to fellow residents.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>
          )}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md"
            >
              <Card className="border-none shadow-2xl">
                <div className={`h-2 ${role === 'resident' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                <CardHeader>
                  <CardTitle>Register as {role === 'resident' ? 'Resident' : 'Skilled Worker'}</CardTitle>
                  <CardDescription>Please provide your official information for verification.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        required 
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    {role === 'resident' ? (
                      <div className="space-y-2">
                        <Label htmlFor="address">Address / Purok</Label>
                        <Input 
                          id="address" 
                          required 
                          placeholder="e.g. Purok 3, Main St."
                          value={formData.address}
                          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="skill">Skill Category</Label>
                          <Select 
                            onValueChange={v => setFormData(prev => ({ ...prev, skill: v }))}
                            defaultValue={formData.skill}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Plumber">Plumber</SelectItem>
                              <SelectItem value="Electrician">Electrician</SelectItem>
                              <SelectItem value="Carpenter">Carpenter</SelectItem>
                              <SelectItem value="Mason">Mason</SelectItem>
                              <SelectItem value="Cleaner">House Cleaner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Number</Label>
                          <Input 
                            id="phone" 
                            required 
                            placeholder="09xx-xxx-xxxx"
                            value={formData.phone}
                            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </>
                    )}
                    <div className="pt-4 flex gap-4">
                      <Button variant="ghost" onClick={() => setStep('role')} type="button">Back</Button>
                      <Button 
                        className={`flex-1 ${role === 'resident' ? 'bg-sky-600' : 'bg-emerald-600'}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Submitting...' : 'Complete Registration'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 max-w-md"
            >
              <div className="bg-emerald-100 p-8 rounded-full w-fit mx-auto">
                <CheckCircle2 className="h-20 w-20 text-emerald-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Application Received!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your registration is currently <span className="font-bold text-amber-600">Pending Verification</span>. 
                  Our barangay staff will review your details. You will receive an update shortly.
                </p>
              </div>
              <Button size="lg" className="w-full bg-slate-900" asChild>
                <a href="/">Return to Homepage</a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}