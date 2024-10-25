const { zokou } = require('../framework/zokou');
const { characters_rang_c } = require('../commandes/catalogue_abm')

// Fonction pour envoyer la carte du personnage
async function envoyerCarte(dest, zk, ms, personnage) {
    let personnageTrouve = false;

    // Parcourir tous les univers pour trouver le personnage
    for (const [verse, personnages] of Object.entries(characters_rang_c)) {
        const personnageInfo = personnages[personnage.toUpperCase()];

        if (personnageInfo) {
            personnageTrouve = true;
            const { lien } = personnageInfo;
            zk.sendMessage(dest, { image: { url: lien }, caption: `${personnage} (${verse})` }, { quoted: ms });
            break;  // Si le personnage est trouvé, on arrête la boucle
        }
    }

    // Si le personnage n'a pas été trouvé dans aucun univers
    if (!personnageTrouve) {
        zk.sendMessage(dest, { text: `Personnage ${personnage} non trouvé dans aucun univers.` }, { quoted: ms });
    }
}

// Commande générale pour tous les univers
zokou(
    {
        nomCom: 'heroes',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg && arg.length === 0) {
            zk.sendMessage(dest, { text: 'Veuillez spécifier un personnage.' }, { quoted: ms });
        } else {
            const personnage = arg[0];
            await envoyerCarte(dest, zk, ms, personnage);
        }
    }
);