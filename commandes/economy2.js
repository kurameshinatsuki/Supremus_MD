// ========== economy.js ==========
const { zokou } = require('../framework/zokou');
const { GAME_DATA } = require('../commandes/game_data');
const { 
  getMarketItem, 
  removeMarketItem, 
  getMarketItems, 
  addMarketItem 
} = require('../bdd/market_bdd');
const { 
  createNewBet, 
  getOpenBets, 
  getBet, 
  placeBet, 
  closeBet 
} = require('../bdd/bets_bdd');
const { insertTransaction } = require('../bdd/transactions_bdd');

const achatsEnCours = new Map(); 
const transactionsEnCours = new Map(); 
const parisEnCours = new Map();      
const misesEnCours = new Map();     
const ventesEnCours = new Map();    

// Constantes de configuration
const TAXE_VENTE = 0.25; // 25% de taxe
const TIMEOUT_TRANSACTION = 60000; // 60 secondes
const DELAI_EXPIRATION = 300000; // 5 minutes

// Prix des packs
const PACK_PRICES = {
    bronze: 150,
    argent: 200,
    or: 250,
    special: 300
};

// Probabilités pour chaque grade de pack
const PACK_PROBABILITIES = {
    bronze: { common: 70, rare: 15, epic: 10, legendary: 5 },
    argent: { common: 45, rare: 30, epic: 15, legendary: 10 },
    or: { common: 10, rare: 45, epic: 35, legendary: 10 },
    special: { common: 5, rare: 30, epic: 30, legendary: 35 }
};

// Bonus pour chaque grade de pack
const PACK_BONUS = {
    bronze: { coupons: { min: 20, max: 40 }, gemmes: { min: 15, max: 30 } },
    argent: { coupons: { min: 30, max: 50 }, gemmes: { min: 25, max: 40 } },
    or: { coupons: { min: 40, max: 60 }, gemmes: { min: 35, max: 50 } },
    special: { coupons: { min: 50, max: 70 }, gemmes: { min: 45, max: 60 } }
};

// Fonction pour choisir un élément basé sur les probabilités
function chooseRarity(probabilities) {
    const rand = Math.random() * 100;
    if (rand < probabilities.common) return 'common';
    if (rand < probabilities.common + probabilities.rare) return 'rare';
    if (rand < probabilities.common + probabilities.rare + probabilities.epic) return 'epic';
    return 'legendary';
}

// Fonction pour générer un nombre aléatoire dans une plage
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction pour générer le contenu d'un pack
function generatePackContents(gameKey, grade) {
    const game = GAME_DATA[gameKey];
    if (!game) {
        throw new Error(`Jeu non trouvé: ${gameKey}`);
    }
    
    const probabilities = PACK_PROBABILITIES[grade];
    const bonus = PACK_BONUS[grade];
    
    // Déterminer le nombre de contenus selon le grade
    const contentCount = {
        bronze: 3,
        argent: 4,
        or: 5,
        special: 6
    }[grade];
    
    const contents = [];
    
    // Générer les contenus principaux
    for (let i = 0; i < contentCount; i++) {
        const rarity = chooseRarity(probabilities);
        const rarityContents = game.contents[rarity];
        if (!rarityContents || rarityContents.length === 0) {
            continue; // Skip si pas de contenu pour cette rareté
        }
        const randomContent = rarityContents[Math.floor(Math.random() * rarityContents.length)];
        
        contents.push({
            name: randomContent.name,
            rarity: rarity,
            description: randomContent.description,
            type: 'content'
        });
    }
    
    // Bonus pour les packs or et special (chance d'avoir un contenu commun bonus)
    if ((grade === 'or' || grade === 'special') && Math.random() < 0.3) {
        const commonContents = game.contents.common;
        if (commonContents && commonContents.length > 0) {
            const bonusContent = commonContents[Math.floor(Math.random() * commonContents.length)];
            contents.push({
                name: bonusContent.name,
                rarity: 'common',
                description: bonusContent.description,
                type: 'bonus_content'
            });
        }
    }
    
    // Générer les bonus (coupons et gemmes)
    const couponsBonus = randomInRange(bonus.coupons.min, bonus.coupons.max);
    const gemmesBonus = randomInRange(bonus.gemmes.min, bonus.gemmes.max);
    
    return {
        contents: contents,
        bonuses: {
            coupons: couponsBonus,
            gemmes: gemmesBonus
        }
    };
}

// Fonction pour formater le reçu
function formatReceipt(transactionId, playerName, gameName, packType, packContents, price) {
    const gainsText = packContents.contents.map(content => 
        `> - ${content.name} | ${content.rarity}`
    ).join('\n') + `\n> - ${packContents.bonuses.coupons} Coupons\n> - ${packContents.bonuses.gemmes} Supremus Gemmes`;
    
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - REÇU]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🆔 Transact ID :* ${transactionId}

> *📌 Type :* 💰 Achat  
> *👤 Expéditeur :* ${playerName}
> *🎯 Transaction :* Achat d'un pack ${gameName} de type ${packType}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*💰 Détails de la transaction :*
> *📦 Gain(s) reçu(s) :*
${gainsText}
> *💸 Montant débité :* -${price} coupons
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
📅 *Date :* ${date}
🕛 *Heure :* ${time}
🔄 *Statut :* valider
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[TRAITEMENT...]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Fonction utilitaire pour nettoyer les transactions expirées
function nettoyerTransactionsExpirees(map) {
    const maintenant = Date.now();
    for (const [userId, transaction] of map.entries()) {
        if (maintenant - transaction.timestamp > DELAI_EXPIRATION) {
            map.delete(userId);
        }
    }
}

