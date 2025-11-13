const { zokou } = require("../framework/zokou")
//const { getGroupe } = require("../bdd/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../bdd/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
const {generatepp} = require('../framework/mesfonctions')
//const { uploadImageToImgur } = require('../framework/imgur');


zokou({ nomCom: "call", categorie: 'GROUP', reaction: "☎️" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

    // Vérification si la commande est utilisée dans un groupe
    if (!verifGroupe) { 
        repondre("✋🏿 Cette commande est réservée aux groupes ❌");
        return;
    }

    // Vérification du message personnalisé
    const mess = (!arg || arg === ' ') ? 'Aucun message' : arg.join(' ');

    // Récupération des membres du groupe
    let membresGroupe = verifGroupe ? await infosGroupe.participants : [];
    let tag = `
╭─────────────◈
┃ 🪀 *SP-ZK-MD* 🪀
╰─────────────◈
┃ 👥 *Groupe* : ${nomGroupe}
┃ 👤 *Auteur* : ${nomAuteurMessage}
┃ 📜 *Message* : ${mess}
╭─────────────◈
`;

    // Liste d'emojis pour rendre les tags aléatoires
    const emojis = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];

    // Générer les tags pour chaque membre
    for (const membre of membresGroupe) {
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        tag += `┃ ${randomEmoji} @${membre.id.split("@")[0]}\n`;
    }

    tag += `╰─────────────◈`;

    // Vérification des privilèges d'administration
    if (verifAdmin || superUser) {
        zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
    } else {
        repondre("🔒 Commande réservée aux admins");
    }
});


zokou({ nomCom: "lien", categorie: 'GROUP', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  if (!verifGroupe) { repondre("✨ attends mec, tu veux le lien vers mon dm ?"); return; };


  var link = await zk.groupInviteCode(dest)
  var lien = `https://chat.whatsapp.com/${link}`;

  let mess = `✨ Salut ${nomAuteurMessage} , voici le lien du groupe ${nomGroupe} \n

Lien :${lien}`
  repondre(mess)


});

/** *nommer un membre comme admin */
zokou({ nomCom: "nom", categorie: 'GROUP', reaction: "🔺" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Uniquement pour les groupes"); }


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              var txt = `🎊🎊🎊  @${auteurMsgRepondu.split("@")[0]} est monté en grade.\n
                      il/elle est désormais nommé administrateur de ce groupe.`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            } else { return repondre("Ce membre est déjà administrateur du groupe.") }

          } else { return repondre("Cet utilisateur ne fait pas partie du groupe."); }
        }
        else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.") }

      } else { repondre("Veuillez taguer le membre à nommer"); }
    } else { return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.") }
  } catch (e) { repondre("oups " + e) }

})

//fin nommer
/** ***demettre */

zokou({ nomCom: "denom", categorie: 'GROUP', reaction: "🔻" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Uniquement pour les groupes"); }


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {

              repondre("Ce membre n'est pas administrateur du groupe.")

            } else {
              var txt = `@${auteurMsgRepondu.split("@")[0]} à été révoquer des droits administrateur de ce groupe\n`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            }

          } else { return repondre("Cet utilisateur ne fait pas partie du groupe."); }
        }
        else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.") }

      } else { repondre("Veuillez taguer le membre à démettre"); }
    } else { return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.") }
  } catch (e) { repondre("oups " + e) }

})



/** ***fin démettre****  **/
/** **retirer** */
zokou({ nomCom: "vire", categorie: 'GROUP', reaction: "👋" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Uniquement pour les groupes"); }


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif"
              var sticker = new Sticker(gifLink, {
                pack: 'Supremus-Md', // The pack name
                author: nomAuteurMessage, // The author name
                type: StickerTypes.FULL, // The sticker type
                categories: ['🤩', '🎉'], // The sticker category
                id: '12345', // The sticker id
                quality: 50, // The quality of the output file
                background: '#000000'
              });

              await sticker.toFile("st.webp")
              var txt = `@${auteurMsgRepondu.split("@")[0]} a été retiré du groupe.\n`
            /*  zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: ms.message.extendedTextMessage.contextInfo.stanzaId})*/
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })

            } else { repondre("Ce membre ne peut pas être retiré car il est administrateur du groupe.") }

          } else { return repondre("Cet utilisateur ne fait pas partie du groupe."); }
        }
        else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.") }

      } else { repondre("Veuillez taguer le membre à retirer"); }
    } else { return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.") }
  } catch (e) { repondre("oups " + e) }

})


