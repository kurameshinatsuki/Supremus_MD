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
// FONCTIONS POUR LES DECKS YU-GI-OH (AMÉLIORÉES)
// =============================================================================

/**
 * Table pour les sessions de decks Yu-Gi-Oh avec état de partie complet
 */
async function createDecksTables() {
  const createDecksTableQuery = `
    -- Table pour les sessions de decks actives avec état de partie
    CREATE TABLE IF NOT EXISTS yugioh_deck_sessions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      group_id VARCHAR(255) NOT NULL,
      deck_name VARCHAR(255) NOT NULL,
      deck_data JSONB NOT NULL,
      pioches JSONB DEFAULT '[]',
      game_state JSONB DEFAULT '{
        "lp": 4000,
        "hand": [],
        "field": {
          "monster": [null, null, null],
          "spell": [null, null, null],
          "field": null
        },
        "graveyard": [],
        "banished": [],
        "extra": [],
        "main": [],
        "competence": "",
        "nom": ""
      }',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, group_id)
    );

    -- Table pour l'historique des parties Yu-Gi-Oh
    CREATE TABLE IF NOT EXISTS yugioh_game_history (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      group_id VARCHAR(255) NOT NULL,
      deck_name VARCHAR(255) NOT NULL,
      result VARCHAR(50) NOT NULL,
      lp_final INTEGER NOT NULL,
      turns_played INTEGER DEFAULT 0,
      cards_played INTEGER DEFAULT 0,
      duration INTERVAL,
      game_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_user_group ON yugioh_deck_sessions(user_id, group_id);
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_group ON yugioh_deck_sessions(group_id);
    CREATE INDEX IF NOT EXISTS idx_deck_sessions_updated ON yugioh_deck_sessions(updated_at);
    CREATE INDEX IF NOT EXISTS idx_game_history_user ON yugioh_game_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_game_history_group ON yugioh_game_history(group_id);
    CREATE INDEX IF NOT EXISTS idx_game_history_date ON yugioh_game_history(created_at);

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
 * Sauvegarder ou mettre à jour une session de deck avec état de partie
 */
async function saveDeckSession(userId, groupId, deckName, deckData, pioches = [], gameState = null) {
  try {
    const query = `
      INSERT INTO yugioh_deck_sessions (user_id, group_id, deck_name, deck_data, pioches, game_state) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (user_id, group_id) DO UPDATE SET 
        deck_name = $3,
        deck_data = $4,
        pioches = $5,
        game_state = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    // État de jeu par défaut si non fourni
    const defaultGameState = {
      lp: 4000,
      hand: [],
      field: {
        monster: [null, null, null],
        spell: [null, null, null],
        field: null
      },
      graveyard: [],
      banished: [],
      extra: [],
      main: deckData || [],
      competence: "",
      nom: deckName
    };

    const values = [
      userId,
      groupId,
      deckName,
      JSON.stringify(deckData),
      JSON.stringify(pioches),
      JSON.stringify(gameState || defaultGameState)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveDeckSession:', error);
    throw error;
  }
}

/**
 * Récupérer une session de deck avec état de partie
 */
async function getDeckSession(userId, groupId) {
  try {
    const result = await pool.query(
      'SELECT * FROM yugioh_deck_sessions WHERE user_id = $1 AND group_id = $2',
      [userId, groupId]
    );
    
    if (!result.rows[0]) return null;
    
    const session = result.rows[0];
    
    // Assurer la rétrocompatibilité avec les anciennes sessions
    return {
      id: session.id,
      user_id: session.user_id,
      group_id: session.group_id,
      deck_name: session.deck_name,
      deck_data: session.deck_data,
      pioches: session.pioches || [],
      game_state: session.game_state || {
        lp: 4000,
        hand: [],
        field: {
          monster: [null, null, null],
          spell: [null, null, null],
          field: null
        },
        graveyard: [],
        banished: [],
        extra: [],
        main: session.deck_data || [],
        competence: "",
        nom: session.deck_name
      },
      created_at: session.created_at,
      updated_at: session.updated_at
    };
  } catch (error) {
    console.error('Erreur getDeckSession:', error);
    throw error;
  }
}

/**
 * Mettre à jour uniquement l'état de jeu
 */
async function updateGameState(userId, groupId, gameState) {
  try {
    const query = `
      UPDATE yugioh_deck_sessions 
      SET game_state = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND group_id = $3
      RETURNING *
    `;

    const values = [
      JSON.stringify(gameState),
      userId,
      groupId
    ];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur updateGameState:', error);
    throw error;
  }
}

/**
 * Sauvegarder une partie dans l'historique Yu-Gi-Oh
 */
