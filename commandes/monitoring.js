zokou({
  nomCom: "surveiller",
  categorie: "MON-BOT",
  reaction: "🌐",
  description: "Surveille une URL par des requêtes régulières"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  // Configuration
  const url = arg[0]?.match(/https?:\/\/[^\s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5; // 5min par défaut
  const maxChecks = 30; // Maximum de vérifications

  // Vérifications
  if (!url) {
    return repondre("❌ URL manquante !\nUsage : *-surveiller [url] [intervalle-en-min]*\nExemple : *-surveiller https://monbot.com 10*");
  }

  if (intervalMinutes < 1 || intervalMinutes > 1440) {
    return repondre("❌ Intervalle invalide (1-1440 minutes)");
  }

  // Démarrer la surveillance
  let checksCount = 0;
  const intervalMs = intervalMinutes * 60 * 1000;
  const statusMessages = [];

  const sendStatus = async (message) => {
    const statusMsg = await zk.sendMessage(origineMessage, { text: message });
    statusMessages.push(statusMsg.key);
  };

  await sendStatus(`🔍 *Début de la surveillance* 🔍\n\nURL: ${url}\nIntervalle: ${intervalMinutes} minutes`);

  const checkInterval = setInterval(async () => {
    try {
      checksCount++;
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      await sendStatus(
        `✅ #${checksCount} - ${new Date().toLocaleTimeString()}\n` +
        `Statut: ${response.status}\n` +
        `Temps: ${responseTime}ms\n` +
        `Prochain check: ${new Date(Date.now() + intervalMs).toLocaleTimeString()}`
      );

      if (checksCount >= maxChecks) {
        clearInterval(checkInterval);
        await sendStatus(`🛑 Surveillance terminée (${maxChecks} vérifications effectuées)`);
      }
    } catch (error) {
      await sendStatus(
        `❌ #${checksCount} - ${new Date().toLocaleTimeString()}\n` +
        `Erreur: ${error.message}\n` +
        `Nouvelle tentative: ${new Date(Date.now() + intervalMs).toLocaleTimeString()}`
      );
    }
  }, intervalMs);

  // Stocker l'intervalle pour l'arrêter plus tard
  commandeOptions.surveillance = {
    interval: checkInterval,
    url: url,
    statusMessages: statusMessages
  };

  // Envoyer les commandes disponibles
  await zk.sendMessage(origineMessage, {
    text: `ℹ️ Commandes disponibles :
- *-stopsurveillance* : Arrêter la surveillance
- *-statussurveillance* : Voir le statut actuel`
  });
});

// Commande pour arrêter la surveillance
zokou({
  nomCom: "stopsurveillance",
  categorie: "MON-BOT",
  reaction: "🛑"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, surveillance } = commandeOptions;

  if (!surveillance) {
    return repondre("❌ Aucune surveillance en cours !");
  }

  clearInterval(surveillance.interval);
  await zk.sendMessage(origineMessage, {
    text: `🛑 Surveillance de ${surveillance.url} arrêtée`
  });

  // Supprimer les messages de statut si possible
  try {
    for (const msgKey of surveillance.statusMessages) {
      await zk.sendMessage(origineMessage, {
        delete: msgKey
      });
    }
  } catch (e) {
    console.error("Erreur suppression messages:", e);
  }

  commandeOptions.surveillance = null;
});

// Commande pour voir le statut
zokou({
  nomCom: "statussurveillance",
  categorie: "MON-BOT",
  reaction: "ℹ️"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, surveillance } = commandeOptions;

  if (!surveillance) {
    return repondre("❌ Aucune surveillance en cours !");
  }

  await repondre(
    `🔍 *Surveillance en cours* 🔍\n\n` +
    `URL: ${surveillance.url}\n` +
    `Dernier check: ${new Date().toLocaleTimeString()}\n` +
    `Messages de statut: ${surveillance.statusMessages.length}`
  );
});