"use client";

import { useState } from "react";

interface Extension {
  id: string;
  name: string;
  nameEn: string;
  bloc: string;
  code: string;
  cards: number;
  releaseDate: string;
  symbol: string;
}

const EXTENSIONS: Extension[] = [
  // Méga-Évolution
  { id: "me05", name: "Nuit Noire", nameEn: "Pitch Black", bloc: "MEGA EVOLUTION", code: "PBL", cards: 119, releaseDate: "2026-07-17", symbol: "⚫" },
  { id: "me04", name: "Chaos Ascendant", nameEn: "Chaos Rising", bloc: "MEGA EVOLUTION", code: "CRI", cards: 122, releaseDate: "2026-05-22", symbol: "🔱" },
  { id: "me03", name: "Équilibre Parfait", nameEn: "Perfect Order", bloc: "MEGA EVOLUTION", code: "POR", cards: 124, releaseDate: "2026-03-27", symbol: "⚖️" },
  { id: "me2pt5", name: "Héros Transcendants", nameEn: "Ascended Heroes", bloc: "MEGA EVOLUTION", code: "ASC", cards: 295, releaseDate: "2026-01-30", symbol: "🕊️" },
  { id: "me02", name: "Flammes Fantasmagoriques", nameEn: "Phantasmal Flames", bloc: "MEGA EVOLUTION", code: "PFL", cards: 130, releaseDate: "2025-11-14", symbol: "👻" },
  { id: "me01", name: "Méga-Évolution", nameEn: "Mega Evolution", bloc: "MEGA EVOLUTION", code: "MEG", cards: 188, releaseDate: "2025-10-10", symbol: "🟣" },
  // Écarlate et Violet
  { id: "sv10-5a", name: "Foudre Noire", nameEn: "Black Bolt", bloc: "ECARLATE ET VIOLET", code: "BLK", cards: 172, releaseDate: "2025-07-18", symbol: "⬛" },
  { id: "sv10-5b", name: "Flamme Blanche", nameEn: "White Flare", bloc: "ECARLATE ET VIOLET", code: "WHT", cards: 173, releaseDate: "2025-07-18", symbol: "⬜" },
  { id: "sv10", name: "Rivalités Destinées", nameEn: "Destined Rivals", bloc: "ECARLATE ET VIOLET", code: "DRI", cards: 244, releaseDate: "2025-05-30", symbol: "🆚" },
  { id: "sv9-jtg", name: "Aventures Ensemble", nameEn: "Journey Together", bloc: "ECARLATE ET VIOLET", code: "JTG", cards: 190, releaseDate: "2025-03-28", symbol: "🚂" },
  { id: "sv9", name: "Destins de Paldea", nameEn: "Paldean Fates", bloc: "ECARLATE ET VIOLET", code: "PAF", cards: 245, releaseDate: "2024-01-26", symbol: "⋆" },
  { id: "sv8pt5", name: "Failles Temporelles", nameEn: "Temporal Forces", bloc: "ECARLATE ET VIOLET", code: "TEF", cards: 218, releaseDate: "2024-03-22", symbol: "⏱" },
  { id: "sv6", name: "Mascarade Crépusculaire", nameEn: "Twilight Masquerade", bloc: "ECARLATE ET VIOLET", code: "TWM", cards: 226, releaseDate: "2024-05-24", symbol: "🎭" },
  { id: "sv7", name: "Couronne Stellaire", nameEn: "Stellar Crown", bloc: "ECARLATE ET VIOLET", code: "SCR", cards: 175, releaseDate: "2024-09-13", symbol: "★" },
  { id: "sv8", name: "Flammes Déferlantes", nameEn: "Surging Sparks", bloc: "ECARLATE ET VIOLET", code: "SSP", cards: 252, releaseDate: "2024-11-08", symbol: "⚡" },
  { id: "sv9-base", name: "Évolutions Prismatiques", nameEn: "Prismatic Evolutions", bloc: "ECARLATE ET VIOLET", code: "PRE", cards: 193, releaseDate: "2025-01-17", symbol: "💎" },
  { id: "sv3pt5", name: "151", nameEn: "151", bloc: "ECARLATE ET VIOLET", code: "MEW", cards: 207, releaseDate: "2023-09-22", symbol: "1️⃣" },
  { id: "sv4", name: "Feux Pâlissants", nameEn: "Paradox Rift", bloc: "ECARLATE ET VIOLET", code: "PAR", cards: 266, releaseDate: "2023-11-03", symbol: "🌀" },
  { id: "sv5", name: "Évolutions à Paldea", nameEn: "Paldea Evolved", bloc: "ECARLATE ET VIOLET", code: "PAL", cards: 279, releaseDate: "2023-06-09", symbol: "🔵" },
  { id: "sv2", name: "Évolutions Déferlantes", nameEn: "Scarlet & Violet Base Set", bloc: "ECARLATE ET VIOLET", code: "SVE", cards: 258, releaseDate: "2023-03-31", symbol: "🟥" },
  { id: "sv1", name: "Obsidienne Enflammée", nameEn: "Obsidian Flames", bloc: "ECARLATE ET VIOLET", code: "OBF", cards: 230, releaseDate: "2023-08-11", symbol: "🔥" },
  // Épée et Bouclier
  { id: "swsh12pt5", name: "Zénith Suprême", nameEn: "Crown Zenith", bloc: "EPEE ET BOUCLIER", code: "CRZ", cards: 230, releaseDate: "2023-01-20", symbol: "👑" },
  { id: "swsh12", name: "Tempête Argentée", nameEn: "Silver Tempest", bloc: "EPEE ET BOUCLIER", code: "SIT", cards: 215, releaseDate: "2022-11-11", symbol: "🌪" },
  { id: "swsh11", name: "Origine Perdue", nameEn: "Lost Origin", bloc: "EPEE ET BOUCLIER", code: "LOR", cards: 217, releaseDate: "2022-09-09", symbol: "♾" },
  { id: "swsh10", name: "Pokémon GO", nameEn: "Pokémon GO", bloc: "EPEE ET BOUCLIER", code: "PGO", cards: 88, releaseDate: "2022-07-01", symbol: "📍" },
  { id: "swsh9", name: "Étoiles Brillantes", nameEn: "Brilliant Stars", bloc: "EPEE ET BOUCLIER", code: "BRS", cards: 186, releaseDate: "2022-02-25", symbol: "✨" },
  { id: "swsh8", name: "Épée et Bouclier", nameEn: "Fusion Strike", bloc: "EPEE ET BOUCLIER", code: "FST", cards: 284, releaseDate: "2021-11-12", symbol: "⚔️" },
  { id: "swsh7", name: "Évolutions Célestes", nameEn: "Evolving Skies", bloc: "EPEE ET BOUCLIER", code: "EVS", cards: 237, releaseDate: "2021-08-27", symbol: "🌤" },
  { id: "swsh6", name: "Chilling Reign", nameEn: "Chilling Reign", bloc: "EPEE ET BOUCLIER", code: "CRE", cards: 233, releaseDate: "2021-06-18", symbol: "❄️" },
  { id: "swsh5", name: "Combat de Poings", nameEn: "Battle Styles", bloc: "EPEE ET BOUCLIER", code: "BST", cards: 183, releaseDate: "2021-03-19", symbol: "🥊" },
  { id: "swsh45", name: "Célébrations", nameEn: "Celebrations", bloc: "EPEE ET BOUCLIER", code: "CEL", cards: 50, releaseDate: "2021-10-08", symbol: "🎉" },
  { id: "swsh4", name: "Vivid Voltage", nameEn: "Vivid Voltage", bloc: "EPEE ET BOUCLIER", code: "VIV", cards: 203, releaseDate: "2020-11-13", symbol: "⚡" },
  { id: "swsh3", name: "Ténèbres Embrasées", nameEn: "Darkness Ablaze", bloc: "EPEE ET BOUCLIER", code: "DAA", cards: 201, releaseDate: "2020-08-14", symbol: "🌑" },
  { id: "swsh2", name: "Voltage Éclatant", nameEn: "Rebel Clash", bloc: "EPEE ET BOUCLIER", code: "RCL", cards: 209, releaseDate: "2020-05-01", symbol: "⚡" },
  { id: "swsh1", name: "Épée et Bouclier", nameEn: "Sword & Shield Base", bloc: "EPEE ET BOUCLIER", code: "SSH", cards: 216, releaseDate: "2020-02-07", symbol: "⚔" },
  // Soleil et Lune
  { id: "sm12", name: "Harmonie des Esprits", nameEn: "Cosmic Eclipse", bloc: "SOLEIL ET LUNE", code: "CEC", cards: 271, releaseDate: "2019-11-01", symbol: "🌊" },
  { id: "sm11", name: "Éclipse Cosmique", nameEn: "Unified Minds", bloc: "SOLEIL ET LUNE", code: "UNM", cards: 258, releaseDate: "2019-08-02", symbol: "🔮" },
  { id: "sm10", name: "Soleil et Lune", nameEn: "Unbroken Bonds", bloc: "SOLEIL ET LUNE", code: "UNB", cards: 234, releaseDate: "2019-05-03", symbol: "☀️" },
  { id: "sm9", name: "Tempête Céleste", nameEn: "Team Up", bloc: "SOLEIL ET LUNE", code: "TEU", cards: 196, releaseDate: "2019-02-01", symbol: "🌩" },
  { id: "sm8", name: "Tonnerre Perdu", nameEn: "Lost Thunder", bloc: "SOLEIL ET LUNE", code: "LOT", cards: 236, releaseDate: "2018-11-02", symbol: "⚡" },
  { id: "sm7", name: "Poings dans le Feu !", nameEn: "Celestial Storm", bloc: "SOLEIL ET LUNE", code: "CES", cards: 183, releaseDate: "2018-08-03", symbol: "🌀" },
];

