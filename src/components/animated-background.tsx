'use client';

import React, { useRef, useEffect, useState } from 'react';

// --- PROMPT PARA REUTILIZAÇÃO ---
// Este componente é um fundo animado no estilo "Matrix" criado com React e HTML Canvas.
// Para usá-lo em outro projeto, siga os passos:
// 1. Copie este arquivo (animated-background.tsx) para a pasta de componentes do seu projeto.
// 2. Certifique-se de que seu projeto React está configurado para usar TypeScript.
// 3. Importe e adicione o componente <AnimatedBackground /> ao seu layout principal ou página.
//    Exemplo:
//    function App() {
//      return (
//        <div>
//          <AnimatedBackground />
//          <main>
//            {/* O resto do seu conteúdo aqui */}
//          </main>
//        </div>
//      );
//    }
// 4. Personalize as cores, caracteres e velocidade alterando as configurações abaixo.

// --- Configuração das Paletas de Cores ---
// Altere estes valores para customizar a aparência da animação.
const palette = {
  // Cor principal dos caracteres que caem
  main: 'rgba(0, 255, 70, 0.9)', 
  // Cor dos caracteres de destaque (mais claros)
  light: 'rgba(170, 255, 170, 0.9)', 
  // Cores que aparecem aleatoriamente para um efeito de "glitch"
  glitch: [
    'rgba(255, 80, 80, 1)',   // Vermelho
    'rgba(255, 255, 0, 1)',   // Amarelo
    'rgba(0, 191, 255, 1)',   // Azul (Ciano profundo)
    'rgba(0, 255, 255, 1)',   // Ciano
    'rgba(170, 0, 255, 1)',   // Roxo
  ],
};


export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- Configuração de Velocidade ---
  // Controla a velocidade da animação.
  // Um valor menor (ex: 1) torna a animação mais rápida.
  // Um valor maior (ex: 10) torna a animação mais lenta.
  const [frameInterval, setFrameInterval] = useState(4); 

  useEffect(() => {
    // Permite ajustar a velocidade dinamicamente com as teclas + e -
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '=' || event.key === '+') {
        setFrameInterval(prev => Math.max(1, prev - 1)); // Aumenta a velocidade
      } else if (event.key === '-') {
        setFrameInterval(prev => Math.min(10, prev + 1)); // Diminui a velocidade
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Configuração dos Caracteres ---
    // Altere ou adicione strings para mudar os caracteres que aparecem na animação.
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const characters = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    const rainDrops: { y: number; glitchTime: number; glitchColor: string | null }[] = [];
    for (let i = 0; i < columns; i++) {
      rainDrops[i] = { y: 1, glitchTime: 0, glitchColor: null };
    }

    // Função de desenho principal que é chamada a cada quadro da animação
    const draw = () => {
       // Fundo semi-transparente para criar o efeito de "rastro" dos caracteres
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Altere a fonte se desejar
      ctx.font = `${fontSize}px "Roboto Mono", monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];
        
        // Aplica o efeito de "glitch" se o tempo de glitch for maior que zero
        if (drop.glitchTime > 0) {
          ctx.fillStyle = drop.glitchColor!;
          drop.glitchTime--;
        } else {
          // Define a cor do caractere (principal ou de destaque)
          if (Math.random() > 0.99) { // 1% de chance de ser um caractere de destaque
             ctx.fillStyle = palette.light;
          } else {
             ctx.fillStyle = palette.main;
          }
        }
        
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drop.y * fontSize);

        // Se o caractere sair da tela, reseta sua posição com uma chance aleatória
        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
          drop.y = 0;
        }
        drop.y++;
        
        // Chance aleatória de ativar o "glitch" para um caractere
        if (Math.random() > 0.9995 && drop.glitchTime === 0) {
            drop.glitchTime = 15; // Duração do glitch em quadros
            drop.glitchColor = palette.glitch[Math.floor(Math.random() * palette.glitch.length)];
        }
      }
    };

    // Loop da animação
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;
      // Controla a velocidade da animação com base no frameInterval
      if (frameCount % frameInterval === 0) {
        draw();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frameInterval]);

  // O componente renderiza apenas o elemento <canvas> que ocupa a tela inteira.
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full bg-black"></canvas>;
}
