-- ============================================================
-- PokéInvest — Schema Supabase
-- Exécuter ce fichier dans l'éditeur SQL de Supabase
-- ============================================================

-- TABLE cartes_unite
CREATE TABLE IF NOT EXISTS cartes_unite (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  carte text NOT NULL,
  numero text NOT NULL,
  bloc text NOT NULL DEFAULT 'Inconnu',
  serie text NOT NULL,
  prix_achat numeric(10,2) NOT NULL DEFAULT 0,
  cote numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE cartes_unite ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own cartes_unite" ON cartes_unite
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TABLE cartes_pca
CREATE TABLE IF NOT EXISTS cartes_pca (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  carte text NOT NULL,
  numero text NOT NULL,
  bloc text NOT NULL DEFAULT 'Inconnu',
  serie text NOT NULL,
  note text NOT NULL DEFAULT '-',
  prix_achat numeric(10,2) NOT NULL DEFAULT 0,
  cote numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE cartes_pca ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own cartes_pca" ON cartes_pca
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TABLE items_scelles
CREATE TABLE IF NOT EXISTS items_scelles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  produit text NOT NULL,
  bloc text NOT NULL DEFAULT 'Inconnu',
  serie text NOT NULL,
  type text NOT NULL DEFAULT 'Autre',
  quantite integer NOT NULL DEFAULT 1,
  prix_achat numeric(10,2) NOT NULL DEFAULT 0,
  cote numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE items_scelles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own items_scelles" ON items_scelles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TABLE mastersets
CREATE TABLE IF NOT EXISTS mastersets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom text NOT NULL,
  bloc text NOT NULL DEFAULT 'Inconnu',
  serie text NOT NULL,
  cartes_possedees integer NOT NULL DEFAULT 0,
  cartes_total integer NOT NULL DEFAULT 0,
  prix_achat numeric(10,2) NOT NULL DEFAULT 0,
  cote numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mastersets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own mastersets" ON mastersets
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
