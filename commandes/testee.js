const { zokou } = require('../framework/zokou');
const { getPlayerData, updatePlayerData } = require('../bdd/player_bdd'); // Fonctions fictives pour récupérer et mettre à jour les données du joueur

// Configuration des packs
const packs = {
    bronze: { nom: "🥉 Pack Bronze", prix: 150, gains: 3, rarete: [80, 15, 5, 0] },
    argent: { nom: "🥈 Pack Argent", prix: 200, gains: 4, rarete: [60, 30, 10, 0] },
    or: { nom: "🥇 Pack Or", prix: 250, gains: 5, rarete: [40, 40, 15, 5] },
    special: { nom: "🏅 Pack Spécial", prix: 300, gains: 6, rarete: [20, 40, 30, 10] }
};

// Objets possibles par rareté
const objets = {
    commun: ["🎫 Coupons (5-10)", "🧭 Supremus Tokens (500-1000)", "💎 Gemmes (10-20)", "⚡ Boost XP (×2)"],
    rare: ["🎫 Coupons (10-20)", "🧭 Supremus Tokens (1000-2500)", "💎 Gemmes (20-50)", "⏳ Boost XP (×3)", "🎟 Ticket de Loterie", "🛒 Réduction Boutique (-10%)"],
    epique: ["🎫 Coupons (20-50)", "🧭 Supremus Tokens (2500-5000)", "💎 Gemmes (50-100)", "⏳ Boost XP (×4)", "🔑 Clé Mystère", "🎁 Box VIP (×1)"],
    legendaire: ["🎫 Coupons (50-100)", "🧭 Supremus Tokens (5000-10000)", "💎 Gemmes (100-250)", "⏳ Boost XP (×5)", "💳 Pass VIP", "🔑 Clé Légendaire"]
};

// Fonction pour choisir un gain aléatoire en fonction de la rareté
const choisirGain = (rarete) => {
    const total = rarete.reduce((acc, val) => acc + val, 0);
    const tirage = Math.floor(Math.random() * total);
    let cumul = 0;
    for (let i = 0; i < rarete.length; i++) {
        cumul += rarete[i];
        if (tirage < cumul) return Object.keys(objets)[i];
    }
};

// Fonction pour générer un reçu de transaction
const genererRecu = (joueur, pack, gains, cout) => {
    const date = new Date().toLocaleString();
    const recu = `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*..........|  SRPN - REÇU  |..........*
═══════════════════
🆔 *Transact ID :* ${Date.now()}
📌 *Type :* 💰 Achat
👤 *Expéditeur :* ${joueur.nom}
🎯 *Transaction :* Achat de ${pack.nom}
═══════════════════
💰 *Détails de la transaction :*
📦 *Gain(s) reçu(s) :* 
${gains.map(g => `- ${g}`).join('\n')}
💸 *Montant débité :* ${cout} 🎫
💰 *Nouveau solde :* ${joueur.solde} 🎫
═══════════════════
🕒 *Date & Heure :* ${date}
🔄 *Statut :* Validé
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`;
    return recu;
};

// Commande /acheter
zokou(
    {
        nomCom: 'acheter',
        reaction: '💸',
        categorie: 'TRANSACT'
    },
    async (origineMessage, zk, commandeOptions) => {
        const { repondre, auteurMessage } = commandeOptions;

        try {
            // Récupération des données du joueur
            const joueur = await getPlayerData(auteurMessage);

            if (!joueur) {
                return repondre("Impossible de récupérer vos données de joueur.");
            }

            // Demander le type de pack
            await repondre("Choisissez un type de pack : Bronze, Argent, Or, Spécial.");
            const choixPack = (await zk.awaitForMessage({ sender: auteurMessage })).message.conversation.toLowerCase();

            if (!packs[choixPack]) {
                return repondre("Type de pack invalide.");
            }

            const pack = packs[choixPack];

            // Vérifier le solde
            if (joueur.solde < pack.prix) {
                return repondre(`Solde insuffisant. Il vous faut ${pack.prix} 🎫 pour ce pack.`);
            }

            // Générer les gains
            const gains = [];
            for (let i = 0; i < pack.gains; i++) {
                const rarete = choisirGain(pack.rarete);
                const gain = objets[rarete][Math.floor(Math.random() * objets[rarete].length)];
                gains.push(gain);
            }

            // Déduire le coût et mettre à jour les données du joueur
            joueur.solde -= pack.prix;
            await updatePlayerData(auteurMessage, { solde: joueur.solde });

            // Générer le reçu
            const recu = genererRecu(joueur, pack, gains, pack.prix);
            await repondre(recu);
        } catch (error) {
            console.error("Erreur lors de l'achat :", error);
            await repondre("Une erreur est survenue lors de la transaction.");
        }
    }
);