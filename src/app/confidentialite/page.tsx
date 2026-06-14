import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — PokeInvest",
  description: "Politique de confidentialité et traitement des données personnelles de PokeInvest.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0b1623] text-slate-200">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Retour
        </Link>
        <span className="text-white/20">·</span>
        <span className="text-sm text-slate-400">Politique de confidentialité</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Politique de Confidentialité</h1>
        <p className="text-slate-500 text-sm mb-12">Dernière mise à jour : 14 juin 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Responsable du traitement</h2>
            <p>Le responsable du traitement des données personnelles collectées via PokeInvest est l'éditeur de la plateforme, joignable à <a href="mailto:contact@pokeinvest.fr" className="text-orange-400 hover:underline">contact@pokeinvest.fr</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Données collectées</h2>
            <p className="mb-3">Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Données de compte</strong> : adresse e-mail, mot de passe chiffré (via Supabase Auth)</li>
              <li><strong className="text-slate-300">Données de portfolio</strong> : cartes, prix d'achat, cotes — saisies volontairement par vous</li>
              <li><strong className="text-slate-300">Données techniques</strong> : adresse IP, navigateur, logs de connexion (conservation 30 jours)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Gestion de votre compte et authentification</li>
              <li>Affichage et sauvegarde de votre portfolio personnel</li>
              <li>Amélioration du service (statistiques anonymisées uniquement)</li>
              <li>Sécurité et prévention de la fraude</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Base légale</h2>
            <p>Le traitement de vos données repose sur l'exécution du contrat (CGU) que vous avez accepté lors de la création de votre compte. Les données techniques sont traitées sur la base de notre intérêt légitime à sécuriser le service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Hébergement et sous-traitants</h2>
            <p>Les données sont hébergées via <strong className="text-white">Supabase</strong> (base de données et authentification, serveurs EU) et <strong className="text-white">Vercel</strong> (hébergement de l'application, serveurs EU/US). Ces prestataires disposent de garanties conformes au RGPD.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Durée de conservation</h2>
            <p>Vos données de compte et de portfolio sont conservées tant que votre compte est actif. En cas de suppression de compte, toutes vos données personnelles sont effacées dans un délai de 30 jours. Les logs techniques sont supprimés après 30 jours.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Cookies</h2>
            <p>PokeInvest utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de traçage tiers n'est déposé.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Vos droits (RGPD)</h2>
            <p className="mb-3">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong className="text-slate-300">Droit de rectification</strong> : corriger vos informations depuis votre profil</li>
              <li><strong className="text-slate-300">Droit à l'effacement</strong> : supprimer votre compte via la page profil</li>
              <li><strong className="text-slate-300">Droit à la portabilité</strong> : exporter vos données sur demande</li>
              <li><strong className="text-slate-300">Droit d'opposition</strong> : s'opposer à un traitement spécifique</li>
            </ul>
            <p className="mt-3">Pour exercer vos droits : <a href="mailto:contact@pokeinvest.fr" className="text-orange-400 hover:underline">contact@pokeinvest.fr</a>. Vous pouvez également saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">CNIL</a> en cas de réclamation.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
            <p>Pour toute question relative à cette politique : <a href="mailto:contact@pokeinvest.fr" className="text-orange-400 hover:underline">contact@pokeinvest.fr</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm text-slate-500">
          <Link href="/cgu" className="hover:text-slate-300 transition-colors">CGU</Link>
          <Link href="/" className="hover:text-slate-300 transition-colors">Accueil</Link>
        </div>
      </main>
    </div>
  );
}
