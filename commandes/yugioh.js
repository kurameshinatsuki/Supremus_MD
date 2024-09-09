const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'yugi_deck',
        categorie: 'Yu-Gi-Oh'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, ms } = commandeOptions;

        try {
            // Cartes de compétences
            const cartesCompetences = [
                { url: 'https://telegra.ph/file/e67a124967e15ad0959a0.jpg', legende: '*👤 Compétence:* Pioche de la Destinée' },
                { url: 'https://telegra.ph/file/eca053745d516a0f11147.jpg', legende: '*👤 Compétence:* Pioche Final' }
            ];

            // Cartes du deck principal
            const cartesDeckPrincipal = [
                { url: 'https://telegra.ph/file/d6ce5d74b57ef38dca203.jpg', legende: '*🀄 Carte:* Magicien du Chaos Sombre' },
                { url: 'https://telegra.ph/file/77d6d5a2d5c94b23d9411.jpg', legende: '*🀄 Carte:* Soldat du Lustre Noir' },
                { url: 'https://telegra.ph/file/859d6f0716108cacbf98c.jpg', legende: '*🀄 Carte:* Gaïa le Chevalier Implacable' },
                { url: 'https://telegra.ph/file/9973732bd8ee761ba4faa.jpg', legende: '*🀄 Carte:* Magicien Sombre' },
                { url: 'https://telegra.ph/file/5179cdd76c579fa487ff9.jpg', legende: '*🀄 Carte:* Crâne Invoqué ×2' },
                { url: 'https://telegra.ph/file/ae20c3baff1cc94571ac3.jpg', legende: '*🀄 Carte:* Kaiser Insolent' },
                { url: 'https://telegra.ph/file/afa6a7e784dc4ab36d87d.jpg', legende: '*🀄 Carte:* Malédiction du Dragon' },
                { url: 'https://telegra.ph/file/e0fd883c12ec658ff8576.jpg', legende: '*🀄 Carte:* Tortue Catapulte' },
                { url: 'https://telegra.ph/file/40e76694d72feae23c105.jpg', legende: '*🀄 Carte:* Dragon Ailé, Gardien de la Forteresse N°1' },
                { url: 'https://telegra.ph/file/6dc335fa40747459619b5.jpg', legende: '*🀄 Carte:* Dragon Koumori' },
                { url: 'https://telegra.ph/file/6e500e5f00336d71c896e.jpg', legende: '*🀄 Carte:* Elfe Mystique' },
                { url: 'https://telegra.ph/file/4e05524ebdb8459ca4042.jpg', legende: '*🀄 Carte:* Gardien Celte' },
                { url: 'https://telegra.ph/file/ad11d78b6bc195f021218.jpg', legende: '*🀄 Carte:* Cimetiére de Mammouth' },
                { url: 'https://telegra.ph/file/c8b4f88634b354244253e.jpg', legende: '*🀄 Carte:* Soldat Géant de Pierre' },
                { url: 'https://telegra.ph/file/a3ff47ea464257753223f.jpg', legende: '*🀄 Carte:* Kuriboh' },
                { url: 'https://telegra.ph/file/13f19915761924fd7b9ee.jpg', legende: '*🀄 Carte:* Lutin Sauvage' },
                { url: 'https://telegra.ph/file/55d777d21cb91e1784245.jpg', legende: '*🀄 Carte:* Guerrier Castor' },
                { url: 'https://telegra.ph/file/96cd570c7610322a1abac.jpg', legende: '*🀄 Carte:* Griffore' },
                { url: 'https://telegra.ph/file/1be0412389ab8fdf3b3f4.jpg', legende: '*🀄 Carte:* Croc Argenté' },
                { url: 'https://telegra.ph/file/99a7039b9f2b4b2fbd871.jpg', legende: '*🀄 Carte:* Épée de Révélation de la Lumière' },
                { url: 'https://telegra.ph/file/2a4b6ca6108f13f070289.jpg', legende: '*🀄 Carte:* Flèche Brise-Sort' },
                { url: 'https://telegra.ph/file/04be931f0645a9658c981.jpg', legende: '*🀄 Carte:* Libération d\'Âme' },
                { url: 'https://telegra.ph/file/24c48305e57060c89bc2e.jpg', legende: '*🀄 Carte:* Livre d\'Arts Secrets' },
                { url: 'https://telegra.ph/file/e5d483b66dccaaf13566d.jpg', legende: '*🀄 Carte:* Multiplicateur' },
                { url: 'https://telegra.ph/file/7ca6fd9ee22a0101f0cfe.jpg', legende: '*🀄 Carte:* Cercle Envoûtant' },
                { url: 'https://telegra.ph/file/03d5ba3df3dedb903b5a1.jpg', legende: '*🀄 Carte:* Chapeaux Magiques' },
                { url: 'https://telegra.ph/file/58f2f669fee4f7310cb60.jpg', legende: '*🀄 Carte:* Force de Miroir' },
                { url: 'https://telegra.ph/file/bc8326dbd0edec31e57a8.jpg', legende: '*🀄 Carte:* L\'œil de la Vérité' },
                { url: 'https://telegra.ph/file/9aa2c190813fc689845ef.jpg', legende: '*🀄 Carte:* Transfert' },
                { url: 'https://telegra.ph/file/2b307544b8fa310171f5c.jpg', legende: '*🀄 Carte:* Rituel du Lustre Noir' }
            ];

            // Cartes de l'extra deck
            const cartesExtraDeck = [
                { url: 'https://telegra.ph/file/689c884be6691795fdcf7.jpg', legende: '*🎴 Carte:* Gaia le Dragon Champion' }
            ];

            // Mélange aléatoire des cartes du deck principal
            const cartesDeckPrincipalMelangees = cartesDeckPrincipal.sort(() => Math.random() - 0.5);

            // Combinaison de toutes les cartes pour l'envoi
            const toutesLesCartes = [...cartesCompetences, ...cartesDeckPrincipalMelangees, ...cartesExtraDeck];

            // Envoi des images avec légendes
            for (const carte of toutesLesCartes) {
                await zk.sendMessage(
                    dest,
                    {
                        image: { url: carte.url },
                        caption: carte.legende
                    },
                    { quoted: ms }
                );
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du deck :', error);
        }
    }
);