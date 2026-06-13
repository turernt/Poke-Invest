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
  title: "PokeInvest — Investissez dans les cartes Pokémon",
  description: "Prix PSA & BGS en temps réel, alertes bonnes affaires et estimation de grade par IA. La plateforme de référence pour les collectionneurs et investisseurs en cartes Pokémon.",
  keywords: ["pokémon", "investissement", "cartes", "PSA", "BGS", "cotation", "collection"],
  openGraph: {
    title: "PokeInvest — Investissez dans les cartes Pokémon",
    description: "Transformez votre passion en patrimoine. Données en temps réel, 42 000+ membres.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
