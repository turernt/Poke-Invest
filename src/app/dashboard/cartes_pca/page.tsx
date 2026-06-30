"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth, useToast, useConfirm } from "@/components/dashboard/DashboardContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const BLOCS_LABELS: Record<string, { FR: string; EN: string }> = {
  "ECARLATE ET VIOLET": { FR: "Écarlate et Violet", EN: "Scarlet & Violet" },
  "EPEE ET BOUCLIER": { FR: "Épée et Bouclier", EN: "Sword & Shield" },
  "SOLEIL ET LUNE": { FR: "Soleil et Lune", EN: "Sun & Moon" },
  "XY": { FR: "XY", EN: "XY" },
  "MEGA EVOLUTION": { FR: "Méga-Évolution", EN: "Mega Evolution" },
  "BASE SET ERA": { FR: "Ère Base Set", EN: "Base Set Era" },
  "NEO ERA": { FR: "Ère Neo", EN: "Neo Era" },
  "GYM ERA": { FR: "Ère Gym", EN: "Gym Era" },
  "E-CARD ERA": { FR: "Ère E-Card", EN: "E-Card Era" },
  "HOLON ERA": { FR: "Ère Holon", EN: "Holon Era" },
  "DIAMANT ET PERLE": { FR: "Diamant et Perle", EN: "Diamond & Pearl" },
  "HEARTGOLD ET SOULSILVER": { FR: "HeartGold et SoulSilver", EN: "HeartGold & SoulSilver" },
  "NOIR ET BLANC": { FR: "Noir et Blanc", EN: "Black & White" },
  "Inconnu": { FR: "Autre / Inconnu", EN: "Other / Unknown" },
};

const getBlocLabel = (bloc: string, lang: "FR" | "EN") => {
  return BLOCS_LABELS[bloc]?.[lang] || bloc;
};

const BLOCS = Object.keys(BLOCS_LABELS).map(value => ({
  value,
  label: BLOCS_LABELS[value].FR
}));

const CERTIFICATIONS = [
  { value: "PSA", label: "PSA" },
  { value: "BGS", label: "BGS/Beckett" },
  { value: "CGC", label: "CGC" },
  { value: "SGC", label: "SGC" },
  { value: "PCA", label: "PCA" },
  { value: "Collect Aura", label: "Collect Aura" },
];

