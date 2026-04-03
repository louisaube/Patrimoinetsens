-- =============================================================================
-- Migration 002 : Row Level Security policies
-- Intent : Appliquer le principe fondamental métier au niveau base de données.
--          "Un utilisateur ne peut modifier que ses propres contributions."
--          La modération porte sur le contenu inapproprié, jamais sur la
--          véracité historique.
--          Toute politique est nommée explicitement pour faciliter l'audit.
-- Auteur : backend-dev Sprint 1
-- Date   : 2026-03-30
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Activation RLS sur les trois tables
-- Intent : Sans cette activation, toutes les policies sont ignorées.
--          Par défaut après activation, DENY ALL pour tout rôle.
-- -----------------------------------------------------------------------------

ALTER TABLE heritage_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports         ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Policies : heritage_items
-- =============================================================================

-- Lecture publique des items publiés : la carte est accessible sans connexion
CREATE POLICY "heritage_items_select_public_published"
  ON heritage_items
  FOR SELECT
  USING (status = 'publie');

-- Un utilisateur connecté voit aussi ses propres brouillons
CREATE POLICY "heritage_items_select_own_drafts"
  ON heritage_items
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Création réservée aux utilisateurs authentifiés
-- La colonne created_by est forcée à auth.uid() côté application,
-- mais le CHECK ici est la défense en profondeur.
CREATE POLICY "heritage_items_insert_authenticated"
  ON heritage_items
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Modification réservée au créateur de la fiche conteneur
-- Intent : seul le créateur de l'item peut changer le titre, la catégorie,
--          le statut ou la photo de couverture. Les autres enrichissent via contributions.
CREATE POLICY "heritage_items_update_owner_only"
  ON heritage_items
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Suppression réservée au créateur
-- Intent : ON DELETE CASCADE dans contributions protège l'intégrité.
CREATE POLICY "heritage_items_delete_owner_only"
  ON heritage_items
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- =============================================================================
-- Policies : contributions
-- Intent critique : chaque auteur est souverain sur ses propres contributions.
--                  Denis ne peut pas modifier le récit de Bernard et vice-versa.
--                  La modération (service role) contourne RLS au niveau infra.
-- =============================================================================

-- Lecture publique des contributions dont l'item parent est publié
-- Intent : on ne lit pas une contribution orpheline ou sur item brouillon
CREATE POLICY "contributions_select_public_via_published_item"
  ON contributions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM heritage_items hi
      WHERE hi.id = contributions.heritage_item_id
        AND hi.status = 'publie'
    )
  );

-- Un auteur connecté voit toutes ses contributions, y compris sur items brouillons
CREATE POLICY "contributions_select_own"
  ON contributions
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Création réservée aux utilisateurs authentifiés
CREATE POLICY "contributions_insert_authenticated"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

-- Règle absolue : seul l'auteur peut modifier SA contribution
-- Aucun autre utilisateur, même administrateur applicatif, ne contourne cette règle.
-- La modération passe par le service role Supabase (hors RLS), jamais par cette policy.
CREATE POLICY "contributions_update_author_only"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Règle absolue : seul l'auteur peut supprimer SA contribution
CREATE POLICY "contributions_delete_author_only"
  ON contributions
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- =============================================================================
-- Policies : reports
-- Intent : Les signalements sont publics pour la transparence citoyenne.
--          Le reporter peut corriger son signalement avant traitement.
--          La mise à jour du statut (en_cours, resolu) est faite par service role.
-- =============================================================================

-- Lecture publique de tous les signalements
-- Intent : transparence sur l'état du patrimoine local
CREATE POLICY "reports_select_public"
  ON reports
  FOR SELECT
  USING (true);

-- Création réservée aux utilisateurs authentifiés
CREATE POLICY "reports_insert_authenticated"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Le reporter peut modifier son signalement (description, photos, sévérité)
-- tant qu'il est en statut "soumis" — la logique de statut est appliquée
-- côté applicatif et via service role pour les transitions d'état.
CREATE POLICY "reports_update_reporter_own"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (reporter_id = auth.uid())
  WITH CHECK (reporter_id = auth.uid());