async function saveYugiohGameHistory(userId, groupId, deckName, result, lpFinal, gameData, turnsPlayed = 0, cardsPlayed = 0, duration = null) {
  try {
    const query = `
      INSERT INTO yugioh_game_history (user_id, group_id, deck_name, result, lp_final, turns_played, cards_played, duration, game_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userId,
      groupId,
      deckName,
      result,
      lpFinal,
      turnsPlayed,
      cardsPlayed,
      duration,
      JSON.stringify(gameData)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveYugiohGameHistory:', error);
    throw error;
  }
}

/**
 * Récupérer l'historique des parties d'un utilisateur
 */
async function getUserGameHistory(userId, limit = 10) {
  try {
    const result = await pool.query(
      `SELECT deck_name, result, lp_final, turns_played, cards_played, duration, created_at 
       FROM yugioh_game_history 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Erreur getUserGameHistory:', error);
    throw error;
  }
}

/**
 * Récupérer les statistiques d'un utilisateur
 */
async function getUserStats(userId) {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN result = 'Victoire' THEN 1 END) as victories,
        COUNT(CASE WHEN result = 'Défaite' THEN 1 END) as defeats,
        AVG(lp_final) as avg_lp_final,
        AVG(turns_played) as avg_turns,
        AVG(cards_played) as avg_cards_played,
        MAX(created_at) as last_game
      FROM yugioh_game_history 
      WHERE user_id = $1
    `;

    const result = await pool.query(statsQuery, [userId]);
    
    if (!result.rows[0]) {
      return {
        total_games: 0,
        victories: 0,
        defeats: 0,
        win_rate: 0,
        avg_lp_final: 0,
        avg_turns: 0,
        avg_cards_played: 0,
        last_game: null
      };
    }

    const stats = result.rows[0];
    const winRate = stats.total_games > 0 ? Math.round((stats.victories / stats.total_games) * 100) : 0;

    return {
      total_games: parseInt(stats.total_games) || 0,
      victories: parseInt(stats.victories) || 0,
      defeats: parseInt(stats.defeats) || 0,
      win_rate: winRate,
      avg_lp_final: Math.round(stats.avg_lp_final) || 0,
      avg_turns: Math.round(stats.avg_turns) || 0,
      avg_cards_played: Math.round(stats.avg_cards_played) || 0,
      last_game: stats.last_game
    };
  } catch (error) {
    console.error('Erreur getUserStats:', error);
    throw error;
  }
}

/**
 * Récupérer le classement des joueurs dans un groupe
 */
async function getGroupRanking(groupId, limit = 10) {
  try {
    const rankingQuery = `
      SELECT 
        user_id,
        COUNT(*) as total_games,
        COUNT(CASE WHEN result = 'Victoire' THEN 1 END) as victories,
        ROUND((COUNT(CASE WHEN result = 'Victoire' THEN 1 END) * 100.0 / COUNT(*)), 2) as win_rate,
        AVG(lp_final) as avg_lp
      FROM yugioh_game_history 
      WHERE group_id = $1
      GROUP BY user_id
      HAVING COUNT(*) >= 1
      ORDER BY win_rate DESC, victories DESC, total_games DESC
      LIMIT $2
    `;

    const result = await pool.query(rankingQuery, [groupId, limit]);
    return result.rows;
  } catch (error) {
    console.error('Erreur getGroupRanking:', error);
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
      'SELECT user_id, deck_name, game_state->>\'lp\' as lp, updated_at FROM yugioh_deck_sessions WHERE group_id = $1 ORDER BY updated_at DESC',
      [groupId]
    );
    return result.rows;
  } catch (error) {
    console.error('Erreur getGroupDeckSessions:', error);
    throw error;
  }
}

// =============================================================================
// FONCTIONS POUR ABM (ANIME BATTLE MULTIVERS) - CORRIGÉES
// =============================================================================

/**
 * Récupérer un duel ABM par sa clé - CORRIGÉ
 */
async function getDuelABM(duelKey) {
  try {
    const result = await pool.query(
      'SELECT * FROM duels_abm WHERE duel_key = $1',
      [duelKey]
    );
    
    if (!result.rows[0]) return null;
    
    const duel = result.rows[0];
    
    // Reconstruire l'objet avec la structure attendue
    return {
      duel_key: duel.duel_key,
      equipe1: duel.equipe1,
      equipe2: duel.equipe2,
      statsCustom: duel.stats_custom,
      arene: {
        nom: duel.arene_nom,
        image: duel.arene_image
      },
      arene_nom: duel.arene_nom,
      arene_image: duel.arene_image,
      created_at: duel.created_at,
      updated_at: duel.updated_at
    };
  } catch (error) {
    console.error('Erreur getDuelABM:', error);
    throw error;
  }
}

/**
 * Sauvegarder ou mettre à jour un duel ABM - CORRIGÉ
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

    // Vérifier si data.arene existe et a la structure attendue
    let areneNom = 'Arène par défaut';
    let areneImage = 'https://i.ibb.co/XxzW23W7/Image-2025-03-21-14-41-20-0.jpg';
    
    if (data.arene && data.arene.nom) {
      areneNom = data.arene.nom;
      areneImage = data.arene.image || areneImage;
    } else if (data.arene_nom) {
      // Si les données viennent de la base de données
      areneNom = data.arene_nom;
      areneImage = data.arene_image || areneImage;
    }

    const values = [
      duelKey,
      JSON.stringify(data.equipe1),
      JSON.stringify(data.equipe2),
      data.statsCustom || data.stats_custom || 'Non defini',
      areneNom,
      areneImage
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
 * Récupérer tous les duels ABM - CORRIGÉ
 */
async function getAllDuelsABM() {
  try {
    const result = await pool.query(
      'SELECT duel_key, equipe1, equipe2, arene_nom, arene_image, stats_custom, created_at FROM duels_abm ORDER BY created_at DESC'
    );
    
    // Reconstruire les objets avec la structure attendue
    return result.rows.map(row => ({
      duel_key: row.duel_key,
      equipe1: row.equipe1,
      equipe2: row.equipe2,
      arene_nom: row.arene_nom,
      arene_image: row.arene_image,
      stats_custom: row.stats_custom,
      created_at: row.created_at
    }));
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
// FONCTIONS POUR SPEED RUSH - CORRIGÉES
// =============================================================================

/**
 * Récupérer une course Speed Rush par sa clé - CORRIGÉ
 */
async function getCourseSpeedRush(courseKey) {
  try {
    const result = await pool.query(
      'SELECT * FROM courses_speed_rush WHERE course_key = $1',
      [courseKey]
    );
    
    if (!result.rows[0]) return null;
    
    const course = result.rows[0];
    
    // Reconstruire l'objet avec la structure attendue
    return {
      course_key: course.course_key,
      pilotes: course.pilotes,
      tourneur: course.tourneur,
      master: course.master,
      conditions: course.conditions,
      depart: course.depart,
      circuit: {
        nom: course.circuit_nom,
        image: course.circuit_image
      },
      circuit_nom: course.circuit_nom,
      circuit_image: course.circuit_image,
      created_at: course.created_at,
      updated_at: course.updated_at
    };
  } catch (error) {
    console.error('Erreur getCourseSpeedRush:', error);
    throw error;
  }
}

/**
 * Sauvegarder ou mettre à jour une course Speed Rush - CORRIGÉ
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

    // Vérifier si data.circuit existe et a la structure attendue
    let circuitNom = 'Circuit par défaut';
    let circuitImage = 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg';
    
    if (data.circuit && data.circuit.nom) {
      circuitNom = data.circuit.nom;
      circuitImage = data.circuit.image || circuitImage;
    } else if (data.circuit_nom) {
      // Si les données viennent de la base de données
      circuitNom = data.circuit_nom;
      circuitImage = data.circuit_image || circuitImage;
    }

    const values = [
      courseKey,
      JSON.stringify(data.pilotes),
      data.tourneur || 'Auto',
      data.master || 'Auto',
      data.conditions || 'Normales',
      data.depart || 'Ligne de départ',
      circuitNom,
      circuitImage
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
 * Récupérer toutes les courses Speed Rush - CORRIGÉ
 */
async function getAllCoursesSpeedRush() {
  try {
    const result = await pool.query(
      'SELECT course_key, pilotes, circuit_nom, circuit_image, created_at FROM courses_speed_rush ORDER BY created_at DESC'
    );
    
    // Reconstruire les objets avec la structure attendue
    return result.rows.map(row => ({
      course_key: row.course_key,
      pilotes: row.pilotes,
      circuit_nom: row.circuit_nom,
      circuit_image: row.circuit_image,
      created_at: row.created_at
    }));
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
// FONCTIONS POUR YU-GI-OH - CORRIGÉES
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
 * Récupérer tous les duels Yu-Gi-Oh - CORRIGÉ
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
      pool.query('DELETE FROM yugioh_deck_sessions WHERE created_at < $1', [cutoffDate]),
      pool.query('DELETE FROM yugioh_game_history WHERE created_at < $1', [cutoffDate])
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
        deck_sessions: results[4].rowCount,
        game_history: results[5].rowCount
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
        (SELECT COUNT(*) FROM yugioh_game_history) as total_game_history,
        (SELECT MAX(created_at) FROM duels_abm) as dernier_duel_abm,
        (SELECT MAX(created_at) FROM courses_speed_rush) as derniere_course_sr,
        (SELECT MAX(created_at) FROM duels_yugi) as dernier_duel_yugi,
        (SELECT MAX(updated_at) FROM yugioh_deck_sessions) as derniere_session_deck,
        (SELECT MAX(created_at) FROM yugioh_game_history) as derniere_partie_historique
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

  // Nouvelles fonctions pour les decks et statistiques
  saveDeckSession,
  getDeckSession,
  deleteDeckSession,
  cleanOldDeckSessions,
  getGroupDeckSessions,
  updateGameState,
  saveYugiohGameHistory,
  getUserGameHistory,
  getUserStats,
  getGroupRanking,

  // Fonctions générales
  cleanOldData,
  getDatabaseStats,
  saveToHistorique
};