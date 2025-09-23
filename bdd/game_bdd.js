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

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL:', err);
});

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    // Vérifier la connexion
    await pool.query('SELECT NOW()');
    console.log('✅ Connecté à PostgreSQL avec succès');

    // Créer les tables si elles n'existent pas
    await createTables();
    await createDecksTables(); // Ajout des tables pour les decks
    console.log('✅ Tables initialisées avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Script de création des tables principales
async function createTables() {
  const createTablesQuery = `
    -- Table pour les duels ABM (Anime Battle Multivers)
    CREATE TABLE IF NOT EXISTS duels_abm (
      id SERIAL PRIMARY KEY,
      duel_key VARCHAR(500) UNIQUE NOT NULL,
      equipe1 JSONB NOT NULL,
      equipe2 JSONB NOT NULL,
      stats_custom TEXT DEFAULT 'Non defini',
      arene_nom VARCHAR(255) NOT NULL,
      arene_image TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Table pour les courses Speed Rush
    CREATE TABLE IF NOT EXISTS courses_speed_rush (
      id SERIAL PRIMARY KEY,
      course_key VARCHAR(500) UNIQUE NOT NULL,
      pilotes JSONB NOT NULL,
      tourneur VARCHAR(255) DEFAULT 'Auto',
      master VARCHAR(255) DEFAULT 'Auto',
      conditions VARCHAR(255) DEFAULT 'Normales',
      depart VARCHAR(255) DEFAULT 'Ligne de départ',
      circuit_nom VARCHAR(255) NOT NULL,
      circuit_image TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Table pour les duels Yu-Gi-Oh
    CREATE TABLE IF NOT EXISTS duels_yugi (
      id SERIAL PRIMARY KEY,
      duel_key VARCHAR(500) UNIQUE NOT NULL,
      joueurs JSONB NOT NULL,
      tourneur VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Table pour l'historique des parties (optionnel)
    CREATE TABLE IF NOT EXISTS historique_parties (
      id SERIAL PRIMARY KEY,
      type_jeu VARCHAR(50) NOT NULL,
      participants JSONB NOT NULL,
      gagnant VARCHAR(255),
      duree INTERVAL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_duels_abm_key ON duels_abm(duel_key);
    CREATE INDEX IF NOT EXISTS idx_courses_speed_rush_key ON courses_speed_rush(course_key);
    CREATE INDEX IF NOT EXISTS idx_duels_yugi_key ON duels_yugi(duel_key);
    CREATE INDEX IF NOT EXISTS idx_historique_type ON historique_parties(type_jeu);
    CREATE INDEX IF NOT EXISTS idx_historique_date ON historique_parties(created_at);

    -- Fonction pour mettre à jour updated_at automatiquement
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Déclencheurs pour updated_at
    DROP TRIGGER IF EXISTS update_duels_abm_updated_at ON duels_abm;
    CREATE TRIGGER update_duels_abm_updated_at
        BEFORE UPDATE ON duels_abm
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_courses_speed_rush_updated_at ON courses_speed_rush;
    CREATE TRIGGER update_courses_speed_rush_updated_at
        BEFORE UPDATE ON courses_speed_rush
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_duels_yugi_updated_at ON duels_yugi;
    CREATE TRIGGER update_duels_yugi_updated_at
        BEFORE UPDATE ON duels_yugi
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `;

  await pool.query(createTablesQuery);
}

// =============================================================================
// FONCTIONS POUR LES DECKS YU-GI-OH
// =============================================================================

/**
 * Table pour les sessions de decks Yu-Gi-Oh
 */
async function createDecksTables() {
  const createDecksTableQuery = `
    -- Table pour les sessions de decks actives
    CREATE TABLE IF NOT EXISTS yugioh_deck_sessions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      group_id VARCHAR(255) NOT NULL,
      deck_name VARCHAR(255) NOT NULL,
      deck_data JSONB NOT NULL,
      pioches JSONB DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, group_id)
    );

    -- Index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_user_group ON yugioh_deck_sessions(user_id, group_id);
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_group ON yugioh_deck_sessions(group_id);
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_updated ON yugioh_deck_sessions(updated_at);

    -- Déclencheur pour updated_at
    DROP TRIGGER IF EXISTS update_deck_sessions_updated_at ON yugioh_deck_sessions;
    CREATE TRIGGER update_deck_sessions_updated_at
        BEFORE UPDATE ON yugioh_deck_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `;

  await pool.query(createDecksTableQuery);
}

/**
 * Sauvegarder ou mettre à jour une session de deck
 */
async function saveDeckSession(userId, groupId, deckName, deckData, pioches = []) {
  try {
    const query = `
      INSERT INTO yugioh_deck_sessions (user_id, group_id, deck_name, deck_data, pioches) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (user_id, group_id) DO UPDATE SET 
        deck_name = $3,
        deck_data = $4,
        pioches = $5,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    const values = [
      userId,
      groupId,
      deckName,
      JSON.stringify(deckData),
      JSON.stringify(pioches)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveDeckSession:', error);
    throw error;
  }
}

/**
 * Récupérer une session de deck
 */
async function getDeckSession(userId, groupId) {
  try {
    const result = await pool.query(
      'SELECT * FROM yugioh_deck_sessions WHERE user_id = $1 AND group_id = $2',
      [userId, groupId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur getDeckSession:', error);
    throw error;
  }
}

/**
 * Supprimer une session de deck
 */
async function deleteDeckSession(userId, groupId) {
  try {
    const result = await pool.query(
      'DELETE FROM yugioh_deck_sessions WHERE user_id = $1 AND group_id = $2 RETURNING *',
      [userId, groupId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur deleteDeckSession:', error);
    throw error;
  }
}

/**
 * Nettoyer les anciennes sessions de decks (plus de 24h)
 */
async function cleanOldDeckSessions(hoursOld = 24) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hoursOld);

    const result = await pool.query(
      'DELETE FROM yugioh_deck_sessions WHERE updated_at < $1 RETURNING *',
      [cutoffDate]
    );

    return {
      success: true,
      message: `Nettoyage effectué: ${result.rowCount} anciennes sessions supprimées`,
      deleted: result.rowCount
    };
  } catch (error) {
    console.error('Erreur cleanOldDeckSessions:', error);
    throw error;
  }
}

/**
 * Récupérer toutes les sessions d'un groupe
 */
async function getGroupDeckSessions(groupId) {
  try {
    const result = await pool.query(
      'SELECT user_id, deck_name, updated_at FROM yugioh_deck_sessions WHERE group_id = $1 ORDER BY updated_at DESC',
      [groupId]
    );
    return result.rows;
  } catch (error) {
    console.error('Erreur getGroupDeckSessions:', error);
    throw error;
  }
}

// =============================================================================
// FONCTIONS POUR ABM (ANIME BATTLE MULTIVERS)
// =============================================================================

/**
 * Récupérer un duel ABM par sa clé
 */
async function getDuelABM(duelKey) {
  try {
    const result = await pool.query(
      'SELECT * FROM duels_abm WHERE duel_key = $1',
      [duelKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur getDuelABM:', error);
    throw error;
  }
}

/**
 * Sauvegarder ou mettre à jour un duel ABM
 */
async function saveDuelABM(duelKey, data) {
  try {
    const query = `
      INSERT INTO duels_abm (duel_key, equipe1, equipe2, stats_custom, arene_nom, arene_image) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (duel_key) DO UPDATE SET 
        equipe1 = $2, 
        equipe2 = $3, 
        stats_custom = $4, 
        arene_nom = $5, 
        arene_image = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      duelKey,
      JSON.stringify(data.equipe1),
      JSON.stringify(data.equipe2),
      data.statsCustom || 'Non defini',
      data.arene.nom,
      data.arene.image
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveDuelABM:', error);
    throw error;
  }
}

/**
 * Supprimer un duel ABM
 */
async function deleteDuelABM(duelKey) {
  try {
    const result = await pool.query(
      'DELETE FROM duels_abm WHERE duel_key = $1 RETURNING *',
      [duelKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur deleteDuelABM:', error);
    throw error;
  }
}

/**
 * Récupérer tous les duels ABM
 */
async function getAllDuelsABM() {
  try {
    const result = await pool.query(
      'SELECT duel_key, equipe1, equipe2, arene_nom, created_at FROM duels_abm ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Erreur getAllDuelsABM:', error);
    throw error;
  }
}

/**
 * Réinitialiser tous les duels ABM
 */
async function resetAllDuelsABM() {
  try {
    await pool.query('DELETE FROM duels_abm');
    return { success: true, message: 'Tous les duels ABM ont été réinitialisés' };
  } catch (error) {
    console.error('Erreur resetAllDuelsABM:', error);
    throw error;
  }
}

// =============================================================================
// FONCTIONS POUR SPEED RUSH
// =============================================================================

/**
 * Récupérer une course Speed Rush par sa clé
 */
async function getCourseSpeedRush(courseKey) {
  try {
    const result = await pool.query(
      'SELECT * FROM courses_speed_rush WHERE course_key = $1',
      [courseKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur getCourseSpeedRush:', error);
    throw error;
  }
}

/**
 * Sauvegarder ou mettre à jour une course Speed Rush
 */
async function saveCourseSpeedRush(courseKey, data) {
  try {
    const query = `
      INSERT INTO courses_speed_rush (course_key, pilotes, tourneur, master, conditions, depart, circuit_nom, circuit_image) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      ON CONFLICT (course_key) DO UPDATE SET 
        pilotes = $2, 
        tourneur = $3, 
        master = $4, 
        conditions = $5, 
        depart = $6, 
        circuit_nom = $7, 
        circuit_image = $8,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      courseKey,
      JSON.stringify(data.pilotes),
      data.tourneur || 'Auto',
      data.master || 'Auto',
      data.conditions || 'Normales',
      data.depart || 'Ligne de départ',
      data.circuit.nom,
      data.circuit.image
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveCourseSpeedRush:', error);
    throw error;
  }
}

/**
 * Supprimer une course Speed Rush
 */
async function deleteCourseSpeedRush(courseKey) {
  try {
    const result = await pool.query(
      'DELETE FROM courses_speed_rush WHERE course_key = $1 RETURNING *',
      [courseKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur deleteCourseSpeedRush:', error);
    throw error;
  }
}

/**
 * Récupérer toutes les courses Speed Rush
 */
async function getAllCoursesSpeedRush() {
  try {
    const result = await pool.query(
      'SELECT course_key, pilotes, circuit_nom, created_at FROM courses_speed_rush ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Erreur getAllCoursesSpeedRush:', error);
    throw error;
  }
}

/**
 * Réinitialiser toutes les courses Speed Rush
 */
async function resetAllCoursesSpeedRush() {
  try {
    await pool.query('DELETE FROM courses_speed_rush');
    return { success: true, message: 'Toutes les courses Speed Rush ont été réinitialisées' };
  } catch (error) {
    console.error('Erreur resetAllCoursesSpeedRush:', error);
    throw error;
  }
}

// =============================================================================
// FONCTIONS POUR YU-GI-OH
// =============================================================================

/**
 * Récupérer un duel Yu-Gi-Oh par sa clé
 */
async function getDuelYugi(duelKey) {
  try {
    const result = await pool.query(
      'SELECT * FROM duels_yugi WHERE duel_key = $1',
      [duelKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur getDuelYugi:', error);
    throw error;
  }
}

/**
 * Sauvegarder ou mettre à jour un duel Yu-Gi-Oh
 */
async function saveDuelYugi(duelKey, data) {
  try {
    const query = `
      INSERT INTO duels_yugi (duel_key, joueurs, tourneur) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (duel_key) DO UPDATE SET 
        joueurs = $2, 
        tourneur = $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      duelKey,
      JSON.stringify(data.joueurs),
      data.tourneur
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveDuelYugi:', error);
    throw error;
  }
}

/**
 * Supprimer un duel Yu-Gi-Oh
 */
async function deleteDuelYugi(duelKey) {
  try {
    const result = await pool.query(
      'DELETE FROM duels_yugi WHERE duel_key = $1 RETURNING *',
      [duelKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur deleteDuelYugi:', error);
    throw error;
  }
}

/**
 * Récupérer tous les duels Yu-Gi-Oh
 */
async function getAllDuelsYugi() {
  try {
    const result = await pool.query(
      'SELECT duel_key, joueurs, tourneur, created_at FROM duels_yugi ORDER BY created_at DESC'
    );

    // Formater les résultats pour correspondre à l'ancienne structure
    const duels = {};
    result.rows.forEach(row => {
      duels[row.duel_key] = {
        joueurs: row.joueurs,
        tourneur: row.tourneur
      };
    });

    return duels;
  } catch (error) {
    console.error('Erreur getAllDuelsYugi:', error);
    throw error;
  }
}

/**
 * Réinitialiser tous les duels Yu-Gi-Oh
 */
async function resetAllDuelsYugi() {
  try {
    await pool.query('DELETE FROM duels_yugi');
    return { success: true, message: 'Tous les duels Yu-Gi-Oh ont été réinitialisés' };
  } catch (error) {
    console.error('Erreur resetAllDuelsYugi:', error);
    throw error;
  }
}

// =============================================================================
// FONCTIONS GÉNÉRALES ET UTILITAIRES
// =============================================================================

/**
 * Nettoyer les anciennes données (maintenance)
 */
async function cleanOldData(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const results = await Promise.all([
      pool.query('DELETE FROM duels_abm WHERE created_at < $1', [cutoffDate]),
      pool.query('DELETE FROM courses_speed_rush WHERE created_at < $1', [cutoffDate]),
      pool.query('DELETE FROM duels_yugi WHERE created_at < $1', [cutoffDate]),
      pool.query('DELETE FROM historique_parties WHERE created_at < $1', [cutoffDate]),
      pool.query('DELETE FROM yugioh_deck_sessions WHERE created_at < $1', [cutoffDate])
    ]);

    const totalDeleted = results.reduce((sum, result) => sum + result.rowCount, 0);

    return {
      success: true,
      message: `Nettoyage effectué: ${totalDeleted} anciennes entrées supprimées`,
      details: {
        duels_abm: results[0].rowCount,
        courses_speed_rush: results[1].rowCount,
        duels_yugi: results[2].rowCount,
        historique: results[3].rowCount,
        deck_sessions: results[4].rowCount
      }
    };
  } catch (error) {
    console.error('Erreur cleanOldData:', error);
    throw error;
  }
}

/**
 * Obtenir les statistiques de la base de données
 */
async function getDatabaseStats() {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM duels_abm) as total_duels_abm,
        (SELECT COUNT(*) FROM courses_speed_rush) as total_courses_sr,
        (SELECT COUNT(*) FROM duels_yugi) as total_duels_yugi,
        (SELECT COUNT(*) FROM historique_parties) as total_historique,
        (SELECT COUNT(*) FROM yugioh_deck_sessions) as total_deck_sessions,
        (SELECT MAX(created_at) FROM duels_abm) as dernier_duel_abm,
        (SELECT MAX(created_at) FROM courses_speed_rush) as derniere_course_sr,
        (SELECT MAX(created_at) FROM duels_yugi) as dernier_duel_yugi,
        (SELECT MAX(updated_at) FROM yugioh_deck_sessions) as derniere_session_deck
    `;

    const result = await pool.query(statsQuery);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur getDatabaseStats:', error);
    throw error;
  }
}

/**
 * Sauvegarder une partie dans l'historique
 */
async function saveToHistorique(typeJeu, participants, gagnant = null, duree = null) {
  try {
    const query = `
      INSERT INTO historique_parties (type_jeu, participants, gagnant, duree)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      typeJeu,
      JSON.stringify(participants),
      gagnant,
      duree
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveToHistorique:', error);
    throw error;
  }
}

/**
 * Tester la connexion à la base de données
 */
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    return {
      connected: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].postgres_version
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

// =============================================================================
// EXPORT DES FONCTIONS
// =============================================================================

module.exports = {
  // Pool de connexion
  pool,

  // Initialisation
  initializeDatabase,
  testConnection,

  // Fonctions ABM
  getDuelABM,
  saveDuelABM,
  deleteDuelABM,
  getAllDuelsABM,
  resetAllDuelsABM,

  // Fonctions Speed Rush
  getCourseSpeedRush,
  saveCourseSpeedRush,
  deleteCourseSpeedRush,
  getAllCoursesSpeedRush,
  resetAllCoursesSpeedRush,

  // Fonctions Yu-Gi-Oh
  getDuelYugi,
  saveDuelYugi,
  deleteDuelYugi,
  getAllDuelsYugi,
  resetAllDuelsYugi,

  // Nouvelles fonctions pour les decks
  saveDeckSession,
  getDeckSession,
  deleteDeckSession,
  cleanOldDeckSessions,
  getGroupDeckSessions,

  // Fonctions générales
  cleanOldData,
  getDatabaseStats,
  saveToHistorique
};