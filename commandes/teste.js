const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require('fs-extra');
const path = require ('path');

zokou({
  nomCom: "broadcast",
  categorie: "MON-BOT", 
  reaction: "🚀"
}, async (origineMessage, zk, { repondre }) => {

  // 1. Récupération des groupes
  const groupes = await zk.groupFetchAllParticipating();
  const groupesActifs = Object.values(groupes).filter(g => !g.isAnnounceGrpRestrict);

  // 2. Préparation du message
  const message = `
📡 *DIFFUSION URGENTE*

Message envoyé à tous les groupes simultanément.
• Date : ${new Date().toLocaleString()}
• Bot : ${zk.user.name}
  `.trim();

  // 3. Envoi avec anti-ban
  const logPath = path.join(process.cwd(), 'broadcast_logs.txt');
  let succes = 0;

  for (const groupe of groupesActifs) {
    try {
      await zk.sendMessage(
        groupe.id, 
        { text: message },
        { waitForAck: true } // Confirmation d'envoi
      );
      fs.appendFileSync(logPath, `[SUCCES] ${new Date().toISOString()} | ${groupe.subject || 'Sans nom'} | ${groupe.id}\n`);
      succes++;
      await new Promise(resolve => setTimeout(resolve, 1500)); // Délai réduit
    } catch (e) {
      fs.appendFileSync(logPath, `[ERREUR] ${new Date().toISOString()} | ${groupe.subject || 'Sans nom'} | ${e.message}\n`);
    }
  }

  // 4. Rapport final
  await repondre(`
✅ *Diffusion terminée*
• Groupes atteints : ${succes}/${groupesActifs.length}
• Consultez \`${logPath}\` pour les détails
  `.trim());
});

let intervalPing = null;
let latenceTimeout = null;
let dernierDelaiMinutes = null; // <= On mémorise le dernier délai utilisé

zokou({ nomCom: "latence", categorie: "MON-BOT", reaction: "⏱️" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;

    if (intervalPing) {
        repondre("*_⏳ Une latence est déjà en cours..._*");
        return;
    }

    // Déterminer le délai demandé par l'utilisateur
    let minutes = parseInt(arg[0]);
    if (isNaN(minutes) || minutes <= 0) {
        minutes = 8; // Valeur par défaut = 8 minutes
    }

    dernierDelaiMinutes = minutes; // On mémorise le délai

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://zokouscan-din3.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `*_⌛ Intervalle écoulé ${dernierDelaiMinutes} min._*` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, minutes * 60 * 1000); // Conversion minutes -> millisecondes

    repondre(`*_⏱️ Latence démarré. Fin de la latence dans ${minutes} minute(s)._*`);
});


zokou({ nomCom: "stop", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        dernierDelaiMinutes = null;
        repondre("*_⏱️ Latence arrêté._*");
    } else {
        repondre("*_⏱️ Aucune latence en cours._*");
    }
});

zokou({ nomCom: "groupes", categorie: "MON-BOT", reaction: "📄" }, async (origineMessage, zk, { repondre }) => {
    const groupes = await zk.groupFetchAllParticipating();
    const liste = Object.values(groupes).map(g => `• ${g.subject} (${g.id})`).join("\n");
    repondre(`*📦 Groupes visibles :*\n${liste}`);
});

zokou({ nomCom: "resync", categorie: "MON-BOT", reaction: "🔄" }, async (origineMessage, zk, { repondre }) => {
    const groupes = await zk.groupFetchAllParticipating();
    const failed = [];

    for (let g of Object.values(groupes)) {
        try {
            await zk.groupMetadata(g.id); // Forcer la mise à jour
        } catch (e) {
            failed.push(g.id);
        }
    }

    if (failed.length > 0) {
        repondre(`❗ Groupes échoués :\n${failed.join("\n")}`);
    } else {
        repondre("✅ Tous les groupes ont été resynchronisés !");
    }
});
