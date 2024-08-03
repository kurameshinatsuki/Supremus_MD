const { zokou } = require('../framework/zokou');


zokou(
    {
        nomCom: 'testrule',
        categorie: 'crps'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            // Liste des images avec leurs légendes correspondantes
            const imagesAvecLegendes = [
                {
                    url: 'https://telegra.ph/file/ecdf5c700e8c15a3dfbd3.jpg',
                    legende: 'Article 1: Règles de base pour CRPS Fight.'
                },
                {
                    url: 'https://telegra.ph/file/2a0c4b2101a38deb9d6a6.jpg',
                    legende: 'Article 2: Compétences avancées et stratégie.'
                },
                {
                    url: 'https://telegra.ph/file/d9f9852ede777e5fc5c64.jpg',
                    legende: 'Article 3: Techniques spéciales et pouvoirs.'
                }
            ];

            // Envoi des images avec légendes
            for (const image of imagesAvecLegendes) {
                await zk.sendMessage(
                    dest,
                    {
                        image: { url: image.url },
                        caption: image.legende
                    },
                    { quoted: ms }
                );
            }
        }
    }
);