/** *****fin retirer */


zokou({ nomCom: "supp", categorie: 'GROUP',reaction:"🧹" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, verifGroupe,auteurMsgRepondu,idBot, msgRepondu, verifAdmin, superUser} = commandeOptions;

  if (!msgRepondu) {
    repondre("Veuillez mentionner le message à supprimer.");
    return;
  }
  if(superUser && auteurMsgRepondu==idBot )
  {

       if(auteurMsgRepondu==idBot)
       {
         const key={
            remoteJid:dest,
      fromMe: true,
      id: ms.message.extendedTextMessage.contextInfo.stanzaId,
         }
         await zk.sendMessage(dest,{delete:key});return;
       } 
  }

          if(verifGroupe)
          {
               if(verifAdmin || superUser)
               {

                         try{


            const key=   {
               remoteJid : dest,
               id : ms.message.extendedTextMessage.contextInfo.stanzaId ,
               fromMe : false,
               participant : ms.message.extendedTextMessage.contextInfo.participant

            }        

         await zk.sendMessage(dest,{delete:key});return;

             }catch(e){repondre( "J'ai besoin des droits administrateur.")}


               }else{repondre("Désolé, vous n'êtes pas administrateur du groupe.")}
          }

});

zokou({ nomCom: "info", categorie: 'GROUP' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe } = commandeOptions;
  if (!verifGroupe) { repondre("Commande réservée uniquement aux groupes"); return };

 try { ppgroup = await zk.profilePictureUrl(dest ,'image') ; } catch { ppgroup = conf.IMAGE_MENU}

    const info = await zk.groupMetadata(dest)

    /*console.log(metadata.id + ", title: " + metadata.subject + ", description: " + metadata.desc)*/


    let mess = {
      image: { url: ppgroup },
      caption:  `*━━━━『Info du groupe』━━━━*\n\n*🎐Nom:* ${info.subject}\n\n*🔩ID du groupe:* ${dest}\n\n*🔍Description:* \n\n${info.desc}`
    }


    zk.sendMessage(dest, mess, { quoted: ms })
  });


 //------------------------------------antilien-------------------------------

 zokou({ nomCom: "anti_lien", categorie: 'GROUP', reaction: "⛓️‍💥" }, async (dest, zk, commandeOptions) => {


  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;



  if (!verifGroupe) {
    return repondre("*Uniquement pour les groupes*");
  }

  if( superUser || verifAdmin) {
    const enetatoui = await verifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { repondre("antilink on pour activer la fonction anti-lien\nantilink off pour désactiver la fonction anti-lien\nantilink action/remove pour retirer directement le lien sans avertissement\nantilink action/warn pour donner des avertissements\nantilink action/delete pour supprimer le lien sans aucune sanction\n\nVeuillez noter que par défaut, la fonction anti-lien est réglée sur delete.") ; return};

      if(arg[0] === 'on') {


       if(enetatoui ) { repondre("L'antilien est déjà activé pour ce groupe")
                    } else {
                  await ajouterOuMettreAJourJid(dest,"oui");

              repondre("L'antilien a été activé avec succès") }

            } else if (arg[0] === "off") {

              if (enetatoui) { 
                await ajouterOuMettreAJourJid(dest , "non");

                repondre("L'antilien a été désactivé avec succès");

              } else {
                repondre("L'antilien n'est pas activé pour ce groupe");
              }
            } else if (arg.join('').split("/")[0] === 'action') {


              let action = (arg.join('').split("/")[1]).toLowerCase() ;

              if ( action == 'remove' || action == 'warn' || action == 'delete' ) {

                await mettreAJourAction(dest,action);

                repondre(`L'action anti-lien a été mise à jour vers ${arg.join('').split("/")[1]}`);

              } else {
                  repondre("Les seules actions disponibles sont warn, remove et delete") ;
              }


            } else repondre("antilink on pour activer la fonction anti-lien\nantilink off pour désactiver la fonction anti-lien\nantilink action/remove pour retirer directement le lien sans avertissement\nantilink action/warn pour donner des avertissements\nantilink action/delete pour supprimer le lien sans aucune sanction\n\nVeuillez noter que par défaut, la fonction anti-lien est réglée sur delete.")


    } catch (error) {
       repondre(error)
    }

  } else { repondre('Vous n\'êtes pas autorisé à utiliser cette commande') ;
  }

});


 //------------------------------------antibot-------------------------------

 zokou({ nomCom: "anti_bot", categorie: 'GROUP', reaction: "🚫" }, async (dest, zk, commandeOptions) => {


  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;



  if (!verifGroupe) {
    return repondre("*Uniquement pour les groupes*");
  }

  if( superUser || verifAdmin) {
    const enetatoui = await atbverifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { repondre('antibot on pour activer la fonction anti-bot\nantibot off pour désactiver la fonction antibot\nantibot action/remove pour retirer directement le bot sans avertissement\nantibot action/warn pour donner des avertissements\nantibot action/delete pour supprimer le message du bot sans aucune sanction\n\nVeuillez noter que par défaut, la fonction anti-bot est réglée sur delete.') ; return};

      if(arg[0] === 'on') {


       if(enetatoui ) { repondre("L'antibot est déjà activé pour ce groupe")
                    } else {
                  await atbajouterOuMettreAJourJid(dest,"oui");

              repondre("L'antibot a été activé avec succès") }

            } else if (arg[0] === "off") {

              if (enetatoui) { 
                await atbajouterOuMettreAJourJid(dest , "non");

                repondre("L'antibot a été désactivé avec succès");

              } else {
                repondre("L'antibot n'est pas activé pour ce groupe");
              }
            } else if (arg.join('').split("/")[0] === 'action') {

              let action = (arg.join('').split("/")[1]).toLowerCase() ;

              if ( action == 'remove' || action == 'warn' || action == 'delete' ) {

                await mettreAJourAction(dest,action);

                repondre(`L'action anti-bot a été mise à jour vers ${arg.join('').split("/")[1]}`);

              } else {
                  repondre("Les seules actions disponibles sont warn, remove et delete") ;
              }


            } else {  
              repondre('antibot on pour activer la fonction anti-bot\nantibot off pour désactiver la fonction antibot\nantibot action/remove pour retirer directement le bot sans avertissement\nantibot action/warn pour donner des avertissements\nantibot action/delete pour supprimer le message du bot sans aucune sanction\n\nVeuillez noter que par défaut, la fonction anti-bot est réglée sur delete.') ;

                            }
    } catch (error) {
       repondre(error)
    }

  } else { repondre('Vous n\'êtes pas autorisé à utiliser cette commande') ;

  }

});

