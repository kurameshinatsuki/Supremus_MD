const { zokou } = require("../framework/zokou");
const axios = require("axios");

let intervalPing = null;
let latenceTimeout = null;

zokou({ nomCom: "latence", categorie: "MON-BOT", reaction: "⚡" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        repondre("La latence est déjà en cours...");
        return;
    }

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://zokouscan-din3.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `Statut : ${response.status} (${new Date().toLocaleTimeString()})` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, 480000);

    repondre("Latence démarré. Fin de la latence dans 8 minutes.");
});


zokou({ nomCom: "stop", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        repondre("Latence arrêté.");
    } else {
        repondre("Aucune latence en cours.");
    }
});