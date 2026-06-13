"use client";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { TrendingUp, Shield, BarChart3, Zap, ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import DisplayCards from "@/components/ui/display-cards";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { TextEffect } from "@/components/ui/text-effect";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const STATS = [
  { value: "2,4 Mrd€+", label: "Valeur analysée" },
  { value: "180 000+", label: "Références indexées" },
  { value: "42 000+", label: "Membres actifs" },
  { value: "4,9 / 5", label: "Satisfaction" },
];

const PERKS = ["Sans carte bancaire", "Résultats immédiats", "Résiliation libre"];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Ball grows then fades — tighter window to eliminate dead zone
  const ballScale   = useTransform(scrollYProgress, [0, 0.6],  [1, 13]);
  const ballOpacity = useTransform(scrollYProgress, [0.48, 0.62], [1, 0]);

  // Text fades quickly
  const textOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.12], [0, -28]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <main className="bg-black text-white overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/70 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/25">
            <span className="text-black font-black text-sm leading-none">P</span>
          </div>
          <span className="font-bold text-base tracking-tight">PokeInvest</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-white/45">
          {["Marché", "Portfolio", "Analyses", "Cotation"].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors duration-200">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/connexion" className="text-white/45 text-sm hover:text-white/80 transition-colors hidden sm:block">
            Se connecter
          </Link>
          <Link href="/inscription">
            <LiquidButton size="sm" className="text-yellow-300 font-semibold">
              Commencer
            </LiquidButton>
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      {/* Réduit à 220vh : la transition est plus serrée, pas de zone noire */}
      <section ref={heroRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">

          {/* Text block — flux naturel, pas absolute */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="pt-[6.5rem] text-center z-10 px-4 w-full max-w-3xl mx-auto flex-shrink-0"
          >
            {/* Badge live */}
            <div className="inline-flex items-center gap-2 bg-yellow-400/[0.08] border border-yellow-400/20 text-yellow-400/80 text-[11px] font-medium px-3.5 py-1.5 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
              Données en temps réel&nbsp;&nbsp;—&nbsp;&nbsp;42 000+ collectionneurs
            </div>

            {/* H1 — tailles fixes pour éviter le retour à la ligne involontaire */}
            <h1 className="font-black leading-[0.94] mb-5">
              <TextEffect
                per="word"
                preset="blur"
                className="text-4xl sm:text-5xl md:text-6xl text-white block"
              >
                Investissez plus malin
              </TextEffect>
              <TextEffect
                per="word"
                preset="blur"
                delay={0.22}
                className="text-4xl sm:text-5xl md:text-6xl text-yellow-400 block"
              >
                Attrapez-les tous
              </TextEffect>
            </h1>

            {/* Subtitle — condensé à 2 lignes */}
            <p className="text-white/40 text-[0.95rem] max-w-sm mx-auto mb-7 leading-[1.7]">
              Prix PSA &amp; BGS, alertes bonnes affaires,
              estimation de grade par IA — votre passion devient patrimoine.
            </p>

            {/* CTA */}
            <div className="flex justify-center">
              <Link href="/inscription">
                <LiquidButton size="xl" className="text-yellow-300 font-bold text-sm px-10 rounded-full">
                  Créer mon compte gratuit <ChevronRight className="w-4 h-4" />
                </LiquidButton>
              </Link>
            </div>
            <p className="text-white/20 text-[11px] mt-3 tracking-wide">
              Sans carte bancaire · Résultats immédiats
            </p>
          </motion.div>

          {/* Pokéball */}
          <motion.div
            style={{ scale: ballScale, opacity: ballOpacity }}
            className="mt-4 relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden flex-shrink-0"
          >
            <video
              src="/videos/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2.5 text-white/20 text-[10px] tracking-[0.18em] uppercase pointer-events-none"
          >
            <span>Défiler</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-px h-5 bg-white/15 rounded-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────── */}
      <section className="border-y border-white/[0.07] bg-zinc-950/60">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
              className="text-center py-10"
            >
              <div className="text-2xl md:text-3xl font-black text-yellow-400 tabular-nums tracking-tight">
                {s.value}
              </div>
              <div className="text-white/30 text-xs mt-2 tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section className="py-24 px-6 overflow-hidden relative">
        {/* Gradient transition depuis Stats */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-px bg-gradient-to-r from-transparent via-yellow-400/12 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-20 max-w-xl mx-auto"
        >
          <p className="text-yellow-400/40 text-[10px] uppercase tracking-[0.24em] font-medium mb-4">
            Fonctionnalités
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-[1.05]">
            L&apos;arsenal du<br />
            <span className="text-yellow-400">collectionneur avisé</span>
          </h2>
          <p className="text-white/32 text-sm leading-relaxed">
            Des outils que les professionnels gardaient pour eux.
            <br />Maintenant accessibles à tous.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-20 max-w-5xl mx-auto overflow-hidden md:overflow-visible">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="text-white/20 text-[10px] uppercase tracking-[0.28em] mb-5 pl-1">
              Marché &amp; Prix
            </p>
            <DisplayCards
              cards={[
                {
                  icon: <TrendingUp className="size-4 text-yellow-300" />,
                  title: "Suivi des prix",
                  description: "PSA, BGS & cartes brutes en temps réel",
                  date: "Mis à jour en direct",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Zap className="size-4 text-yellow-300" />,
                  title: "Alertes bonnes affaires",
                  description: "Cartes sous-évaluées détectées",
                  date: "Notification instantanée",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <BarChart3 className="size-4 text-yellow-300" />,
                  title: "Analyses de portfolio",
                  description: "ROI, gains/pertes, historique",
                  date: "Tableau de bord complet",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                },
              ]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="md:mt-16"
          >
            <p className="text-white/20 text-[10px] uppercase tracking-[0.28em] mb-5 pl-1">
              Intelligence &amp; Cotation
            </p>
            <DisplayCards
              cards={[
                {
                  icon: <Shield className="size-4 text-yellow-300" />,
                  title: "Intelligence de cotation",
                  description: "Grade estimé par IA avant envoi",
                  date: "Précision 98,3 %",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <TrendingUp className="size-4 text-yellow-300" />,
                  title: "Historique des ventes",
                  description: "Toutes les transactions récentes",
                  date: "Données vérifiées",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Zap className="size-4 text-yellow-300" />,
                  title: "Scan & Identifier",
                  description: "Identifiez n'importe quelle carte",
                  date: "Via photo ou scan",
                  titleClassName: "text-yellow-400",
                  className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-14 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
        >
          <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(20, 10, 40)"
            gradientBackgroundEnd="rgb(10, 5, 20)"
            firstColor="180, 130, 20"
            secondColor="200, 160, 0"
            thirdColor="120, 80, 0"
            fourthColor="160, 100, 10"
            fifthColor="220, 180, 30"
            pointerColor="200, 150, 0"
            containerClassName="rounded-3xl min-h-[460px]"
            className="flex flex-col items-center justify-center min-h-[460px] text-center px-8 py-24"
          >
            <p className="text-yellow-400/45 text-[10px] uppercase tracking-[0.24em] font-medium mb-5">
              Commencez dès aujourd&apos;hui
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-black text-white leading-[1.1] mb-2">
              Votre collection vaut peut-être
            </h2>
            <h2 className="text-3xl md:text-[2.75rem] font-black text-yellow-400 leading-[1.1] mb-6">
              bien plus que vous ne le pensez.
            </h2>
            <p className="text-white/40 text-sm mb-10 max-w-[320px] leading-relaxed">
              Rejoignez 42 000 collectionneurs qui font fructifier
              leur passion chaque jour.
            </p>
            <Link href="/inscription">
              <LiquidButton size="xxl" className="text-yellow-300 font-bold text-base">
                Créer mon compte gratuit <ArrowRight className="w-4 h-4" />
              </LiquidButton>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-white/25 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400/40 flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
          </BackgroundGradientAnimation>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-black font-black text-xs leading-none">P</span>
                </div>
                <span className="font-bold text-sm tracking-tight">PokeInvest</span>
              </div>
              <p className="text-white/35 text-xs leading-relaxed">
                La référence pour les collectionneurs et investisseurs en cartes Pokémon.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
              {[
                {
                  title: "Produit",
                  links: ["Marché", "Portfolio", "Analyses", "Alertes"],
                },
                {
                  title: "Cotation",
                  links: ["PSA", "BGS", "CGC", "Estimation IA"],
                },
                {
                  title: "Légal",
                  links: ["Confidentialité", "CGU", "Contact"],
                },
              ].map(({ title, links }) => (
                <div key={title}>
                  <p className="text-white/35 font-semibold mb-3.5 uppercase tracking-widest text-[9px]">
                    {title}
                  </p>
                  <ul className="space-y-2.5">
                    {links.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-white/35 hover:text-white/70 transition-colors duration-200"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/30 text-xs">© 2026 PokeInvest. Tous droits réservés.</p>
            <p className="text-white/20 text-xs">Collectionnez avec intelligence. Investissez avec passion.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
