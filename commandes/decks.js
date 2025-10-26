const { zokou } = require('../framework/zokou');
const { decks } = require('../commandes/deck_manager');
const { deck_cards } = require("../commandes/deck_cards");
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');
const db = require("../bdd/game_bdd");

// Fonction utilitaire : normalise les noms (sans majuscules ni accents)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction pour générer un ID utilisateur unique
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
    const { arg, ms } = commandeOptions;

    if (!arg[0]) {
      const nomsDisponibles = Object.keys(decks)
        .map(n => `• ${n.charAt(0).toUpperCase() + n.slice(1)}`)
        .join('\n');

      await zk.sendMessage(dest, {
        text: `📦 *Decks disponibles :*\n${nomsDisponibles}\n\nUtilise : *.deck nom*`
      }, { quoted: ms });
      return;
    }

    const nomDeck = arg[0].toLowerCase();
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Deck "${nomDeck}" introuvable.`
      }, { quoted: ms });
      return;
    }

    const { image, competence, main, extra } = deckData;
    
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

    const saved = await saveSessionToDB(zk, ms, dest, sessionData);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur création deck.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :* ${competence}\n\n🃏 *Deck (${deckMelange.length}) :*\n` +
      deckMelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      (extra?.length ? `\n\n🧩 *Extra :*\n${extra.join('\n')}` : '');

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

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilise *.deck nom*`
      }, { quoted: ms });
      return;
    }

    if (!arg[0] || isNaN(arg[0])) {
      await zk.sendMessage(dest, {
        text: `❌ Spécifie un ID. Ex: *.pioche 3*`
      }, { quoted: ms });
      return;
    }

    const idCarte = parseInt(arg[0], 10);
    const carteIndex = session.deck.findIndex(c => c.id === idCarte);

    if (carteIndex === -1) {
      await zk.sendMessage(dest, {
        text: `❌ ID invalide. Utilise *.mondeck*`
      }, { quoted: ms });
      return;
    }

    const cartePiochée = session.deck.splice(carteIndex, 1)[0];
    session.pioches.push(cartePiochée);

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur pioche.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🃏 Pioche : *${cartePiochée.name}* (ID: ${cartePiochée.id})\n🗂️ Restantes : ${session.deck.length}`
    }, { quoted: ms });
  }
);

// Commande : .mondeck
zokou(
  { nomCom: 'mondeck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif.`
      }, { quoted: ms });
      return;
    }
    
    const cartesRestantes = session.deck
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const cartesPiochées = session.pioches
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const message = `🗂️ *DECK: ${session.nom.toUpperCase()}*\n\n` +
      `📦 *RESTANTES (${session.deck.length}):*\n${cartesRestantes}\n\n` +
      `🎴 *PIOCHEES (${session.pioches.length}):*\n${cartesPiochées}`;

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
  }
);

// Commande : .melanger
zokou(
  { nomCom: 'melanger', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif.`
      }, { quoted: ms });
      return;
    }

    session.deck = session.deck.sort(() => Math.random() - 0.5);

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur mélange.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🃏 Deck mélangé ! ${session.deck.length} cartes restantes.`
    }, { quoted: ms });
  }
);

