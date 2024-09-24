const { zokou } = require('../framework/zokou');
const { getVerdictByDistance, updateVerdictByDistance } = require('../bdd/speedrush');

zokou(
    {
        nomCom: 'control_speedrush',
        categorie: 'CENTRAL'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre } = commandeOptions;

        try {
            const message = arg.join(' ');

            // Cherche si le message contient une distance (ex: "3km")
            const distanceMatch = message.match(/(\d+)km/);
            if (!distanceMatch) {
                return repondre("Aucune distance valide trouvée dans le message.");
            }

            const distance = parseInt(distanceMatch[1]);  // Extraire la distance

            // Récupérer le verdict et l'image associés à cette distance
            const verdictData = await getVerdictByDistance(distance);
            if (verdictData) {
                const { verdict, image_url, defis } = verdictData;
                const caption = `${verdict}\nDéfis dans cette section : ${defis}`;

                // Envoyer le verdict avec l'image si elle existe
                if (image_url) {
                    await zk.sendMessage(dest, { image: { url: image_url }, caption: caption }, { quoted: ms });
                } else {
                    repondre(caption);
                }
            } else {
                repondre(`Aucune donnée disponible pour ${distance} km.`);
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);


zokou(
    {
        nomCom: 'verdict_speedrush',
        categorie: 'DRPN',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée aux admins.");
        }

        try {
            const [distance, verdict, imageUrl, defis] = arg.join(' ').split(';');

            if (distance && verdict && defis) {
                await updateVerdictByDistance(parseInt(distance), verdict, imageUrl, parseInt(defis));
                repondre(`Verdict pour ${distance} km mis à jour avec succès.`);
            } else {
                repondre("Format incorrect. Utilisez: -verdict_speedrush distance;verdict;imageUrl;defis");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);