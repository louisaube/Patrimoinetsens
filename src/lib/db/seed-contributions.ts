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
    body: "On dit souvent que la cathédrale de Sens est « la première cathédrale gothique de France ». La réalité est plus compliquée — et plus intéressante. Les travaux ont démarré vers 1135-1140 sous l'archevêque Henri Sanglier. Mais quand parle-t-on de « première » ? À la pose de la première pierre ? Personne ne connaît la date exacte. À l'achèvement ? Les travaux ont duré quatre siècles. Et l'abbatiale de Saint-Denis, construite par l'abbé Suger dès 1135, utilise déjà la croisée d'ogives — mais ce n'est pas une cathédrale, c'est une abbatiale. Noyon, Laon, Paris ont suivi peu après. Ce qui est sûr : Sens est l'un des tout premiers grands édifices à utiliser ensemble les voûtes d'ogives, les grandes fenêtres et les arcs-boutants. Le chœur a été consacré en 1164 en présence du pape Alexandre III. Le trésor conserve la chape de Thomas Becket, réfugié à Sens entre 1164 et 1166.",
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
    title: "Thomas Becket à Sens : six ans d'exil",
    body: "En 1164, Thomas Becket, archevêque de Canterbury, s'est enfui d'Angleterre. Le roi Henri II voulait sa peau. Becket a traversé la Manche et s'est réfugié à Sens, protégé par le pape Alexandre III qui vivait ici lui aussi. Pendant six ans, Becket a prié chaque matin dans la cathédrale avant le lever du jour. Les Sénonais le croisaient dans les rues — un homme grand, maigre, habillé simplement malgré son rang. En 1170, il est retourné en Angleterre. Quatre chevaliers du roi l'ont assassiné dans sa propre cathédrale de Canterbury. Sa chape brodée d'or est encore visible dans le trésor de Sens.",
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
    body: "La Maison d'Abraham, rue de la République, est célèbre pour son poteau d'angle sculpté. On y voit un Arbre de Jessé : la Vierge Marie entourée de huit rois d'Israël, ses ancêtres. En 1970, un camion a renversé ce poteau. On a frôlé la catastrophe — il a fallu le restaurer pierre par pierre. Ce que peu de gens savent : Gustave Flaubert s'est inspiré de cette maison pour « L'Éducation sentimentale ». La maison porte aussi le nom de « Maison des Quatre Vents ». C'est Nicolas Mégissier qui l'a fait construire au XVIe siècle.",
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
    title: "L'abbaye Saint-Jean : mille ans d'histoire",
    body: "L'abbaye Saint-Jean a été fondée au VIe siècle. Pendant mille ans, des moines y ont vécu, prié et travaillé. L'église abbatiale mélange deux styles : une nef romane (murs épais, petites fenêtres) et un chœur gothique (murs fins, grandes fenêtres). Après la Révolution, l'abbaye est devenue un hôpital. Aujourd'hui, les bâtiments du XVIIIe siècle abritent le musée municipal de Sens, avec une incroyable collection de mosaïques romaines retrouvées dans le sous-sol de la ville.",
    sources: [
      'Bulletin de la Société Archéologique de Sens, vol. II, 1856.',
      'Ministère de la Culture, base Mérimée, notice PA00113860.',
    ],
    period: 'VIe siècle — présent',
    audioUrl: null,
  },
  // Bernard / Hôpital Saint-Jean — Gaston Ramon
  {
    id: 'f6666666-0059-0059-0059-000000000059',
    heritageItemId: 'e5555555-0006-0006-0006-000000000006',
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
  // Bernard / Hôtel de Ville — Ali le Mamelouk
  {
    id: 'f6666666-0064-0064-0064-000000000064',
    heritageItemId: 'e5555555-0012-0012-0012-000000000012',
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
    title: "Jean Cousin : le plus grand peintre que personne ne connaît",
    body: "Jean Cousin le Père est né vers 1490 près de Sens. Il a appris son métier ici, a peint des vitraux pour la cathédrale, puis il est parti à Paris. Il a réalisé « Eva Prima Pandora » — le premier grand nu de la peinture française. Son fils, Jean Cousin le Jeune, a suivi le même chemin. Leur maison, rue Jean-Cousin, est une bâtisse à colombages du XVIe siècle. Inscrite aux Monuments Historiques en 1970.",
    sources: [
      'Daguin, Gérard. "Jean Cousin, au nom du père, du fils, du square." histoire-sens-senonais-yonne.com.',
      'Ministère de la Culture, base Mérimée, notice PA00113882.',
    ],
    period: 'XVIe siècle',
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

  // Mimard / Manufrance (contribution sur Hôtel de Ville)
  {
    id: 'f6666666-0068-0068-0068-000000000068',
    heritageItemId: 'e5555555-0012-0012-0012-000000000012',
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

  // Jules Guichard / Canal de Suez
  {
    id: 'f6666666-0069-0069-0069-000000000069',
    heritageItemId: 'e5555555-0012-0012-0012-000000000012',
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

] as const