const SERIES_LABELS: Record<string, { FR: string; EN: string }> = {
  "Set de Base": { FR: "Set de Base", EN: "Base Set" },
  "Jungle": { FR: "Jungle", EN: "Jungle" },
  "Fossile": { FR: "Fossile", EN: "Fossil" },
  "Néo Genèse": { FR: "Néo Genèse", EN: "Neo Genesis" },
  "Néo Découverte": { FR: "Néo Découverte", EN: "Neo Discovery" },
  "Néo Révélation": { FR: "Néo Révélation", EN: "Neo Revelation" },
  "Néo Destinée": { FR: "Néo Destinée", EN: "Neo Destiny" },
  "Gym Héros": { FR: "Gym Héros", EN: "Gym Heroes" },
  "Gym Challenge": { FR: "Gym Challenge", EN: "Gym Challenge" },
  "Expédition": { FR: "Expédition", EN: "Expedition" },
  "Aquapolis": { FR: "Aquapolis", EN: "Aquapolis" },
  "Skyridge": { FR: "Skyridge", EN: "Skyridge" },
  "Rubis et Saphir": { FR: "Rubis et Saphir", EN: "Ruby & Sapphire" },
  "Tempête de Sable": { FR: "Tempête de Sable", EN: "Sandstorm" },
  "Feu Rouge Feuille Verte": { FR: "Feu Rouge Feuille Verte", EN: "Fire Red Leaf Green" },
  "Équipe Magma vs Équipe Aqua": { FR: "Équipe Magma vs Équipe Aqua", EN: "Team Magma vs Team Aqua" },
  "Légendes Cachées": { FR: "Légendes Cachées", EN: "Hidden Legends" },
  "Émeraude": { FR: "Émeraude", EN: "Emerald" },
  "Pouvoirs Insoupçonnés": { FR: "Pouvoirs Insoupçonnés", EN: "Unseen Forces" },
  "Espèces Delta": { FR: "Espèces Delta", EN: "Delta Species" },
  "Créateur de Légendes": { FR: "Créateur de Légendes", EN: "Legend Maker" },
  "Fantômes de Holon": { FR: "Fantômes de Holon", EN: "Holon Phantoms" },
  "Gardiens de Cristal": { FR: "Gardiens de Cristal", EN: "Crystal Guardians" },
  "Frontière du Dragon": { FR: "Frontière du Dragon", EN: "Dragon Frontiers" },
  "Gardiens du Pouvoir": { FR: "Gardiens du Pouvoir", EN: "Power Keepers" },
  "Diamant et Perle": { FR: "Diamant et Perle", EN: "Diamond & Pearl" },
  "Trésors Mystérieux": { FR: "Trésors Mystérieux", EN: "Mysterious Treasures" },
  "Secrets Merveilleux": { FR: "Secrets Merveilleux", EN: "Secret Wonders" },
  "Grande Rencontres": { FR: "Grande Rencontres", EN: "Great Encounters" },
  "Aube Majestueuse": { FR: "Aube Majestueuse", EN: "Majestic Dawn" },
  "Légendes Éveillées": { FR: "Légendes Éveillées", EN: "Legends Awakened" },
  "Tempête Ardente": { FR: "Tempête Ardente", EN: "Stormfront" },
  "Platine": { FR: "Platine", EN: "Platinum" },
  "Rivaux Émergents": { FR: "Rivaux Émergents", EN: "Rising Rivals" },
  "Victoires Suprêmes": { FR: "Victoires Suprêmes", EN: "Supreme Victors" },
  "Arceus": { FR: "Arceus", EN: "Arceus" },
  "HeartGold & SoulSilver": { FR: "HeartGold & SoulSilver", EN: "HeartGold & SoulSilver" },
  "Déchaîné": { FR: "Déchaîné", EN: "Unleashed" },
  "Imparable": { FR: "Imparable", EN: "Undaunted" },
  "Triomphant": { FR: "Triomphant", EN: "Triumphant" },
  "Noir et Blanc": { FR: "Noir et Blanc", EN: "Black & White" },
  "Pouvoirs Émergents": { FR: "Pouvoirs Émergents", EN: "Emerging Powers" },
  "Victoires Nobles": { FR: "Victoires Nobles", EN: "Noble Victories" },
  "Destinées Suivantes": { FR: "Destinées Suivantes", EN: "Next Destinies" },
  "Explorateurs Noirs": { FR: "Explorateurs Noirs", EN: "Dark Explorers" },
  "Dragons Exaltés": { FR: "Dragons Exaltés", EN: "Dragons Exalted" },
  "Frontières Traversées": { FR: "Frontières Traversées", EN: "Boundaries Crossed" },
  "Tempête Plasma": { FR: "Tempête Plasma", EN: "Plasma Storm" },
  "Gel Plasma": { FR: "Gel Plasma", EN: "Plasma Freeze" },
  "Explosion Plasma": { FR: "Explosion Plasma", EN: "Plasma Blast" },
  "XY": { FR: "XY", EN: "XY" },
  "Étincelles Flamboyantes": { FR: "Étincelles Flamboyantes", EN: "Flashfire" },
  "Poings Furieux": { FR: "Poings Furieux", EN: "Furious Fists" },
  "Forces Fantômes": { FR: "Forces Fantômes", EN: "Phantom Forces" },
  "Choc Primordial": { FR: "Choc Primordial", EN: "Primal Clash" },
  "Cieux Rugissants": { FR: "Cieux Rugissants", EN: "Roaring Skies" },
  "Cris Anciens": { FR: "Cris Anciens", EN: "Ancient Roar" },
  "Percée": { FR: "Percée", EN: "Breakthrough" },
  "Point de Rupture": { FR: "Point de Rupture", EN: "BREAKpoint" },
  "Générations": { FR: "Générations", EN: "Generations" },
  "Destins Entrelacés": { FR: "Destins Entrelacés", EN: "Fates Collide" },
  "Siège de Vapeur": { FR: "Siège de Vapeur", EN: "Steam Siege" },
  "Évolutions": { FR: "Évolutions", EN: "Evolutions" },
  "Soleil et Lune": { FR: "Soleil et Lune", EN: "Sun & Moon" },
  "Gardiens Ascendants": { FR: "Gardiens Ascendants", EN: "Guardians Rising" },
  "Ombres Brûlantes": { FR: "Ombres Brûlantes", EN: "Burning Shadows" },
  "Invasion Écarlate": { FR: "Invasion Écarlate", EN: "Crimson Invasion" },
  "Ultra-Prisme": { FR: "Ultra-Prisme", EN: "Ultra Prism" },
  "Lumière Interdite": { FR: "Lumière Interdite", EN: "Forbidden Light" },
  "Tempête Céleste": { FR: "Tempête Céleste", EN: "Celestial Storm" },
  "Tonnerre Perdu": { FR: "Tonnerre Perdu", EN: "Lost Thunder" },
  "Travail d'Équipe": { FR: "Travail d'Équipe", EN: "Team Up" },
  "Liens Indestructibles": { FR: "Liens Indestructibles", EN: "Unbroken Bonds" },
  "Esprits Unifiés": { FR: "Esprits Unifiés", EN: "Unified Minds" },
  "Éclipse Cosmique": { FR: "Éclipse Cosmique", EN: "Cosmic Eclipse" },
  "Épée et Bouclier": { FR: "Épée et Bouclier", EN: "Sword & Shield" },
  "Rébellion Rebelle": { FR: "Rébellion Rebelle", EN: "Rebel Clash" },
  "Obscurité Embrasée": { FR: "Obscurité Embrasée", EN: "Darkness Ablaze" },
  "Tension Vivante": { FR: "Tension Vivante", EN: "Vivid Voltage" },
  "Styles de Combat": { FR: "Styles de Combat", EN: "Battle Styles" },
  "Règne Glacial": { FR: "Règne Glacial", EN: "Chilling Reign" },
  "Cieux Évolutifs": { FR: "Cieux Évolutifs", EN: "Evolving Skies" },
  "Fusion Frappe": { FR: "Fusion Frappe", EN: "Fusion Strike" },
  "Célébrations": { FR: "Célébrations", EN: "Celebrations" },
  "Étoiles Brillantes": { FR: "Étoiles Brillantes", EN: "Brilliant Stars" },
  "Pokémon GO": { FR: "Pokémon GO", EN: "Pokémon GO" },
  "Origines Perdues": { FR: "Origines Perdues", EN: "Lost Origin" },
  "Tempête Argentée": { FR: "Tempête Argentée", EN: "Silver Tempest" },
  "Zénith Suprême": { FR: "Zénith Suprême", EN: "Crown Zenith" },
  "Obsidienne Enflammée": { FR: "Obsidienne Enflammée", EN: "Obsidian Flames" },
  "Série Base Écarlate et Violet": { FR: "Série Base Écarlate et Violet", EN: "Scarlet & Violet Base" },
  "151": { FR: "151", EN: "151" },
  "Fissures Paradoxales": { FR: "Fissures Paradoxales", EN: "Paradox Rift" },
  "Mascarade Crépusculaire": { FR: "Mascarade Crépusculaire", EN: "Twilight Masquerade" },
  "Couronne Stellaire": { FR: "Couronne Stellaire", EN: "Stellar Crown" },
  "Flammes Déferlantes": { FR: "Flammes Déferlantes", EN: "Surging Sparks" },
  "Failles Temporelles": { FR: "Failles Temporelles", EN: "Temporal Forces" },
  "Destins de Paldea": { FR: "Destins de Paldea", EN: "Paldean Fates" },
  "Évolutions Prismatiques": { FR: "Évolutions Prismatiques", EN: "Prismatic Evolutions" },
  "Aventures Ensemble": { FR: "Aventures Ensemble", EN: "Journey Together" },
  "Rivalités Destinées": { FR: "Rivalités Destinées", EN: "Destined Rivals" },
  "Foudre Noire": { FR: "Foudre Noire", EN: "Black Bolt" },
  "Flamme Blanche": { FR: "Flamme Blanche", EN: "White Flare" },
  "Héros Transcendants": { FR: "Héros Transcendants", EN: "Ascended Heroes" },
  "Équilibre Parfait": { FR: "Équilibre Parfait", EN: "Perfect Order" },
  "Chaos Ascendant": { FR: "Chaos Ascendant", EN: "Chaos Rising" },
  "Nuit Noire": { FR: "Nuit Noire", EN: "Pitch Black" },
  "30ème Célébration": { FR: "30ème Célébration", EN: "30th Celebration" },
  "Règne Delta": { FR: "Règne Delta", EN: "Delta Reign" },
};

