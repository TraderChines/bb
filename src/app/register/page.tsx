
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/firebase/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Cpu, Loader2, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [licenseKey, setLicenseKey] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) router.push('/bb');
  }, [user, loading, router]);

  const validateLicense = async () => {
    setIsLoading(true);
    try {
      const configDoc = await getDoc(doc(db, 'appConfig', 'registration'));
      const validKey = configDoc.exists() ? configDoc.data().registrationSecret : '1234-5678-9012';
      
      if (licenseKey === validKey) {
        setStep(2);
      } else {
        toast({ variant: "destructive", title: "Licença Inválida", description: "O código inserido não foi reconhecido pelo sistema." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: "Não foi possível validar a licença agora." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast({ variant: "destructive", description: "As senhas não coincidem." });
    }
    if (password.length < 6) {
      return toast({ variant: "destructive", description: "A senha deve ter no mínimo 6 caracteres." });
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        uid,
        userOrigin: 'ANALYZER',
        subscriptionStatus: 'ACTIVE',
        createdAt: serverTimestamp(),
        termsAccepted: true,
        accountStatus: 'ACTIVE'
      });

      toast({ title: "Conta criada!", description: "Bem-vindo ao sistema." });
      router.push('/bb');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Registro", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl border-primary/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Cpu className="h-10 w-10 text-primary" /></div>
          <CardTitle className="font-code text-primary">ATIVAÇÃO DE LICENÇA</CardTitle>
          <CardDescription className="text-xs font-code">Passo {step} de 3</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-code text-primary/70">CÓDIGO DE ATIVAÇÃO VITALÍCIA</Label>
                <Input 
                  placeholder="XXXX-XXXX-XXXX" 
                  className="bg-black/50 border-primary/30 font-code" 
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />
              </div>
              <Button onClick={validateLicense} className="w-full bg-primary font-code font-bold tracking-widest" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "VALIDAR LICENÇA"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-primary font-code text-sm">
                  <ShieldCheck size={18} /> TERMOS DE SEGURANÇA
                </div>
                <p className="text-[10px] text-primary/70 font-code leading-relaxed">
                  AO ATIVAR ESTA LICENÇA, VOCÊ CONCORDA EM UTILIZAR O SISTEMA PARA FINS DE ESTUDO DE BUGS.
                  IMPORTANTE: USE O MESMO E-MAIL QUE VOCÊ UTILIZOU NA COMPRA (HOTMART/KIWIFY) PARA EVITAR BLOQUEIOS.
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(v === true)} />
                  <label htmlFor="terms" className="text-[10px] font-code text-primary cursor-pointer uppercase">Eu aceito os termos e avisos de segurança</label>
                </div>
              </div>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!termsAccepted} 
                className="w-full bg-primary font-code font-bold tracking-widest"
              >
                PROSSEGUIR <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2 text-center pb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <p className="text-[10px] text-amber-500 font-code uppercase">Use o e-mail da sua compra para validar o acesso</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-code text-primary/70">E-MAIL COMPRA</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/50 border-primary/30 font-code" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-code text-primary/70">SENHA DE ACESSO</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/50 border-primary/30 font-code" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-code text-primary/70">CONFIRMAR SENHA</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-black/50 border-primary/30 font-code" required />
              </div>
              <Button type="submit" className="w-full bg-primary font-code font-bold tracking-widest" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "CONCLUIR CADASTRO"}
              </Button>
            </form>
          )}
          <div className="text-center mt-4">
            <Link href="/" className="text-[10px] font-code text-primary/60 hover:text-primary uppercase tracking-tighter">Já possui uma conta? <span className="underline">Entrar</span></Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
