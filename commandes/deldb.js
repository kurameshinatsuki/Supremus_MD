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