const { zokou } = require("../framework/zokou");

// Commande: confirm
zokou({ nomCom: "confirm", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  try {
    const { repondre, args } = commandeOptions || {}; // Vérification de commandeOptions
    console.log("Commande confirm appelée avec args:", args);

    // Vérification si args est défini et contient au moins un élément
    if (!args || !args[0]) {
      return await repondre("Veuillez fournir un numéro de téléphone après la commande. Exemple : /confirm +2250154191194");
    }

    const numero = args[0].replace(/[^0-9]/g, ''); // Nettoyage du numéro
    if (numero.length < 8) {
      return await repondre("Numéro invalide. Veuillez vérifier le format.");
    }

    // Envoi du message au destinataire
    await zk.sendMessage(numero + "@s.whatsapp.net", { text: "Ceci est un message automatique de votre bot !" });

    // Message de confirmation pour l'utilisateur
    await repondre({
      text: "Le message a bien été envoyé au destinataire !",
      image: { url: "https://i.ibb.co/5GLqTHG/Image-2024-10-23-08-42-33.jpg" }
    });
  } catch (error) {
    console.error("Erreur dans la commande confirm:", error);
    await commandeOptions.repondre("Une erreur est survenue lors de l'envoi du message. Veuillez vérifier le numéro.");
  }
});
