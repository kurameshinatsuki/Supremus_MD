const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

const playerProfiles = {
  'tenno': {
    nomCom: 'tenno',
    playerName: 'Tęnnõ Sũpręmũs',
    imageUrl: 'https://i.ibb.co/cSxxrVFv/Image-2025-03-24-07-41-59-2.jpg'
  },
  'nelliel': { 
    nomCom: 'nelliel',
    playerName: 'Nelliel Volfir',
    imageUrl: 'https://i.ibb.co/20hx4jVR/Image-2025-03-24-07-41-59-1.jpg'
  },
  'louis': { 
    nomCom: 'louis',
    playerName: 'Lone Ink Louis',
    imageUrl: 'https://i.ibb.co/XrYFM8sR/Image-2025-03-27-02-14-52.jpg'
  },
  'aizen': { 
    nomCom: 'aizen',
    playerName: 'Aizen',
    imageUrl: 'https://i.ibb.co/XrjPt3cY/Image-2025-04-20-22-39-40.jpg'
  },
  'tina': { 
    nomCom: 'tina',
    playerName: 'Tina Yuzuriha',
    imageUrl: 'https://i.ibb.co/4wRc0k2m/Image-2025-04-21-23-35-23.jpg'
  },
  'inferno': { 
    nomCom: 'inferno',
    playerName: 'Inferno',
    imageUrl: 'https://i.ibb.co/RTv16qdh/Image-2025-03-28-13-43-31-0.jpg'
  },
  /*'shadow': { 
    nomCom: 'shadow',
    playerName: 'Lloyd Shadow T.',
    imageUrl: 'https://i.ibb.co/4Z8r4mgn/Image-2025-03-28-13-43-31-1.jpg'
  },*/
  'vecta': { 
    nomCom: 'vecta',
    playerName: 'Vecta Uchiwa.',
    imageUrl: 'https://i.ibb.co/cXy8YsLq/Image-2025-03-30-00-24-06.jpg'
  },
  /*'sophie': { 
    nomCom: 'sophie',
    playerName: 'Sophie Scarlet Louis',
    imageUrl: 'https://i.ibb.co/PZwGRjNL/Image-2025-04-02-13-55-06-0.jpg'
  },*/
  'lord': { 
    nomCom: 'lord',
    playerName: 'Lord',
    imageUrl: 'https://i.ibb.co/5hPBn1j3/Image-2025-04-02-13-55-06-1.jpg'
  },
  'boyle': { 
    nomCom: 'boyle',
    playerName: 'Arthur Boyle',
    imageUrl: 'https://i.ibb.co/bMsPvMzn/Image-2025-04-08-23-10-16.jpg'
  },
 'nezuko': { 
    nomCom: 'nezuko',
    playerName: 'Nezuko',
    imageUrl: 'https://i.ibb.co/PdKp7GJ/Image-2025-04-09-00-34-23.jpg'
  },
 'yuki': { 
    nomCom: 'yuki',
    playerName: 'Yuki Shigoku',
    imageUrl: 'https://i.ibb.co/8nKBsgY2/Image-2025-04-10-22-15-34-1.jpg'
  },
 'rudeus': { 
    nomCom: 'rudeus',
    playerName: 'Rudeus Hells',
    imageUrl: 'https://i.ibb.co/FLnjFQ5X/Image-2025-04-10-22-15-34-2.jpg'
  },
 'no_name': { 
    nomCom: 'no_name',
    playerName: 'No Name',
    imageUrl: 'https://i.ibb.co/yn4zWDK4/Image-2025-04-10-22-15-34-0.jpg'
  },
 'arthur': { 
    nomCom: 'arthur',
    playerName: 'Arthur Kamado',
    imageUrl: 'https://i.ibb.co/HpKGM9yc/Image-2025-04-17-01-44-19.jpg'
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
> - *ORIGAMY WORLD :* ${statut_origamy_world}
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