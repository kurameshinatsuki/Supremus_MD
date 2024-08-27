const { zokou } = require('../framework/zokou');
const { creerTablePlayer, addOrUpdateDataInPlayer, getDataFromPlayer } = require('../bdd/player'); // Adapté pour n'importe quel joueur

zokou(
    {
        nomCom: 'john1',
        categorie: 'Test-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel de manière dynamique si possible
        const playerName = 'john1'; // Peut être dynamique en fonction de la commande

        try {
            const data = await getDataFromPlayer(playerName);

            if (!arg || !arg[0] || arg.join('') === '') {

                if (data) {
                    const { message, lien } = data;
                    const alivemsg = `${message}`;

                    if (/\.(mp4|gif)$/i.test(lien)) {
                        await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else if (/\.(jpeg|png|jpg)$/i.test(lien)) {
                        await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else {
                        repondre(alivemsg);
                    }

                } else {
                    if (!superUser) { 
                        repondre("✨🥲 Aucune fiche trouvée pour ce joueur.");
                    } else {
                        repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format : -Cmd Message;Lien");
                        repondre("✨ Attention aux infos que vous tapez.");
                    }
                }
            } else {
                if (!superUser) { 
                    repondre("✨🛂 Réservé aux membres de la *DRPS*");
                } else {
                    const [texte, tlien] = arg.join(' ').split(';');

                    if (texte && tlien) {
                        await addOrUpdateDataInPlayer(playerName, texte, tlien);
                        repondre('✨ Données actualisées avec succès');
                    } else {
                        repondre("✨ Format incorrect. Veuillez utiliser: -Cmd Message;Lien");
                    }
                }
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande : " + error);
            repondre("🥵 Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer plus tard.");
        }
    });

zokou(
    {
        nomCom: 'john2',
        categorie: 'Test-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel de manière dynamique si possible
        const playerName = 'john2'; // Peut être dynamique en fonction de la commande

        try {
            const data = await getDataFromPlayer(playerName);

            if (!arg || !arg[0] || arg.join('') === '') {

                if (data) {
                    const { message, lien } = data;
                    const alivemsg = `${message}`;

                    if (/\.(mp4|gif)$/i.test(lien)) {
                        await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else if (/\.(jpeg|png|jpg)$/i.test(lien)) {
                        await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else {
                        repondre(alivemsg);
                    }

                } else {
                    if (!superUser) { 
                        repondre("✨🥲 Aucune fiche trouvée pour ce joueur.");
                    } else {
                        repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format : -Cmd Message;Lien");
                        repondre("✨ Attention aux infos que vous tapez.");
                    }
                }
            } else {
                if (!superUser) { 
                    repondre("✨🛂 Réservé aux membres de la *DRPS*");
                } else {
                    const [texte, tlien] = arg.join(' ').split(';');

                    if (texte && tlien) {
                        await addOrUpdateDataInPlayer(playerName, texte, tlien);
                        repondre('✨ Données actualisées avec succès');
                    } else {
                        repondre("✨ Format incorrect. Veuillez utiliser: -Cmd Message;Lien");
                    }
                }
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande : " + error);
            repondre("🥵 Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer plus tard.");
        }
    });