//----------------------------------------------------------------------------

zokou({ nomCom: "group", categorie: 'GROUP' }, async (dest, zk, commandeOptions) => {

  const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

  if (!verifGroupe) { repondre("Commande réservée uniquement aux groupes"); return };
  if (superUser || verifAdmin) {

    if (!arg[0]) { repondre('Instructions:\n\nTapez group open ou close'); return; }
    const option = arg.join(' ')
    switch (option) {
      case "open":
        await zk.groupSettingUpdate(dest, 'not_announcement')
        repondre('Groupe ouvert')
        break;
      case "close":
        await zk.groupSettingUpdate(dest, 'announcement');
        repondre('Groupe fermé avec succès');
        break;
      default: repondre("Veuillez ne pas inventer d'option")
    }


  } else {
    repondre("Commande réservée à l'administrateur");
    return;
  }


});

zokou({ nomCom: "bye", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {

  const { repondre, verifGroupe, superUser } = commandeOptions;
  if (!verifGroupe) { repondre("Commande réservée uniquement aux groupes"); return };
  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }
  await repondre('Sayonara') ;

  zk.groupLeave(dest)
});

zokou({ nomCom: "gnom", categorie: 'GROUP' }, async (dest, zk, commandeOptions) => {

  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Commande réservée aux administrateurs du groupe");
    return;
  };
  if (!arg[0]) {
    repondre("Veuillez entrer le nom du groupe");
    return;
  };
   const nom = arg.join(' ')
  await zk.groupUpdateSubject(dest, nom);
    repondre(`Nom du groupe actualisé : *${nom}*`)


}) ;

