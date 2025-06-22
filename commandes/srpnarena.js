const { zokou } = require('../framework/zokou');


// Jeu de pile ou face simple
zokou(
    {
        nomCom: 'coinflip',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;

        // Fonction pour simuler un pile ou face
        const flipCoin = () => (Math.random() < 0.5) ? 'Pile' : 'Face';
        
        const coin = flipCoin();
        
        // Message affichant le résultat du pile ou face
        const resultMessage = `🪙 Vous avez lancé une pièce et obtenu : ${coin}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

// Jeu de dés simple
zokou(
    {
        nomCom: 'dice',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;
        
        // Fonction pour lancer un dé à 6 faces
        const rollDice = () => Math.floor(Math.random() * 6) + 1;
        
        const dice = rollDice();
        
        // Message affichant le résultat du dé
        const resultMessage = `🎲 Vous avez lancé un dé et obtenu un ${dice}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);


zokou(
    {
        nomCom: 'pave_story',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ORIGAMY  STORY]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*[PLAYER NAME] :*

> *Section 1:* 

> *Section 2:* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*💠 POUVOIR :* Aucun
*🌐 POSITION :* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'story_mj',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ORIGAMY WORLD]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*👤[PLAYER NAME]:* [Tours].
*🕰️TEMPS :* [Période / Météo].
*📍COORDONNÉES :* [Localisation / Destination].
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
*\`🎭 MAÎTRE DU JEU:\`*

> *[Résumé du pavé du joueur et analyse des statistiques affectés]*.

> *[Verdict du Maître du Jeu aux actions du joueur]*.

> *[Statistiques perdues ou gagner, distance parcourue, etc]*.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
*\`💠 STATISTIQUES :\`*

*👤[PLAYER NAME]:*
> ❤️: 100 | 🌀: 100 | 🫀: 100
> 🍽️: 100 | 🍶: 100 | 🙂: 000

*\`📦 INVENTAIRES :\`* 0/3
> *💰 Bourse :* 000🧭
> *
> *
> *

[Zone de statistiques des PNJ]
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[À SUIVRE...]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);