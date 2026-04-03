# BMAD Product Brief : Patrimoine & Sens

## Vision
Donner aux citoyens le pouvoir de documenter et protéger le patrimoine local,
et aux collectivités les données pour prioriser leurs interventions.
Faire cohabiter rigueur historique et mémoire orale sans les hiérarchiser.

## Personas
Cf CLAUDE.md section Personas (Marie, Denis, Bernard, Claire, Thomas).

## Tension produit centrale
Denis (médiéviste) et Bernard (conteur) représentent deux registres patrimoniaux légitimes :
le savoir académique et la mémoire orale. Le produit ne hiérarchise pas ces registres,
il les juxtapose explicitement. Le lecteur voit les deux. La fiche patrimoine est un conteneur
qui accueille des contributions typées de registres différents.

## User Stories MVP

### P1 : Documentation

US1 : En tant que citoyen, je peux créer une fiche patrimoine (titre, catégorie, position GPS, photo d'illustration).
La fiche est un conteneur : le contenu détaillé passe par des contributions.

US2 : En tant que citoyen, je peux ajouter une contribution à une fiche existante.
Types de contribution :
- historique (Denis) : texte structuré, période, sources bibliographiques
- récit (Bernard) : texte libre long, anecdote, mémoire orale
- témoignage : souvenir personnel, vécu
- observation : constat terrain (état, mesures, relevé)

US3 : En tant que citoyen, je peux modifier ou supprimer uniquement mes propres contributions.

US4 : En tant que citoyen, je peux voir tous les éléments patrimoniaux sur une carte interactive.

US5 : En tant que citoyen, je peux consulter une fiche détaillée avec toutes ses contributions,
groupées par type, chacune attribuée à son auteur.

US6 : En tant que citoyen, je peux rechercher/filtrer les éléments par catégorie et proximité.

### P2 : Signalement

US7 : En tant que citoyen, je peux signaler un problème sur un élément existant
(dégradation, danger, disparition) avec photo, description et sévérité.

US8 : En tant que citoyen, je peux signaler un problème sur un lieu non encore documenté
(création rapide de fiche conteneur + signalement).

US9 : En tant que citoyen, je reçois une notification quand mon signalement change de statut.

### Critères d'acceptance transversaux
- Fonctionne sur mobile (responsive first)
- Auth obligatoire pour créer/contribuer/signaler, consultation libre
- Photos compressées côté client avant upload (max 2 Mo)
- Position GPS auto-détectée, ajustable manuellement sur la carte
- Un utilisateur ne peut jamais modifier la contribution d'un autre
- Les contributions affichent clairement : auteur, date, type de contribution

## Contraintes techniques
- Offline-first prévu V1.1 (Service Worker + IndexedDB + sync queue)
- RLS Supabase :
  - Fiches publiées : lecture publique
  - Contributions : lecture publique, écriture/modification owner only
  - Brouillons : visibles uniquement par leur auteur
- Storage Supabase : bucket public (photos publiées), bucket privé (brouillons, audio)
- Pas de SSR pour les pages carte (client-side rendering MapLibre)
- Audio : champ audio_url nullable sur contributions, transcription Whisper différée V1.1
