const { Pool } = require("pg");
const s = require("../set");

// Config de la base de données
var dbUrl = s.SPDB;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour créer les tables si elles n'existent pas encore
async function createTables() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_profiles(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        statut TEXT DEFAULT 'Novice',
        mode TEXT DEFAULT 'Free',
        rang_abm TEXT DEFAULT 'aucun',
        rang_speed_rush TEXT DEFAULT 'aucun',
        rang_yugioh TEXT DEFAULT 'aucun',
        champion TEXT DEFAULT 'aucun',
        specialite TEXT DEFAULT 'aucune',
        leader TEXT DEFAULT 'aucun',
        defis_remportes INTEGER DEFAULT 0,
        legende TEXT DEFAULT 'aucune'
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS player_stats(
        player_id INTEGER REFERENCES player_profiles(id),
        victoires INTEGER DEFAULT 0,
        defaites INTEGER DEFAULT 0,
        forfaits INTEGER DEFAULT 0,
        top3 INTEGER DEFAULT 0,
        missions_reussies INTEGER DEFAULT 0,
        missions_echouees INTEGER DEFAULT 0,
        PRIMARY KEY (player_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS player_heroes(
        player_id INTEGER REFERENCES player_profiles(id),
        amb_cards TEXT DEFAULT 'aucun',
        vehicles TEXT DEFAULT 'aucun',
        yugioh_deck TEXT DEFAULT 'aucun',
        skins TEXT DEFAULT 'aucun',
        items TEXT DEFAULT 'aucun',
        PRIMARY KEY (player_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS player_currency(
        player_id INTEGER REFERENCES player_profiles(id),
        s_tokens INTEGER DEFAULT 0,
        s_gemmes INTEGER DEFAULT 0,
        coupons INTEGER DEFAULT 0,
        box_vip INTEGER DEFAULT 0,
        compteur INTEGER DEFAULT 0,
        PRIMARY KEY (player_id)
      );
    `);

    console.log('Tables créées avec succès');
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error);
  } finally {
    client.release();
  }
}

// Fonction pour insérer un profil de joueur
async function insertPlayerProfile(username) {
  const client = await pool.connect();

  try {
    const query = `
      INSERT INTO player_profiles(username)
      VALUES ($1) RETURNING id;
    `;
    const result = await client.query(query, [username]);

    const playerId = result.rows[0].id;

    await client.query(`INSERT INTO player_stats(player_id) VALUES ($1)`, [playerId]);
    await client.query(`INSERT INTO player_heroes(player_id) VALUES ($1)`, [playerId]);
    await client.query(`INSERT INTO player_currency(player_id) VALUES ($1)`, [playerId]);

    console.log(`Profil du joueur créé avec succès : ID ${playerId}`);
  } catch (error) {
    console.error('Erreur lors de la création du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer les données du joueur
async function getPlayerProfile(identifier) {
  const client = await pool.connect();

  try {
    let query;
    if (isNaN(identifier)) {
      query = `
        SELECT p.*, s.*, h.*, c.*
        FROM player_profiles p
        LEFT JOIN player_stats s ON p.id = s.player_id
        LEFT JOIN player_heroes h ON p.id = h.player_id
        LEFT JOIN player_currency c ON p.id = c.player_id
        WHERE p.username = $1;
      `;
    } else {
      query = `
        SELECT p.*, s.*, h.*, c.*
        FROM player_profiles p
        LEFT JOIN player_stats s ON p.id = s.player_id
        LEFT JOIN player_heroes h ON p.id = h.player_id
        LEFT JOIN player_currency c ON p.id = c.player_id
        WHERE p.id = $1;
      `;
    }

    const result = await client.query(query, [identifier]);

    if (result.rows.length === 0) {
      console.log("Joueur non trouvé");
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Fonction pour mettre à jour le profil du joueur
async function updatePlayerProfile(username, updates) {
  const client = await pool.connect();

  try {
    let setClauses = [];
    let values = [];
    let index = 1;

    // Construire dynamiquement la requête de mise à jour
    for (let field in updates) {
      setClauses.push(`${field} = $${index}`);
      values.push(updates[field]);
      index++;
    }

    const query = `
      UPDATE player_profiles
      SET ${setClauses.join(', ')}
      WHERE username = $${index}
    `;

    values.push(username);

    await client.query(query, values);

    console.log(`Profil du joueur ${username} mis à jour avec succès`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Appel de la fonction pour créer les tables
createTables();

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile
};