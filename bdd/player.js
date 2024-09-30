// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");
const s = require("../set");

// URL de la base de données
const dbUrl = s.SPDB;
const proConfig = {
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false,
    },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Fonction pour créer une table pour un joueur spécifique avec toutes les colonnes nécessaires
const creerTablePlayer = async (playerName) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${playerName} (
                id serial PRIMARY KEY,
                s1 text,  -- ID du joueur
                s2 text,  -- Statut
                s3 text,  -- Mode
                s4 text,  -- Rang
                s5 text,  -- ABM
                s6 text,  -- SPEED RUSH
                s7 text,  -- YU-GI-OH
                s8 text,  -- Champion
                s9 text,  -- Spécialité
                s10 text, -- Leader
                s11 text, -- Challenge
                s12 text, -- Légende
                s13 text, -- Battles
                s14 text, -- V
                s15 text, -- D
                s16 text, -- L
                s17 text, -- TOP 3
                s18 text, -- M.W
                s19 text, -- M.L
                s20 text, -- Cards AMB
                s21 text, -- Vehicles
                s22 text, -- Yu-Gi-Oh
                s23 text, -- Skins
                s24 text, -- Items
                s25 text, -- S Tokens
                s26 text, -- S Gemmes
                s27 text, -- Coupons
                s28 text  -- Box VIP
            );
        `);
        console.log(`La table '${playerName}' a été créée avec succès.`);
    } catch (e) {
        console.error(`Erreur lors de la création de la table '${playerName}':`, e);
    }
};

// Fonction pour ajouter ou mettre à jour une colonne spécifique pour un joueur
async function addOrUpdateDataInPlayer(playerName, key, value) {
    const client = await pool.connect();
    try {
        // Requête SQL pour insérer ou mettre à jour les données dans une colonne spécifique
        const query = `
            INSERT INTO ${playerName} (${key}) 
            VALUES ($1) 
            ON CONFLICT (id) 
            DO UPDATE SET ${key} = EXCLUDED.${key};
        `;
        const values = [value];

        await client.query(query, values);
        console.log(`Données mises à jour dans la table '${playerName}' avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des données dans la table '${playerName}':`, error);
    } finally {
        client.release();
    }
}

// Fonction pour récupérer toutes les données d'un joueur spécifique
async function getDataFromPlayer(playerName) {
    const client = await pool.connect();
    try {
        // Requête SQL pour récupérer toutes les données du joueur
        const query = `SELECT * FROM ${playerName} WHERE id = 1`;
        const result = await client.query(query);

        if (result.rows.length > 0) {
            return result.rows[0];  // Renvoie toutes les données sous forme d'objet
        } else {
            console.log(`Aucune donnée trouvée dans la table '${playerName}'.`);
            return null;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des données depuis la table '${playerName}':`, error);
        return null;
    } finally {
        client.release();
    }
}

// Exportez les fonctions pour les utiliser dans d'autres fichiers
module.exports = {
    creerTablePlayer,
    addOrUpdateDataInPlayer,
    getDataFromPlayer,
};