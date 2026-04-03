-- =============================================================================
-- Migration 0001 — Champs période sur heritage_items
-- Intent : Ajouter period_start et period_end pour permettre le filtrage
--          par siècle/ère (Marie veut voir tous les éléments du XIIe siècle).
--          Colonnes nullable : une fiche peut exister sans datation connue.
-- =============================================================================

ALTER TABLE heritage_items
  ADD COLUMN IF NOT EXISTS period_start integer,
  ADD COLUMN IF NOT EXISTS period_end   integer;

-- Index partiel pour les requêtes de filtrage par plage temporelle
-- (uniquement sur les lignes avec une période renseignée)
CREATE INDEX IF NOT EXISTS idx_heritage_items_period
  ON heritage_items (period_start, period_end)
  WHERE period_start IS NOT NULL;

COMMENT ON COLUMN heritage_items.period_start IS
  'Début de la période historique en années (ex: 1100 = XIIe s., -50 = 50 av. J.-C.)';
COMMENT ON COLUMN heritage_items.period_end IS
  'Fin de la période historique en années. NULL = jusqu''à aujourd''hui ou inconnu.';
