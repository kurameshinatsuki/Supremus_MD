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
 * Fonction pour encoder une image en base64 (simulation)
 * Dans la réalité, vous devriez télécharger l'image et la convertir
 */
function encoderImageBase64(url) {
    // Cette fonction devrait normalement télécharger l'image et la convertir en base64
    // Pour l'exemple, on retourne une image SVG simple encodée
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNQRUVEIFJVU0g8L3RleHQ+Cjwvc3ZnPg==";
}

/**
 * Fonction pour envoyer la liste complète des véhicules disponibles en HTML autonome
 */
async function envoyerListeVehicules(dest, zk, ms) {
    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏁 CATALOGUE SPEED RUSH - SRPN</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #ffffff;
                line-height: 1.6;
                padding: 20px;
                min-height: 100vh;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                border: 2px solid #f39c12;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #f39c12;
            }
            
            .title {
                font-size: 2.8em;
                color: #f39c12;
                text-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
                margin-bottom: 10px;
                font-weight: bold;
                letter-spacing: 2px;
            }
            
            .subtitle {
                font-size: 1.2em;
                color: #3498db;
                opacity: 0.9;
            }
            
            .categorie {
                background: linear-gradient(90deg, #e74c3c, #c0392b);
                padding: 15px;
                border-radius: 10px;
                margin: 25px 0 15px 0;
                font-size: 1.4em;
                text-align: center;
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            }
            
            .type {
                background: rgba(52, 152, 219, 0.2);
                padding: 12px;
                border-radius: 8px;
                margin: 20px 0 10px 0;
                font-size: 1.2em;
                color: #3498db;
                border-left: 4px solid #3498db;
            }
            
            .vehicules-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }
            
            .vehicule-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .vehicule-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 20px rgba(243, 156, 18, 0.4);
                background: rgba(243, 156, 18, 0.1);
            }
            
            .vehicule-nom {
                font-weight: bold;
                color: #f1c40f;
                font-size: 1.1em;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #f39c12;
                color: #95a5a6;
                font-size: 0.9em;
            }
            
            .badge {
                display: inline-block;
                background: #e74c3c;
                color: white;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8em;
                margin-left: 10px;
            }
            
            @media (max-width: 768px) {
                .container {
                    padding: 15px;
                }
                
                .title {
                    font-size: 2em;
                }
                
                .vehicules-list {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🏁 CATALOGUE SPEED RUSH 🏁</h1>
                <p class="subtitle">Votre sélection de véhicules premium - SRPN Edition</p>
            </div>
    `;

    // Compter le nombre total de véhicules
    let totalVehicules = 0;
    for (const [categorie, types] of Object.entries(select_cars)) {
        for (const [type, vehicules] of Object.entries(types)) {
            totalVehicules += Object.keys(vehicules).length;
        }
    }

    html += `<div style="text-align: center; margin-bottom: 20px;">
                <span class="badge">Total: ${totalVehicules} véhicules</span>
             </div>`;

    for (const [categorie, types] of Object.entries(select_cars)) {
        html += `<div class="categorie">🚗 ${categorie.toUpperCase()}</div>`;
        
        for (const [type, vehicules] of Object.entries(types)) {
            html += `<div class="type">🔹 ${type}</div>
                     <div class="vehicules-list">`;
            
            for (const nom of Object.keys(vehicules)) {
                html += `<div class="vehicule-item">
                            <div class="vehicule-nom">${nom}</div>
                         </div>`;
            }
            
            html += `</div>`;
        }
    }

    html += `
            <div class="footer">
                <p>© 2024 SPEED RUSH - SRPN | Catalogue automatiquement généré</p>
                <p>Utilisez la commande !vehicles [nom] pour voir un véhicule spécifique</p>
            </div>
        </div>
    </body>
    </html>`;

    const filename = `catalogue_speedrush_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    try {
        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'speedrush_catalogue.html',
            caption: '*🏁 SPEED RUSH - CATALOGUE COMPLET 🏁*\n\n' +
                     '*📊 Statistiques:*\n' +
                     `• Nombre total de véhicules: ${totalVehicules}\n` +
                     '• Catégories disponibles: ' + Object.keys(select_cars).length + '\n\n' +
                     '*💡 Comment utiliser:*\n' +
                     '!vehicles - Voir ce catalogue\n' +
                     '!vehicles [nom] - Voir un véhicule spécifique\n' +
                     '!vehicles random - Véhicule aléatoire\n' +
                     '!vehicles random [catégorie] - Aléatoire par catégorie'
        }, { quoted: ms });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du catalogue:', error);
        zk.sendMessage(dest, { 
            text: '*❌ Erreur lors de la génération du catalogue.*' 
        }, { quoted: ms });
    } finally {
        // Nettoyer le fichier temporaire
        try {
            unlinkSync(filename);
        } catch (cleanError) {
            console.error('Erreur lors du nettoyage:', cleanError);
        }
    }
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
        zk.sendMessage(dest, { text: '*❌ Aucun véhicule trouvé avec ces critères.*' }, { quoted: ms });
        return;
    }

    const randomVehicule = vehiculesFiltres[Math.floor(Math.random() * vehiculesFiltres.length)];

    zk.sendMessage(dest, { 
        image: { url: randomVehicule.lien }, 
        caption: `*🎲 VÉHICULE ALÉATOIRE 🎲*\n\n` +
                 `*🏎️ Modèle:* ${randomVehicule.nom}\n` +
                 `*📂 Catégorie:* ${randomVehicule.categorie}\n` +
                 `*🔧 Type:* ${randomVehicule.type}\n\n` +
                 `*💡 Conseil:* Utilisez "!vehicles random [catégorie]" pour plus de précision`
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
