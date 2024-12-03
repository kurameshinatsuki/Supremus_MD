const { zokou } = require("../framework/zokou");

zokou({ nomCom: "crash", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { repondre, args } = commandeOptions; // On extrait les arguments
  
  // Vérifie si un nombre de répétitions est fourni
  const repetitions = args[0] && !isNaN(args[0]) ? Math.min(parseInt(args[0]), 10000) : 5000;
  
  // Texte spécifique à répéter pour provoquer une surcharge
  const texteCrash = "\u200B".repeat(repetitions) + "💥"; // Utilisation de caractères invisibles

  try {
    // Envoi du message avec le texte de crash
    await repondre(texteCrash);
  } catch (error) {
    console.error(error);
    repondre("Une erreur est survenue lors de la génération du message.");
  }
});

zokou({ nomCom: "send", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, args } = commandeOptions; // On extrait les arguments
  
  // Vérifie si un numéro est fourni
  if (!args[0]) {
    return repondre("Veuillez fournir un numéro de téléphone après la commande. Exemple : /send +2250154191194");
  }
  
  const numero = args[0].replace(/[^0-9]/g, ''); // Nettoyage du numéro pour garder uniquement les chiffres
  
  // Vérification de la longueur du numéro
  if (numero.length < 8) {
    return repondre("Numéro invalide. Veuillez vérifier le format.");
  }
  
  const messageSpecifique = "Ceci est un message automatique de votre bot !"; // Message à envoyer
  
  try {
    // Envoi du message au numéro indiqué
    await zk.sendMessage(numero + "@s.whatsapp.net", { text: messageSpecifique });
    repondre(`Message envoyé avec succès au numéro : ${args[0]}`);
  } catch (error) {
    console.error(error);
    repondre("Une erreur est survenue lors de l'envoi du message. Veuillez vérifier le numéro.");
  }
});
