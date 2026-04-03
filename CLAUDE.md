# Patrimoine & Sens

## Contexte
PWA de documentation et signalement du patrimoine local (bâti historique, édifices religieux, mobilier urbain, patrimoine naturel).
Modèle freemium : gratuit pour les citoyens, SaaS payant pour les collectivités.
Premier utilisateur cible : association patrimoniale existante à Sens.

## Personas

### Marie, 62 ans : Bénévole association patrimoine
Photographie les calvaires et lavoirs. Besoin : centraliser ses relevés terrain, les partager avec la mairie.
Usage type : crée des fiches avec photos et GPS sur le terrain, parfois sans réseau.

### Denis, 70 ans : Médiéviste universitaire, auteur publié
Historien rigoureux, exige des sources, une datation, un classement MH/ISMH.
Pour lui une fiche sans source est du bruit. Frustré que le grand public préfère les récits romancés à la rigueur académique.
Usage type : rédige des contributions de type "historique" avec sources bibliographiques. Veut que son apport soit identifié comme tel.

### Bernard, 70 ans : Ancien président du syndicat d'initiative, conteur local
Reprend le "roman local" (réf. au roman national). Plus attaché à raconter l'histoire qu'à sa précision. Remplit les salles.
Usage type : enregistre des récits oraux, tape des anecdotes longues. Ne veut pas de champs structurés.

### Claire, 28 ans : Habitante
Constate une dégradation sur un mur classé. Besoin : signaler en 2 clics depuis son téléphone, même sans réseau.

### Thomas, 35 ans : Agent technique municipal (V2)
Reçoit des signalements papier épars. Besoin : tableau de bord géolocalisé des signalements, priorisation par urgence.
Persona P3, hors MVP.

## Principe fondamental du data model
Une fiche patrimoine (heritage_items) est un CONTENEUR, pas un document monolithique.
Le contenu vient de CONTRIBUTIONS typées, chacune signée par son auteur.
Denis et Bernard contribuent au même calvaire sans interférer.
Chacun édite ses propres contributions. Personne ne modifie celles des autres.
La modération porte sur le contenu inapproprié, pas sur la véracité historique.

## Stack technique
- Next.js 15 App Router (TypeScript strict)
- Supabase : auth (magic link + OAuth Google), PostgreSQL, Storage (photos), Realtime
- MapLibre GL JS (tuiles OpenStreetMap)
- Service Worker + IndexedDB pour mode offline
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library (unit), Playwright (e2e)

## Périmètre MVP
- P1 : Documentation des éléments patrimoniaux (fiches conteneur + contributions typées)
- P2 : Signalement (dégradation, danger, disparition)
- V1.1 : Mode offline (Service Worker + IndexedDB + sync queue)
- V1.1 : Enregistrement audio des récits (Whisper transcription)
- V2 P3 : Dashboard municipalités
- V2 P4 : Mobilisation citoyenne

## Conventions code
- TypeScript strict, zéro any
- Composants fonctionnels React, hooks custom dans src/hooks/
- Nommage : kebab-case fichiers, PascalCase composants, camelCase fonctions
- Imports absolus via @/ (alias src/)
- Chaque composant co-localisé avec son test (.test.tsx)
- Migrations SQL numérotées : supabase/migrations/NNN_description.sql
- Pas de console.log en prod, pas de TODO sans issue référencée
- Commits conventionnels : feat|fix|refactor|test|docs(scope): message

## Agents disponibles
- product-owner : cadrage, user stories, acceptance criteria
- architect : décisions techniques, data model, ADR
- frontend-dev : UI, composants, pages, carte
- backend-dev : Supabase, migrations, RLS, Edge Functions
- qa : tests, accessibilité, sécurité, review
