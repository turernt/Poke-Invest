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
  // Base Set Era
  { id: "bs1", name: "Set de Base", nameEn: "Base Set", bloc: "BASE SET ERA", code: "BS", cards: 102, releaseDate: "1999-10-04", symbol: "🔵" },
  { id: "bs2", name: "Jungle", nameEn: "Jungle", bloc: "BASE SET ERA", code: "JU", cards: 64, releaseDate: "1999-12-16", symbol: "🌿" },
  { id: "bs3", name: "Fossile", nameEn: "Fossil", bloc: "BASE SET ERA", code: "FO", cards: 62, releaseDate: "2000-10-16", symbol: "🦴" },

  // Neo Era
  { id: "neo1", name: "Néo Genèse", nameEn: "Neo Genesis", bloc: "NEO ERA", code: "NG", cards: 111, releaseDate: "2000-12-16", symbol: "🌙" },
  { id: "neo2", name: "Néo Découverte", nameEn: "Neo Discovery", bloc: "NEO ERA", code: "ND", cards: 113, releaseDate: "2001-06-04", symbol: "🔍" },
  { id: "neo3", name: "Néo Révélation", nameEn: "Neo Revelation", bloc: "NEO ERA", code: "NR", cards: 105, releaseDate: "2001-10-01", symbol: "⭐" },
  { id: "neo4", name: "Néo Destinée", nameEn: "Neo Destiny", bloc: "NEO ERA", code: "ND", cards: 113, releaseDate: "2002-02-18", symbol: "🎴" },

  // Gym Era
  { id: "gym1", name: "Gym Héros", nameEn: "Gym Heroes", bloc: "GYM ERA", code: "GH", cards: 132, releaseDate: "2000-08-11", symbol: "🏛️" },
  { id: "gym2", name: "Gym Challenge", nameEn: "Gym Challenge", bloc: "GYM ERA", code: "GC", cards: 132, releaseDate: "2000-10-16", symbol: "⚔️" },

  // E-Card Era
  { id: "ecard1", name: "Expédition", nameEn: "Expedition", bloc: "E-CARD ERA", code: "EX", cards: 165, releaseDate: "2002-09-16", symbol: "📦" },
  { id: "ecard2", name: "Aquapolis", nameEn: "Aquapolis", bloc: "E-CARD ERA", code: "AQ", cards: 147, releaseDate: "2003-03-24", symbol: "🌊" },
  { id: "ecard3", name: "Skyridge", nameEn: "Skyridge", bloc: "E-CARD ERA", code: "SR", cards: 144, releaseDate: "2003-08-14", symbol: "🏔️" },

  // Holon/RS Era
  { id: "rs1", name: "Rubis et Saphir", nameEn: "Ruby & Sapphire", bloc: "HOLON ERA", code: "RS", cards: 109, releaseDate: "2003-07-18", symbol: "💎" },
  { id: "rs2", name: "Tempête de Sable", nameEn: "Sandstorm", bloc: "HOLON ERA", code: "SS", cards: 100, releaseDate: "2003-11-07", symbol: "🌪️" },
  { id: "rs3", name: "Feu Rouge Feuille Verte", nameEn: "Fire Red Leaf Green", bloc: "HOLON ERA", code: "FR", cards: 112, releaseDate: "2004-03-22", symbol: "🌿" },
  { id: "rs4", name: "Équipe Magma vs Équipe Aqua", nameEn: "Team Magma vs Team Aqua", bloc: "HOLON ERA", code: "MA", cards: 97, releaseDate: "2004-08-01", symbol: "⚔️" },
  { id: "rs5", name: "Légendes Cachées", nameEn: "Hidden Legends", bloc: "HOLON ERA", code: "HL", cards: 101, releaseDate: "2004-11-01", symbol: "🔐" },
  { id: "rs6", name: "Émeraude", nameEn: "Emerald", bloc: "HOLON ERA", code: "EM", cards: 106, releaseDate: "2005-03-14", symbol: "💚" },
  { id: "rs7", name: "Pouvoirs Insoupçonnés", nameEn: "Unseen Forces", bloc: "HOLON ERA", code: "UF", cards: 115, releaseDate: "2005-05-01", symbol: "👁️" },
  { id: "rs8", name: "Espèces Delta", nameEn: "Delta Species", bloc: "HOLON ERA", code: "DS", cards: 113, releaseDate: "2005-09-01", symbol: "Δ" },
  { id: "rs9", name: "Créateur de Légendes", nameEn: "Legend Maker", bloc: "HOLON ERA", code: "LM", cards: 92, releaseDate: "2006-02-27", symbol: "🗿" },
  { id: "rs10", name: "Fantômes de Holon", nameEn: "Holon Phantoms", bloc: "HOLON ERA", code: "HP", cards: 110, releaseDate: "2006-05-01", symbol: "👻" },
  { id: "rs11", name: "Gardiens de Cristal", nameEn: "Crystal Guardians", bloc: "HOLON ERA", code: "CG", cards: 100, releaseDate: "2006-08-23", symbol: "🔷" },
  { id: "rs12", name: "Frontière du Dragon", nameEn: "Dragon Frontiers", bloc: "HOLON ERA", code: "DF", cards: 101, releaseDate: "2006-11-22", symbol: "🐉" },
  { id: "rs13", name: "Gardiens du Pouvoir", nameEn: "Power Keepers", bloc: "HOLON ERA", code: "PK", cards: 108, releaseDate: "2007-02-14", symbol: "⚡" },

  // Diamond & Pearl Era
  { id: "dp1", name: "Diamant et Perle", nameEn: "Diamond & Pearl", bloc: "DIAMANT ET PERLE", code: "DP", cards: 130, releaseDate: "2006-10-20", symbol: "💎" },
  { id: "dp2", name: "Trésors Mystérieux", nameEn: "Mysterious Treasures", bloc: "DIAMANT ET PERLE", code: "MT", cards: 123, releaseDate: "2006-11-22", symbol: "💰" },
  { id: "dp3", name: "Secrets Merveilleux", nameEn: "Secret Wonders", bloc: "DIAMANT ET PERLE", code: "SW", cards: 132, releaseDate: "2007-05-23", symbol: "✨" },
  { id: "dp4", name: "Grande Rencontres", nameEn: "Great Encounters", bloc: "DIAMANT ET PERLE", code: "GE", cards: 106, releaseDate: "2007-11-07", symbol: "🤝" },
  { id: "dp5", name: "Aube Majestueuse", nameEn: "Majestic Dawn", bloc: "DIAMANT ET PERLE", code: "MD", cards: 100, releaseDate: "2008-05-21", symbol: "🌅" },
  { id: "dp6", name: "Légendes Éveillées", nameEn: "Legends Awakened", bloc: "DIAMANT ET PERLE", code: "LA", cards: 146, releaseDate: "2008-08-20", symbol: "🌪️" },
  { id: "dp7", name: "Tempête Ardente", nameEn: "Stormfront", bloc: "DIAMANT ET PERLE", code: "SF", cards: 100, releaseDate: "2008-11-05", symbol: "⛈️" },
  { id: "dp8", name: "Platine", nameEn: "Platinum", bloc: "DIAMANT ET PERLE", code: "PL", cards: 127, releaseDate: "2009-02-04", symbol: "⚪" },
  { id: "dp9", name: "Rivaux Émergents", nameEn: "Rising Rivals", bloc: "DIAMANT ET PERLE", code: "RR", cards: 111, releaseDate: "2009-05-20", symbol: "📈" },
  { id: "dp10", name: "Victoires Suprêmes", nameEn: "Supreme Victors", bloc: "DIAMANT ET PERLE", code: "SV", cards: 147, releaseDate: "2009-08-19", symbol: "🏆" },
  { id: "dp11", name: "Arceus", nameEn: "Arceus", bloc: "DIAMANT ET PERLE", code: "AR", cards: 99, releaseDate: "2009-11-04", symbol: "⭐" },

  // HeartGold & SoulSilver Era
  { id: "hgss1", name: "HeartGold & SoulSilver", nameEn: "HeartGold & SoulSilver", bloc: "HEARTGOLD ET SOULSILVER", code: "HS", cards: 123, releaseDate: "2009-10-16", symbol: "💛" },
  { id: "hgss2", name: "Déchaîné", nameEn: "Unleashed", bloc: "HEARTGOLD ET SOULSILVER", code: "UL", cards: 95, releaseDate: "2010-02-10", symbol: "🔥" },
  { id: "hgss3", name: "Imparable", nameEn: "Undaunted", bloc: "HEARTGOLD ET SOULSILVER", code: "UD", cards: 90, releaseDate: "2010-08-25", symbol: "💪" },
  { id: "hgss4", name: "Triomphant", nameEn: "Triumphant", bloc: "HEARTGOLD ET SOULSILVER", code: "TM", cards: 102, releaseDate: "2010-11-03", symbol: "🎊" },

  // Black & White Era
  { id: "bw1", name: "Noir et Blanc", nameEn: "Black & White", bloc: "NOIR ET BLANC", code: "BW", cards: 114, releaseDate: "2010-12-15", symbol: "⚫" },
  { id: "bw2", name: "Pouvoirs Émergents", nameEn: "Emerging Powers", bloc: "NOIR ET BLANC", code: "EP", cards: 98, releaseDate: "2011-02-09", symbol: "⚡" },
  { id: "bw3", name: "Victoires Nobles", nameEn: "Noble Victories", bloc: "NOIR ET BLANC", code: "NV", cards: 101, releaseDate: "2011-08-31", symbol: "👑" },
  { id: "bw4", name: "Destinées Suivantes", nameEn: "Next Destinies", bloc: "NOIR ET BLANC", code: "ND", cards: 99, releaseDate: "2012-02-08", symbol: "🎯" },
  { id: "bw5", name: "Explorateurs Noirs", nameEn: "Dark Explorers", bloc: "NOIR ET BLANC", code: "DE", cards: 108, releaseDate: "2012-05-09", symbol: "🌑" },
  { id: "bw6", name: "Dragons Exaltés", nameEn: "Dragons Exalted", bloc: "NOIR ET BLANC", code: "DX", cards: 124, releaseDate: "2012-08-15", symbol: "🐉" },
  { id: "bw7", name: "Frontières Traversées", nameEn: "Boundaries Crossed", bloc: "NOIR ET BLANC", code: "BC", cards: 149, releaseDate: "2012-11-07", symbol: "🚧" },
  { id: "bw8", name: "Tempête Plasma", nameEn: "Plasma Storm", bloc: "NOIR ET BLANC", code: "PS", cards: 135, releaseDate: "2013-02-06", symbol: "⚡" },
  { id: "bw9", name: "Gel Plasma", nameEn: "Plasma Freeze", bloc: "NOIR ET BLANC", code: "PF", cards: 116, releaseDate: "2013-05-08", symbol: "❄️" },
  { id: "bw10", name: "Explosion Plasma", nameEn: "Plasma Blast", bloc: "NOIR ET BLANC", code: "PB", cards: 101, releaseDate: "2013-08-14", symbol: "💥" },

  // XY Era
  { id: "xy1", name: "XY", nameEn: "XY", bloc: "XY", code: "XY", cards: 146, releaseDate: "2013-10-12", symbol: "✖️" },
  { id: "xy2", name: "Étincelles Flamboyantes", nameEn: "Flashfire", bloc: "XY", code: "FF", cards: 106, releaseDate: "2014-02-05", symbol: "🔥" },
  { id: "xy3", name: "Poings Furieux", nameEn: "Furious Fists", bloc: "XY", code: "FF", cards: 111, releaseDate: "2014-05-07", symbol: "👊" },
  { id: "xy4", name: "Forces Fantômes", nameEn: "Phantom Forces", bloc: "XY", code: "PF", cards: 119, releaseDate: "2014-08-20", symbol: "👻" },
  { id: "xy5", name: "Choc Primordial", nameEn: "Primal Clash", bloc: "XY", code: "PC", cards: 160, releaseDate: "2014-11-05", symbol: "🌊" },
  { id: "xy6", name: "Cieux Rugissants", nameEn: "Roaring Skies", bloc: "XY", code: "RS", cards: 108, releaseDate: "2015-02-04", symbol: "🦅" },
  { id: "xy7", name: "Cris Anciens", nameEn: "Ancient Roar", bloc: "XY", code: "AR", cards: 98, releaseDate: "2015-05-06", symbol: "🦣" },
  { id: "xy8", name: "Percée", nameEn: "Breakthrough", bloc: "XY", code: "BKT", cards: 162, releaseDate: "2015-08-12", symbol: "⚡" },
  { id: "xy9", name: "Point de Rupture", nameEn: "BREAKpoint", bloc: "XY", code: "BKP", cards: 122, releaseDate: "2015-11-04", symbol: "💥" },
  { id: "xy-gen", name: "Générations", nameEn: "Generations", bloc: "XY", code: "GEN", cards: 83, releaseDate: "2015-02-22", symbol: "🎮" },
  { id: "xy10", name: "Destins Entrelacés", nameEn: "Fates Collide", bloc: "XY", code: "FC", cards: 116, releaseDate: "2016-05-02", symbol: "⚡" },
  { id: "xy11", name: "Siège de Vapeur", nameEn: "Steam Siege", bloc: "XY", code: "STS", cards: 114, releaseDate: "2016-08-22", symbol: "⚙️" },
  { id: "xy-ev", name: "Évolutions", nameEn: "Evolutions", bloc: "XY", code: "EVS", cards: 108, releaseDate: "2016-11-02", symbol: "📈" },

  // Sun & Moon Era
  { id: "sm1", name: "Soleil et Lune", nameEn: "Sun & Moon", bloc: "SOLEIL ET LUNE", code: "SM", cards: 149, releaseDate: "2016-11-18", symbol: "☀️" },
  { id: "sm2", name: "Gardiens Ascendants", nameEn: "Guardians Rising", bloc: "SOLEIL ET LUNE", code: "GRI", cards: 145, releaseDate: "2017-05-01", symbol: "🛡️" },
  { id: "sm3", name: "Ombres Brûlantes", nameEn: "Burning Shadows", bloc: "SOLEIL ET LUNE", code: "BUS", cards: 147, releaseDate: "2017-08-04", symbol: "🔥" },
  { id: "sm4", name: "Invasion Écarlate", nameEn: "Crimson Invasion", bloc: "SOLEIL ET LUNE", code: "CIN", cards: 111, releaseDate: "2017-11-03", symbol: "🔴" },
  { id: "sm5", name: "Ultra-Prisme", nameEn: "Ultra Prism", bloc: "SOLEIL ET LUNE", code: "UPR", cards: 156, releaseDate: "2018-02-02", symbol: "💜" },
  { id: "sm6", name: "Lumière Interdite", nameEn: "Forbidden Light", bloc: "SOLEIL ET LUNE", code: "FLI", cards: 131, releaseDate: "2018-05-04", symbol: "🚫" },
  { id: "sm7", name: "Tempête Céleste", nameEn: "Celestial Storm", bloc: "SOLEIL ET LUNE", code: "CES", cards: 183, releaseDate: "2018-08-03", symbol: "⛈️" },
  { id: "sm8", name: "Tonnerre Perdu", nameEn: "Lost Thunder", bloc: "SOLEIL ET LUNE", code: "LOT", cards: 236, releaseDate: "2018-11-02", symbol: "⚡" },
  { id: "sm9", name: "Travail d'Équipe", nameEn: "Team Up", bloc: "SOLEIL ET LUNE", code: "TEU", cards: 196, releaseDate: "2019-02-01", symbol: "🤝" },
  { id: "sm10", name: "Liens Indestructibles", nameEn: "Unbroken Bonds", bloc: "SOLEIL ET LUNE", code: "UNB", cards: 234, releaseDate: "2019-05-03", symbol: "🔗" },
  { id: "sm11", name: "Esprits Unifiés", nameEn: "Unified Minds", bloc: "SOLEIL ET LUNE", code: "UNM", cards: 258, releaseDate: "2019-08-02", symbol: "🧠" },
  { id: "sm12", name: "Éclipse Cosmique", nameEn: "Cosmic Eclipse", bloc: "SOLEIL ET LUNE", code: "CEC", cards: 271, releaseDate: "2019-11-01", symbol: "🌌" },

  // Sword & Shield Era
  { id: "swsh1", name: "Épée et Bouclier", nameEn: "Sword & Shield", bloc: "EPEE ET BOUCLIER", code: "SSH", cards: 216, releaseDate: "2020-02-07", symbol: "⚔️" },
  { id: "swsh2", name: "Rébellion Rebelle", nameEn: "Rebel Clash", bloc: "EPEE ET BOUCLIER", code: "RCL", cards: 209, releaseDate: "2020-05-01", symbol: "🔥" },
  { id: "swsh3", name: "Obscurité Embrasée", nameEn: "Darkness Ablaze", bloc: "EPEE ET BOUCLIER", code: "DAA", cards: 201, releaseDate: "2020-08-14", symbol: "🌑" },
  { id: "swsh4", name: "Tension Vivante", nameEn: "Vivid Voltage", bloc: "EPEE ET BOUCLIER", code: "VIV", cards: 203, releaseDate: "2020-11-13", symbol: "⚡" },
  { id: "swsh5", name: "Styles de Combat", nameEn: "Battle Styles", bloc: "EPEE ET BOUCLIER", code: "BST", cards: 183, releaseDate: "2021-03-19", symbol: "🥊" },
  { id: "swsh6", name: "Règne Glacial", nameEn: "Chilling Reign", bloc: "EPEE ET BOUCLIER", code: "CRE", cards: 233, releaseDate: "2021-06-18", symbol: "❄️" },
  { id: "swsh7", name: "Cieux Évolutifs", nameEn: "Evolving Skies", bloc: "EPEE ET BOUCLIER", code: "EVS", cards: 237, releaseDate: "2021-08-27", symbol: "🌤️" },
  { id: "swsh8", name: "Fusion Frappe", nameEn: "Fusion Strike", bloc: "EPEE ET BOUCLIER", code: "FST", cards: 284, releaseDate: "2021-11-12", symbol: "💥" },
  { id: "swsh45", name: "Célébrations", nameEn: "Celebrations", bloc: "EPEE ET BOUCLIER", code: "CEL", cards: 102, releaseDate: "2021-10-08", symbol: "🎉" },
  { id: "swsh9", name: "Étoiles Brillantes", nameEn: "Brilliant Stars", bloc: "EPEE ET BOUCLIER", code: "BRS", cards: 186, releaseDate: "2022-02-25", symbol: "⭐" },
  { id: "swsh10", name: "Pokémon GO", nameEn: "Pokémon GO", bloc: "EPEE ET BOUCLIER", code: "PGO", cards: 78, releaseDate: "2022-07-01", symbol: "📍" },
  { id: "swsh11", name: "Origines Perdues", nameEn: "Lost Origin", bloc: "EPEE ET BOUCLIER", code: "LOR", cards: 217, releaseDate: "2022-09-09", symbol: "👻" },
  { id: "swsh12", name: "Tempête Argentée", nameEn: "Silver Tempest", bloc: "EPEE ET BOUCLIER", code: "SIT", cards: 215, releaseDate: "2022-11-11", symbol: "🌪️" },
  { id: "swsh12pt5", name: "Zénith Suprême", nameEn: "Crown Zenith", bloc: "EPEE ET BOUCLIER", code: "CRZ", cards: 230, releaseDate: "2023-01-20", symbol: "👑" },

  // Scarlet & Violet Era
  { id: "sv1", name: "Obsidienne Enflammée", nameEn: "Obsidian Flames", bloc: "ECARLATE ET VIOLET", code: "OBF", cards: 230, releaseDate: "2023-08-11", symbol: "🔥" },
  { id: "sv2", name: "Série Base Écarlate et Violet", nameEn: "Scarlet & Violet Base", bloc: "ECARLATE ET VIOLET", code: "SVI", cards: 258, releaseDate: "2023-03-31", symbol: "🟥" },
  { id: "sv3pt5", name: "151", nameEn: "151", bloc: "ECARLATE ET VIOLET", code: "MEW", cards: 207, releaseDate: "2023-09-22", symbol: "🔴" },
  { id: "sv4", name: "Fissures Paradoxales", nameEn: "Paradox Rift", bloc: "ECARLATE ET VIOLET", code: "PAR", cards: 266, releaseDate: "2023-11-03", symbol: "🌀" },
  { id: "sv5", name: "Évolutions à Paldea", nameEn: "Paldea Evolved", bloc: "ECARLATE ET VIOLET", code: "PAL", cards: 279, releaseDate: "2023-06-09", symbol: "💜" },
  { id: "sv6", name: "Mascarade Crépusculaire", nameEn: "Twilight Masquerade", bloc: "ECARLATE ET VIOLET", code: "TWM", cards: 226, releaseDate: "2024-05-24", symbol: "🎭" },
  { id: "sv7", name: "Couronne Stellaire", nameEn: "Stellar Crown", bloc: "ECARLATE ET VIOLET", code: "SCR", cards: 175, releaseDate: "2024-09-13", symbol: "👑" },
  { id: "sv8", name: "Flammes Déferlantes", nameEn: "Surging Sparks", bloc: "ECARLATE ET VIOLET", code: "SSP", cards: 252, releaseDate: "2024-11-08", symbol: "⚡" },
  { id: "sv8pt5", name: "Failles Temporelles", nameEn: "Temporal Forces", bloc: "ECARLATE ET VIOLET", code: "TEF", cards: 218, releaseDate: "2024-03-22", symbol: "⏱️" },
  { id: "sv9", name: "Destins de Paldea", nameEn: "Paldean Fates", bloc: "ECARLATE ET VIOLET", code: "PAF", cards: 245, releaseDate: "2024-01-26", symbol: "✨" },
  { id: "sv9-base", name: "Évolutions Prismatiques", nameEn: "Prismatic Evolutions", bloc: "ECARLATE ET VIOLET", code: "PRE", cards: 193, releaseDate: "2025-01-17", symbol: "💎" },
  { id: "sv9-jtg", name: "Aventures Ensemble", nameEn: "Journey Together", bloc: "ECARLATE ET VIOLET", code: "JTG", cards: 190, releaseDate: "2025-03-28", symbol: "🚂" },
  { id: "sv10", name: "Rivalités Destinées", nameEn: "Destined Rivals", bloc: "ECARLATE ET VIOLET", code: "DRI", cards: 244, releaseDate: "2025-05-30", symbol: "🆚" },
  { id: "sv10-5a", name: "Foudre Noire", nameEn: "Black Bolt", bloc: "ECARLATE ET VIOLET", code: "BLK", cards: 172, releaseDate: "2025-07-18", symbol: "⚫" },
  { id: "sv10-5b", name: "Flamme Blanche", nameEn: "White Flare", bloc: "ECARLATE ET VIOLET", code: "WHT", cards: 173, releaseDate: "2025-07-18", symbol: "⚪" },

  // Mega Evolution (2026)
  { id: "me2pt5", name: "Héros Transcendants", nameEn: "Ascended Heroes", bloc: "MEGA EVOLUTION", code: "ME02.5", cards: 295, releaseDate: "2026-01-30", symbol: "🕊️" },
  { id: "me03", name: "Équilibre Parfait", nameEn: "Perfect Order", bloc: "MEGA EVOLUTION", code: "ME03", cards: 124, releaseDate: "2026-03-27", symbol: "⚖️" },
  { id: "me04", name: "Chaos Ascendant", nameEn: "Chaos Rising", bloc: "MEGA EVOLUTION", code: "ME04", cards: 122, releaseDate: "2026-05-22", symbol: "🔱" },
  { id: "me05", name: "Nuit Noire", nameEn: "Pitch Black", bloc: "MEGA EVOLUTION", code: "ME05", cards: 115, releaseDate: "2026-07-17", symbol: "⚫" },
  { id: "me-30th", name: "30ème Célébration", nameEn: "30th Celebration", bloc: "MEGA EVOLUTION", code: "30TH", cards: 150, releaseDate: "2026-09-16", symbol: "🎂" },
  { id: "me06", name: "Règne Delta", nameEn: "Delta Reign", bloc: "MEGA EVOLUTION", code: "ME06", cards: 130, releaseDate: "2026-11-06", symbol: "Δ" },
];

