"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Check, Mail } from "lucide-react";
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

export default function Inscription() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Faible", "Moyen", "Bon", "Fort"][passwordStrength];
  const strengthColor = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard/");
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (emailSent) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <nav className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <Link href="/" className="flex items-center gap-2.5" aria-label="PokeInvest — Accueil">
            <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-black text-xs leading-none" aria-hidden="true">P</span>
            </div>
            <span className="font-bold text-sm tracking-tight">PokeInvest</span>
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-center max-w-sm"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-yellow-400" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black mb-3">Vérifiez vos e-mails</h1>
            <p className="text-white/45 text-sm leading-relaxed mb-2">
              Un lien de confirmation a été envoyé à
            </p>
            <p className="text-white/80 text-sm font-medium mb-8">{form.email}</p>
            <p className="text-white/25 text-xs leading-relaxed">
              Cliquez sur le lien dans l&apos;e-mail pour activer votre compte.
              <br />Pensez à vérifier vos spams.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

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
          href="/"
          className="flex items-center gap-1.5 text-white/35 text-xs hover:text-white/70 transition-colors"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Retour
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
              <span className="text-yellow-400 text-xs font-medium">Gratuit pour toujours</span>
            </div>
            <h1 className="text-2xl font-black mb-2">Créez votre compte</h1>
            <p className="text-white/45 text-sm">
              Rejoignez 42 000 investisseurs qui font confiance à PokeInvest.
            </p>
          </motion.div>

          {/* Google OAuth */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading || googleLoading}
              aria-label="Continuer avec Google"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mb-5 cursor-pointer"
            >
              {googleLoading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continuer avec Google
            </button>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.07]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-3 text-white/25 text-xs">ou avec votre e-mail</span>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <label htmlFor="name" className="block text-xs text-white/50 mb-1.5 font-medium">
                Prénom et nom
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jean Dupont"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-zinc-800 transition-all"
              />
            </motion.div>

            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-xs text-white/50 mb-1.5 font-medium">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vous@exemple.com"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-zinc-800 transition-all"
              />
            </motion.div>

            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-xs text-white/50 mb-1.5 font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                  aria-describedby="password-strength"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-zinc-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
              {form.password && (
                <div id="password-strength" className="mt-2" aria-live="polite">
                  <div className="flex gap-1 mb-1" role="progressbar" aria-valuenow={passwordStrength} aria-valuemin={0} aria-valuemax={4} aria-label="Force du mot de passe">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColor : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-white/35">{strengthLabel}</p>
                </div>
              )}
            </motion.div>

            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <div className="bg-zinc-900/60 border border-white/[0.06] rounded-xl px-4 py-3 space-y-2" aria-label="Avantages inclus">
                {["Prix PSA & BGS en temps réel", "Alertes bonnes affaires par e-mail", "Estimation de grade par IA"].map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-yellow-400/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <span className="text-xs text-white/55">{b}</span>
                  </div>
                ))}
              </div>
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

            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-xl text-sm hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                    Création du compte…
                  </>
                ) : "Créer mon compte gratuit"}
              </button>

              <p className="text-center text-white/20 text-xs mt-4">
                En créant un compte, vous acceptez nos{" "}
                <a href="#" className="text-white/40 hover:text-white/60 transition-colors underline underline-offset-2">
                  conditions d&apos;utilisation
                </a>.
              </p>
            </motion.div>
          </form>

          <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center">
            <p className="text-white/30 text-xs">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-yellow-400/80 hover:text-yellow-400 transition-colors font-medium">
                Se connecter
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
