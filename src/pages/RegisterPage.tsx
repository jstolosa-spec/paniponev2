import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wrench, CheckCircle2, Cloud, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
type Step = 'role' | 'details' | 'success';
type Role = 'resident' | 'skilledWorker';
export default function RegisterPage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        name: formData.name,
        email: formData.email,
        role: role === 'resident' ? 'resident' : 'skilledWorker',
        createdAt: new Date().toISOString()
      });
      if (role === 'resident') {
        await setDoc(doc(db, 'residents', uid), {
          id: uid,
          name: formData.name,
          address: formData.address,
          registrationDate: new Date().toISOString().split('T')[0],
          verificationStatus: 'pending',
          residencyStatus: true
        });
      } else {
        await setDoc(doc(db, 'skills', uid), {
          id: uid,
          name: formData.name,
          skill: formData.skill,
          contact: formData.phone,
          image: formData.image,
          isVerified: false
        });
      }
      setStep('success');
      toast.success('Registration completed on PanipOne!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12 lg:py-16 min-h-[80vh] flex flex-col items-center justify-center">
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
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Join PanipOne</h1>
                <p className="text-xl text-muted-foreground">Select your account type to access community services.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card
                  className="cursor-pointer hover:border-sky-500 transition-all hover:shadow-xl group border-2"
                  onClick={() => handleRoleSelect('resident')}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-sky-100 dark:bg-sky-900/30 p-6 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-transform">
                      <User className="h-12 w-12 text-sky-600" />
                    </div>
                    <CardTitle className="text-2xl">Resident</CardTitle>
                    <CardDescription>Official registration for document requests and community updates.</CardDescription>
                  </CardHeader>
                </Card>
                <Card
                  className="cursor-pointer hover:border-emerald-500 transition-all hover:shadow-xl group border-2"
                  onClick={() => handleRoleSelect('skilledWorker')}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-transform">
                      <Wrench className="h-12 w-12 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl">Skilled Worker</CardTitle>
                    <CardDescription>Join our local registry to offer your professional services.</CardDescription>
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
              className="w-full max-w-md"
            >
              <Card className="border-none shadow-2xl overflow-hidden">
                <div className={`h-2 ${role === 'resident' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <Cloud className="h-3.5 w-3.5" /> Secured by PanipOne Firebase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-secondary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-secondary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-secondary" />
                    </div>
                    {role === 'resident' ? (
                      <div className="space-y-1.5">
                        <Label htmlFor="address">Address / Purok</Label>
                        <Input id="address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-secondary" />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label htmlFor="skill">Professional Skill</Label>
                        <Select onValueChange={v => setFormData({...formData, skill: v})} defaultValue={formData.skill}>
                          <SelectTrigger id="skill" className="bg-secondary">
                            <SelectValue placeholder="Select Skill" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Plumber">Plumber</SelectItem>
                            <SelectItem value="Electrician">Electrician</SelectItem>
                            <SelectItem value="Carpenter">Carpenter</SelectItem>
                            <SelectItem value="Mason">Mason</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="pt-6 flex gap-4">
                      <Button variant="ghost" onClick={() => setStep('role')} type="button" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button className={`flex-1 ${role === 'resident' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'}`} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Complete Registration'}
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
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-10 rounded-full w-fit mx-auto shadow-inner">
                <CheckCircle2 className="h-20 w-20 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome to PanipOne!</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Account created for <span className="font-bold text-foreground">{formData.name}</span>. 
                  Our team will verify your details within 24 hours. You can now explore the community directory.
                </p>
              </div>
              <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                <Link to="/">Back to Homepage</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}