const { zokou } = require('../framework/zokou');

zokou({ nomCom: "latence", categorie: "Gestion" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, args } = commandeOptions;

  // Vérifie si un temps est spécifié
  if (!args[0] || isNaN(args[0])) {
    return repondre("⏳ Veuillez entrer un temps en minutes, exemple : -latence 5");
  }

  const tempsMinutes = parseInt(args[0]);
  const tempsMillisecondes = tempsMinutes * 60 * 1000;

  await zk.sendMessage(dest, {
    text: `⏳ Le joueur a ${tempsMinutes} minutes pour écrire son pavé.`,
  }, { quoted: ms });

  // Envoie un rappel à mi-temps
  setTimeout(async () => {
    await zk.sendMessage(dest, {
      text: `⌛ Il reste ${Math.ceil(tempsMinutes / 2)} minutes pour terminer.`,
    }, { quoted: ms });
  }, tempsMillisecondes / 2);

  // Temps écoulé
  setTimeout(async () => {
    await zk.sendMessage(dest, {
      text: `🚨 Temps écoulé ! Le joueur n'a pas rendu son pavé à temps.`,
    }, { quoted: ms });
  }, tempsMillisecondes);
});