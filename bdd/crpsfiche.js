const { Pool } = require("pg");
const s = require("../set");

var dbUrl = s.SPDB;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

async function createCRPSFicheTable() {
  const client = await pool.connect();

  try {
    // Créez la table crpsfiche si elle n'existe pas déjà
    await client.query(`
      CREATE TABLE IF NOT EXISTS crpsfiche(
        id SERIAL PRIMARY KEY,
        joueur TEXT DEFAULT 'aucun',
        division TEXT DEFAULT 'Bronze🥉',
        statuts TEXT DEFAULT 'Rôliste✅',
        wish TEXT DEFAULT '00C/01J',
        sage INTEGER DEFAULT 0,
        champion TEXT DEFAULT 'D. Argent🥈',
        specialiste TEXT DEFAULT '0/3⭐',
        maitre TEXT DEFAULT '00/05V',
        dictateur TEXT DEFAULT '.../1er🥉',
        maitrise INTEGER DEFAULT 0,
        aventurier TEXT DEFAULT '00T/01J',
        challenge TEXT DEFAULT '00/02✅',
        legende TEXT DEFAULT '0⭐/0🌟/0💫',
        fight_victoire INTEGER DEFAULT 0,
        fight_defaite INTEGER DEFAULT 0,
        top_3 INTEGER DEFAULT 0,
        story_mode INTEGER DEFAULT 0,
        perso TEXT DEFAULT 'aucun',
        card TEXT DEFAULT 'aucun',
        niveau INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        stats TEXT DEFAULT '{"🍽️":100,"🍶":100,"❤️":0,"🌀":0,"🫀":0,"💪":0,"🏃":0,"👊":0}',
        items TEXT DEFAULT 'voir magasin',
        premium INTEGER DEFAULT 0,
        pieces INTEGER DEFAULT 0,
        diamonds INTEGER DEFAULT 0
      );
    `);
    console.log('Table crpsfiche créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table crpsfiche:', error);
  } finally {
    client.release();
  }
}

// Fonction pour insérer des données par défaut
async function insertDefaultData() {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO crpsfiche(joueur, division, statuts, wish, sage, champion, specialiste, maitre, dictateur, maitrise, aventurier, challenge, legende, fight_victoire, fight_defaite, top_3, story_mode, perso, card, niveau, xp, stats, items, premium, pieces, diamonds)
      VALUES ('aucun', 'Bronze🥉', 'Rôliste✅', '00C/01J', 0, 'D. Argent🥈', '0/3⭐', '00/05V', '.../1er🥉', 0, '00T/01J', '00/02✅', '0⭐/0🌟/0💫', 0, 0, 0, 0, 'aucun', 'aucun', 1, 0, '{"🍽️":100,"🍶":100,"❤️":0,"🌀":0,"🫀":0,"💪":0,"🏃":0,"👊":0}', 'voir magasin', 0, 0, 0);
    `;
    await client.query(query);
    console.log('Données par défaut insérées avec succès');
  } catch (error) {
    console.error("Erreur lors de l'insertion des données par défaut:", error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer les données d'un joueur
async function getPlayerData(id) {
  const client = await pool.connect();

  try {
    const query = 'SELECT * FROM crpsfiche WHERE id = $1';
    const result = await client.query(query, [id]);

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  } finally {
    client.release();
  }
}

createCRPSFicheTable();
// insertDefaultData(); // Appeler cette fonction pour insérer les données par défaut

module.exports = {
  createCRPSFicheTable,
  getPlayerData,
};
