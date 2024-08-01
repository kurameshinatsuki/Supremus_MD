const { zokou } = require('../framework/zokou');
const { insertData, getData } = require('../bdd/testee');

zokou(
    {
        nomCom: 'player1',
        categorie: 'Update'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Supposons que l'ID est passé en tant que premier argument, sinon utiliser un ID par défaut
        const id = arg[0] ? parseInt(arg[0]) : 1;

        const data = await getData(id);

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {
                const { message, lien } = data;
                const alivemsg = `${message}`;

                try {
                    if (lien.match(/\.(mp4|gif)$/i)) {
                        await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                        await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else {
                        repondre(alivemsg);
                    }
                } catch (e) {
                    console.log("🥵🥵 Menu erreur " + e);
                    repondre("🥵🥵 Menu erreur " + e);
                }
            } else {
                if (!superUser) { 
                    repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); 
                    return; 
                }

                repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format : -Cmd Message;Lien");
                repondre("✨ Attention aux informations que vous tapez.");
            }
        } else {

            if (!superUser) { 
                repondre("✨🛂 Réservé aux membres de la *DRPS*"); 
                return; 
            }

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            if (!texte || !tlien) {
                repondre("✨🤔 Format incorrect. Utilisez -Cmd Message;Lien");
                return;
            }

            await insertData(texte, tlien);
            repondre('✨ Données actualisées avec succès');
        }
    }
);

// Commande similaire pour 'player2'
zokou(
    {
        nomCom: 'player2',
        categorie: 'Update'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        const id = arg[0] ? parseInt(arg[0]) : 2;

        const data = await getData(id);

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {
                const { message, lien } = data;
                const alivemsg = `${message}`;

                try {
                    if (lien.match(/\.(mp4|gif)$/i)) {
                        await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                        await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else {
                        repondre(alivemsg);
                    }
                } catch (e) {
                    console.log("🥵🥵 Menu erreur " + e);
                    repondre("🥵🥵 Menu erreur " + e);
                }
            } else {
                if (!superUser) { 
                    repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); 
                    return; 
                }

                repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format : -Cmd Message;Lien");
                repondre("✨ Attention aux informations que vous tapez.");
            }
        } else {

            if (!superUser) { 
                repondre("✨🛂 Réservé aux membres de la *DRPS*"); 
                return; 
            }

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            if (!texte || !tlien) {
                repondre("✨🤔 Format incorrect. Utilisez -Cmd Message;Lien");
                return;
            }

            await insertData(texte, tlien);
            repondre('✨ Données actualisées avec succès');
        }
    }
);
