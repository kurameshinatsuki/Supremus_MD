const { zokou } = require('../framework/zokou');
const { select_skins } = require('../commandes/origamy_skins');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Envoie l'image d'un skin spécifique avec ses infos.
 */
async function envoyerSkin(dest, zk, ms, nomSkin) {
    let skinTrouve = false;
    const nomSkinUpper = nomSkin.toUpperCase();

    for (const [rang, raretes] of Object.entries(select_skins)) {
        for (const [rarete, skins] of Object.entries(raretes)) {
            if (skins[nomSkinUpper]) {
                skinTrouve = true;
                const { lien } = skins[nomSkinUpper];

                await zk.sendMessage(dest, {
                    image: { url: lien },
                    caption: `*${nomSkinUpper} | ${rang} | ${rarete}*`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!skinTrouve) {
        await zk.sendMessage(dest, { text: `*❌ Skin "${nomSkin}" introuvable.*` }, { quoted: ms });
    }
}

/**
 * Envoie la liste de tous les skins disponibles au format HTML.
 */
async function envoyerListeSkinsHTML(dest, zk, ms) {
    let html = `
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Catalogue Skins - Origamy World</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: 'Bebas Neue', Arial, sans-serif;
          background: url('https://i.ibb.co/ycJLcFn6/Image-2025-03-17-00-21-51-2.jpg') no-repeat center center fixed;
          background-size: cover;
          color: #ffffff;
          padding: 10px;
          margin: 0 auto;
          max-width: 900px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        h1, h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 36px;
          color: #e67e22;
        }
        h2 {
          font-size: 28px;
          color: #9b59b6;
          border-bottom: 2px solid #e67e22;
          padding-bottom: 5px;
          margin-top: 30px;
        }
        h3 {
          font-size: 22px;
          color: #1abc9c;
          margin-top: 20px;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        li {
          margin-bottom: 6px;
          font-size: 16px;
          line-height: 1.4;
          position: relative;
          padding-left: 15px;
        }
        li::before {
          content: "🎭 ";
          position: absolute;
          left: 0;
          color: #f39c12;
          font-size: 16px;
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
    </head>
    <body>
      <h1>🎭 CATALOGUE DES SKINS - ORIGAMY WORLD 🎭</h1>
    `;

    for (const [rang, raretes] of Object.entries(select_skins)) {
        html += `<h2>RANG ${rang}</h2>`;
        for (const [rarete, skins] of Object.entries(raretes)) {
            html += `<h3>${rarete}</h3><ul>`;
            for (const nom of Object.keys(skins)) {
                html += `<li>${nom}</li>`;
            }
            html += `</ul>`;
        }
    }

    html += `</body></html>`;

    const filename = `catalogue_skins_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
        document: readFileSync(filename),
        mimetype: 'text/html',
        filename: 'catalogue_skins.html',
        caption: '*🎭 CATALOGUE DES SKINS ORIGAMY WORLD 🎭*'
    }, { quoted: ms });

    unlinkSync(filename);
}

/**
 * Sélectionne un skin aléatoire selon les critères.
 */
async function skinAleatoire(dest, zk, ms, rang = null, rarete = null) {
    let skinsFiltres = [];

    for (const [r, raretes] of Object.entries(select_skins)) {
        if (rang && r !== rang.toUpperCase()) continue;

        for (const [rr, skins] of Object.entries(raretes)) {
            if (rarete && rr !== rarete.toUpperCase()) continue;

            for (const [nom, data] of Object.entries(skins)) {
                skinsFiltres.push({ nom, rang: r, rarete: rr, lien: data.lien });
            }
        }
    }

    if (skinsFiltres.length === 0) {
        await zk.sendMessage(dest, { text: '*Aucun skin trouvé avec ces critères.*' }, { quoted: ms });
        return;
    }

    const randomSkin = skinsFiltres[Math.floor(Math.random() * skinsFiltres.length)];

    await zk.sendMessage(dest, {
        image: { url: randomSkin.lien },
        caption: `*${randomSkin.nom} | ${randomSkin.rang} | ${randomSkin.rarete}*`
    }, { quoted: ms });
}

// Commande principale : -skins ou -skins random [rang] [rarete]
zokou(
    {
        nomCom: 'skins',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            await envoyerListeSkinsHTML(dest, zk, ms);
        } else if (arg[0].toUpperCase() === 'RANDOM') {
            const rang = arg[1] || null;
            const rarete = arg[2] || null;
            await skinAleatoire(dest, zk, ms, rang, rarete);
        } else {
            await envoyerSkin(dest, zk, ms, arg[0]);
        }
    }
);
