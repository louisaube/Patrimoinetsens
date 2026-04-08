// =============================================================================
// Contributions — Patrimoine & Sens
// Niveau de lecture : collège/lycée (11-18 ans). Sources académiques, texte simple.
// Denis (historique), Bernard (recit), Marie (observation), Claire (temoignage)
// Sources: Gallica/SAS, Daguin, Mérimée, SenoN.org, Brousse 2024, Quantin
// =============================================================================

import { DENIS, BERNARD, MARIE, CLAIRE } from './seed-users'

export const seedContributions = [

  // =========================================================================
  // CATHÉDRALE SAINT-ÉTIENNE (item 1) — 6 contributions
  // =========================================================================

  // Denis / Cathédrale — historique
  {
    id: 'f6666666-0001-0001-0001-000000000001',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: 'Sens, berceau du gothique ? Le débat des historiens',
    body: "On dit souvent que la cathédrale de Sens est « la première cathédrale gothique de France ». La réalité est plus compliquée — et plus intéressante. Les travaux ont démarré vers 1135-1140 sous l'archevêque Henri Sanglier. Mais quand parle-t-on de « première » ? À la pose de la première pierre ? Personne ne connaît la date exacte. À l'achèvement ? Les travaux ont duré quatre siècles. Et l'abbatiale de Saint-Denis, construite par l'abbé Suger dès 1135, utilise déjà la croisée d'ogives — mais ce n'est pas une cathédrale, c'est une abbatiale. Noyon, Laon, Paris ont suivi peu après. Ce qui est sûr : Sens est l'un des tout premiers grands édifices à utiliser ensemble les voûtes d'ogives, les grandes fenêtres et les arcs-boutants. Le chœur a été consacré en 1164 en présence du pape Alexandre III. Le trésor conserve la chape de Thomas Becket, réfugié en France de 1164 à 1170 — d'abord à l'abbaye de Pontigny (1164-1166), puis à l'abbaye Sainte-Colombe de Sens (1166-1170).",
    sources: [
      'Prache, Anne. "Sens. La cathédrale Saint-Étienne." Congrès Archéologique de France, 1986.',
      'Bulletin de la Société Archéologique de Sens, vol. XV, 1890 (étude du chœur).',
      'Ministère de la Culture, base Mérimée, notice PA00113853.',
    ],
    furtherReading: "Le débat « première cathédrale gothique » oppose plusieurs positions. Denis Cailleaux (La cathédrale en chantier, CTHS, 1999) étudie les comptes de fabrique du transept (1490-1517) et montre que le chantier n'a jamais vraiment cessé. Anne Prache (Congrès Archéologique, 1986) et Peter Kurmann (1973) analysent la façade. La question de l'antériorité de Saint-Denis (Suger, 1135-1144) vs Sens tient à la définition : Saint-Denis est une abbatiale, pas une cathédrale épiscopale. Les Bulletins SAS de 1846-1890 (Gallica) documentent les découvertes archéologiques in situ. Pour une synthèse accessible, lire Brousse (2024).",
    period: '1135 — 1534',
    audioUrl: null,
  },
  // Bernard / Cathédrale — Becket
  {
    id: 'f6666666-0004-0004-0004-000000000004',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Thomas Becket : six ans d'exil en France, quatre à Sens",
    body: "En novembre 1164, Thomas Becket, archevêque de Canterbury, s'est enfui d'Angleterre après le concile de Northampton. Le roi Henri II voulait sa peau. Becket a traversé la Manche et s'est présenté devant le pape Alexandre III, qui résidait alors à Sens. Le pape l'a envoyé à l'abbaye de Pontigny, où il a vécu deux ans (1164-1166). Mais quand Henri II a menacé l'ordre cistercien de représailles, les moines lui ont demandé de partir. Becket est alors revenu à Sens, à l'abbaye Sainte-Colombe, où il a vécu quatre ans sous la protection du roi de France Louis VII. Les Sénonais le croisaient dans les rues — un homme grand, maigre, habillé simplement malgré son rang. En décembre 1170, il est retourné en Angleterre. Le 29 décembre, quatre chevaliers du roi l'ont assassiné dans sa propre cathédrale de Canterbury. Sa chape brodée d'or est encore visible dans le trésor de Sens.",
    sources: [
      'Daguin, Gérard. "Thomas Becket et Sens." histoire-sens-senonais-yonne.com.',
      'Barlow, Frank. "Thomas Becket." University of California Press, 1990.',
    ],
    period: '1164–1170',
    audioUrl: null,
  },
  // Bernard / Cathédrale — le pape réfugié
  {
    id: 'f6666666-0053-0053-0053-000000000053',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Quand le pape habitait à Sens",
    body: "En 1163, le pape Alexandre III a quitté Rome. L'empereur germanique Frédéric Barberousse le menaçait. Où est-il allé ? À Sens. Pendant deux ans, le chef de l'Église catholique a vécu dans notre ville. Les ambassadeurs de toute l'Europe venaient ici, pas à Rome. C'est lui qui a béni le chœur de la cathédrale en 1164. Pendant deux ans, Sens a été la capitale du monde chrétien. Quand on y pense, c'est assez incroyable pour une petite ville sur l'Yonne.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'Bulletin de la Société Archéologique de Sens, passim.',
    ],
    period: '1163–1165',
    audioUrl: null,
  },
  // Bernard / Cathédrale — mariage de Saint Louis
  {
    id: 'f6666666-0054-0054-0054-000000000054',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le mariage de Saint Louis à Sens (1234)",
    body: "Le 27 mai 1234, le roi Louis IX — il avait vingt ans — a épousé Marguerite de Provence — elle en avait quatorze — dans la cathédrale de Sens. Pas à Paris, pas à Reims : à Sens. Parce que l'archevêque de Sens était le supérieur hiérarchique de l'évêque de Paris. Marguerite a été couronnée reine de France ici même. Cinq siècles plus tard, le fils de Louis XV, le Dauphin, a été enterré dans cette cathédrale. Son tombeau sculpté par Guillaume Coustou est toujours là.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: '1234',
    audioUrl: null,
  },
  // Denis / Cathédrale — procès des Templiers
  {
    id: 'f6666666-0056-0056-0056-000000000056',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le procès des Templiers à Sens (1310)",
    body: "En mai 1310, l'archevêque de Sens Philippe de Marigny a fait brûler cinquante-quatre Templiers. Ces moines-soldats avaient d'abord avoué sous la torture, puis ils ont dit que leurs aveux étaient faux. L'archevêque n'a pas écouté. Les Templiers ont été enfermés dans les prisons de Sens avant d'être envoyés au bûcher. Cet épisode montre à quel point l'archevêque de Sens était puissant au début du XIVe siècle : il pouvait condamner à mort.",
    sources: [
      'Daguin, Gérard. "Dans les prisons de Sens, des Chevaliers du Temple." histoire-sens-senonais-yonne.com.',
      'Bulletin de la Société Archéologique de Sens, vol. VIII, 1872.',
    ],
    period: '1310',
    audioUrl: null,
  },
  // Bernard / Cathédrale — massacre des Huguenots
  {
    id: 'f6666666-0057-0057-0057-000000000057',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "12 avril 1562 : la journée noire de Sens",
    body: "Le 12 avril 1562, Sens a vécu sa journée la plus sombre. Quatre-vingts protestants ont été massacrés par la foule. Une trentaine de maisons ont été brûlées. C'était dix ans avant la Saint-Barthélemy à Paris. Sens avait pris de l'avance dans l'horreur. Les corps ont été jetés dans l'Yonne. Pendant des semaines, les pêcheurs en aval remontaient des cadavres dans leurs filets. C'est une histoire qu'on ne raconte pas dans les dépliants touristiques. Mais elle fait partie de ce que Sens a été.",
    sources: [
      'Daguin, Gérard. "12 avril 1562, le massacre des Huguenots à Sens." histoire-sens-senonais-yonne.com.',
      'Bulletin de la Société Archéologique de Sens, vol. III, 1858.',
    ],
    period: '12 avril 1562',
    audioUrl: null,
  },

  // =========================================================================
  // PALAIS SYNODAL (item 2)
  // =========================================================================
  {
    id: 'f6666666-0002-0002-0002-000000000002',
    heritageItemId: 'e5555555-0002-0002-0002-000000000002',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le Palais synodal : salle de réunion des évêques",
    body: "Le Palais synodal a été construit au XIIIe siècle pour que les évêques de la province de Sens puissent se réunir. Sa grande salle, avec sa charpente en bois, est l'une des mieux conservées de France. Au XIXe siècle, l'architecte Viollet-le-Duc (le même qui a restauré Notre-Dame de Paris) l'a restauré entre 1863 et 1875. Il a refait le toit avec des tuiles vernissées colorées, typiques de la Bourgogne. Aujourd'hui, le bâtiment fait partie des musées de Sens.",
    sources: [
      'Viollet-le-Duc, Eugène. "Dictionnaire raisonné de l\'architecture." Paris, 1854-1868.',
      'Ministère de la Culture, base Mérimée, notice PA00113883.',
    ],
    period: '1240–1875',
    audioUrl: null,
  },

  // =========================================================================
  // MAISON D'ABRAHAM (item 3)
  // =========================================================================
  {
    id: 'f6666666-0049-0049-0049-000000000049',
    heritageItemId: 'e5555555-0003-0003-0003-000000000003',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La Maison d'Abraham : le camion, Flaubert et l'Arbre de Jessé",
    body: "La Maison d'Abraham, rue de la République, est célèbre pour son poteau d'angle sculpté. On y voit un Arbre de Jessé : la Vierge Marie entourée de huit rois d'Israël, ses ancêtres. En 1970, un camion a renversé ce poteau. On a frôlé la catastrophe — il a fallu le restaurer pierre par pierre. La maison porte aussi le nom de « Maison des Quatre Vents ». C'est Nicolas Mégissier qui l'a fait construire au XVIe siècle. Un détail littéraire : Gustave Flaubert a séjourné à Sens en 1864, à l'Hôtel de l'Écu, pour documenter « L'Éducation sentimentale ». La tradition locale associe la Maison d'Abraham à cette visite, bien qu'aucun passage du roman ne décrive explicitement l'édifice. Le roman mentionne le collège de Sens comme cadre des souvenirs de jeunesse des personnages.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'Bulletin de la Société Archéologique de Sens, vol. XXVI, 1911.',
    ],
    period: 'XVIe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // MARCHÉ COUVERT (item 4)
  // =========================================================================
  {
    id: 'f6666666-0005-0005-0005-000000000005',
    heritageItemId: 'e5555555-0004-0004-0004-000000000004',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le marché du samedi : mémoire vivante des Sénonais",
    body: "Ma grand-mère m'emmenait au marché couvert chaque samedi matin depuis que j'avais quatre ans. Elle connaissait chaque marchand par son prénom. Ce marché existe depuis toujours, bien avant la halle de fer qu'on voit aujourd'hui. Quand on a construit la structure métallique dans les années 1880, les anciens trouvaient ça horrible. Aujourd'hui, ce sont ces mêmes piliers qu'on photographie. L'architecte Lefort s'est inspiré des Halles de Baltard à Paris. Un détail amusant : le toit reprend les losanges colorés du Palais synodal juste à côté — un clin d'œil du fils Lefort à son père.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113881.',
      'SenoN.org, "Marché couvert." senon.org/wordpress/monuments/.',
    ],
    period: '1882',
    audioUrl: null,
  },

  // =========================================================================
  // ÉGLISE SAINT-MAURICE (item 5)
  // =========================================================================

  // =========================================================================
  // HÔPITAL SAINT-JEAN / ABBAYE (item 6)
  // =========================================================================
  {
    id: 'f6666666-0003-0003-0003-000000000003',
    heritageItemId: 'e5555555-0006-0006-0006-000000000006',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'abbaye Saint-Jean : quinze siècles d'histoire",
    body: "L'abbaye Saint-Jean a été fondée vers 495 par l'évêque Héracle de Sens — c'est l'une des plus anciennes fondations monastiques de la région. Après des siècles de guerres et d'invasions (notamment les raids normands), le monastère était en ruines. En 1111, Étienne, prévôt du chapitre cathédral, l'a refondé comme abbaye de chanoines réguliers de Saint-Augustin. L'église actuelle date du XIIIe siècle : son chœur gothique (murs fins, grandes fenêtres) contraste avec les parties romanes plus anciennes. Les bâtiments conventuels ont été reconstruits aux XVIIe et XVIIIe siècles. En 1792, la Révolution a transformé l'abbaye en hôpital. Aujourd'hui, les bâtiments abritent les musées de Sens, avec une collection de mosaïques romaines retrouvées dans le sous-sol de la ville. L'église est classée Monument Historique depuis 1862.",
    sources: [
      'Bulletin de la Société Archéologique de Sens, vol. II, 1856.',
      'Ministère de la Culture, base Mérimée, notice PA00113860.',
    ],
    period: 'VIe siècle — présent',
    audioUrl: null,
  },
  // Bernard / Gaston Ramon (item 78)
  {
    id: 'f6666666-0059-0059-0059-000000000059',
    heritageItemId: 'e5555555-0078-0078-0078-000000000078',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Gaston Ramon : le Sénonais qui a sauvé des millions d'enfants",
    body: "Gaston Ramon est né en 1886 à Bellechaume, tout près de Sens. Ce vétérinaire est devenu biologiste à l'Institut Pasteur. Il a inventé les anatoxines — le procédé qui permet de fabriquer les vaccins contre le tétanos et la diphtérie. Avant lui, ces maladies tuaient des dizaines de milliers d'enfants chaque année. Il a été nominé 155 fois pour le prix Nobel. Cent cinquante-cinq fois, sans jamais l'obtenir. Le monde entier vaccine ses enfants grâce à un procédé inventé par un gars du coin, et presque personne ne connaît son nom.",
    sources: [
      'SenoN.org, "Gaston Ramon." senon.org/wordpress/personnalites/.',
    ],
    period: '1886–1963',
    audioUrl: null,
  },
  // Marie / Cathédrale — observation terrain
  {
    id: 'f6666666-0007-0007-0007-000000000007',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: MARIE,
    contributionType: 'observation' as const,
    title: 'Gargouilles façade nord — relevé mars 2026',
    body: "Relevé du 15 mars 2026. Façade nord : 3 gargouilles fissurées, dont une qui commence à perdre des morceaux de pierre (2e niveau, travée centrale). La pierre calcaire est très noire sur les deux tiers du haut. Certains joints entre les blocs sont vides par endroits. Pas de travaux en cours. Photos prises avec GPS.",
    sources: null,
    period: null,
    audioUrl: null,
  },
  // Marie / Fontaine — observation
  {
    id: 'f6666666-0008-0008-0008-000000000008',
    heritageItemId: 'e5555555-0007-0007-0007-000000000007',
    authorId: MARIE,
    contributionType: 'observation' as const,
    title: "Fontaine de la Samaritaine — état février 2026",
    body: "Visite du 8 février 2026. La fontaine ne coule plus depuis au moins 3 mois d'après les voisins. Le bassin du bas est plein de calcaire et de mousse verte. Une statue côté est a le bras cassé — les morceaux sont dans le bassin. Graffiti bleu sur le socle, récent. L'association a écrit à la Ville en janvier 2026, pas de réponse.",
    sources: null,
    period: null,
    audioUrl: null,
  },
  // Claire / Cathédrale — témoignage
  {
    id: 'f6666666-0009-0009-0009-000000000009',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: CLAIRE,
    contributionType: 'temoignage' as const,
    title: "Ma première visite du trésor, été 2018",
    body: "J'habitais Sens depuis deux ans sans jamais être entrée dans la cathédrale autrement que pour traverser la place. Un ami m'a traînée visiter le trésor un dimanche d'août 2018. Je ne savais pas que la chape de Thomas Becket existait, que Sens avait joué un rôle dans l'histoire de l'Angleterre. Ça m'a donné envie de comprendre ma ville autrement.",
    sources: null,
    period: null,
    audioUrl: null,
  },
  // Claire / Abbaye — témoignage
  {
    id: 'f6666666-0010-0010-0010-000000000010',
    heritageItemId: 'e5555555-0006-0006-0006-000000000006',
    authorId: CLAIRE,
    contributionType: 'temoignage' as const,
    title: "La mosaïque romaine du musée",
    body: "J'ai visité le musée dans l'abbaye avec ma classe de CM2, vers 2005. Ce que je retiens, c'est la mosaïque romaine dans la salle du fond — elle vient d'une villa gallo-romaine découverte lors de travaux de voirie dans les années 1960. Le guide nous avait expliqué que Sens s'appelait Agedincum sous les Romains et était la capitale de toute une province. Ça m'avait semblé fou qu'une ville aussi calme ait été aussi importante.",
    sources: null,
    period: null,
    audioUrl: null,
  },

  // =========================================================================
  // POTERNE DES QUATRE-MARES (item 9)
  // =========================================================================
  {
    id: 'f6666666-0006-0006-0006-000000000006',
    heritageItemId: 'e5555555-0009-0009-0009-000000000009',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La poterne oubliée",
    body: "La Poterne des Quatre-Mares est l'une des rares portes médiévales encore debout à Sens. C'est une petite porte basse, en calcaire que les lichens ont rendu presque orange. Le nom vient des quatre mares qui se trouvaient de l'autre côté, là où les tanneurs rinçaient leurs cuirs. L'odeur devait être mémorable. Aujourd'hui les gens passent devant sans savoir que ces pierres ont huit cents ans.",
    sources: [
      'Daguin, Gérard. "Les fortifications de Sens." histoire-sens-senonais-yonne.com.',
      'Ministère de la Culture, base Mérimée, notice PA00113859.',
    ],
    period: 'XIIIe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // BASILIQUE SAINT-SAVINIEN (item 10)
  // =========================================================================
  {
    id: 'f6666666-0011-0011-0011-000000000011',
    heritageItemId: 'e5555555-0010-0010-0010-000000000010',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le plus ancien lieu de culte de Sens",
    body: "La basilique Saint-Savinien est probablement le plus ancien lieu de culte chrétien de Sens. Elle est construite à l'endroit où, selon la tradition, les premiers chrétiens du Sénonais — Savinien et Potentien — ont été décapités au IIIe siècle. Le bâtiment qu'on voit aujourd'hui date du XIe siècle (vers 1068). C'est une église romane : murs épais, petites fenêtres, piliers en croix. La crypte en dessous conserve des inscriptions très anciennes, des VIIIe et IXe siècles. Classée monument historique depuis 1862.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113858.',
      'Bulletin de la Société Archéologique de Sens, vol. I, 1846 (reliquaires de Saint-Savinien).',
    ],
    period: 'IIIe siècle (tradition) — XIe siècle (édifice)',
    audioUrl: null,
  },
  {
    id: 'f6666666-0012-0012-0012-000000000012',
    heritageItemId: 'e5555555-0010-0010-0010-000000000010',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Savinien et Potentien : les premiers chrétiens de Sens",
    body: "Il y a une histoire que tout le monde connaît à Sens sans vraiment la connaître. Au IIIe siècle, deux hommes sont venus de Rome pour prêcher la religion chrétienne. Ils s'appelaient Savinien et Potentien. Ils ont été arrêtés et décapités. Sur leur tombe, on a construit une chapelle, puis une église, puis la basilique qu'on voit aujourd'hui. Les gens du quartier disent qu'on entend parfois des chants dans la crypte le soir, quand il n'y a personne. Je ne sais pas si c'est vrai, mais l'histoire est trop belle pour ne pas la raconter.",
    sources: [
      'Daguin, Gérard. "Savinien et Potentien." histoire-sens-senonais-yonne.com.',
    ],
    period: 'IIIe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // ABBAYE SAINTE-COLOMBE (item 11)
  // =========================================================================
  {
    id: 'f6666666-0013-0013-0013-000000000013',
    heritageItemId: 'e5555555-0011-0011-0011-000000000011',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'abbaye Sainte-Colombe : 1 200 ans d'histoire",
    body: "L'abbaye Sainte-Colombe a été fondée vers 620 par le roi Clotaire II. C'est l'une des plus anciennes abbayes de France. Elle est construite sur le tombeau de sainte Colombe, une jeune femme décapitée en 274 pour avoir refusé d'adorer les dieux romains. Pendant douze siècles, des moines puis des religieuses y ont vécu. À la Révolution, l'abbaye a été vendue et en partie démolie. Ce qui reste est inscrit aux Monuments Historiques depuis 1966.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113809.',
      'Quantin, Maximilien. "Cartulaire général de l\'Yonne." Auxerre, 1854.',
    ],
    period: '620 — 1790',
    audioUrl: null,
  },

  // =========================================================================
  // HÔTEL DE VILLE (item 12)
  // =========================================================================
  {
    id: 'f6666666-0014-0014-0014-000000000014',
    heritageItemId: 'e5555555-0012-0012-0012-000000000012',
    authorId: MARIE,
    contributionType: 'observation' as const,
    title: "Façade principale — relevé janvier 2026",
    body: "Relevé du 22 janvier 2026. Façade en bon état général. Un peu de mousse verte sur les pilastres côté nord. Les ferronneries du balcon central ont de la rouille légère. L'horloge fonctionne. Pas de travaux en cours.",
    sources: null,
    period: null,
    audioUrl: null,
  },
  // Bernard / Hôtel de Ville — Lucien Cornet
  {
    id: 'f6666666-0060-0060-0060-000000000060',
    heritageItemId: 'e5555555-0012-0012-0012-000000000012',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Lucien Cornet : la mairie face à la cathédrale",
    body: "Lucien Cornet a été maire de Sens pendant trente-sept ans (1885-1922). C'est lui qui a fait construire l'Hôtel de Ville actuel, inauguré en 1904. Les proportions ne sont pas un hasard : le campanile monte à 56 mètres, et une statue de Brennus — le chef gaulois qui a pris Rome — est plantée au sommet. Face à la cathédrale, le message est clair : la République répond à l'Église. On est à la veille de la loi de séparation de 1905.",
    sources: [
      'Daguin, Gérard. "Les Mairies successives." histoire-sens-senonais-yonne.com.',
      'SenoN.org, "Lucien Cornet." senon.org/wordpress/personnalites/.',
    ],
    period: '1885–1922',
    audioUrl: null,
  },
  // Bernard / Ali le Mamelouk (item 75)
  {
    id: 'f6666666-0064-0064-0064-000000000064',
    heritageItemId: 'e5555555-0075-0075-0075-000000000075',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Ali le Mamelouk : le dernier fidèle de Napoléon était de Sens",
    body: "Son vrai nom était Louis-Étienne Saint-Denis. Napoléon l'avait surnommé « Ali ». Il a suivi l'Empereur à Sainte-Hélène et est resté à ses côtés jusqu'au bout. Quand Napoléon est mort en 1821, Ali a reçu des manuscrits et des objets personnels. Il a passé le reste de sa vie à Sens, où il a écrit ses mémoires — « Souvenirs du Mameluck Ali ». Ce livre est devenu une source majeure pour les historiens. Il est mort en 1856 à Sens.",
    sources: [
      'Daguin, Gérard. "Le Mameluck Ali." histoire-sens-senonais-yonne.com.',
      'SenoN.org, "Louis-Étienne Saint-Denis (Ali)." senon.org/wordpress/personnalites/.',
    ],
    period: '1788–1856',
    audioUrl: null,
  },

  // =========================================================================
  // PALAIS ARCHIÉPISCOPAL (item 13)
  // =========================================================================
  {
    id: 'f6666666-0015-0015-0015-000000000015',
    heritageItemId: 'e5555555-0013-0013-0013-000000000013',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le palais des archevêques : quand Sens dominait Paris",
    body: "Le palais archiépiscopal de Sens est collé à la cathédrale. Pendant des siècles, l'archevêque de Sens était le chef religieux de toute la région, y compris Paris. Il portait le titre de « primat des Gaules ». Les parties les plus anciennes du palais datent du XIIe siècle. Depuis 1927, le bâtiment abrite les musées de Sens, avec le Trésor de la cathédrale. Classé monument historique depuis 1862.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113852.',
    ],
    furtherReading: "La prééminence de Sens sur Paris a duré jusqu'en 1622, quand Paris est devenu archevêché. L'archevêque de Sens avait autorité sur 7 évêchés suffragants : Paris, Chartres, Auxerre, Meaux, Orléans, Nevers et Troyes. Le trésor de la cathédrale, numérisé sur la base Palissy (Médiathèque du Patrimoine), contient des textiles coptes, persans et byzantins parmi les plus anciens conservés en France.",
    period: 'XIIe — XVIIIe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // ENCEINTE GALLO-ROMAINE (item 14)
  // =========================================================================
  {
    id: 'f6666666-0016-0016-0016-000000000016',
    heritageItemId: 'e5555555-0014-0014-0014-000000000014',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Les remparts : quand les Romains ont fortifié Sens",
    body: "Vers l'an 270, les Romains ont construit une enceinte autour de Sens pour se protéger des invasions barbares. Les murs faisaient 3 mètres d'épaisseur et 8 mètres de haut. Ils formaient un ovale de 850 mètres sur 400. Pour construire vite, les Romains ont réutilisé des pierres de temples et de monuments — on retrouve des morceaux de statues et de chapiteaux dans les fondations. Des vestiges sont encore visibles rue Jossey et rue du Général-Allix. Au XIXe siècle, on a démoli presque tout pour « laisser respirer la ville ».",
    sources: [
      'Daguin, Gérard. "Quand Sens était une ville fortifiée." histoire-sens-senonais-yonne.com.',
      'Delor, Jean-Paul. "Carte archéologique de la Gaule : l\'Yonne." MSH, Paris, 2002.',
      'Ministère de la Culture, base Mérimée, notice PA00113884.',
    ],
    furtherReading: "Les remplois gallo-romains dans les murs (stèles, chapiteaux, blocs inscrits) ont été étudiés dès la fondation de la SAS en 1844 — c'est même la raison de sa création. Voir le Bulletin SAS vol. I (1846) sur Gallica pour le premier inventaire des inscriptions retrouvées. Delor (Carte archéologique, 2002) cartographie les vestiges. Les caves du centre-ville conservent des sections de mur intactes, accessibles lors des Journées du Patrimoine.",
    period: '270 — 1850',
    audioUrl: null,
  },
  {
    id: 'f6666666-0017-0017-0017-000000000017',
    heritageItemId: 'e5555555-0014-0014-0014-000000000014',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Imaginez Sens en 1400",
    body: "Imaginez Sens en 1400. Vous arrivez par la route de Paris. Ce que vous voyez d'abord, ce sont des murs. Huit mètres de haut, trois mètres d'épaisseur. Tout autour, des fossés remplis d'eau — on avait détourné la Vanne exprès. Pour entrer, il faut passer par une des quatre portes principales. Il y a un pont-levis, une herse, des gardes. La nuit, les portes sont fermées — personne n'entre ni ne sort. Le soir, les cloches de la cathédrale sonnent le couvre-feu. Tout ça a disparu au XIXe siècle.",
    sources: [
      'Daguin, Gérard. "De hauts murs de huit mètres de haut." histoire-sens-senonais-yonne.com.',
    ],
    period: 'IIIe — XIXe siècle',
    audioUrl: null,
  },
  // Denis / Enceinte — Villegagnon
  {
    id: 'f6666666-0063-0063-0063-000000000063',
    heritageItemId: 'e5555555-0014-0014-0014-000000000014',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Villegagnon : du gouvernorat de Sens au Brésil",
    body: "Nicolas Durand de Villegagnon (1510-1571) a été gouverneur de Sens pendant les guerres de Religion. Son travail : défendre les remparts de la ville. Mais il est surtout connu pour avoir fondé la « France Antarctique » au Brésil en 1555 — une colonie française dans la baie de Rio de Janeiro. L'île de Villegagnon, dans la baie de Rio, porte toujours son nom. Le même homme qui gardait les murs de Sens avait tenté de créer un nouveau monde de l'autre côté de l'Atlantique.",
    sources: [
      'SenoN.org, "Nicolas Durand de Villegagnon." senon.org/wordpress/personnalites/.',
    ],
    period: '1510–1571',
    audioUrl: null,
  },

  // =========================================================================
  // THÉÂTRE (item 15)
  // =========================================================================
  {
    id: 'f6666666-0018-0018-0018-000000000018',
    heritageItemId: 'e5555555-0015-0015-0015-000000000015',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Un théâtre construit sur un cimetière",
    body: "Le théâtre municipal de Sens a été construit en 1882 sur un ancien cimetière. C'est un petit théâtre à l'italienne, avec des dorures et du velours rouge. Inscrit aux Monuments Historiques en 1975. Les pierres du premier théâtre (1808) venaient du château de Noslon, démoli à la Révolution. Un détail : le théâtre a été fermé de 1969 à 1981 pour des raisons de sécurité. Douze ans sans spectacle.",
    sources: [
      'Daguin, Gérard. "Le Théâtre : quand le cimetière accueille les baladins." histoire-sens-senonais-yonne.com.',
      'Ministère de la Culture, base Mérimée, notice PA00113885.',
    ],
    period: '1882',
    audioUrl: null,
  },
  {
    id: 'f6666666-0019-0019-0019-000000000019',
    heritageItemId: 'e5555555-0015-0015-0015-000000000015',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les fantômes du théâtre",
    body: "On a construit un théâtre sur un cimetière. Les premières années, les vieux du quartier refusaient d'y mettre les pieds. Ils disaient qu'on entendait des bruits bizarres sous la scène les soirs de représentation. Aujourd'hui encore, les techniciens du théâtre vous raconteront, avec un sourire en coin, que le bâtiment a ses humeurs.",
    sources: [
      'Daguin, Gérard. "Le Théâtre." histoire-sens-senonais-yonne.com.',
    ],
    period: '1882',
    audioUrl: null,
  },

  // =========================================================================
  // MONUMENT AUX MORTS (item 16)
  // =========================================================================
  {
    id: 'f6666666-0020-0020-0020-000000000020',
    heritageItemId: 'e5555555-0016-0016-0016-000000000016',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Deux guerres, un monument",
    body: "Le monument aux morts de Sens, place des Héros, raconte deux guerres. La statue du centre date de 1904 : elle honore les morts de 1870. L'arc qui l'entoure a été ajouté après 1918 pour les morts de 14-18. Le sculpteur Émile Peyrrot — un Sénonais — a donné au monument un détail étrange : le garçon qui tient une épée est en fait le fils du sculpteur, qui a posé pour son père. L'épée originale a été volée, puis retrouvée. Inscrit aux Monuments Historiques en 2016.",
    sources: [
      'Daguin, Gérard. "Le Monument aux morts." histoire-sens-senonais-yonne.com.',
      'Ministère de la Culture, base Mérimée, notice PA89000068.',
    ],
    period: '1904–1925',
    audioUrl: null,
  },

  // =========================================================================
  // MAISON JEAN COUSIN (item 17)
  // =========================================================================
  {
    id: 'f6666666-0021-0021-0021-000000000021',
    heritageItemId: 'e5555555-0017-0017-0017-000000000017',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Jean Cousin père et fils : les peintres de Sens",
    body: "Jean Cousin le Père est né vers 1490 à Soucy, près de Sens. Il a appris la peinture sur verre auprès des maîtres Hympe et Grassot, avant de réaliser les vitraux de la Légende de Saint-Eutrope pour la cathédrale vers 1530. Marié à Christine Rousseau en 1520, il a quitté Sens pour Paris vers 1538. C'est là qu'il a peint « Eva Prima Pandora » (après 1549) — considéré comme le premier grand nu de la peinture française, aujourd'hui au Louvre. Son fils, Jean Cousin le Jeune (~1522-1594), a repris l'atelier paternel et publié le « Livre de pourtraicture » (1571). Il est revenu à Sens en 1563 pour décorer la ville lors de l'entrée royale de Charles IX. Leur maison, rue Jean-Cousin, est une bâtisse à colombages. Inscrite aux Monuments Historiques en 1970. C'est l'historien d'art Maurice Roy qui a établi en 1909 que le père et le fils étaient bien deux artistes distincts — pendant des siècles, on les avait confondus.",
    sources: [
      'Daguin, Gérard. "Jean Cousin, au nom du père, du fils, du square." histoire-sens-senonais-yonne.com.',
      'Roy, Maurice. "Les Cousin, peintres de Sens." CRAI, 1909 (Persée).',
      'Scailliérez, Cécile. "Jean Cousin père et fils." Catalogue Louvre, 2013.',
      'Ministère de la Culture, base Mérimée, notice PA00113882.',
    ],
    period: '~1490–1594',
    audioUrl: null,
  },
  // Bernard / Jean Cousin — Pierre de Cugnières
  {
    id: 'f6666666-0062-0062-0062-000000000062',
    heritageItemId: 'e5555555-0001-0001-0001-000000000001',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les petits visages grimaçants de la cathédrale",
    body: "Si vous regardez certains piliers de la cathédrale, vous verrez de petits visages grimaçants sculptés dans la pierre. On dit que ce sont des caricatures de Pierre de Cugnières, un conseiller du roi au XIVe siècle qui avait osé contester les avantages fiscaux du clergé. Les chanoines se seraient vengés en faisant sculpter sa tête en grimace pour que les fidèles lui crachent dessus. Vrai ou faux ? Les historiens ne sont pas d'accord. Mais imaginez : un fonctionnaire transformé en gargouille pour avoir voulu taxer les prêtres.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: 'XIVe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // COLLÈGE MALLARMÉ / CÉLESTINS (item 24)
  // =========================================================================
  {
    id: 'f6666666-0029-0029-0029-000000000029',
    heritageItemId: 'e5555555-0024-0024-0024-000000000024',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Des Célestins à Mallarmé : un couvent devenu collège",
    body: "Le couvent des Célestins a été fondé en 1367. Ces moines y ont vécu jusqu'à la Révolution. Les bâtiments sont ensuite devenus une école. Le collège porte le nom de Stéphane Mallarmé parce que le poète a enseigné l'anglais au lycée de Sens entre 1866 et 1871. Aristide Bruant (le chansonnier peint par Toulouse-Lautrec) et Robert Brasillach (l'écrivain) y ont aussi été élèves. Inscrit aux Monuments Historiques en 1966.",
    sources: [
      'Daguin, Gérard. "L\'ombre des Célestins rôde sur Mallarmé." histoire-sens-senonais-yonne.com.',
      'Cailleaux, Denis. "Les comptes des Célestins de Sens (1477-1482)." 1985.',
      'Ministère de la Culture, base Mérimée, notice PA00113867.',
    ],
    period: '1367 — présent',
    audioUrl: null,
  },
  {
    id: 'f6666666-0030-0030-0030-000000000030',
    heritageItemId: 'e5555555-0024-0024-0024-000000000024',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Mallarmé s'ennuyait à Sens",
    body: "Stéphane Mallarmé est arrivé à Sens en 1866, à vingt-quatre ans, pour enseigner l'anglais. Il venait de Londres, il était poète, il ne connaissait personne. Il a vécu cinq ans dans notre ville avec sa femme Marie. C'est ici qu'il a écrit « Hérodiade » et « L'Après-midi d'un faune ». Ses élèves ne se doutaient probablement pas qu'ils avaient un génie comme prof. Mallarmé s'ennuyait à Sens — il le disait dans ses lettres. Mais c'est l'ennui de Sens qui a nourri sa poésie.",
    sources: [
      'Daguin, Gérard. "L\'ombre des Célestins rôde sur Mallarmé." histoire-sens-senonais-yonne.com.',
    ],
    period: '1866–1871',
    audioUrl: null,
  },

  // =========================================================================
  // CARMEL (item 25)
  // =========================================================================
  {
    id: 'f6666666-0031-0031-0031-000000000031',
    heritageItemId: 'e5555555-0025-0025-0025-000000000025',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Cinq siècles de prière derrière les murs",
    body: "Le Carmel de Sens est l'un des plus anciens carmels de France. Fondé au début du XVIe siècle, il abrite encore aujourd'hui une communauté de carmélites. Les religieuses ont traversé la Révolution sans disparaître complètement — elles sont revenues au XIXe siècle. L'ensemble (chapelle, cloître) est inscrit aux Monuments Historiques depuis 1995.",
    sources: [
      'Daguin, Gérard. "Un lieu discret dans la ville, le Carmel de Sens." histoire-sens-senonais-yonne.com.',
      'Ministère de la Culture, base Mérimée, notice PA00135247.',
    ],
    period: 'XVIe siècle — présent',
    audioUrl: null,
  },
  {
    id: 'f6666666-0032-0032-0032-000000000032',
    heritageItemId: 'e5555555-0025-0025-0025-000000000025',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les sœurs sont toujours là",
    body: "Il y a un endroit à Sens où le temps ne passe pas. Le Carmel, rue de la Résistance, est là depuis cinq cents ans. Derrière un mur haut et un portail fermé, des femmes prient en silence depuis la Renaissance. Elles étaient là quand les révolutionnaires sont venus frapper aux portes des couvents en 1790. La plupart des communautés ont été dispersées. Pas les carmélites de Sens. Si vous collez votre oreille au mur de la chapelle un dimanche matin, vous entendrez des chants. Cinq siècles de chants.",
    sources: [
      'Daguin, Gérard. "Dans le silence du Carmel de Sens." histoire-sens-senonais-yonne.com.',
    ],
    period: 'XVIe siècle — présent',
    audioUrl: null,
  },

  // =========================================================================
  // JACOBINS (item 27)
  // =========================================================================
  {
    id: 'f6666666-0034-0034-0034-000000000034',
    heritageItemId: 'e5555555-0027-0027-0027-000000000027',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Les Jacobins : moines prêcheurs au cœur de la ville",
    body: "Les Dominicains (qu'on appelait Jacobins) se sont installés à Sens en 1227. Leur couvent était près de la cathédrale. Ces moines ne restaient pas cloîtrés : ils prêchaient dans les rues, sur les places. Au XVIIIe siècle, leur église menaçait de s'écrouler — on l'a démolie. À la Révolution, tout a disparu. Des vestiges subsistent dans le tissu urbain.",
    sources: [
      'Daguin, Gérard. "Le couvent de Jacobins, à partir de 1227." histoire-sens-senonais-yonne.com.',
    ],
    period: '1227–1790',
    audioUrl: null,
  },
  // Bernard / Jacobins — Jacques Clément
  {
    id: 'f6666666-0055-0055-0055-000000000055',
    heritageItemId: 'e5555555-0027-0027-0027-000000000027',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le moine de Sens qui a tué un roi",
    body: "Jacques Clément était un moine du couvent des Jacobins de Sens. Le 1er août 1589, il a obtenu une audience auprès du roi Henri III. Il lui a tendu une lettre. Quand le roi s'est penché pour la lire, Jacques Clément l'a poignardé. Henri III est mort le lendemain. C'est un moine de chez nous qui a changé l'histoire de France : sans cet assassinat, Henri IV ne serait jamais devenu roi.",
    sources: [
      'SenoN.org, "Jacques Clément." senon.org/wordpress/personnalites/.',
    ],
    period: '1er août 1589',
    audioUrl: null,
  },

  // =========================================================================
  // URSULINES (item 28)
  // =========================================================================
  {
    id: 'f6666666-0036-0036-0036-000000000036',
    heritageItemId: 'e5555555-0028-0028-0028-000000000028',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Du couvent à l'école Jeanne d'Arc",
    body: "En 1643, les Ursulines se sont installées à Sens pour éduquer les jeunes filles. Quand les congrégations ont été expulsées par la loi de 1905, les bâtiments sont devenus l'école Jeanne d'Arc. Ma mère y a fait sa scolarité dans les années 1950. Elle me racontait que les sœurs étaient encore là, en civil, et qu'elles enseignaient toujours. Les cellules des religieuses étaient devenues des salles de classe. L'histoire continue autrement.",
    sources: [
      'Daguin, Gérard. "Les Ursulines à Sens." histoire-sens-senonais-yonne.com.',
    ],
    period: '1643 — présent',
    audioUrl: null,
  },

  // =========================================================================
  // OSTEL DE L'ESCU (item 30)
  // =========================================================================
  {
    id: 'f6666666-0038-0038-0038-000000000038',
    heritageItemId: 'e5555555-0030-0030-0030-000000000030',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'auberge perdue",
    body: "Au Moyen Âge, il y avait à Sens une auberge appelée l'Ostel de l'Escu — l'Hôtel de l'Écu. C'est là que descendaient les voyageurs importants, les marchands de Paris, les clercs en route vers Rome. Daguin a retrouvé sa trace dans les archives à partir de 1493. L'auberge a changé de mains, puis elle a disparu. Ses murs se sont fondus dans le tissu urbain. Aujourd'hui personne ne sait exactement où elle se trouvait. Mais elle est quelque part là, sous les crépis modernes.",
    sources: [
      'Daguin, Gérard. "Que reste-t-il de l\'Ostel de l\'Escu ?" histoire-sens-senonais-yonne.com.',
    ],
    period: 'XVe — XVIIe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // SAINT-PIERRE-LE-VIF (item 34) — Odoranne
  // =========================================================================
  {
    id: 'f6666666-0042-0042-0042-000000000042',
    heritageItemId: 'e5555555-0034-0034-0034-000000000034',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le premier intellectuel de Sens : Odoranne (XIe siècle)",
    body: "Le monastère Saint-Pierre-le-Vif a été fondé au Ve siècle. C'est la plus ancienne fondation monastique de Sens. Son moine le plus célèbre s'appelle Odoranne (vers 985-1046). Il était à la fois chroniqueur, compositeur, sculpteur, mécanicien et orfèvre. Sa « Chronique » est l'une des premières sources écrites sur l'histoire de Sens. Après la Révolution, les bâtiments sont devenus un couvent, puis des locaux municipaux.",
    sources: [
      'SenoN.org, "Odoranne de Sens." senon.org/wordpress/personnalites/.',
      'Bulletin de la Société Archéologique de Sens, passim.',
    ],
    period: 'Ve siècle — présent',
    audioUrl: null,
  },

  // =========================================================================
  // PALAIS DE JUSTICE (item 36) — mariage Saint Louis
  // =========================================================================
  {
    id: 'f6666666-0043-0043-0043-000000000043',
    heritageItemId: 'e5555555-0036-0036-0036-000000000036',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Saint Louis s'est marié ici",
    body: "Le palais de justice actuel est construit sur l'ancien palais royal. C'est là que Saint Louis a fêté son mariage en 1234 (la cérémonie était à la cathédrale). Si vous regardez l'arrière du bâtiment, vous verrez une grosse tour ronde — c'est un morceau de l'enceinte romaine. Saint Louis l'a vue. Les juges qui siègent aujourd'hui rendent la justice au même endroit que les rois de France.",
    sources: [
      'SenoN.org, "Palais de justice." senon.org/wordpress/monuments/.',
    ],
    period: '1234',
    audioUrl: null,
  },

  // =========================================================================
  // HÔTEL DE SENS PARIS (item 40)
  // =========================================================================
  {
    id: 'f6666666-0044-0044-0044-000000000044',
    heritageItemId: 'e5555555-0040-0040-0040-000000000040',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Quand Sens dominait Paris",
    body: "On l'oublie, mais Paris dépendait de Sens. L'évêque de Paris était un subordonné de l'archevêque de Sens. Quand les archevêques montaient à Paris, ils avaient leur propre résidence : l'Hôtel de Sens, dans le Marais. Construit entre 1475 et 1519, c'est l'un des rares bâtiments médiévaux encore debout à Paris. La reine Margot y a séjourné en 1605. Aujourd'hui c'est la Bibliothèque Forney. Quand un Sénonais visite Paris, il devrait s'y arrêter.",
    sources: [
      'SenoN.org, "Hôtel de Sens." senon.org/wordpress/monuments/.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: '1475–1519',
    audioUrl: null,
  },

  // =========================================================================
  // CENTRE COMMERCIAL CLAUDE PARENT (item 41)
  // =========================================================================
  {
    id: 'f6666666-0045-0045-0045-000000000045',
    heritageItemId: 'e5555555-0041-0041-0041-000000000041',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Un supermarché aux Monuments Historiques",
    body: "Le centre commercial Sens-Maillot a été construit en 1970 par l'architecte Claude Parent. C'est un bâtiment étrange : tout est en pente. Pas de murs droits, pas de sols plats. Parent appelait ça la « fonction oblique ». C'est un exemple rare d'architecture expérimentale des années 70, inscrit aux Monuments Historiques en 2011. Un supermarché classé, c'est assez unique en France.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA89000047.',
    ],
    period: '1970',
    audioUrl: null,
  },

  // =========================================================================
  // PLACE DU TAU (item 44) — communauté juive
  // =========================================================================
  {
    id: 'f6666666-0046-0046-0046-000000000046',
    heritageItemId: 'e5555555-0044-0044-0044-000000000044',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La mémoire de la communauté juive de Sens",
    body: "La place du Tau, près de la cathédrale, était l'ancien cimetière juif de Sens. Le nom vient probablement de « taw », la dernière lettre de l'alphabet hébreu. Au Moyen Âge, Sens avait une communauté juive importante. Les grands rabbins du XIIe siècle — les Tossafistes — enseignaient ici. Le quartier juif avait sa boucherie, son moulin, son école. Et puis sont venues les expulsions et les persécutions. Le cimetière est devenu une place. Le nom est resté, comme un dernier signal.",
    sources: [
      'Daguin, Gérard. "La Communauté Juive de Sens." histoire-sens-senonais-yonne.com.',
    ],
    period: 'XIe — XIVe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // ABBAYE SAINT-RÉMY DÉTRUITE (item 46)
  // =========================================================================
  {
    id: 'f6666666-0047-0047-0047-000000000047',
    heritageItemId: 'e5555555-0046-0046-0046-000000000046',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Détruite par les Vikings en 886",
    body: "L'abbaye Saint-Rémy a été fondée vers 830. En 886, les Vikings (qu'on appelait les Normands) ont remonté l'Yonne et l'ont détruite. C'est l'une des cinq abbayes que comptait Sens au Moyen Âge. On ne sait plus exactement où elle se trouvait — les historiens cherchent encore.",
    sources: [
      'SenoN.org, "Abbaye Saint-Rémy." senon.org/wordpress/monuments/.',
    ],
    period: '830–886',
    audioUrl: null,
  },

  // =========================================================================
  // HÔTEL-DIEU DÉTRUIT (item 47)
  // =========================================================================
  {
    id: 'f6666666-0048-0048-0048-000000000048',
    heritageItemId: 'e5555555-0047-0047-0047-000000000047',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'hôpital qui était face à la cathédrale",
    body: "Pendant des siècles, il y avait un hôpital en face de la cathédrale : l'Hôtel-Dieu. Depuis le XIIe siècle, il accueillait les voyageurs et les pauvres. Au XIXe siècle, on l'a démoli pour construire le marché couvert. Une partie de sa façade a été reconstruite grâce à une mécène américaine de Buffalo.",
    sources: [
      'SenoN.org, "Hôtel-Dieu (ancien)." senon.org/wordpress/monuments/.',
    ],
    period: 'XIIe — XIXe siècle',
    audioUrl: null,
  },

  // =========================================================================
  // CAMP DE CÉSAR (item 52)
  // =========================================================================
  {
    id: 'f6666666-0050-0050-0050-000000000050',
    heritageItemId: 'e5555555-0052-0052-0052-000000000052',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Jules César à Sens : six légions aux portes de la ville",
    body: "En 53 avant Jésus-Christ, Jules César a installé six légions romaines près de Sens (qui s'appelait Agedincum). Les Sénons — le peuple gaulois qui a donné son nom à Sens — s'étaient révoltés sous leur chef Acco. César a fait exécuter Acco et a stationné ses troupes pour l'hiver. Le camp se trouvait probablement au sud de la ville, à la Motte du Ciar. On y a retrouvé des monnaies, des morceaux de colonnes, des fragments de marbre.",
    sources: [
      'Daguin, Gérard. "53 avant J-C, 6 légions romaines hivernent." histoire-sens-senonais-yonne.com.',
      'Delor, Jean-Paul. "Carte archéologique de la Gaule : l\'Yonne." MSH, 2002.',
    ],
    period: '53 av. J.-C.',
    audioUrl: null,
  },
  {
    id: 'f6666666-0051-0051-0051-000000000051',
    heritageItemId: 'e5555555-0052-0052-0052-000000000052',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Brennus : quand les Sénonais ont pris Rome",
    body: "Avant que César ne vienne chez nous, c'étaient les Sénons qui faisaient trembler Rome. En 390 avant notre ère, leur chef Brennus est descendu en Italie avec ses guerriers et a pris Rome. Les Romains ont voulu payer une rançon en or pour qu'il parte. Quand ils ont contesté le poids de l'or sur la balance, Brennus a jeté son épée dessus et a dit : « Vae Victis » — malheur aux vaincus. Sa statue est au sommet de l'Hôtel de Ville de Sens.",
    sources: [
      'SenoN.org, "Brennus." senon.org/wordpress/personnalites/.',
    ],
    period: '390 av. J.-C.',
    audioUrl: null,
  },

  // =========================================================================
  // CHÂTEAU DE NOSLON (item 53)
  // =========================================================================
  {
    id: 'f6666666-0052-0052-0052-000000000052',
    heritageItemId: 'e5555555-0053-0053-0053-000000000053',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La maison de campagne des archevêques",
    body: "Le château de Noslon, à quelques kilomètres au nord de Sens, était la résidence de vacances des archevêques. Ils l'ont acheté entre 1252 et 1272. Le cardinal de Luynes l'a fait reconstruire vers 1750. À la Révolution, le château a été vendu et démoli. Ses pierres ont servi à construire le premier théâtre de Sens en 1808. Aujourd'hui, il ne reste que la ferme, exploitée par les Vergers de Noslon.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: '1252–1790',
    audioUrl: null,
  },

  // =========================================================================
  // PATRIMOINE INDUSTRIEL
  // =========================================================================

  // Usine à plomb (item 54)
  {
    id: 'f6666666-0065-0065-0065-000000000065',
    heritageItemId: 'e5555555-0054-0054-0054-000000000054',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La plus grande usine de Sens au XIXe siècle",
    body: "Au milieu du XIXe siècle, deux moulins à farine du cours Tarbé sont devenus une usine. La société Lelièvre et Muleur Frères fabriquait des boutons, des boucles, des agrafes, puis s'est spécialisée dans les capsules de plomb pour fermer les bouteilles (à la place de la cire). C'est devenu la plus grande usine de Sens, avec jusqu'à 300 ouvriers — beaucoup de femmes. Aujourd'hui, le bâtiment avec ses arcades en brique et en fer est une friche industrielle. Un projet de reconversion en logements est en cours.",
    sources: [
      'SenoN.org, "Usine à plomb." senon.org/wordpress/monuments/.',
      'Bulletin de la Société Archéologique de Sens, passim.',
    ],
    period: '1850–1950',
    audioUrl: null,
  },

  // Tanneries (item 55)
  {
    id: 'f6666666-0066-0066-0066-000000000066',
    heritageItemId: 'e5555555-0055-0055-0055-000000000055',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le quartier qui sentait le cuir",
    body: "Le quartier sud de Sens était le quartier des tanneurs. Des dizaines d'ateliers transformaient les peaux de bêtes en cuir. Le Moulin à Tan, au bord de la Vanne, pilait l'écorce de chêne des forêts alentour pour produire le tanin. L'odeur était légendaire. La famille Domange a exploité le moulin à partir de 1887. L'activité a décliné dans les années 1950. La Ville a racheté le terrain en 1983 et l'a transformé en parc public en 1989 — le Parc du Moulin à Tan, avec ses serres tropicales et sa roseraie.",
    sources: [
      'SenoN.org, "Moulin à Tan." senon.org/wordpress/monuments/.',
    ],
    period: 'XVIIe — XXe siècle',
    audioUrl: null,
  },

  // Presse sénonaise (item 61)
  {
    id: 'f6666666-0067-0067-0067-000000000067',
    heritageItemId: 'e5555555-0061-0061-0061-000000000061',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "180 ans de presse à Sens",
    body: "Sens a toujours eu ses journaux. Le premier, « Le Sénonais » (1845-1871), était monarchiste et catholique. Son rival, le « Courrier de l'Yonne » (1863-1898), était bonapartiste et anticlérical. À la Libération en 1944, « Le Sénonais Libéré » a remplacé les journaux qui avaient collaboré. En 1995, il est devenu « L'Indépendant de l'Yonne », repris par quatre journalistes salariés. Depuis deux ans, le papier a disparu : le journal est gratuit, numérique, et accessible sur smartphone.",
    sources: [
      'BnF/Gallica, "Presse locale ancienne de l\'Yonne." presselocaleancienne.bnf.fr.',
      'L\'Indépendant de l\'Yonne, "80 ans de passion pour la presse locale." 2024.',
    ],
    period: '1845 — présent',
    audioUrl: null,
  },

  // Mimard / Manufrance (item 76)
  {
    id: 'f6666666-0068-0068-0068-000000000068',
    heritageItemId: 'e5555555-0076-0076-0076-000000000076',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Étienne Mimard : le Sénonais qui a inventé la vente par correspondance",
    body: "Étienne Mimard est né à Sens en 1862. Son père était armurier. Le fils est parti à Saint-Étienne en 1883 et a cofondé la Manufacture Française d'Armes et Cycles — qui deviendra Manufrance. Il a inventé un truc révolutionnaire : un catalogue de vente par correspondance. Le catalogue Manufrance a atteint 1 million d'exemplaires. Il publiait aussi « Le Chasseur Français ». Ses fusils (Robust, Ideal, Simplex) ont équipé des générations de chasseurs. Un gars de Sens qui a transformé le commerce français, bien avant Amazon.",
    sources: [
      'SenoN.org, "Étienne Mimard." senon.org/wordpress/personnalites/.',
      'Daguin, Gérard. "Étienne Mimard." histoire-sens-senonais-yonne.com.',
    ],
    period: '1862–1944',
    audioUrl: null,
  },

  // Jules Guichard / Canal de Suez (item 77)
  {
    id: 'f6666666-0069-0069-0069-000000000069',
    heritageItemId: 'e5555555-0077-0077-0077-000000000077',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Jules Guichard : du Sénonais au Canal de Suez",
    body: "Jules Guichard est né en 1827 à Soucy, près de Sens. Il a fait fortune à Paris dans le gaz, puis Ferdinand de Lesseps l'a envoyé en Égypte développer le canal de Suez. Guichard y a passé onze ans. Il est devenu vice-président puis président de la Compagnie du Canal. Sénateur de l'Yonne jusqu'à sa mort en 1896. La rue Guichard à Sens porte son nom. Un paysan de l'Yonne devenu patron du Canal de Suez — l'aventure industrielle sénonaise à son sommet.",
    sources: [
      'Daguin, Gérard. "Victor et Jules Guichard." histoire-sens-senonais-yonne.com.',
      'Sénat, fiche biographique Jules Guichard. senat.fr.',
    ],
    period: '1827–1896',
    audioUrl: null,
  },

  // =========================================================================
  // SÉNONAIS ÉLARGI — Villeneuve-sur-Yonne
  // =========================================================================

  // Denis / Enceinte Villeneuve — historique
  {
    id: 'f6666666-0070-0070-0070-000000000070',
    heritageItemId: 'e5555555-0070-0070-0070-000000000070',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La cité royale fondée par Louis VII",
    body: "Villeneuve-sur-Yonne a été fondée en 1163 par le roi Louis VII — le père de Philippe Auguste. C'est une « ville neuve » royale, construite de zéro avec un plan régulier, des remparts et deux portes monumentales. Le roi voulait contrôler le passage sur l'Yonne et affirmer son pouvoir face aux seigneurs locaux. L'enceinte médiévale est encore en partie intacte — c'est l'une des mieux conservées de Bourgogne. Les deux portes (Porte de Sens au nord, Porte de Joigny au sud) sont toujours debout, sept siècles après.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'Mairie de Villeneuve-sur-Yonne, "Patrimoine." villeneuve-yonne.fr.',
    ],
    furtherReading: "Villeneuve-le-Roy (ancien nom) apparaît dans l'Armorial d'Hozier (1696) avec le blason du Couvent des Religieuses Bénédictines. La ville a été renommée « Villeneuve-sur-Yonne » à la Révolution. Les fortifications ont fait l'objet d'études dans le Bulletin SAS. Le menhir néolithique (classé 1954) témoigne d'une occupation bien antérieure à la fondation royale.",
    period: '1163 — présent',
    audioUrl: null,
  },
  // Bernard / Maison Joseph Joubert — récit
  {
    id: 'f6666666-0071-0071-0071-000000000071',
    heritageItemId: 'e5555555-0072-0072-0072-000000000072',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le philosophe qui n'a rien publié",
    body: "Joseph Joubert est né à Montignac en 1754 mais a passé une grande partie de sa vie à Villeneuve-sur-Yonne, où il est mort en 1824. C'était un philosophe, un moraliste, un ami de Chateaubriand. Il n'a jamais rien publié de son vivant. Pas un livre, pas un article. Tout ce qu'on connaît de lui, ce sont des carnets de pensées retrouvés après sa mort. Chateaubriand les a édités. « Chercher la lumière, la faire naître » — c'est du Joubert. Un penseur qui n'avait pas besoin d'être lu pour avoir raison.",
    sources: [
      'SenoN.org, personnalités de Villeneuve-sur-Yonne.',
    ],
    period: '1754–1824',
    audioUrl: null,
  },

  // =========================================================================
  // POTINS DES SÉNONS (item 73) — monnaies gauloises, 3 contributions
  // =========================================================================

  // Denis / Potins — historique (catalogue numismatique)
  {
    id: 'f6666666-0073-0073-0073-000000000001',
    heritageItemId: 'e5555555-0073-0073-0073-000000000073',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: 'Les potins des Sénons : catalogue et classification',
    body: "Les Sénons, peuple gaulois dont la capitale était Agedincum (Sens), ont produit des monnaies coulées en alliage de bronze riche en étain entre le IIe et le Ier siècle avant notre ère. Ces « potins » étaient fabriqués par coulée en chapelet : le métal fondu était versé dans des moules en grappe, ce qui produisait plusieurs monnaies d'un coup. Le « penon de coulée » visible sur le flan est la cicatrice de ce procédé.\n\nDix types principaux sont identifiés. Le plus courant est le potin « à la tête d'indien » (DT 2640-2641 / LT 7417), dont 347 exemplaires ont été étudiés pour la seule classe I. Il pèse en moyenne 4,04 g pour 18 mm de diamètre. L'avers montre une tête stylisée à droite avec six mèches globulées ; le revers un cheval passant à gauche.\n\nLes autres types incluent : la variante au torque (LT 7417 var., exemplaire unique connu), la variante au sanglier-enseigne (DT 2645 / LT 7445), le potin à la grosse tête casquée (DT 2646 / LT 7396), le potin à la tête casquée et à la rosace (DT 150 / LT 7388), le potin à la tête casquée et au taureau à queue ondulée (DT.S 3209 A / PC 26), et le potin à la tête casquée et à l'annelet pointé (DT 2651 / LT 7447).\n\nDeux bronzes frappés (et non coulés) complètent la série : le bronze YLLYCCI à l'oiseau (LT 7493), très abondant en 11 classes stylistiques, et le rare bronze SIINV à l'oiseau (DT 2633 / LT 7552). YLLYCCI et SIINV sont probablement des noms de magistrats ou de chefs — les seules inscriptions monétaires gauloises connues pour les Sénons.\n\nL'analyse métallique de la classe I « tête d'indien » donne : cuivre 78-82 %, étain 12-21 % (variable), plomb 0,1-4,7 %. Cette composition est caractéristique des potins gaulois de l'est de la Gaule.",
    sources: [
      'Delestrée, L.-P. et Tache, M. Nouvel Atlas des monnaies gauloises (DT), Paris, 2002-2007.',
      'La Tour, H. de. Atlas de monnaies gauloises (LT), Paris, 1892 (réédition Poncet 2020).',
      'Catalogue en ligne CGBfr — archives gauloises : cgb.fr/archive,gauloises.html.',
      'Numista — catalogue Sénons : numista.com/catalogue/senons_gaule-1.html.',
    ],
    furtherReading: "L'attribution tribale des potins reste débattue : le même type (« au taureau et au lys ») circule chez les Sénons, les Tricasses (Troyes) et les Lingons. La numismatique gauloise raisonne en zones de circulation plutôt qu'en émetteurs uniques. Le type « à la tête casquée et au taureau » (dit « au casque cimmérien ») est attribué tantôt aux Sénons, tantôt aux Tricasses par H. Patat. Pour une cartographie des trouvailles, consulter les Bulletins de la Société Archéologique de Sens et le Gallia (OpenEdition). Les ~200 nécropoles protohistoriques du Sénonais (Âge du Bronze final → La Tène finale) ont été complétées par les fouilles de l'autoroute A5. Le numismate professionnel « Aux Potins Senons » (51 rue Émile Zola, Sens) conserve une expertise locale précieuse.",
    period: 'IIe–Ier s. av. J.-C.',
    audioUrl: null,
  },
  // Denis / Potins — historique (territoire et circulation)
  {
    id: 'f6666666-0073-0073-0073-000000000002',
    heritageItemId: 'e5555555-0073-0073-0073-000000000073',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: 'Agedincum et le territoire monétaire des Sénons',
    body: "Le territoire des Sénons au Ier siècle avant notre ère couvrait les actuels départements de l'Yonne et du sud de la Seine-et-Marne, avec des extensions dans le Loiret, l'Essonne, la Marne et l'Aube. Leur capitale, Agedincum (Sens), occupait une position stratégique au carrefour des vallées de l'Yonne et de la Seine, facilitant le commerce entre les zones nord-alpines et atlantiques.\n\nCésar mentionne trois oppida sénons dans la Guerre des Gaules : Agedincum (Sens), Metlosedum (Melun ?) et Vellaunodunum (Montargis ou Château-Landon ?). En 53 av. J.-C., il a hiverné six légions à Agedincum. Le grand sanctuaire de Villeneuve-aux-Châtelots (Aube) et les fouilles de Saint-Valérien (Yonne) complètent le tableau d'un peuple organisé.\n\nLa circulation des potins ne respecte pas les frontières politiques. Certains types circulent à la frontière entre Sénons et Tricasses, avec la Seine et la Bassée comme axe principal. Le potin « au taureau et au lys » en est l'exemple : B. Foucray a suggéré qu'il provient « du cœur d'un territoire chevauchant les marges des Sénons et des Tricasses ». Cette fluidité monétaire reflète la réalité des échanges commerciaux gaulois.",
    sources: [
      'César. La Guerre des Gaules, VII, 10-11 (Agedincum, Vellaunodunum).',
      'Gallia — "Sens/Agedincum, cité des Sénons" : journals.openedition.org/gallia/1546.',
      'Cairn.info — "Les limites de la cité gallo-romaine des Sénons", Hypothèses 2005/1.',
      'OpenEdition Books — Nécropoles protohistoriques du Sénonais.',
    ],
    furtherReading: "Des fouilles récentes de l'Inrap à Saint-Valérien ont révélé un ensemble religieux inédit de la cité des Sénons. L'urbanisation romaine d'Agedincum couvrait environ 110 ha avec un quadrillage régulier. L'Arbre Celtique (arbre-celtique.com) et le site agendicum.over-blog.com documentent l'archéologie sénonaise de manière accessible.",
    period: 'IIe–Ier s. av. J.-C.',
    audioUrl: null,
  },
  // Bernard / Potins — récit (les Sénons et leurs monnaies)
  {
    id: 'f6666666-0073-0073-0073-000000000003',
    heritageItemId: 'e5555555-0073-0073-0073-000000000073',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Quand Sens frappait — pardon, coulait — sa propre monnaie",
    body: "Avant que les Romains n'arrivent, les Sénonais avaient leur propre monnaie. Pas des pièces frappées au marteau comme les Romains — non, les Gaulois coulaient les leurs. Ils versaient du bronze fondu dans des moules en grappe, comme on fait des gaufres. Ça donnait des petites pièces un peu rugueuses, avec des traces de coulée sur le bord. On les appelle des « potins ».\n\nLa plus connue, c'est celle qu'on a surnommée « la tête d'indien ». Elle ne représente pas un Indien d'Amérique, évidemment — on est trois cents ans avant Jésus-Christ. Mais la coiffure stylisée, avec ses mèches tirées en arrière et terminées par des petites boules, ça fait penser à une coiffe. D'un côté la tête, de l'autre un petit cheval. Il en existe des centaines.\n\nD'autres montrent un taureau qui charge, un sanglier — l'emblème guerrier gaulois —, ou un oiseau mystérieux avec un pentagramme. Et sur certaines, on peut lire des noms : YLLYCCI, SIINV. Ce sont peut-être des chefs, peut-être des magistrats. Personne ne sait exactement.\n\nCe qui est fascinant, c'est que ces monnaies circulaient bien au-delà de Sens. On en retrouve jusqu'à Troyes, dans toute la vallée de la Seine. Les frontières entre peuples gaulois étaient plus floues qu'on ne le croit. Aujourd'hui encore, le numismate « Aux Potins Senons » — 51 rue Émile Zola à Sens — perpétue cette passion.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'Catalogue Numista — Sénons : numista.com/catalogue/senons_gaule-1.html.',
    ],
    period: 'IIe–Ier s. av. J.-C.',
    audioUrl: null,
  },

  // =========================================================================
  // BATCH 3 — Items 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 71
  // =========================================================================

  // Bernard / Hôtel de la Pointe (item 58)
  {
    id: 'f6666666-0100-0100-0100-000000000100',
    heritageItemId: 'e5555555-0058-0058-0058-000000000058',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'Hôtel de la Pointe : quand on vendait le poisson au coin de la rue",
    body: "À Sens, au croisement de la rue de la République et de la rue Jean-Cousin, il y a un bâtiment que tout le monde connaît sans vraiment le regarder. On l'appelle l'Hôtel de la Pointe, à cause de sa forme en angle aigu — il épouse la fourche entre les deux rues. Mais au XVIe siècle, vers 1537, ce n'était pas un hôtel au sens moderne. C'était le marché au poisson de la ville.\n\nIl faut imaginer l'endroit un jour de marché : des étals en bois, de l'eau qui coule, l'odeur du poisson de rivière — brochet, anguille, carpe de l'Yonne et de la Vanne. Sens était une ville d'archevêché, et pendant le Carême, le poisson remplaçait la viande sur toutes les tables. Le marché au poisson n'était pas un lieu secondaire, c'était un endroit stratégique.\n\nAujourd'hui, la façade a été remaniée, mais la forme en pointe est toujours là. C'est l'un de ces bâtiments qui racontent l'histoire sans plaque ni panneau — il suffit de lever les yeux.",
    sources: [
      'Daguin, Gérard. "Chroniques historiques du Sénonais." histoire-sens-senonais-yonne.com.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: 'XVIe siècle (v. 1537)',
    audioUrl: null,
  },
  // Denis / Ancien relais de poste (item 59)
  {
    id: 'f6666666-0101-0101-0101-000000000101',
    heritageItemId: 'e5555555-0059-0059-0059-000000000059',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le relais de poste de Sens : un maillon de la route royale Paris–Lyon",
    body: "Au XVIIIe siècle, Sens occupait une position clé sur la route royale de Paris à Lyon. La ville disposait d'un relais de poste, institution essentielle dans le système de transport de l'Ancien Régime. Les relais de poste étaient espacés d'environ quinze kilomètres et tenus par des maîtres de poste. Leur fonction : fournir des chevaux frais aux courriers royaux et aux diligences.\n\nLe relais sénonais comprenait le logement du maître de poste, des écuries, un grenier à foin et une remise pour les voitures. C'était à la fois un lieu technique — on y changeait les attelages en quelques minutes — et un lieu social, où les voyageurs pouvaient se restaurer ou passer la nuit.\n\nLe système des relais de poste a fonctionné de 1477, sous Louis XI, jusqu'à l'arrivée du chemin de fer dans les années 1840. En 1776, Turgot a réformé le service en créant les malles-postes. Sens, étape entre Paris et Auxerre, voyait passer les messageries royales, les diligences privées et les courriers diplomatiques.",
    sources: [
      'Vaillé, Eugène. "Histoire des postes françaises depuis la Révolution." PUF, 1947.',
      'Daguin, Gérard. "Chroniques historiques du Sénonais." histoire-sens-senonais-yonne.com.',
    ],
    period: 'XVIIIe siècle',
    audioUrl: null,
  },
  // Bernard / Hôtel de Paris et de la Poste (item 60)
  {
    id: 'f6666666-0102-0102-0102-000000000102',
    heritageItemId: 'e5555555-0060-0060-0060-000000000060',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'Hôtel de Paris : deux siècles de voyageurs, une guerre, et puis plus rien",
    body: "En 1796, en pleine Révolution, un certain Dominique Louge a ouvert une auberge au centre de Sens. Il l'a appelée « l'Auberge de la Ville de Paris ». L'affaire a prospéré. De génération en génération, l'auberge est devenue un vrai hôtel, puis un hôtel-restaurant réputé. En 1936, quand un bureau de poste s'est installé juste à côté, il a pris le nom d'Hôtel de Paris et de la Poste.\n\nPendant la Seconde Guerre mondiale, la Wehrmacht a réquisitionné l'établissement. La Feldgendarmerie — la police militaire allemande — y a installé ses quartiers de 1940 à 1944. Des Sénonais y ont été convoqués pour des interrogatoires. Après la Libération, l'hôtel a repris sa vocation première.\n\nÀ partir de 1980, la famille Godard, maîtres cuisiniers de père en fils, y a tenu table avec talent. Mais le 1er janvier 2020, l'hôtel a fermé définitivement. En 2021, les pelleteuses ont commencé la démolition. La façade, restée debout quelques semaines comme un décor de théâtre, a fini par tomber en juillet 2021. À sa place, un nouvel hôtel quatre étoiles a ouvert fin 2024 sous le nom d'Epona, du nom de la déesse gauloise des chevaux.",
    sources: [
      'Daguin, Gérard. "Des lieux et des hommes : l\'Hôtel de Paris et de la Poste." histoire-sens-senonais-yonne.com.',
      'France Bleu Auxerre. "À Sens, la destruction de la façade de l\'hôtel de Paris a commencé." 23 juin 2021.',
    ],
    period: '1796–2021',
    audioUrl: null,
  },
  // Denis / Square Jean Cousin (item 62)
  {
    id: 'f6666666-0103-0103-0103-000000000103',
    heritageItemId: 'e5555555-0062-0062-0062-000000000062',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le square Jean Cousin : un jardin de 1880 pour un peintre de la Renaissance",
    body: "Le square Jean Cousin, seul jardin public de Sens à présenter un aménagement typiquement XIXe siècle, a été inauguré le samedi 2 octobre 1880. La conception en a été confiée à Joseph Heim, horticulteur sénonais, qui a dessiné un jardin à l'anglaise avec six corbeilles florales.\n\nAu centre du square trône la statue en bronze de Jean Cousin, œuvre du sculpteur Henri Chapu (1833-1891). Chapu, l'un des sculpteurs les plus en vue de la IIIe République, a été élu la même année à l'Académie des beaux-arts. La statue porte l'inscription « Jehan Covsin, érigé en 1880 ».\n\nJean Cousin le Père, né vers 1490 à Soucy, fils de vigneron, s'est d'abord formé comme peintre-verrier dans sa ville natale avant de s'installer à Paris vers 1538. On lui attribue le tableau Eva Prima Pandora, aujourd'hui au Louvre, considéré comme le premier grand nu de la peinture française. Son fils, Jean Cousin le Jeune, a poursuivi dans la même voie. La confusion entre père et fils a longtemps brouillé les attributions — c'est Maurice Roy qui les a distingués en 1909.",
    sources: [
      'Daguin, Gérard. "Jean Cousin, au nom du père, du fils, du square." histoire-sens-senonais-yonne.com.',
      'Comité des Parcs et Jardins de France, fiche "Square Jean Cousin, Sens."',
    ],
    period: '1880 (statue) — Renaissance (Jean Cousin, v. 1490–1560)',
    audioUrl: null,
  },
  // Bernard / Hospice des orphelines (item 63)
  {
    id: 'f6666666-0104-0104-0104-000000000104',
    heritageItemId: 'e5555555-0063-0063-0063-000000000063',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les orphelines de Sens : quand Mademoiselle de Marsangy ouvrit sa porte",
    body: "Vers 1680, une femme de Sens, Cécile-Guillaume de Marsangy, a commencé à recueillir chez elle les petites filles orphelines de la ville et des faubourgs. Ces enfants n'avaient ni toit, ni famille, ni moyen de gagner leur vie. Mademoiselle de Marsangy les hébergeait, les nourrissait et leur apprenait un métier.\n\nLa nouvelle est arrivée aux oreilles de Nicolas Bellocier, un Sénonais installé à Paris qui avait fait fortune dans le commerce. Touché par cette initiative, il a proposé son aide. Ensemble, ils ont fondé un véritable hospice : la Maison des Orphelines de Sens. En juillet 1680, le roi Louis XIV a signé les lettres patentes autorisant l'établissement, depuis le château de Saint-Germain-en-Laye.\n\nMademoiselle de Marsangy ne s'est pas contentée de donner de l'argent : elle est devenue la première gouvernante de la maison et l'est restée pendant quarante-deux ans, jusqu'à sa mort. Les orphelines apprenaient la couture, le filage et les tâches ménagères qui leur permettraient de se placer comme domestiques ou de se marier.\n\nLe nom de Bellocier est resté attaché à la fondation — un exemple de charité privée sous l'Ancien Régime, à une époque où l'État ne prenait pas en charge l'enfance abandonnée.",
    sources: [
      'Daguin, Gérard. "De Marsangy — histoire liée aux rues." histoire-sens-senonais-yonne.com.',
      'Archives départementales de l\'Yonne, fonds Hôpital de Sens.',
    ],
    period: 'XVIIe siècle (fondation 1680)',
    audioUrl: null,
  },
  // Denis / Temple maçonnique (item 64)
  {
    id: 'f6666666-0105-0105-0105-000000000105',
    heritageItemId: 'e5555555-0064-0064-0064-000000000064',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La loge « La Concorde » : la franc-maçonnerie sénonaise depuis le XVIIIe siècle",
    body: "La franc-maçonnerie sénonaise est l'une des plus anciennes du département de l'Yonne. La première loge fondée dans le département s'appelait « La Concorde », à l'orient de Sens. Elle s'est constituée au XVIIIe siècle, dans le sillage des Lumières, sous l'obédience du Grand Orient de France.\n\nLe temple maçonnique situé quai de l'Yonne est le lieu de réunion de cette loge. Les temples maçonniques ne sont pas des lieux de culte au sens religieux : ce sont des espaces rituels où les membres se réunissent selon un cérémonial codifié. L'architecture intérieure suit des règles précises — un orient (l'est, où siège le vénérable maître), un occident (l'entrée), des colonnes symboliques.\n\nLe Grand Orient de France, fondé en 1773, est la plus ancienne obédience maçonnique française. Depuis 1877, il n'impose plus la croyance en Dieu comme condition d'admission. Le bâtiment du quai de l'Yonne est discret, conformément à la tradition maçonnique. Les temples ouvrent occasionnellement lors des Journées du Patrimoine.",
    sources: [
      'Grand Orient de France, site officiel (godf.org).',
      'Daguin, Gérard. "Chroniques historiques du Sénonais." histoire-sens-senonais-yonne.com.',
    ],
    period: 'XVIIIe siècle — présent',
    audioUrl: null,
  },
  // Bernard / Bibliothèque municipale (item 65)
  {
    id: 'f6666666-0106-0106-0106-000000000106',
    heritageItemId: 'e5555555-0065-0065-0065-000000000065',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Le géant de la bibliothèque : un séquoia de 34 mètres au cœur de Sens",
    body: "Dans le jardin de la médiathèque Jean-Christophe Rufin, rue René Binet à Sens, il y a un arbre qui dépasse tous les autres. Un séquoia géant — 34 mètres de haut, presque 7 mètres de tour. On le voit de loin, il domine les toits du quartier. Il a été planté vers 1863, à une époque où la France se passionnait pour les arbres exotiques ramenés de Californie.\n\nLe séquoia géant a été introduit en Europe dans les années 1850. Les premiers spécimens sont arrivés en France sous le Second Empire — époque de grands jardins, de serres monumentales et de curiosités botaniques. Partout, les propriétaires de parcs voulaient le leur. En planter un, c'était montrer qu'on était moderne, qu'on avait le goût du monde.\n\nCelui de Sens a donc plus de 160 ans. Il a vu passer deux guerres, la construction de la bibliothèque, la transformation du quartier. En 2011, il a été labellisé « arbre remarquable ». En Californie, les séquoias géants peuvent vivre plus de 3 000 ans et atteindre 80 mètres. Le nôtre est encore un adolescent, à l'échelle de son espèce. Si personne ne le coupe, il sera encore là dans plusieurs siècles.",
    sources: [
      'Tourisme Sens. "Jardin de la médiathèque Jean-Christophe Rufin."',
      'Séquoias géants de France (sequoias.eu), fiche Sens (Yonne).',
    ],
    period: 'v. 1863 — présent',
    audioUrl: null,
  },
  // Denis / Porte de Sens, Villeneuve-sur-Yonne (item 66)
  {
    id: 'f6666666-0107-0107-0107-000000000107',
    heritageItemId: 'e5555555-0066-0066-0066-000000000066',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La Porte de Sens : verrou nord de la cité royale de Philippe Auguste",
    body: "La Porte de Sens est la porte nord des fortifications médiévales de Villeneuve-sur-Yonne. Elle a été construite vers 1200 sur ordre du roi Philippe Auguste, dans le cadre de la fondation de la ville neuve — une bastide royale destinée à contrôler le passage sur l'Yonne.\n\nL'enceinte comprenait cinq portes fortifiées. La Porte de Sens, orientée vers le nord en direction de la métropole archiépiscopale, est la mieux conservée avec la Porte de Joigny. Elle se présente comme un donjon carré flanqué de quatre tourelles d'angle — circulaires côté ville, taillées en éperon côté campagne pour dévier les projectiles.\n\nLe système défensif est remarquable : sous la voûte, on distingue encore les rainures de deux herses, formant un sas entre lesquelles les défenseurs pouvaient piéger les assaillants. Des archères latérales complétaient le dispositif.\n\nLes portes de Sens et de Joigny ont été classées au titre des monuments historiques par le décret de 1862, dans la première liste Mérimée. Une restauration menée en 1995 a permis de remettre en état le soubassement.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113949.',
      'Mairie de Villeneuve-sur-Yonne. "La Porte de Sens." villeneuve-yonne.fr.',
    ],
    period: 'v. 1200 — classement MH 1862',
    audioUrl: null,
  },
  // Bernard / Porte de Joigny (item 67)
  {
    id: 'f6666666-0108-0108-0108-000000000108',
    heritageItemId: 'e5555555-0067-0067-0067-000000000067',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La Porte de Joigny : huit siècles de garde au sud de la ville",
    body: "Quand on entre dans Villeneuve-sur-Yonne par le sud, on passe sous une grosse tour carrée coiffée d'un toit d'ardoise. C'est la Porte de Joigny, jumelle de la Porte de Sens au nord. Elle a été construite vers 1200, quand Philippe Auguste a fondé cette ville neuve au bord de l'Yonne.\n\nMais la Porte de Joigny a eu plusieurs vies. Au Moyen Âge, c'était une machine de guerre : deux herses, des archères, des mâchicoulis. Personne n'entrait sans y être invité. Puis la Renaissance est passée par là. On a percé des fenêtres à meneaux dans la façade, ajouté un grand toit d'ardoise et posé deux statues en plomb au sommet. La porte s'est transformée en bâtiment de prestige.\n\nAu XVIIIe siècle, on y a installé l'hôtel de ville et une cellule de détention — jusqu'en 1837. Imaginez : le maire délibérait à l'étage pendant qu'un prisonnier attendait au rez-de-chaussée.\n\nAujourd'hui, la Porte de Joigny abrite un petit musée consacré à l'histoire de la ville. Elle est classée monument historique depuis 1862, comme sa sœur du nord.",
    sources: [
      'Mairie de Villeneuve-sur-Yonne. "Porte de Joigny." villeneuve-yonne.fr.',
      'Ministère de la Culture, base Mérimée, notice PA00113949.',
    ],
    period: 'v. 1200 — classement MH 1862',
    audioUrl: null,
  },
  // Denis / Église Notre-Dame de l'Assomption (item 68)
  {
    id: 'f6666666-0109-0109-0109-000000000109',
    heritageItemId: 'e5555555-0068-0068-0068-000000000068',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Notre-Dame de Villeneuve : le pape qui posa la première pierre de deux églises",
    body: "L'église Notre-Dame de l'Assomption de Villeneuve-sur-Yonne possède un acte de naissance exceptionnel : sa première pierre aurait été posée en 1163 par le pape Alexandre III — le même pape qui posa celle de Notre-Dame de Paris la même année. Le pontife résidait alors à Sens, où il s'était réfugié après avoir été chassé de Rome par Frédéric Barberousse.\n\nToutefois, la construction effective de l'édifice n'a commencé qu'au premier quart du XIIIe siècle, vers 1215. Le chantier s'est étalé sur trois siècles, du XIIIe au XVIe, mais présente une unité remarquable : chaque maître d'œuvre a respecté le plan conçu par le premier architecte.\n\nL'église mesure 71 mètres de long, 19 mètres de large et 22 mètres sous voûte. La nef sans transept — un vaisseau unique — est un bel exemple de maturité de l'art gothique. L'influence du gothique champenois est sensible dans l'omniprésence des grandes verrières : 41 fenêtres, dont 23 dans la nef. Quatre grandes fenêtres du côté nord du chœur conservent encore leurs vitraux du XIIIe siècle.\n\nClassée monument historique en 1862.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113945.',
      'Mairie de Villeneuve-sur-Yonne. "L\'église Notre-Dame de l\'Assomption." villeneuve-yonne.fr.',
    ],
    period: '1163 (première pierre) — XIIIe–XVIe s. (construction)',
    audioUrl: null,
  },
  // Bernard / Maison des Sept Têtes (item 69)
  {
    id: 'f6666666-0110-0110-0110-000000000110',
    heritageItemId: 'e5555555-0069-0069-0069-000000000069',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les Sept Têtes : quand les dieux de l'Olympe surveillent la rue Carnot",
    body: "Au numéro 41 de la rue Carnot, à Villeneuve-sur-Yonne, sept visages de pierre vous observent depuis la façade d'une belle maison du XVIIIe siècle. Ce sont les « Sept Têtes » qui donnent son nom à l'édifice : Pluton, Neptune, Flore, Mercure, Cérès, Bacchus et Jupiter. Sept divinités de la mythologie romaine, sculptées en relief au-dessus des fenêtres.\n\nPourquoi sept dieux païens sur une maison de province ? Parce que son propriétaire voulait afficher sa culture classique. La maison a été construite pour un bailli — un juge et administrateur royal. C'était un notable instruit, formé au droit romain, qui connaissait ses classiques latins. Faire sculpter les dieux de l'Olympe sur sa façade, c'était montrer son rang.\n\nLa rue Carnot relie la Porte de Sens à la Porte de Joigny — c'est la colonne vertébrale de la ville. Le bailli avait choisi l'emplacement le plus visible. La maison a été inscrite au titre des monuments historiques le 3 juin 1932. Elle a ensuite servi de relais de poste. Aujourd'hui restaurée, elle fait partie du domaine des Sept-Têtes.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113947.',
      'Mairie de Villeneuve-sur-Yonne. "La Maison des Sept Têtes." villeneuve-yonne.fr.',
    ],
    period: 'XVIIIe siècle — inscrit MH 1932',
    audioUrl: null,
  },
  // Denis / Menhir de Villeneuve-sur-Yonne (item 71)
  {
    id: 'f6666666-0111-0111-0111-000000000111',
    heritageItemId: 'e5555555-0071-0071-0071-000000000071',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La Pierre Frite : un menhir néolithique aux portes de Villeneuve",
    body: "Le menhir dit de la « Pierre Frite » (ou Pierre Fritte) se dresse dans la plaine des Égriselles, à proximité de Villeneuve-sur-Yonne. C'est un bloc de conglomérat rougeâtre mesurant 1,60 mètre de hauteur, 2 mètres de longueur et 70 centimètres d'épaisseur, orienté est/nord-est. Il date du Néolithique, période comprise entre 5000 et 2000 avant notre ère.\n\nLe terme « menhir » vient du breton men (pierre) et hir (longue). Les menhirs sont parmi les plus anciens monuments érigés par l'homme en Europe occidentale. Leur fonction exacte reste débattue : borne territoriale, marqueur astronomique, lieu de culte ?\n\nLe contexte archéologique renforce l'intérêt du site : en 1938, une nécropole protohistorique a été découverte à environ 200 mètres au nord du menhir. Elle comprenait quinze enclos circulaires, dont onze ont été fouillés en 1976, 1978 et 1982. Le mobilier funéraire — notamment des bracelets en bronze — est conservé au musée du Villeneuvien. Cette association menhir-nécropole suggère que le lieu était un espace sacré bien avant la fondation de la ville médiévale.\n\nClassé au titre des monuments historiques par arrêté du 7 septembre 1954.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113948.',
      'Monumentum.fr, fiche "Menhir à Villeneuve-sur-Yonne — PA00113948."',
    ],
    period: 'Néolithique (v. 5000–2000 av. J.-C.) — classement MH 1954',
    audioUrl: null,
  },

  // =========================================================================
  // BATCH 2 — Items 18, 19, 23, 26, 29, 31, 35, 37, 38, 39, 43, 50, 56
  // =========================================================================

  // Bernard / Maison du Portail (item 18)
  {
    id: 'f6666666-0087-0087-0087-000000000087',
    heritageItemId: 'e5555555-0018-0018-0018-000000000018',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: 'La Maison du Portail, gardienne de la rue Jean Cousin',
    body: "Au numéro 50 de la rue Jean Cousin, il y a une maison qui ne paie pas de mine si on passe trop vite. Pourtant, sa façade est classée monument historique depuis 1923. On l'appelle la Maison du Portail, à cause de son entrée en pierre sculptée du XVIe siècle — un grand portail comme on n'en fait plus, avec des moulures et des décors typiques de la Renaissance. À l'époque où cette maison a été construite, Sens était une ville riche. Les marchands, les officiers de justice, les chanoines faisaient bâtir des demeures en pierre, avec des façades travaillées pour montrer leur réussite. La Maison du Portail est un témoin de cette époque. Sa façade et ses toitures ont été protégées par arrêté du 30 juin 1923. Aujourd'hui elle est privée, on ne la visite pas. Mais quand on passe devant, il suffit de lever les yeux pour voir ces pierres qui racontent cinq siècles d'histoire sénonaise.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113877.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: 'XVIe siècle',
    audioUrl: null,
  },
  // Denis / Hôtel Vezou (item 19)
  {
    id: 'f6666666-0088-0088-0088-000000000088',
    heritageItemId: 'e5555555-0019-0019-0019-000000000019',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'Hôtel Vezou : de la noblesse de robe à la mairie de Sens",
    body: "L'Hôtel Vezou, situé au 5 rue Rigault, a connu plus de vies qu'un chat. Construit au milieu du XVIIe siècle par Palamèdes de Foudriat, lieutenant général du bailliage de Sens, il tire son nom de François Vezou, un riche marchand qui l'a racheté à la fin du même siècle. En 1737, le bâtiment passe aux mains d'un conseiller du roi, puis sert de bureau de perception des impôts. En 1822, la municipalité l'acquiert pour en faire son hôtel de ville. Il le restera pendant quatre-vingts ans, jusqu'à la construction de la mairie actuelle en 1904 par l'architecte Richardot. L'édifice a été inscrit aux monuments historiques le 12 mars 1971. Aujourd'hui, il abrite la conservation des Musées de Sens et le CEREP (Centre d'Études et de Recherches Préhistoriques). Les archives du CEREP contiennent des milliers de pièces archéologiques issues des fouilles du Sénonais. Le bâtiment lui-même, avec son escalier à balustres et ses salons, reste un exemple caractéristique de l'architecture civile du XVIIe siècle en Bourgogne.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113863.',
      'Daguin, Gérard. "Les mairies successives de Sens." histoire-sens-senonais-yonne.com.',
    ],
    period: 'XVIIe siècle — 1904',
    audioUrl: null,
  },
  // Bernard / Moulin de la Vierge (item 23)
  {
    id: 'f6666666-0089-0089-0089-000000000089',
    heritageItemId: 'e5555555-0023-0023-0023-000000000023',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: 'Le Moulin de la Vierge : un classé en péril',
    body: "Au 30 rue de Mondereau, il y a un ensemble de bâtiments qu'on appelle le Moulin de la Vierge. Le nom fait rêver, mais l'état du lieu fait plutôt pleurer. Classé monument historique depuis le 14 mai 1980, ce site cache un trésor : six colonnes sculptées récupérées pendant la Révolution dans le cloître de l'abbaye Saint-Pierre-le-Vif, l'une des plus anciennes abbayes de Sens. Ces colonnes sont aujourd'hui dans un musée, heureusement. Mais le bâtiment lui-même, avec ses serres, son jardin de 8 000 mètres carrés, menace de s'effondrer côté rue de Mondereau. Depuis 1999, la mairie essaie de racheter le site à ses multiples propriétaires, sans succès. Une procédure d'expropriation a même été lancée. C'est un cas typique du patrimoine français : un monument classé, donc protégé par la loi, mais que personne n'entretient.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113865.',
      'France Bleu Auxerre, "Sens : la municipalité veut exproprier les propriétaires du Moulin de la Vierge", 2023.',
    ],
    period: 'Révolution — XXIe siècle',
    audioUrl: null,
  },
  // Denis / Hôtel de Vaudricourt (item 26)
  {
    id: 'f6666666-0090-0090-0090-000000000090',
    heritageItemId: 'e5555555-0026-0026-0026-000000000026',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'Hôtel de Vaudricourt : joyau Renaissance à deux pas de la cathédrale",
    body: "L'Hôtel de Vaudricourt, situé rue Abélard, est sans doute l'un des plus beaux exemples d'architecture civile Renaissance en Bourgogne. Vers 1560, Jehan de Polangis, issu d'une importante famille de tanneurs sénonais, commande la construction d'un « pavillon » à la mode italienne. Le bâtiment s'organise autour d'une cour avec puits, selon le schéma classique de l'hôtel particulier entre cour et jardin. Au XVIIIe siècle, l'étage noble est modernisé et orné de boiseries. L'inscription aux monuments historiques, par arrêté du 21 mai 1947, protège le portail d'entrée, la cour avec son puits, les façades et toitures, ainsi que deux salons avec leurs boiseries du XVIIIe siècle. Son intérêt réside dans la cohabitation de trois époques — XVIe, XVIIe et XVIIIe siècles — qui illustre la continuité de l'élite sénonaise sur deux siècles et demi.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113861.',
      'Bulletin de la Société Archéologique de Sens, passim.',
    ],
    period: '~1560 — XVIIIe siècle',
    audioUrl: null,
  },
  // Bernard / Couvent des Dominicaines (item 29)
  {
    id: 'f6666666-0091-0091-0091-000000000091',
    heritageItemId: 'e5555555-0029-0029-0029-000000000029',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: 'Les Dominicaines de Sens : sept siècles de prière et de silence',
    body: "En 1248, un groupe de religieuses dominicaines s'est installé à Sens. On est au siècle de Saint Louis, les ordres mendiants se multiplient dans les villes. Les Dominicaines — des femmes vouées à la contemplation — fondent leur couvent dans le quartier qui deviendra plus tard la rue d'Alsace-Lorraine. Pendant cinq siècles, elles ont vécu là, dans le silence et la prière, à l'ombre de la cathédrale. La Révolution les a chassées comme toutes les communautés religieuses. Le couvent a été vendu comme bien national, découpé, transformé. Il ne reste presque rien des bâtiments médiévaux d'origine. Mais le souvenir persiste. Les Sénonais du XIIIe siècle voyaient ces religieuses en robe blanche et voile noir traverser la ville pour se rendre à la cathédrale les jours de fête. Sens comptait alors une dizaine de communautés religieuses qui occupaient des quartiers entiers. Le couvent des Dominicaines rappelle cette époque où la ville vivait au rythme des cloches.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'Quantin, Maximilien. "Dictionnaire topographique du département de l\'Yonne." Paris, 1862.',
    ],
    period: '1248 — 1790',
    audioUrl: null,
  },
  // Denis / Église Saint-Savinien-le-Jeune (item 31)
  {
    id: 'f6666666-0092-0092-0092-000000000092',
    heritageItemId: 'e5555555-0031-0031-0031-000000000031',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Saint-Savinien-le-Jeune : une église discrète, quatre siècles d'histoire",
    body: "L'église Saint-Savinien-le-Jeune, inscrite aux monuments historiques par arrêté du 7 avril 2014 (notice PA89000057), est un édifice méconnu dont la construction remonte à 1618. Elle ne doit pas être confondue avec la basilique Saint-Savinien, bien plus ancienne. L'appellation « le Jeune » la distingue précisément de son aînée. Au XVIIe siècle, des pénitents s'y installent. En 1682, un procès les oppose aux Bénédictins voisins qui refusent leur extension. La Révolution transforme l'église en grange à foin. Rendue au culte en 1822, elle redevient église paroissiale et fait l'objet d'une restauration en 1893. L'intérieur abrite un grand retable en maçonnerie formé d'un arc monumental décoré de quatre colonnes, couronné d'un bas-relief représentant Dieu le Père et deux anges. Fermée entre 2010 et 2017 pour restauration, elle a rouvert dans un état remarquable.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA89000057.',
      'Daguin, Gérard. "Les églises de Sens." histoire-sens-senonais-yonne.com.',
    ],
    period: '1618 — 2017',
    audioUrl: null,
  },
  // Bernard / Hôtel Le Fournier d'Yauville (item 35)
  {
    id: 'f6666666-0093-0093-0093-000000000093',
    heritageItemId: 'e5555555-0035-0035-0035-000000000035',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'Hôtel Le Fournier d'Yauville : un nom, une façade, un mystère",
    body: "Sur la rue de la République, il y a un hôtel particulier dont le nom à rallonge intrigue les passants : l'Hôtel Le Fournier d'Yauville. Inscrit aux monuments historiques le 3 janvier 1972, c'est un bâtiment du XVIIIe siècle dont la façade sur rue montre encore la belle ordonnance classique de l'époque Louis XV : fenêtres régulières, bandeaux de pierre, toiture en ardoise. Les Le Fournier d'Yauville étaient une famille de la noblesse de robe — ces bourgeois devenus nobles par la magistrature, pas par l'épée. À Sens, comme dans toutes les villes de bailliage, ces familles ont marqué le paysage urbain avec leurs hôtels particuliers. Sens compte une dizaine d'hôtels particuliers de ce type, témoins d'une époque où la ville était un important centre judiciaire et administratif.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA00113868.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: 'XVIIIe siècle',
    audioUrl: null,
  },
  // Denis / Sous-préfecture (item 37)
  {
    id: 'f6666666-0094-0094-0094-000000000094',
    heritageItemId: 'e5555555-0037-0037-0037-000000000037',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La sous-préfecture de Sens : l'État s'affiche sous Napoléon III",
    body: "La sous-préfecture de Sens n'est ni classée ni inscrite aux monuments historiques, mais elle reste un témoin important de l'architecture administrative du Second Empire. L'arrondissement de Sens a été créé en 1800, dans la foulée de la réforme napoléonienne. Sous Napoléon III (1852-1870), les préfets et sous-préfets sont devenus de véritables bâtisseurs. Partout en France, on a construit des sous-préfectures imposantes pour affirmer la présence de l'État. Celle de Sens reprend les codes de l'époque : façade symétrique en pierre de taille, fenêtres à encadrements moulurés, perron d'honneur. Le bâtiment a été agrandi au XXe siècle mais la partie ancienne conserve son allure Second Empire. Ce type de bâtiment, ni assez ancien ni assez spectaculaire pour être classé, est pourtant le marqueur d'une époque : celle où l'État républicain s'est ancré dans chaque ville de France.",
    sources: [
      'Préfecture de l\'Yonne, "Historique de la sous-préfecture de Sens." yonne.gouv.fr.',
    ],
    period: 'Second Empire (~1860) — XXe siècle',
    audioUrl: null,
  },
  // Bernard / Maison de l'Aviler (item 38)
  {
    id: 'f6666666-0095-0095-0095-000000000095',
    heritageItemId: 'e5555555-0038-0038-0038-000000000038',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La Maison de l'Aviler : cinq siècles et autant de vies",
    body: "La Maison de l'Aviler, construite en 1573, est l'une de ces demeures sénonaises qui ont traversé les siècles en changeant de peau à chaque époque. Son nom vient de la famille d'Aviler — la même qui a donné naissance à Augustin-Charles d'Aviler (1653-1701), architecte du roi en Languedoc et auteur d'un célèbre Cours d'architecture. Au XVIIIe siècle, le bâtiment a servi d'hôpital général. Au XIXe siècle, on y a installé un institut orthopédique, puis une manufacture de bonnets et de velours. Depuis 2001, c'est une maison d'hôtes. Cette succession d'usages — habitation noble, hôpital, manufacture, hébergement touristique — raconte à elle seule l'histoire économique de Sens.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
      'SenoN.org, "Monuments de Sens."',
    ],
    period: '1573 — XXIe siècle',
    audioUrl: null,
  },
  // Denis / Maison de l'Œuvre (item 39)
  {
    id: 'f6666666-0096-0096-0096-000000000096',
    heritageItemId: 'e5555555-0039-0039-0039-000000000039',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La Maison de l'Œuvre : quand brûle la mémoire du chapitre",
    body: "La Maison de l'Œuvre, adossée à la cathédrale Saint-Étienne, était le siège de « l'Œuvre de la cathédrale » — l'organisme chargé depuis le Moyen Âge de l'entretien et de la construction du monument. Elle abritait aussi l'ancienne bibliothèque du chapitre cathédral, un fonds constitué au fil des siècles par les chanoines de Sens. En 2015, un incendie a gravement endommagé le bâtiment. La perte a été d'autant plus douloureuse que la bibliothèque capitulaire était l'un des derniers témoins matériels de l'activité intellectuelle du chapitre de Sens, jadis l'un des plus importants de France — l'archevêque de Sens était le primat des Gaules. Le bâtiment est en cours de restauration. L'incendie de 2015 rappelle cruellement que le patrimoine est fragile, et que sa conservation exige une vigilance permanente.",
    sources: [
      'Daguin, Gérard. "La cathédrale et ses dépendances." histoire-sens-senonais-yonne.com.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: 'Moyen Âge — 2015',
    audioUrl: null,
  },
  // Bernard / Immeuble Art Nouveau (item 43)
  {
    id: 'f6666666-0097-0097-0097-000000000097',
    heritageItemId: 'e5555555-0043-0043-0043-000000000043',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'immeuble Art Nouveau du boulevard de Maupeou : Sens à la Belle Époque",
    body: "Au numéro 2 du boulevard de Maupeou, il y a un immeuble qui détonne. Pas de pierre médiévale ici, pas de façade Renaissance : on est en pleine Belle Époque. Cet immeuble de rapport a été bâti entre 1907 et 1909 par l'architecte Richardot, avec l'entrepreneur Coydon et le sculpteur Delassasseigne. La façade est un festival de décors : des bas-reliefs floraux, des balustrades en métal ouvragé, des grandes baies vitrées. C'est du pur Art Nouveau, ce mouvement qui voulait mettre de la nature et de la courbe partout. Le bâtiment utilise une technique moderne pour l'époque : la pierre armée, c'est-à-dire de la pierre renforcée par du métal. Inscrit aux monuments historiques le 30 septembre 2013. C'est le seul immeuble Art Nouveau protégé à Sens. Il nous rappelle qu'à la Belle Époque, Sens n'était pas une ville endormie : on y construisait à la mode de Paris.",
    sources: [
      'Ministère de la Culture, base Mérimée, notice PA89000056.',
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: '1907–1909',
    audioUrl: null,
  },
  // Denis / Notre-Dame-des-Neiges (item 50)
  {
    id: 'f6666666-0098-0098-0098-000000000098',
    heritageItemId: 'e5555555-0050-0050-0050-000000000050',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Notre-Dame-des-Neiges : chapelle d'un couvent disparu",
    body: "L'église Notre-Dame-des-Neiges est l'ancienne chapelle d'un couvent fondé à Sens à l'époque moderne. Son vocable — Notre-Dame des Neiges — fait référence à la basilique Sainte-Marie-Majeure de Rome, dont la légende attribue la fondation à une chute de neige miraculeuse sur le mont Esquilin au mois d'août 358. Le couvent a été supprimé à la Révolution et vendu comme bien national. La chapelle, seul vestige subsistant, a connu des usages variés au XIXe et au XXe siècle. La ville comptait au XVIIe siècle plus d'une dizaine de communautés religieuses — dominicains, cordeliers, ursulines, visitandines, carmélites — qui occupaient des îlots entiers dans le tissu urbain. Notre-Dame-des-Neiges est un de ces fragments qui rappellent cette densité monastique aujourd'hui disparue.",
    sources: [
      'Daguin, Gérard. "Les couvents de Sens." histoire-sens-senonais-yonne.com.',
      'Quantin, Maximilien. "Dictionnaire topographique du département de l\'Yonne." Paris, 1862.',
    ],
    period: 'XVIIe siècle — Révolution',
    audioUrl: null,
  },
  // Bernard / Caisse d'épargne (item 56)
  {
    id: 'f6666666-0099-0099-0099-000000000099',
    heritageItemId: 'e5555555-0056-0056-0056-000000000056',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La Caisse d'épargne de Sens : quand l'argent se faisait beau",
    body: "Au croisement du boulevard du 14-Juillet, de la rue du Général-de-Gaulle et de la rue de Mondereau, il y a un bâtiment que tout le monde connaît mais que personne ne regarde vraiment. C'est l'ancienne Caisse d'épargne de Sens, inaugurée le 12 octobre 1902 en présence du maire Lucien Cornet. À l'époque, les Caisses d'épargne voulaient impressionner. On ne mettait pas son argent dans un hangar : on le confiait à un palais. Le bâtiment s'élève sur trois niveaux, avec un toit à la Mansart. Sur la façade principale, des pilastres corinthiens encadrent l'inscription « CAISSE D'ÉPARGNE » gravée dans la pierre. C'est un geste architectural qui dit : ici, votre argent est en sécurité. Ce style éclectique est typique de la Belle Époque, cette période insouciante entre 1890 et 1914 où la France se couvrait de bâtiments somptueux. Celui de Sens mérite un coup d'œil.",
    sources: [
      'Brousse, Bernard. "Sens, une cité d\'art et d\'histoire." Le Charmoiset, 2024.',
    ],
    period: '1901–1902',
    audioUrl: null,
  },

  // =========================================================================
  // BATCH 1 — Items 5, 8, 20, 21, 22, 32, 33, 42, 45, 49, 51, 57
  // =========================================================================

  // Bernard / Église Saint-Maurice (item 5)
  {
    id: 'f6666666-0075-0075-0075-000000000075',
    heritageItemId: 'e5555555-0005-0005-0005-000000000005',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Saint-Maurice, l'église des mariniers de l'Yonne",
    body: "Si vous passez le pont de l'Yonne à Sens et tournez la tête vers la droite, vous apercevez une petite église coincée entre la rivière et les maisons. C'est Saint-Maurice — et pendant des siècles, c'était l'église des gens de l'eau : pêcheurs, mariniers, lavandières.\n\nConstruite à la fin du XIIe siècle, dans cette période où le roman cède la place au gothique, elle garde dans ses piliers et ses arcatures murales la trace de cette transition. On y retrouve des colonnettes encore romanes, des baies qui hésitent entre deux mondes.\n\nSa vie n'a pas été tranquille. Au XVIe siècle, il a fallu couper son chevet — on l'a transformé en mur plat — pour élargir le lit de la rivière. La façade aussi date de cette époque. L'église a connu les crues, les guerres, l'oubli.\n\nClassée monument historique en 1915, elle reste pourtant l'une des moins connues de Sens. On passe devant sans la voir, happé par la cathédrale de l'autre côté du pont. Et c'est dommage, parce que Saint-Maurice raconte une histoire que la cathédrale ne raconte pas : celle du Sens populaire, celui des artisans et des bateliers qui vivaient du commerce fluvial.\n\nEn 2019, l'INRAP a mené des fouilles archéologiques qui ont livré de nouvelles données sur les fondations médiévales. La preuve que même les petites églises oubliées ont encore des choses à nous apprendre.",
    sources: [
      'Base Mérimée, notice PA00113855 — Église Saint-Maurice, Sens.',
      'INRAP, « Un éclairage archéologique sur l\'église Saint-Maurice de Sens », 2019.',
      'Brousse, Bernard. « Sens, cité d\'art et d\'histoire. » Le Charmoiset, 2024.',
    ],
    period: 'fin XIIe s. — XVIe s.',
    audioUrl: null,
  },
  // Denis / Parc du Moulin à Tan (item 8)
  {
    id: 'f6666666-0076-0076-0076-000000000076',
    heritageItemId: 'e5555555-0008-0008-0008-000000000008',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Du moulin industriel au jardin remarquable : histoire du Moulin à Tan",
    body: "Le Parc du Moulin à Tan tire son nom d'une activité industrielle disparue. Le « tan », c'est de la poudre d'écorce de chêne broyée, utilisée pour transformer les peaux en cuir. Tout le sud de Sens vivait de la tannerie, et la forêt d'Othe, toute proche, fournissait la matière première.\n\nLe site a connu plusieurs vies. D'abord une fabrique de polissage de bijoux en acier, puis vers 1830 une scierie. En 1887, la famille Domange y installe un moulin qui utilise la force motrice de la Vanne pour broyer les écorces. L'activité dure jusqu'au déclin de la tannerie au XXe siècle.\n\nLa reconversion commence en 1984, quand la ville de Sens acquiert le terrain de 7 hectares et lance un défrichage. En 1986, le paysagiste Jean-Luc Boulard dessine le plan d'ensemble du parc. Le résultat : 16 hectares de verdure entre ville et campagne, avec une roseraie, un arboretum de hêtres remarquables et des serres tropicales.\n\nLe parc obtient le label « Jardin remarquable » en 2011 et accueille environ 200 000 visiteurs par an, ce qui en fait l'un des espaces verts les plus fréquentés de Bourgogne.\n\nCe qui est intéressant, c'est la continuité du lien avec l'eau. La Vanne faisait tourner le moulin ; elle alimente aujourd'hui les bassins et les serres. Le patrimoine industriel n'a pas été effacé, il a été transformé.",
    sources: [
      'Ville de Sens, « Parc du Moulin à Tan », ville-sens.fr.',
      'Jardins de France, « Hêtres en majesté au parc du Moulin-à-Tan de Sens ».',
      'Label Jardin remarquable, Ministère de la Culture, 2011.',
    ],
    period: '1830 — 2011',
    audioUrl: null,
  },
  // Bernard / Église Saint-Pierre-le-Rond (item 20)
  {
    id: 'f6666666-0077-0077-0077-000000000077',
    heritageItemId: 'e5555555-0020-0020-0020-000000000020',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Saint-Pierre-le-Rond : cinquante ans de sommeil au cœur de Sens",
    body: "On l'appelle « le Rond » à cause de la forme de son clocher — une tour cylindrique élevée en 1728, bien visible depuis la rue Émile-Peynot. Ce surnom permettait de la distinguer de l'ancienne église Saint-Pierre-le-Donjon, qui a disparu depuis longtemps.\n\nSaint-Pierre-le-Rond est une église du XIIIe siècle au cœur de Sens. Sa grande nef date du XIVe, son bas-côté nord est Renaissance, fin du XVe. Elle renferme des trésors : un retable du XVIe siècle, des grilles en fer forgé, des vitraux Renaissance, des statues en bois de saint Romain et de saint Bernard, un bas-relief en pierre de saint Hubert.\n\nEn 1965, quand un nouveau lieu de culte ouvre dans les quartiers nord, la petite paroisse de Saint-Pierre-le-Rond est supprimée. L'église ferme ses portes. Et là commence un long abandon : une tornade endommage la voûte en bois de la nef en 1971, des voleurs emportent des œuvres et du mobilier, les pigeons s'installent, des squatteurs aussi.\n\nPendant cinquante ans, Sens a tourné le dos à cette église. Puis en 2016, l'association « Sauvons notre patrimoine » et ses quatre-vingts bénévoles ont commencé à la remettre debout, pierre après pierre.\n\nSaint-Pierre-le-Rond, c'est l'histoire d'un patrimoine qu'on a failli perdre par négligence. Et la preuve qu'il n'est jamais trop tard — à condition que des gens s'en mêlent.",
    sources: [
      'Base Mérimée, notice PA00113856 — Église Saint-Pierre-le-Rond, Sens.',
      'France Bleu Auxerre, « Une église sur le point de rouvrir après cinquante ans de fermeture », 2016.',
    ],
    period: 'XIIIe s. — 2016',
    audioUrl: null,
  },
  // Denis / Église Saint-Pregts (item 21)
  {
    id: 'f6666666-0078-0078-0078-000000000078',
    heritageItemId: 'e5555555-0021-0021-0021-000000000021',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Saint-Pregts : du moine normand à la façade baroque restaurée",
    body: "L'église Saint-Pregts porte le nom de saint Priest (en latin Projectus), évêque de Clermont assassiné en 676. Ses reliques arrivent à Sens lors des invasions normandes du IXe siècle, apportées par un moine de l'abbaye de Saint-Riquier fuyant les pillages.\n\nUne première église est fondée près de la Vanne, à l'extrémité du faubourg, près de l'ancien Pont-Bruant. Mais un incendie la détruit. En 1736, le curé A. Jolly fait construire l'édifice actuel au milieu du faubourg : une nef en berceau terminée par un chœur en rotonde, dans le goût baroque du XVIIIe siècle.\n\nSaint-Pregts a survécu à la Révolution. En 1790, quand il faut supprimer la plupart des dix-huit paroisses de Sens et de ses faubourgs, Saint-Pregts est l'une des quatre retenues. Les autres disparaissent.\n\nLa façade et le clocher sont classés monuments historiques en 1965, le reste de l'édifice est inscrit la même année. En 2019, des travaux de restauration ont restitué la façade baroque dans son état d'origine.\n\nCe qui est remarquable, c'est la continuité du lieu : un faubourg qui garde son église paroissiale depuis le IXe siècle, malgré les incendies, les guerres de Religion et la Révolution.",
    sources: [
      'Base Mérimée, notice PA00113857 — Église Saint-Preigts, Sens.',
      'Diocèse de Sens-Auxerre, « Visite de nos églises : Saint-Pregts ».',
      'Bulletin de la Société Archéologique de Sens (historique des paroisses).',
    ],
    period: 'IXe s. — 2019',
    audioUrl: null,
  },
  // Bernard / Église Sainte-Mathie (item 22)
  {
    id: 'f6666666-0079-0079-0079-000000000079',
    heritageItemId: 'e5555555-0022-0022-0022-000000000022',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Sainte-Mathie : l'église que les Sénonais ont détruite eux-mêmes",
    body: "L'histoire de Sainte-Mathie, boulevard Maupeou, est une succession de destructions et de renaissances. Son premier nom, c'est Saint-Didier — le culte remonte au IXe siècle.\n\nElle est d'abord bâtie hors des remparts. En 1015, elle brûle. On la reconstruit. Pendant la guerre de Cent Ans, on l'abandonne et on la démantèle pour récupérer les pierres. À la fin du XVe siècle, on la rebâtit une fois de plus.\n\nEt puis arrive 1567. Les guerres de Religion font rage, Sens est menacée par les protestants. Et là, ce ne sont pas les huguenots qui détruisent l'église — ce sont les paroissiens eux-mêmes. Ils la rasent pour dégager les abords de la ville et empêcher l'ennemi de s'y cacher pendant un siège.\n\nL'église est reconstruite une quatrième fois. Pendant la Révolution, la Société populaire l'utilise comme salle de réunion, ce qui la sauve de la démolition. Le mobilier disparaît, mais le clocher garde sa croix.\n\nAu XIXe siècle, un prêtre installe une chapelle dédiée à sainte Mathie et place sa statue sur le maître-autel. Le nom reste. Chaque 7 mai, les autres paroisses de Sens venaient en procession pour la fête de sainte Mathie.\n\nInscrite aux monuments historiques en 1966, Sainte-Mathie a survécu à cinq destructions. C'est peut-être l'église la plus tenace du Sénonais.",
    sources: [
      'Base Mérimée, notice PA00113854 — Église Sainte-Mathie, Sens.',
      'Daguin, Gérard. « Église Saint-Didier ou Sainte-Mathie », histoire-sens-senonais-yonne.com.',
    ],
    period: 'IXe s. — 1966',
    audioUrl: null,
  },
  // Denis / Ermitage Saint-Bond (item 32)
  {
    id: 'f6666666-0080-0080-0080-000000000080',
    heritageItemId: 'e5555555-0032-0032-0032-000000000032',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "L'ermitage Saint-Bond : du miracle mérovingien au prieuré détruit",
    body: "Saint Bond est un ermite de la fin du VIe siècle qui s'installe sur la colline de Paron, dans l'archidiocèse de Sens, à l'époque mérovingienne. La légende raconte que l'évêque saint Arthème lui confie un bâton sec en lui disant que sa pénitence sera achevée quand le bois refleurira.\n\nBond passe des années à monter de l'eau depuis l'Yonne avec une cruche. Quand le Diable brise la cruche, il continue avec un panier d'osier. La tradition lui attribue deux miracles : la transformation de cendres en farine pour un paysan affamé, et la résurrection d'un enfant mort-né afin qu'il reçoive le baptême.\n\nLes villageois lui construisent un ermitage. En 1080, l'évêque Richer II transforme le lieu en prieuré rattaché à une communauté religieuse. Les bâtiments sont saccagés par les huguenots en 1567 — la même année que l'église Sainte-Mathie, dans le même contexte de guerres de Religion.\n\nLe prieuré est supprimé en 1735 et les reliques de saint Bond sont transférées dans l'église Sainte-Florence-Saint-Bond de Paron, où elles se trouvent encore.\n\nCe qui est intéressant pour l'historien, c'est la superposition des couches : un ermite mérovingien, un prieuré roman, une destruction protestante, un transfert de reliques au XVIIIe siècle.",
    sources: [
      'Glaizal, Pierre et Dodet, Étienne. « L\'ermitage Saint-Bond à Paron. » Archives départementales de l\'Yonne.',
      'Sanctuaires.aibl.fr — fiche n°191, sanctuaire Saint-Bon.',
    ],
    period: 'fin VIe s. — 1735',
    audioUrl: null,
  },
  // Bernard / Fontaine d'Azon (item 33)
  {
    id: 'f6666666-0081-0081-0081-000000000081',
    heritageItemId: 'e5555555-0033-0033-0033-000000000033',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "La fontaine d'Azon : là où Sainte-Colombe a perdu la tête",
    body: "En l'an 274 après Jésus-Christ, l'empereur romain Aurélien arrive à Sens. Il est en guerre contre tout ce qui menace l'unité de l'Empire — et les chrétiens en font partie.\n\nDans la ville, une jeune femme venue de Saragosse refuse de renier sa foi. Elle s'appelle Colombe. Elle a reçu le baptême à Vienne, dans le Dauphiné, puis elle est venue s'installer dans le pays sénonais.\n\nAurélien la fait jeter en prison, enchaînée dans un cachot obscur. La légende raconte qu'un ours entre dans sa cellule et la protège au lieu de la dévorer. Quand l'empereur ordonne de mettre le feu au bûcher, une pluie soudaine éteint les flammes.\n\nFinalement, Colombe est conduite hors de la ville, jusqu'à un lieu-dit appelé la fontaine d'Azon. C'est là qu'elle est décapitée, le 31 décembre 274.\n\nTrois siècles plus tard, le roi Clotaire II fait construire une abbaye à l'endroit présumé du supplice : l'abbaye Sainte-Colombe de Saint-Denis-lès-Sens. C'est dans cette même abbaye que Thomas Becket, archevêque de Canterbury, trouvera refuge entre 1166 et 1170 — près de neuf cents ans après le martyre de Colombe.\n\nLa fontaine d'Azon n'existe plus en tant que telle. Mais le lieu reste gravé dans la mémoire sénonaise. Sainte Colombe est la patronne du diocèse de Sens.",
    sources: [
      'Diocèse de Sens-Auxerre, « Sainte Colombe — personnages historiques ».',
      'Daguin, Gérard. « Sainte Colombe et l\'empereur Aurélien », histoire-sens-senonais-yonne.com.',
      'Brousse, Bernard. « Sens, cité d\'art et d\'histoire. » Le Charmoiset, 2024.',
    ],
    period: '274 ap. J.-C.',
    audioUrl: null,
  },
  // Denis / Gué Saint-Jean (item 42)
  {
    id: 'f6666666-0082-0082-0082-000000000082',
    heritageItemId: 'e5555555-0042-0042-0042-000000000042',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le gué Saint-Jean et le ru de Mondereau : quand l'eau défendait la ville",
    body: "Le lavoir du Gué Saint-Jean, dans le quartier de l'Amande à Sens, est alimenté par le ru de Mondereau, un petit cours d'eau dont l'histoire est indissociable de celle de la ville.\n\nEn 1358, le régent Charles — futur Charles V — ordonne de détourner la Vanne au niveau de Maslai-le-Vicomte (aujourd'hui Malay-le-Grand) pour créer un nouveau cours d'eau. Ce ru de Mondereau n'est pas un caprice : nous sommes en pleine guerre de Cent Ans, les Anglais menacent, et Sens a besoin d'eau pour remplir ses fossés défensifs.\n\nAu Gué Saint-Jean, le ruisseau se divise en deux bras pour alimenter les douves de la ville. Cette fonction militaire est la raison d'être du ru.\n\nMais l'eau qui défend la ville la fait aussi vivre. Le Mondereau alimente des moulins, arrose des jardins privés, et fait tourner des activités artisanales. Le lavoir du Gué Saint-Jean est un témoignage de cette vie quotidienne liée à l'eau : les lavandières y travaillaient encore au XIXe siècle.\n\nAujourd'hui, le lavoir est l'un des derniers vestiges visibles du réseau hydraulique médiéval de Sens. Le ru de Mondereau coule toujours, en partie canalisé, mais on ne le voit presque plus.",
    sources: [
      'Daguin, Gérard. « Rue et ru de Mondereau », histoire-sens-senonais-yonne.com.',
      'petit-patrimoine.com — « Le gué Saint-Jean, Sens (89) ».',
    ],
    period: '1358 — XIXe s.',
    audioUrl: null,
  },
  // Bernard / Hôtel de Bourrienne (item 45)
  {
    id: 'f6666666-0083-0083-0083-000000000083',
    heritageItemId: 'e5555555-0045-0045-0045-000000000045',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "L'Hôtel de Bourrienne : Marivaux, Napoléon et un archevêché sous le même toit",
    body: "Rue de l'Écrivain à Sens, il y a une maison devant laquelle on passe sans savoir que trois noms célèbres y sont liés.\n\nLe premier, c'est Marivaux. Le dramaturge, l'auteur du « Jeu de l'amour et du hasard », avait épousé une Sénonaise. La maison appartenait à la famille Fauvelet, comtes de Charbonnières de Bourienne.\n\nLe deuxième nom, c'est celui qui a donné son nom à l'hôtel : Louis Antoine Fauvelet de Bourrienne, né dans cette maison. Il deviendra diplomate, député, ministre d'État, et surtout secrétaire particulier de Napoléon Bonaparte.\n\nAu début du XXe siècle, entre 1905 et 1929, l'Hôtel de Bourrienne sert de siège à l'archevêché de Sens — chassé de ses locaux habituels par la loi de séparation de l'Église et de l'État.\n\nUne maison qui a vu passer un dramaturge du XVIIIe, un secrétaire de Napoléon et un archevêché en exil. La rue s'appelle « rue de l'Écrivain » — mais elle pourrait tout aussi bien s'appeler rue de l'Histoire.",
    sources: [
      'Daguin, Gérard. Chroniques historiques, histoire-sens-senonais-yonne.com.',
      'Brousse, Bernard. « Sens, cité d\'art et d\'histoire. » Le Charmoiset, 2024.',
    ],
    period: 'XVIIIe s. — 1929',
    audioUrl: null,
  },
  // Denis / Caserne Gémeau (item 49)
  {
    id: 'f6666666-0084-0084-0084-000000000084',
    heritageItemId: 'e5555555-0049-0049-0049-000000000049',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La caserne Gémeau : du bonapartiste en exil à l'école de police",
    body: "La caserne Gémeau, au 23 rue du 89e RI à Sens, porte le nom d'Auguste Pierre Walbourg Gémeau, né à Paris en 1790. Entré à Saint-Cyr à 18 ans, il reçoit le baptême du feu à Wagram en 1809. Toutes les campagnes de l'Empire.\n\nAprès la chute de Napoléon, Gémeau est interdit de séjour à Paris. Il vient s'installer à Sens, où il termine ses jours.\n\nLes bâtiments militaires actuels sont construits en 1874, après la défaite de 1870. Ils accueillent le 89e Régiment d'Infanterie, qui y tient garnison jusqu'en 1914.\n\nAprès la Seconde Guerre mondiale, la caserne change de vocation. En 1946, le ministère de l'Intérieur y installe le centre national de formation des motocyclistes de la police. En 1948, les premiers stages de gardiens de la paix débutent. C'est la naissance de l'École nationale de police de Sens, qui forme encore aujourd'hui des gardiens de la paix et des cadets de la République.\n\nDe la Grande Armée à la police nationale : le lieu a changé de mission, mais pas de fonction — former des hommes en uniforme.",
    sources: [
      'Daguin, Gérard. « Gémeau : une caserne constellée d\'étoiles », histoire-sens-senonais-yonne.com.',
      'Police nationale, « École nationale de police de Sens ».',
    ],
    period: '1874 — aujourd\'hui',
    audioUrl: null,
  },
  // Bernard / Ferme de Champbertrand (item 51)
  {
    id: 'f6666666-0085-0085-0085-000000000085',
    heritageItemId: 'e5555555-0051-0051-0051-000000000051',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Champbertrand : la ferme qui nourrit Sens depuis des siècles",
    body: "Champbertrand, c'est un nom qu'on lit sur les panneaux à la sortie de Sens sans trop y penser. Pourtant, ce lieu-dit raconte une histoire très ancienne — celle de la terre nourricière aux portes de la ville.\n\nLe toponyme « Champbertrand » est typique du Moyen Âge : « champ » plus un prénom germanique. C'est le champ de Bertrand, un domaine agricole attribué à un tenancier à une époque où Sens était entourée de terres cultivées qui alimentaient la ville et ses marchés.\n\nLa ferme actuelle est exploitée par la famille Aubé depuis plus de 35 ans. Antoine Aubé cultive 170 hectares de céréales et 2 hectares de maraîchage. De fin mai à octobre, les Sénonais viennent y acheter fraises, tomates, poivrons, aubergines en vente directe.\n\nCe qui est remarquable, c'est la continuité du lieu. Quand on mange une tomate de Champbertrand en 2026, on fait la même chose que les Sénonais du XIVe siècle qui achetaient leurs légumes aux maraîchers des faubourgs. La ville a grandi, les techniques ont changé, mais le lien entre Sens et sa ceinture maraîchère n'a pas été coupé.\n\nLe domaine de Champbertrand a une histoire plus ancienne que la ferme actuelle. Il a appartenu à la famille L'Hermitte de Champbertrand avant d'être racheté par la famille Leblanc-Duvernoy — les mêmes mécènes auxerrois qui ont légué leur hôtel particulier XVIIIe à la ville d'Auxerre (devenu le musée Leblanc-Duvernoy, avec ses tapisseries de Beauvais). Champbertrand est un patrimoine vivant. Pas un monument classé — mais un lieu qui fait ce qu'il a toujours fait : nourrir les gens d'ici.",
    sources: [
      'Tourisme Yonne, « Ferme de Champbertrand ».',
      'Brousse, Bernard. « Sens, cité d\'art et d\'histoire. » Le Charmoiset, 2024.',
    ],
    period: 'Moyen Âge — aujourd\'hui',
    audioUrl: null,
  },
  // Denis / Piscine Tournesol (item 57)
  {
    id: 'f6666666-0086-0086-0086-000000000086',
    heritageItemId: 'e5555555-0057-0057-0057-000000000057',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "La piscine Tournesol de Sens : patrimoine industriel des Trente Glorieuses",
    body: "En 1969, le secrétariat d'État à la Jeunesse et aux Sports lance le concours « 1000 piscines » pour équiper la France en bassins de natation. L'idée : construire vite, pas cher, en préfabriqué.\n\nL'architecte Bernard Schoeller et l'ingénieur Thémis Constantinidis remportent le concours avec un concept audacieux : une piscine sous un dôme de 35 mètres de diamètre, couvert de tuiles en polyester percées de hublots ovales. Sa particularité : un tiers du dôme est mobile, monté sur des roulettes, et s'ouvre électriquement pour transformer la piscine couverte en piscine de plein air.\n\nLe nom « Tournesol » vient de là : les hublots colorés qui s'ouvrent vers le soleil. Entre le milieu des années 1970 et le début des années 1980, 183 exemplaires sont construits dans toute la France. Celle de Sens date de 1977.\n\nAvec 85 % de pièces préfabriquées, le Tournesol est l'une des plus grandes constructions en série de France. C'est aussi un symbole de l'ambition des Trente Glorieuses : offrir à chaque ville moyenne un équipement sportif moderne.\n\nEn 2015, la piscine de Sens a été rénovée pour 4,5 millions d'euros. Le Tournesol est désormais reconnu comme un patrimoine architectural du XXe siècle.",
    sources: [
      'PSS-archi.eu — fiche Piscine Tournesol de Sens.',
      'INA, « La piscine Tournesol : une histoire, un style, une mode ».',
      'Inventaire général du patrimoine culturel, « Les piscines des Trente Glorieuses ».',
    ],
    period: '1977 — 2015',
    audioUrl: null,
  },

  // =========================================================================
  // GÉRARD DAGUIN (item 74) — mémoire numérique de Sens
  // =========================================================================

  // Bernard / Daguin — récit
  {
    id: 'f6666666-0074-0074-0074-000000000001',
    heritageItemId: 'e5555555-0074-0074-0074-000000000074',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Gérard Daguin : le journaliste qui a raconté Sens",
    body: "Gérard Daguin était journaliste à L'Indépendant de Bourgogne, le journal local. Mais sa vraie passion, c'était l'histoire de Sens. Pendant des années, il a écrit des chroniques historiques qu'il publiait sur son site internet : histoire-sens-senonais-yonne.com. Cinquante articles, au moins. Les Huguenots, les Templiers, Thomas Becket, la communauté juive, les rues de Sens, la guerre 39-45 — tout y passait. Il travaillait dans les bureaux de la Société Archéologique de Sens, à côté de Bernard Brousse. Ensemble, ils étaient les deux voix de l'histoire sénonaise : Daguin écrivait, Brousse racontait.\n\nGérard est mort le 29 novembre 2018. Son site est toujours en ligne — mais le certificat de sécurité est cassé, et personne ne le maintient. C'est une bibliothèque numérique de Sens qui pourrait disparaître du jour au lendemain. Il a aussi publié un livre, « Sens pour les curieux », avec les commentaires de Francis Sarlin. Son site a reçu plus de 432 000 visiteurs et près d'un million de pages lues.\n\nQuand on parcourt les fiches de Patrimoine & Sens, on tombe sur le nom de Daguin partout. Les Templiers ? Daguin. Le massacre de 1562 ? Daguin. Les remparts ? Daguin. Le Carmel ? Daguin. Le Mamelouk Ali ? Daguin. Ce n'était pas un universitaire — c'était un journaliste qui aimait sa ville et qui a pris le temps de la raconter. Et c'est irremplaçable.",
    sources: [
      'L\'Yonne Républicaine, hommage Facebook, 29 novembre 2018.',
      'histoire-sens-senonais-yonne.com — Chroniques historiques (50 articles archivés).',
      'Daguin, Gérard. "Sens pour les curieux." Sens.',
    ],
    period: '~1940–2018',
    audioUrl: null,
  },
  // Denis / Daguin — historique (bibliographie)
  {
    id: 'f6666666-0074-0074-0074-000000000002',
    heritageItemId: 'e5555555-0074-0074-0074-000000000074',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le corpus Daguin : inventaire des chroniques historiques",
    body: "Le site histoire-sens-senonais-yonne.com constitue le corpus le plus accessible sur l'histoire locale de Sens. Ses articles couvrent une période allant de l'Antiquité gallo-romaine (Agedincum) à la séparation de l'Église et de l'État (1905), avec des incursions dans la Seconde Guerre mondiale.\n\nThèmes principaux : la cathédrale et le procès des Templiers (1310), le massacre des Huguenots (12 avril 1562), les fortifications de Sens, la communauté juive médiévale, Thomas Becket, les couvents (Jacobins, Ursulines, Dominicaines, Célestins, Carmel), les personnalités (Jean Cousin, le Mamelouk Ali, Jacques Clément, Victor Guichard, le général Duchesne), les noms de rues, le théâtre, le marché couvert, les mairies successives, la gare (1849), Napoléon et Bourrienne.\n\nLimites du corpus : Daguin était journaliste, pas historien universitaire. Ses articles sont des vulgarisations sans appareil critique (pas de notes de bas de page, pas de renvois aux sources primaires). Certaines dates et attributions nécessitent vérification croisée avec les Bulletins de la SAS ou les travaux de Denis Cailleaux. Le site est techniquement fragile (certificat TLS expiré, hébergement OverBlog non maintenu depuis le décès de l'auteur en 2018). Un archivage systématique des 50 articles a été réalisé en avril 2026.",
    sources: [
      'histoire-sens-senonais-yonne.com — index complet des chroniques.',
      'Bulletin de la Société Archéologique de Sens (comparaison des sources).',
    ],
    furtherReading: "Le corpus Daguin doit être croisé avec trois sources de référence : (1) les Bulletins de la SAS (Gallica, 1846-1938), (2) les travaux de Denis Cailleaux (Université de Bourgogne), et (3) Bernard Brousse, « Sens, cité d'art et d'histoire » (Le Charmoiset, 2024). Daguin et Brousse travaillaient ensemble dans les locaux de la SAS. L'abbé Leviste (président SAS, gardien du trésor) constitue une quatrième source de référence, plus ancienne mais de poids académique supérieur.",
    period: '~2005–2018',
    audioUrl: null,
  },


  // =========================================================================
  // MOULINS DUMEE (item 79)
  // =========================================================================
  {
    id: 'f6666666-0112-0112-0112-000000000112',
    heritageItemId: 'e5555555-0079-0079-0079-000000000079',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les Dumée : sept générations de meuniers à Sens",
    body: "En 1703, un certain Jacques Dumée s'installe comme meunier à Sens, dans la paroisse Saint-Cartault, quartier Saint-Paul. Trois siècles plus tard, ses descendants dirigent l'un des dix plus gros moulins de France. Sept générations de Dumée se sont succédé : Jacques (1703), Pierre (1743), Antoine (1782), Louis-Auguste (1861), Roger (1899), Gérald (1936), puis Hervé de Romémont, gendre de Gérald (1998). On trouve même trace d'un Dumée meunier à Véron dès 1641.\n\nLouis-Auguste rachète les Moulins de Saint-Père en 1890 — au coin de la rue d'Alsace-Lorraine et de la rue de la Planche-Barrault — 20 tonnes de farine par jour. En 1927, ses fils André et Roger reprennent l'entreprise. En 1935, un incendie détruit presque tout. Ils reconstruisent et doublent la capacité à 50 tonnes. En 1960, l'entreprise devient la SA « Moulins Dumée ». En 1963, Gérald prend les rênes. En 1975, il passe à 90 tonnes. En 1994, 200 tonnes.\n\nEn 2003, la famille achète un terrain à Gron, près de Sens. Le projet du nouveau moulin est lancé en 2009. En septembre 2015, la production démarre sur le nouveau site : 450 tonnes par jour, 11 500 tonnes de stockage de grain. C'est l'un des moulins les plus modernes de France. L'ancien site de Sens est démoli en 2018-2019.\n\nEn 2025, le capital passe à la SAS FHDR — Florence et Hervé de Romémont avec leurs enfants. Les Dumée, c'est l'histoire d'une famille qui fait la même chose depuis 1703 — moudre du blé — et qui le fait mieux à chaque génération. C'est rare. La plupart des entreprises familiales ne survivent pas trois générations. Les Dumée en sont à sept.",
    sources: [
      'Moulins Dumée, « Historique » : moulins-dumee.com/historique/.',
      'Rose Diers, « Les anciennes usines de Sens — Les Moulins Dumée », reportagephotosrosediers.jimdofree.com.',
    ],
    period: '1703 — présent',
    audioUrl: null,
  },
  // =========================================================================
  // BARON THENARD (item 80)
  // =========================================================================
  {
    id: 'f6666666-0113-0113-0113-000000000113',
    heritageItemId: 'e5555555-0080-0080-0080-000000000080',
    authorId: DENIS,
    contributionType: 'historique' as const,
    title: "Le baron Thénard : du collège de Sens à l'eau oxygénée",
    body: "Louis-Jacques Thénard est né le 4 mai 1777 à La Louptière, près de Nogent-sur-Seine. Fils de paysans, il est formé dès l'âge de 10 ans par le curé de Villeneuve-l'Archevêque, puis entre au collège de Sens. À 16 ans, il part pour Paris avec l'ambition de devenir pharmacien.\n\nIl devient bien plus. Protégé de Vauquelin, puis de Fourcroy, il est nommé professeur au Collège de France, à l'École polytechnique et à la faculté des sciences de Paris. Ses découvertes sont majeures : l'eau oxygénée (H₂O₂, 1818), le bleu de Thénard (pigment de cobalt utilisé en céramique), l'identification du bore avec Gay-Lussac (1808).\n\nDéputé de l'Yonne, pair de France, baron de Charles X (1825) — Thénard est au sommet. Mais il a un ennemi : Victor Hugo. En 1839, les deux hommes se disputent sur le travail des enfants. Thénard défend le patronat, Hugo les enfants. Vingt-trois ans plus tard, Hugo nomme ses méchants « Thénardier » dans Les Misérables (1862).\n\nStatue érigée place Thénard à Sens en 1861. Village natal rebaptisé La Louptière-Thénard en 1865. Un scientifique de premier plan, formé à Sens, dont le nom est devenu — par la plume de Hugo — synonyme de méchanceté.",
    sources: [
      'France Bleu Auxerre, « Thénardier : vengeance politique de Hugo contre un baron de Sens », 2023.',
      'Chassant, Alphonse. « Dictionnaire des devises historiques et héraldiques. » Paris, 1878.',
      'Brousse, Bernard. « Sens, cité d\'art et d\'histoire. » Le Charmoiset, 2024.',
    ],
    furtherReading: "Le lien Hugo-Thénard est documenté par plusieurs historiens. Hugo a visité Sens le 24 octobre 1839, lors d'un voyage en Bourgogne. La statue de Thénard, place du même nom à Sens, date de 1861 — un an avant la publication des Misérables. À la fin du roman, le personnage de Thénardier se présente à Marius sous le faux nom de « Thénard » — référence à peine voilée au baron sénonais.",
    period: '1777–1857',
    audioUrl: null,
  },
  // =========================================================================
  // TANNERIES DOMANGE (item 81)
  // =========================================================================
  {
    id: 'f6666666-0114-0114-0114-000000000114',
    heritageItemId: 'e5555555-0081-0081-0081-000000000081',
    authorId: BERNARD,
    contributionType: 'recit' as const,
    title: "Les Tanneries Domange : quand Sens fabriquait les courroies du monde",
    body: "En 1877, Hippolyte Morel arrive de Metz pour reprendre une tannerie à Sens. C'est le début d'une aventure industrielle qui durera un siècle. La famille Domange prend la suite et bâtit un empire : la Maison Domange, alias Scellos, se spécialise dans les courroies de transmission en cuir — les courroies qui faisaient tourner les machines de toutes les usines de France.\n\nEn 1887, Albert Domange fait construire un moulin à tan rue des Tanneries, avec roue à aubes, atelier et galerie de bureaux à l'étage. En 1904, un hôtel particulier impressionnant sort de terre au 10 rue Auguste Morel, dessiné par l'architecte Schneider. C'est la vitrine de la réussite industrielle.\n\nÀ son apogée en 1927, l'entreprise emploie 600 ouvriers dans trois usines — Sens, Paris et Bagnolet. Six cents ouvriers. Dans une ville qui en comptait peut-être 20 000 habitants. Domange, c'était Sens.\n\nLa chute est brutale. Jean-Claude Domange, dernier PDG de la lignée, dépose le bilan en 1978. Le tribunal de commerce de Paris prononce le règlement judiciaire le 29 mai. L'usine de Sens ferme le 18 septembre. 200 licenciements. La grande cheminée est bientôt démolie, les bâtiments rasés pour faire place à un lotissement de 102 logements.\n\nAujourd'hui, il ne reste que l'hôtel particulier du 10 rue Auguste Morel et un bâtiment reconverti en bureaux au coin de la rue du Sachot. Et les serres tropicales municipales, installées en 2000 dans l'ancien bâtiment de l'usine. C'est tout ce qui reste d'un siècle d'industrie du cuir à Sens.",
    sources: [
      'Rose Diers, « Les anciennes usines de Sens — Les Tanneries Domange », reportagephotosrosediers.jimdofree.com.',
      'Rose Diers, « Le Moulin à Tan et Moulin du Roy », reportagephotosrosediers.jimdofree.com.',
    ],
    period: '1877–1978',
    audioUrl: null,
  },

] as const
