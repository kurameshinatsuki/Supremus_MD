const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/origamystory');

zokou(
    {
        nomCom: 'control',
        categorie: 'ORIGAMY'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        const emojimap = {
            '🍻': 'taverne',
            '🏛️': 'bureau',
            '1km': 'defi1',
            '2km': 'defi2',
            // Ajouter d'autres émojis et mots-clés ici
        };

        try {
            const message = arg.join(' ');

            // Cherche si le message contient un mot-clé
            let found = false;
            for (const [emoji, motCle] of Object.entries(emojimap)) {
                if (message.includes(emoji)) {
                    found = true;

                    // Récupérer le verdict pour ce mot-clé
                    const verdictData = await getVerdictByKeyword(motCle);
                    if (verdictData) {
                        const { verdict, image_url } = verdictData;
                        if (image_url) {
                            await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                        } else {
                            repondre(verdict);
                        }
                    } else {
                        repondre(`Aucun verdict défini pour '${motCle}'.`);
                    }
                    break;
                }
            }

            if (!found) {
                repondre("Aucun mot-clé trouvé dans le message.");
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);

zokou(
    {
        nomCom: 'verdict',
        categorie: 'DRPS',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée aux admins.");
        }

        try {
            const [motCle, verdict, imageUrl, etat] = arg.join(' ').split(';');

            if (motCle && verdict && etat) {
                await updateVerdict(motCle, verdict, imageUrl, etat);
                repondre(`Verdict pour '${motCle}' mis à jour avec succès.`);
            } else {
                repondre("Format incorrect. Utilisez: -updateVerdict motCle;verdict;imageUrl;etat");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);