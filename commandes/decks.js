// 📁 commandes/pioche.js
const { zokou } = require('../framework/zokou');
const { decks } = require('../commande/deck_manager');

// Pour stocker les decks actifs des joueurs (en mémoire vive)
const sessions = {};

// Commande : .deck <nom>
zokou(
  { nomCom: 'deck', categorie: 'YUGIOH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    if (!arg[0]) {
      await zk.sendMessage(dest, {
        text: "❌ Veuillez spécifier un nom de deck. Exemple : *.deck chevaliers*"
      }, { quoted: ms });
      return;
    }

    const nomDeck = arg[0].toLowerCase();
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Le deck "${nomDeck}" n'existe pas.`
      }, { quoted: ms });
      return;
    }

    const { image, competence, main, extra } = deckData;
    const deckMelange = [...main].sort(() => Math.random() - 0.5);

    sessions[dest] = {
      deck: deckMelange,
      pioches: [],
      nom: nomDeck
    };

    const contenu = `🧠 *Compétence :*\n• ${competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n• ${deckMelange.join('\n• ')}\n\n🧩 *Extra Deck (${extra.length}) :*\n• ${extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .pioche <numéro>
zokou(
  { nomCom: 'pioche', categorie: 'YUGIOH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    if (!sessions[dest] || !sessions[dest].deck) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de piocher.`
      }, { quoted: ms });
      return;
    }

    if (!arg[0] || isNaN(arg[0])) {
      await zk.sendMessage(dest, {
        text: `❌ Veuillez spécifier un numéro de carte à piocher. Exemple : *.pioche 3*`
      }, { quoted: ms });
      return;
    }

    const index = parseInt(arg[0], 10) - 1;
    const deckEnCours = sessions[dest].deck;

    if (index < 0 || index >= deckEnCours.length) {
      await zk.sendMessage(dest, {
        text: `❌ Numéro invalide. Le deck contient ${deckEnCours.length} cartes.`
      }, { quoted: ms });
      return;
    }

    const cartePiochée = deckEnCours.splice(index, 1)[0];
    sessions[dest].deck = deckEnCours;

    await zk.sendMessage(dest, {
      text: `🃏 Vous avez pioché : *${cartePiochée}*\n🗂️ Cartes restantes : ${deckEnCours.length}`
    }, { quoted: ms });
  }
);

// Commande : .melanger
zokou(
  { nomCom: 'melanger', categorie: 'YUGIOH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    if (!sessions[dest] || !sessions[dest].deck || !sessions[dest].nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de mélanger.`
      }, { quoted: ms });
      return;
    }

    const deckOriginal = decks[sessions[dest].nom];
    const nouvellePioche = [...deckOriginal.main].sort(() => Math.random() - 0.5);
    sessions[dest].deck = nouvellePioche;

    const contenu = `🧠 *Compétence :*\n• ${deckOriginal.competence}\n\n🃏 *Deck Principal (${nouvellePioche.length}) :*\n• ${nouvellePioche.join('\n• ')}\n\n🧩 *Extra Deck (${deckOriginal.extra.length}) :*\n• ${deckOriginal.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckOriginal.image },
      caption: contenu
    }, { quoted: ms });
  }
);

module.exports = { sessions };