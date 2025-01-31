const { zokou } = require("../framework/zokou");

zokou({ nomCom: "send", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteurMessage, args, auteurMsgRepondu } = commandeOptions;

  let cible;
  
  // 1️⃣ Si un JID est fourni en argument
  if (args.length > 0) {
    cible = args[0]; // Récupère le JID
  }
  // 2️⃣ Si la commande est exécutée en réponse à un message
  else if (auteurMsgRepondu) {
    cible = auteurMsgRepondu.participant; // Récupère l'auteur du message répondu
  }
  // 3️⃣ Si aucun JID et pas de réponse à un message
  else {
    cible = dest; // Envoie le message dans la discussion actuelle
  }

  // Message envoyé à la cible
  await zk.sendMessage(cible, { text: `*✅ Test réussi.*` }, { quoted: ms });

  // Message de confirmation à l'utilisateur
  if (cible !== dest) {
    repondre("✨ Le message a bien été envoyé.");
  }
});
