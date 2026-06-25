
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '@/firebase/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Cpu, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/bb');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login realizado com sucesso!", description: "Redirecionando..." });
      router.push('/bb');
    } catch (error: any) {
      let message = "Erro ao entrar. Verifique suas credenciais.";
      if (error.code === 'auth/invalid-credential') message = "E-mail ou senha incorretos.";
      if (error.code === 'auth/user-not-found') message = "Usuário não encontrado.";
      
      toast({ variant: "destructive", title: "Erro no Login", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black">
      <Card className="w-full max-w-[400px] bg-black/40 backdrop-blur-xl border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <Cpu className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-code tracking-tighter text-primary">BROKER BREAKER</CardTitle>
          <CardDescription className="text-primary/60 font-code text-xs uppercase tracking-widest">Acesso Restrito</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-code text-primary/70 uppercase">E-mail de Usuário</Label>
              <Input 
                type="email" 
                placeholder="exemplo@gmail.com" 
                className="bg-black/50 border-primary/30 focus:border-primary font-code"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-code text-primary/70 uppercase">Senha de Acesso</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-black/50 border-primary/30 focus:border-primary font-code pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-code font-bold tracking-widest shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ENTRAR NO SISTEMA"}
            </Button>
            <div className="text-center pt-2">
              <Link href="/register" className="text-xs text-primary/60 hover:text-primary font-code transition-colors">
                NÃO POSSUI UMA LICENÇA? <span className="underline">REGISTRAR AGORA</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
