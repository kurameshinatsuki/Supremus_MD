/*const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInPlayer8, getDataFromPlayer8 } = require('../bdd/player8');

zokou(
    {
        nomCom: 'kunday',
        categorie: 'Crps-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        const data = await getDataFromPlayer8();

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {

                const { message, lien } = data;

                const alivemsg = `${message}`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    }
                    catch (e) {
                        console.log("🥵🥵 Menu erreur " + e);
                        repondre("🥵🥵 Menu erreur " + e);
                    }
                }
                // Checking for .jpeg or .png
                else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    }
                    catch (e) {
                        console.log("🥵🥵 Menu erreur " + e);
                        repondre("🥵🥵 Menu erreur " + e);
                    }
                }
                else {

                    repondre(alivemsg);

                }

            } else {
                if (!superUser) { repondre("✨🥲 Aucune fiche trouver pour ce joueur."); return; }

                await repondre("✨🤷‍♂️ Aucune fiche trouver pour ce joueur, pour l'enregistré;  Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapé.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return; }

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer8(texte, tlien);

            repondre('✨ données actualisé avec succès');

        }
    });
