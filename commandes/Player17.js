const { zokou } = require('../framework/zokou');
const {addOrUpdateDataInPlayer17 , getDataFromPlayer17} = require('../bdd/player17');

zokou(
    {
        nomCom: 'eoza',
        categorie: 'Crps-Player'
        
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;
        const data = await getDataFromPlayer17();

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {
                const { message, lien } = data;
                const alivemsg = `${message}`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Menu erreur " + e);
                        repondre("🥵🥵 Menu erreur " + e);
                    }
                } 
                // Checking for .jpeg or .png
                else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Menu erreur " + e);
                        repondre("🥵🥵 Menu erreur " + e);
                    }
                } else {
                    repondre(alivemsg);
                }
            } else {
                if (!superUser) {
                    repondre("✨🥲 Aucune fiche trouvée pour ce joueur.");
                    return;
                }
                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou de vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {
            if (!superUser) {
                repondre("✨🛂 Réservé aux membres de la *DRPS*");
                return;
            }

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer17(texte, tlien);
            repondre('✨ Données actualisées avec succès');
        }
    });
