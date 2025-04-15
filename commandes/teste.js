const { zokou } = require("../framework/zokou");
const axios = require("axios");

let intervalPing = null;
let latenceTimeout = null;

zokou({ nomCom: "pingweb", categorie: "MON-BOT", reaction: "⚡" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        repondre("Le ping est déjà en cours...");
        return;
    }

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://supremus-md-yn5h.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `Statut : ${response.status} (${new Date().toLocaleTimeString()})` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, 10000);

    repondre("Ping démarré. Vérification toutes les 10 secondes.");
});


zokou({ nomCom: "stopping", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        repondre("Ping arrêté.");
    } else {
        repondre("Aucun ping en cours.");
    }
});