// buypack.js
const { zokou } = require('../framework/zokou');
const { GAME_DATA } = require('./game_data');

// Configuration des packs
const PACK_CONFIG = {
  PRICES: {
    '🥉 bronze': 150,
    '🥈 argent': 200,
    '🥇 or': 250,
    '🏅 special': 300
  },

  PROBABILITIES: {
    '🥉 bronze': { common: 70, rare: 15, epic: 10, legendary: 5 },
    '🥈 argent': { common: 45, rare: 30, epic: 15, legendary: 10 },
    '🥇 or': { common: 10, rare: 45, epic: 35, legendary: 10 },
    '🏅 special': { common: 5, rare: 30, epic: 30, legendary: 35 }
  },

  CONTENTS_COUNT: {
    '🥉 bronze': 3,
    '🥈 argent': 3,
    '🥇 or': 4,
    '🏅 special': 5
  },

  BONUS_RANGES: {
    tokens: { min: 10, max: 50 },
    gemmes: { min: 5, max: 30 },
    coupons: { min: 5, max: 35 }
  }
};

// Fonction pour générer un ID de transaction unique
function generateTransactionId() {
  return Math.random().toString(16).substring(2, 14);
}

// Fonction pour choisir un contenu basé sur la rareté
function chooseContentByRarity(game, rarity) {
  const contents = GAME_DATA[game].contents[rarity];
  return contents[Math.floor(Math.random() * contents.length)];
}

// Fonction pour générer les gains d'un pack
function generatePackRewards(game, packType) {
  const rewards = {
    contents: [],
    bonuses: {
      tokens: Math.floor(Math.random() * 
        (PACK_CONFIG.BONUS_RANGES.tokens.max - PACK_CONFIG.BONUS_RANGES.tokens.min + 1)) + 
        PACK_CONFIG.BONUS_RANGES.tokens.min,
      gemmes: Math.floor(Math.random() * 
        (PACK_CONFIG.BONUS_RANGES.gemmes.max - PACK_CONFIG.BONUS_RANGES.gemmes.min + 1)) + 
        PACK_CONFIG.BONUS_RANGES.gemmes.min,
      coupons: Math.floor(Math.random() * 
        (PACK_CONFIG.BONUS_RANGES.coupons.max - PACK_CONFIG.BONUS_RANGES.coupons.min + 1)) + 
        PACK_CONFIG.BONUS_RANGES.coupons.min
    }
  };

  const probabilities = PACK_CONFIG.PROBABILITIES[packType];
  const contentCount = PACK_CONFIG.CONTENTS_COUNT[packType];

  for (let i = 0; i < contentCount; i++) {
    const rand = Math.random() * 100;
    let rarity;

    if (rand <= probabilities.common) {
      rarity = 'common';
    } else if (rand <= probabilities.common + probabilities.rare) {
      rarity = 'rare';
    } else if (rand <= probabilities.common + probabilities.rare + probabilities.epic) {
      rarity = 'epic';
    } else {
      rarity = 'legendary';
    }

    rewards.contents.push({
      ...chooseContentByRarity(game, rarity),
      rarity: rarity
    });
  }

  // Bonus pour les packs or et spécial (chance d'avoir un contenu commun supplémentaire)
  if ((packType === '🥇 or' || packType === '🏅 special') && Math.random() < 0.3) {
    rewards.contents.push({
      ...chooseContentByRarity(game, 'common'),
      rarity: 'common',
      bonus: true
    });
  }

  return rewards;
}

// Fonction pour formater le message du menu des jeux
function formatGameMenu(playerName, balance) {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - BOUTIQUE]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
👤 *Joueur :* ${playerName}
💳 *Solde coupons :* ${balance}🎟️

*🎮 CHOISISSEZ UN JEU :*

1. 🎭 *ABM* - Anime Battle Multivers
2. 🚗 *Speed Rush* - Course de véhicules
3. 🃏 *Yu-Gi-Oh* - Speed Duel
4. 📜 *Origamy World* - Monde de papier