zokou({
    nomCom: "buypack",
    reaction: "🎁",
    categorie: "TRANSACT",
}, async (dest, zk, commandOptions) => {
    const { repondre, ms, arg, auteurMessage } = commandOptions;

    try {
        // Vérifier si l'utilisateur a déjà une transaction en cours
        if (transactionsEnCours.has(auteurMessage)) {
            return repondre("❌ Vous avez déjà une transaction en cours. Veuillez la terminer avant d'en commencer une nouvelle.");
        }

        // Marquer la transaction comme en cours
        transactionsEnCours.set(auteurMessage, {
            etape: "debut",
            timestamp: Date.now()
        });

        // Étape 1: Afficher les jeux disponibles
        const games = Object.keys(GAME_DATA);
        
        if (games.length === 0) {
            transactionsEnCours.delete(auteurMessage);
            return repondre("❌ Aucun jeu n'est disponible pour le moment.");
        }
        
        let texte = `*🎮 PACKS DISPONIBLES - CHOISISSEZ UN JEU *\n\n`;
        
        games.forEach((gameKey, index) => {
            texte += `${index + 1} :  ${GAME_DATA[gameKey].name}\n`;
        });
        
        texte += `\n*Répondez avec le numéro du jeu*`;

        // Envoyer l'image avec la liste des jeux
        const imageUrl = "https://i.ibb.co/ycJLcFn6/Image-2025-03-17-00-21-51-2.jpg";
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: texte,
        }, { quoted: ms });

        // Mettre à jour l'étape
        transactionsEnCours.set(auteurMessage, {
            etape: "choix_jeu",
            timestamp: Date.now()
        });

        // Attendre la sélection du jeu
        let gameResponse;
        try {
            gameResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = m.message?.extendedTextMessage?.text?.trim() || 
                               m.message?.conversation?.trim();
                    const num = parseInt(text);
                    return !isNaN(num) && num >= 1 && num <= games.length;
                }
            });
        } catch (error) {
            transactionsEnCours.delete(auteurMessage);
            return repondre("⏰ Achat annulé - temps écoulé");
        }

        if (!gameResponse) {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Aucune réponse valide, achat annulé.');
        }

        const gameIndex = parseInt(gameResponse.message?.extendedTextMessage?.text?.trim() || 
                                  gameResponse.message?.conversation?.trim()) - 1;
        const selectedGameKey = games[gameIndex];
        const selectedGameName = GAME_DATA[selectedGameKey]?.name;

        if (!selectedGameName) {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Jeu non trouvé, achat annulé.');
        }

        // Mettre à jour avec le jeu choisi
        transactionsEnCours.set(auteurMessage, {
            etape: "choix_grade",
            gameKey: selectedGameKey,
            gameName: selectedGameName,
            timestamp: Date.now()
        });

        // Étape 2: Demander le grade du pack
        const grades = ['bronze', 'argent', 'or', 'special'];
        const gradeEmojis = { bronze: '🥉', argent: '🥈', or: '🥇', special: '🏅' };
        
        let gradeText = `✅ Jeu choisi: ${selectedGameName}\n\n*🎁 CHOISISSEZ UN TYPE DE PACK:*\n\n`;
        grades.forEach(grade => {
            gradeText += `${gradeEmojis[grade]} *${grade.toUpperCase()}* - ${PACK_PRICES[grade]}🎟️\n`;
        });
        gradeText += `\n*Répondez avec le nom du pack (bronze, argent, or ou special)*`;

        await repondre(gradeText);

        // Attendre la sélection du grade
        let gradeResponse;
        try {
            gradeResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = (m.message?.extendedTextMessage?.text?.trim() || 
                                m.message?.conversation?.trim()).toLowerCase();
                    return grades.includes(text);
                }
            });
        } catch (error) {
            transactionsEnCours.delete(auteurMessage);
            return repondre("⏰ Achat annulé - temps écoulé");
        }

        if (!gradeResponse) {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Aucune réponse valide, achat annulé.');
        }

        const selectedGrade = gradeResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                             gradeResponse.message?.conversation?.trim().toLowerCase();
        const price = PACK_PRICES[selectedGrade];

        if (!price) {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Type de pack invalide, achat annulé.');
        }

        // Mettre à jour avec le grade choisi
        transactionsEnCours.set(auteurMessage, {
            etape: "confirmation",
            gameKey: selectedGameKey,
            gameName: selectedGameName,
            grade: selectedGrade,
            price: price,
            timestamp: Date.now()
        });

        // Étape 3: Confirmation finale
        await repondre(`📋 RÉCAPITULATIF:\n\n🎮 Jeu: ${selectedGameName}\n🎁 Pack: ${selectedGrade.toUpperCase()}\n💰 Prix: ${price}🎟️\n\n*Confirmez-vous l'achat ? (oui/non)*`);

        // Attendre la confirmation
        let confirmResponse;
        try {
            confirmResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = (m.message?.extendedTextMessage?.text?.trim() || 
                                m.message?.conversation?.trim()).toLowerCase();
                    return ["oui", "o", "non", "n"].includes(text);
                }
            });
        } catch (error) {
            transactionsEnCours.delete(auteurMessage);
            return repondre("⏰ Achat annulé - temps écoulé");
        }

        if (!confirmResponse) {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Aucune réponse, achat annulé.');
        }

        const confirmation = confirmResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                            confirmResponse.message?.conversation?.trim().toLowerCase();

        if (confirmation !== 'oui' && confirmation !== 'o') {
            transactionsEnCours.delete(auteurMessage);
            return repondre('❌ Achat annulé.');
        }

        // Étape 4: Générer le pack et enregistrer la transaction
        const packContents = generatePackContents(selectedGameKey, selectedGrade);
        
        // Enregistrer la transaction dans la base de données
        const transactionRecord = await insertTransaction({
            player_name: auteurMessage.split('@')[0],
            type: 'Achat Pack',
            details: `Achat d'un pack ${selectedGameName} de type ${selectedGrade}`,
            gains: packContents.contents.map(c => `${c.name} | ${c.rarity}`).join('; ') + 
                  `; ${packContents.bonuses.coupons} Coupons; ${packContents.bonuses.gemmes} Supremus Gemmes`,
            montant: -price,
            date: new Date().toLocaleDateString('fr-FR'),
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            statut: 'valider'
        });

        // Nettoyer la transaction en cours
        transactionsEnCours.delete(auteurMessage);

        // Formater et envoyer le reçu
        const receipt = formatReceipt(
            transactionRecord.id,
            auteurMessage.split('@')[0],
            selectedGameName,
            selectedGrade,
            packContents,
            price
        );

        // Envoyer le reçu avec image
        const responseImageUrl = "https://i.ibb.co/sJ9ypSfn/Image-2025-03-17-00-21-51-3.jpg";
        await zk.sendMessage(dest, {
            image: { url: responseImageUrl },
            caption: receipt,
        });

    } catch (error) {
        // Nettoyer en cas d'erreur
        transactionsEnCours.delete(auteurMessage);
        console.error('Erreur lors de l\'achat:', error);
        return repondre(`❌ Erreur: ${error.message}`);
    }
});

