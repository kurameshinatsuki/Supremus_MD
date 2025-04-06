const { zokou } = require('../framework/zokou');

// Commande : -latence 0.5
// Pour test rapide
zokou({ nomCom: "latence", categorie: "Gestion" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, args } = commandeOptions;

  if (!args[0] || isNaN(args[0])) {
    return repondre("⏳ Veuillez entrer un temps en minutes, exemple : -latence 5");
  }

  const minutes = parseFloat(args[0]);
  const msTotal = minutes * 60 * 1000;

  await zk.sendMessage(dest, {
    text: `⏳ Tu as ${minutes} minute(s) pour écrire ton pavé.`,
  }, { quoted: ms });

  setTimeout(() => {
    zk.sendMessage(dest, {
      text: `⌛ Il reste ${Math.ceil(minutes / 2)} minute(s) !`,
    }, { quoted: ms });
  }, msTotal / 2);

  setTimeout(() => {
    zk.sendMessage(dest, {
      text: `🚨 Temps écoulé !`,
    }, { quoted: ms });
  }, msTotal);
});