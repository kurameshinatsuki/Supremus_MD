// index.js

const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword } = require('../bdd/test_origamy');
const { generateCompleteEmojiMap, customNoVerdictMessages } = require('./playertest');

// Génération de la carte complète des emojis
const completeEmojiMap = generateCompleteEmojiMap();

// Commande principale pour gérer les lieux et verdicts
zokou({
    nomCom: 'control_astoria',
    categorie: 'ORIGAMY'
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

    try {
        const message = arg.join(' ');
        let found = false;

        // Parcours des lieux et des événements
        for (const [emoji, lieu] of Object.entries(completeEmojiMap)) {
            if (message.includes(emoji)) {
                found = true;

                // Récupération du verdict pour le lieu
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
                break; // Sort de la boucle après avoir trouvé un lieu correspondant
            }
        }

        if (!found) {
            // Si aucun emoji correspondant n'a été trouvé
            repondre("Lieu inconnu ou emoji invalide. Veuillez utiliser un emoji correspondant à un lieu.");
        }

    } catch (error) {
        // Gestion des erreurs avec informations détaillées
        console.error(`Erreur lors du traitement du lieu avec l'emoji: ` + error);
        repondre("Une erreur est survenue. Veuillez réessayer.");
    }
});
