
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export default function VipPage() {
  const [price, setPrice] = useState('97,00');

  useEffect(() => {
    const fetchPrice = async () => {
      const docSnap = await getDoc(doc(db, 'appConfig', 'registration'));
      if (docSnap.exists() && docSnap.data().vipPrice) {
        setPrice(docSnap.data().vipPrice);
      }
    };
    fetchPrice();
  }, []);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center py-20 px-4 font-code">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter">UPGRADE VIP BREAKER</h1>
        <p className="text-primary/60 max-w-2xl mx-auto">Libere acesso a algoritmos avançados e bypass de alta velocidade com a licença Premium.</p>
      </div>

      <Card className="w-full max-w-md bg-black/60 border-primary/40 shadow-[0_0_50px_-12px_rgba(0,255,70,0.3)]">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <div className="text-sm text-primary/60 uppercase">POR APENAS</div>
            <div className="text-6xl font-bold text-primary">R$ {price}</div>
            <div className="text-xs text-primary/40 mt-1">PAGAMENTO ÚNICO - ACESSO VITALÍCIO</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-primary/10">
            <div className="flex items-center gap-3 text-sm text-primary/80"><CheckCircle className="text-primary" size={18} /> INJETOR TURBO 10X</div>
            <div className="flex items-center gap-3 text-sm text-primary/80"><CheckCircle className="text-primary" size={18} /> BYPASS ANTI-BOT FIREWALL</div>
            <div className="flex items-center gap-3 text-sm text-primary/80"><CheckCircle className="text-primary" size={18} /> SUPORTE TÉCNICO PRIORITÁRIO</div>
            <div className="flex items-center gap-3 text-sm text-primary/80"><CheckCircle className="text-primary" size={18} /> ATUALIZAÇÕES SEMANAIS</div>
          </div>

          <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold shadow-lg shadow-primary/20">
            QUERO SER VIP AGORA <Zap className="ml-2 fill-current" />
          </Button>

          <div className="flex justify-center items-center gap-2 text-[10px] text-primary/40">
            <ShieldCheck size={12} /> AMBIENTE SEGURO E CRIPTOGRAFADO
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
