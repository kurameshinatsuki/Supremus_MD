// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Remplacez l'URL de la base de données par la nouvelle URL fournie
var dbUrl = s.SPDB;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Fonction pour créer une table de joueur
const creerTablePlayer = async (playerTable) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${playerTable} (
        id serial PRIMARY KEY,
        message text,
        lien text
      );
    `);
    console.log(`La table '${playerTable}' a été créée avec succès.`);
  } catch (e) {
    console.error(`Une erreur est survenue lors de la création de la table '${playerTable}':`, e);
  }
};

// Appelez la méthode pour créer les tables de joueurs
creerTablePlayer('player8');
creerTablePlayer('player9');
creerTablePlayer('player10');

// Fonction pour ajouter ou mettre à jour un enregistrement dans une table de joueur
async function addOrUpdateDataInPlayer(playerTable, message, lien) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO ${playerTable} (id, message, lien)
      VALUES (1, $1, $2)
      ON CONFLICT (id)
      DO UPDATE SET message = excluded.message, lien = excluded.lien;
    `;
    const values = [message, lien];

    await client.query(query, values);
    console.log(`Données ajoutées ou mises à jour dans la table '${playerTable}' avec succès.`);
  } catch (error) {
    console.error(`Erreur lors de l'ajout ou de la mise à jour des données dans la table '${playerTable}':`, error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer les données d'une table de joueur
async function getDataFromPlayer(playerTable) {
  const client = await pool.connect();
  try {
    const query = `SELECT message, lien FROM ${playerTable} WHERE id = 1`;
    const result = await client.query(query);

    if (result.rows.length > 0) {
      const { message, lien } = result.rows[0];
      return { message, lien };
    } else {
      console.log(`Aucune donnée trouvée dans la table '${playerTable}'.`);
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des données depuis la table '${playerTable}':`, error);
    return null;
  } finally {
    client.release();
  }
}

// Exportez les fonctions pour les utiliser dans d'autres fichiers
module.exports = {
  addOrUpdateDataInPlayer,
  getDataFromPlayer,
};
