// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");
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

// Fonction pour créer la table "testee" avec une colonne "id"
const creerTableTestee = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS testee (
          id serial PRIMARY KEY,
          message text,
          lien text
        );
      `);
      console.log("La table 'testee' a été créée avec succès.");
    } catch (e) {
      console.error("Une erreur est survenue lors de la création de la table 'testee':", e);
    }
};
  
// Appelez la méthode pour créer la table "testee"
creerTableTestee();

// Fonction pour ajouter plusieurs enregistrements dans la table "testee"
async function insertMultipleRecords(message, lien) {
    const client = await pool.connect();
    try {
        for (let i = 1; i <= 20; i++) {
            const query = `
                INSERT INTO testee (id, message, lien)
                VALUES ($1, $2, $3)
                ON CONFLICT (id)
                DO UPDATE SET message = excluded.message, lien = excluded.lien;
            `;
            const values = [i, `${message} ${i}`, `${lien} ${i}`];

            await client.query(query, values);
            console.log(`Données ajoutées ou mises à jour pour l'ID ${i} dans la table 'testee' avec succès.`);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout ou de la mise à jour des données dans la table 'testee':", error);
    } finally {
        client.release();
    }
}

// Fonction pour récupérer les données de la table "testee"
async function getDataFromTestee() {
    const client = await pool.connect();
    try {
      const query = "SELECT message, lien FROM testee WHERE id = 1";
      const result = await client.query(query);
  
      if (result.rows.length > 0) {
        const { message, lien } = result.rows[0];
        return { message, lien };
      } else {
        console.log("Aucune donnée trouvée dans la table 'testee'.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données depuis la table 'testee':", error);
      return null;
    } finally {
      client.release();
    }
};

// Exportez les fonctions pour les utiliser dans d'autres fichiers
module.exports = {
    insertMultipleRecords,
    getDataFromTestee,
};
