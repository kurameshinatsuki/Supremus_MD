const { zokou } = require('../framework/zokou');

const packs = {
    "🥉": { coût: 150, gains: 3, chances: [80, 15, 5, 0] },
    "🥈": { coût: 200, gains: 4, chances: [60, 30, 10, 0] },
    "🥇": { coût: 250, gains: 5, chances: [40, 40, 15, 5] },
    "🏅": { coût: 300, gains: 6, chances: [20, 40, 30, 10] }
};

const contenuJeu = {
    "ABM": {
        commun: ["Asta", "Magna", "Lucy", "Sarada"],
        rare: ["Yuno", "Luck", "Deku"],
        epique: ["Natsu", "Erza"],
        legendaire: []
    },
    "SpeedRush": {
        commun: ["Lamborghini Aventador", "Ferrari SF90"],
        rare: ["Bugatti Chiron"],
        epique: ["Custom 🥉"],
        legendaire: ["Custom 🥈"]
    },
    "YGO": {
        commun: ["Mystical Elf", "Feral Imp"],
        rare: ["Dark Magician Girl"],
        epique: ["Blue-Eyes White Dragon"],
        legendaire: ["Mirror Force"]
    }
};

const gainsBonus = {
    commun: ["🎫 Coupons (5-10)", "🪙 Supremus Tokens (500-1000)"],
    rare: ["🎫 Coupons (10-20)", "🪙 Supremus Tokens (1000-2500)"],
    epique: ["🎫 Coupons (20-50)", "🪙 Supremus Tokens (2500-5000)"],
    legendaire: ["🎫 Coupons (50-100)", "🪙 Supremus Tokens (5000-10000)"]
};

// Fonction de sélection aléatoire selon les probabilités
function getRandomItem(liste, probabilites) {
    let rand = Math.random() * 100;
    if (rand < probabilites[0]) return liste.commun[Math.floor(Math.random() * liste.commun.length)];
    if (rand < probabilites[0] + probabilites[1]) return liste.rare[Math.floor(Math.random() * liste.rare.length)];
    if (rand < probabilites[0] + probabilites[1] + probabilites[2]) return liste.epique[Math.floor(Math.random() * liste.epique.length)];
    return liste.legendaire[Math.floor(Math.random() * liste.legendaire.length)];
}

// Commande d'achat
zokou(
    { nomCom: 'acheter', categorie: 'ÉCONOMIE' },
    async (dest, zk, { ms, args }) => {
        if (args.length < 2) {
            return zk.sendMessage(dest, { text: "❌ Usage : /acheter [jeu] [pack]\nExemple : /acheter ABM 🥉" }, { quoted: ms });
        }

        const jeu = args[0].toUpperCase();
        if (!contenuJeu[jeu]) {
            return zk.sendMessage(dest, { text: "❌ Jeu inconnu. Choisissez parmi : ABM, SpeedRush, YGO." }, { quoted: ms });
        }

        const packType = args[1];
        if (!packs[packType]) {
            return zk.sendMessage(dest, { text: "❌ Pack inconnu. Choisissez 🥉, 🥈, 🥇 ou 🏅." }, { quoted: ms });
        }

        const coût = packs[packType].coût;
        const gainsMax = packs[packType].gains;
        const chances = packs[packType].chances;

        // Simulation du solde du joueur (remplace ça par ton vrai système)
        let couponsJoueur = 500;

        if (couponsJoueur < coût) {
            return zk.sendMessage(dest, { text: "❌ Vous n'avez pas assez de coupons." }, { quoted: ms });
        }

        // Déduction du coût
        couponsJoueur -= coût;

        // Génération du pack
        let gains = [];
        let contenu = getRandomItem(contenuJeu[jeu], chances);
        gains.push(`🎴 ${contenu}`);

        while (gains.length < gainsMax) {
            let bonus = getRandomItem(gainsBonus, chances);
            if (!gains.includes(bonus)) gains.push(bonus);
        }

        // Message de récompenses
        let messageGains = `✅ **ACHAT RÉUSSI ! 🎁**\n\nVous avez ouvert un **Pack ${packType}** et obtenu :\n`;
        gains.forEach(g => messageGains += `\n- ${g}`);

        await zk.sendMessage(dest, { text: messageGains }, { quoted: ms });

        // Génération du reçu
        let transactionId = Math.floor(Math.random() * 100000);
        let date = new Date().toLocaleDateString();
        let heure = new Date().toLocaleTimeString();

        let reçu = `📜 **REÇU DE TRANSACTION**\n\n🆔 **ID** : ${transactionId}\n📌 **Type** : Achat\n👤 **Joueur** : ${dest.split("@")[0]}\n🎯 **Pack** : ${packType}\n\n📦 **Gains** :\n`;
        gains.forEach(g => reçu += `- ${g}\n`);

        reçu += `\n💸 **Débité** : ${coût}🎫\n💰 **Solde restant** : ${couponsJoueur}🎫\n🕒 **Date & Heure** : ${date} / ${heure}\n✅ **Statut** : Validé`;

        await zk.sendMessage(dest, { text: reçu }, { quoted: ms });
    }
);