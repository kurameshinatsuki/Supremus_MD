const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require('fs-extra');
const path = require ('path');

zokou({ 
  nomCom: "broadcast", 
  categorie: "MON-BOT", 
  reaction: "📢" 
}, async (origineMessage, zk, { repondre, prefixe }) => {

  // ⚠️ Mode confirmation (optionnel)
  const confirmation = true; // Passer à `false` pour désactiver

  if (confirmation) {
    await repondre("⚠️ *Confirmation requise* : Ceci enverra un message à tous les groupes. Répondez par *« Oui »* pour confirmer.");
    const reponse = await zk.attendreReponse(origineMessage);
    if (reponse?.toLowerCase() !== "oui") {
      return repondre("❌ Diffusion annulée.");
    }
  }

  // Récupérer les groupes
  const groupes = await zk.groupFetchAllParticipating();
  const listeGroupes = Object.values(groupes).filter(g => !g.isAnnounceGrpRestrict); // Filtre les groupes inactifs

  // Message à diffuser (personnalisable)
  const messageBroadcast = "📢 *Message global* :\n\nSalut tout le monde ! Ceci est une diffusion depuis mon bot. 🚀";

  // Journalisation (sauvegarde dans un fichier)
  const logPath = path.join(process.cwd(), 'broadcast_log.txt');
  let succes = 0, echecs = 0;

  // Envoi avec délai
  for (const [index, groupe] of listeGroupes.entries()) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Délai de 2s
      await zk.sendMessage(groupe.id, { text: messageBroadcast });
      fs.appendFileSync(logPath, `✅ ${new Date().toISOString()} : ${groupe.subject || 'Groupe sans nom'}\n`);
      succes++;
    } catch (e) {
      fs.appendFileSync(logPath, `❌ ${new Date().toISOString()} : ${groupe.subject || 'Groupe sans nom'} -> ${e.message}\n`);
      echecs++;
    }
  }

  // Résumé final
  await repondre(
    `📊 *Rapport de diffusion* :\n` +
    `• Groupes ciblés : ${listeGroupes.length}\n` +
    `• Succès : ${succes}\n` +
    `• Échecs : ${echecs}\n` +
    `• Journal : \`${logPath}\``
  );
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
