const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'echange',
        categorie: 'Transact-Zone'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            repondre("✨ Saisis le montant que tu souhaites échanger, par exemple: -echange 1000💎 contre 🧭.");
            return;
        }

        // Extraction du montant et de la monnaie
        const match = arg.match(/(\d+)(💎|🧭)/);
        if (!match) {
            repondre("✨ Forme incorrecte. Utilise le format: -echange [montant][monnaie] contre [autre monnaie].");
            return;
        }

        const montant = parseInt(match[1], 10);
        const monnaie = match[2];

        if (monnaie === '💎') {
            const convertedAmount = (montant / 1000) * 10000; // Conversion de 💎 vers 🧭
            repondre(`✨ Tu as échangé ${montant}💎 contre ${convertedAmount}🧭.`);
        } else if (monnaie === '🧭') {
            const convertedAmount = (montant / 10000) * 1000; // Conversion de 🧭 vers 💎
            repondre(`✨ Tu as échangé ${montant}🧭 contre ${convertedAmount}💎.`);
        } else {
            repondre("✨ Monnaie non reconnue. Utilise '💎' ou '🧭'.");
        }
    }
);
