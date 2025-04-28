const { zokou } = require("../framework/zokou");
const axios = require("axios");
const { characters } = require('../commandes/catalogue');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Fonction pour envoyer l'image et les informations d'un personnage spécifique.
 */
async function envoyerCarte(dest, zk, ms, personnage) {
    let personnageTrouve = false;
    const personnageUpper = personnage.toUpperCase();

    for (const [rang, univers] of Object.entries(characters)) {
        for (const [verse, personnages] of Object.entries(univers)) {
            if (personnages[personnageUpper]) {
                personnageTrouve = true;
                const { lien } = personnages[personnageUpper];

                zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `*${personnageUpper} | ${verse} | RANG ${rang}*` 
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!personnageTrouve) {
        zk.sendMessage(dest, { text: `*❌ Personnage ${personnage} indisponible.*` }, { quoted: ms });
    }
}

/**
 * Fonction pour envoyer la liste complète des personnages disponibles en document HTML.
 */
async function envoyerListe(dest, zk, ms) {
    let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Catalogue ABM - SRPN</title>
        <style>
            body {
                font-family: 'Bebas Neue', Arial, sans-serif;
                background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
                color: #f1f1f1;
                padding: 20px;
                text-shadow: 1px 1px 2px black;
            }
            h1 {
                text-align: center;
                font-size: 48px;
                color: #f39c12;
                margin-bottom: 40px;
            }
            h2 {
                font-size: 32px;
                color: #3498db;
                border-bottom: 3px solid #f39c12;
                padding-bottom: 5px;
                margin-top: 40px;
            }
            h3 {
                font-size: 24px;
                color: #e74c3c;
                margin-top: 25px;
            }
            ul {
                list-style: none;
                padding-left: 15px;
            }
            li {
                margin-bottom: 8px;
                padding-left: 15px;
                position: relative;
                font-size: 18px;
            }
            li::before {
                content: "-";
                position: absolute;
                left: 0;
                color: #f1c40f;
                font-size: 16px;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    </head>
    <body>
        <h1>🆚 CATALOGUE DES HÉROS ABM 🆚</h1>
    `;

    for (const [rang, univers] of Object.entries(characters)) {
        html += `<h2>🏅 RANG ${rang}</h2>`;
        for (const [verse, personnages] of Object.entries(univers)) {
            html += `<h3>🌐 Univers : ${verse}</h3><ul>`;
            for (const nom of Object.keys(personnages)) {
                html += `<li>${nom}</li>`;
            }
            html += `</ul>`;
        }
    }

    html += `</body></html>`;

    const filename = `catalogue_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
        document: readFileSync(filename),
        mimetype: 'text/html',
        filename: 'catalogue.html',
        caption: '*📘 Catalogue ABM des Héros - SRPN*'
    }, { quoted: ms });

    unlinkSync(filename);
}

/**
 * Fonction pour sélectionner un personnage aléatoire.
 */
async function personnageAleatoire(dest, zk, ms, rang = null, verse = null) {
    let personnagesFiltres = [];

    for (const [r, univers] of Object.entries(characters)) {
        if (rang && r !== rang.toUpperCase()) continue;
        for (const [v, personnages] of Object.entries(univers)) {
            if (verse && v !== verse.toUpperCase()) continue;
            for (const [nom, data] of Object.entries(personnages)) {
                personnagesFiltres.push({ nom, verse: v, rang: r, lien: data.lien });
            }
        }
    }

    if (personnagesFiltres.length === 0) {
        zk.sendMessage(dest, { text: 'Aucun personnage trouvé avec ces critères.' }, { quoted: ms });
        return;
    }

    const randomPerso = personnagesFiltres[Math.floor(Math.random() * personnagesFiltres.length)];

    zk.sendMessage(dest, { 
        image: { url: randomPerso.lien }, 
        caption: `*${randomPerso.nom} | ${randomPerso.verse} | RANG ${randomPerso.rang}*` 
    }, { quoted: ms });
}

// Commande principale
zokou(
    {
        nomCom: 'perso',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            await envoyerListe(dest, zk, ms);
        } else if (arg[0].toUpperCase() === 'RANDOM') {
            const rang = arg[1] ? arg[1].toUpperCase() : null;
            const verse = arg[2] ? arg[2].toUpperCase() : null;
            await personnageAleatoire(dest, zk, ms, rang, verse);
        } else {
            await envoyerCarte(dest, zk, ms, arg[0]);
        }
    }
);

/*let intervalPing = null;
let latenceTimeout = null;

zokou({ nomCom: "latence", categorie: "MON-BOT", reaction: "⏱️" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        repondre("*_⏳ La latence est déjà en cours..._*");
        return;
    }

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://zokouscan-din3.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `*_⌛ Latence écoulé._*` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, 600000);

    repondre("*_⏱️ Latence démarré. Fin de la latence dans 10 minutes._*");
});


zokou({ nomCom: "stop", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        repondre("*_⏱️ Latence arrêté._*");
    } else {
        repondre("*_⏱️ Aucune latence en cours._*");
    }
});*/

let intervalPing = null;
let latenceTimeout = null;
let dernierDelaiMinutes = null; // <= On mémorise le dernier délai utilisé

zokou({ nomCom: "time", categorie: "MON-BOT", reaction: "⏱️" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;

    if (intervalPing) {
        repondre("*_⏳ Une latence est déjà en cours..._*");
        return;
    }

    // Déterminer le délai demandé par l'utilisateur
    let minutes = parseInt(arg[0]);
    if (isNaN(minutes) || minutes <= 0) {
        minutes = 10; // Valeur par défaut = 10 minutes
    }

    dernierDelaiMinutes = minutes; // On mémorise le délai

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://zokouscan-din3.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `*_⌛ Intervalle écoulé (${dernierDelaiMinutes} min)._ *` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, minutes * 60 * 1000); // Conversion minutes -> millisecondes

    repondre(`*_⏱️ Latence démarré. Fin de la latence dans ${minutes} minute(s)._ *`);
});


zokou({ nomCom: "stopping", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        dernierDelaiMinutes = null;
        repondre("*_⏱️ Latence arrêté._*");
    } else {
        repondre("*_⏱️ Aucune latence en cours._*");
    }
});