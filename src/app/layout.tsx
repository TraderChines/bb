
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { AnimatedBackground } from '@/components/animated-background';
import { FirebaseProvider } from '@/firebase/provider';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: 'Broker Breaker',
  description: 'Sistema Profissional de Simulação de Trading',
  icons: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={cn("font-body antialiased", fontBody.variable, fontCode.variable)}>
        <FirebaseProvider>
          <AnimatedBackground />
          {children}
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
