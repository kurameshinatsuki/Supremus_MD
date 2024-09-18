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
            let cartesDeckPrincipal = [
                { url: 'https://telegra.ph/file/d6ce5d74b57ef38dca203.jpg', legende: '*🀄 Carte:* Magicien du Chaos Sombre' },
                { url: 'https://telegra.ph/file/77d6d5a2d5c94b23d9411.jpg', legende: '*🀄 Carte:* Soldat du Lustre Noir' },
                { url: 'https://telegra.ph/file/859d6f0716108cacbf98c.jpg', legende: '*🀄 Carte:* Gaïa le Chevalier Implacable' },
                { url: 'https://telegra.ph/file/9973732bd8ee761ba4faa.jpg', legende: '*🀄 Carte:* Magicien Sombre' },
                { url: 'https://telegra.ph/file/5179cdd76c579fa487ff9.jpg', legende: '*🀄 Carte:* Crâne Invoqué ×2' }, // Carte en 2 exemplaires
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

            // Dupliquer les cartes en fonction des exemplaires
            cartesDeckPrincipal = cartesDeckPrincipal.flatMap(carte => {
                const exemplaires = carte.legende.includes('×2') ? 2 : 1;
                return Array(exemplaires).fill({ ...carte, legende: carte.legende.replace(/×\d/, '') });
            });

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

zokou(
    {
        nomCom: 'kaiba_deck',
        categorie: 'Yu-Gi-Oh'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, ms } = commandeOptions;

        try {
            // Cartes de compétences
            const cartesCompetences = [
                { url: 'https://telegra.ph/file/cccecd9a8101848fa137c.jpg', legende: '*👤 Compétence:* Raclée' },
                { url: 'https://telegra.ph/file/41eccbf68a1be8de1b902.jpg', legende: '*👤 Compétence:* Infection Virale' }
            ];

            // Cartes du deck principal
            let cartesDeckPrincipal = [
                { url: 'https://telegra.ph/file/210178bbb4cb8166ea9b1.jpg', legende: '*🀄 Carte:* Obelisk, le Tourmenteur' },
                { url: 'https://telegra.ph/file/4fc61987d1a79c77cb5cd.jpg', legende: '*🀄 Carte:* Dragon Blanc aux Yeux Bleus ×3' }, // Carte en 3 exemplaires
                { url: 'https://telegra.ph/file/63986e8a3e2afefff54d7.jpg', legende: '*🀄 Carte:* Dragon Étincelant N°2' },
                { url: 'https://telegra.ph/file/4b7381e4461b731184c41.jpg', legende: '*🀄 Carte:* Planeur du Kaiser' },
                { url: 'https://telegra.ph/file/c14bbd4ba8ddb8fde4cc4.jpg', legende: '*🀄 Carte:* Dragon Extra-Dimensionnel' },
                { url: 'https://telegra.ph/file/4841535df72b590e870ec.jpg', legende: '*🀄 Carte:* Seigneur Vampire' },
                { url: 'https://telegra.ph/file/c59ed71749b22cf847633.jpg', legende: '*🀄 Carte:* Dragon Étincelant' },
                { url: 'https://telegra.ph/file/a52adf012d1fba5ccddc3.jpg', legende: '*🀄 Carte:* Kaiser Hyppocampe' },
                { url: 'https://telegra.ph/file/eb2d42fbc34dad339fad5.jpg', legende: '*🀄 Carte:* La Jinn le Génie Mystique de la Lampe' },
                { url: 'https://telegra.ph/file/b506d8ed93942e22c2f05.jpg', legende: '*🀄 Carte:* Lance Dragon' },
                { url: 'https://telegra.ph/file/6018e26ce1f07e81423d9.jpg', legende: '*🀄 Carte:* Maraudeur Vorse' },
                { url: 'https://telegra.ph/file/1c7c781e25d17beba5cbb.jpg', legende: '*🀄 Carte:* Seigneur des D' },
                { url: 'https://telegra.ph/file/7527d98bc6ff8b3b49e1b.jpg', legende: '*🀄 Carte:* Tank De Métal Z' },
                { url: 'https://telegra.ph/file/1623ac3a5ea1779642dd3.jpg', legende: '*🀄 Carte:* Tête de Canon X' },
                { url: 'https://telegra.ph/file/b5da4690278110cc0efb7.jpg', legende: '*🀄 Carte:* Tête de Dragon Y' },
                { url: 'https://telegra.ph/file/235453cd0d0d873f9e5dd.jpg', legende: '*🀄 Carte:* Kaibaman' },
                { url: 'https://telegra.ph/file/4d4371e954c5b40639fc6.jpg', legende: '*🀄 Carte:* Peten le Clown des Ténèbres' },
                { url: 'https://telegra.ph/file/ada9c91526fc55d3a78a0.jpg', legende: '*🀄 Carte:* CyberStein' },
                { url: 'https://telegra.ph/file/6e9b17851b0b2c7889e8e.jpg', legende: '*🀄 Carte:* Anciens Règlements' },
                { url: 'https://telegra.ph/file/5a7d5ec5981071c0ef129.jpg', legende: '*🀄 Carte:* Bourse des Ames' },
                { url: 'https://telegra.ph/file/5a714cc839f2ef6c758e9.jpg', legende: '*🀄 Carte:* Mégamorphe' },
                { url: 'https://telegra.ph/file/d68042259e49920baca1e.jpg', legende: '*🀄 Carte:* Flot Rugissant de Destruction' },
                { url: 'https://telegra.ph/file/1f7b8a6ec55986a3d0a1a.jpg', legende: '*🀄 Carte:* Polymérization' },
                { url: 'https://telegra.ph/file/3cc55ecd3f993c09f62d4.jpg', legende: '*🀄 Carte:* Monster Reborn' },
                { url: 'https://telegra.ph/file/ca07504762607d6406114.jpg', legende: '*🀄 Carte:* Appel de l\'Être Hanté' },
                { url: 'https://telegra.ph/file/44559014d5c155c5adfae.jpg', legende: '*🀄 Carte:* Chaîne Démoniaque' },
                { url: 'https://telegra.ph/file/766ac8cf43b905f0b7355.jpg', legende: '*🀄 Carte:* Virus Démoniaque de Destruction de Deck' },
                { url: 'https://telegra.ph/file/2eab305c79ac208917b9c.jpg', legende: '*🀄 Carte:* Sortilège de l\'Ombre' }
            ];

            // Dupliquer les cartes en fonction des exemplaires
            cartesDeckPrincipal = cartesDeckPrincipal.flatMap(carte => {
                const exemplaires = carte.legende.includes('×3') ? 3 : carte.legende.includes('×2') ? 2 : 1;
                return Array(exemplaires).fill({ ...carte, legende: carte.legende.replace(/×\d/, '') });
            });

            // Cartes de l'extra deck
            const cartesExtraDeck = [
                { url: 'https://telegra.ph/file/316131cf79a8fa208afed.jpg', legende: '*🎴 Carte:* Dragon Ultime aux Yeux Bleus' },
                { url: 'https://telegra.ph/file/d21c113ab50fcbacf5af1.jpg', legende: '*🎴 Carte:* Canon Dragon XYZ' },
                { url: 'https://telegra.ph/file/620a2a6c83f3f1bdf5f0d.jpg', legende: '*🎴 Carte:* Canon Dragon XY' },
                { url: 'https://telegra.ph/file/01bfd68e88876677bcb59.jpg', legende: '*🎴 Carte:* Canon Tank XZ' },
                { url: 'https://telegra.ph/file/d15e9ff45b1a507c7d890.jpg', legende: '*🎴 Carte:* Dragon Tank YZ' }
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

zokou(
    {
        nomCom: 'joey_deck',
        categorie: 'Yu-Gi-Oh'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, ms } = commandeOptions;

        try {
            // Cartes de compétences
            const cartesCompetences = [
                { url: 'https://telegra.ph/file/9c1027d5d93b587e0e3dd.jpg', legende: '*👤 Compétence:* Dernier Pari' }
            ];

            // Cartes du deck principal
            let cartesDeckPrincipal = [
                { url: 'https://telegra.ph/file/c900d11a59605f841ff74.jpg', legende: '*🀄 Carte:* Gilford, l\'Éclair' },
                { url: 'https://telegra.ph/file/3ba24e0e003bf82bcf168.jpg', legende: '*🀄 Carte:* Dragon Noir aux Yeux Rouges ×2' }, // Carte en 2 exemplaires
                { url: 'https://telegra.ph/file/5179cdd76c579fa487ff9.jpg', legende: '*🀄 Carte:* Crâne Invoqué' },
                { url: 'https://telegra.ph/file/caa411a36c0e1ab0a2df9.jpg', legende: '*🀄 Carte:* Dragon Météore' },
                { url: 'https://telegra.ph/file/8bbcc944bcfa91c0f4fd7.jpg', legende: '*🀄 Carte:* Gearfried le Chevalier de Fer' },
                { url: 'https://telegra.ph/file/839bd9a6a2c29b3462e6f.jpg', legende: '*🀄 Carte:* Axe Raider' },
                { url: 'https://telegra.ph/file/18729d378e533b6186696.jpg', legende: '*🀄 Carte:* Guerrier Panthère' },
                { url: 'https://telegra.ph/file/d2bc2cea70cfe98fca608.jpg', legende: '*🀄 Carte:* Guerrier Roquette' },
                { url: 'https://telegra.ph/file/199a1f8b541caea753756.jpg', legende: '*🀄 Carte:* Masaki le Spadassin Légendaire' },
                { url: 'https://telegra.ph/file/b14f157c9158b8c8d15cc.jpg', legende: '*🀄 Carte:* Petit Guerrier Allié' },
                { url: 'https://telegra.ph/file/fdac66927baddcc9cb008.jpg', legende: '*🀄 Carte:* Spadassin des Flammes Bleues' },
                { url: 'https://telegra.ph/file/4fa91a3eb8d3c191c6ce3.jpg', legende: '*🀄 Carte:* Troupe d\'Assaut Gobeline' },
                { url: 'https://telegra.ph/file/099bc38d06e16f5a1c7aa.jpg', legende: '*🀄 Carte:* Bébé Dragon ×2' },
                { url: 'https://telegra.ph/file/3483ac08fc7b3802ebc6b.jpg', legende: '*🀄 Carte:* Glaive de l\'Alligator' },
                { url: 'https://telegra.ph/file/3234439f6962f469c1ea6.jpg', legende: '*🀄 Carte:* Compagnon du Spadassin De Landstar' },
                { url: 'https://telegra.ph/file/abddffa69fa0b13b819cc.jpg', legende: '*🀄 Carte:* Le Spadassin de Landstar' },
                { url: 'https://telegra.ph/file/832d2a391cc3946d47b7d.jpg', legende: '*🀄 Carte:* Manipulateur de Flammes' },
                { url: 'https://telegra.ph/file/48e5c85175ad20bc1b1b6.jpg', legende: '*🀄 Carte:* Magicien du Temps' },
                { url: 'https://telegra.ph/file/9d2bebb58e84f976cf79b.jpg', legende: '*🀄 Carte:* Copiechat' },
                { url: 'https://telegra.ph/file/1a059b2ad82a1e0889f4b.jpg', legende: '*🀄 Carte:* Bouclier et Épée' },
                { url: 'https://telegra.ph/file/a0ac76122e68e541739ed.jpg', legende: '*🀄 Carte:* Polymérization' },
                { url: 'https://telegra.ph/file/36085afb3ef6c9bdc4495.jpg', legende: '*🀄 Carte:* Trappe Sans Fond' },
                { url: 'https://telegra.ph/file/8293244ec9283a18139b6.jpg', legende: '*🀄 Carte:* Le Guerrier Réincarné' },
                { url: 'https://telegra.ph/file/a0a31f8b9e1129b987839.jpg', legende: '*🀄 Carte:* Renfort de l\'Armée' },
                { url: 'https://telegra.ph/file/f7a1d72585146a9e2816b.jpg', legende: '*🀄 Carte:* Bouclier Magique de Bras' },
                { url: 'https://telegra.ph/file/cddfe279fcc7b247fce49.jpg', legende: '*🀄 Carte:* Kunai avec Chaîne' },
                { url: 'https://telegra.ph/file/ed9a32765c6656af4134f.jpg', legende: '*🀄 Carte:* Profanateur de Tombes' },
                { url: 'https://telegra.ph/file/09c6228c7694cd0da58d0.jpg', legende: '*🀄 Carte:* Trappe Sans Fond' },
                { url: 'https://telegra.ph/file/a26bf166d9f61782c1552.jpg', legende: '*🀄 Carte:* Dé-Crâne' }
            ];

            // Dupliquer les cartes en fonction des exemplaires
            cartesDeckPrincipal = cartesDeckPrincipal.flatMap(carte => {
                const exemplaires = carte.legende.includes('×2') ? 2 : 1;
                return Array(exemplaires).fill({ ...carte, legende: carte.legende.replace(/×\d/, '') });
            });

            // Cartes de l'extra deck
            const cartesExtraDeck = [
                { url: 'https://telegra.ph/file/e7886753a646455bfe3c0.jpg', legende: '*🎴 Carte:* Dragon Crâne Noir' },
                { url: 'https://telegra.ph/file/606a16a5b822d606d354d.jpg', legende: '*🎴 Carte:* Dragon Noir Météore' },
                { url: 'https://telegra.ph/file/bec782185dac8cea4db1d.jpg', legende: '*🎴 Carte:* Dragon Millénaire' },
                { url: 'https://telegra.ph/file/ebd75912195fe39ab6e84.jpg', legende: '*🎴 Carte:* Dragon du Glaive de l\'Alligator' },
                { url: 'https://telegra.ph/file/b796c48a163844d2e4464.jpg', legende: '*🎴 Carte:* Spadassin des Flammes' }
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