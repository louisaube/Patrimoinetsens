# Sprint 1 : Data Model + Contributions + Carte

## Objectif
Livrer le socle : schéma DB avec modèle contributions, authentification,
création de fiches et contributions, visualisation carte.

## Tâches

### Backend (backend-dev)

1. Migration 001_initial_schema.sql :

   Table heritage_items (conteneur) :
   - id uuid PK default gen_random_uuid()
   - created_by uuid FK auth.users
   - title text NOT NULL
   - category category_enum NOT NULL
   - status item_status_enum NOT NULL DEFAULT 'brouillon'
   - latitude double precision NOT NULL
   - longitude double precision NOT NULL
   - cover_photo_url text (photo d'illustration)
   - created_at timestamptz DEFAULT now()
   - updated_at timestamptz DEFAULT now()

   Table contributions :
   - id uuid PK default gen_random_uuid()
   - heritage_item_id uuid FK heritage_items NOT NULL
   - author_id uuid FK auth.users NOT NULL
   - contribution_type contribution_type_enum NOT NULL
   - title text
   - body text NOT NULL
   - sources text[] (pour type historique)
   - period text (pour type historique, ex: "XIIe siècle")
   - audio_url text (nullable, prévu V1.1)
   - created_at timestamptz DEFAULT now()
   - updated_at timestamptz DEFAULT now()

   Table reports :
   - id uuid PK default gen_random_uuid()
   - reporter_id uuid FK auth.users NOT NULL
   - heritage_item_id uuid FK heritage_items (nullable)
   - report_type report_type_enum NOT NULL
   - description text NOT NULL
   - severity severity_enum NOT NULL
   - status report_status_enum NOT NULL DEFAULT 'soumis'
   - photos text[]
   - latitude double precision NOT NULL
   - longitude double precision NOT NULL
   - created_at timestamptz DEFAULT now()
   - updated_at timestamptz DEFAULT now()

   Enums :
   - category_enum : batiment_historique, edifice_religieux, mobilier_urbain, patrimoine_naturel, autre
   - item_status_enum : brouillon, publie, archive
   - contribution_type_enum : historique, recit, temoignage, observation
   - report_type_enum : degradation, danger, disparition
   - severity_enum : faible, moyen, urgent, critique
   - report_status_enum : soumis, en_cours, resolu, rejete

   Index :
   - heritage_items(latitude, longitude) GiST ou btree
   - heritage_items(category)
   - contributions(heritage_item_id)
   - contributions(author_id)
   - reports(heritage_item_id)

2. RLS policies :
   - heritage_items : SELECT public si status = 'publie', INSERT/UPDATE/DELETE owner only
   - contributions : SELECT public (sur items publiés), INSERT auth, UPDATE/DELETE author_id = auth.uid() ONLY
   - reports : SELECT public, INSERT auth, UPDATE reporter_id = auth.uid()

3. Storage buckets :
   - heritage-photos (public)
   - draft-photos (private, owner only)

4. Seed data : 10 éléments patrimoniaux à Sens avec contributions variées
   - 3 contributions historiques (style Denis : sources, datation)
   - 3 contributions récit (style Bernard : anecdotes, mémoire orale)
   - 2 contributions observation (style Marie : constat terrain)
   - 2 contributions témoignage

### Frontend (frontend-dev)

1. Auth flow : magic link Supabase, page /login, AuthProvider context
2. Layout : header, navigation mobile bottom bar, conteneur principal
3. Page /map : carte MapLibre plein écran, markers depuis heritage_items publiés, popup au clic avec titre + catégorie
4. Page /heritage/[id] : fiche détaillée
   - En-tête : titre, catégorie, photo couverture, position mini-carte
   - Section contributions groupées par type (onglets ou accordéon) :
     "Historique" / "Récits" / "Témoignages" / "Observations"
   - Chaque contribution affiche : auteur, date, contenu
   - Bouton "Ajouter une contribution" (auth required)
5. Page /heritage/[id]/contribute : formulaire contribution
   - Sélecteur type (historique, récit, témoignage, observation)
   - Champs conditionnels : sources[] et period si type = historique
   - Body : rich text ou textarea long
   - Aperçu avant publication
6. Page /report : formulaire signalement (type, description, sévérité, photos, GPS)
7. Page / : landing avec compteurs (X éléments, Y contributions, Z signalements) et CTA

### QA (qa)

1. Tests unitaires : composants formulaire contribution, hooks auth, utils géo
2. Test e2e : parcours création fiche puis ajout contribution type historique
3. Test e2e : parcours ajout contribution type récit sur fiche existante
4. Test RLS : vérifier qu'un utilisateur ne peut pas UPDATE/DELETE une contribution d'un autre
5. Audit accessibilité : contraste, navigation clavier, labels ARIA

## Definition of Done
- Tous les tests passent
- Aucun TypeScript error
- Lighthouse mobile > 90 performance, > 90 accessibility
- RLS tests passent (isolation contributions par auteur)
- Code review par qa validée
