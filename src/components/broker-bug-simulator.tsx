
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function BrokerBugSimulator() {
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHackerOverlay, setShowHackerOverlay] = useState(false);
  const [deniedMessages, setDeniedMessages] = useState<string[]>([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<'iq' | 'exnova' | null>(null);
  const [showWithdrawButton, setShowWithdrawButton] = useState(false);

  const rafRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current);
      }
    };
  }, []);

  function handleBrokerSelection(broker: 'iq' | 'exnova') {
    setSelectedBroker(broker);
    const url = broker === 'iq' ? 'https://iqoption.com' : 'https://exnova.com';
    window.open(url, '_blank');
    setStep(0.5);
  }

  function createAccount() {
    setAccountName(accountName || 'trader_sim');
    setStep(1);
    setIsVerifying(false);
    setVerificationStatus([]);
  }
  
  function handleVerification() {
    if (isVerifying) return;
    setIsVerifying(true);
    setVerificationStatus([]);

    const messages = [
      "analisando id",
      "verificando id",
      "preparando id",
      "id preparado",
    ];

    let messageIndex = 0;
    verificationIntervalRef.current = setInterval(() => {
      if (messageIndex < messages.length) {
        setVerificationStatus(prev => [...prev, messages[messageIndex]]);
        messageIndex++;
      } else {
        if (verificationIntervalRef.current) clearInterval(verificationIntervalRef.current);
        setTimeout(() => {
          createAccount();
        }, 500);
      }
    }, 600);
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
    setShowWithdrawButton(false);

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
        setShowWithdrawButton(true);
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
    setIsVerifying(false);
    setVerificationStatus([]);
    setSelectedBroker(null);
    setShowWithdrawButton(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }
    setIsAnimating(false);
  }

  function handleWithdraw() {
    if (!selectedBroker) return;
    const url = selectedBroker === 'iq' 
      ? 'https://iqoption.com/pt/withdrawal' 
      : 'https://trade.exnova.com/pt/withdrawal';
    window.open(url, '_blank');
  }

  function fmt(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  const getStepClass = (s: number, special: boolean = false) =>
    cn(
      "p-3 rounded-md transition-colors text-sm",
       step >= s && s !== 0.5 ? "bg-accent/20 text-accent-foreground border border-accent/50" : "bg-card-foreground/5",
       s === 3 && step >= 3 && "bg-yellow-800/30 text-yellow-200 border border-yellow-700",

    );

  const steps = [
    'Deposite 1k - clique em "Depositado"',
    '3. Abrir operação com todo saldo',
    'Clique em BUG para adicionar 10 mil',
  ];

  return (
    <>
      <Card className="w-full max-w-4xl bg-card/60 backdrop-blur-md border-border/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Broker Breaker</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 space-y-4">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Passos</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-muted-foreground">
                   <li className={cn(getStepClass(0), 'space-y-3')}>
                    <p>Criar Conta</p>
                    {step < 0.5 && (
                      <RadioGroup onValueChange={(value: 'iq' | 'exnova') => handleBrokerSelection(value)} className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <RadioGroupItem value="iq" id="iq" className="peer sr-only" />
                          <Label htmlFor="iq" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            IQ OPTION
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="exnova" id="exnova" className="peer sr-only" />
                          <Label htmlFor="exnova" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            EXNOVA
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                    {step >= 0.5 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pl-2 pt-2 border-l border-border/20">
                        <div className="space-y-2">
                          <Label htmlFor="accountName" className="text-muted-foreground text-xs">ID do usuario</Label>
                          <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Ex: 00000000" disabled={step !== 0.5 || isVerifying} />
                           {isVerifying && (
                            <div className="font-code text-xs text-green-400 h-12 overflow-auto pt-1">
                              <AnimatePresence>
                                {verificationStatus.map((msg, i) => (
                                  <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    &gt; {msg}
                                  </motion.p>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                        <div className="flex items-end">
                           <Button onClick={handleVerification} disabled={step !== 0.5 || isVerifying || accountName.length < 5} size="sm">enviar ID</Button>
                        </div>
                      </div>
                    )}
                  </li>
                  <li className={cn(getStepClass(1), 'space-y-3')}>
                    {steps[0]}
                    {step === 1 && (
                      <div className="pl-2 pt-2 border-l border-border/20">
                        <Button variant="accent" onClick={simulateDeposit} disabled={step !== 1} size="sm">Depositado</Button>
                      </div>
                    )}
                  </li>
                  <li className={cn(getStepClass(2), 'space-y-3')}>
                    {steps[1]}
                     {step === 2 && (
                      <div className="pl-2 pt-2 border-l border-border/20">
                        <Button className="bg-sky-600 hover:bg-sky-500 text-white" onClick={openTradeAll} disabled={step !== 2} size="sm">Operação Aberta</Button>
                      </div>
                    )}
                  </li>
                  <li className={getStepClass(3, true)}>
                    {steps[2]}
                  </li>
                </ol>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button variant="destructive" onClick={runBugSimulation} disabled={step !== 3}>BUG</Button>
                  {showWithdrawButton && (
                    <Button onClick={handleWithdraw} className="bg-green-600 hover:bg-green-500 text-white">Retirar</Button>
                  )}
                  <Button variant="secondary" onClick={resetSimulation}>Resetar</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Log de ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-code text-xs text-muted-foreground h-28 overflow-auto p-3 bg-black/40 rounded-md">
                  <p>&gt; Iniciado</p>
                  {step >= 0.5 && <p>&gt; Corretora selecionada: {selectedBroker?.toUpperCase() || '—'}</p>}
                  {step >= 1 && <p>&gt; Conta criada: {accountName || '—'}</p>}
                  {step >= 2 && <p>&gt; Deposito efetuado: R$1.000</p>}
                  {step >= 3 && <p>&gt; Operação aberta: saldo total</p>}
                  {showHackerOverlay && <p className="text-yellow-400">&gt; Executando Glitch...</p>}
                  {isAnimating && <p className="text-green-400">&gt; Animação em progresso...</p>}
                  {showHackerOverlay && !isAnimating && accessGranted && <p className="text-green-400">&gt; Glitch finalizado.</p>}
                  {showWithdrawButton && <p className="text-green-400 font-bold">&gt; Retirada disponível.</p>}
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
                <div className="mt-3 text-xs text-muted-foreground">Corretora: {selectedBroker?.toUpperCase() || '—'}</div>
                <div className="mt-1 text-xs text-muted-foreground">ID do usuário: {accountName || '—'}</div>
                <div className="mt-8 w-full">
                  <div className="text-xs text-muted-foreground mb-2">Representação gráfica</div>
                  <div className="w-full h-28 bg-gradient-to-r from-green-600/30 to-red-600/10 rounded-lg border border-white/10"/>
                </div>
              </CardContent>
            </Card>
          </aside>
        </CardContent>
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
                    <CardDescription className="text-xs text-green-300/70">Executando exploit de saldo</CardDescription>
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

    