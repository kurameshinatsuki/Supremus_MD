const { zokou } = require('../framework/zokou');

// 📦 Packs disponibles et leur coût
const packs = {
    "🥉": { name: "Pack Bronze", cost: 150, rewards: 3, rates: { common: 80, rare: 15, epic: 5 } },
    "🥈": { name: "Pack Argent", cost: 200, rewards: 3, rates: { common: 60, rare: 30, epic: 10 } },
    "🥇": { name: "Pack Or", cost: 250, rewards: 5, rates: { common: 40, rare: 40, epic: 15, legendary: 5 } },
    "🏅": { name: "Pack Spécial", cost: 300, rewards: 6, rates: { common: 20, rare: 40, epic: 30, legendary: 10 } }
};

// 📜 Contenu des jeux
const gameContents = {
    "ABM": {
        common: ["Asta", "Magna", "Gauche", "Zora", "Leopold"],
        rare: ["Noelle", "Yuno", "Vanessa", "Langris", "Luck"],
        epic: ["Natsu", "Erza"],
        legendary: [] // Pas de légendaire dans ABM
    },
    "Speed Rush": {
        common: ["Lamborghini Aventador", "Ferrari SF90 Stradale", "Porsche 911 Turbo S"],
        rare: ["Bugatti Chiron", "McLaren P1"],
        epic: ["Custom 🥉 (Vitesse/Maniabilité/Résistance)"],
        legendary: ["Custom 🥈 (Vitesse/Maniabilité/Résistance)"]
    },
    "Yu-Gi-Oh Speed Duel": {
        common: ["Monster Normal", "Magie Générique", "Trap Normal"],
        rare: ["Carte stratégique", "Monstre utile"],
        epic: ["Dark Magician", "Blue-Eyes White Dragon"],
        legendary: ["Red-Eyes Black Dragon", "Polymerization", "Mirror Force"]
    }
};

// 🎟 Simuler une base de données locale des joueurs
let players = {
    "player123": { name: "Joueur 1", coupons: 500 },
    "player456": { name: "Joueur 2", coupons: 200 }
};

// 📜 Génération d'un ID de transaction unique
function generateTransactionID() {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// 🎁 Génération aléatoire d’un objet selon les probabilités
function getRandomItem(game) {
    const items = gameContents[game];
    const rand = Math.random() * 100;

    if (rand < (packs["🏅"].rates.legendary || 0) && items.legendary.length) return items.legendary[Math.floor(Math.random() * items.legendary.length)];
    if (rand < (packs["🏅"].rates.epic || 0) && items.epic.length) return items.epic[Math.floor(Math.random() * items.epic.length)];
    if (rand < (packs["🏅"].rates.rare || 0) && items.rare.length) return items.rare[Math.floor(Math.random() * items.rare.length)];
    return items.common[Math.floor(Math.random() * items.common.length)];
}

// 🎟 Achat d’un pack
function acheterPack(playerID, game, packType) {
    let player = players[playerID]; // Récupérer les infos du joueur
    if (!player) return "⚠ Joueur introuvable.";

    let pack = packs[packType];
    if (!pack) return "⚠ Pack invalide.";

    // 💰 Vérification des coupons
    if (player.coupons < pack.cost) return `⚠ Vous n'avez pas assez de coupons. (${player.coupons}🎫 disponibles, ${pack.cost}🎫 requis)`;

    // 🎲 Génération des gains
    let rewards = [];
    for (let i = 0; i < pack.rewards; i++) {
        rewards.push(getRandomItem(game));
    }

    // 💳 Déduction des coupons
    player.coupons -= pack.cost;

    // 📜 Génération du reçu
    let transactionID = generateTransactionID();
    let receipt = `\`\`\`
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*..........|  SRPN - REÇU  |..........*
═══════════════════
🆔 Transact ID : ${transactionID}

📌 Type : 💰 Achat
👤 Expéditeur : ${player.name}
🎯 Transaction : Achat de ${pack.name}

💰 Détails :
📦 Gain(s) reçu(s) :
- ${rewards.join("\n- ")}

💸 Montant débité : ${pack.cost}🎫
💰 Nouveau solde : ${player.coupons}🎫

🕒 Date & Heure : ${new Date().toLocaleString()}
🔄 Statut : Validé
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
\`\`\``;

    return `✅ *ACHAT RÉUSSI ! 🎁*\n\n*${player.name}* a ouvert un *${pack.name}* et obtenu :\n- ${rewards.join("\n- ")}\n\n${receipt}`;
}

// Commande /acheter
zokou(
  {
    nomCom: 'acheter',
    reaction: '🛒',
    categorie: 'TRANSACT'
  },
  async (message, args) => {
    let playerID = message.sender;
    
    if (args.length < 2) {
        return message.reply("⚠ Utilisation incorrecte. Format : `/acheter [jeu] [pack]`\nExemple : `/acheter ABM 🥇`");
    }

    let game = args[0];   // Nom du jeu
    let packType = args[1]; // Type de pack (🥉, 🥈, 🥇, 🏅)

    if (!gameContents[game]) {
        return message.reply("⚠ Jeu invalide. Choisissez parmi : ABM, Speed Rush, Yu-Gi-Oh Speed Duel.");
    }

    if (!packs[packType]) {
        return message.reply("⚠ Pack invalide. Choisissez parmi : 🥉, 🥈, 🥇, 🏅.");
    }

    let result = acheterPack(playerID, game, packType);
    return message.reply(result);
});