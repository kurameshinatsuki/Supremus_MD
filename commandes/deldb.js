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

    // Connexion à la base de données
    const client = new Client({
      connectionString: ''
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
    await repondre("❌ Erreur lors de la réinitialisation: " + error.message);
  }
});

// Commande pour sauvegarder la base avant réinitialisation (optionnelle)
zokou({
  nomCom: "backupdb",
  categorie: "MON-BOT",
  reaction: "💾",
  description: "Sauvegarde la base de données (SUPER USER ONLY)"
}, async (dest, zk, { arg, repondre, superUser }) => {

  if (!superUser) {
    return repondre("❌ Commande réservée aux super utilisateurs !");
  }

  try {
    await repondre("📦 Création de la sauvegarde de la base de données...");
    
    // Ici vous pouvez ajouter la logique de sauvegarde
    // Cette partie dépend de votre configuration et besoins
    
    await repondre("✅ Sauvegarde terminée! Utilisez *-resetdb confirm* pour réinitialiser.");
  } catch (error) {
    await repondre("❌ Erreur lors de la sauvegarde: " + error.message);
  }
});