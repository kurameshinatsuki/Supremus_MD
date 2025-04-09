require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

// Configuration de la base de données
const dbUrl = s.SPDB;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour générer un ID unique
function generateUniqueId(name) {
  const timestamp = Date.now(); // Timestamp actuel
  return `${name}_${timestamp}`; // Combinaison du nom et du timestamp
}

// Création des tables si elles n'existent pas encore
async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_profiles(
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        acceuil INTEGER DEFAULT 0,
        arbitrage INTEGER DEFAULT 0,
        transaction INTEGER DEFAULT 0,
        diffusion INTEGER DEFAULT 0,
        designs INTEGER DEFAULT 0,
        story INTEGER DEFAULT 0,
        solde INTEGER DEFAULT 0
      );
    `);
    console.log('Table créée ou déjà existante');
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error);
  } finally {
    client.release();
  }
}

// Insère un profil de joueur s'il n'existe pas déjà
async function insertPlayerProfile(name) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Début de la transaction

    const queryExistence = `
      SELECT 1 FROM player_profiles WHERE name = $1;
    `;
    const resultExistence = await client.query(queryExistence, [name]);

    if (resultExistence.rows.length > 0) {
      console.log(`Le profil du joueur ${name} existe déjà.`);
      await client.query('COMMIT');
      return;
    }

    const id = generateUniqueId(name); // Génération de l'ID
    const queryInsert = `
      INSERT INTO player_profiles(id, name)
      VALUES ($1, $2);
    `;
    await client.query(queryInsert, [id, name]);

    await client.query('COMMIT'); // Validation de la transaction
    console.log(`Profil du joueur créé avec succès : Nom ${name}`);
  } catch (error) {
    await client.query('ROLLBACK'); // Annulation de la transaction en cas d'erreur
    console.error('Erreur lors de la création du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Récupère les données du joueur
async function getPlayerProfile(name) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM player_profiles WHERE name = $1;
    `;
    const result = await client.query(query, [name]);

    if (result.rows.length === 0) {
      console.log(`Joueur non trouvé : ${name}`);
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Met à jour le profil du joueur
async function updatePlayerProfile(name, updates) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Début de la transaction

    const setClauses = [];
    const values = [];
    let index = 1;

    for (const field in updates) {
      setClauses.push(`${field} = $${index}`);
      values.push(updates[field]);
      index++;
    }

    if (setClauses.length === 0) {
      console.log("Aucune mise à jour fournie");
      await client.query('COMMIT');
      return;
    }

    const query = `
      UPDATE player_profiles
      SET ${setClauses.join(', ')}
      WHERE name = $${index}
      RETURNING *;
    `;
    values.push(name);

    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      console.log(`Joueur non trouvé pour mise à jour : ${name}`);
      await client.query('COMMIT');
      return null;
    }

    await client.query('COMMIT'); // Validation de la transaction
    console.log(`Profil du joueur ${name} mis à jour avec succès`);
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK'); // Annulation de la transaction en cas d'erreur
    console.error('Erreur lors de la mise à jour du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Crée les tables à l'initialisation
createTables();

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile
};