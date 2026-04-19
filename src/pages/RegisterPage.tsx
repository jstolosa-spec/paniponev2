import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wrench, CheckCircle2, Cloud } from 'lucide-react';
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
      // 1. Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      // 2. Create User Profile in Firestore
      await setDoc(doc(db, 'users', uid), {
        name: formData.name,
        email: formData.email,
        role: role === 'resident' ? 'resident' : 'staff', // Simplified roles for migration
        createdAt: new Date().toISOString()
      });
      // 3. Create Role-Specific Data
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
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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
                <p className="text-xl text-muted-foreground">Access secure services via Firebase.</p>
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
                    <CardDescription>Request documents and track residency.</CardDescription>
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
                    <CardDescription>Register in our professional database.</CardDescription>
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
              <Card className="border-none shadow-2xl">
                <div className={`h-2 ${role === 'resident' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                <CardHeader>
                  <CardTitle>Create Secure Account</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Cloud className="h-3 w-3" /> Managed by Google Cloud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <Label>Email</Label>
                        <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <Label>Password</Label>
                        <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <Label>Full Name</Label>
                        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      {role === 'resident' ? (
                        <div className="space-y-1">
                          <Label>Address</Label>
                          <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Label>Skill</Label>
                          <Select onValueChange={v => setFormData({...formData, skill: v})} defaultValue={formData.skill}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Plumber">Plumber</SelectItem>
                              <SelectItem value="Electrician">Electrician</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Button variant="ghost" onClick={() => setStep('role')} type="button">Back</Button>
                      <Button className={`flex-1 ${role === 'resident' ? 'bg-sky-600' : 'bg-emerald-600'}`} disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
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
              <h2 className="text-3xl font-bold">Account Ready!</h2>
              <p className="text-muted-foreground">Verification pending by Barangay staff. You can now explore the portal.</p>
              <Button size="lg" className="w-full bg-slate-900" asChild>
                <a href="/">Go to Home</a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}