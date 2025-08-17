const { zokou } = require("../framework/zokou");
const axios = require('axios');


// État global pour le monitoring
let monitoringState = {
  active: false,
  url: null,
  interval: null,
  intervalMinutes: null,
  checkCount: 0,
  lastMessage: null,
  startTime: null
};

// Logger amélioré
const logger = {
  info: (msg) => console.log(chalk.blue(`[ℹ] ${new Date().toISOString()} - ${msg}`)),
  success: (msg) => console.log(chalk.green(`[✓] ${new Date().toISOString()} - ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`[⚠] ${new Date().toISOString()} - ${msg}`)),
  error: (msg) => console.log(chalk.red(`[✗] ${new Date().toISOString()} - ${msg}`))
};

zokou({
  nomCom: "monitor",
  categorie: "MON-BOT",
  reaction: "🌐",
  description: "Surveille une URL web à intervalles réguliers"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  logger.info(`Commande monitor déclenchée par ${origineMessage.participant || origineMessage.key.remoteJid}`);
  
  // Vérifier si un monitoring est déjà actif
  if (monitoringState.active) {
    logger.warn("Tentative de démarrage alors qu'un monitoring est actif");
    return repondre("❌ *Surveillance déjà active* \nUtilisez " + "```-stopmonitor```" + " pour l'arrêter");
  }

  // Récupérer les paramètres
  const url = arg[0]?.match(/https?:\/\/[^\s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5;

  // Validation des entrées
  if (!url) {
    logger.error("URL manquante dans la commande");
    return repondre(
      "❌ *URL manquante !*\n\n" +
      "🔹 Usage : " + "```-monitor [url] [intervalle-en-min]```" + "\n" +
      "🔹 Exemple : " + "```-monitor https://exemple.com 10```"
    );
  }

  if (intervalMinutes < 1 || intervalMinutes > 1440) {
    logger.error(`Intervalle invalide: ${intervalMinutes} minutes`);
    return repondre(
      "❌ *Intervalle invalide !*\n\n" +
      "L'intervalle doit être compris entre " + "`1 minute`" + " et " + "`24 heures`"
    );
  }

  // Initialiser le monitoring
  monitoringState = {
    active: true,
    url,
    interval: null,
    intervalMinutes,
    checkCount: 0,
    lastMessage: null,
    startTime: new Date()
  };

  logger.success(`Démarrage surveillance: ${url} (${intervalMinutes} min)`);
  
  // Message initial avec design amélioré
  const initialMessage = await zk.sendMessage(origineMessage, {
    text: 
      "🌐 *SURVEILLANCE ACTIVÉE* 🌐\n" +
      "┌────────────────────────\n" +
      `│ 🔗 *URL* : ${url}\n` +
      `│ ⏱ *Intervalle* : ${intervalMinutes} min\n` +
      `│ 🕒 *Début* : ${new Date().toLocaleTimeString()}\n` +
      `│ 📊 *Statut* : ` + "```Initialisation...```\n" +
      "└────────────────────────"
  });
  monitoringState.lastMessage = initialMessage.key;

  // Fonction de vérification avec logs détaillés
  const checkWebsite = async () => {
    if (!monitoringState.active) return;
    
    monitoringState.checkCount++;
    const checkNumber = monitoringState.checkCount;
    const startTimestamp = Date.now();
    
    logger.info(`Check #${checkNumber} démarré pour ${monitoringState.url}`);
    
    try {
      const response = await axios.get(monitoringState.url, { 
        timeout: 15000,
        validateStatus: () => true // Accepter tous les codes HTTP
      });
      
      const responseTime = Date.now() - startTimestamp;
      const isSuccess = response.status >= 200 && response.status < 300;
      const statusEmoji = isSuccess ? '✅' : '⚠️';
      
      logger.info(`Check #${checkNumber} terminé - Statut: ${response.status} | Temps: ${responseTime}ms`);
      
      const statusText = 
        `${statusEmoji} *Check #${checkNumber}*\n` +
        "┌────────────────────────\n" +
        `│ 🔗 *URL* : ${monitoringState.url}\n` +
        `│ 🧾 *Code HTTP* : ${response.status}\n` +
        `│ ⏱ *Temps réponse* : ${responseTime}ms\n` +
        `│ 🕒 *Prochain check* : ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}\n` +
        "└────────────────────────";
        
      await zk.sendMessage(origineMessage, {
        text: statusText,
        edit: monitoringState.lastMessage
      });

    } catch (error) {
      const responseTime = Date.now() - startTimestamp;
      logger.error(`Erreur lors du check #${checkNumber}: ${error.code || error.message}`);
      
      const errorText = 
        "❌ *Check #${checkNumber}*\n" +
        "┌────────────────────────\n" +
        `│ 🔗 *URL* : ${monitoringState.url}\n` +
        `│ 🚨 *Erreur* : ${error.code || error.message}\n` +
        `│ ⏱ *Temps écoulé* : ${responseTime}ms\n` +
        `│ 🕒 *Prochain check* : ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}\n` +
        "└────────────────────────";
        
      await zk.sendMessage(origineMessage, {
        text: errorText,
        edit: monitoringState.lastMessage
      });
    }
  };

  // Premier check immédiat
  await checkWebsite();
  
  // Configurer l'intervalle
  monitoringState.interval = setInterval(
    () => checkWebsite(), 
    monitoringState.intervalMinutes * 60 * 1000
  );

  logger.success(`Intervalle configuré pour ${monitoringState.intervalMinutes} minutes`);
});

