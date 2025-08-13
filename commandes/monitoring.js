const { zokou } = require("../framework/zokou");
const axios = require('axios');

// État global pour le monitoring
let monitoringState = {
  active: false,
  url: null,
  interval: null,
  intervalMinutes: null,
  checkCount: 0,
  lastMessage: null
};

// Commande pour démarrer la surveillance
zokou({
  nomCom: "ping",
  categorie: "MON-BOT",
  reaction: "🌐"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  // Vérifie si c'est le propriétaire
  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  if (monitoringState.active) {
    return repondre("❌ Une surveillance est déjà en cours. Utilisez *-stopping* pour arrêter.");
  }

  // Récupérer paramètres
  const url = arg[0]?.match(/https?:\/\/[^\s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5; // par défaut 5 min

  // Validation
  if (!url) {
    return repondre("❌ URL manquante !\nUsage : *-ping [url] [intervalle-en-min]*\nExemple : *-ping https://supremusbot.com 5*");
  }

  if (intervalMinutes < 1 || intervalMinutes > 10) {
    return repondre("❌ Intervalle invalide (1-10 minutes)");
  }

  // Initialisation
  monitoringState = {
    active: true,
    url,
    interval: null,
    intervalMinutes,
    checkCount: 0,
    lastMessage: null
  };

  // Envoi message initial
  const jid = origineMessage.key.remoteJid;
  const initialMessage = await zk.sendMessage(jid, {
    text: `🔍 *DÉBUT PING* 🔍\n\n*URL:* ${url}\n*Intervalle:* ${intervalMinutes} min\n*Statut:* En attente...`
  });
  monitoringState.lastMessage = initialMessage.key;

  // Fonction de check
  const checkWebsite = async () => {
    if (!monitoringState.active) return;
    
    try {
      monitoringState.checkCount++;
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      const statusText = `✅ *PING #${monitoringState.checkCount}*\n\n` +
                         `*URL:* ${url}\n` +
                         `*Statut HTTP:* ${response.status}\n` +
                         `*Temps de réponse:* ${responseTime}ms\n` +
                         `*Prochain test:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;

      try {
        await zk.sendMessage(jid, { text: statusText, edit: monitoringState.lastMessage });
      } catch {
        await zk.sendMessage(jid, { text: statusText });
      }

    } catch (error) {
      const errorText = `❌ *PING #${monitoringState.checkCount}*\n\n` +
                        `*URL:* ${url}\n` +
                        `*Erreur:* ${error.code || error.message}\n` +
                        `*Prochain test:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;
      
      try {
        await zk.sendMessage(jid, { text: errorText, edit: monitoringState.lastMessage });
      } catch {
        await zk.sendMessage(jid, { text: errorText });
      }
    }
  };

  // Premier ping immédiat
  await checkWebsite();

  // Démarrage intervalle
  monitoringState.interval = setInterval(checkWebsite, intervalMinutes * 60 * 1000);

  repondre(`*Surveillance de ${url} démarrée (ping toutes les ${intervalMinutes} minutes)*`);
});

// Commande pour arrêter le ping
zokou({
  nomCom: "stopping",
  categorie: "MON-BOT",
  reaction: "🛑"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  if (!monitoringState.active) {
    return repondre("❌ Aucun ping en cours !");
  }

  clearInterval(monitoringState.interval);

  const jid = origineMessage.key.remoteJid;
  const finalText = `🛑 *PING ARRÊTÉ*\n\n` +
                   `*URL:* ${monitoringState.url}\n` +
                   `*Total de pings effectués:* ${monitoringState.checkCount}\n` +
                   `*Dernier test:* ${new Date().toLocaleTimeString()}`;

  try {
    await zk.sendMessage(jid, { text: finalText, edit: monitoringState.lastMessage });
  } catch {
    await zk.sendMessage(jid, { text: finalText });
  }

  monitoringState = {
    active: false,
    url: null,
    interval: null,
    intervalMinutes: null,
    checkCount: 0,
    lastMessage: null
  };
});

// Commande pour voir le statut du ping
zokou({
  nomCom: "pingstatus",
  categorie: "MON-BOT",
  reaction: "ℹ️"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  if (!monitoringState.active) {
    return repondre("❌ Aucun ping en cours !");
  }

  const statusText = `🔍 *PING ACTIF* 🔍\n\n` +
                     `*URL:* ${monitoringState.url}\n` +
                     `*Intervalle:* ${monitoringState.intervalMinutes} min\n` +
                     `*Pings effectués:* ${monitoringState.checkCount}\n` +
                     `*Prochain ping:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;

  repondre(statusText);
});