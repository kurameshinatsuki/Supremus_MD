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

// Fonction pour générer un ID unique d'article
function generateItemId() {
  return Math.random().toString(16).slice(2, 10); // ID plus court pour les articles
}

// Création de la table des articles du marché si elle n'existe pas
async function createMarketTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_items(
        id TEXT PRIMARY KEY,
        seller_name TEXT NOT NULL,
        item_name TEXT NOT NULL,
        rarity TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        status TEXT DEFAULT 'en_vente',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[BDD Market] Table market_items vérifiée/créée.');
  } catch (error) {
    console.error('[BDD Market] Erreur création table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ajouter un article au marché
async function addMarketItem(itemData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      seller_name,
      item_name,
      rarity,
      description,
      price,
      game_type
    } = itemData;

    const id = generateItemId();

    const query = `
      INSERT INTO market_items(id, seller_name, item_name, rarity, description, price, game_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [id, seller_name, item_name, rarity, description, price, game_type];
    const res = await client.query(query, values);

    await client.query('COMMIT');
    console.log(`[BDD Market] Article ajouté: ${id} par ${seller_name}`);
    return res.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Market] Erreur ajout article:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer tous les articles en vente
async function getMarketItems(page = 1, limit = 10) {
  const client = await pool.connect();
  try {
    const offset = (page - 1) * limit;
    
    const res = await client.query(
      `SELECT * FROM market_items 
       WHERE status = 'en_vente' 
       ORDER BY timestamp DESC 
       LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    // Récupérer le nombre total d'articles
    const countRes = await client.query(
      `SELECT COUNT(*) FROM market_items WHERE status = 'en_vente';`
    );

    return {
      items: res.rows,
      total: parseInt(countRes.rows[0].count),
      page: page,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count) / limit)
    };
  } catch (error) {
    console.error('[BDD Market] Erreur récupération articles:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Récupérer les articles d'un vendeur
async function getSellerItems(sellerName) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM market_items 
       WHERE seller_name = $1 
       ORDER BY timestamp DESC;`,
      [sellerName]
    );

    return res.rows;
  } catch (error) {
    console.error('[BDD Market] Erreur récupération articles vendeur:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Retirer un article du marché
async function removeMarketItem(itemId, sellerName) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `DELETE FROM market_items 
       WHERE id = $1 AND seller_name = $2 
       RETURNING *;`,
      [itemId, sellerName]
    );

    await client.query('COMMIT');
    
    if (res.rows.length === 0) {
      console.log(`[BDD Market] Article non trouvé ou non autorisé: ${itemId}`);
      return null;
    }

    console.log(`[BDD Market] Article retiré: ${itemId}`);
    return res.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Market] Erreur retrait article:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Vérifier si un article existe
async function getMarketItem(itemId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM market_items WHERE id = $1;`,
      [itemId]
    );

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0];
  } catch (error) {
    console.error('[BDD Market] Erreur vérification article:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Nettoyer les anciens articles (optionnel)
async function cleanOldMarketItems(daysOld = 30) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `DELETE FROM market_items 
       WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '${daysOld} days' 
       RETURNING *;`
    );

    await client.query('COMMIT');
    console.log(`[BDD Market] ${res.rowCount} anciens articles supprimés.`);
    return res.rowCount;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[BDD Market] Erreur nettoyage articles:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialisation de la table au démarrage
createMarketTable().catch(err => {
  console.error('[BDD Market CRITIQUE] Erreur initialisation:', err);
});

module.exports = {
  addMarketItem,
  getMarketItems,
  getSellerItems,
  removeMarketItem,
  getMarketItem,
  cleanOldMarketItems
};