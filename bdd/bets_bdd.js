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

// Fonction pour générer un ID unique de pari
function generateBetId() {
  return Math.random().toString(16).slice(2, 10).toUpperCase(); // Ex: A1B2C3D4
}

// Création des tables pour les paris
async function createBetsTables() {
  const client = await pool.connect();
  try {
    // Table des paris
    await client.query(`
      CREATE TABLE IF NOT EXISTS bets(
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        creator TEXT NOT NULL,
        options TEXT[] NOT NULL,
        bet_type TEXT NOT NULL,
        condition TEXT,
        min_bet INTEGER DEFAULT 10,
        status TEXT DEFAULT 'open',
        total_pot INTEGER DEFAULT 0,
        participants_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP
      );
    `);

    // Table des mises des participants
    await client.query(`
      CREATE TABLE IF NOT EXISTS bet_entries(
        id SERIAL PRIMARY KEY,
        bet_id TEXT REFERENCES bets(id) ON DELETE CASCADE,
        player_name TEXT NOT NULL,
        option_index INTEGER NOT NULL,
        option_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        potential_payout INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(bet_id, player_name)
      );
    `);

    // Table des résultats des paris
    await client.query(`
      CREATE TABLE IF NOT EXISTS bet_results(
        id SERIAL PRIMARY KEY,
        bet_id TEXT REFERENCES bets(id) ON DELETE CASCADE,
        winning_option INTEGER,
        winning_option_name TEXT,
        total_winners INTEGER DEFAULT 0,
        total_payout INTEGER DEFAULT 0,
        closed_by TEXT,
        closed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('[BDD Bets] Tables des paris vérifiées/créées.');
  } catch (error) {
    console.error('[BDD Bets] Erreur création tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Créer un nouveau pari
async function createNewBet(betData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      title,
      creator,
      options,
      bet_type,
      condition,
      min_bet = 10
    } = betData;

    const betId = generateBetId();

    const query = `
      INSERT INTO bets(id, title, creator, options, bet_type, condition, min_bet)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [betId, title, creator, options, bet_type, condition, min_bet];
    const res = await client.query(query, values);

    await client.query('COMMIT');
    console.log(`[BDD Bets] Pari créé: ${betId} par ${creator}`);
    return res.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Bets] Erreur création pari:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer tous les paris ouverts
async function getOpenBets(page = 1, limit = 10) {
  const client = await pool.connect();
  try {
    const offset = (page - 1) * limit;
    
    const res = await client.query(
      `SELECT * FROM bets 
       WHERE status = 'open' 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    // Compter le total de paris ouverts
    const countRes = await client.query(
      `SELECT COUNT(*) FROM bets WHERE status = 'open';`
    );

    // Pour chaque pari, récupérer le nombre de participants et le total des mises
    for (let bet of res.rows) {
      const participantsRes = await client.query(
        `SELECT COUNT(DISTINCT player_name) as participants_count, 
                COALESCE(SUM(amount), 0) as total_pot
         FROM bet_entries 
         WHERE bet_id = $1;`,
        [bet.id]
      );
      
      bet.participants_count = parseInt(participantsRes.rows[0].participants_count);
      bet.total_pot = parseInt(participantsRes.rows[0].total_pot);
    }

    return {
      bets: res.rows,
      total: parseInt(countRes.rows[0].count),
      page: page,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count) / limit)
    };
  } catch (error) {
    console.error('[BDD Bets] Erreur récupération paris:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer un pari spécifique
async function getBet(betId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM bets WHERE id = $1;`,
      [betId]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const bet = res.rows[0];

    // Récupérer les statistiques des mises
    const statsRes = await client.query(
      `SELECT option_index, COUNT(*) as bet_count, SUM(amount) as total_amount
       FROM bet_entries 
       WHERE bet_id = $1 
       GROUP BY option_index;`,
      [betId]
    );

    bet.bet_stats = statsRes.rows;
    bet.participants_count = statsRes.rows.reduce((sum, stat) => sum + parseInt(stat.bet_count), 0);
    bet.total_pot = statsRes.rows.reduce((sum, stat) => sum + parseInt(stat.total_amount), 0);

    return bet;
  } catch (error) {
    console.error('[BDD Bets] Erreur récupération pari:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Placer une mise sur un pari
async function placeBet(betData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      bet_id,
      player_name,
      option_index,
      option_name,
      amount
    } = betData;

    // Vérifier si le pari existe et est ouvert
    const bet = await client.query(
      `SELECT * FROM bets WHERE id = $1 AND status = 'open';`,
      [bet_id]
    );

    if (bet.rows.length === 0) {
      throw new Error('Pari non trouvé ou fermé');
    }

    const betInfo = bet.rows[0];

    // Vérifier si le joueur a déjà misé sur ce pari
    const existingBet = await client.query(
      `SELECT * FROM bet_entries WHERE bet_id = $1 AND player_name = $2;`,
      [bet_id, player_name]
    );

    if (existingBet.rows.length > 0) {
      throw new Error('Vous avez déjà misé sur ce pari');
    }

    // Vérifier que la mise est >= mise minimum
    if (amount < betInfo.min_bet) {
      throw new Error(`Mise minimum: ${betInfo.min_bet} coupons`);
    }

    // Vérifier que l'option existe
    if (option_index < 0 || option_index >= betInfo.options.length) {
      throw new Error('Option invalide');
    }

    // Calculer le gain potentiel
    let potential_payout;
    if (betInfo.bet_type === 'simple') {
      potential_payout = amount * 2; // Rapport ×2
    } else if (betInfo.bet_type === 'conditionnel') {
      potential_payout = amount * 4; // Rapport ×4
    } else {
      potential_payout = amount * 2; // Par défaut ×2
    }

    // Insérer la mise
    const query = `
      INSERT INTO bet_entries(bet_id, player_name, option_index, option_name, amount, potential_payout)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [bet_id, player_name, option_index, option_name, amount, potential_payout];
    const res = await client.query(query, values);

    // Mettre à jour le total du pot du pari
    await client.query(
      `UPDATE bets SET total_pot = total_pot + $1 WHERE id = $2;`,
      [amount, bet_id]
    );

    await client.query('COMMIT');
    console.log(`[BDD Bets] Mise placée: ${player_name} a misé ${amount} sur le pari ${bet_id}`);
    return res.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Bets] Erreur placement mise:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer les mises d'un joueur sur un pari
async function getPlayerBet(betId, playerName) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM bet_entries WHERE bet_id = $1 AND player_name = $2;`,
      [betId, playerName]
    );

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0];
  } catch (error) {
    console.error('[BDD Bets] Erreur récupération mise joueur:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Fermer un pari et déclarer un gagnant
async function closeBet(betData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      bet_id,
      winning_option,
      winning_option_name,
      closed_by
    } = betData;

    // Vérifier que le pari existe et est ouvert
    const bet = await client.query(
      `SELECT * FROM bets WHERE id = $1 AND status = 'open';`,
      [bet_id]
    );

    if (bet.rows.length === 0) {
      throw new Error('Pari non trouvé ou déjà fermé');
    }

    const betInfo = bet.rows[0];

    // Récupérer toutes les mises sur l'option gagnante
    const winningBets = await client.query(
      `SELECT * FROM bet_entries WHERE bet_id = $1 AND option_index = $2;`,
      [bet_id, winning_option]
    );

    // Calculer le total des mises des gagnants et le payout total
    const totalWinners = winningBets.rows.length;
    let totalPayout = 0;

    if (totalWinners > 0) {
      // Répartir le pot total entre les gagnants
      const potTotal = betInfo.total_pot;
      const payoutPerWinner = Math.floor(potTotal / totalWinners);
      totalPayout = payoutPerWinner * totalWinners;

      // Mettre à jour les mises des gagnants
      for (const betEntry of winningBets.rows) {
        await client.query(
          `UPDATE bet_entries SET status = 'won', potential_payout = $1 
           WHERE id = $2;`,
          [payoutPerWinner, betEntry.id]
        );
      }

      // Marquer les mises perdantes
      await client.query(
        `UPDATE bet_entries SET status = 'lost' 
         WHERE bet_id = $1 AND option_index != $2;`,
        [bet_id, winning_option]
      );
    } else {
      // Aucun gagnant, toutes les mises sont perdues
      await client.query(
        `UPDATE bet_entries SET status = 'lost' WHERE bet_id = $1;`,
        [bet_id]
      );
    }

    // Fermer le pari
    await client.query(
      `UPDATE bets SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = $1;`,
      [bet_id]
    );

    // Enregistrer le résultat
    const resultQuery = `
      INSERT INTO bet_results(bet_id, winning_option, winning_option_name, total_winners, total_payout, closed_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const resultValues = [bet_id, winning_option, winning_option_name, totalWinners, totalPayout, closed_by];
    const resultRes = await client.query(resultQuery, resultValues);

    await client.query('COMMIT');
    console.log(`[BDD Bets] Pari fermé: ${bet_id} - Gagnant: option ${winning_option}`);
    return {
      bet: betInfo,
      result: resultRes.rows[0],
      winners: winningBets.rows
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Bets] Erreur fermeture pari:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer l'historique des paris d'un joueur
async function getPlayerBetHistory(playerName, limit = 10) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT be.*, b.title, b.bet_type, b.status as bet_status, br.winning_option
       FROM bet_entries be
       JOIN bets b ON be.bet_id = b.id
       LEFT JOIN bet_results br ON b.id = br.bet_id
       WHERE be.player_name = $1
       ORDER BY be.placed_at DESC
       LIMIT $2;`,
      [playerName, limit]
    );

    return res.rows;
  } catch (error) {
    console.error('[BDD Bets] Erreur historique paris joueur:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Nettoyer les anciens paris fermés (optionnel)
async function cleanOldClosedBets(daysOld = 30) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `DELETE FROM bets 
       WHERE status = 'closed' 
       AND closed_at < CURRENT_TIMESTAMP - INTERVAL '${daysOld} days' 
       RETURNING *;`
    );

    await client.query('COMMIT');
    console.log(`[BDD Bets] ${res.rowCount} anciens paris supprimés.`);
    return res.rowCount;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Bets] Erreur nettoyage paris:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialisation des tables au démarrage
createBetsTables().catch(err => {
  console.error('[BDD Bets CRITIQUE] Erreur initialisation:', err);
});

module.exports = {
  createNewBet,
  getOpenBets,
  getBet,
  placeBet,
  getPlayerBet,
  closeBet,
  getPlayerBetHistory,
  cleanOldClosedBets
};