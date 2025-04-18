const { zokou } = require('../framework/zokou');
const { select_skins } = require('../commandes/origamy_skins');

/**
 * Envoie l'image d'un skin spécifique avec ses infos.
 */
async function envoyerSkin(dest, zk, ms, nomSkin) {
    let skinTrouve = false;
    const nomSkinUpper = nomSkin.toUpperCase();

    for (const [rang, raretes] of Object.entries(select_skins)) {
        for (const [rarete, skins] of Object.entries(raretes)) {
            if (skins[nomSkinUpper]) {
                skinTrouve = true;
                const { lien } = skins[nomSkinUpper];

                await zk.sendMessage(dest, {
                    image: { url: lien },
                    caption: `*${nomSkinUpper} | ${rang} | ${rarete}*`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!skinTrouve) {
        await zk.sendMessage(dest, { text: `*❌ Skin "${nomSkin}" introuvable.*` }, { quoted: ms });
    }
}

/**
 * Envoie la liste de tous les skins disponibles.
 */
async function envoyerListeSkins(dest, zk, ms) {
    let message = '*🎭 Liste des skins Origamy World :*\n\n';

    for (const [rang, raretes] of Object.entries(select_skins)) {
        message += `*RANG ${rang} :*\n`;
        for (const [rarete, skins] of Object.entries(raretes)) {
            message += `\n🔹 *${rarete} :*\n`;
            message += Object.keys(skins).join(', ') + '\n';
        }
        message += '\n';
    }

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
}

/**
 * Sélectionne un skin aléatoire selon les critères.
 */
async function skinAleatoire(dest, zk, ms, rang = null, rarete = null) {
    let skinsFiltres = [];

    for (const [r, raretes] of Object.entries(select_skins)) {
        if (rang && r !== rang.toUpperCase()) continue;

        for (const [rr, skins] of Object.entries(raretes)) {
            if (rarete && rr !== rarete.toUpperCase()) continue;

            for (const [nom, data] of Object.entries(skins)) {
                skinsFiltres.push({ nom, rang: r, rarete: rr, lien: data.lien });
            }
        }
    }

    if (skinsFiltres.length === 0) {
        await zk.sendMessage(dest, { text: '*Aucun skin trouvé avec ces critères.*' }, { quoted: ms });
        return;
    }

    const randomSkin = skinsFiltres[Math.floor(Math.random() * skinsFiltres.length)];

    await zk.sendMessage(dest, {
        image: { url: randomSkin.lien },
        caption: `*${randomSkin.nom} | ${randomSkin.rang} | ${randomSkin.rarete}*`
    }, { quoted: ms });
}

// Commande principale : -skins ou -skins random [rang] [rarete]
zokou(
    {
        nomCom: 'skins',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            await envoyerListeSkins(dest, zk, ms);
        } else if (arg[0].toUpperCase() === 'RANDOM') {
            const rang = arg[1] || null;
            const rarete = arg[2] || null;
            await skinAleatoire(dest, zk, ms, rang, rarete);
        } else {
            await envoyerSkin(dest, zk, ms, arg[0]);
        }
    }
);