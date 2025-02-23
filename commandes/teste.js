const { zokou } = require('../framework/zokou');

// Fonction pour générer un nombre aléatoire dans un intervalle donné
const getRandomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fonction pour obtenir un gain selon les probabilités
const getPackContents = (packType) => {
    const contents = {
        // Définition des packs avec leurs chances de rareté et les types de contenu associés
        "🥉": { count: 3, commons: 80, rares: 15, epics: 5, legendaries: 0 },
        "🥈": { count: 4, commons: 60, rares: 30, epics: 10, legendaries: 0 },
        "🥇": { count: 5, commons: 40, rares: 40, epics: 15, legendaries: 5 },
        "🏅": { count: 6, commons: 20, rares: 40, epics: 30, legendaries: 10 },
    };

    const { count, commons, rares, epics, legendaries } = contents[packType];
    let pack = [];

    // Ajout des éléments au pack en fonction des probabilités
    for (let i = 0; i < count; i++) {
        const roll = Math.random() * 100;
        if (roll < commons) {
            pack.push('Commun');
        } else if (roll < commons + rares) {
            pack.push('Rare');
        } else if (roll < commons + rares + epics) {
            pack.push('Epique');
        } else {
            pack.push('Légendaire');
        }
    }

    return pack;
};

// Commande principale pour l'achat de packs
zokou(
    {
        nomCom: 'achat',
        categorie: 'TRANSACT',
    },
    async (message, args) => {
        const player = message.author; // Récupérer l'utilisateur qui a lancé la commande
        const packType = args[0]; // Le type de pack choisi

        // Vérifier si le type de pack est valide
        const validPacks = ['🥉', '🥈', '🥇', '🏅'];
        if (!validPacks.includes(packType)) {
            return message.reply('Veuillez choisir un pack valide : 🥉, 🥈, 🥇, 🏅');
        }

        // Vérifier le nombre de coupons du joueur
        const playerCoupons = await getPlayerCoupons(player); // Fonction fictive pour obtenir le nombre de coupons du joueur
        const packCosts = {
            "🥉": 150,
            "🥈": 200,
            "🥇": 250,
            "🏅": 300,
        };

        if (playerCoupons < packCosts[packType]) {
            return message.reply('Vous n\'avez pas assez de coupons pour acheter ce pack.');
        }

        // Déduire les coupons du joueur
        await updatePlayerCoupons(player, -packCosts[packType]); // Fonction fictive pour déduire les coupons

        // Générer les gains du pack
        const packContents = getPackContents(packType);

        // Envoyer un récapitulatif des gains
        const gainMessage = `✅ ACHAT RÉUSSI ! 🎁\nVous avez ouvert un Pack ${packType} et obtenu :\n` + packContents.join('\n');

        // Générer un reçu de transaction
        const transactionReceipt = generateReceipt(player, packType, packCosts[packType], packContents);

        // Envoyer le message récapitulatif et le reçu
        message.reply(gainMessage);
        message.reply(transactionReceipt);
    }
);

// Fonction fictive pour récupérer les coupons du joueur
async function getPlayerCoupons(player) {
    // Récupérer les coupons du joueur depuis la base de données ou un système de stockage
    return 200; // Exemple
}

// Fonction fictive pour mettre à jour les coupons du joueur
async function updatePlayerCoupons(player, amount) {
    // Mettre à jour les coupons du joueur dans la base de données ou un système de stockage
}

// Fonction pour générer un reçu de transaction
function generateReceipt(player, packType, cost, contents) {
    const transactionId = generateTransactionId(); // Fonction fictive pour générer un ID unique
    const currentDate = new Date();

    return `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
..........|  SRPN - REÇU  |..........
═══════════════════
🆔 Transact ID : ${transactionId}

> 📌 Type : 💰 Achat
👤 Expéditeur : ${player.username}
🎯 Transaction : Achat du Pack ${packType}
═══════════════════
💰 Détails de la transaction :
📦 Gain(s) reçu(s) : 
${contents.join('\n')}

> 💸 Montant débité : ${cost}🎫
💰 Nouveau solde : ${await getPlayerCoupons(player) - cost}🎫
═══════════════════
🕒 Date & Heure : ${currentDate.toLocaleDateString()} / ${currentDate.toLocaleTimeString()}
🔄 Statut : Validé
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*............| ♼ Traitement... |..........*
`;
}

// Fonction fictive pour générer un ID unique pour la transaction
function generateTransactionId() {
    return Math.random().toString(36).substr(2, 9);
}