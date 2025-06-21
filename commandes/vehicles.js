const { zokou } = require('../framework/zokou');
const { select_cars } = require('../commandes/select_cars');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Fonction pour envoyer l'image et les informations d'un véhicule spécifique.
 */
async function envoyerVehicule(dest, zk, ms, vehicule) {
    let vehiculeTrouve = false;
    const vehiculeUpper = vehicule.toUpperCase();

    for (const [categorie, types] of Object.entries(select_cars)) {
        for (const [type, vehicules] of Object.entries(types)) {
            if (vehicules[vehiculeUpper]) {
                vehiculeTrouve = true;
                const { lien } = vehicules[vehiculeUpper];

                zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `*${vehiculeUpper} | ${categorie} | ${type}*`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!vehiculeTrouve) {
        zk.sendMessage(dest, { text: `*❌ Véhicule ${vehicule} indisponible.*` }, { quoted: ms });
    }
}

/**
 * Fonction pour envoyer la liste complète des véhicules disponibles en HTML.
 */
async function envoyerListeVehicules(dest, zk, ms) {
    let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Catalogue SPEED RUSH - SRPN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Bebas Neue', Arial, sans-serif;
            background: url('https://i.ibb.co/zhnRbzV/rush-bg.jpg') no-repeat center center fixed;
            background-size: cover;
            color: #f1f1f1;
            padding: 10px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }
          h1, h2, h3, h4 {
            text-align: center;
          }
          h5, ul, li {
            text-align: left;
          }
          h1 {
            font-size: 36px;
            color: #f39c12;
            margin: 20px 0;
          }
          h2 {
            font-size: 28px;
            color: #3498db;
            border-bottom: 2px solid #f39c12;
            padding-bottom: 5px;
            margin-top: 30px;
          }
          h3 {
            font-size: 24px;
            color: #e74c3c;
            margin-top: 20px;
          }
          h4 {
            font-size: 22px;
            color: #1abc9c;
            margin-top: 20px;
          }
          h5 {
            font-size: 20px;
            color: #9b59b6;
            margin-top: 10px;
          }
          ul {
            list-style: none;
            padding-left: 0;
            text-align: center;
          }
          li {
            margin-bottom: 6px;
            font-size: 16px;
            line-height: 1.4;
            position: relative;
          }
          li::before {
            content: "- ";
            color: #f1c40f;
            font-size: 14px;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
      </head>
    <body>
      <h1>🏁 CATALOGUE SPEED RUSH 🏁</h1>
    `;

    for (const [categorie, types] of Object.entries(select_cars)) {
        html += `<h4>🚗 ${categorie}</h4>`;
        for (const [type, vehicules] of Object.entries(types)) {
            html += `<h5>🔹 ${type}</h5><ul>`;
            for (const nom of Object.keys(vehicules)) {
                html += `<li>${nom}</li>`;
            }
            html += `</ul>`;
        }
    }

    html += `</body></html>`;

    const filename = `catalogue_speedrush_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
        document: readFileSync(filename),
        mimetype: 'text/html',
        filename: 'speedrush_catalogue.html',
        caption: '*🏁 SPEED RUSH : CATALOGUE DES VÉHICULES 🏁*'
    }, { quoted: ms });

    unlinkSync(filename);
}

/**
 * Fonction pour sélectionner un véhicule aléatoire selon les critères donnés.
 */
async function vehiculeAleatoire(dest, zk, ms, categorie = null, type = null) {
    let vehiculesFiltres = [];

    for (const [c, types] of Object.entries(select_cars)) {
        if (categorie && c !== categorie.toUpperCase()) continue;

        for (const [t, vehicules] of Object.entries(types)) {
            if (type && t !== type.toUpperCase()) continue;

            for (const [nom, data] of Object.entries(vehicules)) {
                vehiculesFiltres.push({ nom, categorie: c, type: t, lien: data.lien });
            }
        }
    }

    if (vehiculesFiltres.length === 0) {
        zk.sendMessage(dest, { text: 'Aucun véhicule trouvé avec ces critères.' }, { quoted: ms });
        return;
    }

    const randomVehicule = vehiculesFiltres[Math.floor(Math.random() * vehiculesFiltres.length)];

    zk.sendMessage(dest, { 
        image: { url: randomVehicule.lien }, 
        caption: `*${randomVehicule.nom} | ${randomVehicule.categorie} | ${randomVehicule.type}*`
    }, { quoted: ms });
}

// Commande principale
zokou(
    {
        nomCom: 'vehicles',
        categorie: 'SPEED-RUSH'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            await envoyerListeVehicules(dest, zk, ms);
        } 
        else if (arg[0].toUpperCase() === 'RANDOM') {
            const categorie = arg[1] ? arg[1].toUpperCase() : null;
            const type = arg[2] ? arg[2].toUpperCase() : null;
            await vehiculeAleatoire(dest, zk, ms, categorie, type);
        } 
        else {
            await envoyerVehicule(dest, zk, ms, arg[0]);
        }
    }
);