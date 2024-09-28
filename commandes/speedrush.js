const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/speedrush');

zokou(
    {
        nomCom: 'control_westside',
        categorie: 'SPEED-RUSH'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        const emojimap = {
    '1km': 'defi1',    // Foncez à travers les rues étroites sans percuter les véhicules garés.
    '3km': 'defi2',    // Effectuer un drift dans un virage à 110° sur la droite sans ralentir.
    '4km': 'defi3',    // Évitez deux voitures en un seul tour.
    '5km': 'defi4',    // Réussissez un saut de 5 mètres sur une rampe tout en contrôlant l'atterrissage.
    '6km': 'defi5',    // Maintenez une vitesse supérieure à 180 km/h pendant trois virages sans ralentir.
    '7km': 'defi6',    // Prenez deux virages sans perdre de vitesse (minimum 140 km/h).
    '9km': 'defi7',    // Traversez un tronçon de route étroit de 3 mètres sans toucher les bords.
    '10km': 'defi8',   // Accélérez de 0 à 200 km/h sur une montée.
    '12km': 'defi9',   // Évitez un obstacle soudain à une vitesse supérieure à 160 km/h.
    '14km': 'defi10',  // Descendez une pente de 100 mètres tout en maintenant une vitesse supérieure à 180 km/h.
    '16km': 'defi11',  // Dépassez un adversaire dans un espace restreint sans heurter les murs.
    '18km': 'defi12',  // Réussissez un drift de 5 mètres dans l'obscurité tout en évitant les obstacles.
    '20km': 'defi13',  // Passez de 50 à 200 km/h en moins de 4 secondes dans un tunnel.
    '22km': 'defi14',  // Atteignez une vitesse de 250 km/h avant de franchir la ligne d'arrivée.
    '25km': 'defi15',  // Réussissez un drift de 6 mètres autour du stade sans perdre de vitesse.
    '28km': 'defi16',   // Complétez le circuit en moins de 3 tours tout en maintenant une vitesse supérieure à 200 km/h.
            'circuit': 'Westside Circuit'
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
                        repondre(`*✅ NEXT...*\n⚠️ Veillez n'avoir sautée aucune section dans le cas contraire vous risquez des pénalités.`);
                    }
                    break;
                }
            }

            if (!found) {
                repondre("Aucun verdict défini pour '${motCle}'.");
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);

zokou(
    {
        nomCom: 'westside_master',
        categorie: 'DRPN',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée aux *⚖️SPEED MASTER🪀*.");
        }

        try {
            const [motCle, verdict, imageUrl, etat] = arg.join(' ').split(';');

            if (motCle && verdict && etat) {
                await updateVerdict(motCle, verdict, imageUrl, etat);
                repondre(`Verdict pour '${motCle}' mis à jour avec succès.`);
            } else {
                repondre("Format incorrect. Utilisez: -${nomCom} motCle;verdict;imageUrl;normal");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);