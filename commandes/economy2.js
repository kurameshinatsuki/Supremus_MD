// buypack.js
const { zokou } = require('../framework/zokou');
const { getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

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

// Données des jeux et contenus
const GAME_DATA = {
  'ABM': {
    name: 'Anime Battle Multivers',
    contents: {
      common: [
        { name: 'Naruto: Mode Sage', description: 'Maîtrise des techniques senjutsu' },
        { name: 'Goku: Base Form', description: 'Forme de combat standard' },
        { name: 'Luffy: Gear Second', description: 'Augmentation de la vitesse' },
        { name: 'Ichigo: Shikai', description: 'Forme initiale de Zanpakutō' },
        { name: 'Saitama: Normal Punch', description: 'Coup normal mais puissant' }
      ],
      rare: [
        { name: 'Naruto: Mode Kurama', description: 'Contrôle partiel du renard à neuf queues' },
        { name: 'Goku: Super Saiyan', description: 'Transformation légendaire' },
        { name: 'Luffy: Gear Fourth', description: 'Forme de combat avancée' },
        { name: 'Ichigo: Bankai', description: 'Forme ultime de Zanpakutō' },
        { name: 'Saitama: Serious Punch', description: 'Coup sérieux extrêmement puissant' }
      ],
      epic: [
        { name: 'Naruto: Mode Baryon', description: 'Fusion d\'énergie avec Kurama' },
        { name: 'Goku: Ultra Instinct', description: 'Technique divine de combat' },
        { name: 'Luffy: Gear Fifth', description: 'Forme mythique de libération' },
        { name: 'Ichigo: Full Hollow', description: 'Forme hollow complète' },
        { name: 'Saitama: Ultimate Technique', description: 'Technique ultime imprévisible' }
      ],
      legendary: [
        { name: 'Naruto: Six Paths Sage Mode', description: 'Mode sage des six chemins' },
        { name: 'Goku: Ultra Instinct Mastered', description: 'Maîtrise complète de l\'instinct ultime' },
        { name: 'Luffy: Sun God Nika', description: 'Forme divine de libération' },
        { name: 'Ichigo: True Bankai', description: 'Forme véritable de Zanpakutō' },
        { name: 'Saitama: Cosmic Fear', description: 'Puissance cosmique illimitée' }
      ]
    }
  },
  'Speed Rush': {
    name: 'Speed Rush',
    contents: {
      common: [
        { name: 'Toyota AE86', description: 'Légendaire coureur des montagnes' },
        { name: 'Nissan Skyline R34', description: 'Icône de la culture JDM' },
        { name: 'Mazda RX-7', description: 'Voiture à moteur rotatif' },
        { name: 'Honda Civic Type R', description: 'Compacte performante' },
        { name: 'Subaru Impreza WRX STI', description: 'Traction intégrale rallye' }
      ],
      rare: [
        { name: 'Nissan GT-R R35', description: 'Supercar japonaise' },
        { name: 'Porsche 911 GT3', description: 'Précision allemande' },
        { name: 'Chevrolet Corvette C8', description: 'Sportive américaine' },
        { name: 'BMW M4 GTS', description: 'Performance track-focused' },
        { name: 'Audi R8 V10', description: 'Supercar quotidienne' }
      ],
      epic: [
        { name: 'Ferrari 488 Pista', description: 'Pur-sang italien' },
        { name: 'Lamborghini Huracan STO', description: 'Supercar extreme' },
        { name: 'McLaren 720S', description: 'Engineering excellence' },
        { name: 'Porsche 918 Spyder', description: 'Hybride hypercar' },
        { name: 'Ford GT', description: 'Héritage racing' }
      ],
      legendary: [
        { name: 'Bugatti Chiron Super Sport', description: 'Ultimate speed machine' },
        { name: 'Koenigsegg Jesko Absolut', description: 'Hypercar suédoise' },
        { name: 'Pagani Huayra BC', description: 'Œuvre d\'art mécanique' },
        { name: 'Aston Martin Valkyrie', description: 'Hypercar F1-inspired' },
        { name: 'McLaren Speedtail', description: 'Hyper-GT ultime' }
      ]
    }
  },
  'Yu-Gi-Oh': {
    name: 'Yu-Gi-Oh Speed Duel',
    contents: {
      common: [
        { name: 'Dark Magician', description: 'Magicien sombre légendaire' },
        { name: 'Blue-Eyes White Dragon', description: 'Dragon blanc aux yeux bleus' },
        { name: 'Red-Eyes Black Dragon', description: 'Dragon noir aux yeux rouges' },
        { name: 'Summoned Skull', description: 'Démon invoqué' },
        { name: 'Celtic Guardian', description: 'Garde celte' }
      ],
      rare: [
        { name: 'Dark Magician Girl', description: 'Apprentie magicienne' },
        { name: 'Blue-Eyes Ultimate Dragon', description: 'Fusion ultime' },
        { name: 'Red-Eyes Darkness Dragon', description: 'Évolution ténébreuse' },
        { name: 'Buster Blader', description: 'Pourfendeur de dragons' },
        { name: 'Gaia The Fierce Knight', description: 'Chevalier féroce' }
      ],
      epic: [
        { name: 'Slifer the Sky Dragon', description: 'Dragon divin égyptien' },
        { name: 'Obelisk the Tormentor', description: 'Dieu égyptien du jugement' },
        { name: 'The Winged Dragon of Ra', description: 'Dieu égyptien suprême' },
        { name: 'Exodia the Forbidden One', description: 'Créature scellée' },
        { name: 'Black Luster Soldier', description: 'Soldat du chaos' }
      ],
      legendary: [
        { name: 'Stardust Dragon', description: 'Dragon des souhaits' },
        { name: 'Number 39: Utopia', description: 'Guerrier de l\'espoir' },
        { name: 'Firewall Dragon', description: 'Dragon cyberse' },
        { name: 'Ash Blossom & Joyous Spring', description: 'Spirit hand trap' },
        { name: 'Accesscode Talker', description: 'Final boss cyberse' }
      ]
    }
  },
  'Origamy World': {
    name: 'Origamy World',
    contents: {
      common: [
        { name: 'Paper Crane', description: 'Grue en papier traditionnelle' },
        { name: 'Paper Samurai', description: 'Guerrier japonais en papier' },
        { name: 'Paper Dragon', description: 'Dragon légendaire en papier' },
        { name: 'Paper Phoenix', description: 'Phénix renaissant en papier' },
        { name: 'Paper Ninja', description: 'Assassin silencieux en papier' }
      ],
      rare: [
        { name: 'Origami Beast', description: 'Créature mythique en papier' },
        { name: 'Paper Elemental', description: 'Être élémentaire en papier' },
        { name: 'Folding Guardian', description: 'Protecteur en papier plié' },
        { name: 'Paper Sorcerer', description: 'Mage manipulant le papier' },
        { name: 'Crane Warrior', description: 'Guerrier-grue en papier' }
      ],
      epic: [
        { name: 'Thousand Paper Cranes', description: 'Armée de grues en papier' },
        { name: 'Origami Dragon Lord', description: 'Seigneur dragon en papier' },
        { name: 'Paper Kingdom', description: 'Royaume entier en papier' },
        { name: 'Folding Titan', description: 'Géant de papier plié' },
        { name: 'Origami Deity', description: 'Divinité du papier plié' }
      ],
      legendary: [
        { name: 'Infinite Fold', description: 'Technique de pliage infinie' },
        { name: 'Paper Universe', description: 'Univers complet en papier' },
        { name: 'Origami Creator', description: 'Créateur de réalités en papier' },
        { name: 'Eternal Crane', description: 'Grue éternelle en papier' },
        { name: 'World Folder', description: 'Maître du pliage mondial' }
      ]
    }
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
    // Récupérer le profil du joueur
    let playerData = await getPlayerProfile(nomAuteurMessage);
    
    if (!playerData) {
      return repondre("❌ Vous n'avez pas de profil joueur. Utilisez d'abord une commande de profil comme !sigma pour en créer un.");
    }

    // Vérifier le solde de coupons
    const coupons = parseInt(playerData.coupons) || 0;
    
    // Étape 1: Afficher le menu des jeux
    const gameMenu = formatGameMenu(nomAuteurMessage, coupons);
    await zk.sendMessage(dest, { text: gameMenu }, { quoted: ms });

    // Écouter la réponse pour le choix du jeu
    const gameResponse = await zk.waitForMessage(dest, auteurMessage, 30000); // 30 secondes timeout
    
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
    const packMenu = formatPackMenu(nomAuteurMessage, selectedGame, coupons);
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

    // Vérifier si le joueur a assez de coupons
    if (coupons < packPrice) {
      return repondre(`❌ Solde insuffisant. Il vous manque ${packPrice - coupons}🎟️ pour acheter ce pack.`);
    }

    // Étape 3: Demander confirmation
    const confirmationMessage = formatConfirmation(nomAuteurMessage, selectedGame, selectedPack, packPrice, coupons);
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
    
    // Mettre à jour le profil du joueur
    const newCoupons = coupons - packPrice;
    const newTokens = (parseInt(playerData.s_tokens) || 0) + rewards.bonus.tokens;
    const newGemmes = (parseInt(playerData.s_gemmes) || 0) + rewards.bonus.gemmes;
    
    const updates = {
      coupons: newCoupons.toString(),
      s_tokens: newTokens.toString(),
      s_gemmes: newGemmes.toString()
    };
    
    // Ajouter les contenus aux collections appropriées
    // (Cette partie dépend de la structure de votre base de données)
    // Pour l'exemple, nous ajoutons simplement les noms des contenus au champ items
    
    const currentItems = playerData.items && playerData.items !== 'aucun' 
      ? playerData.items.split(',') 
      : [];
    
    rewards.contents.forEach(content => {
      currentItems.push(`${content.name} (${content.rarity})`);
    });
    
    updates.items = currentItems.join(', ');
    
    await updatePlayerProfile(nomAuteurMessage, updates);

    // Générer et envoyer le reçu
    const transactionId = generateTransactionId();
    const receipt = formatReceipt(
      transactionId, 
      nomAuteurMessage, 
      selectedGame, 
      selectedPack, 
      packPrice, 
      rewards, 
      newCoupons
    );
    
    await zk.sendMessage(dest, { text: receipt }, { quoted: ms });

  } catch (error) {
    console.error('Erreur commande buypack:', error);
    repondre("❌ Une erreur s'est produite lors de l'achat. Veuillez réessayer.");
  }
});