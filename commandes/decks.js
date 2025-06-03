// 📁 commandes/pioche.js
const { zokou } = require('../framework/zokou');
const { decks } = require('../commandes/deck_manager');
const { deck_cards } = require("../commandes/deck_cards");

// Fonction utilitaire : normalise les noms (sans majuscules ni accents)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Pour stocker les decks actifs des joueurs (en mémoire vive)
const sessions = {};

// Commande : .deck <nom>
zokou(
  { nomCom: 'deck', categorie: 'YU-GI-OH' },
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
  { nomCom: 'pioche', categorie: 'YU-GI-OH' },
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
  {
    nomCom: 'melanger',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    if (!sessions[dest] || !sessions[dest].deck || !sessions[dest].nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de mélanger.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = sessions[dest].nom;
    const deckOriginal = decks[nomDeck];
    const cartesRestantes = sessions[dest].deck;

    // Mélange uniquement les cartes non piochées
    const deckMelange = [...cartesRestantes].sort(() => Math.random() - 0.5);
    sessions[dest].deck = deckMelange;

    const contenu = `🧠 *Compétence :*\n• ${deckOriginal.competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n• ${deckMelange.join('\n• ')}\n\n🧩 *Extra Deck (${deckOriginal.extra.length}) :*\n• ${deckOriginal.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckOriginal.image },
      caption: contenu
    }, { quoted: ms });
  }
);

// commande : .resetdeck
zokou(
  {
    nomCom: 'resetdeck',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    if (!sessions[dest] || !sessions[dest].nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de réinitialiser.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = sessions[dest].nom;
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Le deck "${nomDeck}" n'existe pas ou a été supprimé.`
      }, { quoted: ms });
      return;
    }

    const deckRemelange = [...deckData.main].sort(() => Math.random() - 0.5);

    // Mise à jour de la session
    sessions[dest] = {
      nom: nomDeck,
      deck: deckRemelange,
      pioches: [] // Reset aussi les cartes piochées
    };

    const contenu = `🧠 *Compétence :*\n• ${deckData.competence}\n\n🃏 *Deck Principal (${deckRemelange.length}) :*\n• ${deckRemelange.join('\n• ')}\n\n🧩 *Extra Deck (${deckData.extra.length}) :*\n• ${deckData.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckData.image },
      caption: contenu
    }, { quoted: ms });
  }
);

// commande : .carte
zokou({
  nom: "carte",
  categorie: "YU-GI-OH"
},
async ({ dest, zk, commandeOptions }) => {
  const { arg, ms } = commandeOptions;

  if (!arg || arg.length === 0) {
    await zk.sendMessage(dest, {
      text: `❌ Veuillez fournir le nom d'une carte. Exemple : .carte Dragon Blanc aux Yeux Bleus`,
    }, { quoted: ms });
    return;
  }

  const nomRecherche = normalize(arg.join(" "));
  const nomTrouve = Object.keys(deck_cards).find(
    nom => normalize(nom) === nomRecherche
  );

  if (nomTrouve) {
    await zk.sendMessage(dest, {
      image: { url: deck_cards[nomTrouve] },
      caption: `🃏 *${nomTrouve}*`,
    }, { quoted: ms });
  } else {
    await zk.sendMessage(dest, {
      text: `❌ Carte introuvable : "${arg.join(" ")}"\n\n🧠 Vérifie l'orthographe ou utilise un nom plus précis.`,
    }, { quoted: ms });
  }
});

module.exports = { sessions };