// =============== COMMANDE SELL ===============
zokou({
    nomCom: "sell",
    reaction: "💰",
    categorie: "Market",
}, async (dest, zk, commandOptions) => {
    const { repondre, arg, auteurMessage, ms } = commandOptions;

    try {
        // Vérifier si l'utilisateur a déjà une vente en cours
        if (ventesEnCours.has(auteurMessage)) {
            return repondre("❌ Vous avez déjà une vente en cours. Veuillez la terminer avant d'en commencer une nouvelle.");
        }

        // Vérifier les arguments
        if (arg.length < 3) {
            return repondre("❌ Utilisation incorrecte. Syntaxe:\n*sell [nom_article] [rareté] [prix] [jeu]*\n\nExemple:\n*sell Naruto epic 500 ABM*");
        }

        const nomArticle = arg[0].trim();
        const rarete = arg[1].toLowerCase().trim();
        const prix = parseInt(arg[2]);
        const jeu = arg.slice(3).join(' ').trim() || "Divers";

        // Validation de la rareté
        const raretesValides = ['common', 'rare', 'epic', 'legendary'];
        if (!raretesValides.includes(rarete)) {
            return repondre("❌ Rareté invalide. Choisissez parmi: common, rare, epic, legendary");
        }

        // Validation du prix
        if (isNaN(prix) || prix <= 0) {
            return repondre("❌ Le prix doit être un nombre positif.");
        }

        if (prix > 100000) {
            return repondre("❌ Le prix maximum autorisé est de 100 000 coupons.");
        }

        // Calcul de la taxe (25%)
        const taxe = Math.floor(prix * TAXE_VENTE);
        const prixNet = prix - taxe;

        // Demander la description
        ventesEnCours.set(auteurMessage, {
            etape: "attente_description",
            nomArticle: nomArticle,
            rarete: rarete,
            prix: prix,
            jeu: jeu,
            taxe: taxe,
            prixNet: prixNet,
            timestamp: Date.now()
        });

        const messageDescription = `📋 *DÉTAILS DE LA VENTE:*\n\n` +
            `📦 *Article:* ${nomArticle}\n` +
            `🎯 *Rareté:* ${rarete}\n` +
            `💰 *Prix de vente:* ${prix}🎟️\n` +
            `🏪 *Jeu:* ${jeu}\n` +
            `📊 *Taxe (25%):* ${taxe}🎟️\n` +
            `💵 *Prix net:* ${prixNet}🎟️\n\n` +
            `*Veuillez maintenant entrer une description pour votre article (max 200 caractères):*`;

        await repondre(messageDescription);

        // Attendre la description
        let descResponse;
        try {
            descResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = m.message?.extendedTextMessage?.text?.trim() || 
                               m.message?.conversation?.trim();
                    return text && text.length > 0 && text.length <= 200;
                }
            });
        } catch (error) {
            ventesEnCours.delete(auteurMessage);
            return repondre("⏰ Vente annulée - temps écoulé");
        }

        if (!descResponse) {
            ventesEnCours.delete(auteurMessage);
            return repondre('❌ Aucune description fournie, vente annulée.');
        }

        const description = descResponse.message?.extendedTextMessage?.text?.trim() || 
                           descResponse.message?.conversation?.trim();

        // Mettre à jour avec la description
        const venteData = ventesEnCours.get(auteurMessage);
        venteData.description = description;
        venteData.etape = "confirmation";

        // Demander confirmation finale
        const messageConfirmation = `✅ *RÉCAPITULATIF DE LA VENTE:*\n\n` +
            `📦 *Article:* ${venteData.nomArticle}\n` +
            `📝 *Description:* ${venteData.description}\n` +
            `🎯 *Rareté:* ${venteData.rarete}\n` +
            `💰 *Prix de vente:* ${venteData.prix}🎟️\n` +
            `🏪 *Jeu:* ${venteData.jeu}\n` +
            `📊 *Taxe (25%):* ${venteData.taxe}🎟️\n` +
            `💵 *Prix net:* ${venteData.prixNet}🎟️\n\n` +
            `*Confirmez-vous la mise en vente ? (oui/non)*`;

        await repondre(messageConfirmation);

        // Attendre la confirmation
        let confirmResponse;
        try {
            confirmResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = (m.message?.extendedTextMessage?.text?.trim() || 
                                m.message?.conversation?.trim()).toLowerCase();
                    return ["oui", "o", "non", "n"].includes(text);
                }
            });
        } catch (error) {
            ventesEnCours.delete(auteurMessage);
            return repondre("⏰ Vente annulée - temps écoulé");
        }

        if (!confirmResponse) {
            ventesEnCours.delete(auteurMessage);
            return repondre('❌ Aucune réponse, vente annulée.');
        }

        const confirmation = confirmResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                            confirmResponse.message?.conversation?.trim().toLowerCase();

        if (confirmation !== 'oui' && confirmation !== 'o') {
            ventesEnCours.delete(auteurMessage);
            return repondre('❌ Vente annulée.');
        }

        // Enregistrer l'article dans le marché
        const sellerName = auteurMessage.split('@')[0];
        const newItem = await addMarketItem({
            seller_name: sellerName,
            item_name: venteData.nomArticle,
            rarity: venteData.rarete,
            description: venteData.description,
            price: venteData.prix,
            game_type: venteData.jeu
        });

        // Enregistrer la transaction de mise en vente
        await insertTransaction({
            player_name: sellerName,
            type: 'Mise en vente Market',
            details: `Mise en vente de ${venteData.nomArticle} (${venteData.rarete}) sur le marché`,
            gains: `Article mis en vente au prix de ${venteData.prix} coupons`,
            montant: 0,
            date: new Date().toLocaleDateString('fr-FR'),
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            statut: 'valider'
        });

        // Nettoyer la vente en cours
        ventesEnCours.delete(auteurMessage);

        // Message de succès
        const successMessage = `✅ *ARTICLE MIS EN VENTE AVEC SUCCÈS!*\n\n` +
            `📦 *Article:* ${newItem.item_name}\n` +
            `🆔 *ID de vente:* ${newItem.id}\n` +
            `💰 *Prix:* ${newItem.price}🎟️\n` +
            `🏪 *Statut:* En vente\n\n` +
            `Utilisez *unsell ${newItem.id}* pour retirer l'article du marché.`;

        // Envoyer avec image de confirmation
        const imageUrl = "https://i.ibb.co/7WQzLk9T/sell-success.jpg";
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: successMessage,
        }, { quoted: ms });

    } catch (error) {
        // Nettoyer en cas d'erreur
        ventesEnCours.delete(auteurMessage);
        console.error('Erreur commande sell:', error);
        return repondre(`❌ Erreur lors de la mise en vente: ${error.message}`);
    }
});

