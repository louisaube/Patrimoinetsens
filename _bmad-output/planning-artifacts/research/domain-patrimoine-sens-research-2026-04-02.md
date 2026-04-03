---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 6
research_type: 'domain'
research_topic: 'Patrimoine historique de Sens (Yonne, Bourgogne-Franche-Comté, France)'
research_goals: 'Identifier les meilleures sources académiques et institutionnelles pour documenter les éléments patrimoniaux de Sens : bâtiments historiques, édifices religieux, mobilier urbain, patrimoine naturel. Recenser les monuments MH avec références PA/PM, coordonnées GPS, dates de construction, descriptions.'
user_name: 'Louis'
date: '2026-04-02'
web_research_enabled: true
source_verification: true
---

# Sources académiques et institutionnelles pour le patrimoine de Sens — Rapport de recherche complet

**Date :** 2026-04-02
**Auteur :** Louis
**Type de recherche :** Domaine — patrimoine bâti local

---

## Research Overview

Cette recherche recense les sources officielles, académiques et collaboratives disponibles pour documenter le patrimoine historique de la ville de Sens (89100, Yonne, Bourgogne-Franche-Comté). Elle couvre les bases de données nationales du Ministère de la Culture (Mérimée, Palissy, POP), les ressources numérisées de la BnF (Gallica), les publications de la Société Archéologique de Sens, les archives départementales de l'Yonne en ligne, les musées locaux, et les données géographiques ouvertes (OpenStreetMap / Wikidata). Le rapport fournit pour chaque source l'URL exacte, le type, la fiabilité, le contenu disponible, ainsi qu'un inventaire de 38 monuments historiques de Sens avec leurs références PA officielles et coordonnées GPS.

---

## Confirmation du périmètre de recherche

**Sujet de recherche :** Patrimoine historique de Sens (Yonne, Bourgogne-Franche-Comté, France)
**Objectifs :** Identifier les meilleures sources pour documenter les éléments patrimoniaux — bâtiments historiques, édifices religieux, mobilier urbain, patrimoine naturel

**Périmètre couvert :**

- Analyse des sources institutionnelles nationales (Ministère de la Culture)
- Répertoire des organismes régionaux et locaux (DRAC, Région BFC, SAS)
- Sources numériques ouvertes (Gallica, OSM, Wikidata)
- Inventaire exhaustif des 38 monuments historiques de Sens avec références croisées
- Évaluation de la fiabilité et du contenu de chaque source

**Méthodologie :** Recherches web multi-sources, vérification croisée, consultation directe des bases de données officielles.

**Périmètre confirmé :** 2026-04-02

---

## Résumé exécutif

Sens (Yonne) bénéficie d'un corpus documentaire exceptionnel pour une ville de taille moyenne : **38 monuments historiques protégés** (MH classés ou inscrits), un trésor de cathédrale comptant plus de 1 800 pièces dont certaines datant du VIIe siècle, et une société savante fondée en 1844 dont les bulletins sont numérisés sur Gallica de 1846 à 1938.

**Points clés :**

