// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

// Configuration de la base de données
const dbUrl = s.DATABASE_URL;
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Vous pouvez maintenant utiliser 'pool' pour interagir avec votre base de données PostgreSQL.
const creerTableevents = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        Id serial PRIMARY KEY,
        jid text UNIQUE,
        welcome text DEFAULT '░░░░░░░░░░░░░░░░░░░░░░
══════════════════════
 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔𝐄 𝐀 𝐋𝐀 "𝐂𝐑𝐏𝐒 𝐍𝐄𝐖 𝐄𝐑𝐀"
══════════════════════
La *CRPS* signifiant "Community Rôle Play Supremus" vous accueille en son sein.
░░░░░░░░░░░░░░░░░░░░░░
══════════════════════
Veuillez consulter la liste des commandes ci-dessous pour accéder aux contenus :

*-menucrps*
░░░░░░░░░░░░░░░░░░░░░░
══════════════════════
*📇 Officialis :* 0️⃣3️⃣
*👤 Rôlistes :* 1️⃣4️⃣
*🪀 Événements :* Aucune
░░░░░░░░░░░░░░░░░░░░░░
══════════════════════
*🌟 𝐎𝐛𝐣𝐞𝐜𝐭𝐢𝐟 :* ~Créer l'ultime RP Textuelle Multivers réaliste et immersive au monde, nous ne voulons que des personnes intéressées par le Rôle Play. Soyez créatif, déterminer et réaliste ainsi nous créeront ce monde.~
░░░░░░░░░░░░░░░░░░░░░░
══════════════════════
❤️‍🔥 𝐋𝐚 𝐒𝐔𝐏𝐑𝐄𝐌𝐀𝐓𝐈𝐄 𝐫𝐞𝐬𝐢𝐝𝐞 𝐞𝐧 𝐧𝐨𝐮𝐬 ❤️‍🔥',
        goodbye text DEFAULT '*✨🧘‍♂️ Latum...*',
        antipromote text DEFAULT '*✨👏 Un KAGE de plus pour le village.*',
        antidemote text DEFAULT '*✨😶 Une minute de silence pour notre défunt KAGE.*'
      );
    `);
    console.log("La table 'events' a été créée avec succès.");
  } catch (e) {
    console.error("Une erreur est survenue lors de la création de la table 'events':", e);
  }
};

// Appelez la méthode pour créer la table "banUser"
creerTableevents();



// Fonction pour ajouter un utilisateur à la liste des bannis
async function attribuerUnevaleur(jid, row, valeur) {
    const client = await pool.connect();

    try {
        // Vérifions si le jid existe dans la table
        const result = await client.query('SELECT * FROM events WHERE jid = $1', [jid]);
        
        // Vérifiez la longueur des lignes (rows) pour déterminer si le jid existe
        const jidExiste = result.rows.length > 0;

        if (jidExiste) {
            // Si le jid existe, mettez à jour la valeur de la colonne spécifiée (row)
            await client.query(`UPDATE events SET ${row} = $1 WHERE jid = $2`, [valeur, jid]);
            console.log(`La colonne ${row} a été actualisée sur ${valeur} pour le jid ${jid}`);
        } else {
            // Si le jid n'existe pas, ajoutez une nouvelle ligne avec le jid et la valeur spécifiés
            await client.query(`INSERT INTO events (jid, ${row}) VALUES ($1, $2)`, [jid, valeur]);
            console.log(`Nouveau jid ${jid} ajouté avec la colonne ${row} ayant la valeur ${valeur}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'actualisation de events :", error);
    } finally {
        client.release();
    }
};


async function recupevents(jid, row) {
     const client = await pool.connect()
    try {
        const result = await client.query('SELECT ' + row + ' FROM events WHERE jid = $1', [jid]);
        const jidExists = result.rows.length > 0;

        if (jidExists) {
            return result.rows[0][row];
        } else {
            return 'non';
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
    }
}



module.exports = {
  attribuerUnevaleur,
  recupevents,
};
