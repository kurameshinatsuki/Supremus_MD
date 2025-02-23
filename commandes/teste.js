const { zokou } = require('../framework/zokou');

// Fonction utilitaire pour générer un nombre aléatoire dans un intervalle
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction pour créer le contenu d'un pack basé sur le type
function createPack(packType) {
    const packs = {
        "🥉": { size: 3, commons: 80, rares: 15, epics: 5, legendaries: 0 },
        "🥈": { size: 4, commons: 60, rares: 30, epics: 10, legendaries: 0 },
        "🥇": { size: 5, commons: 40, rares: 40, epics: 15, legendaries: 5 },
        "🏅": { size: 6, commons: 20, rares: 40, epics: 30, legendaries: 10 },
    };

    const { size, commons, rares, epics, legendaries } = packs[packType];
    const results = [];

    for (let i = 0; i < size; i++) {
        const chance = Math.random() * 100;
        if (chance < commons) {
            results.push('Commun');
        } else if (chance < commons + rares) {
            results.push('Rare');
        } else if (chance < commons + rares + epics) {
            results.push('Epique');
        } else {
            results.push('Légendaire');
        }
    }

    return results;
}

// Commande d'achat de pack
zokou(
    {
        nomCom: 'acheter',
        categorie: 'TRANSACT',
    },
    async (message, args) => {
        try {
            const player = message.author;
            const selectedPack = args[0];

            // Vérification de la validité du type de pack
            const validTypes = ['🥉', '🥈', '🥇', '🏅'];
            if (!validTypes.includes(selectedPack)) {
                return message.reply('Veuillez choisir un pack valide : 🥉, 🥈, 🥇, 🏅');
            }

            // Vérification des coupons du joueur
            const playerCoupons = await getCoupons(player);
            const packPrices = { "🥉": 150, "🥈": 200, "🥇": 250, "🏅": 300 };
            
            if (playerCoupons < packPrices[selectedPack]) {
                return message.reply('Vous n\'avez pas assez de coupons pour acheter ce pack.');
            }

            // Déduction des coupons et génération des gains
            await deductCoupons(player, packPrices[selectedPack]);
            const packContents = createPack(selectedPack);

            // Message récapitulatif des gains
            const gainsMessage = `🎁 Achat réussi !\nPack ${selectedPack} :\n` + packContents.join('\n');

            // Générer un reçu de la transaction
            const receipt = createReceipt(player, selectedPack, packPrices[selectedPack], packContents);

            // Envoi des messages de confirmation
            message.reply(gainsMessage);
            message.reply(receipt);
        } catch (error) {
            console.error('Erreur achat:', error);
            message.reply('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    }
);

// Simulation d'obtention des coupons du joueur
async function getCoupons(player) {
    // Exemple simulé pour récupérer les coupons du joueur
    return 200;
}

// Simulation de déduction de coupons du joueur
async function deductCoupons(player, amount) {
    // Déduire le montant des coupons dans la base de données ou autre système
}

// Fonction pour générer le reçu de transaction
async function createReceipt(player, packType, cost, contents) {
    const transactionId = generateTransactionId();
    const now = new Date();
    const newBalance = await getCoupons(player) - cost; // Calcul avant l'affichage

    return `
════════════════════════
          REÇU SRPN
════════════════════════
🆔 Transaction ID : ${transactionId}
🎯 Type : Achat de Pack ${packType}
👤 Utilisateur : ${player.username}
════════════════════════
Gains :
${contents.join('\n')}

Montant débité : ${cost}🎫
Nouveau solde : ${newBalance}🎫
════════════════════════
Date : ${now.toLocaleDateString()} / ${now.toLocaleTimeString()}
Statut : Validé
════════════════════════
*Traitement terminé.*
`;
}