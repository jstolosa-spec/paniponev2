import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Loader2, Lock, Info, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success(`Welcome to PanipuanConnect`);
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  const autoFillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    toast.info('Credentials filled. Click Sign In.');
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
              <CardTitle className="text-3xl font-bold text-card-foreground">Sign In</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1.5">
                <Cloud className="h-3.5 w-3.5" /> Firebase Secure Authentication
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@panipuan.gov.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Keep me signed in
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
                    Connecting...
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
                      <Info className="h-3 w-3" /> Demo Accounts
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border border-border p-4 space-y-4 max-w-xs" side="bottom">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Migration Environment</p>
                    <div className="space-y-2">
                      <button onClick={() => autoFillDemo('admin@panipuan.gov.ph', 'admin123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-primary">Admin:</span> admin@panipuan.gov.ph / admin123
                      </button>
                      <button onClick={() => autoFillDemo('resident@panipuan.gov.ph', 'res123')} className="w-full text-left p-2 hover:bg-accent rounded transition-colors text-sm">
                        <span className="font-bold text-muted-foreground">Resident:</span> resident@panipuan.gov.ph / res123
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