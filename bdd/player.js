// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");
const s = require("../set");  // Supposons que vous utilisez un fichier set.js pour vos variables

// URL de la base de données depuis vos configurations
const dbUrl = s.SPDB;
const proConfig = {
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false,
    },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Fonction pour vérifier et créer la table player_data si elle n'existe pas
async function ensurePlayerDataTableExists() {
    const client = await pool.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS player_data (
                player_name VARCHAR(255) PRIMARY KEY,
                message TEXT,
                lien TEXT
            );
        `;
        await client.query(query);
        console.log("Table 'player_data' vérifiée/créée avec succès.");
    } catch (error) {
        console.error("Erreur lors de la vérification/création de la table 'player_data':", error);
    } finally {
        client.release();
    }
}

// Fonction pour ajouter ou mettre à jour un enregistrement dans la table player_data
async function addOrUpdateDataInPlayer(playerName, message, lien) {
    const client = await pool.connect();
    try {
        // Vérifiez d'abord si la table existe, sinon créez-la
        await ensurePlayerDataTableExists();

        const query = `
            INSERT INTO player_data (player_name, message, lien)
            VALUES ($1, $2, $3)
            ON CONFLICT (player_name)
            DO UPDATE SET message = excluded.message, lien = excluded.lien;
        `;
        const values = [playerName, message, lien];

        await client.query(query, values);
        console.log(`Données ajoutées ou mises à jour pour le joueur '${playerName}' avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de l'ajout ou de la mise à jour des données pour le joueur '${playerName}':`, error);
    } finally {
        client.release();
    }
}

// Fonction pour récupérer les données d'un joueur spécifique
async function getDataFromPlayer(playerName) {
    const client = await pool.connect();
    try {
        // Vérifiez d'abord si la table existe, sinon créez-la
        await ensurePlayerDataTableExists();

        const query = `SELECT message, lien FROM player_data WHERE player_name = $1`;
        const result = await client.query(query, [playerName]);

        if (result.rows.length > 0) {
            const { message, lien } = result.rows[0];
            return { message, lien };
        } else {
            console.log(`Aucune donnée trouvée pour le joueur '${playerName}'.`);
            return null;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour le joueur '${playerName}':`, error);
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
