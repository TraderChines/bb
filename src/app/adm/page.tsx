
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useUser } from '@/firebase/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Users, Settings, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [config, setConfig] = useState({ registrationSecret: '', vipPrice: '' });
  const [usersCount, setUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) router.push('/');
    fetchData();
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      const configDoc = await getDoc(doc(db, 'appConfig', 'registration'));
      if (configDoc.exists()) setConfig(configDoc.data() as any);
      
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsersCount(usersSnap.size);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'appConfig', 'registration'), config);
      toast({ title: "Configurações salvas!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <main className="p-8 bg-black min-h-screen text-primary font-code">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><ShieldCheck /> CENTRAL DE COMANDO ADM</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-primary/20">
            <CardHeader><CardTitle className="text-primary flex items-center gap-2"><Settings size={20} /> CONFIGURAÇÕES GLOBAIS</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CHAVE MESTRA DE ATIVAÇÃO</Label>
                <Input value={config.registrationSecret} onChange={e => setConfig({...config, registrationSecret: e.target.value})} className="bg-black/50 border-primary/30" />
              </div>
              <div className="space-y-2">
                <Label>PREÇO PÁGINA VIP (R$)</Label>
                <Input value={config.vipPrice} onChange={e => setConfig({...config, vipPrice: e.target.value})} className="bg-black/50 border-primary/30" />
              </div>
              <Button onClick={handleSave} className="w-full bg-primary font-bold">SALVAR ALTERAÇÕES</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20 flex flex-col justify-center items-center p-8">
            <Users size={48} className="mb-4" />
            <div className="text-4xl font-bold">{usersCount}</div>
            <div className="text-xs uppercase tracking-widest mt-2">Usuários Registrados</div>
          </Card>
        </div>
      </div>
    </main>
  );
}
