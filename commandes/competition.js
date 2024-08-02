const { zokou } = require('../framework/zokou');
const {addOrUpdateDataInCompetition , getDataFromCompetition} = require('../bdd/competition')


zokou(
    {
        nomCom: 'nexusligue',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez la compétition actuelle, par exemple Competition1, Competition2, etc.
        const competitionName = 'competition1'; // Peut être dynamique

        const data = await getDataFromCompetition(competitionName);

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {

                const { details, lien } = data;

                const compmsg = `${details}`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                }
                else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                } else {
                    repondre(compmsg);
                }

            } else {
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Détails;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition(competitionName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'challengewheel',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez la compétition actuelle, par exemple Competition1, Competition2, etc.
        const competitionName = 'competition2'; // Peut être dynamique

        const data = await getDataFromCompetition(competitionName);

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {

                const { details, lien } = data;

                const compmsg = `${details}`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                }
                else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                } else {
                    repondre(compmsg);
                }

            } else {
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Détails;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition(competitionName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'crpscup',
        categorie: 'Competition'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez la compétition actuelle, par exemple Competition1, Competition2, etc.
        const competitionName = 'competition3'; // Peut être dynamique

        const data = await getDataFromCompetition(competitionName);

        if (!arg || !arg[0] || arg.join('') === '') {

            if (data) {

                const { details, lien } = data;

                const compmsg = `${details}`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                }
                else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: compmsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Compétition erreur " + e);
                        repondre("🥵🥵 Compétition erreur " + e);
                    }
                } else {
                    repondre(compmsg);
                }

            } else {
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour cette compétition."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour cette compétition, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Détails;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInCompetition(competitionName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });
