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
  const timestamp = Date.now();
  return `${name}_${timestamp}`;
}

// Création des tables si elles n'existent pas encore
async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS player_profiles(
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
         statut TEXT DEFAULT '🕹️Player',
         mode TEXT DEFAULT '🆓Free',
         supremus_cup TEXT DEFAULT '0',
         division TEXT DEFAULT '🥉Bronze',
         statut_abm TEXT DEFAULT 'aucun',
         statut_speed_rush TEXT DEFAULT 'aucun',
         statut_yugioh TEXT DEFAULT 'aucun',
         statut_origamy_world TEXT DEFAULT 'aucun',
         best_game TEXT DEFAULT 'aucun',
         defi_hebdo INTEGER DEFAULT 0,
         challenge INTEGER DEFAULT 0,
         victoires INTEGER DEFAULT 0,
         defaites INTEGER DEFAULT 0,
         forfaits INTEGER DEFAULT 0,
         top3 INTEGER DEFAULT 0,
         supremus_points INTEGER DEFAULT 0,
         box_vip TEXT DEFAULT 'aucun',
         heroes TEXT DEFAULT 'aucun',
         vehicles TEXT DEFAULT 'aucun',
         yugioh_deck TEXT DEFAULT 'aucun',
         skins TEXT DEFAULT 'aucun',
         rank TEXT DEFAULT 'aucun',
         xp INTEGER DEFAULT 0,
         sante INTEGER DEFAULT 0,
         energie INTEGER DEFAULT 0,
         heart INTEGER DEFAULT 0,
         faim INTEGER DEFAULT 0,
         soif INTEGER DEFAULT 0,
         reputation TEXT DEFAULT '0🎭',
         items TEXT DEFAULT 'aucun',
         s_tokens INTEGER DEFAULT 0,
         s_gemmes INTEGER DEFAULT 0,
         coupons INTEGER DEFAULT 0,
         acceuil INTEGER DEFAULT 0,
         arbitrage INTEGER DEFAULT 0,
         transaction INTEGER DEFAULT 0,
         diffusion INTEGER DEFAULT 0,
         designs INTEGER DEFAULT 0,
         story INTEGER DEFAULT 0,
         balance INTEGER DEFAULT 0,
         depenses INTEGER DEFAULT 0,
         profits INTEGER DEFAULT 0,
         retraits INTEGER DEFAULT 0,
         solde INTEGER DEFAULT 0
      );
    `);
    console.log('[BDD] Table player_profiles vérifiée/créée');
  } catch (error) {
    console.error('Erreur création table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Supprime un profil de joueur
async function deletePlayerProfile(name) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `DELETE FROM player_profiles WHERE name = $1 RETURNING *;`,
      [name]
    );

    if (res.rowCount === 0) {
      console.log(`[BDD] Profil non trouvé: ${name}`);
      return false;
    }

    console.log(`[BDD] Profil supprimé: ${name}`);
    return true;
  } catch (error) {
    console.error('Erreur suppression profil:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Insère un profil de joueur
async function insertPlayerProfile(name) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifie si le profil existe déjà
    const exists = await client.query(
      `SELECT 1 FROM player_profiles WHERE name = $1;`,
      [name]
    );

    if (exists.rows.length > 0) {
      console.log(`[BDD] Profil ${name} existe déjà`);
      await client.query('COMMIT');
      return;
    }

    const id = generateUniqueId(name);
    await client.query(
      `INSERT INTO player_profiles(id, name) VALUES ($1, $2);`,
      [id, name]
    );

    await client.query('COMMIT');
    console.log(`[BDD] Profil créé: ${name}`);
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur création profil:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupère les données du joueur
async function getPlayerProfile(name) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM player_profiles WHERE name = $1;`,
      [name]
    );

    if (res.rows.length === 0) {
      console.log(`[BDD] Profil non trouvé: ${name}`);
      return null;
    }
    
    // Convertit tous les champs en string pour compatibilité
    const profile = res.rows[0];
    for (const key in profile) {
      if (profile[key] !== null && typeof profile[key] !== 'string') {
        profile[key] = String(profile[key]);
      }
    }
    
    return profile;
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Met à jour le profil du joueur
async function updatePlayerProfile(name, updates) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifie si le profil existe
    const exists = await client.query(
      `SELECT 1 FROM player_profiles WHERE name = $1;`,
      [name]
    );
    
    if (exists.rows.length === 0) {
      console.log(`[BDD] Profil non trouvé pour mise à jour: ${name}`);
      await client.query('COMMIT');
      return false;
    }

    // Construction de la requête dynamique
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [field, value] of Object.entries(updates)) {
      setClauses.push(`${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      console.log('[BDD] Aucune mise à jour fournie');
      await client.query('COMMIT');
      return false;
    }

    values.push(name);
    const query = `
      UPDATE player_profiles
      SET ${setClauses.join(', ')}
      WHERE name = $${paramIndex}
      RETURNING *;
    `;

    const res = await client.query(query, values);
    await client.query('COMMIT');
    console.log(`[BDD] Profil ${name} mis à jour avec succès`);
    return res.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur mise à jour profil:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialisation de la base de données
createTables().catch(err => {
  console.error('[BDD CRITIQUE] Erreur initialisation:', err);
  process.exit(1);
});

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile,
  deletePlayerProfile 
};