const BLOCS = ["Tous", "MEGA EVOLUTION", "BASE SET ERA", "NEO ERA", "GYM ERA", "E-CARD ERA", "HOLON ERA", "DIAMANT ET PERLE", "HEARTGOLD ET SOULSILVER", "NOIR ET BLANC", "XY", "SOLEIL ET LUNE", "EPEE ET BOUCLIER", "ECARLATE ET VIOLET"];

function blocClass(b: string) {
  if (b.includes("BASE")) return "bs";
  if (b.includes("NEO")) return "neo";
  if (b.includes("GYM")) return "gym";
  if (b.includes("E-CARD")) return "ec";
  if (b.includes("HOLON")) return "hl";
  if (b.includes("DIAMANT")) return "dp";
  if (b.includes("HEARTGOLD")) return "hgss";
  if (b.includes("NOIR")) return "bw";
  if (b.includes("XY")) return "xy";
  if (b.includes("SOLEIL")) return "sl";
  if (b.includes("EPEE")) return "eb";
  if (b.includes("ECARLATE")) return "ev";
  return "other";
}

function blocLabel(b: string) {
  if (b.includes("BASE")) return "Base Set";
  if (b.includes("NEO")) return "Ère Neo";
  if (b.includes("GYM")) return "Ère Gym";
  if (b.includes("E-CARD")) return "Ère E-Card";
  if (b.includes("HOLON")) return "Ère Holon";
  if (b.includes("DIAMANT")) return "Diamant et Perle";
  if (b.includes("HEARTGOLD")) return "HeartGold et SoulSilver";
  if (b.includes("NOIR")) return "Noir et Blanc";
  if (b.includes("XY")) return "XY";
  if (b.includes("SOLEIL")) return "Soleil et Lune";
  if (b.includes("EPEE")) return "Épée et Bouclier";
  if (b.includes("ECARLATE")) return "Écarlate et Violet";
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
          {BLOCS.map(b => {
            let abbr = b;
            if (b === "Tous") abbr = "Tous";
            else if (b === "MEGA EVOLUTION") abbr = "ME";
            else if (b === "BASE SET ERA") abbr = "BS";
            else if (b === "NEO ERA") abbr = "NEO";
            else if (b === "GYM ERA") abbr = "GYM";
            else if (b === "E-CARD ERA") abbr = "EC";
            else if (b === "HOLON ERA") abbr = "HL";
            else if (b === "DIAMANT ET PERLE") abbr = "DP";
            else if (b === "HEARTGOLD ET SOULSILVER") abbr = "HGSS";
            else if (b === "NOIR ET BLANC") abbr = "BW";
            else if (b === "XY") abbr = "XY";
            else if (b === "SOLEIL ET LUNE") abbr = "SL";
            else if (b === "EPEE ET BOUCLIER") abbr = "EB";
            else if (b === "ECARLATE ET VIOLET") abbr = "EV";

            return (
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
                {abbr}
              </button>
            );
          })}
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
