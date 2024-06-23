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

// Fonction pour créer la table "player12" avec une colonne "id"
const creerTablePlayer12 = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS player12 (
          id serial PRIMARY KEY,
          message text,
          lien text
        );
      `);
      console.log("La table 'player12' a été créée avec succès.");
    } catch (e) {
      console.error("Une erreur est survenue lors de la création de la table 'player12':", e);
    }
  };
  
// Appelez la méthode pour créer la table "player12"
creerTablePlayer12();

// Fonction pour ajouter ou mettre à jour un enregistrement dans la table "player12"
async function addOrUpdateDataInPlayer12(message, lien) {
    const client = await pool.connect();
    try {
      // Insérez ou mettez à jour les données dans la table "player12"
      const query = `
        INSERT INTO player12 (id, message, lien)
        VALUES (1, $1, $2)
        ON CONFLICT (id)
        DO UPDATE SET message = excluded.message, lien = excluded.lien;
      `;
      const values = [message, lien];
  
      await client.query(query, values);
      console.log("Données ajoutées ou mises à jour dans la table 'player12' avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la mise à jour des données dans la table 'player12':", error);
    } finally {
      client.release();
    }
  };

// Fonction pour récupérer les données de la table "player12"
async function getDataFromPlayer12() {
    const client = await pool.connect();
    try {
      // Exécutez la requête SELECT pour récupérer les données
      const query = "SELECT message, lien FROM player12 WHERE id = 1";
      const result = await client.query(query);
  
      if (result.rows.length > 0) {
        const { message, lien } = result.rows[0];
        return { message, lien };
      } else {
        console.log("Aucune donnée trouvée dans la table 'player12'.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données depuis la table 'player12':", error);
      return null;
    } finally {
      client.release();
    }
};

// Exportez les fonctions pour les utiliser dans d'autres fichiers
module.exports = {
    addOrUpdateDataInPlayer12,
    getDataFromPlayer12,
};
