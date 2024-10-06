const { Pool } = require("pg");
const s = require("../set");  // Remplacez par votre propre fichier de configuration

// URL de la base de données
const dbUrl = s.SPDB;
const proConfig = {
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false,
    },
};

// Pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Vérifier et créer la table player_profile si elle n'existe pas
async function ensurePlayerProfileTableExists() {
    const client = await pool.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS player_profile (
                player_id VARCHAR(255) PRIMARY KEY,
                status VARCHAR(50),
                mode VARCHAR(50),
                rank JSONB,
                champion VARCHAR(255),
                specialty VARCHAR(255),
                leader VARCHAR(255),
                challenge_count INT,
                legend_titles TEXT,
                battles JSONB,
                top3 INT,
                story_mode JSONB,
                heroes_game JSONB,
                currency JSONB
            );
        `;
        await client.query(query);
        console.log("Table 'player_profile' vérifiée/créée avec succès.");
    } catch (error) {
        console.error("Erreur lors de la création de la table :", error);
    } finally {
        client.release();
    }
}

// Créer un nouveau profil pour un joueur
async function createProfile(playerID) {
    const client = await pool.connect();
    try {
        await ensurePlayerProfileTableExists();

        const query = `
            INSERT INTO player_profile (player_id, status, mode, rank, champion, specialty, leader, challenge_count, legend_titles, battles, top3, story_mode, heroes_game, currency)
            VALUES ($1, 'Novice', 'Free', '{}', '', '', '', 0, '', '{"V": 0, "D": 0, "L": 0}', 0, '{"M.W": 0, "M.L": 0}', '{}', '{"S Tokens": 0, "S Gemmes": 0, "Coupons": 0, "Box VIP": 0, "Compteur": 0}');
        `;
        await client.query(query, [playerID]);
        console.log(`Profil créé pour le joueur '${playerID}'.`);
    } catch (error) {
        console.error("Erreur lors de la création du profil :", error);
    } finally {
        client.release();
    }
}

// Mettre à jour une section du profil
async function updateProfile(playerID, section, value) {
    const client = await pool.connect();
    try {
        await ensurePlayerProfileTableExists();

        const query = `
            UPDATE player_profile
            SET ${section} = $2
            WHERE player_id = $1;
        `;
        await client.query(query, [playerID, value]);
        console.log(`Profil du joueur '${playerID}' mis à jour. Section : ${section}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
    } finally {
        client.release();
    }
}

// Récupérer le profil d'un joueur
async function getProfile(playerID) {
    const client = await pool.connect();
    try {
        await ensurePlayerProfileTableExists();

        const query = `SELECT * FROM player_profile WHERE player_id = $1;`;
        const result = await client.query(query, [playerID]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            console.log(`Aucun profil trouvé pour le joueur '${playerID}'.`);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        return null;
    } finally {
        client.release();
    }
}

module.exports = {
    createProfile,
    updateProfile,
    getProfile,
};