// Commande : .resetdeck
zokou(
  { nomCom: 'resetdeck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = session.nom;
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Deck "${nomDeck}" introuvable.`
      }, { quoted: ms });
      return;
    }

    const deckRemelange = deckData.main.map((name, index) => ({
      id: index + 1,
      name
    })).sort(() => Math.random() - 0.5);

    const newSession = {
      nom: nomDeck,
      deck: deckRemelange,
      pioches: []
    };

    const saved = await saveSessionToDB(zk, ms, dest, newSession);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur reset.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `✅ Deck réinitialisé ! ${deckRemelange.length} cartes.`
    }, { quoted: ms });
  }
);

// Commande : .carte
zokou(
  { nomCom: 'carte', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    if (!arg || arg.length === 0) {
      const sortedCartes = Object.keys(deck_cards).sort((a, b) => a.localeCompare(b));
      
      const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yu-Gi-Oh! Cartes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #1a1a2e;
            color: white;
            padding: 10px;
            margin: 0;
        }
        .container {
            background: #16213e;
            border-radius: 8px;
            padding: 15px;
            margin: 0 auto;
            max-width: 100%;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ffd700;
        }
        .title {
            color: #ffd700;
            font-size: 1.5em;
            margin: 5px 0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255,215,0,0.1);
            border-radius: 5px;
        }
        .cartes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 8px;
            margin: 15px 0;
        }
        .carte-item {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid rgba(255,215,0,0.3);
        }
        .carte-nom {
            font-size: 0.9em;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,215,0,0.3);
            color: #ccc;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🃏 YU-GI-OH!</h1>
            <p>Collection de Cartes</p>
        </div>
        
        <div class="stats">
            <div>
                <div style="font-size:1.2em;color:#ffd700">${sortedCartes.length}</div>
                <div style="font-size:0.8em">Cartes</div>
            </div>
            <div>
                <div style="font-size:1.2em;color:#ffd700">${new Date().getFullYear()}</div>
                <div style="font-size:0.8em">Édition</div>
            </div>
        </div>
        
        <div class="cartes-grid">
            ${sortedCartes.map(carte => `
                <div class="carte-item">
                    <div class="carte-nom">${carte}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>Yu-Gi-Oh! Collection</p>
        </div>
    </div>
</body>
</html>
      `;

      const fileName = `yugioh_${randomInt(10000)}.html`;
      writeFileSync(fileName, html);

      try {
        await zk.sendMessage(dest, {
          document: readFileSync(fileName),
          mimetype: 'text/html',
          filename: 'yugioh_cartes.html',
          caption: `*🃏 CATALOGUE YU-GI-OH!*\n• ${sortedCartes.length} cartes\n• Utilise *.carte nom*`
        }, { quoted: ms });
      } catch (error) {
        console.error('Erreur:', error);
        await zk.sendMessage(dest, {
          text: `❌ Erreur affichage.`
        }, { quoted: ms });
      } finally {
        unlinkSync(fileName);
      }
      return;
    }

    const nomRecherche = normalize(arg.join(" "));
    const nomTrouve = Object.keys(deck_cards).find(
      nom => normalize(nom) === nomRecherche
    );

    if (nomTrouve) {
      const typeCarte = nomTrouve.includes('Dragon') ? '🐉' :
                       nomTrouve.includes('Magicien') ? '🧙' :
                       nomTrouve.includes('Guerrier') ? '⚔️' :
                       nomTrouve.includes('Magic') ? '✨' :
                       nomTrouve.includes('Piège') ? '🕳️' : '🃏';

      await zk.sendMessage(dest, {
        image: { url: deck_cards[nomTrouve] },
        caption: `*${typeCarte} ${nomTrouve}*\nType: Monstre/Effet\nATK/DEF: 2500/2000`
      }, { quoted: ms });
    } else {
      const suggestions = Object.keys(deck_cards).filter(nom =>
        normalize(nom).includes(nomRecherche) || 
        nomRecherche.includes(normalize(nom).substring(0, 3))
      ).slice(0, 5);

      let message = `❌ Carte "${arg.join(" ")}" introuvable.\n`;
      
      if (suggestions.length > 0) {
        message += `Suggestions:\n${suggestions.map((sugg, index) => `${index + 1}. ${sugg}`).join('\n')}`;
      }
      
      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    }
  }
);

// cleanmydeck - Supprimer sa session
zokou(
  { nomCom: 'cleanmydeck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const userId = getUserId(zk, ms);
    const groupId = getGroupId(dest);
    
    try {
      const deleted = await db.deleteDeckSession(userId, groupId);
      if (deleted) {
        await zk.sendMessage(dest, {
          text: `✅ Session supprimée.`
        }, { quoted: ms });
      } else {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucune session active.`
        }, { quoted: ms });
      }
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur suppression.`
      }, { quoted: ms });
    }
  }
);

// groupdecks - Voir les decks du groupe
zokou(
  { nomCom: 'groupdecks', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const groupId = getGroupId(dest);
    
    try {
      const sessions = await db.getGroupDeckSessions(groupId);
      if (sessions.length === 0) {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucun deck actif.`
        }, { quoted: ms });
        return;
      }

      const message = `🗂️ *DECKS ACTIFS*\n\n` +
        sessions.map(session => 
          `👤 ${session.user_id}\n🃏 ${session.deck_name}\n`
        ).join('\n');

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur récupération.`
      }, { quoted: ms });
    }
  }
);

module.exports = { 
  getSessionFromDB,
  saveSessionToDB
};
