import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — PokeInvest",
  description: "Conditions générales d'utilisation de la plateforme PokeInvest.",
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#0b1623] text-slate-200">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Retour
        </Link>
        <span className="text-white/20">·</span>
        <span className="text-sm text-slate-400">Conditions Générales d'Utilisation</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-slate-500 text-sm mb-12">Dernière mise à jour : 14 juin 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Présentation du service</h2>
            <p>PokeInvest est une plateforme en ligne permettant aux collectionneurs et investisseurs en cartes Pokémon de suivre leur portfolio, d'estimer la valeur de leur collection et de consulter des données de marché. Le service est accessible à l'adresse <strong className="text-white">pokeinvest.vercel.app</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Acceptation des conditions</h2>
            <p>L'utilisation du service implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service. PokeInvest se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de toute modification substantielle.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Création de compte</h2>
            <p>L'accès au service nécessite la création d'un compte avec une adresse e-mail valide. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. PokeInvest ne saurait être tenu responsable d'un accès non autorisé résultant d'une négligence de votre part.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Données de collection</h2>
            <p>Les données de portfolio que vous saisissez (cartes, prix, cotes) restent votre propriété. PokeInvest ne les utilise pas à des fins commerciales. Les prix et cotes affichés sont à titre indicatif uniquement et ne constituent pas un conseil en investissement.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Limitation de responsabilité</h2>
            <p>PokeInvest fournit les données de marché à titre informatif. Nous ne garantissons pas l'exactitude, l'exhaustivité ou la pertinence des informations de cotation. Toute décision d'achat ou de vente de cartes Pokémon est prise sous l'entière responsabilité de l'utilisateur. Les performances passées ne préjugent pas des performances futures.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Propriété intellectuelle</h2>
            <p>L'ensemble des éléments constituant la plateforme (interface, code, marque PokeInvest) est protégé par le droit de la propriété intellectuelle. Les noms, images et marques déposées relatifs à Pokémon sont la propriété de Nintendo / Creatures Inc. / GAME FREAK inc. PokeInvest n'est pas affilié à ces sociétés.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Résiliation</h2>
            <p>Vous pouvez supprimer votre compte à tout moment depuis votre page de profil. PokeInvest se réserve le droit de suspendre ou de résilier l'accès d'un utilisateur en cas de violation des présentes CGU, sans préavis.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
            <p>Pour toute question relative aux présentes conditions : <a href="mailto:contact@pokeinvest.fr" className="text-orange-400 hover:underline">contact@pokeinvest.fr</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm text-slate-500">
          <Link href="/confidentialite" className="hover:text-slate-300 transition-colors">Politique de confidentialité</Link>
          <Link href="/" className="hover:text-slate-300 transition-colors">Accueil</Link>
        </div>
      </main>
    </div>
  );
}
