# Product Brief — Patrimoine & Sens

**Version :** 1.0
**Date :** 2026-03-29
**Auteur :** Louis (K&C) — assisté par BMAD
**Statut :** DRAFT — en attente de validation

---

## 1. Vision — Jekyll & Hyde du Patrimoine

**Patrimoine & Sens** est une plateforme web et mobile qui révèle les **deux faces du patrimoine** d'un territoire :

### 🏛️ Dr Jekyll — La face BELLE
L'inventaire vivant du patrimoine : ce qui est beau, préservé, remarquable, ce qui fait l'identité et la fierté d'un lieu. Valorisation, découverte, cartographie du « bien commun visible ».

### 🔨 Mr Hyde — La face LAIDE
Le registre des atteintes : ce qui est détruit, dégradé, dénaturé, non-conforme aux règles d'urbanisme. Alertes, signalements, documentation des dommages — la vigilance citoyenne en action.

---

**Problème :** Le patrimoine urbain est soit ignoré (on ne voit plus le beau), soit détruit en silence (personne ne documente le laid). Les citoyens, associations et élus manquent d'un outil commun pour :
- **Jekyll** : inventorier, documenter et faire découvrir le patrimoine vivant
- **Hyde** : signaler les atteintes, destructions et non-conformités urbanistiques
- Suivre l'évolution dans le temps (le beau qui devient laid, le laid restauré en beau)
- Centraliser les alertes et mesurer l'état patrimonial d'un territoire

**Solution :** Une WebApp participative à double entrée (Jekyll/Hyde) avec cartographie, signalements géolocalisés, photos horodatées, et tableaux de bord — utilisable en ligne (Mode ON) ET sur le terrain (Mode OFF, hors-ligne).

---

## 2. Périmètre patrimonial

| Catégorie | Exemples |
|---|---|
| **Bâti / Architecture** | Façades, enseignes historiques, éléments décoratifs, immeubles remarquables |
| **Monuments / Édifices** | Églises, fontaines, châteaux, monuments classés ou non, croix, lavoirs |
| **Paysage urbain / Cadre de vie** | Perspectives, vues, ambiance de quartier, cohérence urbaine, mobilier |
| **Patrimoine immatériel** | Savoir-faire, traditions, histoire locale, toponymie, mémoire orale |

---

## 3. Utilisateurs cibles

| Profil | Usage principal | Niveau d'accès |
|---|---|---|
| **Grand public / Citoyens** | Consultation de la carte, signalement simple, découverte | Lecture + signalement |
| **Membres Patrimoine & Sens** | Inventaire détaillé, suivi des signalements, documentation photo | Écriture + modération |
| **Collectivités / Élus / ABF** | Tableau de bord, statistiques, export, suivi des alertes | Administration + analytics |

---

## 4. Objectif principal — La double lecture

> **En premier lieu : voir le BEAU (Jekyll)**, puis révéler le LAID (Hyde).

L'app ouvre d'abord sur la **face Jekyll** — l'inventaire positif du patrimoine, ce qui donne envie de s'engager. Puis elle bascule vers la **face Hyde** — les alertes, les dégradations, le combat.

### Pourquoi cet ordre ?
- On ne protège que ce qu'on aime. Montrer le beau d'abord crée l'attachement.
- Le contraste Jekyll/Hyde rend les dégradations plus choquantes et mobilisatrices.
- Les collectivités voient d'abord la richesse patrimoniale, puis les urgences.

### Objectifs
1. **Jekyll** : Constituer un inventaire participatif vivant du patrimoine local
2. **Hyde** : Alerter et signaler les atteintes, créer un réseau de vigilance citoyenne
3. **Bascule** : Suivre la trajectoire d'un élément (du beau au laid, ou du laid au restauré)
4. **Pilotage** : Fournir aux collectivités un outil de suivi patrimoine/urbanisme

---

## 5. Fonctionnalités clés (haut niveau)

### MVP (v1)

**Mode Jekyll (Le Beau) :**
1. **Carte patrimoine** — Visualisation des éléments remarquables, filtrés par catégorie
2. **Fiche patrimoine** — Description, photos, localisation, histoire, état de conservation
3. **Parcours découverte** — Itinéraires thématiques sur la carte

**Mode Hyde (Le Laid) :**
4. **Signalement** — Formulaire géolocalisé avec photo, catégorisation (dégradation, destruction, non-conformité)
5. **Tableau des alertes** — Suivi des signalements, statut, urgence
6. **Comparaison avant/après** — Timeline photos d'un même élément

**Transverse :**
7. **Mode ON / Mode OFF** — PWA hors-ligne pour le terrain, sync au retour
8. **Authentification** — Inscription, rôles (citoyen, membre P&S, collectivité)
9. **Tableau de bord** — Stats patrimoine vs dégradations, tendances par territoire

### v2 (évolutions)
- Export PDF / rapport officiel pour dépôt en mairie ou ABF
- Notifications push sur nouveaux signalements dans son périmètre
- Intégration PLU / zonage urbanisme
- Score "santé patrimoniale" par quartier/commune
- API ouverte pour les collectivités partenaires
- Module patrimoine immatériel (témoignages audio, vidéo)

---

## 6. Contraintes et hypothèses

| Contrainte | Détail |
|---|---|
| **Budget** | Projet associatif — stack gratuite/open-source privilégiée |
| **Technique** | Hébergement léger, pas de serveur dédié au départ |
| **Réglementaire** | RGPD (photos de bâtiments OK, mais attention aux personnes), droit à l'image |
| **Offline** | Mode terrain indispensable (zones rurales, patrimoine isolé) |
| **Multi-territoire** | L'app doit pouvoir servir plusieurs communes/territoires |

---

## 7. Métriques de succès

| Indicateur | Cible v1 (6 mois) |
|---|---|
| Signalements créés | > 100 |
| Éléments patrimoniaux inventoriés | > 200 |
| Utilisateurs actifs mensuels | > 50 |
| Collectivités partenaires | ≥ 1 |
| Taux de résolution des signalements | Mesurable (baseline) |

---

## 8. Risques identifiés

| Risque | Mitigation |
|---|---|
| Faible adoption citoyenne | Lancement ciblé sur 1 commune pilote avec Patrimoine & Sens |
| Signalements non pertinents / spam | Modération par les membres + validation |
| Complexité technique offline/sync | PWA progressive, sync simple (queue) |
| Données perdues terrain | Stockage local persistant + indicateur de sync |

---

## 9. Stack technique envisagée

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Next.js + Tailwind CSS | SSR/SSG, PWA-ready, cohérent avec projets K&C |
| Backend | Next.js API Routes ou FastAPI | API REST, léger |
| BDD | Supabase (PostgreSQL) | Gratuit tier, auth intégrée, storage photos, realtime |
| Cartographie | Leaflet + OpenStreetMap | Open-source, pas de coût API |
| Hébergement | Vercel (front) + Supabase (back) | Gratuit pour le volume initial |
| PWA/Offline | Service Worker + IndexedDB | Mode terrain natif |

---

## 10. Prochaines étapes BMAD

- [ ] **Validation** de ce product brief par le porteur de projet
- [ ] **PRD** — Document détaillé des exigences produit (`bmad-create-prd`)
- [ ] **Architecture** — Design technique détaillé (`bmad-create-architecture`)
- [ ] **Epics & Stories** — Backlog structuré en sprints (`bmad-create-epics-and-stories`)
- [ ] **Sprint 1** — Setup technique + carte + premier signalement

---

*Généré par BMAD Method v6.2.2 — Patrimoine & Sens*
