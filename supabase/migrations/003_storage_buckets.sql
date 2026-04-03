-- =============================================================================
-- Migration 003 : Storage buckets et policies
-- Intent : Gérer les photos patrimoniales et les brouillons hors-ligne.
--          'heritage-photos' : bucket public, photos des fiches publiées.
--          'draft-photos'    : bucket privé, photos de brouillons offline
--                             (sync V1.1), accessibles uniquement par le
--                             propriétaire via metadata user_id.
-- Auteur : backend-dev Sprint 1
-- Date   : 2026-03-30
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Bucket heritage-photos : photos des fiches patrimoniales publiées
-- Intent : Accès en lecture public pour affichage sur la carte sans auth.
--          Écriture réservée aux utilisateurs authentifiés.
--          Suppression réservée au propriétaire du fichier.
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'heritage-photos',
  'heritage-photos',
  true,
  10485760,  -- 10 MB max par photo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique : les photos des fiches publiées sont visibles sans connexion
CREATE POLICY "heritage_photos_select_public"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'heritage-photos');

-- Upload réservé aux utilisateurs authentifiés
-- Convention de nommage : {user_id}/{heritage_item_id}/{filename}
CREATE POLICY "heritage_photos_insert_authenticated"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'heritage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Mise à jour réservée au propriétaire du fichier (premier segment du path)
CREATE POLICY "heritage_photos_update_owner"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'heritage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Suppression réservée au propriétaire du fichier
CREATE POLICY "heritage_photos_delete_owner"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'heritage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- Bucket draft-photos : photos de brouillons (mode offline V1.1)
-- Intent : Bucket privé. Les photos uploadées hors ligne sont stockées ici
--          avant publication. Seul le propriétaire y accède, identifié par
--          le premier segment du path ({user_id}/...).
--          Lors de la publication de la fiche, les photos sont déplacées
--          vers heritage-photos via Edge Function de sync.
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'draft-photos',
  'draft-photos',
  false,
  10485760,  -- 10 MB max par photo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Lecture réservée au propriétaire : aucune photo de brouillon n'est publique
CREATE POLICY "draft_photos_select_owner"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'draft-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Upload réservé au propriétaire dans son propre répertoire
CREATE POLICY "draft_photos_insert_owner"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'draft-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Mise à jour réservée au propriétaire
CREATE POLICY "draft_photos_update_owner"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'draft-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Suppression réservée au propriétaire
-- Intent : nettoyage post-sync lors de la publication de la fiche
CREATE POLICY "draft_photos_delete_owner"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'draft-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