zokou({ nomCom: "gdesc", categorie: 'GROUP' }, async (dest, zk, commandeOptions) => {

  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Commande réservée aux administrateurs du groupe");
    return;
  };
  if (!arg[0]) {
    repondre("Veuillez entrer la description du groupe");
    return;
  };
   const nom = arg.join(' ')
  await zk.groupUpdateDescription(dest, nom);
    repondre(`Description du groupe mise à jour : *${nom}*`)


}) ;


zokou({ nomCom: "gpp", categorie: 'GROUP' }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Commande réservée aux administrateurs du groupe");
    return;
  }; 
  if (msgRepondu.imageMessage) {
    const pp = await  zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage) ;

    let image = await generatepp(pp) ;

    console.log(image) ;

      let filepath = 'monpdp.jpg' ;

      fs.writeFile(filepath,image.img , async (err)=> {

          if (err) {

            console.log(err) ;
          } else {

            await zk.updateProfilePicture(dest, { url: filepath }) ;

            zk.sendMessage(dest,{text:"Photo de profil du groupe modifiée"})
             fs.unlinkSync(pp)
          }

      } ) ; 

  } else {
    repondre('Veuillez mentionner une image')
  }

});

/////////////
zokou({nomCom:"tag",categorie:'GROUP',reaction:"🎙️"},async(dest,zk,commandeOptions)=>{

  const {repondre,msgRepondu,verifGroupe,arg ,verifAdmin , superUser}=commandeOptions;

  if(!verifGroupe)  { repondre('Cette commande est uniquement autorisée dans les groupes.')} ;
  if (verifAdmin || superUser) { 

  let metadata = await zk.groupMetadata(dest) ;

  //console.log(metadata.participants)
 let tag = [] ;
  for (const participant of metadata.participants ) {

      tag.push(participant.id) ;
  }
  //console.log(tag)

    if(msgRepondu) {
      console.log(msgRepondu)
      let msg ;

      if (msgRepondu.imageMessage) {



     let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage) ;
     // console.log(msgRepondu) ;
     msg = {

       image : { url : media } ,
       caption : msgRepondu.imageMessage.caption,
       mentions :  tag

     }


      } else if (msgRepondu.videoMessage) {

        let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage) ;

        msg = {

          video : { url : media } ,
          caption : msgRepondu.videoMessage.caption,
          mentions :  tag

        }

      } else if (msgRepondu.audioMessage) {

        let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage) ;

        msg = {

          audio : { url : media } ,
          mimetype:'audio/mp4',
          mentions :  tag
           }     

      } else if (msgRepondu.stickerMessage) {


        let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage)

        let stickerMess = new Sticker(media, {
          pack: 'Zokou-tag',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer2 = await stickerMess.toBuffer();

        msg = { sticker: stickerBuffer2 , mentions : tag}


      }  else {
          msg = {
             text : msgRepondu.conversation,
             mentions : tag
          }
      }

    zk.sendMessage(dest,msg)

    } else {

        if(!arg || !arg[0]) { repondre('Entrez le texte à annoncer ou mentionnez le message à annoncer');
        ; return} ;

      zk.sendMessage(
         dest,
         {
          text : arg.join(' ') ,
          mentions : tag
         }     
      )
    }

} else {
  repondre('Commande réservée aux administrateurs.')
}

});