zokou({
  nomCom: "stopmonitor",
  categorie: "MON-BOT",
  reaction: "🛑",
  description: "Arrête la surveillance en cours"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  
  logger.info(`Commande stopmonitor déclenchée par ${origineMessage.participant || origineMessage.key.remoteJid}`);

  if (!monitoringState.active) {
    logger.warn("Tentative d'arrêt alors qu'aucun monitoring n'est actif");
    return repondre("❌ *Aucune surveillance active !*");
  }

  // Calculer la durée totale
  const duration = Math.round((new Date() - monitoringState.startTime) / 60000);
  
  // Arrêter l'intervalle
  clearInterval(monitoringState.interval);
  logger.success(`Surveillance arrêtée après ${monitoringState.checkCount} checks`);

  // Message final avec design amélioré
  const finalText = 
    "🛑 *SURVEILLANCE ARRÊTÉE* 🛑\n" +
    "┌────────────────────────\n" +
    `│ 🔗 *URL* : ${monitoringState.url}\n` +
    `│ 🕒 *Durée totale* : ${duration} min\n` +
    `│ 📊 *Vérifications* : ${monitoringState.checkCount}\n` +
    `│ ⏱ *Fin* : ${new Date().toLocaleTimeString()}\n` +
    "└────────────────────────";

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
    lastMessage: null,
    startTime: null
  };
});

zokou({
  nomCom: "monitorstatus",
  categorie: "MON-BOT",
  reaction: "📊",
  description: "Affiche le statut de la surveillance en cours"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  
  logger.info(`Commande status déclenchée par ${origineMessage.participant || origineMessage.key.remoteJid}`);

  if (!monitoringState.active) {
    return repondre(
      "🔎 *Aucune surveillance active* \n\n" +
      "Utilisez " + "```-monitor [url]```" + " pour démarrer une surveillance"
    );
  }

  // Calculer le temps écoulé
  const duration = Math.round((new Date() - monitoringState.startTime) / 60000);
  
  const statusText = 
    "📊 *STATUT DE SURVEILLANCE* 📊\n" +
    "┌────────────────────────\n" +
    `│ 🔗 *URL* : ${monitoringState.url}\n` +
    `│ ⏱ *Intervalle* : ${monitoringState.intervalMinutes} min\n` +
    `| 🕒 *Début* : ${monitoringState.startTime.toLocaleTimeString()}\n` +
    `| ⏳ *Durée* : ${duration} min\n` +
    `| 📊 *Vérifications* : ${monitoringState.checkCount}\n` +
    `│ 🔜 *Prochain check* : ${new Date(Date.now() + monitoringState.intervalMinutes * 60000).toLocaleTimeString()}\n` +
    "└────────────────────────";

  repondre(statusText);
});