// ========== COMMANDE BUY ==========
zokou({
    nomCom: "buy",
    reaction: "🛒",
    categorie: "Market",
}, async (dest, zk, commandOptions) => {
    const { repondre, arg, auteurMessage, ms } = commandOptions;

    try {
        // Vérifier si un achat est déjà en cours
        if (achatsEnCours.has(auteurMessage)) {
            return repondre("❌ Vous avez déjà un achat en cours. Veuillez le terminer avant d'en commencer un nouveau.");
        }

        // Vérifier les arguments
        if (arg.length === 0) {
            return repondre("❌ Utilisation incorrecte. Syntaxe:\n*buy [ID_article]*\n\nExemple:\n*buy a1b2c3d4*\n\nUtilisez *market* pour voir les articles disponibles.");
        }

        const itemId = arg[0].trim().toLowerCase();
        const buyerName = auteurMessage.split('@')[0];

        // Récupérer l'article du marché
        const marketItem = await getMarketItem(itemId);

        if (!marketItem) {
            return repondre("❌ Article non trouvé. Vérifiez l'ID ou l'article peut avoir été déjà vendu.");
        }

        if (marketItem.status !== 'en_vente') {
            return repondre("❌ Cet article n'est plus disponible à la vente.");
        }

        // Empêcher d'acheter son propre article
        if (marketItem.seller_name === buyerName) {
            return repondre("❌ Vous ne pouvez pas acheter votre propre article.");
        }

        // Calculer la taxe (25%) et le prix final
        const taxe = Math.floor(marketItem.price * TAXE_VENTE);
        const prixFinal = marketItem.price;

        // Vérifier que l'article est toujours disponible avant de continuer
        const itemStillAvailable = await getMarketItem(itemId);
        if (!itemStillAvailable || itemStillAvailable.status !== 'en_vente') {
            return repondre('❌ Cet article a été vendu entre-temps. Veuillez vérifier le marché.');
        }

        // Afficher les détails de l'article et demander confirmation
        achatsEnCours.set(auteurMessage, {
            itemId: itemId,
            marketItem: marketItem,
            taxe: taxe,
            prixFinal: prixFinal,
            timestamp: Date.now()
        });

        const messageDetails = `🛒 *DÉTAILS DE L'ACHAT*\n\n` +
            `📦 *Article:* ${marketItem.item_name}\n` +
            `📝 *Description:* ${marketItem.description}\n` +
            `🎯 *Rareté:* ${marketItem.rarity}\n` +
            `🎮 *Jeu:* ${marketItem.game_type}\n` +
            `👤 *Vendeur:* ${marketItem.seller_name}\n` +
            `💰 *Prix affiché:* ${marketItem.price}🎟️\n` +
            `📊 *Taxe de marché (25%):* ${taxe}🎟️\n` +
            `💵 *Montant total:* ${prixFinal}🎟️\n\n` +
            `*Confirmez-vous l'achat ? (oui/non)*\n\n` +
            `💡 *Note:* Présentez ce reçu à un administrateur pour la transaction réelle.`;

        await repondre(messageDetails);

        // Attendre la confirmation
        let confirmResponse;
        try {
            confirmResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: TIMEOUT_TRANSACTION,
                filter: (m) => {
                    const text = (m.message?.extendedTextMessage?.text?.trim() || 
                                m.message?.conversation?.trim()).toLowerCase();
                    return ["oui", "o", "non", "n"].includes(text);
                }
            });
        } catch (error) {
            achatsEnCours.delete(auteurMessage);
            return repondre("⏰ Achat annulé - temps écoulé");
        }

        if (!confirmResponse) {
            achatsEnCours.delete(auteurMessage);
            return repondre('❌ Aucune réponse, achat annulé.');
        }

        const confirmation = confirmResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                            confirmResponse.message?.conversation?.trim().toLowerCase();

        if (confirmation !== 'oui' && confirmation !== 'o') {
            achatsEnCours.delete(auteurMessage);
            return repondre('❌ Achat annulé.');
        }

        // Vérifier une dernière fois que l'article est disponible
        const finalCheck = await getMarketItem(itemId);
        if (!finalCheck || finalCheck.status !== 'en_vente') {
            achatsEnCours.delete(auteurMessage);
            return repondre('❌ Cet article a été vendu pendant votre confirmation. Veuillez vérifier le marché.');
        }

        // Marquer l'article comme vendu (le retirer du marché)
        const soldItem = await removeMarketItem(itemId, marketItem.seller_name);

        if (!soldItem) {
            achatsEnCours.delete(auteurMessage);
            return repondre('❌ Erreur lors de l\'achat. L\'article peut avoir été déjà vendu.');
        }

        // Enregistrer la transaction d'achat
        const transactionRecord = await insertTransaction({
            player_name: buyerName,
            type: 'Achat Market',
            details: `Achat de ${soldItem.item_name} à ${soldItem.seller_name}`,
            gains: `${soldItem.item_name} | ${soldItem.rarity} | ${soldItem.description}`,
            montant: -prixFinal,
            date: new Date().toLocaleDateString('fr-FR'),
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            statut: 'valider'
        });

        // Enregistrer également une transaction pour le vendeur
        await insertTransaction({
            player_name: soldItem.seller_name,
            type: 'Vente Market',
            details: `Vente de ${soldItem.item_name} à ${buyerName}`,
            gains: `${prixFinal - taxe} coupons (après taxe)`,
            montant: prixFinal - taxe,
            date: new Date().toLocaleDateString('fr-FR'),
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            statut: 'valider'
        });

        // Nettoyer l'achat en cours
        achatsEnCours.delete(auteurMessage);

        // Générer le reçu de l'acheteur
        const receiptBuyer = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN - REÇU D'ACHAT]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🆔 Transact ID :* ${transactionRecord.id}

> *📌 Type :* 🛒 Achat Market  
> *👤 Acheteur :* ${buyerName}
> *👤 Vendeur :* ${soldItem.seller_name}
> *🎯 Transaction :* Achat de ${soldItem.item_name}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*💰 Détails de la transaction :*
> *📦 Article acheté :*
> - ${soldItem.item_name} | ${soldItem.rarity}
> *📝 Description :* ${soldItem.description}
> *🎮 Jeu :* ${soldItem.game_type}
> *📊 Taxe marché :* -${taxe} coupons
> *💸 Montant débité :* -${prixFinal} coupons
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
📅 *Date :* ${new Date().toLocaleDateString('fr-FR')}
🕛 *Heure :* ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
🔄 *Statut :* valider
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[TRAITEMENT...]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

        // Envoyer le reçu à l'acheteur
        const imageUrl = "https://i.ibb.co/sJ9ypSfn/Image-2025-03-17-00-21-51-3.jpg";
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: receiptBuyer,
        }, { quoted: ms });

        // Informer le vendeur (si possible)
        try {
            await zk.sendMessage(dest, {
                text: `@${soldItem.seller_name} 🎉 *VOTRE ARTICLE A ÉTÉ VENDU!*\n\n` +
                      `📦 *Article:* ${soldItem.item_name}\n` +
                      `👤 *Acheteur:* ${buyerName}\n` +
                      `💰 *Prix de vente:* ${soldItem.price}🎟️\n` +
                      `📊 *Taxe (25%):* ${taxe}🎟️\n` +
                      `💵 *Gain net:* ${prixFinal - taxe}🎟️\n\n` +
                      `Présentez ce message à un administrateur pour recevoir votre paiement.`,
                mentions: [auteurMessage]
            });
        } catch (error) {
            console.log('Impossible de notifier le vendeur:', error);
        }

        await repondre('✅ Achat effectué avec succès! Vérifiez vos messages pour le reçu.');

    } catch (error) {
        // Nettoyer en cas d'erreur
        achatsEnCours.delete(auteurMessage);
        console.error('Erreur commande buy:', error);
        return repondre(`❌ Erreur lors de l'achat: ${error.message}`);
    }
});

