
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, CheckCircle, Cpu, Eye, EyeOff, ShieldAlert, XCircle } from 'lucide-react';

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
  const [showId, setShowId] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDepositedButton, setShowDepositedButton] = useState(false);
  const [depositClicked, setDepositClicked] = useState(false);

  const rafRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Semicolon') { // "ç" key
        setIsSystemOnline(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        if (verificationIntervalRef.current) clearInterval(verificationIntervalRef.current);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  const handlePressStart = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsSystemOnline(prev => !prev);
    }, 2000);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  };

  function handleBrokerSelection(broker: 'iq' | 'exnova') {
    setSelectedBroker(broker);
    const url = broker === 'iq' ? 'https://iqoption.com/traderoom' : 'https://trade.exnova.com/traderoom';
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.blur();
        window.focus();
    }
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
    setValidationError(null);

    if (!isSystemOnline) {
      setValidationError("ID NÃO AUTORIZADO. O SISTEMA RECUSOU A CONEXÃO.");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus([]);

    const messages = [
      "AUTENTICANDO TOKEN...",
      "VERIFICANDO CREDENCIAIS...",
      "ID VALIDADO...",
      "CONEXÃO ESTABELECIDA.",
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

  function handleDepositClick() {
    if (!selectedBroker || depositClicked) return;
    const url = selectedBroker === 'iq' 
      ? 'https://iqoption.com/traderoom' 
      : 'https://trade.exnova.com/traderoom';
    
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.blur();
        window.focus();
    }
    
    setShowDepositedButton(true);
    setDepositClicked(true);
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
      "> INICIANDO BYPASS DE FIREWALL...",
      "> ACESSO AO KERNEL: NEGADO.",
      "> REINICIANDO PROTOCOLOS...",
      "> FORÇANDO OVERRIDE DE SEGURANÇA.",
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
    }, 500);
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
    setShowDepositedButton(false);
    setValidationError(null);
    setDepositClicked(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    setIsAnimating(false);
  }

  function handleWithdraw() {
    if (!selectedBroker) return;
    const url = selectedBroker === 'iq' 
      ? 'https://iqoption.com/traderoom' 
      : 'https://trade.exnova.com/traderoom';
    const newTab = window.open(url, '_blank');
     if (newTab) {
        newTab.blur();
        window.focus();
    }
  }

  function fmt(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  const getStepClass = (s: number) =>
    cn(
      "p-4 rounded-lg transition-all text-sm border flex items-start gap-4",
       step >= s && s !== 0.5 
         ? "bg-primary/10 border-primary/30 text-primary-foreground" 
         : "bg-white/5 border-white/10 text-muted-foreground",
    );

  const steps = [
    { text: 'Conecte-se à sua conta da corretora.', step: 0 },
    { text: 'Faça um depósito de R$1.000,00 para começar.', step: 1 },
    { text: 'Inicie uma operação com seu saldo.', step: 2 },
    { text: 'Execute o BUG para multiplicar o saldo.', step: 3 },
  ];

  const StepIcon = ({ s }: {s: number}) => {
    const isComplete = step > s;
    const isActive = step === s;
    if (isComplete) return <CheckCircle className="text-primary" />;
    if (isActive) return <ArrowRight className="text-primary animate-pulse" />;
    return <AlertCircle className="text-muted-foreground" />;
  }

  return (
    <>
      <Card className="w-full max-w-4xl bg-black/50 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="border-b border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cpu size={28} className="text-primary" />
              <div>
                <CardTitle className="font-code text-2xl tracking-widest text-primary">BROKER BREAKER</CardTitle>
                <CardDescription className="font-code text-xs text-primary/70">INJETOR DE SALDO</CardDescription>
              </div>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
            >
              <div className="relative flex h-3 w-3">
                {isSystemOnline && <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></div>}
                <div className="relative inline-flex rounded-full h-3 w-3 bg-primary"></div>
              </div>
              <span className="font-code text-xs text-primary/90">SISTEMA ONLINE</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
          <section className="md:col-span-3 space-y-6">
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader className='p-0 pb-4'>
                <CardTitle className="text-lg font-code text-primary/90">PAINEL DE CONTROLE</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <ol className="space-y-3 text-muted-foreground">
                   <li className={cn(getStepClass(0), 'flex-col')}>
                    <div className='flex items-start gap-4 w-full'>
                      <StepIcon s={0} />
                      <p className='flex-1'>{steps[0].text}</p>
                    </div>
                    {step < 0.5 && (
                      <RadioGroup onValueChange={(value: 'iq' | 'exnova') => handleBrokerSelection(value)} className="grid grid-cols-2 gap-4 pt-4 w-full">
                        <div>
                          <RadioGroupItem value="iq" id="iq" className="peer sr-only" />
                          <Label htmlFor="iq" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-code tracking-widest">
                            IQ OPTION
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="exnova" id="exnova" className="peer sr-only" />
                          <Label htmlFor="exnova" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-code tracking-widest">
                            EXNOVA
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                    {step >= 0.5 && (
                      <div className="flex flex-col gap-4 pl-10 pt-4 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                          <div className="space-y-2">
                            <Label htmlFor="accountName" className="text-muted-foreground text-xs font-code">SEU ID DE USUÁRIO</Label>
                            <div className="relative">
                              <Input 
                                id="accountName" 
                                type={showId ? 'text' : 'password'}
                                value={accountName} 
                                onChange={(e) => setAccountName(e.target.value.replace(/[^0-9]/g, ''))} 
                                placeholder="00000000" 
                                disabled={step !== 0.5 || isVerifying} 
                                className="font-code pr-10"
                              />
                              <Button 
                                type="button"
                                size="icon" 
                                variant="ghost" 
                                className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:text-primary-foreground"
                                onClick={() => setShowId(!showId)}
                                disabled={step !== 0.5 || isVerifying}
                              >
                                {showId ? <EyeOff size={18} /> : <Eye size={18} />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-end">
                             <Button onClick={handleVerification} disabled={step !== 0.5 || isVerifying || accountName.length < 5} size="sm" variant="outline" className='border-primary/50 hover:bg-primary/10 font-code'>VERIFICAR</Button>
                          </div>
                        </div>
                         {isVerifying && (
                          <div className="font-code text-xs text-primary h-16 overflow-auto pt-1">
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
                        {validationError && (
                           <motion.div initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}}>
                              <Alert variant="destructive" className="bg-red-950/60 border-red-500/30 text-red-400 font-code text-xs">
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                                <AlertDescription>
                                  {validationError}
                                </AlertDescription>
                              </Alert>
                           </motion.div>
                        )}
                      </div>
                    )}
                  </li>
                  <li className={cn(getStepClass(1), 'flex-col')}>
                    <div className='flex items-start gap-4 w-full'>
                      <StepIcon s={1} />
                      <p className='flex-1'>{steps[1].text}</p>
                    </div>
                    {step === 1 && (
                      <div className="pl-10 pt-4 w-full flex items-center gap-2">
                        <Button variant="outline" onClick={handleDepositClick} disabled={step !== 1 || depositClicked} size="sm" className='border-primary/50 hover:bg-primary/10 font-code'>DEPOSITAR</Button>
                        {showDepositedButton && (
                          <Button variant="outline" onClick={simulateDeposit} size="sm" className='border-primary/50 hover:bg-primary/10 font-code'>DEPOSITADO</Button>
                        )}
                      </div>
                    )}
                  </li>
                  <li className={cn(getStepClass(2), 'flex-col')}>
                    <div className='flex items-start gap-4 w-full'>
                      <StepIcon s={2} />
                      <p className='flex-1'>{steps[2].text}</p>
                    </div>
                     {step === 2 && (
                      <div className="pl-10 pt-4 w-full">
                        <Button className="bg-sky-500 hover:bg-sky-600 text-sky-100 border border-sky-500/60 font-code" onClick={openTradeAll} disabled={step !== 2} size="sm">OPERAÇÃO ABERTA</Button>
                      </div>
                    )}
                  </li>
                  <li className={cn(getStepClass(3), 'flex-col')}>
                     <div className='flex items-start gap-4 w-full'>
                        <StepIcon s={3} />
                        <p className='flex-1'>{steps[3].text}</p>
                     </div>
                     {step === 3 && (
                        <div className="pl-10 pt-4 w-full">
                           <Button variant="destructive" onClick={runBugSimulation} disabled={step !== 3} className="bg-red-600 hover:bg-red-700 text-white border border-red-500/50 font-code tracking-widest text-base shadow-lg shadow-red-500/30 hover:shadow-red-500/40">
                              <ShieldAlert className="mr-2" />
                              EXECUTAR BUG
                           </Button>
                        </div>
                     )}
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          <aside className="md:col-span-2">
            <Card className="bg-black/40 border-primary/20 flex flex-col items-center h-full">
              <CardHeader className="items-center text-center">
                <CardTitle className="font-code text-sm tracking-widest text-primary/80">SALDO EM CONTA</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-bold font-code text-shadow shadow-primary">{fmt(balance)}</div>
                <div className="mt-4 text-xs text-muted-foreground font-code">CORRETORA: {selectedBroker === 'iq' ? 'IQ OPTION' : selectedBroker?.toUpperCase() || 'N/A'}</div>
                <div className="mt-1 text-xs text-muted-foreground font-code">ID DO USUÁRIO: {accountName ? (showId ? accountName : '********') : 'N/A'}</div>
                <div className="mt-8 w-full px-4">
                  <div className='text-xs text-muted-foreground mb-2'>Progresso</div>
                  <Progress value={((balance - 1000) / 9000) * 100} className="h-2 [&>div]:bg-primary" />
                   {showWithdrawButton && (
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="flex flex-col gap-2 mt-6">
                      <Button onClick={handleWithdraw} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-code tracking-widest text-base shadow-lg shadow-primary/30 hover:shadow-primary/40">
                        RETIRAR SALDO
                      </Button>
                      <Button variant="secondary" onClick={resetSimulation} className="font-code w-full">REINICIAR</Button>
                    </motion.div>
                  )}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-black/90 border border-primary/50 shadow-2xl shadow-primary/20">
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <CardTitle className="font-code text-xl text-primary tracking-widest">BREAKER_V2.EXE</CardTitle>
                    <CardDescription className="text-xs text-primary/70 font-code">INJETANDO VETOR DE EXPLORAÇÃO...</CardDescription>
                  </div>
                   <Button size="icon" variant="ghost" className="text-muted-foreground hover:bg-white/10 h-8 w-8" onClick={() => setShowHackerOverlay(false)}><XCircle/></Button>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/60 rounded-md border border-primary/20">
                    <div className="h-56 overflow-hidden font-code text-sm leading-relaxed">
                        <AnimatePresence>
                        {deniedMessages.map((msg, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.1 }}
                            className="text-red-400 flex items-center gap-2"
                          >
                           <ShieldAlert size={16}/> {msg}
                          </motion.p>
                        ))}
                      </AnimatePresence>
                      {accessGranted && (
                        <>
                         <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                            className="text-primary font-bold flex items-center gap-2"
                          >
                           <CheckCircle size={16}/> &gt; VIOLAÇÃO CONFIRMADA — ACESSO TOTAL.
                          </motion.p>
                          {!isAnimating && showWithdrawButton && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.2 }}
                              className="text-primary font-bold flex items-center gap-2"
                            >
                            <CheckCircle size={16}/> &gt; SALDO INJETADO COM SUCESSO.
                            </motion.p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-black/60 rounded-md border border-primary/20 flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-200 font-code">INJETANDO SALDO</div>
                    <div className="text-4xl font-bold mt-2 text-primary font-code text-shadow shadow-primary">{fmt(balance)}</div>
                    <div className="mt-3 w-full space-y-2">
                       <Progress value={((balance - 1000) / 9000) * 100} className="h-2 [&>div]:bg-primary" />
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

    

    