const { zokou } = require("../framework/zokou");

module.exports = {
    nomCom: "assistant",
    categorie: "MON-BOT",
    desc: "Activer/désactiver l'assistant IA",
    async execute(client, msg, args) {
        const { repondre, superUser } = msg.commandeOptions;

        if (!superUser) {
            return repondre("❌ Commande réservée aux admins !");
        }

        const action = args[0]?.toLowerCase();
        if (action === "on") {
            global.assistantEnabled = true;
            repondre("✅ Assistant IA activé !");
        } else if (action === "off") {
            global.assistantEnabled = false;
            repondre("❌ Assistant IA désactivé");
        } else {
            repondre("⚠️ Usage: *-assistant on* ou *-assistant off*");
        }
    }
};