const { zokou } = require('../framework/zokou');

// Liste des univers et personnages avec leur statut et lien d'image
const verses = {
  "Black Clover": {
    C: [
      { nom: "ASTA", statut: "Standard", url: "https://i.ibb.co/b7nG8PT/Image-2024-09-22-23-51-04-0.jpg" },
      { nom: "YUNO", statut: "Premium", url: "https://i.ibb.co/gdTzR95/Image-2024-09-22-23-51-04-1.jpg" },
      { nom: "LÉOPOLD", statut: "Standard", url: "https://i.ibb.co/BzQ41L5/Image-2024-09-22-23-51-04-5.jpg" },
      { nom: "GAUCHE", statut: "Standard", url: "https://i.ibb.co/dtdqN3v/Image-2024-09-22-23-51-04-6.jpg" },
      { nom: "MAGNA", statut: "Standard", url: "https://i.ibb.co/j580P6c/Image-2024-09-22-23-51-04-3.jpg" },
      { nom: "LUCK", statut: "Premium", url: "https://i.ibb.co/y6ssxQ0/Image-2024-09-22-23-51-04-4.jpg" },
      { nom: "NOELLE", statut: "Premium", url: "https://i.ibb.co/23kcHZx/Image-2024-09-22-23-51-04-2.jpg" },
      { nom: "VANESSA", statut: "Premium", url: "https://i.ibb.co/RQpvRyD/Image-2024-09-22-23-51-04-7.jpg" },
      { nom: "ZORA", statut: "Standard", url: "https://i.ibb.co/1MGtpKF/Image-2024-09-22-23-51-04-8.jpg" },
      { nom: "LANGRIS", statut: "Premium", url: "https://i.ibb.co/GvNHQ7R/Image-2024-09-22-23-51-04-9.jpg" }
    ]
  },
  "Demon Slayer": {
    C: [
      { nom: "RIU", statut: "Premium", url: "https://i.ibb.co/k0jFqQj/Image-2024-09-23-16-51-29-8.jpg" },
      { nom: "GIYU", statut: "Premium", url: "https://i.ibb.co/k9xb9VG/Image-2024-09-23-16-51-29-2.jpg" },
      { nom: "ZENITSU", statut: "Premium", url: "https://i.ibb.co/BqbZ7VN/Image-2024-09-23-16-51-29-3.jpg" },
      { nom: "ENMU", statut: "Premium", url: "https://i.ibb.co/1r3g39z/Image-2024-09-23-16-51-29-7.jpg" },
      { nom: "SUSAMARU", statut: "Standard", url: "https://i.ibb.co/VggXmkz/Image-2024-09-23-16-51-29-6.jpg" },
      { nom: "YAHABA", statut: "Standard", url: "https://i.ibb.co/hBcm3gf/Image-2024-09-23-16-51-29-5.jpg" },
      { nom: "NEZUKO", statut: "Standard", url: "https://i.ibb.co/h8Jt7JG/Image-2024-09-23-16-51-29-1.jpg" },
      { nom: "INOSUKE", statut: "Standard", url: "https://i.ibb.co/LZ1nWyM/Image-2024-09-23-16-51-29-4.jpg" },
      { nom: "TANJIRO", statut: "Standard", url: "https://i.ibb.co/fnzKSqB/Image-2024-09-23-16-51-29-0.jpg" }
    ]
  }
};

// Fonction pour envoyer un message de bienvenue
const sendWelcomeMessage = async (zk, origineMessage) => {
  const bienvenueMsg = `*Bienvenue dans l'ABM Catalogue !*\n\nChoisissez un univers parmi les suivants :\n- Black Clover\n- Demon Slayer\n\nTapez le nom de l'univers.`;
  await zk.sendMessage(origineMessage, { text: bienvenueMsg });
};

// Fonction pour envoyer la liste des personnages après sélection de l'univers et du rang
const sendCharacterList = async (zk, origineMessage, verse, rang) => {
  const personnages = verses[verse][rang];
  let message = `Personnages de rang ${rang} dans l'univers ${verse} :\n`;
  personnages.forEach(p => {
    message += `- ${p.nom} (${p.statut})\n`;
  });
  message += `\nTapez le nom du personnage pour voir sa carte.`;
  await zk.sendMessage(origineMessage, { text: message });
};

// Fonction pour envoyer l'image du personnage
const sendCharacterCard = async (zk, origineMessage, verse, rang, characterName) => {
  const personnage = verses[verse][rang].find(p => p.nom.toLowerCase() === characterName.toLowerCase());
  if (personnage) {
    await zk.sendMessage(origineMessage, {
      image: { url: personnage.url },
      caption: `${personnage.nom} (${personnage.statut})`
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
    categorie: 'CENTRAL'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage } = commandeOptions;

    try {
      await sendWelcomeMessage(zk, origineMessage);

      const universSelection = await getPlayerResponse(zk, auteurMessage, origineMessage);
      if (!verses[universSelection]) {
        await zk.sendMessage(origineMessage, { text: "Univers invalide. Veuillez réessayer." });
        return;
      }

      await zk.sendMessage(origineMessage, { text: "Choisissez un rang :\n- C" });

      const rangSelection = await getPlayerResponse(zk, auteurMessage, origineMessage);
      if (rangSelection.toUpperCase() !== 'C') {
        await zk.sendMessage(origineMessage, { text: "Rang invalide. Veuillez réessayer." });
        return;
      }

      await sendCharacterList(zk, origineMessage, universSelection, 'C');

      const characterSelection = await getPlayerResponse(zk, auteurMessage, origineMessage);
      await sendCharacterCard(zk, origineMessage, universSelection, 'C', characterSelection);

    } catch (error) {
      await zk.sendMessage(origineMessage, { text: "Une erreur est survenue. Veuillez réessayer." });
      console.error("Erreur dans la commande list_abm :", error);
    }
  }
);