// commandes/deck_manager.js

const decks = {
  quinte: {
    nom: "Quinte Flush Royale",
    competence: ["Quinte Flush Royale"],
    deck_principal: [
      // Monstres (17)
      "Chevalier du Valet", "Chevalier du Valet",
      "Chevalier Commandeur", "Chevalier Commandeur", "Chevalier Commandeur",
      "Chevalier de la Reine", "Chevalier de la Reine", "Chevalier de la Reine",
      "Chevalier du Roi", "Chevalier du Roi", "Chevalier du Roi",
      "Épée Amazoness", "Épée Amazoness",
      "Invocateur Dragon Bleu", "Invocateur Dragon Bleu", "Invocateur Dragon Bleu",
      "Sphère Kuriboh",

      // Magies (7)
      "Épée de l’Âme Draconique", "Épée de l’Âme Draconique", "Épée de l’Âme Draconique",
      "Polymérisation", "Polymérisation", "Polymérisation",
      "Sogen",

      // Pièges (5)
      "Conscription",
      "Kunai Avec Chaîne",
      "Michizure",
      "Pommes d'Or",
      "Tempête d’Étaqua"
    ],
    extra_deck: [
      "Alakan le Chevalier Harlequin",
      "Alakan le Chevalier Harlequin"
    ]
  }

  // Tu peux ajouter d'autres decks ici avec la même structure
};

module.exports = { decks };