*💡 Utilisation :*
Répondez avec le numéro du jeu
Exemple : *1* pour ABM

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[SELECTION]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Fonction pour formater le message des packs
function formatPackMenu(playerName, game, balance) {
  const gameName = GAME_DATA[game].name;

  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - BOUTIQUE]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
👤 *Joueur :* ${playerName}
🎮 *Jeu :* ${gameName}
💳 *Solde coupons :* ${balance}🎟️

*📦 CHOISISSEZ UN PACK :*

1. 🥉 *Bronze* - 150🎟️
   • 3 contenus
   • Bonus: tokens, gemmes, coupons
   • Rareté: Commun 70%, Rare 15%, Épique 10%, Légendaire 5%

2. 🥈 *Argent* - 200🎟️
   • 3 contenus  
   • Bonus améliorés
   • Rareté: Commun 45%, Rare 30%, Épique 15%, Légendaire 10%

3. 🥇 *Or* - 250🎟️
   • 4 contenus
   • Chance de contenu bonus
   • Rareté: Commun 10%, Rare 45%, Épique 35%, Légendaire 10%

4. 🏅 *Spécial* - 300🎟️
   • 5 contenus
   • Meilleurs bonus + chance de contenu bonus
   • Rareté: Commun 5%, Rare 30%, Épique 30%, Légendaire 35%

*💡 Utilisation :*
Répondez avec le numéro du pack
Exemple : *1* pour Bronze

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[SELECTION]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Fonction pour formater le message de confirmation
function formatConfirmation(playerName, game, packType, price, balance) {
  const gameName = GAME_DATA[game].name;

  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - CONFIRMATION]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
👤 *Joueur :* ${playerName}
🎮 *Jeu :* ${gameName}
📦 *Pack :* ${packType}
💰 *Prix :* ${price}🎟️
💳 *Solde actuel :* ${balance}🎟️
💳 *Nouveau solde :* ${balance - price}🎟️

*⚠️ CONFIRMER L'ACHAT ?*

*✅ OUI* - Confirmer l'achat
*❌ NON* - Annuler l'achat

Répondez avec *oui* ou *non*

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[CONFIRMATION]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Fonction pour formater le reçu de transaction
function formatReceipt(transactionId, playerName, game, packType, price, rewards, newBalance) {
  const gameName = GAME_DATA[game].name;
  const now = new Date();
  const dateTime = now.toLocaleString('fr-FR');

  let receipt = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - REÇU]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🆔 Transact ID :* ${transactionId}