const SERIES_BY_BLOC: Record<string, string[]> = {
  "BASE SET ERA": ["Set de Base", "Jungle", "Fossile"],
  "NEO ERA": ["Néo Genèse", "Néo Découverte", "Néo Révélation", "Néo Destinée"],
  "GYM ERA": ["Gym Héros", "Gym Challenge"],
  "E-CARD ERA": ["Expédition", "Aquapolis", "Skyridge"],
  "HOLON ERA": ["Rubis et Saphir", "Tempête de Sable", "Feu Rouge Feuille Verte", "Équipe Magma vs Équipe Aqua", "Légendes Cachées", "Émeraude", "Pouvoirs Insoupçonnés", "Espèces Delta", "Créateur de Légendes", "Fantômes de Holon", "Gardiens de Cristal", "Frontière du Dragon", "Gardiens du Pouvoir"],
  "DIAMANT ET PERLE": ["Diamant et Perle", "Trésors Mystérieux", "Secrets Merveilleux", "Grande Rencontres", "Aube Majestueuse", "Légendes Éveillées", "Tempête Ardente", "Platine", "Rivaux Émergents", "Victoires Suprêmes", "Arceus"],
  "HEARTGOLD ET SOULSILVER": ["HeartGold & SoulSilver", "Déchaîné", "Imparable", "Triomphant"],
  "NOIR ET BLANC": ["Noir et Blanc", "Pouvoirs Émergents", "Victoires Nobles", "Destinées Suivantes", "Explorateurs Noirs", "Dragons Exaltés", "Frontières Traversées", "Tempête Plasma", "Gel Plasma", "Explosion Plasma"],
  "XY": ["XY", "Étincelles Flamboyantes", "Poings Furieux", "Forces Fantômes", "Choc Primordial", "Cieux Rugissants", "Cris Anciens", "Percée", "Point de Rupture", "Générations", "Destins Entrelacés", "Siège de Vapeur", "Évolutions"],
  "SOLEIL ET LUNE": ["Soleil et Lune", "Gardiens Ascendants", "Ombres Brûlantes", "Invasion Écarlate", "Ultra-Prisme", "Lumière Interdite", "Tempête Céleste", "Tonnerre Perdu", "Travail d'Équipe", "Liens Indestructibles", "Esprits Unifiés", "Éclipse Cosmique"],
  "EPEE ET BOUCLIER": ["Épée et Bouclier", "Rébellion Rebelle", "Obscurité Embrasée", "Tension Vivante", "Styles de Combat", "Règne Glacial", "Cieux Évolutifs", "Fusion Frappe", "Célébrations", "Étoiles Brillantes", "Pokémon GO", "Origines Perdues", "Tempête Argentée", "Zénith Suprême"],
  "ECARLATE ET VIOLET": ["Série Base Écarlate et Violet", "Obsidienne Enflammée", "Évolutions à Paldea", "151", "Fissures Paradoxales", "Mascarade Crépusculaire", "Couronne Stellaire", "Flammes Déferlantes", "Failles Temporelles", "Destins de Paldea", "Évolutions Prismatiques", "Aventures Ensemble", "Rivalités Destinées", "Foudre Noire", "Flamme Blanche"],
  "MEGA EVOLUTION": ["Héros Transcendants", "Équilibre Parfait", "Chaos Ascendant", "Nuit Noire", "30ème Célébration", "Règne Delta"],
};