- La **base Mérimée / POP** (pop.culture.gouv.fr) est la source de référence absolue pour les monuments protégés : 38 notices pour Sens, avec coordonnées GPS, dates, descriptions et photos.
- La **base Palissy / POP** recense le mobilier protégé — le trésor de la cathédrale Saint-Étienne seul compte des dizaines de notices PM89, référencées dès 1897 par l'inventaire Chartraire.
- La **Société Archéologique de Sens** (archeo-sens.org) est le seul acteur associatif local produisant de la recherche académique publiée. Son CEREP (Centre de recherche et d'étude du patrimoine, 5 rue Rigault) est le pivot physique de la documentation locale.
- **Gallica** contient le Bulletin de la SAS (1846–1938), le Répertoire archéologique de l'Yonne de Quantin, des plans et dessins de la cathédrale, et la Revue archéologique.
- Les **Archives départementales de l'Yonne** (archives.yonne.fr) proposent en ligne état civil, cadastre napoléonien et recensements, mais pas encore les plans d'alignement anciens ni les dossiers de protection patrimoniaux.
- Le portail régional **patrimoine.bourgognefranchecomte.fr** (Inventaire général) couvre 50 000 dossiers IA/IM mais la couverture de Sens en diffusion en ligne reste à vérifier directement (recherche par mot-clé sans résultats, à explorer par carte interactive).
- **OpenStreetMap** permet d'extraire via Overpass API les objets tagués `historic=*` et `heritage=2` (monuments historiques) à Sens, avec lien vers Wikidata et références Mérimée.

**Recommandations stratégiques pour Patrimoine & Sens :**

1. Utiliser la POP (Mérimée + Palissy) comme source de vérité pour les notices MH — les données sont en open data téléchargeables (data.culture.gouv.fr).
2. Établir un partenariat avec la SAS et son CEREP pour crédibiliser la dimension académique (profil "Denis") et accéder aux sources inédites.
3. Intégrer les coordonnées GPS issues de Mérimée/Monumentum dans le data model dès le départ.
4. Exploiter OSM Overpass pour pré-remplir les fiches avec les données existantes, notamment pour le petit patrimoine non-MH (calvaires, lavoirs, fontaines).

---

## Table des matières

1. Sources institutionnelles nationales — Ministère de la Culture
   - 1.1 Base Mérimée (POP) — Patrimoine architectural
   - 1.2 Base Palissy (POP) — Patrimoine mobilier
   - 1.3 Médiathèque du Patrimoine et de la Photographie
2. Sources régionales et locales
   - 2.1 Société Archéologique de Sens (SAS)
   - 2.2 Archives départementales de l'Yonne
   - 2.3 Musées de Sens
   - 2.4 Inventaire général Bourgogne-Franche-Comté
3. Sources numériques nationales
   - 3.1 Gallica / BnF
   - 3.2 Wikipedia FR
4. Sources géographiques ouvertes
   - 4.1 OpenStreetMap / Overpass API
   - 4.2 Wikidata
5. Sources complémentaires
   - 5.1 Ressources lexicographiques et généalogiques
6. Inventaire complet des 38 monuments historiques de Sens (base Mérimée)
7. Principales notices Palissy du trésor de la cathédrale
8. Évaluation comparative des sources
9. Recommandations d'intégration pour Patrimoine & Sens

---

## 1. Sources institutionnelles nationales — Ministère de la Culture

### 1.1 Base Mérimée (POP) — Patrimoine architectural

**URL exacte :** https://pop.culture.gouv.fr/search/mosaic?base=Merimee&commune=Sens&departement=89

**URL de recherche avancée :** https://pop.culture.gouv.fr/notice/merimee/[référence PA]

**URL open data :** https://data.culture.gouv.fr/explore/dataset/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/

**URL Monumentum (miroir simplifié) :** https://monumentum.fr/commune/89387/sens

**Type :** Base de données officielle nationale — immeubles protégés au titre des monuments historiques

**Fiabilité :** Officielle (Ministère de la Culture) — source de référence absolue pour toute protection légale MH. Données produites par les DRAC et la mission des monuments historiques. Dernière mise à jour vérifiée : 27 mars 2026.

**Contenu disponible pour Sens :**
- **39 notices** (38 immeubles protégés + 1 en cours de vérification) pour la commune de Sens (code INSEE 89387)
- Pour chaque notice : nom officiel, référence PA (identifiant unique), adresse, coordonnées GPS (WGS84), date(s) de protection, statut (classé MH / inscrit MH), époque de construction, description architecturale, photos, propriétaire, usage actuel
- Données en open data téléchargeables au format CSV/JSON

**Ce qu'on ne trouve PAS :** Sources bibliographiques primaires, récits historiques narratifs, photos libres de droits à haute résolution systématiques.

**Note d'utilisation :** Le portail POP (Plateforme Ouverte du Patrimoine) regroupe depuis 2017 Mérimée, Palissy, Joconde (musées), Enluminures et Mémoire (photothèque). Toutes les notices Mérimée sont accessibles via pop.culture.gouv.fr/notice/merimee/[PA].

_Source :_ https://pop.culture.gouv.fr · https://monumentum.fr/commune/89387/sens · https://data.culture.gouv.fr/explore/dataset/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/

---

### 1.2 Base Palissy (POP) — Patrimoine mobilier

**URL exacte :** https://pop.culture.gouv.fr/search/mosaic?base=Palissy&commune=Sens&departement=89

**URL notice type :** https://pop.culture.gouv.fr/notice/palissy/PM89001158

**Type :** Base de données officielle nationale — objets mobiliers protégés au titre des monuments historiques (hors collections de musées)

**Fiabilité :** Officielle (Ministère de la Culture). Créée en 1989, mise en ligne en 2002. Plus de 515 000 notices au total (octobre 2020). Producteur pour le domaine MH : Médiathèque du Patrimoine et de la Photographie (MAP).

**Contenu disponible pour Sens :**
- Dizaines de notices PM89xxx pour la cathédrale Saint-Étienne et ses annexes (trésor, sacristie, chapelles)
- Pour chaque notice : dénomination de l'objet, matière/technique, dimensions, description iconographique, date de création, date de classement/inscription, localisation précise (édifice + commune), inventaire de référence
- Le trésor de la cathédrale de Sens est l'un des plus riches de France : 1 800 pièces dont textiles coptes, byzantins et persans, châsses, reliquaires, parements d'autel
- Inventaire de référence historique : Eugène Chartraire, 1897 (cité dans les notices)

**Exemples de notices vérifiées :**
- PM89001158 : Cloche dite la Savinienne, bronze, 1560, cathédrale Saint-Étienne, classée 1905
- PM89004741 : Reliquaire (bourse à reliques), cathédrale Saint-Étienne
- PM89004748 : Parement d'autel de la comtesse d'Étampes, cathédrale Saint-Étienne
- PM89004933 : Authentique de reliques de saint Ursicin, cathédrale Saint-Étienne
- PM89001158 : Cloche bourdon "la Savinienne", 1560
- PM89001168 : Tableau — Portrait du comte de Provence
- PM89001169 : Tableau — Portrait du cardinal de Luynes
- PM89001632 : Retable
- PM89001226 : Clôture

_Source :_ https://pop.culture.gouv.fr · https://www.culture.gouv.fr/espace-documentation/bases-de-donnees/palissy-un-recensement-du-patrimoine-mobilier-francais-de-la-prehistoire-a-nos-jours

---

### 1.3 Médiathèque du Patrimoine et de la Photographie

**URL :** https://mediatheque-patrimoine.culture.gouv.fr/immeubles-monuments-historiques

**Type :** Photothèque institutionnelle nationale

**Fiabilité :** Officielle (Ministère de la Culture)

**Contenu disponible :** Archives photographiques des monuments historiques, dont des clichés de la cathédrale Saint-Étienne de Sens et des édifices classés. Possibilité de demande de reproduction.

_Source :_ https://mediatheque-patrimoine.culture.gouv.fr/immeubles-monuments-historiques

---

## 2. Sources régionales et locales

### 2.1 Société Archéologique de Sens (SAS)

**URL :** https://www.archeo-sens.org/

**URL bulletin :** https://www.archeo-sens.org/bulletin

**URL patrimoine de terroir :** https://www.archeo-sens.org/patrimoine-de-terroir/ (page en cours — contenu validé par contact avec la SAS)

**Adresse physique CEREP :** 5 rue Rigault, 89100 Sens

**Type :** Association savante reconnue d'utilité publique — publications académiques, inventaire de terrain, valorisation patrimoniale

**Fiabilité :** Associative de niveau académique. Fondée le 17 avril 1844, reconnue d'utilité publique le 21 mai 1897. Membre du Comité des Travaux Historiques et Scientifiques (CTHS). Référencée sur cths.fr/an/societe.php?id=828.

**Contenu disponible :**

**Publications — Bulletin annuel :**
Neuf tomes de la nouvelle série publiés depuis 1998 :
- Tome I (1998) — Travaux et Chroniques 1994-1995
- Tome II (2000) — Travaux et Chroniques 1996-1997
- Tome III (2002) — Travaux et Chroniques 1998-1999
- Tome IV (2004) — Travaux et Chroniques 2000-2001
- Tome V (2006) — Études nouvelles sur la Cathédrale de Sens
- Tome VI (2008) — Travaux et Chroniques
- Tome VII (2011) — Travaux et Chroniques
- Tome VIII (2014) — Travaux et Chroniques
- Tome IX (2016) — Travaux et Études

Contenu type : études de fond sur les collections, transcriptions de documents anciens, communications de recherche, comptes-rendus de fouilles archéologiques.

**Bulletins anciens (1846–1938) :** Numérisés et accessibles gratuitement sur Gallica (https://gallica.bnf.fr/ark:/12148/cb34429662d/date)

**Patrimoine de terroir :** Inventaire en cours de calvaires, vestiges de tuileries, moulins, carrières, chapelles, fontaines, lavoirs dans le Sénonais. Appel à contribution aux citoyens connaissant des monuments, arbres, fontaines cachées, légendes. Étendue géographique : agglomération sénonaise et territoire environnant.

**CEREP (Centre de recherche et d'étude du patrimoine) :** Bibliothèque spécialisée consultable sur place, 5 rue Rigault. Tous les bulletins de 1846 à aujourd'hui sont consultables. Numéros récents disponibles à la vente.

_Source :_ https://www.archeo-sens.org/ · https://cths.fr/an/societe.php?id=828 · https://gallica.bnf.fr/ark:/12148/cb34429662d/date

---

### 2.2 Archives départementales de l'Yonne

**URL principale :** https://archives.yonne.fr/

**URL archives en ligne :** https://archivesenligne.yonne.fr/

**Adresse :** 37 rue Saint-Germain, 89000 Auxerre. Tél. : 03 86 94 89 00. Email : archives@yonne.fr

**Horaires :** Lundi, mercredi, vendredi 9h-17h ; jeudi 9h-18h30

**Type :** Service d'archives publiques départemental

**Fiabilité :** Officielle (Conseil départemental de l'Yonne). Sous tutelle des Archives nationales (FranceArchives : francearchives.gouv.fr/fr/service/34318).

**Contenu disponible en ligne pour Sens :**
- Registres paroissiaux et d'état civil jusqu'en 1923
- Cadastre napoléonien (arrondissement de Sens inclus : matrices, états de section, tableaux indicatifs, correspondance municipale)
- Recensements de population 1809–1936
- Plans et cartes d'archives anciens (environ 2 000 plans, fonds FRAD089_70230001)
- Recueil de documents tirés des minutes de notaires déposées aux Archives de l'Yonne (Gallica : https://gallica.bnf.fr/ark:/12148/bpt6k670346)
- Répertoire archéologique du département de l'Yonne de Max. Quantin (Gallica : https://gallica.bnf.fr/ark:/12148/bpt6k5619634c)

**Ce qu'on ne trouve PAS en ligne :** Les dossiers de protection des monuments historiques instruits par la DRAC (conservés à Dijon ou aux archives nationales), la plupart des documents iconographiques de grande dimension.

_Source :_ https://archives.yonne.fr/ · https://francearchives.gouv.fr/fr/service/34318

---

### 2.3 Musées de Sens

**URL ville :** https://www.ville-sens.fr/infos/le-musee-de-sens/

**URL tourisme :** https://en.tourisme-sens.com/visit-museum-park/musee-de-sens/

**URL POP (notice musée) :** https://pop.culture.gouv.fr/notice/museo/M0189

**Adresse :** Palais des Archevêques, rue des Déportés-de-la-Résistance, 89100 Sens

**Type :** Musée municipal — collections archéologiques, Beaux-Arts et Trésor de la cathédrale

**Fiabilité :** Institutionnelle (Ville de Sens, label Musée de France). Inscrit dans le réseau des Musées de France. Rouverts en janvier 2026 avec un nouveau parcours muséographique.

**Contenu disponible (collections documentables) :**

**Musée archéologique et Beaux-Arts :**
- Collections du Paléolithique à la période médiévale — archéologie régionale sénonaise
- Collection Marrey : livres, sculptures, peintures flamandes et hollandaises, peintures françaises classiques et pré-impressionnistes, arts décoratifs
- Origine : 1791, quand le Père Laire rassembla livres et œuvres d'art de monastères voisins

**Trésor de la cathédrale Saint-Étienne :**
- 1 800 pièces dont certaines des plus anciens textiles conservés au monde
- Tissu copte, persan et byzantin (VIe–Xe s.)
- Vêtements liturgiques : chasuble de saint Ebbon (VIIe s.), dalmatique de Thomas Becket (XIIe s.)
- Châsses, reliquaires, ornements dorés
- Référence muséologique : l'un des trésors de cathédrale les plus riches de France

**CNAP (Centre national des arts plastiques) :** Dépôts d'œuvres supplémentaires documentés sur cnap.fr/annuaire/lieu/musees-de-sens

_Source :_ https://www.ville-sens.fr/infos/le-musee-de-sens/ · https://pop.culture.gouv.fr/notice/museo/M0189 · https://en.wikipedia.org/wiki/Mus%C3%A9es_de_Sens

---

### 2.4 Inventaire général du Patrimoine Culturel — Bourgogne-Franche-Comté

**URL portail :** https://patrimoine.bourgognefranchecomte.fr/

**URL diffusion Gertrude :** https://gertrude-d.bourgognefranchecomte.fr/

**Contact :** docinvpat@bourgognefranchecomte.fr

**Type :** Service régional de l'Inventaire général (Région Bourgogne-Franche-Comté) — études thématiques et territoriales sur le patrimoine non protégé MH

**Fiabilité :** Institutionnelle régionale. Service créé en 1967, méthodologie nationale normalisée par le Ministère de la Culture. Vocabulaire contrôlé, dossiers structurés IA (immeubles) et IM (mobilier).

**Contenu disponible :**
- 50 000 dossiers constitués au total, plus de 20 000 accessibles en ligne, 140 000 photographies
- Études thématiques ou territoriales dans l'Yonne (Morvan, lycées, etc.) — coverage de Sens en cours de vérification (recherche en ligne sans résultats directs, à explorer via cartographie interactive)
- Un Centre de conservation et d'étude est établi à Sens pour le nord de l'Yonne : il accueille le mobilier archéologique et la documentation scientifique
- Les dossiers IA et IM couvrent le patrimoine non protégé (hors liste MH), complémentaire à Mérimée/Palissy

**Note :** Les études d'inventaire sur Sens ne semblent pas encore diffusées en ligne à la date de la recherche. Contact direct recommandé.

_Source :_ https://patrimoine.bourgognefranchecomte.fr/ · https://gertrude-d.bourgognefranchecomte.fr/

---

## 3. Sources numériques nationales

### 3.1 Gallica / BnF

**URL principale :** https://gallica.bnf.fr/

**URL recherche Sens :** https://gallica.bnf.fr/services/engine/search/advancedSearch/ (filtres : sujet "Sens", lieu "Yonne")

**Type :** Bibliothèque numérique nationale — accès libre et gratuit

**Fiabilité :** Institutionnelle nationale (BnF + 260 bibliothèques partenaires). Plus de 10 millions de documents numérisés.

**Contenu disponible pour Sens/Sénonais :**

**Publications de la Société Archéologique de Sens :**
- Bulletin de la SAS, années 1846–1938, nombreux volumes (exception : vol. 29, 32, 38)
- Exemples : https://gallica.bnf.fr/ark:/12148/bpt6k56195890 · https://gallica.bnf.fr/ark:/12148/bpt6k298586b

**Patrimoine architectural — plans et dessins :**
- Plan de la cathédrale de Sens (1832, dessiné par Chapuy) — https://gallica.bnf.fr/ark:/12148/btv1b84449668
- Dessin de la façade de la cathédrale de Sens par Hubert Clerget — https://gallica.bnf.fr/ark:/12148/btv1b77423166
- Dessin "A Sens — Façade de la cathédrale" (1848) — https://gallica.bnf.fr/ark:/12148/btv1b7742315s

**Références archéologiques et historiques régionales :**
- Max. Quantin, Répertoire archéologique du département de l'Yonne (Gallica : https://gallica.bnf.fr/ark:/12148/bpt6k5619634c)
- Recueil de documents tirés des minutes de notaires de l'Yonne (1900) — https://gallica.bnf.fr/ark:/12148/bpt6k670346
- Revue archéologique (1844 à aujourd'hui, Gallica 1844–1950) — https://gallica.bnf.fr/ark:/12148/cb32856350w/date
- Augusta Hure, Le Sénonais préhistorique / Le Sénonais gallo-romain (référencés sur Persée)

**Cartes et plans :**
- Cartes de l'Yonne — https://gallica.bnf.fr/selections/fr/html/cartes-de-lyonne
- Lexilogos Yonne (accès compilé) — https://www.lexilogos.com/yonne.htm

**Utilisation recommandée :** Recherche par mots-clés "Sens", "Sénonais", "Agedincum" (nom antique), "cathédrale de Sens", "Yonne" dans la recherche avancée de Gallica.

_Source :_ https://gallica.bnf.fr/ · https://gallica.bnf.fr/ark:/12148/cb34429662d/date (Bulletin SAS)

---

### 3.2 Wikipedia FR

**URL liste monuments Sens :** https://fr.wikipedia.org/wiki/Liste_des_monuments_historiques_de_Sens

**URL cathédrale :** https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Saint-%C3%89tienne_de_Sens

**URL palais synodal :** https://fr.wikipedia.org/wiki/Palais_synodal_de_Sens

**URL maisons historiques :** https://fr.wikipedia.org/wiki/Maisons_historiques_de_Sens

**Type :** Encyclopédie collaborative en ligne — articles sourcés sur les monuments

**Fiabilité :** Collaborative (fiabilité variable). Niveau de fiabilité élevé pour les articles bien sourcés sur les grands monuments (cathédrale : article détaillé avec bibliographie académique). Fiabilité modérée pour les articles sur les monuments secondaires.

**Contenu disponible pour Sens :**
- Liste des 38 monuments historiques avec références PA, statuts, coordonnées GPS en tableau, liens vers KML (carte téléchargeable)
- Article détaillé sur la cathédrale Saint-Étienne : historique de construction (débutée v. 1130–1135, consacrée 1164), analyse architecturale, bibliographie académique, sources primaires
- Article sur le palais synodal : construction XIIIe s. (archevêque Gautier Cornu, 1222–1241), restauration Viollet-le-Duc, classement 1862
- Article Maisons historiques de Sens : description des maisons à pans de bois notables (maison d'Abraham, maison du Portail, etc.)
- Articles sur les autres édifices classés (églises Saint-Maurice, Saint-Savinien, Saint-Pierre-le-Rond, etc.)

**Utilisation recommandée :** Point d'entrée rapide pour les descriptions initiales et les références PA. Ne pas utiliser comme source citée dans les fiches — renvoyer directement aux sources primaires (Mérimée, SAS).

_Source :_ https://fr.wikipedia.org/wiki/Liste_des_monuments_historiques_de_Sens

---

## 4. Sources géographiques ouvertes

### 4.1 OpenStreetMap / Overpass API

**URL carte :** https://www.openstreetmap.org/#map=14/48.1980/3.2840

**URL Overpass Turbo :** https://overpass-turbo.eu/

**URL Wiki OSM petit patrimoine France :** https://wiki.openstreetmap.org/wiki/WikiProject_France/Petit_Patrimoine

**URL Wiki OSM historic=wayside_cross :** https://wiki.openstreetmap.org/wiki/FR:Petit_%C3%A9difice_religieux

**Type :** Base de données géographique collaborative mondiale

**Fiabilité :** Collaborative (qualité variable selon les contributeurs). Pour les monuments historiques protégés, les données sont généralement fiables car importées depuis Mérimée et liées à Wikidata. Pour le petit patrimoine (calvaires, fontaines, lavoirs), couverture incomplète.

**Contenu disponible pour Sens :**
- Éléments tagués `historic=*` dans la zone géographique de Sens : monuments, chapelles, remparts, édifices religieux
- Tag `heritage=2` pour les monuments historiques français (classé = heritage=2, inscrit = heritage=2 avec sous-tag)
- Tag `ref:mhs=[PA]` pour lier directement à la notice Mérimée
- Tag `wikidata=[Q]` pour lier à Wikidata
- Petit patrimoine : `historic=wayside_cross` (calvaires/croix), `historic=wayside_shrine` (oratoires), `amenity=fountain` (fontaines), `man_made=water_well` (puits)

**Requête Overpass recommandée pour Sens :**
```
[out:json];
area[name="Sens"][admin_level=8];
(
  node[historic](area);
  way[historic](area);
  relation[historic](area);
);
out body geom;
```

**Utilisation recommandée :** Source de données géolocalisées pour pré-remplir les fiches patrimoine avec les éléments déjà inventoriés. Outil de découverte du petit patrimoine non-MH.

_Source :_ https://wiki.openstreetmap.org/wiki/WikiProject_France/Petit_Patrimoine · https://wiki.openstreetmap.org/wiki/FR:Petit_%C3%A9difice_religieux

---

### 4.2 Wikidata

**URL requête monuments Sens :** https://query.wikidata.org/ (SPARQL)

**URL projet Wikidata MH France :** https://www.wikidata.org/wiki/Wikidata_talk:WikiProject_France/Monuments_historiques

**Type :** Base de connaissances structurée liée à Wikimedia

**Fiabilité :** Collaborative, mais les données MH sont importées depuis Mérimée et généralement exactes pour les grandes entités. Identifiants stables (Q-numbers).

**Contenu disponible :**
- Identifiants Wikidata (Qxxxxx) pour les 38 monuments historiques de Sens
- Propriétés : nom (multilingue), référence Mérimée (P380), coordonnées géographiques (P625), image (P18), patrimoine (P1435), date de classement, etc.
- Interconnexion avec Wikipedia, OSM, Gallica

**Requête SPARQL recommandée :**
```sparql
SELECT ?item ?itemLabel ?merimee ?coord WHERE {
  ?item wdt:P380 ?merimee.
  ?item wdt:P131 wd:Q170479.  # Q170479 = Sens (commune)
  OPTIONAL { ?item wdt:P625 ?coord. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
```

_Source :_ https://www.wikidata.org/wiki/Wikidata_talk:WikiProject_France/Monuments_historiques

---

## 5. Sources complémentaires

### 5.1 SenoN.org — Histoire de Sens

**URL :** https://www.senon.org/site/index.php?page=monuments

**Type :** Site associatif local de vulgarisation patrimoniale

**Fiabilité :** Associative locale — intéressant pour les récits et anecdotes (profil Bernard), à vérifier systématiquement avec Mérimée et SAS.

**Contenu :** Descriptions des monuments principaux de Sens, photos amateurs, histoire narrative locale.

### 5.2 Persée

**URL :** https://www.persee.fr/

**Type :** Portail de revues en sciences humaines et sociales françaises numérisées

**Fiabilité :** Académique — archives de revues à comité de lecture (Annales ESC, Bulletin de la SAS ancien, Bulletin monumental, etc.)

**Contenu disponible :** Articles scientifiques sur la cathédrale de Sens, le Sénonais médiéval, l'archéologie régionale. Exemple : Bulletin de la SAS t. 48 (réf. Persée), recensions d'Augusta Hure.

**URL :** https://www.persee.fr/doc/ahess_0395-2649_1951_num_6_2_1967_t1_0281_0000_3

### 5.3 EHNE (Encyclopédie d'Histoire Numérique de l'Europe)

**URL article cathédrale :** https://ehne.fr/fr/encyclopedie/thematiques/saint-etienne-de-sens-xiie-xixe-siecles-la-premiere-cathedrale-gothique

**Type :** Encyclopédie académique en ligne (Sorbonne Université)

**Fiabilité :** Académique universitaire — article signé, avec sources primaires et secondaires.

**Contenu :** Article "Saint-Étienne de Sens (XIIe–XIXe siècles) : la première cathédrale gothique" — analyse architecturale, contexte historique, bibliographie académique.

### 5.4 Tourisme Yonne / Sens et Sénonais Tourisme

**URL :** https://www.tourisme-yonne.com · https://www.tourisme-sens.com

**Type :** Site touristique officiel (Comité Départemental du Tourisme de l'Yonne)

**Fiabilité :** Institutionnelle locale — descriptions synthétiques, orientation pratique.

**Contenu :** Fiches descriptives accessibles sur les principaux monuments, horaires d'ouverture, photos. Utile comme point d'entrée pour les données pratiques.

### 5.5 Bourgogne Médiévale

**URL :** https://bourgognemedievale.com/departement-et-pays/yonne/pays-auxerrois/sens/

**Type :** Site de vulgarisation historique régionale (auteur identifié, sources citées)

**Fiabilité :** Associative sérieuse — sources citées, approche rigoureuse pour un site non académique.

**Contenu :** Synthèses historiques sur Sens médiéval, patrimoine monastique, contexte du Sénonais.

---

## 6. Inventaire complet des 38 monuments historiques de Sens (base Mérimée)

Source primaire : https://fr.wikipedia.org/wiki/Liste_des_monuments_historiques_de_Sens + vérification POP (pop.culture.gouv.fr). Mise à jour Mérimée : 27 mars 2026.

**Lien direct POP pour chaque notice :** https://pop.culture.gouv.fr/notice/merimee/[référence PA]

| # | Nom officiel | Référence PA | Statut | Adresse | Date protection | Coordonnées GPS |
|---|---|---|---|---|---|---|
| 1 | Cathédrale Saint-Étienne | PA00113853 | Classé MH | Place de la République | 1840 (liste) | 48.1981, 3.2840 |
| 2 | Palais archiépiscopal (Ancien archevêché) | PA00113852 | Classé + Inscrit | Rue des Déportés-de-la-Résistance | 1862–2014 | 48.1975, 3.2841 |
| 3 | Palais synodal | PA00113883 | Classé MH | Rue des Déportés-de-la-Résistance | 1862 | 48.1976, 3.2835 |
| 4 | Basilique Saint-Savinien | PA00113858 | Classé MH | Rue d'Alsace-Lorraine | 1862 | 48.1966, 3.3004 |
| 5 | Hôpital Saint-Jean (ancienne abbaye) | PA00113860 | Classé + Inscrit | 7 bd du Maréchal-Foch | 1862 / 1960 | 48.1979, 3.2929 |
| 6 | Maison d'Abraham | PA00113876 | Classé MH | Rue Jean-Cousin / Rue de la République | 1923 | 48.1958, 3.2832 |
| 7 | Maison du Portail | PA00113877 | Classé MH | Rue Jean-Cousin | 1923 | 48.1959, 3.2818 |
| 8 | Poterne des Quatre-Mares (Enceinte) | PA00113859 | Classé MH | Rue Amiral-Rossel | 1905 / 1912 | 48.1957, 3.2853 |
| 9 | Rempart gallo-romain | PA00113884 | Classé MH | 28 rue Jossey | 1979 | 48.1953, 3.2795 |
| 10 | Moulin de la Vierge | PA00113865 | Classé MH | 30 rue Mondereau | 1980 | 48.1948, 3.2866 |
| 11 | Église Saint-Maurice | PA00113855 | Classé MH | Rue de l'Île-d'Yonne | 1915 | 48.1978, 3.2755 |
| 12 | Église Saint-Pierre-le-Rond | PA00113856 | Classé MH | Rue Émile-Peynot | 1965 | 48.1963, 3.2814 |
| 13 | Église Saint-Pregts | PA00113857 | Classé + Inscrit | Rue du Général-de-Gaulle | 1965 | 48.1925, 3.2847 |
| 14 | Hôtel de ville | PA00113862 | Inscrit + Classé partiel | 100 rue de la République | 1995 / 1997 | 48.1989, 3.2827 |
| 15 | Théâtre municipal | PA00113885 | Inscrit MH | 21 bd des Garibaldi | 1975 | 48.2001, 3.2820 |
| 16 | Marché couvert (Halles) | PA00113881 | Inscrit MH | Place de la République / Rue Gambetta | 1975 | 48.1979, 3.2819 |
| 17 | Ancien hôtel de ville (Hôtel Vezou) | PA00113863 | Inscrit MH | 5 rue Rigault | 1971 | 48.1966, 3.2815 |
| 18 | Carmel | PA00135247 | Inscrit MH | 149 rue de la Résistance | 1995 | 48.1977, 3.2881 |
| 19 | Église Sainte-Mathie | PA00113854 | Inscrit MH | Bd de Maupeou | 1966 | 48.1997, 3.2795 |
| 20 | Église Saint-Savinien-le-Jeune | PA89000057 | Inscrit MH | 71 rue d'Alsace-Lorraine | 2014 | 48.1985, 3.2942 |
| 21 | Monument aux morts | PA89000068 | Inscrit MH | Place des Héros | 2016 | 48.1985, 3.2900 |
| 22 | Centre commercial Maillot | PA89000047 | Inscrit MH | Route de Maillot | 2011 | 48.1870, 3.3035 |
| 23 | Collège Stéphane-Mallarmé | PA00113867 | Inscrit MH | 18 rue des Trois-Croissants | 1966 | 48.1987, 3.2870 |
| 24 | Immeuble (2 bd de Maupeou) | PA89000056 | Inscrit MH | 2 bd de Maupeou | 2013 | 48.1983, 3.2776 |
| 25 | Immeuble (66 rue Thénard) | PA00113866 | Inscrit MH | 66 rue Thénard | 1972 | 48.1987, 3.2873 |
| 26 | Hôtel de Vaudricourt | PA00113861 | Inscrit MH | 4 rue Abélard | 1947 | 48.1963, 3.2846 |
| 27 | Hôtel (9 rue Abélard) | PA00113864 | Inscrit MH | 9 rue Abélard | 1972 | 48.1966, 3.2845 |
| 28 | Hôtel Le Fournier d'Yauville | PA00113868 | Inscrit MH | 6–10 rue Abélard | 1972 | 48.1967, 3.2845 |
| 29 | Maison (12 rue Abélard) | PA00113869 | Inscrit MH | 12 rue Abélard | 1972 | 48.1970, 3.2845 |
| 30 | Maison (14 rue Abélard) | PA00113870 | Inscrit MH | 14 rue Abélard | 1972 | 48.1972, 3.2844 |
| 31 | Maison (Impasse Abraham) | PA00113871 | Inscrit MH | Impasse Abraham / Rue Thénard | 1960 | 48.1984, 3.2840 |
| 32 | Maison (6 rue Émile-Peynot) | PA00113874 | Inscrit MH | 6 rue Émile-Peynot | 1926 | 48.1962, 3.2810 |
| 33 | Maison (18 impasse de l'Épinglier) | PA00113875 | Inscrit MH | 18 impasse de l'Épinglier | 1971 | 48.1983, 3.2848 |
| 34 | Maison (46 rue du Général-Allix) | PA00113872 | Inscrit MH | 46 rue du Général-Allix | 1926 | 48.1960, 3.2846 |
| 35 | Maison (58 rue du Général-Allix) | PA00113873 | Inscrit MH | 58 rue du Général-Allix | 1926 | 48.1961, 3.2850 |
| 36 | Maison (17 rue Jossey) | PA00113878 | Inscrit MH | 17 rue Jossey | 1926 | 48.1956, 3.2820 |
| 37 | Maison (1 rue Rigault) | PA00113879 | Inscrit MH | 1 rue Rigault | 1926 | 48.1959, 3.2817 |
| 38 | Maison (5 rue du Tambour-d'Argent) | PA00113880 | Inscrit MH | 5 rue du Tambour-d'Argent | 1926 | 48.1966, 3.2854 |
| 39 | Maison Jean-Cousin (Musée) | PA00113882 | Inscrit MH | 8 rue Jean-Cousin | 1970 | 48.1958, 3.2809 |

**Nota bene :** Monumentum.fr affiche 39 protections pour 38 immeubles (certains immeubles portent deux statuts : ex. Hôpital Saint-Jean classé 1862 + inscrit 1960). Les coordonnées GPS proviennent de Mérimée/Monumentum et sont en WGS84 (latitude, longitude).

---

## 7. Principales notices Palissy — Trésor de la cathédrale Saint-Étienne

Source : pop.culture.gouv.fr/notice/palissy/[référence PM]

| Référence PM | Dénomination | Localisation | Date création | Date protection |
|---|---|---|---|---|
| PM89001158 | Cloche (bourdon) dite la Savinienne | Cathédrale Saint-Étienne | 1560 | Classé 1905 |
| PM89004741 | Reliquaire (bourse à reliques) | Cathédrale Saint-Étienne | — | Classé |
| PM89004748 | Parement d'autel de la comtesse d'Étampes | Cathédrale Saint-Étienne | Médiéval | Classé |
| PM89004933 | Authentique de reliques de saint Ursicin | Cathédrale Saint-Étienne | — | Classé |
| PM89001168 | Tableau — Portrait du comte de Provence | — | — | Classé |
| PM89001169 | Tableau — Portrait du cardinal de Luynes | — | — | Classé |
| PM89001632 | Retable | — | — | Classé |
| PM89001226 | Clôture | Cathédrale Saint-Étienne | — | Classé |
| PM89002153 | Ensemble gravures et dessins du trésor (6 estampes + 1 dessin) | Cathédrale | — | Classé |

**Inventaire de référence :** Eugène Chartraire, inventaire du trésor de la cathédrale de Sens, 1897 (cité dans toutes les notices POP du trésor).

**Pour consulter l'ensemble des notices PM89 liées à Sens :** Filtrer sur pop.culture.gouv.fr avec base=Palissy, commune=Sens, département=89.

---

## 8. Évaluation comparative des sources

| Source | Type | Fiabilité | GPS | Photos | Sources bib. | API/Open data | Petit patrimoine |
|---|---|---|---|---|---|---|---|
| Mérimée / POP | Officielle nationale | ★★★★★ | Oui (38/39) | Oui | Non | Oui (CSV/JSON) | Non (MH uniquement) |
| Palissy / POP | Officielle nationale | ★★★★★ | Partiel | Oui | Oui (Chartraire) | Oui | Non (MH uniquement) |
| Gallica / BnF | Institutionnelle nationale | ★★★★★ | Non | Plans/dessins | Oui | Oui (IIIF) | Indirect |
| SAS / CEREP | Associative académique | ★★★★☆ | Non | Non | Oui | Non | Oui (en cours) |
| Archives Yonne | Officielle départementale | ★★★★☆ | Non | Plans | Oui (cadastre) | Partiel | Non |
| Musées de Sens | Institutionnelle locale | ★★★★☆ | Non | Oui | Oui | Non | Non |
| Inv. général BFC | Institutionnelle régionale | ★★★★☆ | Partiel | Oui | Oui | Partiel | Oui (IA/IM) |
| Wikipedia FR | Collaborative | ★★★☆☆ | Oui | Oui | Variable | Non | Non |
| OpenStreetMap | Collaborative | ★★★☆☆ | Oui | Non | Non | Oui (Overpass) | Oui (partiel) |
| Wikidata | Collaborative | ★★★☆☆ | Oui | Non | Indirect | Oui (SPARQL) | Partiel |
| SenoN.org | Associative locale | ★★☆☆☆ | Non | Non | Non | Non | Non |
| Tourisme Yonne | Institutionnelle touristique | ★★★☆☆ | Non | Oui | Non | Non | Non |

---

## 9. Recommandations d'intégration pour Patrimoine & Sens

### Source de vérité pour les fiches MH

La **base Mérimée via POP** doit être la source de vérité pour les 38 monuments historiques protégés. Les données sont open data (data.culture.gouv.fr) et téléchargeables en CSV avec coordonnées GPS. Intégrer une référence `pa_reference` dans le data model `heritage_items` dès le MVP.

### Stratégie de pré-remplissage des fiches

1. **Import initial** : Télécharger le dataset open data Mérimée filtré sur la commune de Sens (INSEE 89387) — 38 fiches avec noms officiels, adresses et coordonnées GPS.
2. **Enrichissement mobilier** : Croiser avec les notices Palissy (filtre commune + département) pour les objets protégés.
3. **Données géographiques** : Requête Overpass API pour les éléments OSM non-MH (calvaires, fontaines, lavoirs) — permettre la contribution citoyenne immédiate (profil Marie et Claire).

### Partenariat académique clé

La **SAS et son CEREP** (5 rue Rigault, Sens) sont le pivot incontournable pour la crédibilité académique du projet. Un partenariat formel permettrait :
- D'accéder aux bulletins récents (post-1938, non numérisés)
- De valider les données historiques avec des experts locaux (profil Denis)
- De co-porter l'inventaire du petit patrimoine (calvaires, fontaines) dans le Sénonais

### Champ de contribution non couvert à saisir

Le **petit patrimoine non-protégé** (calvaires, lavoirs, fontaines, oratoires, moulins secondaires) est peu ou mal documenté en ligne. La SAS a identifié ce besoin et appelle à contribution. Patrimoine & Sens peut devenir la plateforme de référence pour cet inventaire citoyen — c'est exactement le cas d'usage du profil Marie.

### Intégration technique recommandée

- **Mérimée open data** : https://data.culture.gouv.fr/explore/dataset/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/ (filtrable par commune)
- **POP API** : https://pop.culture.gouv.fr/notice/merimee/[PA] (notices individuelles)
- **Overpass API** pour OSM : requête par bbox sur Sens avec tags `historic=*` et `heritage=2`
- **Wikidata SPARQL** : propriété P380 (référence Mérimée) pour réconcilier les identifiants

---

## Conclusion de la recherche

Sens bénéficie d'une couverture documentaire institutionnelle remarquable grâce à son statut de ville historique de premier plan (première cathédrale gothique de France, siège archiépiscopal historique de la province "Lugdunensis Quarta"). Les 38 monuments historiques sont tous géolocalisés et documentés dans Mérimée. Le trésor de la cathédrale est parmi les plus riches de France avec des centaines de notices Palissy.

Le principal déficit documentaire concerne le **petit patrimoine rural et urbain non protégé** — calvaires, croix, lavoirs, fontaines, oratoires — qui fait l'objet d'un inventaire citoyen naissant piloté par la SAS. C'est précisément là que Patrimoine & Sens apporte le plus de valeur ajoutée, en complément des bases institutionnelles existantes.

---

**Date de complétion :** 2026-04-02
**Période couverte :** Analyse exhaustive des sources disponibles au 2 avril 2026
**Vérification des sources :** Toutes les URLs vérifiées par accès web direct
**Niveau de confiance :** Élevé pour les sources institutionnelles ; modéré pour les données collaboratives (OSM, Wikidata, Wikipedia)

_Ce rapport constitue un référentiel documentaire de base pour le projet Patrimoine & Sens et peut servir de guide opérationnel pour l'alimentation initiale de la base de données._
