const { zokou } = require('../framework/zokou');
const axios = require("axios")
let { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { isUserBanned, addUserToBanList, removeUserFromBanList } = require("../bdd/banUser");
const { addGroupToBanList, isGroupBanned, removeGroupFromBanList } = require("../bdd/banGroup");
const { isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList } = require("../bdd/onlyAdmin");
const { removeSudoNumber, addSudoNumber, issudo } = require("../bdd/sudo");
//const conf = require("../set");
//const fs = require('fs');
const sleep = (ms) => {
  return new Promise((resolve) => { setTimeout(resolve, ms) })

};


zokou({ nomCom: "tgs", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;

  if (!superUser) {
    repondre('Seuls les modérateurs peuvent utiliser cette commande'); return;
  }
  //const apikey = conf.APILOLHUMAIN

  // if (apikey === null || apikey === 'null') { repondre('Veuillez vérifier votre apikey ou si vous n\'en avez pas, veuillez créer un compte sur api.lolhuman.xyz et vous en procurer une.'); return; };

  if (!arg[0]) {
    repondre("Veuillez mettre un lien de stickers Telegram");
    return;
  }

  let lien = arg.join(' ');

  let name = lien.split('/addstickers/')[1];

  let api = 'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=' + encodeURIComponent(name);

  try {

    let stickers = await axios.get(api);

    let type = null;

    if (stickers.data.result.is_animated === true || stickers.data.result.is_video === true) {

      type = 'autocollant animé'
    } else {
      type = 'autocollant non animé'
    }

    let msg = `   Zk-stickers-dl
      
  *Nom :* ${stickers.data.result.name}
  *Type :* ${type} 
  *Longueur :* ${(stickers.data.result.stickers).length}
  
      Téléchargement en cours...`

    await repondre(msg);

    for (let i = 0; i < (stickers.data.result.stickers).length; i++) {

      let file = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${stickers.data.result.stickers[i].file_id}`);

      let buffer = await axios({
        method: 'get',  // Utilisez 'get' pour télécharger le fichier
        url: `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file.data.result.file_path}`,
        responseType: 'arraybuffer',  // Définissez le type de réponse sur 'stream' pour gérer un flux de données
      })


      const sticker = new Sticker(buffer.data, {
        pack: nomAuteurMessage,
        author: "Zokou-md",
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        id: '12345',
        quality: 50,
        background: '#000000'
      });

      const stickerBuffer = await sticker.toBuffer(); // Convertit l'autocollant en tampon (Buffer)

      await zk.sendMessage(
        dest,
        {
          sticker: stickerBuffer, // Utilisez le tampon (Buffer) directement dans l'objet de message
        },
        { quoted: ms }
      );
    }

  } catch (e) {
    repondre("Nous avons rencontré une erreur \n", e);
  }
});

zokou({ nomCom: "crew", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, superUser, auteurMsgRepondu, msgRepondu } = commandeOptions;

  if (!superUser) { repondre("Seuls les modérateurs peuvent utiliser cette commande"); return };

  if (!arg[0]) { repondre('Veuillez entrer le nom du groupe à créer'); return };
  if (!msgRepondu) { repondre('Veuillez mentionner un membre à ajouter'); return; }

  const name = arg.join(" ")

  const group = await zk.groupCreate(name, [auteurMessage, auteurMsgRepondu])
  console.log("Groupe créé avec l'id: " + group.gid)
  zk.sendMessage(group.id, { text: `Bienvenue dans ${name}` })

});

zokou({ nomCom: "left", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage } = commandeOptions;
  if (!verifGroupe) { repondre("Uniquement pour les groupes"); return };
  if (!superUser) {
    repondre("Commande réservée au propriétaire");
    return;
  }

  await zk.groupLeave(dest)
});

zokou({ nomCom: "join", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage } = commandeOptions;

  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }
  let result = arg[0].split('https://chat.whatsapp.com/')[1];
  await zk.groupAcceptInvite(result);

  repondre(`Succès`).catch((e) => {
    repondre('Erreur inconnue')
  })

})


zokou(
  {
    nomCom: "jid",
    categorie: "MON-BOT"
  },
  async (dest, zk, commandeOptions) => {
    const {
      arg,
      ms,
      repondre,
      msgRepondu,
      auteurMessage,
      auteurMsgRepondu,
      superUser
    } = commandeOptions;

    if (!superUser) {
      return repondre("🚫 Commande réservée au propriétaire du bot.");
    }

    const cible = msgRepondu ? auteurMsgRepondu : auteurMessage || ms.key.participant || ms.key.remoteJid;

    const decodeJid = (jid) => jid.replace(/:\d+@/, "@");

    const jid = decodeJid(cible);
    const lid = cible;

    await zk.sendMessage(dest, {
      text:
        `👤 *INFORMATIONS :*\n\n` +
        `*LID* : ${lid}\n` +
        `*JID* :\n${jid}`
    }, { quoted: ms });
  }
);


zokou(
  {
    nomCom: "profil",
    categorie: "MON-BOT",
    reaction: "👤"
  },
  async (dest, zk, commandeOptions) => {
    const {
      arg,
      ms,
      repondre,
      msgRepondu,
      auteurMessage,
      auteurMsgRepondu,
      superUser
    } = commandeOptions;

    const cible = arg[0] || (msgRepondu ? auteurMsgRepondu : auteurMessage || ms.key.participant);

    const decodeJid = (jid) => jid.replace(/:\d+@/, "@");
    const jid = decodeJid(cible);
    const lid = cible;
    const numero = jid.replace(/@s\.whatsapp\.net/, "");

    try {
      // Récupère les infos de profil
      const [pp, info] = await Promise.all([
        zk.profilePictureUrl(jid, 'image').catch(() => null),
        zk.onWhatsApp(jid)
      ]);

      const nom = info?.[0]?.notify || "Non disponible";

      // Récupère la description (bio)
      let description = "Non disponible";
      try {
        const status = await zk.fetchStatus(jid);
        description = status?.status || "Aucune bio";
      } catch (e) {
        // Bio indisponible ou masquée
      }

      const messageTexte =
        `👤 *PROFIL UTILISATEUR :*\n\n` +
        `• *Nom :* ${nom}\n` +
        `• *Numéro :* +${numero}\n` +
        `• *LID :* ${lid}\n` +
        `• *JID :* ${jid}\n` +
        `• *Bio :* ${description}`;

      if (pp) {
        await zk.sendMessage(dest, {
          image: { url: pp },
          caption: messageTexte
        }, { quoted: ms });
      } else {
        await repondre(messageTexte);
      }

    } catch (e) {
      console.error("Erreur profil:", e);
      repondre("❌ Impossible d'obtenir les infos du profil.");
    }
  }
);

zokou({ nomCom: "block", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage, auteurMsgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }

  if (!msgRepondu) {
    if (verifGroupe) {
      repondre('Assurez-vous de mentionner la personne à bloquer'); return
    };
    jid = dest

    await zk.updateBlockStatus(jid, "block")
      .then(repondre('Succès'))
  } else {
    jid = auteurMsgRepondu
    await zk.updateBlockStatus(jid, "block")
      .then(repondre('Succès'))
  };

});

zokou({ nomCom: "unblock", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage, auteurMsgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }
  if (!msgRepondu) {
    if (verifGroupe) {
      repondre('Veuillez mentionner la personne à débloquer'); return
    };
    jid = dest

    await zk.updateBlockStatus(jid, "unblock")
      .then(repondre('Succès'))
  } else {
    jid = auteurMsgRepondu
    await zk.updateBlockStatus(jid, "unblock")
      .then(repondre('Succès'))
  };

});

zokou({ nomCom: "kickall", categorie: 'MON-BOT', reaction: "😵‍💫" }, async (dest, zk, commandeOptions) => {

  const { auteurMessage, ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser, prefixe } = commandeOptions

  const metadata = await zk.groupMetadata(dest);


  if (!verifGroupe) { repondre("✋🏿 ✋🏿 Cette commande est réservée aux groupes ❌"); return; }
  if (superUser || auteurMessage == metadata.owner) {

    repondre('Les membres non-administrateurs seront retirés du groupe. Vous avez 5 secondes pour revenir sur votre choix en redémarrant le bot.');
    await sleep(5000)
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
    try {
      let users = membresGroupe.filter((member) => !member.admin)

      for (const membre of users) {

        await zk.groupParticipantsUpdate(
          dest,
          [membre.id],
          "remove"
        )
        await sleep(500)

      }
    } catch (e) { repondre("J'ai besoin des droits d'administration") }
  } else {
    repondre("Commande réservée au propriétaire du groupe pour des raisons de sécurité"); return
  }
});

zokou({
  nomCom: 'ban',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser } = commandeOptions;


  if (!superUser) { repondre('Cette commande est uniquement autorisée au propriétaire du bot'); return }
  if (!arg[0]) {
    // Function 'reply' must be defined to send a response.
    repondre(`Mentionnez la victime en tapant ${prefixe}ban add/del pour bannir/débannir la victime`);
    return;
  };

  if (msgRepondu) {
    switch (arg.join(' ')) {
      case 'add':


        let youareban = await isUserBanned(auteurMsgRepondu)
        if (youareban) { repondre('Cet utilisateur est déjà banni'); return }

        addUserToBanList(auteurMsgRepondu)
        repondre('Utilisateur banni avec succès');
        break;
      case 'del':
        let estbanni = await isUserBanned(auteurMsgRepondu)
        if (estbanni) {

          removeUserFromBanList(auteurMsgRepondu);
          repondre('Cet utilisateur est maintenant libre.');
        } else {
          repondre('Cet utilisateur n\'est pas banni.');
        }
        break;


      default:
        repondre('Mauvaise option');
        break;
    }
  } else {
    repondre('Mentionnez la victime')
    return;
  }
});



zokou({
  nomCom: 'bangroup',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser, verifGroupe } = commandeOptions;


  if (!superUser) { repondre('Cette commande est uniquement autorisée au propriétaire du bot'); return };
  if (!verifGroupe) { repondre('Commande réservée aux groupes'); return };
  if (!arg[0]) {
    // Function 'reply' must be defined to send a response.
    repondre(`Tapez ${prefixe}bangroup add/del pour bannir/débannir le groupe`);
    return;
  };
  const groupalreadyBan = await isGroupBanned(dest)

  switch (arg.join(' ')) {
    case 'add':



      if (groupalreadyBan) { repondre('Ce groupe est déjà banni'); return }

      addGroupToBanList(dest)
      repondre('Groupe banni avec succès');

      break;
    case 'del':

      if (groupalreadyBan) {
        removeGroupFromBanList(dest)
        repondre('Ce groupe est maintenant libre.');

      } else {

        repondre('Ce groupe n\'est pas banni.');
      }
      break;


    default:
      repondre('Mauvaise option');
      break;
  }

});


zokou({
  nomCom: 'onlyadmin',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser, verifGroupe, verifAdmin } = commandeOptions;


  if (superUser || verifAdmin) {
    if (!verifGroupe) { repondre('Commande réservée aux groupes'); return };
    if (!arg[0]) {
      // Function 'reply' must be defined to send a response.
      repondre(`Tapez ${prefixe}onlyadmin add/del pour activer/désactiver le mode admin uniquement`);
      return;
    };
    const groupalreadyBan = await isGroupOnlyAdmin(dest)

    switch (arg.join(' ')) {
      case 'add':



        if (groupalreadyBan) { repondre('Ce groupe est déjà en mode admin uniquement'); return }

        addGroupToOnlyAdminList(dest)
        repondre('Mode admin uniquement activé');

        break;
      case 'del':

        if (groupalreadyBan) {
          removeGroupFromOnlyAdminList(dest)
          repondre('Le groupe est maintenant libre.');

        } else {

          repondre('Ce groupe n\'est pas en mode admin uniquement.');
        }
        break;


      default:
        repondre('Mauvaise option');
        break;
    }
  } else { repondre('Vous n\'êtes pas autorisé à utiliser cette commande') }
});

zokou({
  nomCom: 'sudo',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser } = commandeOptions;


  if (!superUser) { repondre('Cette commande est uniquement autorisée au propriétaire du bot'); return }
  if (!arg[0]) {
    // Function 'reply' must be defined to send a response.
    repondre(`Mentionnez la personne en tapant ${prefixe}sudo add/del`);
    return;
  };

  if (msgRepondu) {
    switch (arg.join(' ')) {
      case 'add':


        let youaresudo = await issudo(auteurMsgRepondu)
        if (youaresudo) { repondre('Cet utilisateur est déjà sudo'); return }

        addSudoNumber(auteurMsgRepondu)
        repondre('Succès - Utilisateur ajouté comme sudo')
        break;
      case 'del':
        let estsudo = await issudo(auteurMsgRepondu)
        if (estsudo) {

          removeSudoNumber(auteurMsgRepondu);
          repondre('Cet utilisateur n\'est plus sudo.');
        } else {
          repondre('Cet utilisateur n\'est pas sudo.');
        }
        break;


      default:
        repondre('Mauvaise option');
        break;
    }
  } else {
    repondre('Mentionnez l\'utilisateur')
    return;
  }
});


zokou({ nomCom: "save", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, superUser, auteurMessage } = commandeOptions;

  if (superUser) {

    if (msgRepondu) {

      console.log(msgRepondu);

      let msg;

      if (msgRepondu.imageMessage) {



        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        // console.log(msgRepondu) ;
        msg = {

          image: { url: media },
          caption: msgRepondu.imageMessage.caption,

        }


      } else if (msgRepondu.videoMessage) {

        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);

        msg = {

          video: { url: media },
          caption: msgRepondu.videoMessage.caption,

        }

      } else if (msgRepondu.audioMessage) {

        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);

        msg = {

          audio: { url: media },
          mimetype: 'audio/mp4',
        }

      } else if (msgRepondu.stickerMessage) {


        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage)

        let stickerMess = new Sticker(media, {
          pack: 'Zokou-tag',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer2 = await stickerMess.toBuffer();

        msg = { sticker: stickerBuffer2 }


      } else {
        msg = {
          text: msgRepondu.conversation,
        }
      }

      zk.sendMessage(auteurMessage, msg)

    } else { repondre('Mentionnez le message que vous souhaitez sauvegarder') }

  } else {
    repondre('Seuls les modérateurs peuvent utiliser cette commande')
  }


})
  ;


zokou({
  nomCom: 'mention',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, repondre, superUser, arg } = commandeOptions;

  if (!superUser) { repondre('Vous n\'avez pas les droits pour cette commande'); return }

  const mbdd = require('../bdd/mention');

  let alldata = await mbdd.recupererToutesLesValeurs();
  data = alldata[0];


  if (!arg || arg.length < 1) {

    let etat;

    if (alldata.length === 0) {
      repondre(`Pour activer ou modifier la mention ; suivez cette syntaxe : mention lien type message
  Les différents types sont audio, video, image et sticker.
  Exemple : mention https://static.animecorner.me/2023/08/op2.jpg image Salut, je m'appelle Luffy`); return
    }

    if (data.status == 'non') {
      etat = 'Désactivé'
    } else {
      etat = 'Activé';
    }

    mtype = data.type || 'aucune donnée';

    url = data.url || 'aucune donnée';


    let msg = `Statut : ${etat}
Type : ${mtype}
Lien : ${url}

*Instructions :*

Pour activer ou modifier la mention, suivez cette syntaxe : mention lien type message
Les différents types sont audio, video, image et sticker.
Exemple : mention https://static.animecorner.me/2023/08/op2.jpg image Salut, je m'appelle Luffy

Pour arrêter la mention, utilisez mention stop`;

    repondre(msg);

    return;
  }

  if (arg.length >= 2) {

    if (arg[0].startsWith('http') && (arg[1] == 'image' || arg[1] == 'audio' || arg[1] == 'video' || arg[1] == 'sticker')) {

      let args = [];
      for (i = 2; i < arg.length; i++) {
        args.push(arg[i]);
      }
      let message = args.join(' ') || '';

      await mbdd.addOrUpdateDataInMention(arg[0], arg[1], message);
      await mbdd.modifierStatusId1('oui')
        .then(() => {
          repondre('Mention mise à jour');
        })
    } else {
      repondre(`*Instructions :*
          Pour activer ou modifier la mention, suivez cette syntaxe : mention lien type message. Les différents types sont audio, video, image et sticker.`)
    }

  } else if (arg.length === 1 && arg[0] == 'stop') {

    await mbdd.modifierStatusId1('non')
      .then(() => {
        repondre('Mention arrêtée');
      })
  }
  else {
    repondre(`Veuillez vous assurer de suivre les instructions`);
  }
});

zokou({
  nomCom: 'vide',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, repondre, superUser, arg } = commandeOptions;

  if (!superUser) { repondre('Cette commande est uniquement autorisée aux modérateurs'); return }

  let msg = await zk.getLastMessageInChat(dest);

  //console.log(msg) ;

  await zk.chatModify({
    delete: true,
    lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }]
  },
    dest);

  repondre("Conversation vidée");

});


zokou({
  nomCom: 'archive',
  categorie: 'MON-BOT',
}, async (dest, zk, commandeOptions) => {

  const { ms, repondre, superUser, arg } = commandeOptions;

  if (!superUser) { repondre('Cette commande est uniquement autorisée aux modérateurs'); return }

  let msg = await zk.getLastMessageInChat(dest);

  //console.log(msg) ;

  await zk.chatModify({
    archive: true,
    lastMessages: [msg]
  },
    dest);

  repondre("La discussion a été archivée");

});