// ========== COMMANDES MARKET ET MARCHÉ ==========
// Émojis pour les raretés
const RARITY_EMOJIS = {
  common: '⚪',
  rare: '🔵', 
  epic: '🟣',
  legendary: '🟡'
};

// Fonction pour formater la liste du marché
function formatMarketList(items, page, totalPages) {
  if (items.length === 0) {
    return "📊 *MARCHÉ - AUCUN ARTICLE*\n\nAucun article n'est actuellement en vente sur le marché.";
  }

  let message = `🏪 *MARCHÉ - PAGE ${page}/${totalPages}*\n\n`;
  message += `📦 *Articles disponibles:*\n\n`;

  items.forEach((item, index) => {
    const position = ((page - 1) * 10) + index + 1;
    message += `*${position}.* ${RARITY_EMOJIS[item.rarity]} *${item.item_name}*\n`;
    message += `   📝 *Description:* ${item.description}\n`;
    message += `   🎮 *Jeu:* ${item.game_type}\n`;
    message += `   💰 *Prix:* ${item.price}🎟️\n`;
    message += `   👤 *Vendeur:* ${item.seller_name}\n`;
    message += `   🆔 *ID:* ${item.id}\n\n`;
  });

  message += `Utilisez *market [page]* pour voir d'autres pages.`;
  
  return message;
}

zokou({
  nomCom: "market",
  reaction: "🏪",
  categorie: "Market",
}, async (dest, zk, commandOptions) => {
  const { repondre, arg, ms } = commandOptions;

  try {
    // Déterminer la page demandée
    const page = parseInt(arg[0]) || 1;
    
    if (page < 1) {
      return repondre("❌ Le numéro de page doit être supérieur à 0.");
    }

    // Récupérer les articles du marché
    const marketData = await getMarketItems(page, 10);
    
    if (marketData.items.length === 0 && page > 1) {
      return repondre(`❌ La page ${page} n'existe pas. Il n'y a que ${marketData.totalPages} page(s) disponible(s).`);
    }

    // Formater et envoyer la réponse
    const marketMessage = formatMarketList(marketData.items, page, marketData.totalPages);
    
    // Envoyer avec une image d'en-tête
    const imageUrl = "https://i.ibb.co/0Q8LZz4T/market-header.jpg";
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: marketMessage,
    }, { quoted: ms });

  } catch (error) {
    console.error('Erreur commande market:', error);
    return repondre(`❌ Erreur lors de l'accès au marché: ${error.message}`);
  }
});

// Commande alternative avec alias
zokou({
  nomCom: "marché",
  reaction: "🏪", 
  categorie: "Market",
}, async (dest, zk, commandOptions) => {
  // Réutiliser la même logique que la commande market
  const { repondre, arg, ms } = commandOptions;
  
  try {
    const page = parseInt(arg[0]) || 1;
    
    if (page < 1) {
      return repondre("❌ Le numéro de page doit être supérieur à 0.");
    }

    const marketData = await getMarketItems(page, 10);
    
    if (marketData.items.length === 0 && page > 1) {
      return repondre(`❌ La page ${page} n'existe pas. Il n'y a que ${marketData.totalPages} page(s) disponible(s).`);
    }

    const marketMessage = formatMarketList(marketData.items, page, marketData.totalPages);
    const imageUrl = "https://i.ibb.co/0Q8LZz4T/market-header.jpg";
    
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: marketMessage,
    }, { quoted: ms });

  } catch (error) {
    console.error('Erreur commande marché:', error);
    return repondre(`❌ Erreur lors de l'accès au marché: ${error.message}`);
  }
});

