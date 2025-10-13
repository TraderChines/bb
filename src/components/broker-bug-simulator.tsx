"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

export function BrokerBugSimulator() {
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHackerOverlay, setShowHackerOverlay] = useState(false);
  const [deniedMessages, setDeniedMessages] = useState<string[]>([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  function next() {
    setStep((s) => Math.min(4, s + 1));
  }

  function createAccount() {
    setAccountName(accountName || 'conta_mock');
    setStep(1);
  }

  function simulateDeposit() {
    setBalance(1000);
    setStep(2);
  }

  function openTradeAll() {
    setStep(3);
  }

  function runBugSimulation() {
    if (isAnimating) return;
    
    setDeniedMessages([]);
    setAccessGranted(false);
    setShowHackerOverlay(true);
    setStep(4);

    const messages = [
      "ACESSO NEGADO (0x1A)",
      "ACESSO NEGADO (0x2F)",
      "ACESSO NEGADO (0x5B)",
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setDeniedMessages(prev => [...prev, messages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(interval);
        
        animationTimeoutRef.current = setTimeout(() => {
          setAccessGranted(true);
          startBalanceAnimation();
        }, 300);
      }
    }, 400);
  }
  
  function startBalanceAnimation() {
    setIsAnimating(true);
    const start = 1000;
    const end = 10000;
    const duration = 2200;
    const startTs = performance.now();

    function stepFrame(now: number) {
      const t = Math.min(1, (now - startTs) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      const value = Math.floor(start + (end - start) * eased);
      setBalance(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(stepFrame);
      } else {
        setIsAnimating(false);
      }
    }

    rafRef.current = requestAnimationFrame(stepFrame);
  }

  function resetSimulation() {
    setBalance(0);
    setStep(0);
    setAccountName('');
    setShowHackerOverlay(false);
    setDeniedMessages([]);
    setAccessGranted(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsAnimating(false);
  }

  function fmt(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  const getStepClass = (s: number, special: boolean = false) =>
    cn(
      "p-3 rounded-md transition-colors text-sm",
      step === s
        ? special
          ? "bg-yellow-800/30 text-yellow-200 border border-yellow-700"
          : "bg-accent/20 text-accent-foreground border border-accent/50"
        : "bg-card-foreground/5"
    );

  const steps = [
    '1. Criar conta (mock) — clique em "enviar ID"',
    '2. Fazer depósito — clique em "Depositar (PIX sim)"',
    '3. Abrir operação com todo saldo — clique em "Abrir operação"',
    '4. Clicar em BUG para ver a animação',
  ];

  return (
    <>
      <Card className="w-full max-w-4xl bg-card/60 backdrop-blur-md border-border/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Simulador — Bug das Corretoras</CardTitle>
          <CardDescription>Demo visual — NÃO USE COM CONTAS REAIS</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 space-y-4">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Passos</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-muted-foreground">
                  {steps.map((text, index) => (
                    <li key={index} className={getStepClass(index, index === 3)}>
                      {text}
                    </li>
                  ))}
                </ol>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName" className="text-muted-foreground">ID do usuario</Label>
                    <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Ex: trader_sim" />
                  </div>
                  <div className="flex items-end justify-end">
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={createAccount} disabled={step > 0}>enviar ID</Button>
                      <Button variant="accent" onClick={simulateDeposit} disabled={step !== 1}>Depositar (PIX sim)</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button className="bg-sky-600 hover:bg-sky-500 text-white" onClick={openTradeAll} disabled={step !== 2}>Abrir operação</Button>
                  <Button variant="destructive" onClick={runBugSimulation} disabled={step !== 3}>BUG</Button>
                  <Button variant="secondary" onClick={resetSimulation}>Resetar simulação</Button>
                </div>
                <p className="mt-4 text-xs text-yellow-300">Aviso: esta tela é uma simulação visual. NÃO execute operações reais com base neste app.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Log de ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-code text-xs text-muted-foreground h-28 overflow-auto p-3 bg-black/40 rounded-md">
                  <p>&gt; Iniciado simulador</p>
                  {step >= 1 && <p>&gt; Conta criada: {accountName || '—'}</p>}
                  {step >= 2 && <p>&gt; Deposito simulado: R$1.000</p>}
                  {step >= 3 && <p>&gt; Operação aberta: saldo total</p>}
                  {isAnimating && <p className="text-green-400">&gt; Animação em progresso...</p>}
                  {showHackerOverlay && !isAnimating && accessGranted && <p className="text-green-400">&gt; Glitch finalizado.</p>}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="md:col-span-1">
            <Card className="bg-card/80 flex flex-col items-center h-full">
              <CardHeader className="items-center">
                <CardTitle className="text-muted-foreground text-sm">SALDO ATUAL</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-bold font-headline">{fmt(balance)}</div>
                <div className="mt-3 text-xs text-muted-foreground">Conta: {accountName || '—'}</div>
                <div className="mt-8 w-full">
                  <div className="text-xs text-muted-foreground mb-2">Representação gráfica</div>
                  <div className="w-full h-28 bg-gradient-to-r from-green-600/30 to-red-600/10 rounded-lg border border-white/10"/>
                </div>
                <div className="mt-auto pt-6 text-xs text-center text-yellow-300">
                  Este é um mock — não representa uma vulnerabilidade real.
                </div>
              </CardContent>
            </Card>
          </aside>
        </CardContent>

        <CardFooter>
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> Conteúdo fictício criado para fins de demonstração visual e educacional. Não incentive nem execute fraudes, exploração de falhas em plataformas reais ou qualquer atividade ilegal.
          </p>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {showHackerOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-black/80 border border-green-700 shadow-2xl shadow-green-900/50">
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <CardTitle className="font-code text-xl text-green-400">GLITCH.EXE</CardTitle>
                    <CardDescription className="text-xs text-green-300/70">Simulador: executando rotina de corrupção de saldo</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:bg-white/10" onClick={() => setShowHackerOverlay(false)}>Fechar</Button>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-black/40 rounded-md border border-green-900/50">
                    <div className="h-32 overflow-hidden font-code text-xs leading-tight">
                        <AnimatePresence>
                        {deniedMessages.map((msg, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-red-500"
                          >
                           &gt; {msg}
                          </motion.p>
                        ))}
                      </AnimatePresence>
                      {accessGranted && (
                         <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="text-green-400 font-bold"
                          >
                           &gt; ACESSO CONCEDIDO
                          </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 rounded-md border border-green-900/50 flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-200">Transformando</div>
                    <div className="text-4xl font-bold mt-2 text-green-300 font-headline">{fmt(balance)}</div>
                    <div className="mt-3 w-full space-y-2">
                       <Progress value={((balance - 1000) / 9000) * 100} className="h-2 [&>div]:bg-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
