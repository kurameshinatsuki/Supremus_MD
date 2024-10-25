const { zokou } = require('../framework/zokou');
const { characters_rang_c } = require('../commandes/catalogue_abm')

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