const { zokou } = require('../framework/zokou');
const { creerTablePlayer, addOrUpdateDataInTestee, getDataFromTestee } = require('../bdd/testee'); // Remplace par le chemin correct

zokou(
    {
        nomCom: 'john',  // Remplace 'playercard' par un nom générique de commande
        categorie: 'Update'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Vérifie si un nom de joueur est passé en argument
        if (!arg || !arg[0]) {
            repondre("✨ Veuillez spécifier un joueur.");
            return;
        }

        const playerName = arg[0].toLowerCase();  // Nom du joueur (par exemple, 'john')
        const playerTable = `player_${playerName}`;  // Nom de la table dynamique

        // Crée la table pour le joueur si elle n'existe pas déjà
        await creerTablePlayer(playerTable);

        const data = await getDataFromTestee(playerTable);

        if (arg.length === 1) {  // Aucune donnée supplémentaire, donc on affiche la fiche du joueur
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
                // Vérifie pour .jpeg ou .png
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
                if (!superUser) {
                    repondre("✨🥲 Aucune fiche trouvée pour ce joueur.");
                    return;
                }

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {  // Si des arguments supplémentaires sont fournis, on met à jour les données
            if (!superUser) {
                repondre("✨🛂 Réservé aux membres de la *DRPS*");
                return;
            }

            const texte = arg.slice(1).join(' ').split(';')[0];
            const tlien = arg.slice(1).join(' ').split(';')[1];

            await addOrUpdateDataInTestee(playerTable, texte, tlien);

            repondre('✨ Données mises à jour avec succès');
        }
    });

zokou(
    {
        nomCom: 'tenno',  // Remplace 'playercard' par un nom générique de commande
        categorie: 'Update'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Vérifie si un nom de joueur est passé en argument
        if (!arg || !arg[0]) {
            repondre("✨ Veuillez spécifier un joueur.");
            return;
        }

        const playerName = arg[0].toLowerCase();  // Nom du joueur (par exemple, 'john')
        const playerTable = `player_${playerName}`;  // Nom de la table dynamique

        // Crée la table pour le joueur si elle n'existe pas déjà
        await creerTablePlayer(playerTable);

        const data = await getDataFromTestee(playerTable);

        if (arg.length === 1) {  // Aucune donnée supplémentaire, donc on affiche la fiche du joueur
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
                // Vérifie pour .jpeg ou .png
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
                if (!superUser) {
                    repondre("✨🥲 Aucune fiche trouvée pour ce joueur.");
                    return;
                }

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {  // Si des arguments supplémentaires sont fournis, on met à jour les données
            if (!superUser) {
                repondre("✨🛂 Réservé aux membres de la *DRPS*");
                return;
            }

            const texte = arg.slice(1).join(' ').split(';')[0];
            const tlien = arg.slice(1).join(' ').split(';')[1];

            await addOrUpdateDataInTestee(playerTable, texte, tlien);

            repondre('✨ Données mises à jour avec succès');
        }
    });

  
