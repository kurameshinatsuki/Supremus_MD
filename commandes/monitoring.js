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

  // Vérifier si un monitoring est déjà actif
  if (monitoringState.active) {
    return repondre("❌ Une surveillance est déjà en cours. Utilisez *-stopping* d'abord.");
  }

  // Récupérer les paramètres
  const url = arg[0]?.match(/https?:\/\/[^\s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5; // 5min par défaut

  // Validation des entrées
  if (!url) {
    return repondre("❌ URL manquante !\nUsage : *-monitor [url] [intervalle-en-min]*\nExemple : *-monitor https://supremusbot.com 5*");
  }

  if (intervalMinutes < 1 || intervalMinutes > 1440) {
    return repondre("❌ Intervalle invalide (1-10 minutes)");
  }

  // Initialiser le monitoring
  monitoringState = {
    active: true,
    url,
    interval: null,
    intervalMinutes,
    checkCount: 0,
    lastMessage: null
  };

  // Envoyer le message initial
  const initialMessage = await zk.sendMessage(origineMessage, {
    text: `🔍 *DÉBUT SURVEILLANCE* 🔍\n\n*URL:* ${url}\n*Intervalle:* ${intervalMinutes} min\n*Statut:* En attente...`
  });
  monitoringState.lastMessage = initialMessage.key;

  // Fonction de vérification
  const checkWebsite = async () => {
    if (!monitoringState.active) return;
    
    try {
      monitoringState.checkCount++;
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      const statusText = `✅ *CHECK #${monitoringState.checkCount}*\n\n` +
                         `*URL:* ${url}\n` +
                         `*Statut:* ${response.status}\n` +
                         `*Temps:* ${responseTime}ms\n` +
                         `*Prochain:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;

      // Éditer le message précédent
      await zk.sendMessage(origineMessage, {
        text: statusText,
        edit: monitoringState.lastMessage
      });

    } catch (error) {
      const errorText = `❌ *CHECK #${monitoringState.checkCount}*\n\n` +
                        `*URL:* ${url}\n` +
                        `*Erreur:* ${error.code || error.message}\n` +
                        `*Prochain:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;

      await zk.sendMessage(origineMessage, {
        text: errorText,
        edit: monitoringState.lastMessage
      });
    }
  };

  // Premier check immédiat
  await checkWebsite();

  // Configurer l'intervalle
  monitoringState.interval = setInterval(checkWebsite, intervalMinutes * 60 * 1000);

  repondre(`*Surveillance démarrée pour ${url} (vérification toutes les ${intervalMinutes} minutes)*`);
});

zokou({
  nomCom: "stopping",
  categorie: "MON-BOT",
  reaction: "🛑"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  // Vérifie si c'est le propriétaire
  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  if (!monitoringState.active) {
    return repondre("❌ Aucune surveillance en cours !");
  }

  // Arrêter l'intervalle
  clearInterval(monitoringState.interval);
  
  // Envoyer le rapport final
  const finalText = `🛑 SURVEILLANCE ARRÊTÉE\n\n` +
                   `*URL:* ${monitoringState.url}\n` +
                   `*Vérifications:* ${monitoringState.checkCount}\n` +
                   `*Dernier statut:* ${new Date().toLocaleTimeString()}`;

  await zk.sendMessage(origineMessage, {
    text: finalText,
    edit: monitoringState.lastMessage
  });

  // Réinitialiser l'état
  monitoringState = {
    active: false,
    url: null,
    interval: null,
    intervalMinutes: null,
    checkCount: 0,
    lastMessage: null
  };
});

zokou({
  nomCom: "monitorstatus",
  categorie: "MON-BOT",
  reaction: "ℹ️"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  // Vérifie si c'est le propriétaire
  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  if (!monitoringState.active) {
    return repondre("❌ Aucune surveillance en cours !");
  }

  const statusText = `🔍 *SURVEILLANCE ACTIVE* 🔍\n\n` +
                     `*URL:* ${monitoringState.url}\n` +
                     `*Intervalle:* ${monitoringState.intervalMinutes} min\n` +
                     `*Vérifications:* ${monitoringState.checkCount}\n` +
                     `*Prochain check:* ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}`;

  repondre(statusText);
});