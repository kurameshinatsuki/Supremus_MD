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
        legendary: []
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

// 🎁 Gains bonus selon la rareté
const bonusRewards = {
    common: ["🎫 Coupons (5 à 10)", "🧭 Supremus Tokens (500 à 1.000)", "💎 Supremus Gemmes (10 à 20)", "⚡ Boost XP (×2)"],
    rare: ["🎫 Coupons (10 à 20)", "🧭 Supremus Tokens (1.000 à 2.500)", "💎 Supremus Gemmes (20 à 50)", "⏳ Boost XP (×3)", "🎟 Ticket de Loterie", "🛒 Réduction Boutique (-10%)"],
    epic: ["🎫 Coupons (20 à 50)", "🧭 Supremus Tokens (2.500 à 5.000)", "💎 Supremus Gemmes (50 à 100)", "⏳ Boost XP (×4)", "🔑 Clé Mystère", "🎟 Ticket de Loterie", "🛒 Réduction Boutique (-25%)", "🎁 Box VIP (×1)"],
    legendary: ["🎫 Coupons (50 à 100)", "🧭 Supremus Tokens (5.000 à 10.000)", "💎 Supremus Gemmes (100 à 250)", "⏳ Boost XP (×5)", "💳 Pass VIP", "🔑 Clé Légendaire"]
};

// 🎟 Base de données des joueurs (simulée)
let players = {
    "player123": { name: "Joueur 1", coupons: 500 },
    "player456": { name: "Joueur 2", coupons: 200 }
};

// 📜 Génération d'un ID de transaction unique
function generateTransactionID() {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// 🎁 Génération aléatoire d’un objet selon les probabilités
function getRandomItem(category, game) {
    const items = gameContents[game][category] || [];
    return items.length ? items[Math.floor(Math.random() * items.length)] : null;
}

// 🎁 Génération aléatoire d’un bonus selon la rareté
function getRandomBonus(category) {
    const items = bonusRewards[category] || [];
    return items.length ? items[Math.floor(Math.random() * items.length)] : null;
}

// 🎟 Achat d’un pack avec contenu + bonus
function acheterPack(playerID, game, packType) {
    let player = players[playerID];
    if (!player) return "⚠ Joueur introuvable.";

    let pack = packs[packType];
    if (!pack) return "⚠ Pack invalide.";

    // 💰 Vérification des coupons
    if (player.coupons < pack.cost) return `⚠ Pas assez de coupons. (${player.coupons}🎫 dispos, ${pack.cost}🎫 requis)`;

    // 🎲 Génération des gains (contenu du jeu + bonus)
    let rewards = [];
    let bonus = [];

    for (let i = 0; i < pack.rewards; i++) {
        let category = Object.keys(pack.rates).find((r) => Math.random() * 100 < pack.rates[r]);
        let item = getRandomItem(category, game);
        let bonusItem = getRandomBonus(category);

        if (item) rewards.push(item);
        if (bonusItem) bonus.push(bonusItem);
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

🎁 Contenu du jeu :
- ${rewards.join("\n- ")}

🎉 Bonus :
- ${bonus.join("\n- ")}

💸 Montant débité : ${pack.cost}🎫
💰 Nouveau solde : ${player.coupons}🎫

🕒 Date & Heure : ${new Date().toLocaleString()}
🔄 Statut : Validé
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
\`\`\``;

    return `✅ *ACHAT RÉUSSI ! 🎁*\n\n*${player.name}* a ouvert un *${pack.name}* et obtenu :\n\n🎮 **Contenu du jeu** :\n- ${rewards.join("\n- ")}\n\n🎁 **Gains Bonus** :\n- ${bonus.join("\n- ")}\n\n${receipt}`;
}

// 📌 Commande /acheter intégrée à Zokou
zokou(
    { nomCom: 'acheter', categorie: 'TRANSACTION' },
    async (dest, zk, commandeOptions) => {
        const { ms, args, sender } = commandeOptions;
        
        if (args.length < 2) {
            return zk.sendMessage(dest, { text: "⚠ Usage : *!acheter [jeu] [pack]*\nEx : *!acheter ABM 🥇*" }, { quoted: ms });
        }

        let [game, packType] = args;
        game = game.toUpperCase();

        if (!gameContents[game]) {
            return zk.sendMessage(dest, { text: "⚠ Jeu invalide. Choisissez parmi : ABM, Speed Rush, Yu-Gi-Oh Speed Duel." }, { quoted: ms });
        }

        if (!packs[packType]) {
            return zk.sendMessage(dest, { text: "⚠ Pack invalide. Choisissez parmi : 🥉, 🥈, 🥇, 🏅." }, { quoted: ms });
        }

        const resultat = acheterPack(sender, game, packType);
        await zk.sendMessage(dest, { text: resultat }, { quoted: ms });
    }
);