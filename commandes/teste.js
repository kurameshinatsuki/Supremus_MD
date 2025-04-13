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
            const response = await axios.get("https://supremus-md.onrender.com");
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


zokou({ nomCom: "latence", categorie: "MON-BOT", reaction: "⏳" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre, args } = commandeOptions;

    if (latenceTimeout) {
        repondre("Un timer est déjà en cours. Utilise la commande `stoplatence` pour l'annuler.");
        return;
    }

    // Durée par défaut : 3 minutes (180 secondes)
    let duree = parseInt(args[0]) || 180;

    if (isNaN(duree) || duree <= 0) {
        repondre("Durée invalide. Ex : `latence 120` pour 2 minutes.");
        return;
    }

    repondre(`Temps de rédaction lancé pour ${duree} secondes.`);

    latenceTimeout = setTimeout(async () => {
        latenceTimeout = null;
        await zk.sendMessage(origineMessage, {
            text: `⏰ Temps écoulé ! Le joueur n'a pas répondu à temps.`,
        });
    }, duree * 1000);
});

zokou({ nomCom: "stop", categorie: "MON-BOT", reaction: "⌛" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (latenceTimeout) {
        clearTimeout(latenceTimeout);
        latenceTimeout = null;
        repondre("Le timer de latence a été annulé.");
    } else {
        repondre("Aucun timer de latence en cours.");
    }
});