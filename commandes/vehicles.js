const { zokou } = require('../framework/zokou');
const { select_cars } = require('../commandes/select_cars');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Envoie l'image d'un véhicule
 */
async function envoyerVehicule(dest, zk, ms, vehicule) {
    let vehiculeTrouve = false;
    const vehiculeUpper = vehicule.toUpperCase();

    for (const [categorie, types] of Object.entries(select_cars)) {
        for (const [type, vehicules] of Object.entries(types)) {
            if (vehicules[vehiculeUpper]) {
                vehiculeTrouve = true;
                const { lien } = vehicules[vehiculeUpper];

                await zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `*${vehiculeUpper}*\nCatégorie: ${categorie}\nType: ${type}`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!vehiculeTrouve) {
        await zk.sendMessage(dest, { text: `❌ Véhicule "${vehicule}" introuvable.` }, { quoted: ms });
    }
}

/**
 * Envoie la liste des véhicules en HTML simple
 */
async function envoyerListeVehicules(dest, zk, ms) {
    let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Rush</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #1a1a2e;
            color: white;
            padding: 10px;
            margin: 0;
        }
        .container {
            background: #16213e;
            border-radius: 8px;
            padding: 15px;
            margin: 0 auto;
            max-width: 100%;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f39c12;
        }
        .title {
            color: #f39c12;
            font-size: 1.5em;
            margin: 5px 0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 15px 0;
            padding: 10px;
            background: rgba(243,156,18,0.1);
            border-radius: 5px;
        }
        .categorie-section {
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 3px solid #f39c12;
        }
        .categorie-title {
            color: #f39c12;
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .vehicules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 8px;
            margin: 10px 0;
        }
        .vehicule-item {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid rgba(243,156,18,0.3);
        }
        .vehicule-nom {
            font-size: 0.9em;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid rgba(243,156,18,0.3);
            color: #ccc;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🏁 SPEED RUSH</h1>
            <p>Catalogue Véhicules</p>
        </div>
    `;

    // Compter les statistiques
    let totalVehicules = 0;
    const categories = Object.keys(select_cars);
    
    for (const [categorie, types] of Object.entries(select_cars)) {
        for (const [type, vehicules] of Object.entries(types)) {
            totalVehicules += Object.keys(vehicules).length;
        }
    }

    html += `
        <div class="stats">
            <div>
                <div style="font-size:1.2em;color:#f39c12">${totalVehicules}</div>
                <div style="font-size:0.8em">Véhicules</div>
            </div>
            <div>
                <div style="font-size:1.2em;color:#f39c12">${categories.length}</div>
                <div style="font-size:0.8em">Catégories</div>
            </div>
        </div>
    `;

    for (const [categorie, types] of Object.entries(select_cars)) {
        html += `
            <div class="categorie-section">
                <h2 class="categorie-title">${categorie}</h2>
        `;
        
        for (const [type, vehicules] of Object.entries(types)) {
            html += `
                <div style="margin:10px 0">
                    <h3 style="color:#b08d57;margin:5px 0">${type}</h3>
                    <div class="vehicules-grid">
            `;
            
            for (const nom of Object.keys(vehicules)) {
                html += `
                    <div class="vehicule-item">
                        <div class="vehicule-nom">${nom}</div>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
    }

    html += `
            <div class="footer">
                <p>Speed Rush - Utilise !vehicles [nom]</p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `vehicles_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'speedrush_vehicles.html',
            caption: `*SPEED RUSH*\n${totalVehicules} véhicules\nUtilise !vehicles nom`
        }, { quoted: ms });
    } catch (error) {
        console.error('Erreur:', error);
        await zk.sendMessage(dest, { 
            text: '❌ Erreur affichage.' 
        }, { quoted: ms });
    } finally {
        try {
            unlinkSync(filename);
        } catch (cleanError) {
            console.error('Erreur nettoyage:', cleanError);
        }
    }
}

/**
 * Véhicule aléatoire
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
        await zk.sendMessage(dest, { text: '❌ Aucun véhicule trouvé.' }, { quoted: ms });
        return;
    }

    const randomVehicule = vehiculesFiltres[Math.floor(Math.random() * vehiculesFiltres.length)];

    await zk.sendMessage(dest, { 
        image: { url: randomVehicule.lien }, 
        caption: `*${randomVehicule.nom}*\nCatégorie: ${randomVehicule.categorie}\nType: ${randomVehicule.type}`
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
        } else if (arg[0].toUpperCase() === 'RANDOM') {
            const categorie = arg[1] ? arg[1].toUpperCase() : null;
            const type = arg[2] ? arg[2].toUpperCase() : null;
            await vehiculeAleatoire(dest, zk, ms, categorie, type);
        } else {
            await envoyerVehicule(dest, zk, ms, arg[0]);
        }
    }
);