// ========== COMMANDES DE PARIS ==========
zokou({
  nomCom: "newbet",
  reaction: "🎲",
  categorie: "Paris",
  desc: "Créer un nouveau pari (admin uniquement)"
}, async (dest, zk, commandOptions) => {
  const { repondre, arg, auteurMessage, superUser, ms } = commandOptions;

  try {
    // Vérifier les permissions admin
    if (!superUser) {
      return repondre("❌ Cette commande est réservée aux administrateurs.");
    }

    // Vérifier si un pari est déjà en cours de création
    if (parisEnCours.has(auteurMessage)) {
      return repondre("❌ Vous avez déjà un pari en cours de création.");
    }

    // Vérifier les arguments minimum
    if (arg.length < 3) {
      return repondre("❌ Utilisation: *newbet [type] [mise_min] [titre]*\n\n" +
        "Types: *simple* (×2) ou *conditionnel* (×4)\n" +
        "Exemple: *newbet simple 50 Victoire de l'équipe A*");
    }

    const typePari = arg[0].toLowerCase();
    const miseMin = parseInt(arg[1]);
    const titrePari = arg.slice(2).join(" ");

    // Validation du type de pari
    if (!['simple', 'conditionnel'].includes(typePari)) {
      return repondre("❌ Type de pari invalide. Choisissez: *simple* ou *conditionnel*");
    }

    // Validation de la mise minimum
    if (isNaN(miseMin) || miseMin < 10 || miseMin > 10000) {
      return repondre("❌ La mise minimum doit être un nombre entre 10 et 10 000 coupons.");
    }

    // Validation du titre
    if (titrePari.length > 100) {
      return repondre("❌ Le titre est trop long (max 100 caractères).");
    }

    // Démarrer le processus de création
    parisEnCours.set(auteurMessage, {
      etape: "options",
      type: typePari,
      miseMin: miseMin,
      titre: titrePari,
      timestamp: Date.now()
    });

    let message = `✅ *CRÉATION D'UN PARI - ÉTAPE 1/3*\n\n` +
      `📋 *Récapitulatif:*\n` +
      `🎯 *Type:* ${typePari} (rapport ×${typePari === 'simple' ? '2' : '4'})\n` +
      `💰 *Mise minimum:* ${miseMin} coupons\n` +
      `📝 *Titre:* ${titrePari}\n\n`;

    if (typePari === 'conditionnel') {
      message += `*Veuillez entrer la condition spéciale (max 150 caractères):*\n` +
        `Exemple: "Victoire de John par KO au 2ème round"\n\n` +
        `*Répondez avec la condition:*`;
      
      parisEnCours.get(auteurMessage).etape = "condition";
    } else {
      message += `*Veuillez entrer les options (2-5 options, séparées par des /):*\n` +
        `Exemple: Équipe A / Équipe B / Match nul\n\n` +
        `*Répondez avec les options:*`;
      
      parisEnCours.get(auteurMessage).etape = "options_simple";
    }

    await repondre(message);

    // Attendre la réponse pour la condition ou les options
    let response;
    try {
      response = await zk.awaitForMessage({
        sender: auteurMessage,
        chatJid: dest,
        timeout: 120000,
        filter: (m) => {
          const text = m.message?.extendedTextMessage?.text?.trim() || 
                     m.message?.conversation?.trim();
          return text && text.length > 0;
        }
      });
    } catch (error) {
      parisEnCours.delete(auteurMessage);
      return repondre("⏰ Création annulée - temps écoulé");
    }

    if (!response) {
      parisEnCours.delete(auteurMessage);
      return repondre('❌ Aucune réponse, création annulée.');
    }

    const reponseText = response.message?.extendedTextMessage?.text?.trim() || 
                       response.message?.conversation?.trim();

    const pariData = parisEnCours.get(auteurMessage);

    if (pariData.etape === "condition") {
      // Validation de la condition
      if (reponseText.length > 150) {
        parisEnCours.delete(auteurMessage);
        return repondre('❌ La condition est trop longue (max 150 caractères).');
      }

      // Stocker la condition et demander les options
      pariData.condition = reponseText;
      pariData.etape = "options_conditionnel";
      
      await repondre(`✅ *Condition enregistrée:* ${reponseText}\n\n` +
        `*Veuillez entrer les options (2-5 options, séparées par des /):*\n` +
        `Exemple: Oui / Non\n\n` +
        `*Répondez avec les options:*`);
      
      // Attendre les options
      let optionsResponse;
      try {
        optionsResponse = await zk.awaitForMessage({
          sender: auteurMessage,
          chatJid: dest,
          timeout: 120000,
          filter: (m) => {
            const text = m.message?.extendedTextMessage?.text?.trim() || 
                       m.message?.conversation?.trim();
            return text && text.length > 0 && text.includes('/');
          }
        });
      } catch (error) {
        parisEnCours.delete(auteurMessage);
        return repondre("⏰ Création annulée - temps écoulé");
      }

      if (!optionsResponse) {
        parisEnCours.delete(auteurMessage);
        return repondre('❌ Aucune option fournie, création annulée.');
      }

      pariData.options = optionsResponse.message?.extendedTextMessage?.text?.trim().split('/').map(opt => opt.trim()) || 
                        optionsResponse.message?.conversation?.trim().split('/').map(opt => opt.trim());
    } else {
      // Traitement direct des options pour les paris simples
      pariData.options = reponseText.split('/').map(opt => opt.trim());
      pariData.condition = null;
    }

    // Validation des options
    if (pariData.options.length < 2) {
      parisEnCours.delete(auteurMessage);
      return repondre('❌ Au moins 2 options sont nécessaires.');
    }

    if (pariData.options.length > 5) {
      parisEnCours.delete(auteurMessage);
      return repondre('❌ Maximum 5 options autorisées.');
    }

    // Valider chaque option
    for (const option of pariData.options) {
      if (option.length === 0 || option.length > 50) {
        parisEnCours.delete(auteurMessage);
        return repondre('❌ Chaque option doit contenir entre 1 et 50 caractères.');
      }
    }

    pariData.etape = "confirmation";

    // Afficher le récapitulatif final
    let recap = `✅ *RÉCAPITULATIF FINAL - ÉTAPE 3/3*\n\n` +
      `🎯 *Type de pari:* ${pariData.type} (×${pariData.type === 'simple' ? '2' : '4'})\n` +
      `💰 *Mise minimum:* ${pariData.miseMin} coupons\n` +
      `📝 *Titre:* ${pariData.titre}\n`;
    
    if (pariData.condition) {
      recap += `⚡ *Condition:* ${pariData.condition}\n`;
    }
    
    recap += `📊 *Options:*\n`;
    pariData.options.forEach((option, index) => {
      recap += `   ${index + 1}. ${option}\n`;
    });
    
    recap += `\n*Confirmez-vous la création de ce pari ? (oui/non)*`;

    await repondre(recap);

    // Attendre la confirmation finale
    let confirmResponse;
    try {
      confirmResponse = await zk.awaitForMessage({
        sender: auteurMessage,
        chatJid: dest,
        timeout: TIMEOUT_TRANSACTION,
        filter: (m) => {
          const text = (m.message?.extendedTextMessage?.text?.trim() || 
                      m.message?.conversation?.trim()).toLowerCase();
          return ["oui", "o", "non", "n"].includes(text);
        }
      });
    } catch (error) {
      parisEnCours.delete(auteurMessage);
      return repondre("⏰ Création annulée - temps écoulé");
    }

    if (!confirmResponse) {
      parisEnCours.delete(auteurMessage);
      return repondre('❌ Aucune réponse, création annulée.');
    }

    const confirmation = confirmResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                        confirmResponse.message?.conversation?.trim().toLowerCase();

    if (confirmation !== 'oui' && confirmation !== 'o') {
      parisEnCours.delete(auteurMessage);
      return repondre('❌ Création annulée.');
    }

    // Créer le pari dans la base de données
    const newBet = await createNewBet({
      title: pariData.titre,
      creator: auteurMessage.split('@')[0],
      options: pariData.options,
      bet_type: pariData.type,
      condition: pariData.condition,
      min_bet: pariData.miseMin
    });

    // Nettoyer
    parisEnCours.delete(auteurMessage);

    // Message de succès
    const successMessage = `🎉 *PARI CRÉÉ AVEC SUCCÈS!*\n\n` +
      `🆔 *ID du pari:* ${newBet.id}\n` +
      `🎯 *Type:* ${newBet.bet_type} (×${newBet.bet_type === 'simple' ? '2' : '4'})\n` +
      `💰 *Mise min:* ${newBet.min_bet} coupons\n` +
      `📝 *Titre:* ${newBet.title}\n` +
      `📊 *Options:* ${newBet.options.join(' | ')}\n\n` +
      `Utilisez *betlist* pour voir tous les paris ouverts.`;

    // Envoyer avec image
    const imageUrl = "https://i.ibb.co/8XYqZzT/bet-created.jpg";
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: successMessage,
    }, { quoted: ms });

  } catch (error) {
    parisEnCours.delete(auteurMessage);
    console.error('Erreur commande newbet:', error);
    return repondre(`❌ Erreur lors de la création du pari: ${error.message}`);
  }
});

