const { zokou } = require("../framework/zokou");
const {getAllSudoNumbers,isSudoTableNotEmpty} = require("../bdd/sudo")
const conf = require("../set");

zokou({ nomCom: "mods", categorie: "MON-BOT", reaction: "😇" }, async (dest, zk, commandeOptions) => {
    const { ms , mybotpic } = commandeOptions;

  const thsudo = await isSudoTableNotEmpty()

  if (thsudo) {
     let msg = `*Mes Super-Utilisateurs*\n
     *Numéro du Propriétaire* :
- 🌟 @${conf.NUMERO_OWNER}

------ *Autres super-utilisateurs* -----\n`

 let sudos = await getAllSudoNumbers()

   for ( const sudo of sudos) {
    if (sudo) { // Vérification plus stricte pour éliminer les valeurs vides ou indéfinies
      sudonumero = sudo.replace(/[^0-9]/g, '');
      msg += `- 💼 @${sudonumero}\n`;
    } else {return}

   }   const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
   const mentionedJid = sudos.concat([ownerjid])
   console.log(sudos);
   console.log(mentionedJid)
      zk.sendMessage(
        dest,
        {
          image : { url : mybotpic() },
          caption : msg,
          mentions : mentionedJid
        }
      )
  } else {
    const vcard =
        'BEGIN:VCARD\n' + // métadonnées de la carte de contact
        'VERSION:3.0\n' +
        'FN:' + conf.OWNER_NAME + '\n' + // nom complet
        'ORG:undefined;\n' + // organisation du contact
        'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' + // ID WhatsApp + numéro de téléphone
        'END:VCARD';
    zk.sendMessage(dest, {
        contacts: {
            displayName: conf.OWNER_NAME,
            contacts: [{ vcard }],
        },
    },{quoted:ms});
  }
});

zokou({ nomCom: "dev", categorie: "MON-BOT", reaction: "👥" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
      { nom: "Supremus Prod", numero: "22554191184" },
      { nom: "M๏nkeℽ D Lบffy", numero: "22891733300" },
      // Ajoute d'autres développeurs ici avec leur nom et numéro
    ];

    let message = "Salut, je suis *SP-ZK-MD* tu peux m'appeler *mini-kurama* ! Je te présente mes développeurs :\n\n";
    for (const dev of devs) {
      message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
    }
  var lien = mybotpic()
    if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:message }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Erreur de menu " + e);
        repondre("🥵🥵 Erreur de menu " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:message }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Erreur de menu " + e);
        repondre("🥵🥵 Erreur de menu " + e);
    }
} 
else {
    repondre(lien)
    repondre("Erreur de lien");

}
});

zokou({ nomCom: "support", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteurMessage, } = commandeOptions; 

  repondre("Veuillez regarder dans vos messages privés (MP/IB).")
  await zk.sendMessage(auteurMessage,{text : `https://whatsapp.com/channel/0029Vaiyt653WHTR2jHEHe2e`},{quoted :ms})

});