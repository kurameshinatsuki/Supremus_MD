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

async function createTesteeTable() {
  const client = await pool.connect();

  try {
    // Créez la table testee si elle n'existe pas déjà
    await client.query(`
      CREATE TABLE IF NOT EXISTS testee (
        id serial PRIMARY KEY,
        message text,
        lien text        
      );
    `);
    console.log('Table testee créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table testee:', error);
  } finally {
    client.release();
  }
}

// Fonction pour insérer des données
async function insertData(message, lien) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO testee (id, message, lien)
      VALUES (DEFAULT, $1, $2)
      RETURNING id;
    `;
    const values = [message, lien];

    const result = await client.query(query, values);
    console.log(`Données insérées avec succès pour l'ID ${result.rows[0].id}`);
  } catch (error) {
    console.error("Erreur lors de l'insertion des données:", error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer toutes les données
async function getData(ide) {
  const client = await pool.connect();

  try {
    const query = "SELECT message, lien FROM testee WHERE id = $1";
    const result = await client.query(query, [ide]);

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  } finally {
    client.release();
  }
}

module.exports = {
  createTesteeTable,
  insertData,
  getData
};
