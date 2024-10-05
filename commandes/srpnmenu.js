const { zokou } = require('../framework/zokou');

// Fonction générique pour envoyer une image avec un lien donné
const envoyerImage = async (dest, zk, ms, lien, caption = '') => {
    await zk.sendMessage(dest, { image: { url: lien }, caption }, { quoted: ms });
};

// Commande srpn_menu
zokou(
    { nomCom: 'srpn_menu', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/wMTg7Nb/Picsart-24-09-15-17-38-15-634.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande guide
zokou(
    { nomCom: 'guide', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/t302NRH/Picsart-24-09-15-22-07-18-958.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande competition
zokou(
    { nomCom: 'competition', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/kGhL9fD/Picsart-24-09-15-23-13-07-768.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande reward
zokou(
    { nomCom: 'reward', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/Xxs9yD6/Picsart-24-09-18-13-44-38-374.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande currency
zokou(
    { nomCom: 'currency', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/cvdDHmF/Picsart-24-09-16-08-03-22-285-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande jobs
zokou(
    { nomCom: 'jobs', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/TBksJSH/Picsart-24-09-16-10-49-25-952-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande generale
zokou(
    { nomCom: 'generale', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/9VbPVZs/Picsart-24-09-16-10-53-14-009-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande guide_pro
zokou(
    { nomCom: 'guide_pro', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/hKyphPC/Picsart-24-09-17-22-41-09-565-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande system_abm (envoie plusieurs images)
zokou(
    { nomCom: 'abm_system', categorie: 'ABM' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            'https://i.ibb.co/tXzHV8s/Picsart-24-09-15-00-26-37-972.jpg',
            'https://i.ibb.co/VjcFtdZ/Picsart-24-09-15-01-33-29-343.jpg',
            'https://i.ibb.co/sqDW5BK/Picsart-24-09-15-02-17-35-095.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande speed_rush (envoie plusieurs images)
zokou(
    { nomCom: 'speedrush_system', categorie: 'SPEED-RUSH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            https://i.ibb.co/1TrmcF5/Image-2024-10-05-11-58-07-0.jpg',
            'https://i.ibb.co/yPzLn42/Image-2024-10-05-11-58-07-1.jpg',
            'https://i.ibb.co/3WDjLN4/Image-2024-10-05-11-58-07-2.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande origamy_system (envoie plusieurs images)
zokou(
    { nomCom: 'origamy_system', categorie: 'ORIGAMY' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            'https://i.ibb.co/M5nPWj3/Image-2024-10-05-11-58-07-3.jpg',
            'https://i.ibb.co/zPppSB6/Image-2024-10-05-11-58-07-4.jpg',
            'https://i.ibb.co/fChCHV0/Image-2024-10-05-11-58-07-5.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande system_yugioh
zokou(
    { nomCom: 'yugioh_system', categorie: 'YU-GI-OH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/Y3wTs4X/Picsart-24-09-15-08-45-38-072.jpg';
        const msg = '*🎴 C\'est l\'heure du duel !';
        await envoyerImage(dest, zk, ms, lien, msg);
    }
);
