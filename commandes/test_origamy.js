const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/test_origamy');

// Emojis de base pour les lieux principaux
const emojimap = {
    '⛩️': 'Porte Principale',
    '🛞': 'Transport Public',
    '🪦': 'Cimetière',
    '🌲': 'Bois Sacrés',
    '🏟️': 'Colisée d\'Aurelius',
    '🕳️': 'Arène Souterraine',
    '🏛️': 'Centre de Commandement',
    '🏹': 'Camp d\'Entraînement',
    '🎓': 'Académie d\'Arcana',
    '🏢': 'Caserne de la Garde',
    '🛍️': 'Marché Central',
    '🍻': 'Luxury Taverne',
    '🥖': 'Baguette Dorée',
    '⚒️': 'Forge d\'Edward',
    '🎎': 'Grand Bazar',
    '🏤': 'Bureau des Missions',
    '🏦': 'Salle des Trésors',
    '🫧': 'Bains Public',
    '🏬': 'Galerie des Arts',
    '📚': 'Grande Bibliothèque',
    '🏥': 'Centre Médical',
    '⚗️': 'Laboratoire d\'Oris',
    '🏘️': 'Quartier Résidentiel',
    '🎮': 'Salle des Jeux',
    '🛀': 'Bains Royaux',
    '🏡': 'Résidences Nobles',
    '⛲': 'Cour d\'Honneur',
    '🏰': 'Palais Royal',
    '👑': 'Salle du Trône',
    '🏯': 'Hall des Gardiens',
    '⚱️': 'Oubliettes',
    '🐎': 'Écuries Royales',
    '🔭': 'Tour Astral',
    '🗡️': 'Arsenal Royaux',
    '🗺️': 'Carte Astoria'
};

// Suffixes pour les sous-lieux et événements
const eventEmojis = {
    'ℹ️': 'Event',
    '⬇️': 'Sud',
    '⬆️': 'Nord',
    '➡️': 'Est',
    '⬅️': 'Ouest',
    '🧑‍🍳': 'Comptoir',
    '🪑': 'Place',
    '1️⃣': 'Chambre 1',
    '2️⃣': 'Chambre 2',
    '3️⃣': 'Chambre 3'
};

// Fonction pour générer la carte complète des emojis avec leurs sous-lieux et événements
const completeEmojiMap = {};

// Remplir le completeEmojiMap avec les sous-lieux
for (const [emoji, lieu] of Object.entries(emojimap)) {
    completeEmojiMap[emoji] = lieu;

    // Ajout des événements et sous-lieux pour chaque lieu
    for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
        completeEmojiMap[emoji + eventEmoji] = lieu + ' ' + eventName;
    }
}

// Messages personnalisés en cas d'absence de verdict
const customNoVerdictMessages = {
    'Porte Principale': '\`ORIGAMY STORY\`\n\n> Il semble que tout soit calme ici, aucune activité notable pour l’instant.\n\n*NEXT...*',
    'Transport Public': '\`ORIGAMY STORY\`\n\n> Les véhicules passent tranquillement, mais rien de spécial n’est à signaler.\n\n*NEXT...*',
    'Cimetière': '\`ORIGAMY STORY\`\n\n> Le cimetière est silencieux... peut-être un secret à découvrir plus tard ?\n\n*NEXT...*',
    'Bois Sacrés': '\`ORIGAMY STORY\`\n\n> Les arbres murmurent, mais aucune activité visible pour le moment.\n\n*NEXT...*',
    'Colisée d\'Aurelius': '\`ORIGAMY STORY\`\n\n> Aucun combat en cours dans l\'arène... peut-être plus tard ?\n\n*NEXT...*',
    // Ajoute des messages spécifiques pour d'autres lieux si nécessaire.
};

zokou(
    {
        nomCom: 'test_astoria',
        categorie: 'ORIGAMY'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        try {
            const message = arg.join(' ');
            let found = false;

            // Parcours des lieux et des événements
            for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
                for (const [emoji, lieu] of Object.entries(emojimap)) {
                    // Génération dynamique des sous-lieux avec le format `${lieu}_${event}`
                    const subLieuEmoji = emoji + eventEmoji;
                    const subLieuEventKey = `${lieu}_${eventName}`; // clé dynamique

                    if (message.includes(subLieuEmoji)) {
                        found = true;

                        // Récupération du verdict pour le sous-lieu et l'événement spécifique
                        const verdictData = await getVerdictByKeyword(subLieuEventKey); // Utilisation de la clé dynamique
                        if (verdictData) {
                            const { verdict, image_url } = verdictData;
                            if (image_url) {
                                // Envoi de l'image avec le verdict en légende
                                await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                            } else {
                                repondre(verdict);
                            }
                        } else {
                            // Réponse personnalisée si aucun verdict n'est trouvé pour ce sous-lieu
                            repondre(customNoVerdictMessages[lieu] || `\`ORIGAMY STORY\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT... Veuillez continuer votre exploration.*`);
                        }
                        return; // On sort de la fonction après avoir trouvé un sous-lieu
                    }
                }
            }

            // Si aucun sous-lieu n'est trouvé, vérifie les lieux principaux
            for (const [emoji, lieu] of Object.entries(emojimap)) {
                if (message.includes(emoji)) {
                    found = true;

                    // Récupération du verdict pour ce lieu principal
                    const verdictData = await getVerdictByKeyword(lieu);
                    if (verdictData) {
                        const { verdict, image_url } = verdictData;
                        if (image_url) {
                            // Envoi de l'image avec le verdict en légende
                            await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                        } else {
                            repondre(verdict);
                        }
                    } else {
                        // Réponse personnalisée si aucun verdict n'est trouvé
                        repondre(customNoVerdictMessages[lieu] || `\`ORIGAMY STORY\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT... Veuillez continuer votre exploration.*`);
                    }
                    break; // On sort de la boucle après avoir trouvé un lieu principal
                }
            }

            if (!found) {
                // Si aucun emoji correspondant n'a été trouvé
                repondre("♼ *NEXT...*");
            }

        } catch (error) {
            // Gestion des erreurs avec informations détaillées sur le lieu et l'emoji
            console.error(`Erreur lors du traitement du lieu avec l'emoji correspondant: ` + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);

zokou(
    {
        nomCom: 'test_master',
        categorie: 'DRPN',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée aux *🌐STORY MASTER🎭*.");
        }

        try {
            const [motCle, verdict, imageUrl, etat] = arg.join(' ').split(';');

            if (motCle && verdict && etat) {
                await updateVerdict(motCle, verdict, imageUrl, etat);
                repondre(`Verdict pour '${motCle}' mis à jour avec succès.`);
            } else {
                repondre("*Format incorrect.*\n*Utilisez:*  -astoria_master motCle;verdict;imageUrl;normal");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);