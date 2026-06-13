"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function Spinner() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/30 text-sm">Connexion en cours…</p>
      </div>
    </main>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next") ?? "/dashboard";
    const code = searchParams.get("code");

    async function handle() {
      if (code) {
        // PKCE flow : le code verifier est dans localStorage (client Supabase standard)
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next);
          return;
        }
      }

      // Implicit / hash flow ou session déjà établie
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      router.replace("/connexion?error=auth");
    }

    handle();
  }, [router, searchParams]);

  return <Spinner />;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
