const { zokou } = require('../framework/zokou');
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

                // Icônes selon le rang
                const rangIcon = rang.includes('LEGENDAIRE') ? '🌟' : 
                                rang.includes('EPIQUE') ? '✨' : 
                                rang.includes('RARE') ? '💎' : '⭐';

                await zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `*${rangIcon} ${personnageUpper} ${rangIcon}*\n` +
                            `*🌌 Univers:* ${verse}\n` +
                            `*🏆 Rang:* ${rang}\n` +
                            `*💫 Puissance:* Niveau Multivers\n\n` +
                            `_Ce héros est prêt pour le combat dimensionnel !_`
                }, { quoted: ms });

                return;
            }
        }
    }

    if (!personnageTrouve) {
        await zk.sendMessage(dest, { 
            text: `*❌ PORTAL ERROR ! Le héros "${personnage}" n'existe pas dans cette dimension.*` 
        }, { quoted: ms });
    }
}

/**
 * Fonction pour envoyer la liste complète des personnages disponibles en document HTML.
 */
async function envoyerListe(dest, zk, ms) {
    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌌 ABM - Anime Battle Multivers</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Rajdhani', 'Arial', sans-serif;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(148, 0, 211, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 20, 147, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(0, 191, 255, 0.2) 0%, transparent 50%),
                    linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 30%, #2d2d5a 70%, #1a1a4a 100%);
                color: #ffffff;
                line-height: 1.6;
                padding: 20px;
                min-height: 100vh;
                background-attachment: fixed;
            }
            
            .multivers-container {
                max-width: 1300px;
                margin: 0 auto;
                background: rgba(10, 10, 40, 0.85);
                backdrop-filter: blur(10px);
                border: 3px solid;
                border-image: 
                    linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff) 1;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 
                    0 0 50px rgba(255, 0, 255, 0.3),
                    0 0 100px rgba(0, 255, 255, 0.2) inset;
                position: relative;
                overflow: hidden;
            }
            
            .multivers-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><circle cx="50" cy="50" r="2" fill="white"/><circle cx="20" cy="20" r="1" fill="white"/><circle cx="80" cy="80" r="1" fill="white"/></svg>');
                pointer-events: none;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 30px;
                border-bottom: 2px solid;
                border-image: linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent) 1;
                position: relative;
            }
            
            .title {
                font-size: 4em;
                background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
                margin-bottom: 10px;
                font-weight: 900;
                letter-spacing: 3px;
            }
            
            .subtitle {
                font-size: 1.4em;
                color: #00ffff;
                opacity: 0.9;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .stats-bar {
                display: flex;
                justify-content: space-around;
                background: rgba(0, 0, 0, 0.5);
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-number {
                font-size: 2em;
                color: #ff00ff;
                font-weight: bold;
            }
            
            .stat-label {
                font-size: 0.9em;
                color: #00ffff;
            }
            
            .rang-section {
                background: linear-gradient(90deg, 
                    rgba(255, 0, 255, 0.1), 
                    rgba(0, 255, 255, 0.1), 
                    rgba(255, 0, 255, 0.1));
                padding: 25px;
                border-radius: 15px;
                margin: 30px 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }
            
            .rang-title {
                font-size: 2.2em;
                text-align: center;
                margin-bottom: 25px;
                color: #ffff00;
                text-shadow: 0 0 15px rgba(255, 255, 0, 0.5);
                position: relative;
                display: inline-block;
                left: 50%;
                transform: translateX(-50%);
                padding: 0 20px;
            }
            
            .rang-title::before, .rang-title::after {
                content: '⚡';
                margin: 0 15px;
                opacity: 0.7;
            }
            
            .univers-category {
                background: rgba(0, 0, 0, 0.4);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid;
                border-image: linear-gradient(to bottom, #ff00ff, #00ffff) 1;
            }
            
            .univers-title {
                font-size: 1.6em;
                color: #00ffff;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .characters-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .character-card {
                background: linear-gradient(135deg, 
                    rgba(255, 0, 255, 0.2), 
                    rgba(0, 255, 255, 0.2));
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .character-card:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 
                    0 5px 25px rgba(255, 0, 255, 0.4),
                    0 0 50px rgba(0, 255, 255, 0.3);
                border-color: #ffff00;
            }
            
            .character-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.2), 
                    transparent);
                transition: left 0.5s;
            }
            
            .character-card:hover::before {
                left: 100%;
            }
            
            .character-name {
                font-weight: bold;
                color: #ffffff;
                font-size: 1.1em;
                text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
                margin-bottom: 5px;
            }
            
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid;
                border-image: linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent) 1;
                color: #888;
                font-size: 0.9em;
            }
            
            .command-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 10px;
                margin: 20px 0;
            }
            
            .command-item {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 5px;
                border-left: 3px solid #ff00ff;
            }
            
            @media (max-width: 768px) {
                .multivers-container {
                    padding: 15px;
                }
                
                .title {
                    font-size: 2.5em;
                }
                
                .characters-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats-bar {
                    flex-direction: column;
                    gap: 10px;
                }
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="multivers-container">
            <div class="header">
                <h1 class="title">🌌 ABM JUMP</h1>
                <p class="subtitle">Anime Battle Multivers - Catalogue Dimensionnel</p>
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
            <div class="stats-bar">
                <div class="stat-item">
                    <div class="stat-number">${totalPersonnages}</div>
                    <div class="stat-label">HÉROS MULTIVERS</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${totalUnivers}</div>
                    <div class="stat-label">UNIVERS</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${rangs.length}</div>
                    <div class="stat-label">RANGS</div>
                </div>
            </div>
            
            <div class="command-list">
                <div class="command-item">
                    <strong>!heroes</strong> - Ouvrir ce catalogue dimensionnel
                </div>
                <div class="command-item">
                    <strong>!heroes [nom]</strong> - Invoquer un héros spécifique
                </div>
                <div class="command-item">
                    <strong>!heroes random</strong> - Sélection aléatoire multivers
                </div>
                <div class="command-item">
                    <strong>!heroes random [rang]</strong> - Aléatoire par niveau
                </div>
            </div>
    `;

    for (const [rang, univers] of Object.entries(characters)) {
        const rangColor = rang.includes('LEGENDAIRE') ? '#ffd700' : 
                         rang.includes('EPIQUE') ? '#c77dff' : 
                         rang.includes('RARE') ? '#00ffff' : '#ffffff';

        html += `
            <div class="rang-section">
                <h2 class="rang-title" style="color: ${rangColor}">🏅 ${rang} 🏅</h2>
        `;
        
        for (const [verse, personnages] of Object.entries(univers)) {
            html += `
                <div class="univers-category">
                    <h3 class="univers-title">🌐 ${verse}</h3>
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
                <p>⚡ Système ABM v2.0 - Anime Battle Multivers Jump</p>
                <p>📡 Connexion dimensionnelle active - ${new Date().toLocaleDateString('fr-FR')}</p>
                <p style="margin-top: 10px; font-size: 0.8em; opacity: 0.7;">
                    "La bataille anime dépasse les frontières du réel"
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `catalogue_abm_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'abm_multivers_catalogue.html',
            caption: '*🌌 ANIME BATTLE MULTIVERS - CATALOGUE 🌌*\n\n' +
                     '*📊 STATISTIQUES DIMENSIONNELLES:*\n' +
                     `• Héros disponibles: ${totalPersonnages}\n` +
                     `• Univers explorés: ${totalUnivers}\n` +
                     `• Niveaux de puissance: ${rangs.length}\n\n` +
                     '*🎮 COMMANDES DE SAUT MULTIVERS:*\n' +
                     '`!heroes` - Catalogue complet\n' +
                     '`!heroes [nom]` - Fiche personnage\n' +
                     '`!heroes random` - Saut aléatoire\n' +
                     '`!heroes random [rang]` - Saut ciblé\n\n' +
                     '_Préparez-vous pour la bataille anime ultime !_ ⚡'
        }, { quoted: ms });
    } catch (error) {
        console.error('Erreur de saut dimensionnel:', error);
        await zk.sendMessage(dest, { 
            text: '*❌ ERREUR DE PORTAL ! Impossible d\'accéder au catalogue dimensionnel.*' 
        }, { quoted: ms });
    } finally {
        try {
            unlinkSync(filename);
        } catch (cleanError) {
            console.error('Erreur de nettoyage dimensionnel:', cleanError);
        }
    }
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
        await zk.sendMessage(dest, { 
            text: '*🌌 AUCUN HÉROS TROUVÉ ! Vérifiez les coordonnées dimensionnelles.*' 
        }, { quoted: ms });
        return;
    }

    const randomPerso = personnagesFiltres[Math.floor(Math.random() * personnagesFiltres.length)];
    const rangIcon = randomPerso.rang.includes('LEGENDAIRE') ? '🌟' : 
                    randomPerso.rang.includes('EPIQUE') ? '✨' : 
                    randomPerso.rang.includes('RARE') ? '💎' : '⭐';

    await zk.sendMessage(dest, { 
        image: { url: randomPerso.lien }, 
        caption: `*${rangIcon} SAUT MULTIVERS RÉUSSI ${rangIcon}*\n\n` +
                `*👤 Héros:* ${randomPerso.nom}\n` +
                `*🌌 Univers:* ${randomPerso.verse}\n` +
                `*🏆 Rang:* ${randomPerso.rang}\n\n` +
                `_Ce héros répond à l'appel de la bataille dimensionnelle !_`
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
