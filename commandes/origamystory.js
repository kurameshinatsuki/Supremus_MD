const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/origamystory');

zokou(
    {
        nomCom: 'control_astoria',
        categorie: 'ORIGAMY'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

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
            '🚧': 'Entrée Restreinte',
            '🛍️': 'Marché Central',
            '🍻': 'Luxury Taverne',
            '🥖': 'Baguette Dorée',
            '⚒️': 'Forge d\'Edward',
            '🎎': 'Grand Bazar',
            '🏤': 'Bureau des Missions',
            '🏦': 'Banque des Trésors',
            '🏞️': 'Bains de Sagacia',
            '🏬': 'Galerie des Arts',
            '📚': 'Grande Bibliothèque',
            '🏥': 'Centre Médical',
            '⚗️': 'Laboratoire d\'Oris',
            '🏘️': 'Quartier Résidentiel',
            '🎮': 'Salle des Jeux',
            '🛀': 'Bains Royaux',
            '🏡': 'Résidences Nobles',
            '🚪': 'Entrée Privée',
            '🧵': 'Nobles Couture',
            '⛲': 'Cour d\'Honneur',
            '🏰': 'Palais Royal',
            '🪴': 'Jardins Privés',
            '🏯': 'Hall des Gardiens',
            '⚱️': 'Oubliettes',
            '🐎': 'Écuries Royales',
            '🔭': 'Tour Astral',
            '🗡️': 'Arsenal Royaux'
            // Ajouter d'autres émojis et mots-clés ici si nécessaire
        };

        try {
            const message = arg.join(' ');

            // Cherche si le message contient un emoji
            let found = false;
            for (const [emoji, lieu] of Object.entries(emojimap)) {
                if (message.includes(emoji)) {
                    found = true;

                    // Récupérer le verdict pour ce lieu
                    const verdictData = await getVerdictByKeyword(lieu);
                    if (verdictData) {
                        const { verdict, image_url } = verdictData;
                        if (image_url) {
                            await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                        } else {
                            repondre(verdict);
                        }
                    } else {
                        repondre(`*♼ Chargement...*`);
                    }
                    break;
                }
            }

            if (!found) {
                repondre("Aucun verdict défini pour cet emoji.");
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);