// ========== COMMANDE BETLIST ==========
zokou({
  nomCom: "betlist",
  reaction: "📋",
  categorie: "Paris",
  desc: "Voir la liste des paris ouverts"
}, async (dest, zk, commandOptions) => {
  const { repondre, arg, ms } = commandOptions;

  try {
    const page = parseInt(arg[0]) || 1;
    
    if (page < 1) {
      return repondre("❌ Le numéro de page doit être supérieur à 0.");
    }

    // Récupérer les paris ouverts
    const betsData = await getOpenBets(page, 5);
    
    if (betsData.bets.length === 0) {
      if (page > 1) {
        return repondre(`❌ La page ${page} n'existe pas. Aucun pari ouvert.`);
      }
      return repondre("📊 *PARIS OUVERTS*\n\nAucun pari n'est actuellement ouvert.");
    }

    // Formater la liste des paris
    let message = `📊 *PARIS OUVERTS - PAGE ${page}/${betsData.totalPages}*\n\n`;
    
    betsData.bets.forEach((bet, index) => {
      const position = ((page - 1) * 5) + index + 1;
      const rapport = bet.bet_type === 'simple' ? '×2' : '×4';
      
      message += `*${position}.* 🎯 *${bet.title}*\n`;
      message += `   🆔 *ID:* ${bet.id}\n`;
      message += `   ⚡ *Type:* ${bet.bet_type} (${rapport})\n`;
      message += `   💰 *Mise min:* ${bet.min_bet} coupons\n`;
      message += `   👥 *Participants:* ${bet.participants_count || 0}\n`;
      message += `   🏦 *Pot total:* ${bet.total_pot || 0} coupons\n`;
      
      if (bet.condition) {
        message += `   📌 *Condition:* ${bet.condition}\n`;
      }
      
      message += `   📊 *Options:*\n`;
      bet.options.forEach((option, optIndex) => {
        const stat = bet.bet_stats?.find(s => s.option_index === optIndex);
        const miseTotale = stat ? parseInt(stat.total_amount) : 0;
        const pourcentage = bet.total_pot > 0 ? Math.round((miseTotale / bet.total_pot) * 100) : 0;
        message += `      ${optIndex + 1}. ${option} (${miseTotale} coupons - ${pourcentage}%)\n`;
      });
      
      message += `\n`;
    });

    message += `Utilisez *bet [ID] [option] [mise]* pour participer.\n`;
    message += `Exemple: *bet ${betsData.bets[0].id} 1 100*`;

    // Envoyer avec image
    const imageUrl = "https://i.ibb.co/0Q8LZz4T/market-header.jpg";
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: message,
    }, { quoted: ms });

  } catch (error) {
    console.error('Erreur commande betlist:', error);
    return repondre(`❌ Erreur lors de la récupération des paris: ${error.message}`);
  }
});

