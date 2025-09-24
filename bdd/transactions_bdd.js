require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

// Configuration de la base de données (utilisation de la même config que player_bdd)
const dbUrl = s.SPDB;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour générer un ID unique de transaction (ex: be824fa5002b)
function generateTransactionId() {
  return Math.random().toString(16).slice(2, 14); // Génère une chaîne hexadécimale de 12 caractères
}

// Création de la table des transactions si elle n'existe pas
async function createTransactionTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions(
        id TEXT PRIMARY KEY,
        player_name TEXT NOT NULL,
        type TEXT NOT NULL,
        details TEXT NOT NULL,
        gains TEXT NOT NULL,
        montant INTEGER NOT NULL,
        date TEXT NOT NULL,
        heure TEXT NOT NULL,
        statut TEXT DEFAULT 'valider',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[BDD Transactions] Table transactions vérifiée/créée.');
  } catch (error) {
    console.error('[BDD Transactions] Erreur création table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Insère une nouvelle transaction dans la base
async function insertTransaction(transactionData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      player_name,
      type,
      details,
      gains,
      montant,
      date,
      heure,
      statut = 'valider'
    } = transactionData;

    // Génération d'un ID unique
    const id = generateTransactionId();

    const query = `
      INSERT INTO transactions(id, player_name, type, details, gains, montant, date, heure, statut)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [id, player_name, type, details, gains, montant, date, heure, statut];
    const res = await client.query(query, values);

    await client.query('COMMIT');
    console.log(`[BDD Transactions] Transaction enregistrée: ${id} pour ${player_name}`);
    return res.rows[0]; // Retourne la transaction créée

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Transactions] Erreur insertion transaction:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupère une transaction par son ID
async function getTransaction(transactionId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM transactions WHERE id = $1;`,
      [transactionId]
    );

    if (res.rows.length === 0) {
      console.log(`[BDD Transactions] Transaction non trouvée: ${transactionId}`);
      return null;
    }

    return res.rows[0];
  } catch (error) {
    console.error('[BDD Transactions] Erreur récupération transaction:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupère les transactions d'un joueur
async function getPlayerTransactions(playerName, limit = 10) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM transactions WHERE player_name = $1 ORDER BY timestamp DESC LIMIT $2;`,
      [playerName, limit]
    );

    console.log(`[BDD Transactions] ${res.rows.length} transactions trouvées pour ${playerName}`);
    return res.rows;
  } catch (error) {
    console.error('[BDD Transactions] Erreur récupération transactions joueur:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Supprime les transactions plus anciennes qu'une certaine date (pour libérer l'espace)
async function deleteOldTransactions(daysOld = 30) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `DELETE FROM transactions WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '${daysOld} days' RETURNING *;`
    );

    await client.query('COMMIT');
    console.log(`[BDD Transactions] ${res.rowCount} transactions supprimées (plus vieilles que ${daysOld} jours).`);
    return res.rowCount;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Transactions] Erreur suppression anciennes transactions:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialisation de la table au démarrage
createTransactionTable().catch(err => {
  console.error('[BDD Transactions CRITIQUE] Erreur initialisation:', err);
});

module.exports = {
  insertTransaction,
  getTransaction,
  getPlayerTransactions,
  deleteOldTransactions
};