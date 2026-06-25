
'use client';

import { BrokerBugSimulator } from "@/components/broker-bug-simulator";
import { useUser } from "@/firebase/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export default function BBPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-primary/60 hover:text-primary hover:bg-primary/10 font-code"
        >
          <LogOut className="mr-2 h-4 w-4" /> SAIR
        </Button>
      </div>
      <BrokerBugSimulator />
    </main>
  );
}
