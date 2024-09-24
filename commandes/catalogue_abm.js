const { zokou } = require('../framework/zokou');

// Liste des personnages et leurs informations
const characters = [
  { univers: "BLACK CLOVER", rang: "C", nom: "ASTA", statut: "Standard", url: "https://i.ibb.co/b7nG8PT/Image-2024-09-22-23-51-04-0.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "YUNO", statut: "Premium", url: "https://i.ibb.co/gdTzR95/Image-2024-09-22-23-51-04-1.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "LÉOPOLD", statut: "Standard", url: "https://i.ibb.co/BzQ41L5/Image-2024-09-22-23-51-04-5.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "GAUCHE", statut: "Standard", url: "https://i.ibb.co/dtdqN3v/Image-2024-09-22-23-51-04-6.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "MAGNA", statut: "Standard", url: "https://i.ibb.co/j580P6c/Image-2024-09-22-23-51-04-3.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "LUCK", statut: "Premium", url: "https://i.ibb.co/y6ssxQ0/Image-2024-09-22-23-51-04-4.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "NOELLE", statut: "Premium", url: "https://i.ibb.co/23kcHZx/Image-2024-09-22-23-51-04-2.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "VANESSA", statut: "Premium", url: "https://i.ibb.co/RQpvRyD/Image-2024-09-22-23-51-04-7.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "ZORA", statut: "Standard", url: "https://i.ibb.co/1MGtpKF/Image-2024-09-22-23-51-04-8.jpg" },
  { univers: "BLACK CLOVER", rang: "C", nom: "LANGRIS", statut: "Premium", url: "https://i.ibb.co/GvNHQ7R/Image-2024-09-22-23-51-04-9.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "RIU", statut: "Premium", url: "https://i.ibb.co/k0jFqQj/Image-2024-09-23-16-51-29-8.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "GIYU", statut: "Premium", url: "https://i.ibb.co/k9xb9VG/Image-2024-09-23-16-51-29-2.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "ZENITSU", statut: "Premium", url: "https://i.ibb.co/BqbZ7VN/Image-2024-09-23-16-51-29-3.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "ENMU", statut: "Premium", url: "https://i.ibb.co/1r3g39z/Image-2024-09-23-16-51-29-7.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "SUSAMARU", statut: "Standard", url: "https://i.ibb.co/VggXmkz/Image-2024-09-23-16-51-29-6.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "YAHABA", statut: "Standard", url: "https://i.ibb.co/hBcm3gf/Image-2024-09-23-16-51-29-5.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "NEZUKO", statut: "Standard", url: "https://i.ibb.co/h8Jt7JG/Image-2024-09-23-16-51-29-1.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "INOSUKE", statut: "Standard", url: "https://i.ibb.co/LZ1nWyM/Image-2024-09-23-16-51-29-4.jpg" },
  { univers: "DEMON SLAYER", rang: "C", nom: "TANJIRO", statut: "Standard", url: "https://i.ibb.co/fnzKSqB/Image-2024-09-23-16-51-29-0.jpg" }
];

// Fonction pour envoyer le catalogue complet
const sendCatalog = async (zk, origineMessage) => {
  let message = "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*......| ABM CHARACTERS |......*
═══════════════════";
  message += "Bienvenue dans le catalogue des personnages ABM.\n";

  const universes = [...new Set(characters.map(p => p.univers))]; // Récupère tous les univers uniques

  universes.forEach(univers => {
    message += `*${univers} :*\n`;
    const charactersByUnivers = characters.filter(p => p.univers === univers);
    const rangs = [...new Set(charactersByUnivers.map(p => p.rang))]; // Récupère tous les rangs uniques

    rangs.forEach(rang => {
      message += `*Rang ${rang} :*\n`;
      charactersByUnivers
        .filter(p => p.rang === rang)
        .forEach(p => {
          message += `- ${p.nom} : ${p.statut}\n`;
        });
    });

    message += "═══════════════════";
  });

  message += "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒";

  await zk.sendMessage(origineMessage, { text: message });
};

// Fonction pour envoyer l'image du personnage sélectionné
const sendCharacterCard = async (zk, origineMessage, characterName) => {
  const character = characters.find(p => p.nom.toLowerCase() === characterName.toLowerCase());
  if (character) {
    await zk.sendMessage(origineMessage, {
      image: { url: character.url },
      caption: `${character.nom} (${character.statut})`
    });
  } else {
    await zk.sendMessage(origineMessage, { text: "Personnage non trouvé. Veuillez vérifier le nom." });
  }
};

// Commande principale
zokou(
  {
    nomCom: 'list_abm',
    reaction: '🎴',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage } = commandeOptions;

    try {
      // Envoie le catalogue complet au joueur
      await sendCatalog(zk, origineMessage);

      // Attend la réponse du joueur pour sélectionner un personnage
      const characterSelection = await getPlayerResponse(zk, auteurMessage, origineMessage);
      await sendCharacterCard(zk, origineMessage, characterSelection);

    } catch (error) {
      await zk.sendMessage(origineMessage, { text: "Une erreur est survenue. Veuillez réessayer." });
      console.error("Erreur dans la commande list_abm :", error);
    }
  }
);