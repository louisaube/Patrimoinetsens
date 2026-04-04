/**
 * Patch annuaire.json with corrected names and titles from manuscript reading.
 * Also fixes blazon descriptions based on visual inspection of crops.
 * Run: node 12_patch_annuaire.js
 */
const fs = require("fs");
const path = require("path");

const ANNUAIRE_PATH = path.join(__dirname, "../../public/armorial/annuaire.json");
const data = JSON.parse(fs.readFileSync(ANNUAIRE_PATH, "utf-8"));

// Corrections keyed by image filename
// Fields: nom, titre, lieu, blason, couleurs, type — only include fields that need correction
const patches = {
  // ─── p36 ───
  "blason_036_01_Barthélemy_Moutié.jpg": {
    nom: "Barthélemy Mouflé",
    titre: "Docteur de la Maison et Société de Sorbonne, Vicaire général de M. l'Archevêque de Sens",
    lieu: "Ville de Paris / Sens",
  },
  "blason_036_02_Jean_de_St_Mammes.jpg": {
    nom: "Jean de Saint-Mesmin",
    titre: "Directeur des aides de Sens",
    lieu: "Sens",
  },
  "blason_036_04_Jacques_de_Bernard.jpg": {
    titre: "Chirurgien, Seigneur de Champigny",
  },
  "blason_036_05_Alexandre_Chuillier.jpg": {
    titre: "Écuyer, Seigneur de Chalandas",
  },

  // ─── p38 ───
  "blason_038_01_Charles_Baron.jpg": {
    titre: "Chanoine en l'Église de Saint-Étienne de Sens",
    blason: "D'azur à la fasce d'argent chargée de trois étoiles d'azur, en chef un agneau pascal d'argent, en pointe les lettres BB d'or.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_038_02_Jean_Burlugay.jpg": {
    titre: "Chanoine en l'Église de Saint-Étienne de Sens",
  },
  "blason_038_03_Jacques_Segard.jpg": {
    titre: "Chanoine en l'Église Saint-Étienne de Sens",
    blason: "D'azur à la ruche d'or.",
    couleurs: ["azur", "or"],
  },
  "blason_038_04_Jean_Noel.jpg": {
    titre: "Chanoine en l'Église de Sens",
    blason: "D'argent à l'arbre de sinople, au chef d'azur chargé d'une étoile d'or accostée de deux croissants d'argent.",
    couleurs: ["argent", "sinople", "azur", "or"],
  },
  "blason_038_05_Jacques_Marres.jpg": {
    nom: "Jacques Marrés",
    titre: "Chanoine en l'Église de Sens",
    blason: "D'azur à l'aigle d'or posée sur un rocher du même, surmontée d'un soleil d'or.",
    couleurs: ["azur", "or"],
  },

  // ─── p39 ───
  "blason_039_01_Jean_le_Riche.jpg": {
    titre: "Chanoine de Sens",
    blason: "D'azur à la demi-pique d'or couronnée du même, posée en pal.",
    couleurs: ["azur", "or"],
  },
  "blason_039_02_Estienne_Masson.jpg": {
    titre: "Chanoine en l'Église de Sens",
    blason: "D'argent au cœur de gueules enflammé du même.",
    couleurs: ["argent", "gueules"],
  },
  "blason_039_03_Eustache_de_Feu.jpg": {
    titre: "Chanoine en l'Église Saint-Étienne de Sens",
    blason: "D'argent au chevron d'azur accompagné de trois flammes de gueules, au chef de gueules au lion passant d'or.",
    couleurs: ["argent", "azur", "gueules", "or"],
  },
  "blason_039_04_Charles_Mouchon.jpg": {
    titre: "Prêtre, Chanoine en l'Église de Saint-Étienne de Sens",
    blason: "D'azur au chevron d'or accompagné de trois croissants d'argent.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_039_05_Jacques_Chomoret.jpg": {
    titre: "Chanoine en l'Église de Sens",
    blason: "D'argent au chevron d'azur accompagné en chef de deux flammes de gueules et d'un croissant d'azur, en pointe d'une tête de Maure de sable.",
    couleurs: ["argent", "azur", "gueules", "sable"],
  },

  // ─── p41 ───
  "blason_041_01_Etienne_le_Camus.jpg": {
    titre: "Chanoine régulier et Chanoine de l'Église collégiale de Sens",
    blason: "Coupé, au 1 d'azur à la fleur de lys d'or, au 2 de gueules au pélican dans sa piété d'argent.",
    couleurs: ["azur", "or", "gueules", "argent"],
  },

  // ─── p42 ───
  "blason_042_05_Jean_François_Payen.jpg": {
    nom: "Jean François Payans",
    titre: "Avocat au Roy au Bailliage de Senlis",
    lieu: "Senlis",
  },

  // ─── p43 ───
  "blason_043_04_François_Brunel.jpg": {
    nom: "François Estienne",
    titre: "Grenotier",
    lieu: "Senlis",
  },

  // ─── p44 ───
  "blason_044_01_Nicolas_du_Pont_de_Compiègne.jpg": {
    titre: "Chevalier, Seigneur de Fontaineroux, Capitaine et Chef du Vol pour les Champs de la Chambre du Roy. Et Charlotte de Chezelles sa femme.",
    blason: "Parti, au 1 coupé d'or à l'aigle de sable et de sinople au lévrier courant d'argent ; au 2 d'argent au lion de sable accompagné de quatre étoiles de gueules.",
    couleurs: ["or", "sable", "sinople", "argent", "gueules"],
  },
  "blason_044_02_Jean-Baptiste_de_Brenne.jpg": {
    titre: "Chevalier, Seigneur de Marchais",
  },
  "blason_044_03_Nicolas_Haué.jpg": {
    titre: "Écuyer",
    blason: "D'azur à la vache passante d'argent, accompagnée en chef de deux coquilles d'or.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_044_04_Dominique_de_Courcelles.jpg": {
    nom: "Dominique de Cormiser",
    titre: "Conseiller",
    blason: "D'argent à l'arbre de sinople accosté de deux oiseaux de sable.",
    couleurs: ["argent", "sinople", "sable"],
  },
  "blason_044_05_Labbaye_de_la_Victoire.jpg": {
    blason: "D'azur à la Vierge à l'Enfant d'or assise.",
    couleurs: ["azur", "or"],
  },

  // ─── p45 ───
  "blason_045_01_Labbaye_de_Sainte-Marie.jpg": {
    nom: "L'abbaye de Sainte-Marcoul",
    blason: "D'azur à un saint d'or debout tenant une palme du même.",
    couleurs: ["azur", "or"],
  },
  "blason_045_02_Aubignant.jpg": {
    nom: "Aubigant",
    titre: "Maire de la ville de Breil",
    lieu: "Breil",
    blason: "D'argent à cinq roses de gueules boutonnées d'or, posées 2, 2 et 1.",
    couleurs: ["argent", "gueules", "or"],
  },
  "blason_045_03_Nicolas_Talonnet_Dagen_de_Sens.jpg": {
    nom: "Nicolas Tafoureau",
    titre: "Doyen de Sens",
    lieu: "Sens",
    blason: "Écartelé d'azur, au 1 et 4 à l'aigle d'argent, au 2 et 3 à l'homme sauvage d'or, avec croissants et étoiles.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_045_04_Gabriel_de_Breteuil_en_lEglise_St_Jean.jpg": {
    nom: "Gabriel le Pré",
    titre: "Trésorier en l'Église de Sens",
    lieu: "Sens",
    blason: "D'argent à la cloche d'azur croisée d'or, accompagnée en chef de deux roses de gueules et en pointe d'une étoile de gueules.",
    couleurs: ["argent", "azur", "or", "gueules"],
  },
  "blason_045_05_Olivier_Ducreux.jpg": {
    nom: "Olivier Vincenot",
    titre: "Chanoine",
    blason: "De sinople au chevron d'argent accompagné de trois couronnes d'or.",
    couleurs: ["sinople", "argent", "or"],
  },

  // ─── p46 ───
  "blason_046_01_François_le_Comte.jpg": {
    titre: "Chevalier, Seigneur d'Hermay, la Mostèlerie, Préaux et autres lieux",
    blason: "D'azur au chevron d'or accompagné en chef de deux étoiles d'or et en pointe d'une coquille d'argent.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_046_02_Anne_de_Perthuis.jpg": {
    titre: "Chevalier, Seigneur de Vertau et autres lieux",
    blason: "D'azur à la croix ancrée d'argent.",
    couleurs: ["azur", "argent"],
  },
  "blason_046_03_Louis_Coutellier.jpg": {
    titre: "Chevalier, Seigneur de Jouy",
    blason: "D'argent à trois demi-vols de sable.",
    couleurs: ["argent", "sable"],
  },
  "blason_046_04_Alain_David.jpg": {
    titre: "Conseiller",
    blason: "D'argent à la harpe de gueules, au chef de sinople chargé de trois couronnes d'or.",
    couleurs: ["argent", "gueules", "sinople", "or"],
  },
  "blason_046_05_Louis_de_Fourcault.jpg": {
    nom: "Louis Lafourceau",
    titre: "Conseiller",
    blason: "Écartelé d'azur, au 1 et 4 à l'aigle d'argent, au 2 et 3 à l'homme sauvage d'or, avec croissants et étoiles.",
    couleurs: ["azur", "argent", "or"],
  },

  // ─── p47 ───
  "blason_047_01_La_Con_de_Jas._Raymond,_Seigneur_de_Sens.jpg": {
    nom: "La Demoiselle des Maîtres Royaux de la ville de Sens",
    titre: "",
    lieu: "Sens",
    type: "institution",
    blason: "D'azur au cygne d'argent.",
    couleurs: ["azur", "argent"],
  },
  "blason_047_02_Paul_Dubé_Chan.jpg": {
    nom: "Paul Dubé",
    titre: "Chanoine",
    blason: "Bandé d'azur et d'or, au chef de sinople chargé de trois aigles d'or.",
    couleurs: ["azur", "or", "sinople"],
  },
  "blason_047_03_Henry_Harvard_Chan.jpg": {
    nom: "Henry Harouard",
    titre: "Chanoine",
    blason: "De sinople au chevron d'or accompagné de feuilles de chêne du même, en chef deux anges d'azur.",
    couleurs: ["sinople", "or", "azur"],
  },
  "blason_047_04_Charles_Henry_Randle_Dodelan.jpg": {
    nom: "Charles Henry Pinelle",
    titre: "Docteur en Médecine",
    blason: "D'or à deux fasces de gueules accompagnées de trois trèfles de sinople.",
    couleurs: ["or", "gueules", "sinople"],
  },
  "blason_047_05_Guane_Greg_Chan.jpg": {
    nom: "Etienne Nicej",
    titre: "Chanoine",
    blason: "D'azur au chevron d'or, en chef un croissant d'argent, en pointe une étoile d'or.",
    couleurs: ["azur", "or", "argent"],
  },

  // ─── p48 ───
  "blason_048_01_Jean_Le_Couturier.jpg": {
    titre: "Écuyer, Seigneur de Belleval, ci-devant Capitaine d'Infanterie",
    blason: "D'argent à l'arbre de sinople fruité de gueules, surmonté d'une étoile d'or.",
    couleurs: ["argent", "sinople", "gueules", "or"],
  },
  "blason_048_02_Antoine_de_Guerville.jpg": {
    titre: "Écuyer, Seigneur de la Martinière",
    blason: "Bandé d'azur et d'or, au chef de sinople chargé de trois aigles d'or.",
    couleurs: ["azur", "or", "sinople"],
  },
  "blason_048_03_Charles_François_dHaqueville_Breyer.jpg": {
    nom: "Charles François d'Haqueville",
    titre: "Écuyer",
    blason: "D'argent au chevron de sinople accompagné de trois dextrochères d'azur.",
    couleurs: ["argent", "sinople", "azur"],
  },
  "blason_048_04_Alexandre_de_Montrillon_Breyer.jpg": {
    nom: "Alexandre de Montrillon",
    titre: "Écuyer, Seigneur du Pin",
    blason: "D'or à deux fasces de gueules accompagnées de trois trèfles de sinople.",
    couleurs: ["or", "gueules", "sinople"],
  },
  "blason_048_05_Philippe_Véspasien_de_Bizemont.jpg": {
    titre: "Écuyer, Seigneur de trois Maisons",
    blason: "D'azur au chevron d'or accompagné en chef de deux croissants d'argent et en pointe d'une étoile d'or.",
    couleurs: ["azur", "or", "argent"],
  },

  // ─── p49 ───
  "blason_049_01_Etienne_du_Carroux_de_Valencenne.jpg": {
    titre: "Écuyer, Seigneur de Mézière",
    blason: "D'azur à saint Nicolas d'or, bénissant trois enfants dans un cuvier.",
    couleurs: ["azur", "or"],
  },
  "blason_049_02_François_Blenon.jpg": {
    nom: "François Blesnon",
    titre: "Chanoine",
    blason: "D'argent à la cloche d'azur croisée d'or, accompagnée en chef d'une rose de gueules et en pointe d'une étoile de gueules.",
    couleurs: ["argent", "azur", "or", "gueules"],
  },
  "blason_049_03_Pierre_du_Saq.jpg": {
    nom: "Pierre du Sacq",
    titre: "Chanoine",
    blason: "D'argent à l'arbre de sinople terrassé du même, au chef bandé d'azur et d'or.",
    couleurs: ["argent", "sinople", "azur", "or"],
  },
  "blason_049_04_Guillaume_Travers.jpg": {
    titre: "Curé",
    blason: "D'azur à saint Joseph d'or tenant un enfant par la main.",
    couleurs: ["azur", "or"],
  },
  "blason_049_05_Le_Couvent_des_Religieuses_Bénédictines.jpg": {
    nom: "Le Couvent des Religieuses Bénédictines de Sens",
    blason: "D'azur à quatre poissons d'argent posés en sautoir, au cœur d'or en abîme.",
    couleurs: ["azur", "argent", "or"],
  },

  // ─── p50 ───
  "blason_050_01_La_Comtesse_des_Prez_du_Bailliage_de_Sen.jpg": {
    nom: "La Communauté des Procureurs du Bailliage de Sens",
    titre: "",
    type: "institution",
    blason: "D'azur à saint Nicolas d'or bénissant trois enfants.",
    couleurs: ["azur", "or"],
  },
  "blason_050_02_Claude_Sgyriez,_Chanoine.jpg": {
    nom: "Claude Legrix",
    titre: "Chanoine",
    blason: "D'argent à la cloche d'azur croisée d'or, en chef deux roses de gueules, en pointe une étoile de gueules.",
    couleurs: ["argent", "azur", "or", "gueules"],
  },
  "blason_050_03_Catherine_Pinuel.jpg": {
    nom: "Catherine Fauvelot",
    titre: "Veuve",
    blason: "D'argent à l'arbre de sinople terrassé du même, au chef bandé d'azur et d'or.",
    couleurs: ["argent", "sinople", "azur", "or"],
  },
  "blason_050_05_Jugues,_Musnier,_Chanoine.jpg": {
    nom: "Jaques Musnier",
    titre: "Chanoine",
    blason: "D'azur à quatre poissons d'argent en sautoir, au cœur d'or en abîme.",
    couleurs: ["azur", "argent", "or"],
  },

  // ─── p51 ───
  "blason_051_01_Thomas_Leclec.jpg": {
    nom: "Thomas Leclerc",
    blason: "D'azur à trois étoiles d'or, au chef du même chargé d'une guirlande de sinople.",
    couleurs: ["azur", "or", "sinople"],
  },
  "blason_051_02_Jaques_Benault.jpg": {
    nom: "Jaques Benault",
    titre: "Seigneur de Montcorbon",
    blason: "De sinople au chevron d'or accompagné de trois croissants d'argent.",
    couleurs: ["sinople", "or", "argent"],
  },
  "blason_051_04_Jaques_de_Cacie.jpg": {
    nom: "Jaques de Cacie",
    titre: "Chanoine",
    blason: "D'argent à deux trèfles de sinople en chef et une rose de gueules en pointe.",
    couleurs: ["argent", "sinople", "gueules"],
  },
  "blason_051_05_Etienne_Brouin.jpg": {
    nom: "Etienne Brouin",
    titre: "Conseiller",
    blason: "D'argent à la grappe de raisin de gueules tigée et feuillée de sinople, accompagnée d'un perroquet du même.",
    couleurs: ["argent", "gueules", "sinople"],
  },

  // ─── p52 ───
  "blason_052_01_Guillaume_Viart.jpg": {
    titre: "Écuyer, Gentilhomme",
    blason: "Parti, au 1 coupé d'azur à trois coquilles d'argent et d'or au phénix de sable dans ses flammes de gueules ; au 2 d'argent au lion de gueules, à l'arbre de sinople.",
    couleurs: ["azur", "argent", "or", "sable", "gueules", "sinople"],
  },
  "blason_052_02_Louise_Alix_de_Lucat_de_Malvoisine.jpg": {
    titre: "Femme de Guillaume Viart",
    blason: "Parti, au 1 coupé d'azur à trois coquilles d'argent et d'or au phénix de sable dans ses flammes de gueules ; au 2 d'argent au lion de gueules, à l'arbre de sinople.",
    couleurs: ["azur", "argent", "or", "sable", "gueules", "sinople"],
  },
  "blason_052_03_Jacques_Viart.jpg": {
    titre: "Écuyer, Gentilhomme",
    blason: "Coupé, au 1 d'azur à trois coquilles d'argent, au 2 d'or au phénix de sable dans ses flammes de gueules.",
    couleurs: ["azur", "argent", "or", "sable", "gueules"],
  },
  "blason_052_04_Nicolas_Hurault.jpg": {
    nom: "Nicolas Hurault de Vignay",
    blason: "D'or à la croix d'azur cantonnée de quatre soleils de gueules.",
    couleurs: ["or", "azur", "gueules"],
  },
  "blason_052_05_Louis_Hurault.jpg": {
    nom: "Louis Hurault de l'Hospital",
    titre: "Fils",
    blason: "D'or à la croix d'azur cantonnée de quatre soleils de gueules.",
    couleurs: ["or", "azur", "gueules"],
  },
  "blason_052_06_Pierre_de_la_Tranche.jpg": {
    nom: "Pierre de la Tranche",
    titre: "Gentilhomme",
    blason: "D'azur au chevron d'argent accompagné de trois trèfles du même.",
    couleurs: ["azur", "argent"],
  },

  // ─── p53 ───
  "blason_053_01_Florent_Pechard.jpg": {
    nom: "Fleurant Peschard",
    titre: "Seigneur de l'Espinay, Gentilhomme",
    blason: "Écartelé d'azur et de gueules, à la bande d'or brochant sur le tout.",
    couleurs: ["azur", "gueules", "or"],
  },
  "blason_053_02_Mathieu-Michel_Boulon.jpg": {
    nom: "Mathieu-Michel Bouton",
    titre: "Écuyer",
    blason: "D'argent à deux fasces de sable accompagnées de six cuves d'azur.",
    couleurs: ["argent", "sable", "azur"],
  },
  "blason_053_03_François_Chermiette.jpg": {
    nom: "François l'Hermitte",
    titre: "Conseiller",
    blason: "D'azur à deux châteaux d'argent, accompagnés d'une étoile d'or.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_053_04_Etienne_Fauvelue.jpg": {
    nom: "Etienne Fauvelot",
    titre: "Conseiller",
    blason: "D'or à la croix de gueules, au cœur du même couronné, à la terrasse de sinople.",
    couleurs: ["or", "gueules", "sinople"],
  },
  "blason_053_05_Jean_Bouvetet.jpg": {
    nom: "Jean Bouveret",
    titre: "Chanoine",
    blason: "D'or à trois fasces de sinople chargées de six tourteaux de gueules.",
    couleurs: ["or", "sinople", "gueules"],
  },

  // ─── p54 ───
  "blason_054_01_Antoine_Sallaz.jpg": {
    nom: "Cantien Sallot",
    titre: "Écuyer",
    blason: "Écartelé d'azur, de gueules et de sinople, à la bande d'or brochant.",
    couleurs: ["azur", "gueules", "sinople", "or"],
  },
  "blason_054_02_Antoine_Marcelin.jpg": {
    nom: "Antoine Marcetot",
    titre: "Conseiller",
    blason: "D'argent à deux fasces de sable accompagnées de six cuves d'azur.",
    couleurs: ["argent", "sable", "azur"],
  },
  "blason_054_03_Deschasteliers.jpg": {
    nom: "Deschastelliers",
    titre: "Fille (demoiselle)",
    blason: "D'azur à trois châteaux d'argent, accompagnés d'une étoile d'or en abîme.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_054_04_Jean_Bast.jpg": {
    nom: "Jean-Baptiste Channet",
    titre: "Prêtre",
    blason: "D'or à la croix de gueules, au cœur du même couronné, accompagnée d'un bouquet de fleurs.",
    couleurs: ["or", "gueules", "sinople"],
  },
  "blason_054_05_Grenne_Roulat.jpg": {
    nom: "Etienne Boulard",
    titre: "Chanoine bourgeois",
    blason: "D'or à trois fasces de sinople chargées de six tourteaux de gueules.",
    couleurs: ["or", "sinople", "gueules"],
  },

  // ─── p55 ───
  "blason_055_01_Jean_Cordy_Jan.jpg": {
    nom: "Jean Cordy",
    titre: "Chanoine",
    blason: "D'azur au chevron d'or accompagné en chef d'une étoile d'or et en pointe d'un croissant d'argent.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_055_02_Laurain.jpg": {
    nom: "Laurens",
    titre: "Chanson, prêtre",
    blason: "D'azur à la croix d'or, à l'orle de chaîne d'or.",
    couleurs: ["azur", "or"],
  },
  "blason_055_03_Jean_Clément.jpg": {
    blason: "D'azur à une sainte d'or tenant une croix patriarcale du même.",
    couleurs: ["azur", "or"],
  },
  "blason_055_04_Le_Couvreur.jpg": {
    nom: "Le Couvent des chanoines réguliers de Saint-Jean-lès-Sens",
    titre: "",
    type: "institution",
    blason: "D'azur au coq d'or accompagné d'une épée d'argent posée en pal.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_055_05_Le_Maye.jpg": {
    nom: "L'Abbaye de Saint-Remy-lès-Sens",
    titre: "",
    type: "institution",
    blason: "D'argent à la fasce de carnation (main dextre appaumée), accompagnée de quatre pommes de sinople.",
    couleurs: ["argent", "sinople"],
  },

  // ─── p56 ───
  "blason_056_01_Antoine_Nicolas_de_Vaintange.jpg": {
    nom: "Antoine Nicolas de Xaintonge",
    titre: "Écuyer, Seigneur de Plaisance, Hébert et Cerisot, demeurant en la Paroisse de Thorigny",
    blason: "D'azur au chevron d'or accompagné en chef de deux étoiles d'or et en pointe d'un croissant d'argent.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_056_02_Pierre_Sépave.jpg": {
    nom: "Pierre Nepveu",
    titre: "Prêtre",
    blason: "D'azur à la croix d'or, à l'orle de chaîne d'or chargé de larmes d'argent.",
    couleurs: ["azur", "or", "argent"],
  },
  "blason_056_03_Le_Prieuré_de_Sainte.jpg": {
    nom: "Le Prieuré des Sœurs",
    blason: "D'azur à un saint évêque d'or mitré et crossé, tenant une croix patriarcale.",
    couleurs: ["azur", "or"],
  },
  "blason_056_04_Étienne_Tassey.jpg": {
    titre: "Conseiller du Roy",
    blason: "D'azur à l'épée d'or posée en pal, accostée de deux coqs d'or.",
    couleurs: ["azur", "or"],
  },
  "blason_056_05_Dunain_de_Macé.jpg": {
    nom: "Drouin le Macé",
    titre: "Conseiller du Roy",
    blason: "D'argent à la fasce de carnation (main dextre appaumée), accompagnée de quatre pommes de sinople.",
    couleurs: ["argent", "sinople"],
  },

  // ─── p57 ───
  "blason_057_01_Gaspard_de_Nalpène.jpg": {
    nom: "Gaspard de Malpené",
    titre: "Prêtre",
    blason: "De sinople à quatre croix pattées d'argent, à la tête de mort d'or en abîme.",
    couleurs: ["sinople", "argent", "or"],
  },
  "blason_057_03_Charles_Benoist.jpg": {
    titre: "Conseiller",
    blason: "D'argent à trois sautoirs alésés de gueules, à la divise vivrée de sinople et d'or.",
    couleurs: ["argent", "gueules", "sinople", "or"],
  },
  "blason_057_04_Claude_Lauvelles.jpg": {
    nom: "Claude Fauvelet",
    titre: "Conseiller",
    blason: "D'argent à l'arbre de sinople terrassé du même, au chef bandé d'azur et d'or.",
    couleurs: ["argent", "sinople", "azur", "or"],
  },
  "blason_057_05_Louis_Godrillat.jpg": {
    blason: "D'azur au coq d'or posé sur un mont du même, accompagné de deux épis de blé d'or.",
    couleurs: ["azur", "or"],
  },

  // ─── p58 ───
  "blason_058_02_Antoine_Dastis.jpg": {
    titre: "Écuyer, Seigneur de Maisonselles, Élection de Provins",
    lieu: "Provins",
    blason: "D'azur à deux épées d'argent passées en sautoir, gardes d'or.",
    couleurs: ["azur", "argent", "or"],
  },
  "blason_058_01_Philippes_de_Vormont.jpg": {
    titre: "Écuyer, Seigneur de Villiers l'Onglon, Paroisse de Saint-Mars, Élection de Provins",
    lieu: "Provins",
  },
  "blason_058_03_Anne_Ambroise_le_Camus.jpg": {
    titre: "Seigneur de Macé",
    blason: "D'or à la tête de Maure de sable tortillée d'argent, accompagnée de quatre coquilles de gueules.",
    couleurs: ["or", "sable", "argent", "gueules"],
  },
  "blason_058_04_Herade_de_Chavigny.jpg": {
    titre: "Écuyer, Seigneur de Vieuxmaisons, Sainte-Colombe",
    blason: "D'argent à la croix de gueules, au chef endenté de sable.",
    couleurs: ["argent", "gueules", "sable"],
  },
  "blason_058_05_Jean_Nuvert.jpg": {
    nom: "Jean Neuvert",
    titre: "Écuyer, Seigneur de Rochefort et du Plessis au Chat",
    blason: "D'azur à trois chevrons d'or, accompagnés de trois besants du même.",
    couleurs: ["azur", "or"],
  },
};

// Apply patches
let updated = 0;
let nameChanges = [];
for (const entry of data.entries) {
  const patch = patches[entry.image];
  if (patch) {
    const oldName = entry.nom;
    for (const [key, value] of Object.entries(patch)) {
      entry[key] = value;
    }
    updated++;
    if (patch.nom && patch.nom !== oldName) {
      nameChanges.push(`  ${oldName} → ${patch.nom}`);
    }
  }
}

// Write updated file
fs.writeFileSync(ANNUAIRE_PATH, JSON.stringify(data, null, 2), "utf-8");

console.log(`Patched ${updated}/${data.entries.length} entries`);
if (nameChanges.length > 0) {
  console.log(`\nName corrections (${nameChanges.length}):`);
  nameChanges.forEach((c) => console.log(c));
}
