const { zokou } = require('../framework/zokou');

// Fonction de délai
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

zokou({ nomCom: "latence", categorie: "Gestion" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, args } = commandeOptions;

  // Vérifie si l'argument est bien un nombre
  if (!args[0] || isNaN(args[0])) {
    return repondre("⏳ Veuillez entrer un temps en minutes. Exemple : -latence 5");
  }

  const minutes = parseFloat(args[0]);
  const totalMs = minutes * 60 * 1000;
  const demiMs = totalMs / 2;

  // Message initial
  await zk.sendMessage(dest, {
    text: `⏳ Le joueur a ${minutes} minute(s) pour écrire son pavé.`,
  }, { quoted: ms });

  // Attendre la moitié du temps
  await delay(demiMs);

  await zk.sendMessage(dest, {
    text: `⌛ Il reste environ ${Math.ceil(minutes / 2)} minute(s).`,
  }, { quoted: ms });

  // Attendre l’autre moitié
  await delay(demiMs);

  await zk.sendMessage(dest, {
    text: `🚨 Temps écoulé ! Le joueur n'a pas rendu son pavé à temps.`,
  }, { quoted: ms });
});