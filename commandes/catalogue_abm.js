const { zokou } = require('../framework/zokou');

// Dictionnaire des personnages et leurs images par univers
const personnages = {
    'black_clover': {
        ASTA: 'https://i.ibb.co/b7nG8PT/Image-2024-09-22-23-51-04-0.jpg',
        'YUNO Pro': 'https://i.ibb.co/gdTzR95/Image-2024-09-22-23-51-04-1.jpg',
        LÉOPOLD: 'https://i.ibb.co/BzQ41L5/Image-2024-09-22-23-51-04-5.jpg',
        GAUCHE: 'https://i.ibb.co/dtdqN3v/Image-2024-09-22-23-51-04-6.jpg',
        MAGNA: 'https://i.ibb.co/j580P6c/Image-2024-09-22-23-51-04-3.jpg',
        'LUCK Pro': 'https://i.ibb.co/y6ssxQ0/Image-2024-09-22-23-51-04-4.jpg',
        'NOELLE Pro': 'https://i.ibb.co/23kcHZx/Image-2024-09-22-23-51-04-2.jpg',
        'VANESSA Pro': 'https://i.ibb.co/RQpvRyD/Image-2024-09-22-23-51-04-7.jpg',
        ZORA: 'https://i.ibb.co/1MGtpKF/Image-2024-09-22-23-51-04-8.jpg',
        'LANGRIS Pro': 'https://i.ibb.co/GvNHQ7R/Image-2024-09-22-23-51-04-9.jpg',
    },
    'demon_slayer': {
        'RIU Pro': 'https://i.ibb.co/k0jFqQj/Image-2024-09-23-16-51-29-8.jpg',
        'GIYU Pro': 'https://i.ibb.co/k9xb9VG/Image-2024-09-23-16-51-29-2.jpg',
        'ZENITSU Pro': 'https://i.ibb.co/BqbZ7VN/Image-2024-09-23-16-51-29-3.jpg',
        'ENMU Pro': 'https://i.ibb.co/1r3g39z/Image-2024-09-23-16-51-29-7.jpg',
        SUSAMARU: 'https://i.ibb.co/VggXmkz/Image-2024-09-23-16-51-29-6.jpg',
        YAHABA: 'https://i.ibb.co/hBcm3gf/Image-2024-09-23-16-51-29-5.jpg',
        NEZUKO: 'https://i.ibb.co/h8Jt7JG/Image-2024-09-23-16-51-29-1.jpg',
        INOSUKE: 'https://i.ibb.co/LZ1nWyM/Image-2024-09-23-16-51-29-4.jpg',
        TANJIRO: 'https://i.ibb.co/fnzKSqB/Image-2024-09-23-16-51-29-0.jpg',
    }
};

// Fonction pour envoyer la carte du personnage
async function envoyerCarte(dest, zk, ms, verse, personnage) {
    const lien = personnages[verse][personnage];
    if (lien) {
        zk.sendMessage(dest, { image: { url: lien }, caption: personnage }, { quoted: ms });
    } else {
        zk.sendMessage(dest, { text: `Personnage ${personnage} non trouvé dans le verse ${verse}.` }, { quoted: ms });
    }
}

// Commande pour Black Clover
zokou(
    {
        nomCom: 'black_clover',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            zk.sendMessage(dest, { text: 'Veuillez spécifier un personnage.' }, { quoted: ms });
        } else {
            const personnage = arg[0].toUpperCase(); // Nom du personnage en majuscule
            await envoyerCarte(dest, zk, ms, 'black_clover', personnage);
        }
    }
);

// Commande pour Demon Slayer
zokou(
    {
        nomCom: 'demon_slayer',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            zk.sendMessage(dest, { text: 'Veuillez spécifier un personnage.' }, { quoted: ms });
        } else {
            const personnage = arg[0].toUpperCase();
            await envoyerCarte(dest, zk, ms, 'demon_slayer', personnage);
        }
    }
);