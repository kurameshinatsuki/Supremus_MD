const { zokou } = require('../framework/zokou');
const { characters } = require('../commandes/catalogue');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

/**
 * Envoie l'image d'un personnage
 */
async function envoyerCarte(dest, zk, ms, personnage) {
    let personnageTrouve = false;
    const personnageUpper = personnage.toUpperCase();

    for (const [rang, univers] of Object.entries(characters)) {
        for (const [verse, personnages] of Object.entries(univers)) {
            if (personnages[personnageUpper]) {
                personnageTrouve = true;
                const { lien } = personnages[personnageUpper];

                await zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `*${personnageUpper}*\nUnivers: ${verse}\nRang: ${rang}`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!personnageTrouve) {
        await zk.sendMessage(dest, { 
            text: `❌ Personnage "${personnage}" introuvable.` 
        }, { quoted: ms });
    }
}

/**
 * Envoie la liste complète en HTML simple
 */
async function envoyerListe(dest, zk, ms) {
    let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABM Heroes</title>
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
        .characters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 8px;
            margin: 10px 0;
        }
        .character-card {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid rgba(255,215,0,0.3);
        }
        .character-name {
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
            <h1 class="title">🌌 ABM HEROES 🆚</h1>
            <p>Catalogue de Personnages</p>
        </div>
    `;

    // Calcul des statistiques
    let totalPersonnages = 0;
    let totalUnivers = 0;
    const rangs = Object.keys(characters);
    
    for (const [rang, univers] of Object.entries(characters)) {
        totalUnivers += Object.keys(univers).length;
        for (const [verse, personnages] of Object.entries(univers)) {
            totalPersonnages += Object.keys(personnages).length;
        }
    }

    html += `
        <div class="stats">
            <div>
                <div style="font-size:1.2em;color:#ffd700">${totalPersonnages}</div>
                <div style="font-size:0.8em">Personnages</div>
            </div>
            <div>
                <div style="font-size:1.2em;color:#ffd700">${totalUnivers}</div>
                <div style="font-size:0.8em">Univers</div>
            </div>
            <div>
                <div style="font-size:1.2em;color:#ffd700">${rangs.length}</div>
                <div style="font-size:0.8em">Rangs</div>
            </div>
        </div>
    `;

    for (const [rang, univers] of Object.entries(characters)) {
        html += `
            <div class="rang-section">
                <h2 class="rang-title">${rang}</h2>
        `;
        
        for (const [verse, personnages] of Object.entries(univers)) {
            html += `
                <div style="margin:10px 0">
                    <h3 style="color:#b08d57;margin:5px 0">${verse}</h3>
                    <div class="characters-grid">
            `;
            
            for (const nom of Object.keys(personnages)) {
                html += `
                    <div class="character-card">
                        <div class="character-name">${nom}</div>
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
                <p>ABM - Utilise -heroes [nom]</p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `heroes_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'abm_heroes.html',
            caption: `*ABM HEROES*\n${totalPersonnages} personnages\nUtilise -heroes nom`
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
 * Personnage aléatoire
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
        await zk.sendMessage(dest, { 
            text: '❌ Aucun personnage trouvé.' 
        }, { quoted: ms });
        return;
    }

    const randomPerso = personnagesFiltres[Math.floor(Math.random() * personnagesFiltres.length)];

    await zk.sendMessage(dest, { 
        image: { url: randomPerso.lien }, 
        caption: `*${randomPerso.nom}*\nUnivers: ${randomPerso.verse}\nRang: ${randomPerso.rang}`
    }, { quoted: ms });
}

// Commande principale
zokou(
    {
        nomCom: 'heroes',
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
