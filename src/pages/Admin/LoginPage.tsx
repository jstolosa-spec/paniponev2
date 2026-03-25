import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Loader2, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { UserRole } from '@shared/types';
interface LoginUserResponse {
  user: {
    id: string;
    name: string;
    role: UserRole;
    residentId?: string;
  }
}
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Strict primitive selector
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api<LoginUserResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(response.user);
      toast.success(`Welcome back, ${response.user.name}`);
      navigate('/admin');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const autoFillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    toast.info('Credentials filled. Redirecting...', { duration: 1000 });
    setTimeout(() => {
       api<LoginUserResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username: u, password: p }),
        }).then(res => {
          login(res.user);
          navigate('/admin');
        });
    }, 800);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-card overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-3 rounded-2xl w-fit">
              <Landmark className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-card-foreground">Panipuan Auth</CardTitle>
              <CardDescription>Barangay Governance System Access</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin, secretary, staff, or resident"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary text-secondary-foreground border-input"
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
                  className="bg-secondary text-secondary-foreground border-input"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(!!v)} />
                <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer text-foreground">
                  Remember me on this device
                </label>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            <div className="mt-8 pt-6 border-t">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center gap-2 text-xs text-primary font-bold cursor-help uppercase tracking-widest bg-accent py-2 rounded-lg hover:bg-accent/80 transition-colors">
                      <Info className="h-3 w-3" /> Click for Demo Credentials
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border border-border p-4 space-y-4 max-w-xs" side="bottom">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Click a role to auto-fill</p>
                    <div className="space-y-2">
                      <button onClick={() => autoFillDemo('admin', 'admin123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-primary">Admin:</span> admin / admin123
                      </button>
                      <button onClick={() => autoFillDemo('secretary', 'sec123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-emerald-500">Secretary:</span> secretary / sec123
                      </button>
                      <button onClick={() => autoFillDemo('staff', 'staff123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-amber-500">Staff:</span> staff / staff123
                      </button>
                      <button onClick={() => autoFillDemo('resident', 'res123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-muted-foreground">Resident:</span> resident / res123
                      </button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}