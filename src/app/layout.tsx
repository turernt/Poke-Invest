import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokeInvest — La plateforme d'investissement en cartes Pokémon",
  description: "Prix PSA & BGS en temps réel, alertes bonnes affaires et estimation de grade par IA. La référence pour les collectionneurs sérieux et investisseurs en cartes Pokémon.",
  keywords: ["pokémon", "investissement", "cartes", "PSA", "BGS", "cotation", "collection", "grade", "portfolio"],
  authors: [{ name: "PokeInvest" }],
  creator: "PokeInvest",
  robots: { index: true, follow: true },
  openGraph: {
    title: "PokeInvest — La plateforme d'investissement en cartes Pokémon",
    description: "Transformez votre passion en patrimoine. Prix en temps réel, alertes bonnes affaires, grade IA — 42 000+ membres.",
    type: "website",
    url: "https://poke-invests.netlify.app",
    siteName: "PokeInvest",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeInvest — Investissez dans les cartes Pokémon",
    description: "Transformez votre passion en patrimoine. Données en temps réel, 42 000+ membres.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
