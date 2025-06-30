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

// Nouvelle fonction pour convertir les JID en LID de manière fiable
function convertToLid(jid) {
    if (!jid) return jid;
    // Conversion forcée pour les groupes
    if (jid.endsWith('@g.us')) return jid.replace('@g.us', '@lid');
    // Gestion des numéros de téléphone
    if (jid.includes('@s.whatsapp.net')) return jid.replace('@s.whatsapp.net', '@lid');
    return jid;
}

zokou({ 
    nomCom: "groupes", 
    categorie: "MON-BOT", 
    reaction: "🌐" 
}, async (origineMessage, zk, { repondre }) => {
    try {
        const groupes = await zk.groupFetchAllParticipating();
        const liste = Object.values(groupes)
            .map(g => `• ${g.subject || 'Sans nom'} (${convertToLid(g.id)})`)
            .join("\n");
        
        repondre(`*📋 Groupes Visibles (${Object.values(groupes).length}) :*\n${liste}`);
    } catch (e) {
        console.error("Erreur groupes:", e);
        repondre("❌ Erreur lors de la récupération des groupes");
    }
});

zokou({ 
    nomCom: "resync", 
    categorie: "MON-BOT", 
    reaction: "🔄" 
}, async (origineMessage, zk, { repondre }) => {
    try {
        const groupes = await zk.groupFetchAllParticipating();
        const failed = [];
        let successCount = 0;

        for (let g of Object.values(groupes)) {
            try {
                const lid = convertToLid(g.id);
                await zk.groupMetadata(lid); // Utilisation du LID
                successCount++;
                await new Promise(resolve => setTimeout(resolve, 500)); // Délai anti-ban
            } catch (e) {
                failed.push(`${g.subject || 'Sans nom'} (${g.id})`);
            }
        }

        let result = `✅ ${successCount} groupes synchronisés`;
        if (failed.length > 0) {
            result += `\n❌ ${failed.length} échecs :\n${failed.slice(0, 5).join("\n")}`;
            if (failed.length > 5) result += `\n...et ${failed.length - 5} autres`;
        }

        repondre(result);
    } catch (e) {
        console.error("Erreur resync:", e);
        repondre("❌ Crash pendant la resynchronisation");
    }
});
