const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInCompetition, getDataFromCompetition } = require('../bdd/competition'); // Adapté pour n'importe quel joueur

zokou(
    {
        nomCom: 'nexusligue',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const competitionName = 'competition1'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromCompetition(competitionName);

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
                if (!superUser) { repondre("✨🥲 Aucun enregistrement trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucun enregistrement trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition (competitionName, texte, tlien);

            repondre('✨ Compétition enregistré avec succès');

        }
    });

zokou(
    {
        nomCom: 'challengewheel',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const competitionName = 'competition2'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromCompetition(competitionName);

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
                if (!superUser) { repondre("✨🥲 Aucun enregistrement trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucun enregistrement trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition (competitionName, texte, tlien);

            repondre('✨ Compétition enregistré avec succès');

        }
    });

zokou(
    {
        nomCom: 'crpscup',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const competitionName = 'competition3'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromCompetition(competitionName);

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
                if (!superUser) { repondre("✨🥲 Aucun enregistrement trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucun enregistrement trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition (competitionName, texte, tlien);

            repondre('✨ Compétition enregistré avec succès');

        }
    });
