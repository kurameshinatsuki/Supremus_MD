require("dotenv").config();
const { Pool } = require("pg");

const dbUrl = "postgresql://rc_db_pblv_user:kxZvnDTYaPYTScD70HBov7Wgr0nboPL7@dpg-d2o2cnfdiees73evq170-a.oregon-postgres.render.com/rc_db_pblv";
const proConfig = {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
};

const pool = new Pool(proConfig);

// Flag pour ne vérifier la table qu'une seule fois
let tableVerified = false;

// Fonction pour créer la table si elle n'existe pas
async function ensurePlayerDataTableExists() {
    if (tableVerified) return;
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS player_data (
                player_name VARCHAR(255) PRIMARY KEY,
                message TEXT,
                lien TEXT
            );
        `);
        tableVerified = true;
        console.log("✅ Table 'player_data' vérifiée/créée.");
    } catch (error) {
        console.error("❌ Erreur création table 'player_data':", error);
    } finally {
        client.release();
    }
}

// Ajouter ou mettre à jour les données d'un joueur
async function addOrUpdateDataInPlayer(playerName, message, lien) {
    if (!playerName || !message || !lien) {
        console.warn("❌ Paramètres invalides (add/update)");
        return;
    }

    const client = await pool.connect();
    try {
        await ensurePlayerDataTableExists();

        const query = `
            INSERT INTO player_data (player_name, message, lien)
            VALUES ($1, $2, $3)
            ON CONFLICT (player_name)
            DO UPDATE SET message = excluded.message, lien = excluded.lien;
        `;
        await client.query(query, [playerName, message, lien]);

        console.log(`✔️ Données enregistrées pour '${playerName}'`);
    } catch (error) {
        console.error(`❌ Erreur mise à jour '${playerName}':`, error);
    } finally {
        client.release();
    }
}

// Récupérer les données d'un joueur
async function getDataFromPlayer(playerName) {
    if (!playerName) {
        console.warn("❌ Nom de joueur invalide (get)");
        return null;
    }

    const client = await pool.connect();
    try {
        await ensurePlayerDataTableExists();

        const result = await client.query(
            `SELECT message, lien FROM player_data WHERE player_name = $1`,
            [playerName]
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error(`❌ Erreur récupération '${playerName}':`, error);
        return null;
    } finally {
        client.release();
    }
}

// Récupérer tous les noms de joueurs disponibles
async function getAllPlayers() {
    const client = await pool.connect();
    try {
        await ensurePlayerDataTableExists();

        const result = await client.query(
            `SELECT player_name FROM player_data ORDER BY player_name`
        );

        // Retourner un tableau des noms de joueurs
        return result.rows.map(row => row.player_name);
    } catch (error) {
        console.error("❌ Erreur récupération de tous les joueurs:", error);
        return [];
    } finally {
        client.release();
    }
}

// Supprimer les données d'un joueur
async function deleteDataFromPlayer(playerName) {
    if (!playerName) {
        console.warn("❌ Nom de joueur invalide (delete)");
        return;
    }

    const client = await pool.connect();
    try {
        await ensurePlayerDataTableExists();

        await client.query(
            `DELETE FROM player_data WHERE player_name = $1`,
            [playerName]
        );
        console.log(`🗑️ Données supprimées pour '${playerName}'`);
    } catch (error) {
        console.error(`❌ Erreur suppression '${playerName}':`, error);
    } finally {
        client.release();
    }
}

// Exports
module.exports = {
    addOrUpdateDataInPlayer,
    getDataFromPlayer,
    deleteDataFromPlayer,
    getAllPlayers
};