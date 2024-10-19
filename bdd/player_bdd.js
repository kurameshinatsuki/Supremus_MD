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
    // Créer la table des profils des joueurs
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_profiles(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        statut TEXT DEFAULT 'Novice', -- Statut du joueur (Novice, Maître, Expert)
        mode TEXT DEFAULT 'Free', -- Mode du joueur (Free/Pro)
        rang_abm TEXT DEFAULT 'aucun',
        rang_speed_rush TEXT DEFAULT 'aucun',
        rang_yugioh TEXT DEFAULT 'aucun',
        champion TEXT DEFAULT 'aucun', -- Dernière performance ou titre
        specialite TEXT DEFAULT 'aucune', -- Spécialité du joueur
        leader TEXT DEFAULT 'aucun', -- Leader d'équipe
        defis_remportes INTEGER DEFAULT 0, -- Nombre de défis remportés
        legende TEXT DEFAULT 'aucune' -- Classements légendaires
      );
    `);

    // Créer la table des stats de jeu
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

    // Créer la table des héros de jeu
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_heroes(
        player_id INTEGER REFERENCES player_profiles(id),
        amb_cards TEXT DEFAULT 'aucun', -- Personnages ABM
        vehicles TEXT DEFAULT 'aucun', -- Véhicules pour Speed Rush
        yugioh_deck TEXT DEFAULT 'aucun', -- Deck Yu-Gi-Oh
        skins TEXT DEFAULT 'aucun', -- Skins Origamy World
        items TEXT DEFAULT 'aucun', -- Items Origamy World
        PRIMARY KEY (player_id)
      );
    `);

    // Créer la table des devises
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_currency(
        player_id INTEGER REFERENCES player_profiles(id),
        s_tokens INTEGER DEFAULT 0,
        s_gemmes INTEGER DEFAULT 0,
        coupons INTEGER DEFAULT 0,
        box_vip INTEGER DEFAULT 0,
        PRIMARY KEY (player_id)
      );
    `);

    // Créer la table pour la section COMPTE (transactions d'argent réel)
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_account(
        player_id INTEGER REFERENCES player_profiles(id),
        depenses INTEGER DEFAULT 0, -- Total des dépenses
        profits INTEGER DEFAULT 0, -- Total des profits
        retraits INTEGER DEFAULT 0, -- Total des retraits
        solde INTEGER DEFAULT 0, -- Solde actuel
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

    // Initialiser les stats, devises et comptes pour le joueur
    await client.query(`INSERT INTO player_stats(player_id) VALUES ($1)`, [playerId]);
    await client.query(`INSERT INTO player_heroes(player_id) VALUES ($1)`, [playerId]);
    await client.query(`INSERT INTO player_currency(player_id) VALUES ($1)`, [playerId]);
    await client.query(`INSERT INTO player_account(player_id) VALUES ($1)`, [playerId]);

    console.log(`Profil du joueur créé avec succès : ID ${playerId}`);
    return playerId;
  } catch (error) {
    console.error('Erreur lors de la création du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer les données du joueur via l'ID ou le nom d'utilisateur
async function getPlayerProfile(PlayerName) {
  const client = await pool.connect();

  try {
    let query = `
      SELECT p.*, s.*, h.*, c.*, a.*
      FROM player_profiles p
      LEFT JOIN player_stats s ON p.id = s.player_id
      LEFT JOIN player_heroes h ON p.id = h.player_id
      LEFT JOIN player_currency c ON p.id = c.player_id
      LEFT JOIN player_account a ON p.id = a.player_id
      WHERE p.username = $1;
    `;

    const result = await client.query(query, [PlayerName]);

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

// Fonction pour mettre à jour un champ spécifique dans le profil du joueur
async function updatePlayerProfile(PlayerName, field, value) {
  const client = await pool.connect();

  try {
    const query = `
      UPDATE player_profiles
      SET ${field} = $2
      WHERE username = $1
      RETURNING *;
    `;
    const result = await client.query(query, [PlayerName, value]);

    if (result.rows.length === 0) {
      console.log("Aucun profil mis à jour");
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil du joueur:', error);
  } finally {
    client.release();
  }
}

// Fonction pour vérifier l'existence d'un profil et le créer si besoin
async function getOrCreatePlayerProfile(PlayerName) {
  let profile = await getPlayerProfile(PlayerName);

  if (!profile) {
    console.log(`Création d'un nouveau profil pour ${PlayerName}`);
    const playerId = await insertPlayerProfile(PlayerName);
    profile = await getPlayerProfile(PlayerName);
  }

  return profile;
}

// Appel de la fonction pour créer les tables
createTables();

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile,
  getOrCreatePlayerProfile
};