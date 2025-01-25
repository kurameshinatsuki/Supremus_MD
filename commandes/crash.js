const { zokou } = require("../framework/zokou");

zokou({ nomCom: "confirm", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { repondre, args } = commandeOptions;

  try {
    console.log("Commande confirm appelée avec args:", args);

    // Vérification du numéro de destinataire
    if (!args[0]) {
      return await repondre("Veuillez fournir un numéro de téléphone après la commande. Exemple : /confirm +2250154191194");
    }

    const numero = args[0].replace(/[^0-9]/g, '');
    if (numero.length < 8) {
      return await repondre("Numéro invalide. Veuillez vérifier le format.");
    }

    // Message à envoyer au destinataire
    const messageDestinataire = {
      text: "Ceci est un message automatique de votre bot !"
    };

    // Envoi du message au destinataire
    await zk.sendMessage(numero + "@s.whatsapp.net", messageDestinataire);
    console.log(`Message envoyé à ${numero}`);

    // Message de confirmation pour l'utilisateur
    const messageConfirmation = {
      text: "Le message a bien été envoyé au destinataire !",
      image: { url: "https://i.ibb.co/5GLqTHG/Image-2024-10-23-08-42-33.jpg" } // Lien d'une image en ligne
    };

    await repondre(messageConfirmation);
    console.log("Confirmation envoyée à l'utilisateur.");
  } catch (error) {
    console.error("Erreur dans la commande confirm:", error);
    await repondre("Une erreur est survenue lors de l'envoi du message. Veuillez vérifier le numéro.");
  }
});

zokou({ nomCom: "alert", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { repondre, args } = commandeOptions;

  try {
    console.log("Commande alert appelée avec args:", args);

    // Vérification du numéro de destinataire
    if (!args[0]) {
      return await repondre("Veuillez fournir un numéro de téléphone après la commande. Exemple : /alert +2250154191194");
    }

    const numero = args[0].replace(/[^0-9]/g, '');
    if (numero.length < 8) {
      return await repondre("Numéro invalide. Veuillez vérifier le format.");
    }

    // Message à envoyer au destinataire
    const messageDestinataire = {
      text: "Ceci est une alerte automatique envoyée par votre bot !"
    };

    // Envoi du message au destinataire
    await zk.sendMessage(numero + "@s.whatsapp.net", messageDestinataire);
    console.log(`Message envoyé à ${numero}`);

    // Message de confirmation pour l'utilisateur
    const messageConfirmation = {
      text: "Votre alerte a bien été envoyée au destinataire !",
      image: { url: "https://i.ibb.co/5GLqTHG/Image-2024-10-23-08-42-33.jpg" } // Lien d'une image en ligne
    };

    await repondre(messageConfirmation);
    console.log("Confirmation envoyée à l'utilisateur.");
  } catch (error) {
    console.error("Erreur dans la commande alert:", error);
    await repondre("Une erreur est survenue lors de l'envoi de l'alerte. Veuillez vérifier le numéro.");
  }
});
