const { zokou } = require("../framework/zokou");
const { Client } = require('pg');

// Commande pour vider toutes les tables
zokou({
  nomCom: "cleardb",
  categorie: "MON-BOT",
  reaction: "🧹",
  description: "Vide toutes les tables de la base (SUPER USER ONLY)"
}, async (dest, zk, { arg, repondre, superUser }) => {

  if (!superUser) {
    return repondre("❌ Commande réservée aux super utilisateurs !");
  }

  // Demande de confirmation
  const confirmation = arg.join(' ').toLowerCase();
  if (confirmation !== 'confirm') {
    return repondre("⚠️ *ATTENTION* ⚠️\nCette commande va vider TOUTES les tables de la base de données!\n\nPour confirmer, tapez: *-cleardb confirm*");
  }

  try {
    await repondre("🧹 Nettoyage de toutes les tables...");

    const client = new Client({
      connectionString: 'postgresql://postgres.ljfkkbvxgflluphnibhp:U.*pF.tueSKb7r3@aws-1-eu-north-1.pooler.supabase.com:6543/postgres',
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Récupérer toutes les tables
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    // Vider chaque table
    for (const table of tablesRes.rows) {
      await client.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
    }
    
    await client.end();
    
    await repondre(`✅ Base de données nettoyée! ${tablesRes.rows.length} tables vidées.`);
    
  } catch (error) {
    console.error('Erreur nettoyage DB:', error);
    await repondre("❌ Erreur lors du nettoyage: " + error.message);
  }
});

zokou({
    nomCom: "getsession",
    categorie: "MON-BOT",
    reaction: "💾"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;
    
    if (!superUser) return repondre("❌ Owner uniquement");

    try {
        const fs = require('fs-extra');
        const path = require('path');
        const authDir = path.join(__dirname, '/auth');
        
        if (!fs.existsSync(authDir)) {
            return repondre("❌ Dossier auth introuvable");
        }

    // Lire directement le fichier creds.json pour la session
        const credsPath = path.join(authDir, 'creds.json');
        if (fs.existsSync(credsPath)) {
            const rawCreds = await fs.readFile(credsPath, 'utf8');
            const sessionBase64 = Buffer.from(rawCreds).toString('base64');
            
            await repondre(`💾 SESSION BASE64 (${sessionBase64.length} caractères):\n\`\`\`${sessionBase64}\`\`\``);
        } else {
            await repondre("❌ Fichier creds.json introuvable");
        }

    } catch (error) {
        console.error(error);
        repondre("❌ Erreur: " + error.message);
    }
});