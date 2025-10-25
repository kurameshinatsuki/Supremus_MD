const fs = require('fs-extra');
const path = require("path");
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

// Vérifiez si SPDB est défini dans les variables d'environnement
const SPDB = process.env.SPDB || 'postgres://defaultConnectionString';

if (!SPDB) {
    console.error('Erreur : SPDB n\'est pas défini dans les variables d\'environnement.');
    process.exit(1);
}

module.exports = {
    session: process.env.SESSION_ID || 'zokk',
    SESSION: process.env.SESSION || "",
    PREFIXE: process.env.PREFIX || "-",
    OWNER_NAME: process.env.OWNER_NAME || "Supremus-Prod",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "22554191184",
    NUMERO_PAIR : process.env.NUMERO_PAIR || "22554191184",                            
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'SUPREMSUS',
    URL : process.env.BOT_MENU_LINKS || 'https://i.ibb.co/k81T2WX/image.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '1',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    CHATBOT : process.env.PM_CHATBOT || 'no',  
    SPDB,         
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres.pcmtctkaornpxwlpnpyj:ZW877$iP9-BZC6W@aws-0-eu-west-2.pooler.supabase.com:5432/postgres" : "postgresql://postgres.pcmtctkaornpxwlpnpyj:ZW877$iP9-BZC6W@aws-0-eu-west-2.pooler.supabase.com:5432/postgres",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
    })
    : new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
    }),*/
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

