const { zokou } = require("../framework/zokou");
const axios = require("axios");

// Toutes les surveillances actives
let monitoringTasks = {};

// Petit logger console
const logEvent = (msg) => {
  console.log(`[${new Date().toISOString()}] ${msg}`);
};

// Fonction qui fait le check
const createMonitor = async (origineMessage, zk, url, intervalMinutes) => {
  const id = url; // identifiant unique par URL

  // Initialiser l'état
  monitoringTasks[id] = {
    active: true,
    url,
    interval: null,
    intervalMinutes,
    checkCount: 0,
    lastMessage: null,
    logs: []
  };

  // Message initial
  const initialMessage = await zk.sendMessage(origineMessage, {
    text: `🌐 *Surveillance démarrée* 🌐\n━━━━━━━━━━━━━━━\n🔗 URL: ${url}\n⏱ Intervalle: ${intervalMinutes} min\n📊 Vérifications: 0\n🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}\n━━━━━━━━━━━━━━━`
  });

  monitoringTasks[id].lastMessage = initialMessage.key;
  logEvent(`Surveillance démarrée sur ${url} toutes les ${intervalMinutes} minutes`);

  // Fonction check
  const checkWebsite = async () => {
    if (!monitoringTasks[id] || !monitoringTasks[id].active) return;

    try {
      monitoringTasks[id].checkCount++;
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      const statusText =
        `#${monitoringTasks[id].checkCount} | ✅ *OK*\n` +
        `📡 Code: ${response.status}\n` +
        `⚡ Temps: ${responseTime}ms\n` +
        `🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}`;

      monitoringTasks[id].logs.push({
        time: new Date(),
        success: true,
        status: response.status,
        responseTime
      });

      await zk.sendMessage(origineMessage, {
        text: statusText,
        edit: monitoringTasks[id].lastMessage
      });

      logEvent(`Check #${monitoringTasks[id].checkCount} OK pour ${url} - ${response.status} en ${responseTime}ms`);
    } catch (error) {
      const errorText =
        `#${monitoringTasks[id].checkCount} | ❌ *Erreur*\n` +
        `📡 Code: ${error.code || error.message}\n` +
        `🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}`;

      monitoringTasks[id].logs.push({
        time: new Date(),
        success: false,
        error: error.code || error.message
      });

      await zk.sendMessage(origineMessage, {
        text: errorText,
        edit: monitoringTasks[id].lastMessage
      });

      logEvent(`Erreur check #${monitoringTasks[id].checkCount} pour ${url} - ${error.code || error.message}`);
    }
  };

  // Premier check immédiat
  await checkWebsite();

  // Configurer l’intervalle
  monitoringTasks[id].interval = setInterval(checkWebsite, intervalMinutes * 60000);
};

// Commande pour démarrer une surveillance
zokou({
  nomCom: "monitor",
  categorie: "MON-BOT",
  reaction: "🌐",
  description: "Surveille une URL web à intervalles réguliers"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  const url = arg[0]?.match(/https?:\/\/[^\s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5;

  if (!url) {
    return repondre("❌ URL manquante !\nUsage : *-monitor [url] [intervalle-en-min]*\nExemple : *-monitor https://monbot.com 10*");
  }

  if (intervalMinutes < 1 || intervalMinutes > 1440) {
    return repondre("❌ Intervalle invalide (1-1440 minutes)");
  }

  if (monitoringTasks[url]) {
    return repondre("❌ Cette URL est déjà surveillée !");
  }

  await createMonitor(origineMessage, zk, url, intervalMinutes);
  repondre(`✅ Surveillance activée pour ${url} (toutes les ${intervalMinutes} minutes)`);
});

// Commande pour arrêter une surveillance
zokou({
  nomCom: "stopmonitor",
  categorie: "MON-BOT",
  reaction: "🛑",
  description: "Arrête la surveillance d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];

  if (!url || !monitoringTasks[url]) {
    return repondre("❌ Aucune surveillance active pour cette URL !");
  }

  clearInterval(monitoringTasks[url].interval);

  const finalText =
    `🛑 *Surveillance arrêtée* 🛑\n━━━━━━━━━━━━━━━\n🔗 URL: ${monitoringTasks[url].url}\n📊 Vérifications: ${monitoringTasks[url].checkCount}\n🕒 Fin: ${new Date().toLocaleTimeString()}\n━━━━━━━━━━━━━━━`;

  await zk.sendMessage(origineMessage, {
    text: finalText,
    edit: monitoringTasks[url].lastMessage
  });

  delete monitoringTasks[url];
  logEvent(`Surveillance arrêtée pour ${url}`);
});

// Commande pour afficher statut d'une URL
zokou({
  nomCom: "monitorstatus",
  categorie: "MON-BOT",
  reaction: "ℹ️",
  description: "Affiche le statut de la surveillance d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];

  if (!url || !monitoringTasks[url]) {
    return repondre("❌ Aucune surveillance active pour cette URL !");
  }

  const task = monitoringTasks[url];
  const statusText =
    `🌐 *Surveillance active* 🌐\n━━━━━━━━━━━━━━━\n🔗 URL: ${task.url}\n⏱ Intervalle: ${task.intervalMinutes} min\n📊 Vérifications: ${task.checkCount}\n🕒 Prochain: ${new Date(Date.now() + task.intervalMinutes * 60000).toLocaleTimeString()}\n━━━━━━━━━━━━━━━`;

  repondre(statusText);
});

// Commande pour voir les derniers logs
zokou({
  nomCom: "monitorlogs",
  categorie: "MON-BOT",
  reaction: "📜",
  description: "Affiche les derniers logs d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];

  if (!url || !monitoringTasks[url]) {
    return repondre("❌ Aucune surveillance active pour cette URL !");
  }

  const logs = monitoringTasks[url].logs.slice(-5).map((log, i) => {
    return `${i + 1}. ${log.success ? "✅" : "❌"} | ${log.status || log.error} | ${log.responseTime || "-"}ms | ${log.time.toLocaleTimeString()}`;
  }).join("\n");

  repondre(`📜 *Derniers logs* 📜\n━━━━━━━━━━━━━━━\n${logs}\n━━━━━━━━━━━━━━━`);
});