zokou({ nomCom: "apk", reaction: "📥", categorie: "MON-BOT" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    const appName = arg.join(' ');
    if (!appName) {
      return repondre("*Entrez le nom de l'application à rechercher*");
    }

    const searchResults = await search(appName);

    if (searchResults.length === 0) {
      return repondre("*Impossible de trouver l'application, veuillez entrer un autre nom*");
    }

    const appData = await download(searchResults[0].id);
    const fileSize = parseInt(appData.size);

    if (fileSize > 300) {
      return repondre("Le fichier dépasse 300 MB, impossible de télécharger.");
    }

    const downloadLink = appData.dllink;
    const captionText =
      "『 *Zokou-Md App* 』\n\n*Nom :* " + appData.name +
      "\n*ID :* " + appData["package"] +
      "\n*Dernière mise à jour :* " + appData.lastup +
      "\n*Taille :* " + appData.size +
      "\n";

    const apkFileName = (appData?.["name"] || "Downloader") + ".apk";
    const filePath = apkFileName;

    const response = await axios.get(downloadLink, { 'responseType': "stream" });
    const fileWriter = fs.createWriteStream(filePath);
    response.data.pipe(fileWriter);

    await new Promise((resolve, reject) => {
      fileWriter.on('finish', resolve);
      fileWriter.on("error", reject);
    });

    const documentMessage = {
      'document': fs.readFileSync(filePath),
      'mimetype': 'application/vnd.android.package-archive',
      'fileName': apkFileName
    };

    // Utilisation d'une seule méthode sendMessage pour envoyer l'image et le document
    zk.sendMessage(dest, { image: { url: appData.icon }, caption: captionText }, { quoted: ms });
    zk.sendMessage(dest, documentMessage, { quoted: ms });

    // Supprimer le fichier après envoi
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Erreur lors du traitement de la commande apk:', error);
    repondre("*Erreur lors du traitement de la commande apk*");
  }
});


/*******************************  automute && autoummute ***************************/

const cron = require(`../bdd/cron`) ;


zokou({
      nomCom : 'close',
      categorie : 'GROUP'
  } , async (dest,zk,commandeOptions) => {

      const {arg , repondre , verifAdmin } = commandeOptions ;

      if (!verifAdmin) { repondre('Vous n\'êtes pas administrateur du groupe') ; return}

      group_cron = await cron.getCronById(dest) ;



      if (!arg || arg.length == 0) {

        let state ;
        if (group_cron == null || group_cron.mute_at == null) {

            state =  "Aucune heure définie pour le mute automatique"
        } else {

          state =  `Le groupe sera muté à ${(group_cron.mute_at).split(':')[0]}H${(group_cron.mute_at).split(':')[1]}`
        }

        let msg = `* *État:* ${state}
        * *Instructions:* Pour activer le mute automatique, ajoutez la minute et l'heure après la commande séparées par ':'
        Exemple : automute 9:30
        * Pour supprimer le mute automatique, utilisez la commande *automute del*`


          repondre(msg) ;
          return ;
      } else {

        let texte = arg.join(' ')

        if (texte.toLowerCase() === `del` ) { 

          if (group_cron == null) {

              repondre('Aucun minutage n\'est actif') ;
          } else {

              await cron.delCron(dest) ;

              repondre("Le mute automatique a été supprimé ; redémarrez pour appliquer les changements") 
              .then(() => {

                exec("pm2 restart all");
              }) ;
          }
        } else if (texte.includes(':')) {

          //let { hr , min } = texte.split(':') ;

          await cron.addCron(dest,"mute_at",texte) ;

          repondre(`Configuration du mute automatique pour ${texte} ; redémarrez pour appliquer les changements`) 
          .then(() => {

            exec("pm2 restart all");
          }) ;

        } else {
            repondre('Veuillez entrer une heure valide avec heure et minute séparées par :') ;
        }


      }
  });


  zokou({
    nomCom : 'open',
    categorie : 'GROUP'
} , async (dest,zk,commandeOptions) => {

    const {arg , repondre , verifAdmin } = commandeOptions ;

    if (!verifAdmin) { repondre('Vous n\'êtes pas administrateur du groupe') ; return}

    group_cron = await cron.getCronById(dest) ;



    if (!arg || arg.length == 0) {

      let state ;
      if (group_cron == null || group_cron.unmute_at == null) {

          state = "Aucune heure définie pour le démutage automatique" ;

      } else {

        state = `Le groupe sera démuté à ${(group_cron.unmute_at).split(':')[0]}H${(group_cron.unmute_at).split(':')[1]}`
      }

      let msg = `* *État:* ${state}
      * *Instructions:* Pour activer le démutage automatique, ajoutez la minute et l'heure après la commande séparées par ':'
      Exemple : autounmute 7:30
      * Pour supprimer le démutage automatique, utilisez la commande *autounmute del*`

        repondre(msg) ;
        return ;

    } else {

      let texte = arg.join(' ')

      if (texte.toLowerCase() === `del` ) { 

        if (group_cron == null) {

            repondre('Aucun minutage n\'a été activé') ;
        } else {

            await cron.delCron(dest) ;

            repondre("Le démutage automatique a été supprimé ; redémarrez pour appliquer les changements")
            .then(() => {

              exec("pm2 restart all");
            }) ;



        }
      } else if (texte.includes(':')) {



        await cron.addCron(dest,"unmute_at",texte) ;

        repondre(`Configuration du démutage automatique pour ${texte} ; redémarrez pour appliquer les changements`)
        .then(() => {

          exec("pm2 restart all");
        }) ;

      } else {
          repondre('Veuillez entrer une heure valide avec heure et minute séparées par :') ;
      }


    }
});


