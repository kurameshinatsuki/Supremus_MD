const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile, deletePlayerProfile } = require('../bdd/player_bdd');

const playerProfiles = { 
  'john': {
    nomCom: 'john',
    playerName: 'John Sũpręmũs',
    imageUrl: 'https://i.ibb.co/cSxxrVFv/Image-2025-03-24-07-41-59-2.jpg'
  },
  'assistant': {
    nomCom: 'assistant',
    playerName: 'Assistant Sũpręmũs',
    imageUrl: 'https://i.ibb.co/cSxxrVFv/Image-2025-03-24-07-41-59-2.jpg'
  }
};


function formatProfileMessage(data) {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🆔 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🏆 Supremus Cup :* ${data.supremus_cup}  
> *🧑‍🧑‍🧒‍🧒 DIVISION :* ${data.division}
> *🎮 STATUT :*  
> - *ABM :* ${data.statut_abm}  
> - *SPEED RUSH :* ${data.statut_speed_rush}  
> - *YU-GI-OH :* ${data.statut_yugioh}  
> - *ORIGAMY WORLD :* ${data.statut_origamy_world}
> *🌟 Best Game :* ${data.best_game}
> *💯 Défi Hebdo :* ${data.defi_hebdo}
> *👥 Challenge :* ${data.challenge}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires} | D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅TOP 3 :* 00${data.top3}  
> *🔹S Points :* ${data.supremus_points}
> *🎁 Box VIP :* ${data.box_vip}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🎴 Heroes :* ${data.heroes}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🌐 Origamy World Story :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎚️ Rank :* ${data.rank}
> - *⭐ XP :* ${data.xp}
> - *👾 Stats :* ${data.sante}❤️ | ${data.energie}🌀
> ${data.heart}🫀 | ${data.faim}🍽️
> ${data.soif}🍶 | ${data.reputation}🎭
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[COMPTEUR]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> - *🫂 Acceuil :* ${data.acceuil}  
> - *⚖️ Arbitrage :* ${data.arbitrage}  
> - *🤝 Transaction :* ${data.transaction}  
> - *📣 Diffusion :* ${data.diffusion}  
> - *🎨 Designs :* ${data.designs}  
> - *🌐 Story :* ${data.story}  
> *📟 BALANCE :* ${data.balance}🧭  
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

for (const nomCom in playerProfiles) {
  zokou(
    {
      nomCom: nomCom,
      categorie: 'PLAYER-PROFIL'
    },
    async (dest, zk, commandeOptions) => {
      const { ms, repondre, arg, superUser } = commandeOptions;
      const profile = playerProfiles[nomCom];
      const playerName = profile.playerName;
      const imageUrl = profile.imageUrl;

      try {
        let data = await getPlayerProfile(playerName);

        if (!data) {
          await insertPlayerProfile(playerName);
          data = await getPlayerProfile(playerName);
          repondre(`Le profil du joueur ${playerName} a été créé.`);
        }

        if (!arg || arg.length === 0) {
          try {
            await zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
          } catch (error) {
            console.error("Erreur lors de la récupération de l'image :", error);
            zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms });
          }
        } else if (superUser) {
          let updates = {};
          let fields = arg.join(' ').split(';');
          let changes = [];

          fields.forEach(fieldPair => {
            let operator = null;
            let field = null;
            let rawValue = null;

            // Détection correcte de l'opérateur
            if (fieldPair.includes('+=')) {
              [field, rawValue] = fieldPair.split('+=').map(item => item.trim());
              operator = 'add';
            } else if (fieldPair.includes('-=')) {
              [field, rawValue] = fieldPair.split('-=').map(item => item.trim());
              operator = 'remove';
            } else if (fieldPair.includes('=')) {
              [field, rawValue] = fieldPair.split('=').map(item => item.trim());
              operator = 'set';
            }

            if (!field || rawValue === undefined) return;

            const oldValue = data[field];
            if (oldValue === undefined) return;

            let newValue = oldValue;

            if (!isNaN(oldValue)) {
              // Champs numériques
              const numericVal = Number(rawValue);
              if (operator === 'add') {
                newValue = oldValue + numericVal;
              } else if (operator === 'remove') {
                newValue = oldValue - numericVal;
              } else {
                newValue = numericVal;
              }
            } else {
              // Champs texte
              const list = oldValue ? oldValue.split(',').map(s => s.trim()) : [];
              if (operator === 'add') {
                if (!list.includes(rawValue)) list.push(rawValue);
                newValue = list.join(', ');
              } else if (operator === 'remove') {
                newValue = list.filter(item => item !== rawValue).join(', ');
              } else {
                newValue = rawValue;
              }
            }

            if (newValue !== oldValue) {
              updates[field] = newValue;
              changes.push(`*${field}* : ${oldValue} -> ${newValue}`);
            }
          });

          if (Object.keys(updates).length > 0) {
            await updatePlayerProfile(playerName, updates);
            data = await getPlayerProfile(playerName);
            let confirmationMessage = `Mise à jour du profil de ${playerName}:\n${changes.join('\n')}`;
            repondre(confirmationMessage);
          } else {
            repondre('Aucune modification détectée.');
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la commande :", error);
        repondre('Une erreur est survenue lors du traitement de la commande.');
      }
    }
  );
};



zokou({
  nomCom: "delprofil",
  categorie: "DRPN",
  reaction: "🗑️"
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, superUser } = commandeOptions;

  // 1. Vérification sécurité
  if (!superUser) {
    return repondre("🚫 Cette commande est réservée au propriétaire du bot.");
  }

  // 2. Vérifie que le nom du joueur est fourni
  const name = arg.join(" ").trim();
  if (!name) {
    return repondre("❗ Veuillez spécifier le nom du joueur à supprimer.\nExemple : `-delprofil John`");
  }

  try {
    const resultat = await deletePlayerProfile(name);

    if (resultat) {
      await repondre(`✅ Le profil de *${name}* a été supprimé avec succès.`);
    } else {
      await repondre(`⚠️ Aucun profil trouvé pour le joueur *${name}*.`);
    }

  } catch (e) {
    console.error("Erreur lors de la suppression :", e);
    await repondre("❌ Une erreur est survenue lors de la suppression du profil.");
  }
});