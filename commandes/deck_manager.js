const decks = {
  yami: {
    competence: "Quinte Flush Royale",
    image: "https://i.ibb.co/Tqqjcjmr/t-l-chargement.jpg",
    main: [
      // Monstres (17)
      "Chevalier du Valet", "Chevalier du Valet", "Chevalier Commandeur", "Chevalier Commandeur", 
      "Chevalier Commandeur", "Chevalier de la Reine", "Chevalier de la Reine", "Chevalier de la Reine",
      "Chevalier du Roi", "Chevalier du Roi", "Chevalier du Roi", "Épée Amazoness", "Épée Amazoness",
      "Invocateur Dragon Bleu", "Invocateur Dragon Bleu", "Invocateur Dragon Bleu", "Sphère Kuriboh",
      // Magies (7)
      "Épée de l'Âme Draconique", "Épée de l'Âme Draconique", "Épée de l'Âme Draconique", "Polymérisation",
      "Polymérisation", "Polymérisation", "Sogen",
      // Pièges (5)
      "Conscription", "Kunai Avec Chaîne", "Michizure", "Pommes d'Or", "Tempête d'Étaqua"
    ],
    extra: ["Alakan le Chevalier Harlequin", "Alakan le Chevalier Harlequin"]
  },

  pegasus: {
    competence: "Dans le Monde des Toons",
    image: "https://i.ibb.co/QvY5XKfz/t-l-chargement-1.jpg",
    main: [
      // Monstres (9)
      "Crâne Invoqué Toon", "Crâne Invoqué Toon", "Crâne Invoqué Toon", "Gearfried le Chevalier de Fer",
      "Gearfried le Chevalier de Fer", "Gearfried le Chevalier de Fer", "Sirène Toon", "Sirène Toon", "Sirène Toon",
      // Magies (8)
      "Doppelganger le Mimitétique", "Doppelganger le Mimitétique", "Monde des Toons", "Monde des Toons",
      "Rembobinage Toon", "Table des Matières Toon", "Table des Matières Toon", "Table des Matières Toon",
      // Pièges (3)
      "Défense Toon", "Pommes d'Or", "Tempête d'Étaqua"
    ],
    extra: []
  },

  joey: {
    competence: "Pote à moi risation",
    image: "https://i.ibb.co/zV1mnXhZ/Joey-Wheeler.jpg",
    main: [
      // Monstres (13)
      "Dragon Noir Aux Yeux Rouges", "Dragon Noir Aux Yeux Rouges", "Dragon Noir Aux Yeux Rouges",
      "Dragon Météore", "Dragon Météore", "Dragon Météore", "Bébé Dragon", "Magicien du Temps",
      "Axe Raider", "Axe Raider", "Axe Raider", "Chevalier Commandeur", "Gearfried le Chevalier de Fer",
      // Magies (4)
      "Déphon", "Polymérisation", "Polymérisation", "Polymérisation",
      // Pièges (5)
      "Cercle Envoûtant", "Esprit des Yeux Rouges", "Kunai Avec Chaîne", "Orbe de Sécurité", "Tempête d'Étaqua"
    ],
    extra: ["Dragon Noir Météore", "Dragon Noir Météore", "Dragon Millénaire"]
  },

  kaiba: {
    competence: "Raclée",
    image: "https://i.ibb.co/zV4HpDdn/abf2d49e-d672-4c50-8bf6-7fffe9a33d78.jpg",
    main: [
      // Monstres (10)
      "Dragon Blanc Aux Yeux Bleus", "Dragon Tyran", "Dragon Étincelant N°2", "Dragon Météore",
      "Bœuf de Combat", "Bœuf de Combat", "Esprit Ryu", "Invocateur Dragon Bleu", "Béhémoth à Deux Têtes", "Kaibaman",
      // Magies (5)
      "Bouclier et Épée", "Écrasement Destructeur", "Esprit de Combat", "Flot Rugissant de Destruction", "Rayon Nocturne",
      // Pièges (6)
      "Cercle Envoûtant", "Dé-Crâne", "Michizure", "Orbe de Sécurité", "Orbe de Sécurité", "Renforts"
    ],
    extra: []
  },

  ishizu: {
    competence: "Sort des Protecteurs du Tombeau",
    image: "https://i.ibb.co/DgLpprxJ/t-l-chargement-1.jpg",
    main: [
      // Monstres (18)
      "Shaman des Protecteurs du Tombeau", "Assaillant des Protecteurs du Tombeau", "Commandant des Protecteurs du Tombeau",
      "Spiritualiste des Protecteurs du Tombeau", "Héritier des Protecteurs du Tombeau", "Zolga", "Zolga le Prophète",
      "Kelbek", "Kelbek l'Ancienne Avant-Garde", "Mudora", "Mudora l'Oracle de l'Épée", "Agido", "Agido l'Ancienne Sentinelle",
      "Keldo", "Keldo la Protectrice Sacrée", "Prêtresse des Protecteurs du Tombeau", "Boss des Protecteurs du Tombeau", "Elfe Mystique",
      // Magies (8)
      "Trône de la Vallée Mortuaire", "Trône de la Vallée Mortuaire", "Trône de la Vallée Mortuaire", "Stèle des Protecteurs du Tombeau",
      "Vallée Mortuaire", "Épées de Révélation de la Lumière", "Hommage aux Damnés", "Cestus de Dagla",
      // Pièges (3)
      "Piège des Protecteurs du Tombeau", "Temple de la Vallée Mortuaire", "Tombes Impériales de la Vallée Mortuaire"
    ],
    extra: ["Supernaturaliste des Protecteurs du Tombeau", "Supernaturaliste des Protecteurs du Tombeau"]
  },

  mai: {
    competence: "Synergie Tribale",
    image: "https://i.ibb.co/9mLnsZQ7/t-l-chargement.jpg",
    main: [
      // Monstres (10)
      "Sœurs de Harpie", "Amazonesse avec Chaîne", "Dame Harpie 1", "Dame Harpie 1", "Dame Harpie 1",
      "Épée Amazonesse", "Épée Amazonesse", "Épée Amazonesse", "Visage d'Oiseau", "Visage d'Oiseau",
      // Magies (7)
      "À Moitié Fermé", "À Moitié Fermé", "À Moitié Fermé", "Égotiste Élégant", "Égotiste Élégant",
      "Terrain de Chasse des Harpies", "Terrain de Chasse des Harpies",
      // Pièges (4)
      "Kunai avec Chaîne", "Tempête d'Etakua", "Tornade Violente", "Tornade Violente"
    ],
    extra: [],
    reserve: ["Âme Possédée", "Métalmorphe", "Trappe d'Adhérence", "Trappe d'Adhérence"]
  },

  jaden: {
    competence: "Union des héros - Fusion",
    image: "https://i.ibb.co/kVPh87FZ/cdaad5e0f0b636a4ce34da6dfab46997.jpg",
    main: [
      // Monstres (13)
      "Héros élémentaire Sparkman", "Héros élémentaire Sparkman", "Héros élémentaire Clayman", "Héros élémentaire Clayman",
      "Héroïne élémentaire Burstinatrix", "Héros élémentaire Avian", "Héros élémentaire Bladedge", "Héros élémentaire Necroshade",
      "Héros élémentaire Wildheart", "Déesse au troisième œil", "Héros élémentaire Bubbleman", "Wroughtweiler", "Kuriboh ailé",
      // Magies (7)
      "Gratte-ciel", "Récupération par Fusion", "Sage de Fusion", "Polymérisation", "Polymérisation", "R - Justice Juste", "Renforcement de l'Armée",
      // Pièges (3)
      "Annuler l'attaque", "Un Héros émerge", "Signal Héros"
    ],
    extra: [
      "Héros Élémentaire Plasma Vice", "Héros élémentaire Géant du Tonnerre", "Héros élémentaire Flame Wingman",
      "Héros Élémentaire Rampart Blaster", "Héros élémentaire Darkbright"
    ]
  },

  chad: {
    competence: "Terre des Ojama",
    image: "https://i.ibb.co/7tYsG5fH/644bfb4964dadff3d1c674735867ff38.jpg", 
    main: [
      // Monstres (9)
      "Ojama Bleu", "Ojama Bleu", "Ojama Bleu", "Ojama Jaune", "Ojama Jaune", "Ojama Noir", "Ojama Noir", "Ojama Vert", "Ojama Vert",
      // Magies (9)
      "Cyclone Cosmique", "Le Livre de la Lune", "Ojamagic", "Ojamagic", "Ouragan Ojama Delta !!", "Polymérisation", "Polymérisation", "Polymérisation", "Village Ojama",
      // Pièges (2)
      "Sceau Maudit de la Magie Interdite", "Trappe Vanne"
    ],
    extra: ["Ojama Roi", "Ojama Roi", "Chevalier Ojama", "Chevalier Ojama", "Chevalier Ojama"]
  }
};

module.exports = {
  decks
};