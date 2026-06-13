"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
        <Link href="/" className="flex items-center gap-2.5" aria-label="PokeInvest — Accueil">
          <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-black font-black text-xs leading-none" aria-hidden="true">P</span>
          </div>
          <span className="font-bold text-sm tracking-tight">PokeInvest</span>
        </Link>
        <Link
          href="/connexion"
          className="flex items-center gap-1.5 text-white/35 text-xs hover:text-white/70 transition-colors"
          aria-label="Retour à la connexion"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Retour
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-black mb-2">Vérifiez vos e-mails</h1>
              <p className="text-white/45 text-sm leading-relaxed mb-8">
                Un lien de réinitialisation a été envoyé à{" "}
                <span className="text-white/75 font-medium">{email}</span>
              </p>
              <p className="text-white/25 text-xs">
                Vous ne le trouvez pas ?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-yellow-400/70 hover:text-yellow-400 transition-colors underline underline-offset-2 cursor-pointer"
                >
                  Renvoyer le lien
                </button>
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-8 text-center"
              >
                <h1 className="text-2xl font-black mb-2">Mot de passe oublié ?</h1>
                <p className="text-white/45 text-sm leading-relaxed">
                  Entrez votre adresse e-mail — nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                  <label htmlFor="email" className="block text-xs text-white/50 mb-1.5 font-medium">
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-zinc-800 transition-all"
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    role="alert"
                    aria-live="assertive"
                    className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-xl text-sm hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                        Envoi en cours…
                      </>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center">
                <p className="text-white/30 text-xs">
                  Vous vous souvenez ?{" "}
                  <Link href="/connexion" className="text-yellow-400/80 hover:text-yellow-400 transition-colors font-medium">
                    Se connecter
                  </Link>
                </p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
