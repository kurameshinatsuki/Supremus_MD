const { zokou } = require('../framework/zokou');
const { select_skins } = require('../commandes/origamy_skins');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Envoie l'image d'un skin spécifique
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
                    caption: `*${nomSkinUpper}*\nRang: ${rang}\nRareté: ${rarete}`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!skinTrouve) {
        await zk.sendMessage(dest, { 
            text: `❌ Skin "${nomSkin}" introuvable.` 
        }, { quoted: ms });
    }
}

/**
 * Envoie la liste de tous les skins au format HTML simple
 */
async function envoyerListeSkinsHTML(dest, zk, ms) {
    let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skins Origamy</title>
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
            border-bottom: 1px solid #ffd700;
        }
        .title {
            color: #ffd700;
            font-size: 1.5em;
            margin: 5px 0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255,215,0,0.1);
            border-radius: 5px;
        }
        .rang-section {
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 3px solid #ffd700;
        }
        .rang-title {
            color: #ffd700;
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .skins-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 8px;
            margin: 10px 0;
        }
        .skin-item {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid rgba(255,215,0,0.3);
        }
        .skin-name {
            font-size: 0.9em;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,215,0,0.3);
            color: #ccc;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🃏 SKINS ORIGAMY</h1>
            <p>Collection de Skins</p>
        </div>
    `;

    // Compter les statistiques
    let totalSkins = 0;
    const rangs = Object.keys(select_skins);
    
    for (const [rang, raretes] of Object.entries(select_skins)) {
        for (const [rarete, skins] of Object.entries(raretes)) {
            totalSkins += Object.keys(skins).length;
        }
    }

    html += `
        <div class="stats">
            <div>
                <div style="font-size:1.2em;color:#ffd700">${totalSkins}</div>
                <div style="font-size:0.8em">Skins</div>
            </div>
            <div>
                <div style="font-size:1.2em;color:#ffd700">${rangs.length}</div>
                <div style="font-size:0.8em">Rangs</div>
            </div>
        </div>
    `;

    for (const [rang, raretes] of Object.entries(select_skins)) {
        html += `
            <div class="rang-section">
                <h2 class="rang-title">${rang}</h2>
        `;
        
        for (const [rarete, skins] of Object.entries(raretes)) {
            html += `
                <div style="margin:10px 0">
                    <h3 style="color:#b08d57;margin:5px 0">${rarete}</h3>
                    <div class="skins-grid">
            `;
            
            for (const nom of Object.keys(skins)) {
                html += `
                    <div class="skin-item">
                        <div class="skin-name">${nom}</div>
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
                <p>Origamy World — Utilise -skins [nom]</p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `skins_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'skins_origamy.html',
            caption: `*SKINS ORIGAMY*\n${totalSkins} skins disponibles\nUtilise -skins nom`
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
 * Skin aléatoire
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
        await zk.sendMessage(dest, { 
            text: '❌ Aucun skin trouvé.' 
        }, { quoted: ms });
        return;
    }

    const randomSkin = skinsFiltres[Math.floor(Math.random() * skinsFiltres.length)];

    await zk.sendMessage(dest, {
        image: { url: randomSkin.lien },
        caption: `*${randomSkin.nom}*\nRang: ${randomSkin.rang}\nRareté: ${randomSkin.rarete}`
    }, { quoted: ms });
}

// Commande principale
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
