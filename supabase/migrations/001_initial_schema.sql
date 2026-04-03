-- =============================================================================
-- Migration 001 : Schéma initial Patrimoine & Sens
-- Intent : Créer la structure de données fondamentale du MVP.
--          heritage_items est un conteneur géolocalisé.
--          contributions est le contenu typé, signé par son auteur.
--          reports gère les signalements citoyens (dégradation, danger, disparition).
-- Auteur : backend-dev Sprint 1
-- Date   : 2026-03-30
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums : domaines métier fermés
-- -----------------------------------------------------------------------------

-- Les quatre catégories patrimoniales du périmètre MVP + échappatoire "autre"
CREATE TYPE category_enum AS ENUM (
  'batiment_historique',
  'edifice_religieux',
  'mobilier_urbain',
  'patrimoine_naturel',
  'autre'
);

-- Cycle de vie d'une fiche patrimoine
CREATE TYPE item_status_enum AS ENUM (
  'brouillon',   -- visible uniquement par le créateur
  'publie',      -- visible publiquement
  'archive'      -- retiré de la consultation courante
);

-- Typologie des contributions : Denis (historique), Bernard (recit),
-- habitants (temoignage), bénévoles terrain (observation)
CREATE TYPE contribution_type_enum AS ENUM (
  'historique',   -- avec sources bibliographiques et period
  'recit',        -- anecdote narrative, récit oral
  'temoignage',   -- témoignage personnel daté
  'observation'   -- constat terrain (état, photo, mesure)
);

-- Nature du signalement citoyen
CREATE TYPE report_type_enum AS ENUM (
  'degradation',
  'danger',
  'disparition'
);

-- Criticité du signalement, utilisée pour la priorisation (dashboard V2)
CREATE TYPE severity_enum AS ENUM (
  'faible',
  'moyen',
  'urgent',
  'critique'
);

-- Cycle de vie d'un signalement
CREATE TYPE report_status_enum AS ENUM (
  'soumis',
  'en_cours',
  'resolu',
  'rejete'
);

-- -----------------------------------------------------------------------------
-- Fonction trigger : mise à jour automatique de updated_at
-- Intent : Garantir la traçabilité des modifications sans logique applicative.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- Table heritage_items : le conteneur patrimoine
-- Intent : Fiche géolocalisée minimaliste. Le contenu réel vient des
--          contributions. Un item peut exister sans contribution (brouillon terrain).
-- -----------------------------------------------------------------------------

CREATE TABLE heritage_items (
  id              uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      uuid              NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  title           text              NOT NULL,
  category        category_enum     NOT NULL,
  status          item_status_enum  NOT NULL DEFAULT 'brouillon',
  latitude        double precision  NOT NULL,
  longitude       double precision  NOT NULL,
  cover_photo_url text,
  created_at      timestamptz       NOT NULL DEFAULT now(),
  updated_at      timestamptz       NOT NULL DEFAULT now(),

  CONSTRAINT heritage_items_title_not_empty CHECK (trim(title) <> '')
);

COMMENT ON TABLE heritage_items IS
  'Conteneur patrimoine géolocalisé. Le contenu narratif est dans contributions.';
COMMENT ON COLUMN heritage_items.created_by IS
  'Auteur de la fiche. Seul lui peut modifier le conteneur (RLS).';
COMMENT ON COLUMN heritage_items.status IS
  'Brouillon = visible créateur seul. Publie = public. Archive = hors consultation.';

CREATE TRIGGER trg_heritage_items_updated_at
  BEFORE UPDATE ON heritage_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- Table contributions : le contenu typé signé
-- Intent : Chaque contribution appartient à son auteur et ne peut être modifiée
--          que par lui. Denis et Bernard coexistent sur le même item sans
--          interférence. ON DELETE CASCADE préserve la cohérence si l'item
--          parent est supprimé.
-- -----------------------------------------------------------------------------

CREATE TABLE contributions (
  id                uuid                    PRIMARY KEY DEFAULT gen_random_uuid(),
  heritage_item_id  uuid                    NOT NULL REFERENCES heritage_items(id) ON DELETE CASCADE,
  author_id         uuid                    NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  contribution_type contribution_type_enum  NOT NULL,
  title             text,
  body              text                    NOT NULL,
  -- Champs spécifiques type "historique" (Denis le médiéviste)
  sources           text[],
  period            text,
  -- Champ spécifique type "recit" (Bernard, Marie audio)
  audio_url         text,
  created_at        timestamptz             NOT NULL DEFAULT now(),
  updated_at        timestamptz             NOT NULL DEFAULT now(),

  CONSTRAINT contributions_body_not_empty CHECK (trim(body) <> '')
);

COMMENT ON TABLE contributions IS
  'Contenu typé signé par son auteur. Règle absolue : seul l auteur peut modifier sa contribution.';
COMMENT ON COLUMN contributions.sources IS
  'Bibliographie pour les contributions de type historique (usage Denis).';
COMMENT ON COLUMN contributions.period IS
  'Période historique en texte libre (ex: "XIIe siècle", "1150-1240").';
COMMENT ON COLUMN contributions.audio_url IS
  'URL Storage du fichier audio pour les récits oraux (V1.1 Whisper).';

CREATE TRIGGER trg_contributions_updated_at
  BEFORE UPDATE ON contributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- Table reports : signalements citoyens
-- Intent : Permettre à Claire de signaler en 2 clics une dégradation.
--          heritage_item_id est nullable : on peut signaler un danger sans
--          qu'une fiche patrimoine existe encore.
-- -----------------------------------------------------------------------------

CREATE TABLE reports (
  id                uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id       uuid                NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  heritage_item_id  uuid                REFERENCES heritage_items(id) ON DELETE SET NULL,
  report_type       report_type_enum    NOT NULL,
  description       text                NOT NULL,
  severity          severity_enum       NOT NULL,
  status            report_status_enum  NOT NULL DEFAULT 'soumis',
  photos            text[],
  latitude          double precision    NOT NULL,
  longitude         double precision    NOT NULL,
  created_at        timestamptz         NOT NULL DEFAULT now(),
  updated_at        timestamptz         NOT NULL DEFAULT now(),

  CONSTRAINT reports_description_not_empty CHECK (trim(description) <> '')
);

COMMENT ON TABLE reports IS
  'Signalements citoyens géolocalisés. heritage_item_id nullable : signalement possible sans fiche existante.';
COMMENT ON COLUMN reports.severity IS
  'Criticité utilisée pour priorisation dans le dashboard municipal (V2 P3).';

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- Index : performances des requêtes métier les plus fréquentes
-- Intent : Filtrage par catégorie/statut pour la carte, lookups par auteur
--          pour les tableaux de bord personnels.
-- -----------------------------------------------------------------------------

CREATE INDEX idx_heritage_items_category ON heritage_items(category);
CREATE INDEX idx_heritage_items_status   ON heritage_items(status);

CREATE INDEX idx_contributions_heritage_item_id ON contributions(heritage_item_id);
CREATE INDEX idx_contributions_author_id        ON contributions(author_id);

CREATE INDEX idx_reports_heritage_item_id ON reports(heritage_item_id);
CREATE INDEX idx_reports_reporter_id      ON reports(reporter_id);
