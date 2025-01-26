const { zokou } = require("../framework/zokou");

zokou({ nomCom: "confirm", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { repondre, args } = commandeOptions;

  try {
    console.log("Commande confirm appelée avec args:", args);

    // Vérifiez si un message (contenu) est fourni
    if (!args || args.length === 0) {
      return await repondre("Veuillez fournir un numéro de téléphone après la commande. Exemple : /confirm +22554191184");
    }

    // Récupérer tout le contenu après la commande (numéro ou URL)
    const numeroOuLien = args.join(" ").trim();

    console.log("Numéro ou lien fourni:", numeroOuLien);

    // Construire l'URL WhatsApp si ce n'est pas un lien direct
    const lienWhatsApp = numeroOuLien.startsWith("https://wa.me/")
      ? numeroOuLien
      : `https://wa.me/${numeroOuLien.replace(/[^0-9+]/g, "")}`;

    // Envoi d'un message de confirmation au destinataire via le lien
    await zk.sendMessage(lienWhatsApp, { text: "Ceci est un message automatique de votre bot !" });

    // Confirmation à l'utilisateur que le message a été envoyé
    await repondre({
      text: "Le message a bien été envoyé au destinataire !",
      image: { url: "https://i.ibb.co/5GLqTHG/Image-2024-10-23-08-42-33.jpg" }
    });

    console.log(`Message envoyé via le lien : ${lienWhatsApp}`);
  } catch (error) {
    console.error("Erreur dans la commande confirm:", error);
    await repondre("Une erreur est survenue lors de l'envoi du message. Vérifiez le format du numéro ou du lien.");
  }
});
