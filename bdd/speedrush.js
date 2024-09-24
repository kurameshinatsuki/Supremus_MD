require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

// Connexion à la base de données
const dbUrl = s.SPDB;  // L'URL de la base de données à partir des configurations
const proConfig = {
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false,
    },
};

const pool = new Pool(proConfig);

// Vérifie et crée la table des sections de courses si elle n'existe pas
async function ensureSectionsTableExists() {
    const client = await pool.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS sections_courses (
                distance_km INT PRIMARY KEY,  -- Distance en kilomètres
                verdict TEXT,                 -- Verdict pour la section
                image_url TEXT,               -- URL de l'image associée
                defis INT                     -- Nombre de défis pour cette section
            );
        `;
        await client.query(query);
        console.log("Table 'sections_courses' vérifiée/créée avec succès.");
    } catch (error) {
        console.error("Erreur lors de la création de la table 'sections_courses':", error);
    } finally {
        client.release();
    }
}

// Récupère le verdict et l'image associés à une distance donnée
async function getVerdictByDistance(distance) {
    const client = await pool.connect();
    try {
        await ensureSectionsTableExists();  // S'assurer que la table existe
        const query = `SELECT verdict, image_url, defis FROM sections_courses WHERE distance_km = $1`;
        const result = await client.query(query, [distance]);

        if (result.rows.length > 0) {
            const { verdict, image_url, defis } = result.rows[0];
            return { verdict, image_url, defis };
        } else {
            console.log(`Aucune donnée trouvée pour ${distance} km.`);
            return null;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${distance}km:`, error);
        return null;
    } finally {
        client.release();
    }
}

// Met à jour le verdict, l'image et les défis pour une distance spécifique
async function updateVerdictByDistance(distance, verdict, imageUrl, defis) {
    const client = await pool.connect();
    try {
        await ensureSectionsTableExists();  // S'assurer que la table existe
        const query = `
            INSERT INTO sections_courses (distance_km, verdict, image_url, defis)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (distance_km)
            DO UPDATE SET verdict = excluded.verdict, image_url = excluded.image_url, defis = excluded.defis;
        `;
        const values = [distance, verdict, imageUrl, defis];
        await client.query(query, values);
        console.log(`Verdict mis à jour pour ${distance} km avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du verdict pour ${distance} km:`, error);
    } finally {
        client.release();
    }
}

module.exports = {
    getVerdictByDistance,
    updateVerdictByDistance,
};