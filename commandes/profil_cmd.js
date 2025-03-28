/*const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/profil_bdd');

zokou(
    {
        nomCom: 'profil',
        categorie: 'CENTRAL'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        const emojimap = {
                 'Louis': 'LOUIS', 
                 'Tenno': 'TENNO',    
                 'Nelliel': 'NELLIEL',    
                 'Aizen': 'AIZEN'    
            // Ajouter d'autres joueurs et identifiant ici
        };

        try {
            const message = arg.join(' ');

            // Cherche si le message contient un identifiant
            let found = false;
            for (const [emoji, motCle] of Object.entries(emojimap)) {
                if (message.includes(emoji)) {
                    found = true;

                    // Récupérer la fiche pour cet identifiant 
                    const verdictData = await getVerdictByKeyword(motCle);
                    if (verdictData) {
                        const { verdict, image_url } = verdictData;
                        if (image_url) {
                            await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                        } else {
                            repondre(verdict);
                        }
                    } else {
                        repondre(`*🛃 Aucun profile trouvée pour ce joueur.*`);
                    }
                    break;
                }
            }

            if (!found) {
                repondre("Profile gelé ou en cour d'actualisation.");
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);


zokou(
    {
        nomCom: 'update',
        categorie: 'CENTRAL',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée à la *DRPN*.");
        }

        try {
            const [motCle, verdict, imageUrl] = arg.join(' ').split(';');

            if (motCle && verdict) {
                await updateVerdict(motCle, verdict, imageUrl);
                repondre(`_✅ Le profile du joueur *${motCle}* à été mis à jour avec succès._`);
            } else {
                repondre("*⚠️ Format incorrect.*\n\n *Utilisez:* -update Pseudo;Fiche;imageProfil");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);*/