// ========== COMMANDE BET ==========
zokou({
  nomCom: "bet",
  reaction: "💰",
  categorie: "Paris",
  desc: "Participer à un pari"
}, async (dest, zk, commandOptions) => {
  const { repondre, arg, auteurMessage, ms } = commandOptions;

  try {
    // Vérifier si une mise est déjà en cours
    if (misesEnCours.has(auteurMessage)) {
      return repondre("❌ Vous avez déjà une mise en cours. Veuillez la terminer avant d'en placer une nouvelle.");
    }

    // Vérifier les arguments
    if (arg.length < 3) {
      return repondre("❌ Utilisation: *bet [ID_du_pari] [numéro_option] [montant]*\n\n" +
        "Exemple: *bet A1B2C3D4 1 100*\n\n" +
        "Utilisez *betlist* pour voir les paris disponibles.");
    }

    const betId = arg[0].toUpperCase();
    const optionIndex = parseInt(arg[1]) - 1;
    const montant = parseInt(arg[2]);

    // Validation de base
    if (isNaN(optionIndex) || optionIndex < 0) {
      return repondre("❌ Numéro d'option invalide. Utilisez 1, 2, 3...");
    }

    if (isNaN(montant) || montant <= 0 || montant > 50000) {
      return repondre("❌ Le montant doit être un nombre entre 1 et 50 000 coupons.");
    }

    // Récupérer les informations du pari
    const bet = await getBet(betId);
    
    if (!bet) {
      return repondre("❌ Pari non trouvé. Vérifiez l'ID ou le pari peut être fermé.");
    }

    if (bet.status !== 'open') {
      return repondre("❌ Ce pari est fermé aux nouvelles mises.");
    }

    // Vérifier l'option
    if (optionIndex >= bet.options.length) {
      return repondre(`❌ Option invalide. Ce pari a ${bet.options.length} option(s): 1 à ${bet.options.length}`);
    }

    // Vérifier la mise minimum
    if (montant < bet.min_bet) {
      return repondre(`❌ Mise trop faible. Minimum requis: ${bet.min_bet} coupons`);
    }

    // Vérifier si le joueur a déjà misé sur ce pari
    const existingBet = await getPlayerBet(betId, auteurMessage.split('@')[0]);
    if (existingBet) {
      return repondre(`❌ Vous avez déjà misé ${existingBet.amount} coupons sur ce pari.`);
    }

    // Calculer le gain potentiel
    const gainPotentiel = bet.bet_type === 'simple' ? montant * 2 : montant * 4;
    const optionChoisie = bet.options[optionIndex];

    // Demander confirmation
    misesEnCours.set(auteurMessage, {
      betId: betId,
      optionIndex: optionIndex,
      optionName: optionChoisie,
      montant: montant,
      gainPotentiel: gainPotentiel,
      timestamp: Date.now()
    });

    const messageConfirmation = `💰 *CONFIRMATION DE MISE*\n\n` +
      `🎯 *Pari:* ${bet.title}\n` +
      `📊 *Option choisie:* ${optionChoisie}\n` +
      `💵 *Montant misé:* ${montant} coupons\n` +
      `🎰 *Gain potentiel:* ${gainPotentiel} coupons\n` +
      `⚡ *Type:* ${bet.bet_type} (×${bet.bet_type === 'simple' ? '2' : '4'})\n\n` +
      `*Confirmez-vous cette mise ? (oui/non)*`;

    await repondre(messageConfirmation);

    // Attendre la confirmation
    let confirmResponse;
    try {
      confirmResponse = await zk.awaitForMessage({
        sender: auteurMessage,
        chatJid: dest,
        timeout: TIMEOUT_TRANSACTION,
        filter: (m) => {
          const text = (m.message?.extendedTextMessage?.text?.trim() || 
                      m.message?.conversation?.trim()).toLowerCase();
          return ["oui", "o", "non", "n"].includes(text);
        }
      });
    } catch (error) {
      misesEnCours.delete(auteurMessage);
      return repondre("⏰ Mise annulée - temps écoulé");
    }

    if (!confirmResponse) {
      misesEnCours.delete(auteurMessage);
      return repondre('❌ Aucune réponse, mise annulée.');
    }

    const confirmation = confirmResponse.message?.extendedTextMessage?.text?.trim().toLowerCase() || 
                        confirmResponse.message?.conversation?.trim().toLowerCase();

    if (confirmation !== 'oui' && confirmation !== 'o') {
      misesEnCours.delete(auteurMessage);
      return repondre('❌ Mise annulée.');
    }

    // Vérifier que le pari est toujours ouvert
    const betStillOpen = await getBet(betId);
    if (!betStillOpen || betStillOpen.status !== 'open') {
      misesEnCours.delete(auteurMessage);
      return repondre('❌ Ce pari a été fermé pendant votre confirmation.');
    }

    // Placer la mise
    const miseData = misesEnCours.get(auteurMessage);
    const playerName = auteurMessage.split('@')[0];

    const betEntry = await placeBet({
      bet_id: miseData.betId,
      player_name: playerName,
      option_index: miseData.optionIndex,
      option_name: miseData.optionName,
      amount: miseData.montant
    });

    // Enregistrer la transaction
    await insertTransaction({
      player_name: playerName,
      type: 'Mise Paris',
      details: `Mise sur le pari "${bet.title}" - Option: ${miseData.optionName}`,
      gains: `Gain potentiel: ${miseData.gainPotentiel} coupons`,
      montant: -miseData.montant,
      date: new Date().toLocaleDateString('fr-FR'),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      statut: 'valider'
    });

    // Nettoyer
    misesEnCours.delete(auteurMessage);

    // Message de succès
    const successMessage = `✅ *MISE EFFECTUÉE AVEC SUCCÈS!*\n\n` +
      `🎯 *Pari:* ${bet.title}\n` +
      `📊 *Option:* ${miseData.optionName}\n` +
      `💵 *Montant:* ${miseData.montant} coupons\n` +
      `🎰 *Gain potentiel:* ${miseData.gainPotentiel} coupons\n` +
      `👥 *Total participants:* ${(bet.participants_count || 0) + 1}\n` +
      `🏦 *Nouveau pot total:* ${(bet.total_pot || 0) + miseData.montant} coupons\n\n` +
      `Bonne chance! 🍀`;

    await repondre(successMessage);

  } catch (error) {
    misesEnCours.delete(auteurMessage);
    console.error('Erreur commande bet:', error);
    return repondre(`❌ Erreur lors de la mise: ${error.message}`);
  }
});