const getSeriesLabel = (series: string, lang: "FR" | "EN") => {
  return SERIES_LABELS[series]?.[lang] || series;
};

function blocClass(b: string) {
  const s = (b || "").toUpperCase();
  if (s.includes("ECARLATE") || s.includes("VIOLET")) return "ev";
  if (s.includes("EPEE") || s.includes("BOUCLIER")) return "eb";
  if (s.includes("MEGA")) return "me";
  return "other";
}

interface Carte {
  id: string;
  carte: string;
  numero: string;
  bloc: string;
  serie: string;
  note: string;
  prix_achat: number;
  cote: number;
  benef: number;
  certification?: string;
  grade?: number | null;
  cert_number?: string;
}

interface TcgCard {
  id: string;
  name: string;
  number: string;
  set: { name: string };
  images: { small: string };
}

async function searchTcgCards(query: string): Promise<TcgCard[]> {
  if (query.length < 2) return [];
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query + "*")}&pageSize=8&select=id,name,number,set,images`);
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default function CartesPcaPage() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const supabase = getSupabaseBrowser();

  const [data, setData] = useState<Carte[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ col: -1, asc: true });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<"FR" | "EN">("FR");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ carte: "", numero: "", bloc: "ECARLATE ET VIOLET", serie: "", note: "", prix: "", cote: "", certification: "", grade: "", cert_number: "" });
  const [saving, setSaving] = useState(false);
  const [ebayLoading, setEbayLoading] = useState<Set<string>>(new Set());

  // Autocomplete
  const [suggestions, setSuggestions] = useState<TcgCard[]>([]);
  const [scanImg, setScanImg] = useState<string | null>(null);
  const [showSugg, setShowSugg] = useState(false);
  const autocompleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loaded = useRef(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLanguage((user.user_metadata?.language as "FR" | "EN") || "FR");
    const { data: rows } = await supabase.from("cartes_pca").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setData((rows ?? []).map((r: Omit<Carte, "benef">) => ({ ...r, benef: (r.cote ?? 0) - (r.prix_achat ?? 0) })));
  }, [user, supabase]);

  useEffect(() => {
    if (!loading && user && !loaded.current) { loaded.current = true; load(); }
  }, [user, loading, load]);

  const handleCarteInput = (val: string) => {
    setForm(f => ({ ...f, carte: val }));
    setScanImg(null);
    if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current);
    if (val.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    autocompleteTimer.current = setTimeout(async () => {
      const results = await searchTcgCards(val);
      setSuggestions(results);
      setShowSugg(results.length > 0);
    }, 300);
  };

  const pickSuggestion = (card: TcgCard) => {
    setForm(f => ({ ...f, carte: card.name, numero: card.number, serie: card.set.name.toUpperCase() }));
    setScanImg(card.images?.small ?? null);
    setSuggestions([]);
    setShowSugg(false);
  };

  const filtered = data.filter(r =>
    `${r.carte} ${r.numero} ${r.serie} ${r.bloc} ${r.note}`.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const cols: (keyof Carte)[] = ["carte", "numero", "bloc", "serie", "note", "prix_achat", "cote", "benef"];
    if (sort.col < 0) return 0;
    const key = cols[sort.col];
    const av = a[key] as string | number, bv = b[key] as string | number;
    return sort.asc ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
  });

  const toggleSort = (col: number) =>
    setSort(s => s.col === col ? { col, asc: !s.asc } : { col, asc: true });

  const openAdd = () => {
    setEditId(null);
    setForm({ carte: "", numero: "", bloc: "ECARLATE ET VIOLET", serie: "", note: "", prix: "", cote: "", certification: "", grade: "", cert_number: "" });
    setScanImg(null); setSuggestions([]); setShowSugg(false);
    setModal(true);
  };

  const openEdit = (row: Carte) => {
    setEditId(row.id);
    setForm({ carte: row.carte, numero: row.numero, bloc: row.bloc, serie: row.serie, note: row.note || "", prix: String(row.prix_achat), cote: String(row.cote), certification: row.certification || "", grade: row.grade ? String(row.grade) : "", cert_number: row.cert_number || "" });
    setScanImg(null); setSuggestions([]); setShowSugg(false);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const carte = form.carte.trim(), numero = form.numero.trim();
    const serie = form.serie.trim().toUpperCase();
    const prix = parseFloat(form.prix), cote = parseFloat(form.cote);
    const grade = form.grade ? parseInt(form.grade) : null;

    if (!carte) { showToast("Le nom de la carte est requis", "error"); return; }
    if (!numero) { showToast("Le numéro est requis", "error"); return; }
    if (!serie) { showToast("La série est requise", "error"); return; }
    if (isNaN(prix) || prix < 0) { showToast("Prix d'achat invalide", "error"); return; }
    if (isNaN(cote) || cote < 0) { showToast("Cote invalide", "error"); return; }
    if (grade && (grade < 1 || grade > 10)) { showToast("Le grade doit être entre 1 et 10", "error"); return; }

    setSaving(true);
    const payload = { user_id: user!.id, carte, numero, bloc: form.bloc, serie, note: form.note.trim(), prix_achat: prix, cote, certification: form.certification || null, grade, cert_number: form.cert_number || null };

    if (!editId) {
      const { data: row, error } = await supabase.from("cartes_pca").insert(payload as never).select().single();
      if (error) showToast("Erreur lors de l'ajout", "error");
      else { const r = row as Carte; setData(prev => [{ ...r, benef: r.cote - r.prix_achat }, ...prev]); showToast("Carte ajoutée !"); }
    } else {
      const { data: row, error } = await supabase.from("cartes_pca").update(payload as never).eq("id", editId).select().single();
      if (error) showToast("Erreur lors de la modification", "error");
      else { const r = row as Carte; setData(prev => prev.map(x => x.id === editId ? { ...r, benef: r.cote - r.prix_achat } : x)); showToast("Carte modifiée !"); }
    }
    setSaving(false); setModal(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm("Supprimer la carte", `Supprimer « ${name} » ?`);
    if (!ok) return;
    const { error } = await supabase.from("cartes_pca").delete().eq("id", id);
    if (error) showToast("Erreur lors de la suppression", "error");
    else { setData(prev => prev.filter(r => r.id !== id)); showToast("Carte supprimée"); }
  };

  const handleEbay = async (row: Carte) => {
    setEbayLoading(prev => new Set(prev).add(row.id));
    try {
      const res = await fetch(`/api/ebay-price?q=${encodeURIComponent(`${row.carte} ${row.numero} ${row.note} pokemon graded`)}`);
      const result = await res.json();
      if (result.not_configured) { window.open(result.fallback_url, "_blank", "noopener"); return; }
      if (result.error || result.price === null) { showToast("Aucun résultat eBay", "error"); return; }
      await supabase.from("cartes_pca").update({ cote: result.price } as never).eq("id", row.id);
      setData(prev => prev.map(r => r.id === row.id ? { ...r, cote: result.price, benef: result.price - r.prix_achat } : r));
      showToast(`Cote mise à jour : ${fmt(result.price)}`);
    } finally {
      setEbayLoading(prev => { const s = new Set(prev); s.delete(row.id); return s; });
    }
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSelectAll = () =>
    setSelected(prev => prev.size === sorted.length ? new Set() : new Set(sorted.map(r => r.id)));
  const deleteSelected = async () => {
    const ids = [...selected];
    if (!await confirm("Supprimer la sélection", `Supprimer ${ids.length} carte(s) ?`)) return;
    await supabase.from("cartes_pca").delete().in("id", ids);
    setData(prev => prev.filter(r => !ids.includes(r.id)));
    setSelected(new Set()); showToast(`${ids.length} carte(s) supprimée(s)`);
  };

  if (loading) return null;

  const SortIcon = ({ col }: { col: number }) => (
    <svg className={`sort-icon${sort.col === col ? " active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {sort.col === col ? sort.asc
        ? <path d="M12 5l7 7-7 7" transform="rotate(-90 12 12)"/>
        : <path d="M12 5l7 7-7 7" transform="rotate(90 12 12)"/>
        : <><path d="M12 5v14"/><path d="M5 12l7-7 7 7" opacity=".4"/></>}
    </svg>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cartes Gradées (PCA)</h1>
          <p className="page-subtitle">Cartes PSA / BGS / CGC · Tri par note</p>
        </div>
        <button className="btn-add" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Ajouter
        </button>
      </div>

      <div className="top-bar">
        <div className="search-wrap">
          <span className="search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher" />
        </div>
        <div className="bar-right">
          <button
            onClick={() => {
              const rows = [["Carte","N°","Bloc","Série","Certification","Grade","N° Cert","Défauts","Achat (€)","Cote (€)","Plus-value (€)"], ...sorted.map(r => [r.carte, r.numero, r.bloc, r.serie, r.certification || "", r.grade || "", r.cert_number || "", r.note, r.prix_achat, r.cote, r.benef])];
              const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })); a.download = "cartes_pca.csv"; a.click();
            }}
            className="act-btn"
            title="Exporter CSV"
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", fontSize: 12, fontWeight: 600 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
          <span className="item-count">{sorted.length} carte{sorted.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selected.size === sorted.length && sorted.length > 0} onChange={toggleSelectAll} /></th>
            {["Carte", "N°", "Bloc", "Série", "Note", "Achat", "Cote", "Plus-value"].map((h, i) => (
              <th key={h} onClick={() => toggleSort(i)} style={{ cursor: "pointer" }}>{h}<SortIcon col={i} /></th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={10} style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
              {search ? "Aucune carte trouvée." : "Aucune carte gradée — cliquez sur Ajouter."}
            </td></tr>
          ) : sorted.map(row => (
            <tr key={row.id} className={selected.has(row.id) ? "selected" : ""}>
              <td><input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} /></td>
              <td className="cell-name">{row.carte}</td>
              <td className="cell-num">{row.numero}</td>
              <td><span className={`bloc-badge ${blocClass(row.bloc)}`}>{row.bloc}</span></td>
              <td>{row.serie}</td>
              <td><span style={{ fontWeight: 700, color: "var(--gold)" }}>{row.note || "—"}</span></td>
              <td>{fmt(row.prix_achat)}</td>
              <td>{fmt(row.cote)}</td>
              <td className={row.benef >= 0 ? "positive" : "negative"}>{row.benef >= 0 ? "+" : ""}{fmt(row.benef)}</td>
              <td>
                <div className="act-btns">
                  <button className={`act-btn ebay${ebayLoading.has(row.id) ? " loading" : ""}`} onClick={() => handleEbay(row)} disabled={ebayLoading.has(row.id)} title="eBay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2.5 2.5"/></svg>
                  </button>
                  <button className="act-btn edit" onClick={() => openEdit(row)} title="Modifier">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="act-btn delete" onClick={() => handleDelete(row.id, row.carte)} title="Supprimer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.size > 0 && (
        <div className="bulk-bar active">
          <span>{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
          <button className="bulk-btn bulk-btn-danger" onClick={deleteSelected}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            Supprimer
          </button>
          <button className="bulk-btn" onClick={() => setSelected(new Set())}>Annuler</button>
        </div>
      )}

      {modal && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">{editId ? "Modifier" : "Ajouter"}</span>
              <button className="modal-close" onClick={() => setModal(false)} aria-label="Fermer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {scanImg && <div className="scan-preview"><img src={scanImg} alt="preview" /></div>}
                <div style={{ flex: 1, position: "relative" }}>
                  <div className="form-group">
                    <label>Nom de la carte</label>
                    <input value={form.carte} onChange={e => handleCarteInput(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                      onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                      placeholder="Ex: Dracaufeu, Pikachu VMAX…" autoComplete="off" />
                    {showSugg && suggestions.length > 0 && (
                      <ul className="scan-suggestions">
                        {suggestions.map(c => (
                          <li key={c.id} onMouseDown={() => pickSuggestion(c)}>
                            {c.images?.small && <img src={c.images.small} alt={c.name} className="sugg-thumb" />}
                            <div><div className="sugg-name">{c.name}</div><div className="sugg-meta">{c.number} · {c.set.name}</div></div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Numéro</label>
                  <input value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} placeholder="004/165" />
                </div>
                <div className="form-group">
                  <label>Certification</label>
                  <select value={form.certification} onChange={e => setForm(f => ({ ...f, certification: e.target.value }))}>
                    <option value="">Aucune</option>
                    {CERTIFICATIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grade (1-10)</label>
                  <input type="number" min="1" max="10" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="Ex: 9.5" />
                </div>
                <div className="form-group">
                  <label>N° Certification</label>
                  <input value={form.cert_number} onChange={e => setForm(f => ({ ...f, cert_number: e.target.value }))} placeholder="Ex: 123456789" />
                </div>
              </div>
              <div className="form-group">
                <label>Notes / Défauts</label>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Ex: Petit scratch, centering parfait…" style={{ minHeight: 60, fontFamily: "monospace", fontSize: 12 }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bloc</label>
                  <select value={form.bloc} onChange={e => setForm(f => ({ ...f, bloc: e.target.value }))}>
                    {BLOCS.map(b => <option key={b.value} value={b.value}>{getBlocLabel(b.value, language)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Série / Extension</label>
                  <select value={form.serie} onChange={e => setForm(f => ({ ...f, serie: e.target.value }))}>
                    <option value="">Sélectionner une série…</option>
                    {(SERIES_BY_BLOC[form.bloc] || []).map(s => <option key={s} value={s}>{getSeriesLabel(s, language)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prix d&apos;achat (€)</label>
                  <input type="number" step="0.01" min="0" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} placeholder="0,00" />
                </div>
                <div className="form-group">
                  <label>Cote actuelle (€)</label>
                  <input type="number" step="0.01" min="0" value={form.cote} onChange={e => setForm(f => ({ ...f, cote: e.target.value }))} placeholder="0,00" />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setModal(false)}>Annuler</button>
                <button type="submit" className="btn-submit" disabled={saving}>{saving ? "Enregistrement…" : editId ? "Enregistrer" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
