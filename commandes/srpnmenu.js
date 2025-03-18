const { zokou } = require('../framework/zokou');

// Fonction générique pour envoyer une image avec un lien donné
const envoyerImage = async (dest, zk, ms, lien, caption = '') => {
    await zk.sendMessage(dest, { image: { url: lien }, caption }, { quoted: ms });
};

// Commande guide
zokou(
    { nomCom: 'guide', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/9385N887/Image-2025-03-15-09-31-07-0.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande competition
zokou(
    { nomCom: 'competition', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/fd6rWQTV/Image-2025-03-15-09-31-07-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande reward
/*zokou(
    { nomCom: 'reward', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/Xxs9yD6/Picsart-24-09-18-13-44-38-374.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);*/

// Commande currency
zokou(
    { nomCom: 'currency', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/5xjZ3kg9/Image-2025-03-15-09-31-07-2.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande generale
zokou(
    { nomCom: 'generale', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/V02kdXWt/Image-2025-03-15-09-31-07-3.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);

// Commande guide_pro
/*zokou(
    { nomCom: 'guide_pro', categorie: 'CENTRAL' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/hKyphPC/Picsart-24-09-17-22-41-09-565-1.jpg';
        await envoyerImage(dest, zk, ms, lien);
    }
);*/

// Commande speedrush_system
zokou(
    { nomCom: 'speedrush', categorie: 'SPEED-RUSH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            'https://i.ibb.co/37qwKLP/Picsart-24-09-15-07-54-02-342.jpg',
            'https://i.ibb.co/y55kDpL/Picsart-24-09-15-08-00-10-160.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande amb_system
zokou(
    { nomCom: 'abm', categorie: 'ABM' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            'https://i.ibb.co/QFY5HnG0/Image-2025-03-17-06-59-48-2.jpg',
            'https://i.ibb.co/4qRr9b4/Image-2025-03-17-06-59-48-1.jpg',
            'https://i.ibb.co/qMVzB1Jt/Image-2025-03-17-06-59-48-0.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande origamy_system
zokou(
    { nomCom: 'origamy', categorie: 'ORIGAMY' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const liens = [
            'https://i.ibb.co/VWwGgGMg/Image-2025-03-18-21-31-47-2.jpg',
            'https://i.ibb.co/LzrGD9wg/Image-2025-03-18-21-31-47-1.jpg',
            'https://i.ibb.co/xcpVWb3/Image-2025-03-18-21-31-47-0.jpg'
        ];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Commande system_yugioh
zokou(
    { nomCom: 'yugioh', categorie: 'YU-GI-OH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;
        const lien = 'https://i.ibb.co/Y3wTs4X/Picsart-24-09-15-08-45-38-072.jpg';
        const msg = '*🎴 C\'est l\'heure du duel !';
        await envoyerImage(dest, zk, ms, lien, msg);
    }
);