> *📌 Type :* 💰 Achat  
> *👤 Expéditeur :* ${playerName}
> *🎯 Transaction :* Achat d'un pack ${gameName} de type ${packType}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*💰 Détails de la transaction :*
> *📦 Gain(s) reçu(s) :*\n`;

  // Ajouter les contenus
  rewards.contents.forEach(content => {
    const bonusText = content.bonus ? " (Bonus)" : "";
    receipt += `> - ${content.name} | ${content.rarity}${bonusText}\n`;
  });

  // Ajouter les bonus
  receipt += `> - ${rewards.bonus.coupons} Coupons\n`;
  receipt += `> - ${rewards.bonus.gemmes} Supremus Gemmes\n`;
  receipt += `> - ${rewards.bonus.tokens} Supremus Tokens\n`;

  receipt += `> *💸 Montant débité :* -${price} coupons\n`;
  receipt += `> *💰 Nouveau solde :* ${newBalance} coupons\n`;
  receipt += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
  receipt += `🕒 *Date & Heure :* ${dateTime}\n`;
  receipt += `🔄 *Statut :* valider\n`;
  receipt += `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n`;
  receipt += `*▓▓▓▓▓[TRAITEMENT...]▓▓▓▓▓*\n`;
  receipt += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

  return receipt;
}

// Commande principale buypack
zokou({
  nomCom: "buypack",
  categorie: "SRPN",
  reaction: "🛒",
  desc: "Acheter des packs de jeux avec des coupons"
}, async (dest, zk, { ms, repondre, auteurMessage, nomAuteurMessage }) => {
  try {
    // N'importe qui peut utiliser la commande sans vérification
    
    // Étape 1: Afficher le menu des jeux
    const gameMenu = formatGameMenu(nomAuteurMessage, "N/A");
    await zk.sendMessage(dest, { text: gameMenu }, { quoted: ms });

    // Écouter la réponse pour le choix du jeu
    const gameResponse = await zk.waitForMessage(dest, auteurMessage, 30000);

    if (!gameResponse) {
      return repondre("⏱️ Temps écoulé. Veuillez relancer la commande.");
    }

    const gameChoice = gameResponse.text.trim();
    let selectedGame = null;

    switch (gameChoice) {
      case '1': selectedGame = 'ABM'; break;
      case '2': selectedGame = 'Speed Rush'; break;
      case '3': selectedGame = 'Yu-Gi-Oh'; break;
      case '4': selectedGame = 'Origamy World'; break;
      default: 
        return repondre("❌ Choix invalide. Veuillez relancer la commande.");
    }

    // Étape 2: Afficher le menu des packs
    const packMenu = formatPackMenu(nomAuteurMessage, selectedGame, "N/A");
    await zk.sendMessage(dest, { text: packMenu }, { quoted: ms });

    // Écouter la réponse pour le choix du pack
    const packResponse = await zk.waitForMessage(dest, auteurMessage, 30000);

    if (!packResponse) {
      return repondre("⏱️ Temps écoulé. Veuillez relancer la commande.");
    }

    const packChoice = packResponse.text.trim();
    let selectedPack = null;
    let packPrice = 0;

    switch (packChoice) {
      case '1': 
        selectedPack = '🥉 bronze';
        packPrice = PACK_CONFIG.PRICES[selectedPack];
        break;
      case '2': 
        selectedPack = '🥈 argent';
        packPrice = PACK_CONFIG.PRICES[selectedPack];
        break;
      case '3': 
        selectedPack = '🥇 or';
        packPrice = PACK_CONFIG.PRICES[selectedPack];
        break;
      case '4': 
        selectedPack = '🏅 special';
        packPrice = PACK_CONFIG.PRICES[selectedPack];
        break;
      default: 
        return repondre("❌ Choix invalide. Veuillez relancer la commande.");
    }

    // Étape 3: Demander confirmation
    const confirmationMessage = formatConfirmation(nomAuteurMessage, selectedGame, selectedPack, packPrice, "N/A");
    await zk.sendMessage(dest, { text: confirmationMessage }, { quoted: ms });

    // Écouter la réponse de confirmation
    const confirmResponse = await zk.waitForMessage(dest, auteurMessage, 30000);

    if (!confirmResponse) {
      return repondre("⏱️ Temps écoulé. Veuillez relancer la commande.");
    }

    const confirmation = confirmResponse.text.trim().toLowerCase();

    if (confirmation !== 'oui' && confirmation !== 'o') {
      return repondre("❌ Achat annulé.");
    }

    // Générer les récompenses du pack
    const rewards = generatePackRewards(selectedGame, selectedPack);

    // Générer et envoyer le reçu
    const transactionId = generateTransactionId();
    const receipt = formatReceipt(
      transactionId, 
      nomAuteurMessage, 
      selectedGame, 
      selectedPack, 
      packPrice, 
      rewards, 
      "N/A"
    );

    await zk.sendMessage(dest, { text: receipt }, { quoted: ms });

    repondre("🎉 Pack acheté avec succès ! (Mode simulation)");

  } catch (error) {
    console.error('Erreur commande buypack:', error);
    repondre("❌ Une erreur s'est produite lors de l'achat. Veuillez réessayer.");
  }
});