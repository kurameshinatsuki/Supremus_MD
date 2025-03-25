const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');



zokou(
  {
    nomCom: 'john',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    function formatProfileMessage(data) {
      return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👤 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🧘‍♂️ RANG :*  
> - *ABM :* ${data.rang_abm}  
> - *SPEED RUSH :* ${data.rang_speed_rush}  
> - *YU-GI-OH :* ${data.rang_yugioh}  
> *🏆 Champion :* ${data.champion}  
> *😎 Spécialité :* ${data.specialite}  
> *👑 Leader :* ${data.leader}  
> *🤼‍♂️ Challenge :* ${data.defis_remportes}  
> *💯 Légende :* ${data.legende}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires}
> D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅 TOP 3 :* 00${data.top3}  
> *🎭 Story Mode :* 
> M.W : 00${data.missions_reussies} / M.L : 00${data.missions_echouees}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🀄 Cards AMB :* ${data.amb_cards}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🪐 Origamy Skins :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
> *🎁 Box VIP :* 0${data.box_vip}🎁
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[ACCOUNT]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
    }

    try {
      const playerName = 'John Supremus';

      let data = await getPlayerProfile(playerName);

      if (!data) {
        await insertPlayerProfile(playerName);
        data = await getPlayerProfile(playerName);
        repondre(`Le profil du joueur ${playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        const imageUrl = 'https://i.ibb.co/3mp1zty/image.jpg';
        try {
          await fetch(imageUrl);
          zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
          zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms });
        }
      } else if (superUser) {
        let updates = {};
        let fields = arg.join(' ').split(';');
        let changes = [];
        let invalidFields = [];

        fields.forEach(fieldPair => {
          let [field, value] = fieldPair.split('=').map(item => item.trim());
          if (field && value) {
            const newValue = isNaN(value) ? value : Number(value);

            // Vérification si le champ existe dans la fiche actuelle
            if (Object.keys(data).includes(field)) {
              const oldValue = data[field] !== undefined ? data[field] : 'Non défini';

              if (oldValue !== newValue) {
                changes.push(`- *${field}* : ${oldValue} -> ${newValue}`);
                updates[field] = newValue;
              }
            } else {
              invalidFields.push(field);
            }
          }
        });

        if (invalidFields.length > 0) {
          repondre(`⛔ Champs invalides détectés : ${invalidFields.join(', ')}.\nVeuillez vérifier la syntaxe et réessayer.`);
        }

        if (Object.keys(updates).length > 0) {
          await updatePlayerProfile(playerName, updates);
          let changeMessage = `✅ La fiche du joueur *${playerName}* a été mise à jour avec succès :\n\n${changes.join('\n')}`;
          repondre(changeMessage);
        } else if (invalidFields.length === 0) {
          repondre("⚠️ Aucun champ valide n'a été trouvé pour la mise à jour.");
        }
      } else {
        repondre("⛔ Vous n'avez pas les permissions pour modifier cette fiche.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      repondre('❌ Une erreur est survenue. Veuillez réessayer.');
    }
  }
);


zokou(
  {
    nomCom: 'tenno',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    // Fonction pour formater le message de profil du joueur
    function formatProfileMessage(data) {
      return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👤 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🧘‍♂️ RANG :*  
> - *ABM :* ${data.rang_abm}  
> - *SPEED RUSH :* ${data.rang_speed_rush}  
> - *YU-GI-OH :* ${data.rang_yugioh}  
> *🏆 Champion :* ${data.champion}  
> *😎 Spécialité :* ${data.specialite}  
> *👑 Leader :* ${data.leader}  
> *🤼‍♂️ Challenge :* ${data.defis_remportes}  
> *💯 Légende :* ${data.legende}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires}
> D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅 TOP 3 :* 00${data.top3}  
> *🎭 Story Mode :* 
> M.W : 00${data.missions_reussies} / M.L : 00${data.missions_echouees}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🀄 Cards AMB :* ${data.amb_cards}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🪐 Origamy Skins :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
> *🎁 Box VIP :* 0${data.box_vip}🎁
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[ACCOUNT]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
    }

    try {
      const playerName = 'Tęnnõ Sũpręmũs';

      let data = await getPlayerProfile(playerName);

      if (!data) {
        await insertPlayerProfile(playerName);
        data = await getPlayerProfile(playerName);
        repondre(`Le profil du joueur ${playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        const imageUrl = 'https://i.ibb.co/yMQbMrn/image.jpg';
        try {
          await fetch(imageUrl);
          zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
          zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms });
        }
      } else if (superUser) {
        let updates = {};
        let fields = arg.join(' ').split(';');
        let changes = [];

        fields.forEach(fieldPair => {
          let [field, value] = fieldPair.split('=').map(item => item.trim());
          if (field && value) {
            const newValue = isNaN(value) ? value : Number(value);
            const oldValue = data[field] !== undefined ? data[field] : 'Non défini';

            if (oldValue !== newValue) {
              changes.push(`- *${field}* : ${oldValue} -> ${newValue}`);
              updates[field] = newValue;
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          await updatePlayerProfile(playerName, updates);
          let changeMessage = `La fiche du joueur *${playerName}* a été mise à jour avec succès :\n\n${changes.join('\n')}`;
          repondre(changeMessage);
        } else {
          repondre("Aucun champ valide trouvé pour la mise à jour.");
        }
      } else {
        repondre("Vous n'avez pas les permissions pour modifier cette fiche.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      repondre('Une erreur est survenue. Veuillez réessayer.');
    }
  }
);

zokou(
  {
    nomCom: 'nelliel',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    // Fonction pour formater le message de profil du joueur
    function formatProfileMessage(data) {
      return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👤 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🧘‍♂️ RANG :*  
> - *ABM :* ${data.rang_abm}  
> - *SPEED RUSH :* ${data.rang_speed_rush}  
> - *YU-GI-OH :* ${data.rang_yugioh}  
> *🏆 Champion :* ${data.champion}  
> *😎 Spécialité :* ${data.specialite}  
> *👑 Leader :* ${data.leader}  
> *🤼‍♂️ Challenge :* ${data.defis_remportes}  
> *💯 Légende :* ${data.legende}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires}
> D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅 TOP 3 :* 00${data.top3}  
> *🎭 Story Mode :* 
> M.W : 00${data.missions_reussies} / M.L : 00${data.missions_echouees}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🀄 Cards AMB :* ${data.amb_cards}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🪐 Origamy Skins :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
> *🎁 Box VIP :* 0${data.box_vip}🎁
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[ACCOUNT]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
    }

    try {
      const playerName = 'Nelliel Volfir';

      let data = await getPlayerProfile(playerName);

      if (!data) {
        await insertPlayerProfile(playerName);
        data = await getPlayerProfile(playerName);
        repondre(`Le profil du joueur ${playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        const imageUrl = 'https://i.ibb.co/MkKtgK58/image.jpg';
        try {
          await fetch(imageUrl);
          zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
          zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms });
        }
      } else if (superUser) {
        let updates = {};
        let fields = arg.join(' ').split(';');
        let changes = [];

        fields.forEach(fieldPair => {
          let [field, value] = fieldPair.split('=').map(item => item.trim());
          if (field && value) {
            const newValue = isNaN(value) ? value : Number(value);
            const oldValue = data[field] !== undefined ? data[field] : 'Non défini';

            if (oldValue !== newValue) {
              changes.push(`- *${field}* : ${oldValue} -> ${newValue}`);
              updates[field] = newValue;
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          await updatePlayerProfile(playerName, updates);
          let changeMessage = `La fiche du joueur *${playerName}* a été mise à jour avec succès :\n\n${changes.join('\n')}`;
          repondre(changeMessage);
        } else {
          repondre("Aucun champ valide trouvé pour la mise à jour.");
        }
      } else {
        repondre("Vous n'avez pas les permissions pour modifier cette fiche.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      repondre('Une erreur est survenue. Veuillez réessayer.');
    }
  }
);

zokou(
  {
    nomCom: 'louis',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    // Fonction pour formater le message de profil du joueur
    function formatProfileMessage(data) {
      return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👤 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🧘‍♂️ RANG :*  
> - *ABM :* ${data.rang_abm}  
> - *SPEED RUSH :* ${data.rang_speed_rush}  
> - *YU-GI-OH :* ${data.rang_yugioh}  
> *🏆 Champion :* ${data.champion}  
> *😎 Spécialité :* ${data.specialite}  
> *👑 Leader :* ${data.leader}  
> *🤼‍♂️ Challenge :* ${data.defis_remportes}  
> *💯 Légende :* ${data.legende}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires}
> D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅 TOP 3 :* 00${data.top3}  
> *🎭 Story Mode :* 
> M.W : 00${data.missions_reussies} / M.L : 00${data.missions_echouees}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🀄 Cards AMB :* ${data.amb_cards}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🪐 Origamy Skins :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
> *🎁 Box VIP :* 0${data.box_vip}🎁
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[ACCOUNT]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
    }

    try {
      const playerName = 'Lone Ink Louis';

      let data = await getPlayerProfile(playerName);

      if (!data) {
        await insertPlayerProfile(playerName);
        data = await getPlayerProfile(playerName);
        repondre(`Le profil du joueur ${playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        const imageUrl = 'https://i.ibb.co/xt637n06/image.jpg';
        try {
          await fetch(imageUrl);
          zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
          zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms });
        }
      } else if (superUser) {
        let updates = {};
        let fields = arg.join(' ').split(';');
        let changes = [];

        fields.forEach(fieldPair => {
          let [field, value] = fieldPair.split('=').map(item => item.trim());
          if (field && value) {
            const newValue = isNaN(value) ? value : Number(value);
            const oldValue = data[field] !== undefined ? data[field] : 'Non défini';

            if (oldValue !== newValue) {
              changes.push(`- *${field}* : ${oldValue} -> ${newValue}`);
              updates[field] = newValue;
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          await updatePlayerProfile(playerName, updates);
          let changeMessage = `La fiche du joueur *${playerName}* a été mise à jour avec succès :\n\n${changes.join('\n')}`;
          repondre(changeMessage);
        } else {
          repondre("Aucun champ valide trouvé pour la mise à jour.");
        }
      } else {
        repondre("Vous n'avez pas les permissions pour modifier cette fiche.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      repondre('Une erreur est survenue. Veuillez réessayer.');
    }
  }
);