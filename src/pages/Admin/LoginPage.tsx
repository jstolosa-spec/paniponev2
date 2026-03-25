import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api<{ user: { id: string; name: string } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(response.user);
      toast.success('Welcome back, Administrator');
      navigate('/admin');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 overflow-hidden">
          <div className="h-2 bg-sky-500" />
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-sky-100 dark:bg-sky-900/30 p-3 rounded-2xl w-fit">
              <Landmark className="h-10 w-10 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Admin Access</CardTitle>
              <CardDescription>Official Information System Management</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 h-12 text-lg font-bold"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
                Sign In
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Protected Portal • Barangay Panipuan
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}