const { zokou } = require('../framework/zokou');

async function countdown(zk, origineMessage, minutes) { const delay = minutes * 60 * 1000; // Convertir minutes en millisecondes const startMessage = ⏳ Décompte lancé pour ${minutes} minute(s)...;

try {
    await zk.sendMessage(origineMessage, { text: startMessage });
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    await zk.sendMessage(origineMessage, { text: `🚨 Temps écoulé ! ${minutes} minute(s) sont passées.` });
} catch (error) {
    console.error("Erreur dans le compte à rebours :", error);
    await zk.sendMessage(origineMessage, { text: "❌ Une erreur est survenue dans le décompte." });
}

}

zokou( { nomCom: 'latence', categorie: 'DRPN' }, async (dest, zk, commandeOptions) => { const { args, repondre } = commandeOptions;

if (!args[0] || isNaN(args[0])) {
        return await repondre("❌ Veuillez spécifier un délai en minutes. Exemple : -latence 5");
    }
    
    const minutes = parseInt(args[0]);
    if (minutes <= 0) {
        return await repondre("❌ Le délai doit être supérieur à 0 minute.");
    }
    
    await countdown(zk, dest, minutes);
}

);

