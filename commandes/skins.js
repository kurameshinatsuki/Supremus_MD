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
                    caption: `*⚔️ ${nomSkinUpper} ⚔️*\n📜 Rang: ${rang}\n✨ Rareté: ${rarete}\n\n_Plongez dans l'univers fantastique d'Origamy World_`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!skinTrouve) {
        await zk.sendMessage(dest, { text: `*❌ Sortilège échoué ! Le skin "${nomSkin}" n'a pas été trouvé dans les grimoires.*` }, { quoted: ms });
    }
}

/**
 * Envoie la liste de tous les skins disponibles au format HTML avec thème médiéval fantastique.
 */
async function envoyerListeSkinsHTML(dest, zk, ms) {
    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>📜 Grimoire des Skins - Origamy World</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'MedievalSharp', 'Times New Roman', serif;
                background: 
                    radial-gradient(circle at 20% 50%, rgba(30, 15, 5, 0.8) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(60, 30, 10, 0.6) 0%, transparent 50%),
                    linear-gradient(135deg, #2c1a0a 0%, #1a0f05 50%, #0a0502 100%);
                color: #e8d5b5;
                line-height: 1.6;
                padding: 20px;
                min-height: 100vh;
                background-attachment: fixed;
            }
            
            .grimoire {
                max-width: 1200px;
                margin: 0 auto;
                background: 
                    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.1"><rect width="100" height="100" fill="none" stroke="%23e8d5b5" stroke-width="2"/><path d="M20,20 L80,80 M80,20 L20,80" stroke="%23e8d5b5" stroke-width="1"/></svg>'),
                    linear-gradient(to right, rgba(44, 26, 10, 0.9), rgba(26, 15, 5, 0.9));
                border: 15px solid #8b4513;
                border-image: 
                    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%238b4513"/><path d="M0,0 L100,100 M100,0 L0,100" stroke="%235d4037" stroke-width="2"/></svg>') 30 round;
                border-radius: 5px;
                padding: 30px;
                box-shadow: 
                    0 0 50px rgba(139, 69, 19, 0.5),
                    inset 0 0 100px rgba(0, 0, 0, 0.3);
                position: relative;
            }
            
            .grimoire::before {
                content: '';
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                border: 2px solid #e8d5b5;
                border-radius: 3px;
                pointer-events: none;
                opacity: 0.3;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 30px;
                border-bottom: 3px double #e8d5b5;
                position: relative;
            }
            
            .title {
                font-size: 3.5em;
                color: #d4af37;
                text-shadow: 
                    0 0 10px rgba(212, 175, 55, 0.5),
                    2px 2px 4px rgba(0, 0, 0, 0.8);
                margin-bottom: 10px;
                font-weight: bold;
                letter-spacing: 3px;
            }
            
            .subtitle {
                font-size: 1.4em;
                color: #b08d57;
                font-style: italic;
                opacity: 0.9;
            }
            
            .rang-section {
                background: 
                    linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.3), transparent),
                    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M0,0 L20,20 M20,0 L0,20" stroke="%23e8d5b5" stroke-width="0.5" opacity="0.1"/></svg>');
                padding: 25px;
                border-radius: 10px;
                margin: 30px 0;
                border: 2px solid #5d4037;
                position: relative;
                overflow: hidden;
            }
            
            .rang-section::before {
                content: '⚔️';
                position: absolute;
                top: 10px;
                left: 15px;
                font-size: 1.5em;
                opacity: 0.5;
            }
            
            .rang-title {
                font-size: 2em;
                color: #d4af37;
                text-align: center;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 2px;
                border-bottom: 1px solid #b08d57;
                padding-bottom: 10px;
            }
            
            .rarete-category {
                background: rgba(26, 15, 5, 0.6);
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #b08d57;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }
            
            .rarete-title {
                font-size: 1.5em;
                color: #e8d5b5;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .skins-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 12px;
                margin-top: 15px;
            }
            
            .skin-item {
                background: 
                    linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.2));
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid #5d4037;
                position: relative;
                cursor: pointer;
            }
            
            .skin-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
                background: 
                    linear-gradient(135deg, rgba(139, 69, 19, 0.5), rgba(101, 67, 33, 0.4));
                border-color: #d4af37;
            }
            
            .skin-name {
                font-weight: bold;
                color: #e8d5b5;
                font-size: 1.1em;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            }
            
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 2px double #e8d5b5;
                color: #b08d57;
                font-size: 0.9em;
                font-style: italic;
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin: 20px 0;
                flex-wrap: wrap;
            }
            
            .stat-item {
                background: rgba(139, 69, 19, 0.3);
                padding: 10px 20px;
                border-radius: 20px;
                border: 1px solid #5d4037;
            }
            
            .rarete-legend {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 20px 0;
                flex-wrap: wrap;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9em;
            }
            
            .legend-color {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                border: 1px solid #e8d5b5;
            }
            
            @media (max-width: 768px) {
                .grimoire {
                    padding: 15px;
                    border-width: 10px;
                }
                
                .title {
                    font-size: 2.5em;
                }
                
                .skins-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats {
                    flex-direction: column;
                    align-items: center;
                }
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="grimoire">
            <div class="header">
                <h1 class="title">📜 GRIMOIRE DES SKINS</h1>
                <p class="subtitle">"L'art ancestral de la métamorphose parcheminée"</p>
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
                <div class="stat-item">📊 Total: ${totalSkins} skins</div>
                <div class="stat-item">⚔️ Rangs: ${rangs.length}</div>
                <div class="stat-item">📜 Parchemin actuel: ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
            
            <div class="rarete-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background: #d4af37;"></div>
                    <span>Rareté Légendaire</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #b08d57;"></div>
                    <span>Rareté Épique</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #8b4513;"></div>
                    <span>Rareté Rare</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #5d4037;"></div>
                    <span>Rareté Commune</span>
                </div>
            </div>
    `;

    for (const [rang, raretes] of Object.entries(select_skins)) {
        html += `
            <div class="rang-section">
                <h2 class="rang-title">${rang}</h2>
        `;
        
        for (const [rarete, skins] of Object.entries(raretes)) {
            const rareteIcon = rarete.includes('LÉGENDAIRE') ? '🏆' : 
                              rarete.includes('ÉPIQUE') ? '✨' : 
                              rarete.includes('RARE') ? '🔮' : '📜';
            
            html += `
                <div class="rarete-category">
                    <h3 class="rarete-title">${rareteIcon} ${rarete}</h3>
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
                <p>© 2024 Origamy World - Tous droits réservés par décret royal</p>
                <p>Utilisez la commande !skins [nom] pour invoquer un skin spécifique</p>
                <p style="margin-top: 10px; font-size: 0.8em; opacity: 0.7;">
                    "Le pouvoir réside dans la transformation, non dans l'apparence"
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `grimoire_skins_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'grimoire_skins_origamy.html',
            caption: '*📜 GRIMOIRE DES SKINS - ORIGAMY WORLD 📜*\n\n' +
                     '*🏰 Statistiques du Royaume:*\n' +
                     `• Skins enregistrés: ${totalSkins}\n` +
                     `• Rangs disponibles: ${rangs.length}\n` +
                     '• Parchemin scellé à cette date\n\n' +
                     '*🔮 Commandes Magiques:*\n' +
                     '!skins - Ouvrir ce grimoire\n' +
                     '!skins [nom] - Invoquer un skin spécifique\n' +
                     '!skins random - Sort aléatoire\n' +
                     '!skins random [rang] - Sort par rang spécifique\n\n' +
                     '_Que la magie d\'Origamy vous guide..._'
        }, { quoted: ms });
    } catch (error) {
        console.error('Erreur d\'invocation du grimoire:', error);
        await zk.sendMessage(dest, { 
            text: '*❌ Le grimoire refuse de s\'ouvrir ! La magie est trop forte.*' 
        }, { quoted: ms });
    } finally {
        try {
            unlinkSync(filename);
        } catch (cleanError) {
            console.error('Erreur de nettoyage du sort:', cleanError);
        }
    }
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
        await zk.sendMessage(dest, { 
            text: '*🔮 Aucun skin trouvé avec ces critères magiques. Consultez le grimoire pour les sorts disponibles.*' 
        }, { quoted: ms });
        return;
    }

    const randomSkin = skinsFiltres[Math.floor(Math.random() * skinsFiltres.length)];
    const emojiRarete = randomSkin.rarete.includes('LÉGENDAIRE') ? '🏆' : 
                       randomSkin.rarete.includes('ÉPIQUE') ? '✨' : 
                       randomSkin.rarete.includes('RARE') ? '🔮' : '📜';

    await zk.sendMessage(dest, {
        image: { url: randomSkin.lien },
        caption: `*${emojiRarete} SORT ALÉATOIRE INVOQUÉ ${emojiRarete}*\n\n` +
                 `*📜 Nom du Skin:* ${randomSkin.nom}\n` +
                 `*⚔️ Rang:* ${randomSkin.rang}\n` +
                 `*✨ Rareté:* ${randomSkin.rarete}\n\n` +
                 `_Ce skin a été choisi par les anciens dieux d'Origamy..._`
    }, { quoted: ms });
}

// Commande principale : !skins ou !skins random [rang] [rarete]
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
