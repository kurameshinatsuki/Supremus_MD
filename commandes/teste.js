/*const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

const playerProfiles = {
  'john': { 
    nomCom: 'john',
    playerName: 'John Supremus',
    imageUrl: 'https://i.ibb.co/5hPBn1j3/Image-2025-04-02-13-55-06-1.jpg'
  }
};


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
> *🧑‍🧑‍🧒‍🧒 DIVISION :* ${data.division}
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
> *👊 Battles :* V : 00${data.victoires} | D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅 TOP 3 :* 00${data.top3}  
> *🎭 Story Mode :* 
> M.W : 00${data.missions_reussies} / M.L : 00${data.missions_echouees}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🀄 Cards ABM :* ${data.abm_cards}  
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
};*/

const { zokou } = require("../framework/zokou");
const axios = require("axios");

let intervalPing = null;

zokou({ nomCom: "pingweb", categorie: "MON-BOT", reaction: "⚡" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        repondre("Le ping est déjà en cours...");
        return;
    }

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://supremus-md.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `Statut : ${response.status} (${new Date().toLocaleTimeString()})` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, 10000);

    repondre("Ping démarré. Vérification toutes les 10 secondes.");
});


zokou({ nomCom: "stopping", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        repondre("Ping arrêté.");
    } else {
        repondre("Aucun ping en cours.");
    }
});