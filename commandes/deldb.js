const { zokou } = require("../framework/zokou");
const { Client } = require('pg');

// Commande pour réinitialiser la base de données
zokou({
  nomCom: "resetdb",
  categorie: "MON-BOT",
  reaction: "🗑️",
  description: "Réinitialise complètement la base de données (SUPER USER ONLY)"
}, async (dest, zk, { arg, repondre, superUser }) => {

  // Vérification des permissions super utilisateur
  if (!superUser) {
    return repondre("❌ Commande réservée aux super utilisateurs !");
  }

  // Demande de confirmation
  const confirmation = arg.join(' ').toLowerCase();
  if (confirmation !== 'confirm') {
    return repondre("⚠️ *ATTENTION* ⚠️\nCette commande va supprimer TOUTES les données de la base de données!\n\nPour confirmer, tapez: *-resetdb confirm*");
  }

  try {
    // Envoi d'un message de démarrage
    await repondre("🔄 Début de la réinitialisation de la base de données...");

    // Connexion à la base de données avec SSL
    const client = new Client({
      connectionString: 'postgresql://postgres.ljfkkbvxgflluphnibhp:U.*pF.tueSKb7r3@aws-1-eu-north-1.pooler.supabase.com:6543/postgres',
      ssl: {
        rejectUnauthorized: false // Nécessaire pour Supabase
      }
    });

    await client.connect();

    // Déconnecter tous les utilisateurs
    await client.query(`
      REVOKE CONNECT ON DATABASE postgres FROM public;
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'postgres';
    `);

    // Supprimer et recréer la base
    await client.query('DROP DATABASE IF EXISTS postgres;');
    await client.query('CREATE DATABASE postgres;');

    await client.end();

    // Message de succès
    await repondre("✅ Base de données réinitialisée avec succès!\nToutes les données ont été supprimées.");

  } catch (error) {
    console.error('Erreur réinitialisation DB:', error);
    
    // Message d'erreur plus détaillé
    if (error.code === '3D000') {
      await repondre("❌ Impossible de supprimer la base 'postgres' car elle est actuellement utilisée.\nEssayez de vous connecter à une autre base pour effectuer cette opération.");
    } else {
      await repondre("❌ Erreur lors de la réinitialisation: " + error.message);
    }
  }
});

// Alternative: Commande pour vider toutes les tables sans supprimer la base
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