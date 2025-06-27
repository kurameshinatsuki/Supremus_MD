// 📁 fichier/decks.js
const { zokou } = require('../framework/zokou');
const { decks } = require('../commandes/deck_manager');
const { deck_cards } = require("../commandes/deck_cards");
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

// Fonction utilitaire : normalise les noms (sans majuscules ni accents)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Pour stocker les decks actifs des joueurs (en mémoire vive)
const sessions = {};

// commande : .deck <nom>
zokou(
  { nomCom: 'deck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    // Si aucun nom de deck n’est fourni, lister les decks disponibles
    if (!arg[0]) {
      const nomsDisponibles = Object.keys(decks)
        .map(n => `• ${n.charAt(0).toUpperCase() + n.slice(1)}`)
        .join('\n');

     await zk.sendMessage(dest, {
      image: { url: 'https://i.ibb.co/T907ppk/Whats-App-Image-2025-06-17-at-19-20-20-1.jpg' },
      caption: `📦 *Decks disponibles :*\n${nomsDisponibles}\n\n🔁 Tape la commande avec un nom de deck. Exemple : *.deck yami*`
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

    const contenu = `🧠 *Compétence :*\n• ${competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n• ${deckMelange.join('\n• ')}` +
      (extra?.length
        ? `\n\n🧩 *Extra Deck (${extra.length}) :*\n• ${extra.join('\n• ')}`
        : '');

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

// Commande : .carte
zokou(
  {
    nomCom: 'carte',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    // 📘 Si aucun argument, envoyer un HTML catalogue
    if (!arg || arg.length === 0) {
      const sortedCartes = Object.keys(deck_cards).sort((a, b) => a.localeCompare(b));
      const html = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Catalogue Yu-Gi-Oh Cards</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: url('https://i.ibb.co/ycJLcFn6/Image-2025-03-17-00-21-51-2.jpg') no-repeat center center fixed;
              background-size: cover;
              color: #f0f0f0;
              padding: 20px;
              max-width: 900px;
              margin: auto;
              text-shadow: 2px 2px 5px #000;
            }
            h1 {
              text-align: center;
              font-size: 36px;
              color: #f1c40f;
              margin-bottom: 30px;
            }
            ul {
              list-style: none;
              padding-left: 0;
              columns: 2;
            }
            li {
              margin-bottom: 8px;
              font-size: 16px;
              line-height: 1.5;
              position: relative;
              padding-left: 20px;
            }
            li::before {
              content: "🃏";
              position: absolute;
              left: 0;
              color: #e67e22;
            }
          </style>
        </head>
        <body>
          <h1>🃏 Cartes Yu-Gi-Oh Disponibles</h1>
          <ul>
            ${sortedCartes.map(carte => `<li>${carte}</li>`).join('\n')}
          </ul>
        </body>
        </html>
      `;

      const fileName = `deck_list_${randomInt(10000)}.html`;
      writeFileSync(fileName, html);

      await zk.sendMessage(dest, {
        document: readFileSync(fileName),
        mimetype: 'text/html',
        filename: 'deck_cards.html',
        caption: `*🎴 LISTE DES CARTES YU-GI-OH! 🎴* \n*CARTES DISPONIBLES :* ${sortedCartes.length}`,
      }, { quoted: ms });

      unlinkSync(fileName);
      return;
    }

    // 🔍 Rechercher une carte spécifique
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
  }
);

module.exports = { sessions };
