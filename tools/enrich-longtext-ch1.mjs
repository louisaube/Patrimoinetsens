/**
 * Enrichit le chapitre I du Grand Récit avec des versions longues (longText).
 * Corrige aussi l'événement 11 (texte Daguin non nettoyé).
 * Usage: node tools/enrich-longtext-ch1.mjs
 */

import { readFileSync, writeFileSync } from 'fs'

const filePath = 'public/data/histoire-chapitres.json'
const data = JSON.parse(readFileSync(filePath, 'utf8'))
const ch1 = data.chapters[0]

// ─── Long texts pour les 12 événements du chapitre I ────────────────────────

const longTexts = [
  // 0. Brennus prend Rome (-390)
  `En 390 avant notre ère, les Sénons ne sont pas un petit peuple marginal. Ils occupent un territoire immense entre la Seine et la Loire, avec Sens (qui ne s'appelle pas encore ainsi) comme centre. Leur chef Brennus lance une expédition militaire vers le sud qui va marquer l'histoire pour toujours.

L'armée gauloise écrase les légions romaines à la bataille de l'Allia, un affluent du Tibre, le 18 juillet 390. Rome est ouverte. Les Gaulois entrent dans la ville, qu'ils pillent pendant sept mois. Seul le Capitole résiste, défendu par une poignée de soldats.

La scène de l'épée sur la balance — « Vae victis ! » — est racontée par Tite-Live un siècle et demi plus tard. Est-elle vraie ? Impossible de le savoir. Mais elle résume parfaitement le rapport de force de l'époque : les Gaulois sont les plus forts, et les Romains doivent payer.

Ce traumatisme romain est fondateur. Pendant les quatre siècles suivants, Rome construira sa puissance militaire en partie pour que « plus jamais » un peuple barbare ne prenne la Ville. Le « metus Gallicus » — la peur du Gaulois — deviendra un thème politique récurrent au Sénat romain.

Pour Sens, cette histoire est une carte d'identité. Quand le maire Lucien Cornet fait construire l'Hôtel de Ville en 1904, il place une statue de Brennus au sommet du campanile — face à la cathédrale. Un geste politique : la République face à l'Église, mais aussi un rappel que Sens est la ville d'un peuple qui a pris Rome.

Les Sénons italiens — ceux qui sont restés en Italie après Brennus — ont donné leur nom à la ville de Senigallia (Sena Gallica) sur la côte adriatique, jumelle italienne de Sens.`,

  // 1. César à Agedincum (-52)
  `L'épisode de César à Agedincum est un tournant dans l'histoire de Sens. En 53 av. J.-C., pendant la guerre des Gaules, César choisit Agedincum comme base arrière pour ses six légions. Pourquoi ici ? Parce que la ville est un carrefour naturel : elle se trouve au confluent de l'Yonne et de la Vanne, à l'intersection de six routes majeures.

Le chef sénon Acco s'est révolté contre Rome. César fait un exemple : Acco est battu de verges et décapité devant l'armée assemblée, « selon la coutume romaine » (more maiorum). Ce supplice est décrit dans le De Bello Gallico, VI, 44 — c'est la seule mention d'Agedincum par César.

Le camp de César se trouvait probablement au sud de la ville, dans la zone appelée « Motte du Ciar » ou « Champ de César ». Les fouilles y ont révélé un vaste complexe rectangulaire (386 m × 198 m) prolongé par un demi-cercle — un plan qui ressemble à un camp romain, mais qui pourrait aussi être un sanctuaire gaulois réutilisé.

Après la conquête, Agedincum ne disparaît pas — elle se transforme. En une ou deux générations, la ville gauloise devient une ville romaine, avec un plan en damier, des thermes, un amphithéâtre et un forum. Le même processus se produit dans toute la Gaule, mais Agedincum a un avantage : sa position de carrefour. La Via Agrippa, le grand axe Lyon-Boulogne, passe par ici.

C'est cette romanisation qui donnera à Sens son plan urbain « en amande » — visible encore aujourd'hui — et le réseau de rues qui structure la ville depuis deux mille ans.`,

  // 2. Six voies romaines (50)
  `Pour comprendre l'importance d'Agedincum, il faut imaginer la carte routière de la Gaule romaine. Six voies convergent vers la ville, comme les rayons d'une roue :

1. Vers Lutèce (Paris) au nord-ouest — c'est la route la plus fréquentée, celle par laquelle passent les courriers impériaux.
2. Vers Autessiodurum (Auxerre) au sud — en suivant la vallée de l'Yonne, axe commercial majeur pour le transport fluvial du bois et du vin.
3. Vers Augustobona (Troyes) à l'est — vers la Champagne et le Rhin.
4. Vers Cenabum (Orléans) à l'ouest — la route de la Loire.
5. Vers Avaricum (Bourges) au sud-ouest — le cœur de la Gaule.
6. Vers le sud, direction Lyon et la Méditerranée via la Via Agrippa.

Ce réseau routier n'est pas un hasard. Les Romains ont systématisé des routes gauloises plus anciennes — les Sénons commerçaient déjà dans toutes les directions avant la conquête. Mais Rome les a pavées, bornées (avec des milliaires tous les mille pas), entretenues et sécurisées.

Le cardo (axe nord-sud) et le decumanus (axe est-ouest) de la ville romaine sont toujours lisibles dans le tracé de la Grande Rue et de la rue de la République. Quand vous marchez dans le centre de Sens aujourd'hui, vous empruntez littéralement des routes tracées il y a deux mille ans.

Cette position de carrefour explique toute l'histoire ultérieure de Sens : elle deviendra le siège d'un archevêché primatial précisément parce que le découpage ecclésiastique du IVe siècle reprend le découpage administratif romain — et Agedincum est déjà la capitale de la province.`,

  // 3. IVe Lyonnaise (100)
  `L'expression « IVe Lyonnaise » (Lugdunensis Quarta) désigne l'une des provinces de l'Empire romain en Gaule. Sous le Haut-Empire, la Gaule est découpée en provinces, elles-mêmes subdivisées en cités (civitates). Agedincum est la capitale de la Civitas Senonum — le « pays des Sénons ».

Ce découpage administratif est capital pour la suite, parce que l'Église chrétienne va le reprendre tel quel. Quand les premiers évêques s'installent dans les capitales de province au IVe siècle, l'évêque d'Agedincum devient automatiquement le « métropolitain » — le chef des évêques de toute la province. C'est pourquoi l'archevêque de Sens commandera pendant des siècles aux évêques de Paris, Chartres, Auxerre, Meaux, Orléans, Nevers et Troyes. Le découpage romain du IIe siècle détermine la carte ecclésiastique du Moyen Âge.

La ville du Haut-Empire est bien plus grande que la ville médiévale. Elle s'étend sur 120 à 160 hectares — contre 25 hectares après la construction des remparts du IIIe siècle. L'habitat dépasse largement l'enceinte future, avec des faubourgs au sud (quartier des tanneries), à l'est (Saint-Savinien) et au nord (Sainte-Colombe).

La population est estimée entre 5 000 et 10 000 habitants. C'est considérable pour l'époque — Lutèce (Paris) n'est guère plus peuplée. Agedincum est l'une des trois ou quatre plus grandes villes de la IVe Lyonnaise, avec Autessiodurum (Auxerre) et Augustodunum (Autun).`,

  // 4. Marcus Aemilius Nobilis (100)
  `L'inscription de Marcus Aemilius Nobilis est l'une des découvertes les plus parlantes de l'archéologie sénonaise. Elle a été retrouvée dans les fondations des remparts du IIIe siècle — remployée comme simple bloc de construction.

Le texte latin nous apprend que Marcus Aemilius Nobilis était « flamine d'Auguste » — c'est-à-dire prêtre du culte impérial — et qu'il avait exercé « toutes les charges municipales » (OMNIBUS HONORIBUS APUD SUOS FUNCTO). En clair : c'était le notable le plus important de la ville. Il avait été magistrat, juge, édile (responsable des bâtiments publics), questeur (trésorier), avant de couronner sa carrière en devenant prêtre du culte de l'empereur.

Ce cursus honorum provincial calque le modèle romain. Les élites gauloises romanisées reproduisent dans leurs villes le système de Rome : des magistrats élus, un sénat local (la curie), des fonctions religieuses. En échange, l'Empire leur accorde la citoyenneté romaine et une place dans le système.

L'ironie, c'est que cette pierre honorifique — qui devait orner un monument public (peut-être le forum) — a été cassée et empilée avec d'autres blocs pour construire les remparts en urgence quand les « barbares » ont menacé la ville vers 270. Les constructeurs ont pris tout ce qui tombait sous la main : stèles funéraires, chapiteaux de temples, inscriptions honorifiques. C'est grâce à ce vandalisme utilitaire que ces textes nous sont parvenus.

La Société Archéologique de Sens (SAS), fondée en 1844, est née précisément de ces découvertes : ses premiers membres voulaient inventorier les inscriptions latines retrouvées dans les remparts.`,

  // 5. Aqueduc de 16 km (150)
  `L'aqueduc d'Agedincum est un ouvrage d'ingénierie remarquable. Long de 16 kilomètres, il captait des sources dans la vallée de la Vanne — la même rivière qui alimente encore aujourd'hui une partie de l'eau potable de Paris (via l'aqueduc de la Vanne, construit par Haussmann en 1874).

L'aqueduc romain fonctionnait par gravité : l'eau coulait dans un canal couvert, en pente douce, depuis les sources jusqu'à la ville. Il alimentait les thermes publics — le cœur de la vie sociale romaine. Se baigner n'était pas un luxe mais une habitude quotidienne. Les thermes d'Agedincum comprenaient des salles chaudes (caldarium), tièdes (tepidarium) et froides (frigidarium), chauffées par un système de sol chauffant (hypocauste).

La ville du Haut-Empire, avec ses 125 hectares, représente cinq fois la surface de la ville médiévale. C'est une vraie ville romaine, avec :
- Un forum (place publique avec basilique, curie et temple) de 210 m × 120 m
- Des thermes publics dont une façade est reconstituée au musée de Sens
- Un amphithéâtre (dans le faubourg Saint-Savinien)
- Au moins 40 stèles funéraires sculptées, témoins d'une population diverse

Les 40 stèles retrouvées à Sens sont particulièrement intéressantes. Elles représentent des artisans — un forgeron avec son marteau, un tonnelier avec ses cerceaux, une fileuse avec son fuseau. Pas des aristocrates : des gens ordinaires, assez prospères pour se payer une pierre tombale sculptée. C'est la classe moyenne gallo-romaine.`,

  // 6. Mosaïques sous les tanneries (180)
  `L'histoire des mosaïques de Sens est une leçon d'archéologie involontaire. La première découverte date de 1620 : en creusant dans un jardin du faubourg Saint-Pregts — le quartier des tanneurs — on tombe sur un sol en mosaïque « composé de compartiments de fleurs faites avec des petites pierres blanches, rouges et noires ». Le curé Rousseau en laisse une description, puis la mosaïque est recouverte et oubliée.

En 1880, on en découvre une autre chez M. Hémar, procureur de la République. Le Bulletin de la SAS publie un compte-rendu détaillé. Puis d'autres encore, au fil des travaux de voirie et des constructions au XIXe et XXe siècles.

Ce qui rend ces trouvailles fascinantes, c'est la superposition des couches. Les mosaïques étaient les sols de domus — des maisons romaines de notables. Ces maisons avaient des hypocaustes (chauffage par le sol), des atria (cours intérieures), des jardins. Elles ont été abandonnées au IIIe siècle quand la ville s'est rétractée derrière ses remparts.

Puis, mille ans plus tard, les tanneurs médiévaux se sont installés exactement au même endroit. Pourquoi ? Parce que le quartier était proche de la rivière (la Vanne), essentiel pour rincer les peaux. Les artisans ont creusé leurs fosses à tan au-dessus des sols en mosaïque sans le savoir.

C'est une constante de l'archéologie urbaine : les villes se reconstruisent sur elles-mêmes, couche après couche. À Sens, les caves du centre-ville conservent parfois des pans de mur romain — accessibles lors des Journées du Patrimoine.`,

  // 7. L'amande romaine (200)
  `Le plan de Sens est un palimpseste — un texte ancien qu'on a gratté pour écrire dessus, mais dont les traces restent visibles. Quand on regarde la ville d'en haut, on voit immédiatement la forme d'une « amande » : un ovale allongé de 850 mètres d'est en ouest et 400 mètres du nord au sud.

Cette amande, c'est l'enceinte du IIIe siècle — le castrum romain construit en urgence vers 270 pour protéger la ville contre les invasions germaniques. Mais le plan à l'intérieur de l'amande est plus ancien : le cardo (axe nord-sud, actuelle rue de la République / rue Beaurepaire) et le decumanus (axe est-ouest, actuelle Grande Rue) datent de la fondation romaine de la ville, au Ier siècle.

Les boulevards qui ceinturent aujourd'hui le centre-ville — Garibaldi, du Mail, du 14-Juillet — suivent le tracé des anciens fossés, comblés à partir de 1758 sur ordre de l'intendant. Avant cette date, Sens était encore une ville close, avec des portes qu'on fermait la nuit.

Cette permanence du plan urbain sur deux mille ans est remarquable. La plupart des villes européennes ont été profondément remaniées au XIXe siècle (comme Paris par Haussmann). Sens a échappé à ce type de transformation radicale — la ville n'était pas assez grande ni assez riche pour ça. Résultat paradoxal : c'est parce que Sens a décliné économiquement qu'elle a conservé son plan romain.

Le TimeSlider de la carte Patrimoine & Sens permet de visualiser cette superposition : activez le mode « Ier s. » pour voir le plan romain d'Agedincum transparaître sous la carte actuelle.`,

  // 8. Salle de bains mosaïque (200)
  `La découverte de 1791 est un épisode savoureux de l'archéologie sénonaise. En pleine Révolution, alors que les esprits sont tournés vers la politique, des ouvriers qui creusent le port sur l'Yonne tombent sur une salle de bains romaine décorée de mosaïques.

La trouvaille est signalée dans les premiers Bulletins de la SAS, cinquante ans plus tard. Ce qui a frappé les observateurs de l'époque, c'est que le ciment de cette salle de bains était « identique à celui de l'aqueduc » — preuve que les thermes étaient alimentés par le même réseau hydraulique que le reste de la ville.

Les thermes romains n'étaient pas de simples bains. C'était l'équivalent de nos centres culturels et sociaux réunis. Un citoyen romain typique y passait une à deux heures par jour. On s'y lavait (dans des piscines d'eau chaude, tiède et froide), on y faisait du sport (dans la palestre), on y discutait affaires et politique (dans les jardins et les portiques), on y lisait (certains thermes avaient des bibliothèques).

L'entrée coûtait un quadrans — la plus petite pièce de monnaie romaine. Même les esclaves pouvaient y accéder. C'était un lieu de mixité sociale, où le sénateur croisait l'artisan.

Quand on sait qu'Agedincum possédait des thermes publics alimentés par un aqueduc de 16 km, on comprend que la ville n'était pas un bourg provincial médiocre. C'était une vraie ville romaine, avec le même niveau d'équipement qu'une cité italienne de taille comparable.`,

  // 9. Remparts gallo-romains (270)
  `Vers 270, tout change. Les invasions germaniques — Alamans, Francs, Saxons — menacent l'Empire. Les villes ouvertes de la Gaule romaine, qui avaient prospéré sans murailles pendant trois siècles, doivent se protéger en urgence.

À Agedincum, on construit une enceinte massive : 3 mètres d'épaisseur, 8 mètres de haut, 1 200 mètres de périmètre. Mais il faut aller vite. Pas le temps de tailler de nouvelles pierres. On démonte les monuments romains — temples, tombeaux, arcs, colonnes — et on empile les blocs. C'est du recyclage de guerre.

Ce vandalisme a un avantage inattendu pour les archéologues modernes : les fondations des remparts sont un véritable musée. On y retrouve des stèles funéraires, des chapiteaux, des inscriptions latines, des morceaux de statues. C'est en fouillant ces remparts au XIXe siècle que la SAS a constitué la collection archéologique qui est aujourd'hui au musée de Sens.

L'enceinte délimite un espace de 25 hectares — cinq fois plus petit que la ville du Haut-Empire. Tout ce qui était à l'extérieur est abandonné : les thermes, l'amphithéâtre, les faubourgs. La ville se rétracte sur elle-même. C'est la fin de l'urbanisme ouvert et le début de la ville close médiévale.

Cette enceinte — l'Amande — restera le périmètre de Sens pendant quinze siècles. Les remparts seront renforcés au Moyen Âge, percés de nouvelles portes, consolidés pendant les guerres de Religion. Ils ne seront démolis qu'au XIXe siècle, pour « laisser respirer la ville ». Des vestiges sont encore visibles cours Chambonas et rue du Général-Allix.`,

  // 10. Amphithéâtre (270)
  `L'amphithéâtre d'Agedincum est un fantôme. On sait qu'il a existé, mais il a presque entièrement disparu.

Les preuves sont de trois ordres. D'abord, les textes : les Actes du martyre de sainte Colombe (IIIe siècle) mentionnent un amphithéâtre où des chrétiens sont suppliciés sous l'empereur Aurélien. Ensuite, la toponymie : dans le faubourg Saint-Savinien, un terrain est appelé « les Arènes » dans les documents médiévaux. Enfin, la topographie : en 1846, les fondateurs de la SAS notent qu'un terrain « creusé en entonnoir » à gauche du faubourg pourrait être la cavea (les gradins) d'un amphithéâtre.

Un amphithéâtre romain n'est pas un théâtre. Le théâtre est en demi-cercle, pour les pièces et les discours. L'amphithéâtre est un ovale fermé, conçu pour les combats de gladiateurs et les chasses (venationes). C'est l'ancêtre du stade.

Toute ville romaine de quelque importance en possédait un. L'amphithéâtre d'Agedincum devait contenir entre 5 000 et 10 000 spectateurs — autant que la population de la ville. Les jours de spectacle, on venait de toute la campagne environnante.

Sens avait donc son « Colisée » — à l'échelle d'une capitale de province gauloise. Les vestiges sont sous les maisons du faubourg Saint-Savinien. Des fouilles archéologiques permettraient peut-être de les retrouver, mais les terrains sont privés et urbanisés.`,

  // 11. Sens ville gallo-romaine (390) — REMPLACEMENT du texte Daguin non nettoyé
  `Sous les rues de Sens se cache une ville romaine complète. Pendant quatre siècles — du Ier au IVe siècle de notre ère — Agedincum a été une vraie ville romaine, avec tous les équipements d'une cité de l'Empire.

Le forum se trouvait à l'emplacement actuel de la cathédrale et du palais archiépiscopal — un ensemble monumental de 210 mètres sur 120 mètres, avec une place à portiques, une basilique (tribunal), un temple et des boutiques. C'était le cœur politique, judiciaire et commercial de la ville.

Les thermes publics étaient alimentés par un aqueduc de 16 km captant les sources de la Vanne. Un amphithéâtre accueillait les spectacles dans le faubourg Saint-Savinien. Des domus (maisons de notables) avec mosaïques et chauffage par le sol s'étendaient dans les faubourgs.

Mais cette prospérité a une fin brutale. Vers 270, les invasions germaniques forcent les habitants à construire en urgence une enceinte massive — l'Amande — en recyclant les pierres des monuments. La ville passe de 125 hectares à 25. Tout ce qui était hors les murs est abandonné.

Ce passé romain est la fondation invisible de Sens. Le tracé des rues, la forme de la ville, la position du pouvoir religieux (l'archevêché reprend le siège de la province romaine) — tout vient de là. Gérard Daguin, journaliste sénonais mort en 2018, a consacré des dizaines d'articles à documenter ce passé sur son site histoire-sens-senonais-yonne.com, devenu une archive irremplaçable de l'histoire locale.`
]

// ─── Application des longTexts ──────────────────────────────────────────────

ch1.events.forEach((ev, i) => {
  if (longTexts[i]) {
    ev.longText = longTexts[i]
  }
})

// ─── Correction de l'événement 11 (texte Daguin non nettoyé) ────────────────
ch1.events[11].text = "Sous les rues de Sens se cache une ville romaine complète. Forum, thermes, amphithéâtre, aqueduc de 16 km, domus avec mosaïques — pendant quatre siècles, Agedincum a été l'une des principales villes de la IVe Lyonnaise. Puis les invasions du IIIe siècle ont tout changé : la ville s'est rétractée derrière ses remparts, l'Amande, et le passé romain a disparu sous les fondations médiévales. Gérard Daguin, journaliste sénonais, a consacré sa vie à documenter ce passé sur son site histoire-sens-senonais-yonne.com."

// ─── Sauvegarde ─────────────────────────────────────────────────────────────
writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

console.log(`✓ ${longTexts.filter(Boolean).length} longTexts ajoutés au chapitre I`)
console.log(`✓ Événement 11 (Daguin) corrigé`)
