/*const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

const DISCUSSION_AUTORISEE = "120363334477094721@g.us";

zokou({ nomCom: "setplayer", reaction: "👤", categorie: "ECONOMY", }, async (dest, zk, commandOptions) => { if (dest !== DISCUSSION_AUTORISEE) return commandOptions.repondre("Cette commande ne peut être utilisée que dans une discussion spécifique.");

const { repondre, arg, superUser, msgRepondu, auteurMsgRepondu } = commandOptions;
if (!superUser) return repondre("Vous n'êtes pas autorisé à exécuter cette commande !");

try {
    // Logique existante de la commande
} catch (error) {
    return repondre(error.message);
}

});

zokou({ nomCom: "viewplayer", reaction: "👨🏻‍💻", categorie: "ECONOMY", }, async (dest, zk, commandOptions) => { if (dest !== DISCUSSION_AUTORISEE) return commandOptions.repondre("Cette commande ne peut être utilisée que dans une discussion spécifique.");

const { repondre, arg, msgRepondu, auteurMsgRepondu, auteurMessage } = commandOptions;
let userId = msgRepondu ? auteurMsgRepondu : arg?.[0]?.startsWith("@") ? arg[0].replace("@", "") + "@s.whatsapp.net" : auteurMessage;

try {
    // Logique existante de la commande
} catch (error) {
    return repondre(error.message);
}

});

zokou({ nomCom: "upplayer", reaction: "🔄", categorie: "ECONOMY", }, async (dest, zk, commandOptions) => { if (dest !== DISCUSSION_AUTORISEE) return commandOptions.repondre("Cette commande ne peut être utilisée que dans une discussion spécifique.");

const { repondre, arg, superUser, msgRepondu, auteurMsgRepondu } = commandOptions;
if (!superUser) return repondre("Vous n'êtes pas autorisé à exécuter cette commande !");

try {
    // Logique existante de la commande
} catch (error) {
    return repondre(error.message);
}

});*/

