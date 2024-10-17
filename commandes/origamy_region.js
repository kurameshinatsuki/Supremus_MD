const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/origamy_bdd');

// Emojis pour les lieux principaux et sous-lieux
const emojimap = {
    '🏕️': 'Forteresse de Lorn',
    '🏹': 'Avant-poste',
    '⚒️': 'Forge Secrète',
    '⛩️': 'Sanctuaire du Dragon',
    '🐉': 'Caveau du Dragon',
    '🛕': 'Autel des Anciens',
    '🗻': 'Lac d\'Argent',
    '💧': 'Bassin des Profondeurs',
    '🏝️': 'Île Mystique',
    '🏭': 'Forteresse de Cendre',
    '🌋': 'Volcan de Mirathos',
    '🪨': 'Tunnel Magmatique',
    '🏞️': 'Rivière des Larmes',
    '⚓': 'Port des Ombres',
    '🏰': 'Château de Verelys',
    '👑': 'Salle du Trône',
    '🌳': 'Réserve des Chênes',
    '🌱': 'Clairière des Anciens',
    '🌼': 'Jardins des Druides',
    '⛰️': 'Monts Céruléens',
    '💎': 'Grotte des Gemmes',
    '🌬️': 'Sommet des Brumes',
    '🌄': 'Vallée des Anciens',
    '🏛️': 'Ruines du Temple',
    '🔱': 'Autel des Ancêtres',
    '🏘️': 'Village de Durnhelm',
    '🛖': 'Auberge du Chêne Vert',
    '🛠️': 'Atelier des Forgerons',
    '🗡️': 'Grotte de la Vipère',
    '🐍': 'Niche du Serpent',
    '💰': 'Chambre des Trésors Cachés',
    '🌉': 'Pont de Faladon',
    '🧱': 'Barrière Sud',
    '🌊': 'Rives du Pont',
    '🌾': 'Champs de Meridia',
    '🚜': 'Ferme de Miril',
    '🏚️': 'Grange Abandonnée',
    '🌲': 'Forêt Nocturne',
    '🍃': 'Clairière de la Lune',
    '🎪': 'Cabane du Sorcier'
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
};

zokou(
    {
        nomCom: 'control_regional',
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
                            // Si aucun verdict n'est trouvé pour ce sous-lieu
                            repondre(`\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT...*`);
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
                        // Si aucun verdict n'est trouvé pour ce lieu principal
                        repondre(`\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT...*`);
                    }
                    break; // On sort de la boucle après avoir trouvé un lieu principal
                }
            }

            if (!found) {
                // Si aucun emoji correspondant n'a été trouvé
                repondre("\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Rien à signaler.\n\n*NEXT...*");
            }

        } catch (error) {
            // Gestion des erreurs avec informations détaillées sur le lieu et l'emoji
            console.error(`Erreur lors du traitement du lieu avec l'emoji correspondant: ` + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);