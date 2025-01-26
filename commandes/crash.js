const { zokou } = require("../framework/zokou");

// Commande: confirm
zokou({ nomCom: "confirm", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  try {
    const { repondre, args } = commandeOptions || {};
    console.log("Commande confirm appelée avec args:", args);

    // Vérification si args est défini et contient un message
    if (!args || args.length === 0) {
      return await repondre("Veuillez fournir un message après la commande. Exemple : /confirm +2250154191194");
    }

    // Récupérer tout le contenu après la commande
    const numero = args.join(" ").trim();
    console.log("Numéro ou contenu fourni:", numero);

    // Envoi du message au destinataire
    await zk.sendMessage(numero + "@s.whatsapp.net", { text: "Ceci est un message automatique de votre bot !" });

    // Message de confirmation pour l'utilisateur
    await repondre({
      text: "Le message a bien été envoyé au destinataire !" }
    });

    console.log(`Message envoyé à ${numero}`);
  } catch (error) {
    console.error("Erreur dans la commande confirm:", error);
    await commandeOptions.repondre("Une erreur est survenue lors de l'envoi du message. Vérifiez le format des arguments.");
  }
});
