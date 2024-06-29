const fs = require('fs-extra');
const path = require("path");

if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

const SPDB = process.env.SPDB || 'postgres://defaultConnectionString';

if (!SPDB) {
    console.error('Erreur : SPDB n\'est pas défini dans les variables d\'environnement.');
    process.exit(1);
}

module.exports = {
    session: process.env.SESSION_ID || 'zokk',
    PREFIXE: process.env.PREFIX || "~",
    OWNER_NAME: process.env.OWNER_NAME || "Zokou-Md",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "Djalega",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Zokou_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    CHATBOT : process.env.PM_CHATBOT || 'no',  
    SPDB,         
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    e1: process.env.aucun,
    e2: process.env.aucun,
    e3: process.env.aucun,
    e4: process.env.0,
    e5: process.env.0,
    e6: process.env.aucun,
    e7: process.env.0,
    e8: process.env.0,
    e9: process.env.aucun,
    e10: process.env.0,
    e11: process.env.0,
    e12: process.env.0,
    e13: process.env.aucun,
    e14: process.env.0,
    e15: process.env.0,
    e16: process.env.0,
    e17: process.env.0,
    e18: process.env.0,
    e19: process.env.aucun,
    e20: process.env.aucun,
    e21: process.env.0,
    e22: process.env.0,
    e23: process.env.aucun,
    e24: process.env.0,
    e25: process.env.0,
    e26: process.env.0,
    e27: process.env.0,
    // Ajoutez plus de variables pour les autres colonnes
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
