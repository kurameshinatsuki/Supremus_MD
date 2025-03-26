require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

const dbUrl = s.SPDB;
const proConfig = {
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false,
    },
};

const pool = new Pool(proConfig);

// Vérifie et crée la table des verdicts si elle n'existe pas
async function ensureVerdictsTableExists() {
    const client = await pool.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS verdicts (
                mot_cle VARCHAR(255) PRIMARY KEY,
                verdict TEXT,
                image_url TEXT,
                etat_actuel VARCHAR(255) DEFAULT 'normal'
            );
        `;
        await client.query(query);
        console.log("Table 'verdicts' vérifiée/créée avec succès.");
    } catch (error) {
        console.error("Erreur lors de la création de la table 'verdicts':", error);
    } finally {
        client.release();
    }
}

// Récupère le verdict et l'image associés à un mot-clé
async function getVerdictByKeyword(motCle) {
    const client = await pool.connect();
    try {
        await ensureVerdictsTableExists();
        const query = `SELECT verdict, image_url FROM verdicts WHERE mot_cle = $1`;
        const result = await client.query(query, [motCle]);

        if (result.rows.length > 0) {
            const { verdict, image_url } = result.rows[0];
            return { verdict, image_url };
        } else {
            console.log(`Aucun verdict trouvé pour le mot-clé '${motCle}'.`);
            return null;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération du verdict pour le mot-clé '${motCle}':`, error);
        return null;
    } finally {
        client.release();
    }
}

// Met à jour le verdict, l'image et l'état pour un mot-clé spécifique
async function updateVerdict(motCle, verdict, imageUrl, etat) {
    const client = await pool.connect();
    try {
        await ensureVerdictsTableExists();
        const query = `
            INSERT INTO verdicts (mot_cle, verdict, image_url, etat_actuel)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (mot_cle)
            DO UPDATE SET verdict = excluded.verdict, image_url = excluded.image_url, etat_actuel = excluded.etat_actuel;
        `;
        const values = [motCle, verdict, imageUrl, etat];
        await client.query(query, values);
        console.log(`Verdict mis à jour pour '${motCle}' avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du verdict pour '${motCle}':`, error);
    } finally {
        client.release();
    }
}

module.exports = {
    getVerdictByKeyword,
    updateVerdict,
};