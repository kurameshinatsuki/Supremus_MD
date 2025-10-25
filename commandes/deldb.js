const { zokou } = require("../framework/zokou");
const { Client } = require('pg');

// Commande pour vider toutes les tables
zokou({
  nomCom: "cleardb",
  categorie: "MON-BOT",
  reaction: "🧹",
  description: "Vide toutes les tables de la base (SUPER USER ONLY)"
}, async (dest, zk, { arg, repondre, superUser }) => {

  if (!superUser) {
    return repondre("❌ Commande réservée aux super utilisateurs !");
  }

  // Demande de confirmation
  const confirmation = arg.join(' ').toLowerCase();
  if (confirmation !== 'confirm') {
    return repondre("⚠️ *ATTENTION* ⚠️\nCette commande va vider TOUTES les tables de la base de données!\n\nPour confirmer, tapez: *-cleardb confirm*");
  }

  try {
    await repondre("🧹 Nettoyage de toutes les tables...");

    const client = new Client({
      connectionString: 'postgresql://postgres.ljfkkbvxgflluphnibhp:U.*pF.tueSKb7r3@aws-1-eu-north-1.pooler.supabase.com:6543/postgres',
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Récupérer toutes les tables
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    // Vider chaque table
    for (const table of tablesRes.rows) {
      await client.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
    }
    
    await client.end();
    
    await repondre(`✅ Base de données nettoyée! ${tablesRes.rows.length} tables vidées.`);
    
  } catch (error) {
    console.error('Erreur nettoyage DB:', error);
    await repondre("❌ Erreur lors du nettoyage: " + error.message);
  }
});

zokou({
    nomCom: "getsession",
    categorie: "MON-BOT",
    reaction: "🔒"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;
    
    if (!superUser) {
        return repondre("❌ Owner uniquement");
    }

    try {
        const fs = require('fs-extra');
        const path = require('path');
        const authDir = path.join(__dirname, 'auth');
        
        // Vérifier si le dossier auth existe
        if (!fs.existsSync(authDir)) {
            return repondre("❌ Dossier auth introuvable");
        }

        // Lire tous les fichiers du dossier auth
        const files = await fs.readdir(authDir);
        let sessionData = "💾 SESSION COMPLÈTE - Supremus MD\\n\\n";
        
        for (const file of files) {
            const filePath = path.join(authDir, file);
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
                const content = await fs.readFile(filePath, 'utf8');
                sessionData += `📄 ${file}:\\n${content}\\n\\n══════════════════\\n\\n`;
            }
        }

        // Envoyer en plusieurs messages si trop long
        if (sessionData.length > 16000) {
            const parts = sessionData.match(/[\s\S]{1,16000}/g);
            for (let i = 0; i < parts.length; i++) {
                await repondre(`Partie ${i + 1}/${parts.length}:\\n${parts[i]}`);
                await delay(1000);
            }
        } else {
            await repondre(sessionData);
        }

    } catch (error) {
        console.error(error);
        repondre("❌ Erreur lors de la récupération");
    }
});

zokou({
    nomCom: "backupsession", 
    categorie: "MON-BOT",
    reaction: "🔒"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;
    
    if (!superUser) return repondre("❌ Owner uniquement");

    try {
        const fs = require('fs-extra');
        const path = require('path');
        const archiver = require('archiver'); // npm install archiver
        
        const authDir = path.join(__dirname, 'auth');
        const backupPath = path.join(__dirname, 'session_backup.zip');

        // Créer archive ZIP
        const output = fs.createWriteStream(backupPath);
        const archive = archiver('zip');

        output.on('close', async () => {
            // Envoyer le fichier ZIP
            await zk.sendMessage(dest, {
                document: fs.readFileSync(backupPath),
                fileName: 'session_supremus_backup.zip',
                mimetype: 'application/zip'
            });
            
            // Nettoyer
            fs.unlinkSync(backupPath);
            repondre("✅ Session sauvegardée avec succès");
        });

        archive.pipe(output);
        archive.directory(authDir, false);
        archive.finalize();

    } catch (error) {
        console.error(error);
        repondre("❌ Erreur backup");
    }
});