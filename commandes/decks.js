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

// État initial d'une partie
const initialState = {
  lp: 4000, // Points de vie
  hand: [], // Cartes en main
  field: {
    monster: [null, null, null], // Zones monstre (max 3)
    spell: [null, null, null], // Zones magie/piège (max 3)
    field: null // Zone terrain
  },
  graveyard: [], // Cimetière
  banished: [], // Cartes bannies
  extra: [], // Extra deck
  main: [], // Deck principal
  competence: "", // Compétence
  nom: "" // Nom du deck
};

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
      sessionData.pioches || [],
      sessionData.state || initialState
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
        pioches: session.pioches || [],
        state: session.game_state || initialState
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération session DB:', error);
    return null;
  }
}

// Commande : .deck <nom> (inchangée mais avec état initial)
zokou(
  { nomCom: 'deck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    if (!arg[0]) {
      const nomsDisponibles = Object.keys(decks)
        .map(n => `• ${n.charAt(0).toUpperCase() + n.slice(1)}`)
        .join('\n');

      await zk.sendMessage(dest, {
        text: `📦 *Decks disponibles :*\n${nomsDisponibles}\n\nUtilise : *-deck nom*`
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
      nom: nomDeck,
      state: {
        ...initialState,
        lp: 4000,
        main: [...deckMelange],
        extra: extra || [],
        competence: competence
      }
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

// NOUVELLE COMMANDE : .etat - Afficher l'état complet du jeu
zokou(
  { nomCom: 'etat', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active. Utilise *-deck nom*`
      }, { quoted: ms });
      return;
    }

    const state = session.state;
    
    const formatZone = (zone) => {
      return zone.map((carte, index) => 
        carte ? `[${index + 1}] ${carte.name}` : `[${index + 1}] Vide`
      ).join('\n');
    };

    const message = `🎮 *ÉTAT DE PARTIE - ${session.nom.toUpperCase()}*\n\n` +
      `❤️ *Points de Vie:* ${state.lp}\n\n` +
      `🃏 *Main (${state.hand.length}):*\n${state.hand.map(c => `• ${c.name}`).join('\n') || 'Vide'}\n\n` +
      `⚔️ *Monstres:*\n${formatZone(state.field.monster)}\n\n` +
      `✨ *Magies/Pièges:*\n${formatZone(state.field.spell)}\n\n` +
      `🏟️ *Terrain:*\n${state.field.field ? state.field.field.name : 'Vide'}\n\n` +
      `⚰️ *Cimetière (${state.graveyard.length}):*\n${state.graveyard.slice(-5).map(c => `• ${c.name}`).join('\n') || 'Vide'}\n\n` +
      `📦 *Deck (${state.main.length}):* ${state.main.length} cartes\n` +
      `🧩 *Extra (${state.extra.length}):* ${state.extra.length} cartes\n` +
      `🚫 *Bannies (${state.banished.length}):* ${state.banished.length} cartes`;

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .lp <montant> - Modifier les points de vie
zokou(
  { nomCom: 'lp', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    if (!arg[0] || isNaN(arg[0])) {
      await zk.sendMessage(dest, {
        text: `❤️ *Points de Vie actuels:* ${session.state.lp}\n\nUtilise: *-lp <montant>*\nEx: *-lp 3500* ou *-lp -500*`
      }, { quoted: ms });
      return;
    }

    const changement = parseInt(arg[0], 10);
    const nouveauxLP = Math.max(0, session.state.lp + changement);

    session.state.lp = nouveauxLP;

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur mise à jour LP.`
      }, { quoted: ms });
      return;
    }

    const operation = changement >= 0 ? `+${changement}` : changement;
    await zk.sendMessage(dest, {
      text: `❤️ *Points de Vie:* ${session.state.lp} (${operation})`
    }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .pioche <nombre> - Piocher des cartes
zokou(
  { nomCom: 'pioche', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active. Utilise *-deck nom*`
      }, { quoted: ms });
      return;
    }

    const nombre = parseInt(arg[0] || '1', 10);
    
    if (isNaN(nombre) || nombre < 1) {
      await zk.sendMessage(dest, {
        text: `❌ Nombre invalide. Utilise: *-pioche <nombre>*`
      }, { quoted: ms });
      return;
    }

    if (nombre > session.state.main.length) {
      await zk.sendMessage(dest, {
        text: `❌ Pas assez de cartes dans le deck (${session.state.main.length} restantes)`
      }, { quoted: ms });
      return;
    }

    const cartesPiochées = session.state.main.splice(0, nombre);
    session.state.hand.push(...cartesPiochées);

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur pioche.`
      }, { quoted: ms });
      return;
    }

    const messagePiochées = cartesPiochées.map(c => `• ${c.name}`).join('\n');
    await zk.sendMessage(dest, {
      text: `🃏 *Pioche de ${nombre} carte(s):*\n${messagePiochées}\n\n📦 *Deck restant:* ${session.state.main.length} cartes\n🎴 *Main maintenant:* ${session.state.hand.length} cartes`
    }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .pose <type> <zone> <index main> - Poser une carte
zokou(
  { nomCom: 'pose', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    if (arg.length < 3) {
      await zk.sendMessage(dest, {
        text: `🎴 *Utilisation:*\n*-pose <type> <zone> <index>*\n\n*Types:* monstre, magie, piege, terrain\n*Zones:* 1-3 (1-2 pour terrain)\n*Index:* position dans la main (1-${session.state.hand.length})\n\nEx: *-pose monstre 1 2*`
      }, { quoted: ms });
      return;
    }

    const [type, zoneStr, indexStr] = arg;
    const zoneIndex = parseInt(zoneStr, 10) - 1;
    const mainIndex = parseInt(indexStr, 10) - 1;

    if (mainIndex < 0 || mainIndex >= session.state.hand.length) {
      await zk.sendMessage(dest, {
        text: `❌ Index main invalide. Main: 1-${session.state.hand.length}`
      }, { quoted: ms });
      return;
    }

    const carte = session.state.hand[mainIndex];

    switch (type.toLowerCase()) {
      case 'monstre':
        if (zoneIndex < 0 || zoneIndex > 2) {
          await zk.sendMessage(dest, { text: `❌ Zone monstre invalide (1-3)` }, { quoted: ms });
          return;
        }
        if (session.state.field.monster[zoneIndex]) {
          await zk.sendMessage(dest, { text: `❌ Zone monstre ${zoneIndex + 1} occupée` }, { quoted: ms });
          return;
        }
        session.state.field.monster[zoneIndex] = carte;
        session.state.hand.splice(mainIndex, 1);
        break;

      case 'magie':
      case 'piege':
        if (zoneIndex < 0 || zoneIndex > 2) {
          await zk.sendMessage(dest, { text: `❌ Zone magie/piège invalide (1-3)` }, { quoted: ms });
          return;
        }
        if (session.state.field.spell[zoneIndex]) {
          await zk.sendMessage(dest, { text: `❌ Zone magie/piège ${zoneIndex + 1} occupée` }, { quoted: ms });
          return;
        }
        session.state.field.spell[zoneIndex] = carte;
        session.state.hand.splice(mainIndex, 1);
        break;

      case 'terrain':
        if (session.state.field.field) {
          session.state.graveyard.push(session.state.field.field);
        }
        session.state.field.field = carte;
        session.state.hand.splice(mainIndex, 1);
        break;

      default:
        await zk.sendMessage(dest, { text: `❌ Type invalide: monstre, magie, piege, terrain` }, { quoted: ms });
        return;
    }

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, { text: `❌ Erreur pose carte` }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `✅ *${carte.name}* posé en ${type} zone ${zoneIndex + 1}`
    }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .cimetiere <action> - Gérer le cimetière
zokou(
  { nomCom: 'cimetiere', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    const action = arg[0]?.toLowerCase();

    if (!action || action === 'voir') {
      const cimetiere = session.state.graveyard.map((c, i) => `[${i + 1}] ${c.name}`).join('\n');
      await zk.sendMessage(dest, {
        text: `⚰️ *Cimetière (${session.state.graveyard.length}):*\n${cimetiere || 'Vide'}`
      }, { quoted: ms });
      return;
    }

    if (action === 'ajouter' && arg[1]) {
      const nomCarte = arg.slice(1).join(' ');
      session.state.graveyard.push({ name: nomCarte });
      const saved = await saveSessionToDB(zk, ms, dest, session);
      if (saved) {
        await zk.sendMessage(dest, { text: `✅ "${nomCarte}" ajouté au cimetière` }, { quoted: ms });
      }
      return;
    }

    if (action === 'vider') {
      session.state.graveyard = [];
      const saved = await saveSessionToDB(zk, ms, dest, session);
      if (saved) {
        await zk.sendMessage(dest, { text: `✅ Cimetière vidé` }, { quoted: ms });
      }
      return;
    }

    await zk.sendMessage(dest, {
      text: `⚰️ *Utilisation:*\n*-cimetiere voir*\n*-cimetiere ajouter <nom>*\n*-cimetiere vider*`
    }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .main <action> - Gérer la main
zokou(
  { nomCom: 'main', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    const action = arg[0]?.toLowerCase();

    if (!action || action === 'voir') {
      const main = session.state.hand.map((c, i) => `[${i + 1}] ${c.name}`).join('\n');
      await zk.sendMessage(dest, {
        text: `🎴 *Main (${session.state.hand.length}):*\n${main || 'Vide'}`
      }, { quoted: ms });
      return;
    }

    if (action === 'defausse' && arg[1]) {
      const index = parseInt(arg[1], 10) - 1;
      if (index >= 0 && index < session.state.hand.length) {
        const carteDefaussee = session.state.hand.splice(index, 1)[0];
        session.state.graveyard.push(carteDefaussee);
        const saved = await saveSessionToDB(zk, ms, dest, session);
        if (saved) {
          await zk.sendMessage(dest, { 
            text: `🗑️ *${carteDefaussee.name}* défaussé au cimetière` 
          }, { quoted: ms });
        }
      } else {
        await zk.sendMessage(dest, { text: `❌ Index main invalide` }, { quoted: ms });
      }
      return;
    }

    await zk.sendMessage(dest, {
      text: `🎴 *Utilisation:*\n*-main voir*\n*-main defausse <index>*`
    }, { quoted: ms });
  }
);

// NOUVELLE COMMANDE : .zone <type> <zone> <action> - Gérer les zones
zokou(
  { nomCom: 'zone', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    if (arg.length < 2) {
      await zk.sendMessage(dest, {
        text: `🎯 *Utilisation:*\n*-zone <type> <zone> <action>*\n\n*Types:* monstre, magie, terrain\n*Zones:* 1-3 (terrain: 1)\n*Actions:* voir, retirer, detruire\n\nEx: *-zone monstre 1 detruire*`
      }, { quoted: ms });
      return;
    }

    const [type, zoneStr, action = 'voir'] = arg;
    const zoneIndex = parseInt(zoneStr, 10) - 1;

    let zone, zoneNom;
    switch (type.toLowerCase()) {
      case 'monstre':
        zone = session.state.field.monster;
        zoneNom = 'monstre';
        if (zoneIndex < 0 || zoneIndex > 2) {
          await zk.sendMessage(dest, { text: `❌ Zone monstre invalide (1-3)` }, { quoted: ms });
          return;
        }
        break;
      case 'magie':
        zone = session.state.field.spell;
        zoneNom = 'magie/piège';
        if (zoneIndex < 0 || zoneIndex > 2) {
          await zk.sendMessage(dest, { text: `❌ Zone magie/piège invalide (1-3)` }, { quoted: ms });
          return;
        }
        break;
      case 'terrain':
        zone = [session.state.field.field];
        zoneNom = 'terrain';
        if (zoneIndex !== 0) {
          await zk.sendMessage(dest, { text: `❌ Zone terrain invalide (1)` }, { quoted: ms });
          return;
        }
        break;
      default:
        await zk.sendMessage(dest, { text: `❌ Type invalide` }, { quoted: ms });
        return;
    }

    const carte = zone[zoneIndex];

    if (action === 'voir') {
      await zk.sendMessage(dest, {
        text: carte ? 
          `🎯 ${zoneNom} zone ${zoneIndex + 1}: *${carte.name}*` :
          `🎯 ${zoneNom} zone ${zoneIndex + 1}: *Vide*`
      }, { quoted: ms });
      return;
    }

    if (!carte) {
      await zk.sendMessage(dest, { text: `❌ Zone ${zoneNom} ${zoneIndex + 1} vide` }, { quoted: ms });
      return;
    }

    if (action === 'retirer') {
      session.state.hand.push(carte);
      zone[zoneIndex] = null;
      await zk.sendMessage(dest, { 
        text: `↩️ *${carte.name}* retiré vers la main` 
      }, { quoted: ms });
    } else if (action === 'detruire') {
      session.state.graveyard.push(carte);
      zone[zoneIndex] = null;
      await zk.sendMessage(dest, { 
        text: `💥 *${carte.name}* détruit → cimetière` 
      }, { quoted: ms });
    }

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, { text: `❌ Erreur action zone` }, { quoted: ms });
    }
  }
);

// NOUVELLE COMMANDE : .mystats - Afficher ses statistiques
zokou(
  { nomCom: 'mystats', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const userId = getUserId(zk, ms);
    
    try {
      const stats = await db.getUserStats(userId);
      
      if (stats.total_games === 0) {
        await zk.sendMessage(dest, {
          text: `📊 *TES STATISTIQUES YU-GI-OH!*\n\nAucune partie enregistrée.\nJoue des parties pour voir tes stats ! 🃏`
        }, { quoted: ms });
        return;
      }

      const message = `📊 *TES STATISTIQUES YU-GI-OH!*\n\n` +
        `🎮 *Parties jouées:* ${stats.total_games}\n` +
        `✅ *Victoires:* ${stats.victories}\n` +
        `❌ *Défaites:* ${stats.defeats}\n` +
        `📈 *Taux de victoire:* ${stats.win_rate}%\n\n` +
        `❤️ *LP moyens (fin):* ${stats.avg_lp_final}\n` +
        `🔄 *Tours moyens:* ${stats.avg_turns}\n` +
        `🃏 *Cartes moyennes/jouées:* ${stats.avg_cards_played}\n\n` +
        `⏰ *Dernière partie:* ${stats.last_game ? new Date(stats.last_game).toLocaleDateString('fr-FR') : 'Jamais'}`;

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      console.error('Erreur mystats:', error);
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la récupération des statistiques.`
      }, { quoted: ms });
    }
  }
);

// NOUVELLE COMMANDE : .myhistory - Historique des parties
zokou(
  { nomCom: 'myhistory', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const userId = getUserId(zk, ms);
    const limit = parseInt(arg[0]) || 5;
    
    if (limit > 20) {
      await zk.sendMessage(dest, {
        text: `❌ Limite maximale: 20 parties`
      }, { quoted: ms });
      return;
    }

    try {
      const history = await db.getUserGameHistory(userId, limit);
      
      if (history.length === 0) {
        await zk.sendMessage(dest, {
          text: `📜 *TON HISTORIQUE YU-GI-OH!*\n\nAucune partie enregistrée.`
        }, { quoted: ms });
        return;
      }

      let message = `📜 *TES ${history.length} DERNIÈRES PARTIES*\n\n`;
      
      history.forEach((game, index) => {
        const resultEmoji = game.result === 'Victoire' ? '✅' : '❌';
        const date = new Date(game.created_at).toLocaleDateString('fr-FR');
        
        message += `${resultEmoji} *Partie ${index + 1}* (${date})\n` +
          `🃏 Deck: ${game.deck_name}\n` +
          `📊 Résultat: ${game.result}\n` +
          `❤️ LP finaux: ${game.lp_final}\n` +
          `🔄 Tours: ${game.turns_played || 'N/A'}\n` +
          `🎴 Cartes: ${game.cards_played || 'N/A'}\n` +
          `⏱️ Durée: ${game.duration || 'N/A'}\n\n`;
      });

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      console.error('Erreur myhistory:', error);
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la récupération de l'historique.`
      }, { quoted: ms });
    }
  }
);

// NOUVELLE COMMANDE : .classement - Classement du groupe
zokou(
  { nomCom: 'classement', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const groupId = getGroupId(dest);
    const limit = parseInt(arg[0]) || 10;
    
    if (limit > 20) {
      await zk.sendMessage(dest, {
        text: `❌ Limite maximale: 20 joueurs`
      }, { quoted: ms });
      return;
    }

    try {
      const ranking = await db.getGroupRanking(groupId, limit);
      
      if (ranking.length === 0) {
        await zk.sendMessage(dest, {
          text: `🏆 *CLASSEMENT YU-GI-OH!*\n\nAucune donnée de classement disponible.\nLes joueurs doivent terminer des parties pour apparaître ici.`
        }, { quoted: ms });
        return;
      }

      let message = `🏆 *CLASSEMENT YU-GI-OH - TOP ${ranking.length}*\n\n`;
      
      ranking.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const shortUserId = player.user_id.length > 15 ? 
          player.user_id.substring(0, 12) + '...' : player.user_id;
        
        message += `${medal} *${shortUserId}*\n` +
          `   📊 ${player.win_rate}% victoires (${player.victories}/${player.total_games})\n` +
          `   ❤️ LP moyens: ${Math.round(player.avg_lp) || 0}\n\n`;
      });

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      console.error('Erreur classement:', error);
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la récupération du classement.`
      }, { quoted: ms });
    }
  }
);

// NOUVELLE COMMANDE : .finpartie <résultat> - Terminer une partie et sauvegarder
zokou(
  { nomCom: 'finpartie', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active. Utilise *-deck nom* d'abord.`
      }, { quoted: ms });
      return;
    }

    const result = arg[0]?.toLowerCase();
    if (!result || !['victoire', 'defaite', 'victoire', 'défaite'].includes(result)) {
      await zk.sendMessage(dest, {
        text: `🎯 *Utilisation:*\n*-finpartie <résultat>*\n\nRésultats possibles: victoire, defaite\n\nEx: *-finpartie victoire*`
      }, { quoted: ms });
      return;
    }

    const userId = getUserId(zk, ms);
    const groupId = getGroupId(dest);
    const state = session.state;

    try {
      // Calculer quelques statistiques basiques
      const turnsPlayed = 1; // À améliorer avec un vrai compteur de tours
      const cardsPlayed = state.graveyard.length + state.banished.length;

      // Sauvegarder dans l'historique
      const gameData = {
        lp_final: state.lp,
        hand_final: state.hand.length,
        graveyard_final: state.graveyard.length,
        banished_final: state.banished.length,
        deck_remaining: state.main.length
      };

      await db.saveYugiohGameHistory(
        userId,
        groupId,
        session.nom,
        result.charAt(0).toUpperCase() + result.slice(1), // Capitaliser
        state.lp,
        gameData,
        turnsPlayed,
        cardsPlayed
      );

      // Réinitialiser la partie
      session.state = {
        ...initialState,
        lp: 4000,
        main: [...state.main], // Garder le deck actuel
        extra: [...state.extra],
        competence: state.competence
      };

      await saveSessionToDB(zk, ms, dest, session);

      const resultEmoji = result === 'victoire' ? '🎉' : '💔';
      await zk.sendMessage(dest, {
        text: `${resultEmoji} *Partie terminée - ${result.toUpperCase()}!*\n\n` +
          `📊 Statistiques enregistrées:\n` +
          `❤️ LP finaux: ${state.lp}\n` +
          `🎴 Main: ${state.hand.length} cartes\n` +
          `⚰️ Cimetière: ${state.graveyard.length} cartes\n` +
          `📦 Deck restant: ${state.main.length} cartes\n\n` +
          `Utilise *-mystats* pour voir tes statistiques !`
      }, { quoted: ms });

    } catch (error) {
      console.error('Erreur finpartie:', error);
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la sauvegarde de la partie.`
      }, { quoted: ms });
    }
  }
);

// MODIFICATION de la commande resetpartie pour proposer finpartie
zokou(
  { nomCom: 'resetpartie', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.state) {
      await zk.sendMessage(dest, {
        text: `❌ Aucune partie active.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🔄 *Réinitialisation de partie*\n\n` +
        `Si tu veux sauvegarder tes statistiques, utilise d'abord:\n` +
        `📊 *-finpartie victoire* (si tu as gagné)\n` +
        `📊 *-finpartie defaite* (si tu as perdu)\n\n` +
        `Sinon, réponds par *OUI* pour réinitialiser sans sauvegarder.`
    }, { quoted: ms });

    // Tu peux ajouter ici un système de confirmation si tu veux
    // Pour l'instant je garde la logique simple de réinitialisation directe
    
    // Réinitialiser la partie
    session.state = {
      ...initialState,
      lp: 4000,
      main: [...session.state.main],
      extra: [...session.state.extra],
      competence: session.state.competence
    };

    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur réinitialisation.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🔄 *Partie réinitialisée !*\n❤️ LP: 4000\n🎴 Main: 0 cartes\n📦 Deck: ${session.state.main.length} cartes`
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
      text: `🃏 Deck mélangé ! ${session.deck.length} cartes restantes.\n\n*⚠️ Si vous venez de mélanger votre deck volontairement sans effet d'une carte c'est une fraude.\n❌ *Deck Manipulation – Cheating :* Un joueur n’est autorisé à mélanger son Deck que lorsque un effet de carte lui demande d’y toucher. Mélanger à n’importe quel autre moment est considéré comme une manipulation illégale du Deck.`
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
          caption: `*🃏 CATALOGUE YU-GI-OH!*\n• ${sortedCartes.length} cartes\n• Utilise *-carte nom*`
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
        caption: `*${typeCarte} ${nomTrouve}*\nType: Inconnu\nATK/DEF: Inconnu`
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
  saveSessionToDB,
  initialState
};