const BLOCS = ["Tous", "MEGA EVOLUTION", "ECARLATE ET VIOLET", "EPEE ET BOUCLIER", "SOLEIL ET LUNE"];

function blocClass(b: string) {
  if (b.includes("MEGA")) return "me";
  if (b.includes("ECARLATE")) return "ev";
  if (b.includes("EPEE")) return "eb";
  if (b.includes("SOLEIL")) return "sl";
  return "other";
}

function blocLabel(b: string) {
  if (b.includes("MEGA")) return "Méga-Évolution";
  if (b.includes("ECARLATE")) return "Écarlate et Violet";
  if (b.includes("EPEE")) return "Épée et Bouclier";
  if (b.includes("SOLEIL")) return "Soleil et Lune";
  return b;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

export default function ReferentielPage() {
  const [search, setSearch] = useState("");
  const [selectedBloc, setSelectedBloc] = useState("Tous");
  const [sort, setSort] = useState<{ col: string; asc: boolean }>({ col: "releaseDate", asc: false });

  const filtered = EXTENSIONS
    .filter(e => {
      const matchesSearch = `${e.name} ${e.nameEn} ${e.code} ${e.bloc}`.toLowerCase().includes(search.toLowerCase());
      const matchesBloc = selectedBloc === "Tous" || e.bloc === selectedBloc;
      return matchesSearch && matchesBloc;
    })
    .sort((a, b) => {
      const av = a[sort.col as keyof Extension] as string | number;
      const bv = b[sort.col as keyof Extension] as string | number;
      return sort.asc ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
    });

  const toggleSort = (col: string) => setSort(s => s.col === col ? { col, asc: !s.asc } : { col, asc: true });

  const SortIcon = ({ col }: { col: string }) => (
    <svg className={`sort-icon${sort.col === col ? " active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, marginLeft: 4, verticalAlign: "middle" }}>
      {sort.col === col ? sort.asc
        ? <path d="M12 5l7 7-7 7" transform="rotate(-90 12 12)"/>
        : <path d="M12 5l7 7-7 7" transform="rotate(90 12 12)"/>
        : <><path d="M12 5v14"/><path d="M5 12l7-7 7 7" opacity=".4"/></>}
    </svg>
  );

  const totalCards = filtered.reduce((s, e) => s + e.cards, 0);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Référentiel Séries</h1>
          <p className="page-subtitle">Toutes les extensions Pokémon TCG · {filtered.length} extension{filtered.length !== 1 ? "s" : ""} · {totalCards.toLocaleString("fr-FR")} cartes</p>
        </div>
      </div>

      <div className="top-bar">
        <div className="search-wrap">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une extension…" aria-label="Rechercher" />
        </div>
        <div className="bar-right">
          {BLOCS.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBloc(b)}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                borderColor: selectedBloc === b ? "var(--primary)" : "var(--border)",
                background: selectedBloc === b ? "var(--primary)" : "transparent",
                color: selectedBloc === b ? "#fff" : "var(--muted)",
              }}
            >
              {b === "Tous" ? "Tous" : b === "MEGA EVOLUTION" ? "ME" : b === "ECARLATE ET VIOLET" ? "EV" : b === "EPEE ET BOUCLIER" ? "EB" : "SL"}
            </button>
          ))}
        </div>
      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>Nom FR <SortIcon col="name" /></th>
            <th onClick={() => toggleSort("nameEn")} style={{ cursor: "pointer" }}>Nom EN <SortIcon col="nameEn" /></th>
            <th onClick={() => toggleSort("code")} style={{ cursor: "pointer" }}>Code <SortIcon col="code" /></th>
            <th onClick={() => toggleSort("bloc")} style={{ cursor: "pointer" }}>Bloc <SortIcon col="bloc" /></th>
            <th onClick={() => toggleSort("cards")} style={{ cursor: "pointer", textAlign: "right" }}>Cartes <SortIcon col="cards" /></th>
            <th onClick={() => toggleSort("releaseDate")} style={{ cursor: "pointer" }}>Sortie <SortIcon col="releaseDate" /></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>Aucune extension trouvée.</td></tr>
          ) : filtered.map(ext => (
            <tr key={ext.id}>
              <td className="cell-name">{ext.name}</td>
              <td style={{ color: "var(--muted)", fontSize: 13 }}>{ext.nameEn}</td>
              <td><code style={{ fontSize: 12, background: "var(--bg-2)", padding: "2px 6px", borderRadius: 4, color: "var(--primary)" }}>{ext.code}</code></td>
              <td><span className={`bloc-badge ${blocClass(ext.bloc)}`}>{blocLabel(ext.bloc)}</span></td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>{ext.cards}</td>
              <td style={{ color: "var(--muted)", fontSize: 13 }}>{formatDate(ext.releaseDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
