const { zokou } = require('../framework/zokou');
const { decks } = require('../commandes/deck_manager');
const { deck_cards } = require("../commandes/deck_cards");
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');
const db = require("../bdd/game_bdd"); // Import de la base de données

// Fonction utilitaire : normalise les noms (sans majuscules ni accents)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction pour générer un ID utilisateur unique à partir des infos du message
function getUserId(zk, ms) {
  return ms.key.participant || ms.key.remoteJid || 'unknown';
}

// Fonction pour obtenir l'ID du groupe
function getGroupId(dest) {
  return dest;
}

// Fonction pour sauvegarder la session en base de données
async function saveSessionToDB(zk, ms, dest, sessionData) {
  const userId = getUserId(zk, ms);
  const groupId = getGroupId(dest);
  
  try {
    await db.saveDeckSession(
      userId, 
      groupId, 
      sessionData.nom, 
      sessionData.deck, 
      sessionData.pioches || []
    );
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde session DB:', error);
    return false;
  }
}

// Fonction pour récupérer la session depuis la base de données
async function getSessionFromDB(zk, ms, dest) {
  const userId = getUserId(zk, ms);
  const groupId = getGroupId(dest);
  
  try {
    const session = await db.getDeckSession(userId, groupId);
    if (session) {
      return {
        nom: session.deck_name,
        deck: session.deck_data,
        pioches: session.pioches || []
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération session DB:', error);
    return null;
  }
}

// Commande : .deck <nom>
zokou(
  { nomCom: 'deck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms, auteurMessage } = commandeOptions;

    // Si aucun nom de deck n'est fourni, lister les decks disponibles
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
    
    // Assigner un ID numérique unique à chaque carte (1, 2, 3...)
    const deckAvecIds = main.map((name, index) => ({
      id: index + 1,
      name
    }));

    const deckMelange = [...deckAvecIds].sort(() => Math.random() - 0.5);

    const sessionData = {
      deck: deckMelange,
      pioches: [],
      nom: nomDeck
    };

    // Sauvegarde en base de données
    const saved = await saveSessionToDB(zk, ms, dest, sessionData);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la création du deck. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n` +
      deckMelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      (extra?.length
        ? `\n\n🧩 *Extra Deck (${extra.length}) :*\n• ${extra.join('\n• ')}`
        : '');

    await zk.sendMessage(dest, {
      image: { url: image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .pioche <id>
zokou(
  { nomCom: 'pioche', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de piocher.`
      }, { quoted: ms });
      return;
    }

    if (!arg[0] || isNaN(arg[0])) {
      await zk.sendMessage(dest, {
        text: `❌ Veuillez spécifier l'ID de la carte à piocher. Exemple : *.pioche 3*`
      }, { quoted: ms });
      return;
    }

    const idCarte = parseInt(arg[0], 10);
    const carteIndex = session.deck.findIndex(c => c.id === idCarte);

    if (carteIndex === -1) {
      await zk.sendMessage(dest, {
        text: `❌ ID invalide. Utilise *.mondeck* pour voir les IDs disponibles.`
      }, { quoted: ms });
      return;
    }

    const cartePiochée = session.deck.splice(carteIndex, 1)[0];
    session.pioches.push(cartePiochée);

    // Sauvegarder les modifications en base de données
    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la pioche. Réessayez.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🃏 Vous avez pioché : *${cartePiochée.name}* (ID: ${cartePiochée.id})\n🗂️ Cartes restantes : ${session.deck.length}`
    }, { quoted: ms });
  }
);

// Commande : .mondeck
zokou(
  { nomCom: 'mondeck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Commence avec *.deck <nom>*`
      }, { quoted: ms });
      return;
    }
    
    const cartesRestantes = session.deck
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const cartesPiochées = session.pioches
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const message = `🗂️ *DECK ACTUEL: ${session.nom.toUpperCase()}*\n\n` +
      `📦 *CARTES RESTANTES (${session.deck.length}):*\n${cartesRestantes}\n\n` +
      `🎴 *CARTES PIOCHEES (${session.pioches.length}):*\n${cartesPiochées}`;

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
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

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck || !session.nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de mélanger.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = session.nom;
    const deckOriginal = decks[nomDeck];
    const cartesRestantes = [...session.deck]; // Copie

    // Mélanger en conservant les IDs
    const deckMelange = cartesRestantes.sort(() => Math.random() - 0.5);
    session.deck = deckMelange;

    // Sauvegarder les modifications en base de données
    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors du mélange. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${deckOriginal.competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n` +
      deckMelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      `\n\n🧩 *Extra Deck (${deckOriginal.extra.length}) :*\n• ${deckOriginal.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckOriginal.image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .resetdeck
zokou(
  {
    nomCom: 'resetdeck',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de réinitialiser.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = session.nom;
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Le deck "${nomDeck}" n'existe pas ou a été supprimé.`
      }, { quoted: ms });
      return;
    }

    // Recréer le deck avec les mêmes IDs
    const deckRemelange = deckData.main.map((name, index) => ({
      id: index + 1,
      name
    })).sort(() => Math.random() - 0.5);

    // Mise à jour de la session
    const newSession = {
      nom: nomDeck,
      deck: deckRemelange,
      pioches: []
    };

    // Sauvegarder la nouvelle session en base de données
    const saved = await saveSessionToDB(zk, ms, dest, newSession);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la réinitialisation. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${deckData.competence}\n\n🃏 *Deck Principal (${deckRemelange.length}) :*\n` +
      deckRemelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      `\n\n🧩 *Extra Deck (${deckData.extra.length}) :*\n• ${deckData.extra.join('\n• ')}`;

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

// Nouvelle commande : .cleanmydeck - Supprimer sa session
zokou(
  {
    nomCom: 'cleanmydeck',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const userId = getUserId(zk, ms);
    const groupId = getGroupId(dest);
    
    try {
      const deleted = await db.deleteDeckSession(userId, groupId);
      if (deleted) {
        await zk.sendMessage(dest, {
          text: `✅ Votre session de deck a été supprimée avec succès.`
        }, { quoted: ms });
      } else {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucune session de deck active à supprimer.`
        }, { quoted: ms });
      }
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la suppression de la session.`
      }, { quoted: ms });
    }
  }
);

// Nouvelle commande : .groupdecks - Voir les decks du groupe
zokou(
  {
    nomCom: 'groupdecks',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const groupId = getGroupId(dest);
    
    try {
      const sessions = await db.getGroupDeckSessions(groupId);
      if (sessions.length === 0) {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucun deck actif dans ce groupe.`
        }, { quoted: ms });
        return;
      }

      const message = `🗂️ *DECKS ACTIFS DU GROUPE*\n\n` +
        sessions.map(session => 
          `👤 Utilisateur: ${session.user_id}\n` +
          `🃏 Deck: ${session.deck_name}\n` +
          `🕐 Dernière activité: ${new Date(session.updated_at).toLocaleString()}\n` +
          `────────────────`
        ).join('\n');

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la récupération des decks du groupe.`
      }, { quoted: ms });
    }
  }
);

module.exports = { 
  // Export des fonctions utilitaires pour un usage externe si nécessaire
  getSessionFromDB,
  saveSessionToDB
};