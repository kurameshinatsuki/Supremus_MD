const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'article',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        try {
            if (!arg || arg.length === 0) {
                // Liste des images avec leurs légendes correspondantes
                const imagesAvecLegendes = [
                    { url: 'https://telegra.ph/file/a374b96c7674a3d6378d7.jpg', legende: '*🛍️ Article 1:* Paire de Griffes.' },
                    { url: 'https://telegra.ph/file/a9c764acf27e3a235bebb.jpg', legende: '*🛍️ Article 2:* Montre.' },
                    { url: 'https://telegra.ph/file/c7dc4492631033f375259.jpg', legende: '*🛍️ Article 3:* Crystal d Amplification.' },
                    { url: 'https://telegra.ph/file/ed00b10ae16a00f91c63c.jpg', legende: '*🛍️ Article 4:* Épée Ordinaire.' },
                    { url: 'https://telegra.ph/file/41fe261053df5794bd732.jpg', legende: '*🛍️ Article 5:* Épée Violette.' },
                    { url: 'https://telegra.ph/file/e1f2aefeeee3ff8cdfb91.jpg', legende: '*🛍️ Article 6:* Dague.' },
                    { url: 'https://telegra.ph/file/49afb31ee5d5211c82e5b.jpg', legende: '*🛍️ Article 7:* Épée Terraliens.' },
                    { url: 'https://telegra.ph/file/b675e1aab798f8c98ea1e.jpg', legende: '*🛍️ Article 8:* Potion Énergétique.' },
                    { url: 'https://telegra.ph/file/9ac81c71047b7f5c10f65.jpg', legende: '*🛍️ Article 9:* Crystal de Communication.' },
                    { url: 'https://telegra.ph/file/7929c49687b484a60145f.jpg', legende: '*🛍️ Article 10:* Potion de Soins.' },
                    { url: 'https://telegra.ph/file/deae5ffc579ec14fb5642.jpg', legende: '*🛍️ Article 11:* Anneau de Charité.' },
                    { url: 'https://telegra.ph/file/39dfbbc6215220cb7665d.jpg', legende: '*🛍️ Article 12:* Anneau du Lien Éternel.' },
                    { url: 'https://telegra.ph/file/669f181d0b76c2889fd24.jpg', legende: '*🛍️ Article 13:* Fiole Empoisonnée.' },
                    { url: 'https://telegra.ph/file/86ef73e1d0d2a3d2e6585.jpg', legende: '*🛍️ Article 14:* Paire de Gants Vert.' },
                    { url: 'https://telegra.ph/file/34ed2758cc6ef60cb3f8d.jpg', legende: '*🛍️ Article 15:* Pommade Médicinale.' },
                    { url: 'https://telegra.ph/file/6fe610b5987c6fcd826dd.jpg', legende: '*🛍️ Article 16:* Hache.' },
                    { url: 'https://telegra.ph/file/da0c204b34fff75bf751f.jpg', legende: '*🛍️ Article 17:* Arc.' },
                    { url: 'https://telegra.ph/file/0996b4d4435161f804c5c.jpg', legende: '*🛍️ Article 18:* Paire d’Épée.' },
                    { url: 'https://telegra.ph/file/3db859baa39b33466125c.jpg', legende: '*🛍️ Article 19:* Épée Noire.' },
                    { url: 'https://telegra.ph/file/50b1e57ef0dceab1733bb.jpg', legende: '*🛍️ Article 20:* Lance.' },
                    { url: 'https://telegra.ph/file/3e435b8da97f5991553e4.jpg', legende: '*🛍️ Article 21:* Nunchaku Trio.' },
                    { url: 'https://telegra.ph/file/badb0bb097134299d77da.jpg', legende: '*🛍️ Article 22:* Sac à Dos.' },
                    { url: 'https://telegra.ph/file/dd3d362a9a8ac03240ad0.jpg', legende: '*🛍️ Article 23:* Lance Émeraude.' },
                    { url: 'https://telegra.ph/file/f74756044bab205f1b334.jpg', legende: '*🛍️ Article 24:* Fouet Épineux.' },
                    { url: 'https://telegra.ph/file/c72c0f9c375c1aacb17e1.jpg', legende: '*🛍️ Article 25:* Couteau A.' },
                    { url: 'https://telegra.ph/file/1acaabdfecd25e1b35e7e.jpg', legende: '*🛍️ Article 26:* Lot d’Aiguilles.' },
                    { url: 'https://telegra.ph/file/6fa3ba579b0d7bb39ab19.jpg', legende: '*🛍️ Article 27:* Lance Dorée.' },
                    { url: 'https://telegra.ph/file/ef301501877697ab4b416.jpg', legende: '*🛍️ Article 28:* Couteau Croissant.' },
                    { url: 'https://telegra.ph/file/cbe78a622c4468c6b2040.jpg', legende: '*🛍️ Article 29:* Fouet à Pointe.' },
                    { url: 'https://telegra.ph/file/2758cb958e2a5e8d79561.jpg', legende: '*🛍️ Article 30:* Fouet à Rubans.' }
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
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande :', error);
        }
    }
);