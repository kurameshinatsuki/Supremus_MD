const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInPlayer8, getDataFromPlayer8 } = require('../bdd/playerbdd');
const { getDataFromPlayer9, addOrUpdateDataInPlayer9 } = require('../bdd/playerbdd');
const { getDataFromPlayer10, addOrUpdateDataInPlayer10 } = require('../bdd/playerbdd');

zokou(
    {
        nomCom: 'kundai',
        categorie: 'Crps-Player'
    },
    async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        if (!arg || !arg[0] || arg.join('') === '') {
            repondre("✨ Entrez une commande valide.");
            return;
        }

        const command = arg[0].toLowerCase(); // Prend la première partie de la commande
        const remainingArgs = arg.slice(1); // Prend le reste des arguments

        switch (command) {
            case 'player8':
                await handlePlayer8Commands(remainingArgs, dest, zk, ms, repondre, superUser);
                break;

            case 'player9':
                await handlePlayer9Commands(remainingArgs, dest, zk, ms, repondre, superUser);
                break;

            case 'player10':
                await handlePlayer10Commands(remainingArgs, dest, zk, ms, repondre, superUser);
                break;

            default:
                repondre("✨ Commande non reconnue. Veuillez réessayer.");
        }
    }
);

async function handlePlayer8Commands(args, dest, zk, ms, repondre, superUser) {
    const data = await getDataFromPlayer8();

    if (!args || !args[0] || args.join('') === '') {
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
            } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
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
            if (!superUser) { repondre("✨🥲 Aucune fiche trouvée pour ce joueur."); return; }
            repondre("✨🤷‍♂️ Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce contexte : -Cmd Message;Lien");
            repondre("✨ Attention aux infos que vous tapez.");
        }
    } else {
        if (!superUser) { repondre("✨🛂 Réservé aux membres de la *DRPS*"); return; }
        const texte = args.join(' ').split(';')[0];
        const tlien = args.join(' ').split(';')[1];
        await addOrUpdateDataInPlayer8(texte, tlien);
        repondre('✨ Données actualisées avec succès');
    }
}

async function handlePlayer9Commands(args, dest, zk, ms, repondre, superUser) {
    const data = await getDataFromPlayer9();

    // Logique similaire pour player9
    // Ajoute la logique spécifique pour player9 ici
}

async function handlePlayer10Commands(args, dest, zk, ms, repondre, superUser) {
    const data = await getDataFromPlayer10();

    // Logique similaire pour player10
    // Ajoute la logique spécifique pour player10 ici
                                                                   }