zokou({
  nomCom : 'fkick',
  categorie : 'GROUP'
} , async (dest,zk,commandeOptions) => {

  const {arg , repondre , verifAdmin , superUser , verifZokouAdmin } = commandeOptions ;

  if (verifAdmin || superUser) {

    if(!verifZokouAdmin){ repondre('Vous avez besoin des droits administrateur pour exécuter cette commande') ; return ;}

    if (!arg || arg.length == 0) { repondre('Veuillez entrer le code pays dont les membres seront retirés') ; return ;}

      let metadata = await zk.groupMetadata(dest) ;

      let participants = metadata.participants ;

      for (let i = 0 ; i < participants.length ; i++) {

          if (participants[i].id.startsWith(arg[0]) && participants[i].admin === null ) {

             await zk.groupParticipantsUpdate(dest, [participants[i].id], "remove") ;
          }
      }

  } else {
    repondre('Désolé, vous n\'êtes pas administrateur du groupe')
  }


}) ;


zokou({
      nomCom : 'nsfw',
      categorie : 'GROUP'
}, async (dest,zk,commandeOptions) => {

    const {arg , repondre , verifAdmin } = commandeOptions ;

  if(!verifAdmin) { repondre('Désolé, vous ne pouvez pas activer le contenu NSFW sans être administrateur du groupe') ; return}

      let hbd = require('../bdd/hentai') ;

    let isHentaiGroupe = await hbd.checkFromHentaiList(dest) ;

  if (arg[0] == 'on') {

       if(isHentaiGroupe) {repondre('Le contenu NSFW est déjà actif pour ce groupe') ; return} ;

      await hbd.addToHentaiList(dest) ;

      repondre('Le contenu NSFW est maintenant actif pour ce groupe') ;

  } else if (arg[0] == 'off') {

     if(!isHentaiGroupe) {repondre('Le contenu NSFW est déjà désactivé pour ce groupe') ; return} ;

      await hbd.removeFromHentaiList(dest) ;

      repondre('Le contenu NSFW est maintenant désactivé pour ce groupe') ;
  } else {

      repondre('Vous devez entrer "on" ou "off"') ;
    }
} ) ;