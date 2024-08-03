const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInPlayer, getDataFromPlayer } = require('../bdd/player'); // Adapté pour n'importe quel joueur

zokou(
    {
        nomCom: 'draken',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player11'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'samuel',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player12'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'tenno',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player13'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'queen',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player14'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'viviane',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player15'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'angel',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player16'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'eoza',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player17'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

zokou(
    {
        nomCom: 'dazai',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player18'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });

/*zokou(
    {
        nomCom: 'j19',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player19'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });*/

zokou(
    {
        nomCom: 'sept',
        categorie: 'Id-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        // Déterminez le joueur actuel, par exemple Player1, Player2, etc.
        const playerName = 'player20'; // Peut être dynamique en fonction de la commande

        const data = await getDataFromPlayer(playerName);

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
                if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return };

                await repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur, pour l'enregistrer; Entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte: -Cmd Message;Lien");
                repondre("✨ Attention aux infos que vous tapez.");
            }
        } else {

            if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return };

            const texte = arg.join(' ').split(';')[0];
            const tlien = arg.join(' ').split(';')[1];

            await addOrUpdateDataInPlayer(playerName, texte, tlien);

            repondre('✨ données actualisées avec succès');

        }
    });
