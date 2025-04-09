const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/drpn_bdd');

const playerProfiles = {
  'a_tenno': {
    nomCom: 'a_tenno',
    playerName: 'Agent Tęnnõ',
    imageUrl: 'https://i.ibb.co/wNvNq8bD/image.jpg'
  },
  /*'a_nelliel': { 
    nomCom: 'a_nelliel',
    playerName: 'Agent Nelliel',
    imageUrl: 'https://i.ibb.co/wNvNq8bD/image.jpg'
  },*/
  'a_louis': { 
    nomCom: 'a_louis',
    playerName: 'Agent Louis',
    imageUrl: 'https://i.ibb.co/wNvNq8bD/image.jpg'
  },
  'a_lord': { 
    nomCom: 'a_lord',
    playerName: 'Agent Lord',
    imageUrl: 'https://i.ibb.co/wNvNq8bD/image.jpg'
  }
};


function formatProfileMessage(data) {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[COMPTEUR]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👤 NAME :* ${data.name}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> - *🫂 Acceuil :* ${data.acceuil}  
> - *⚖️ Arbitrage :* ${data.arbitrage}  
> - *🤝 Transaction :* ${data.transaction}  
> - *📣 Diffusion :* ${data.diffusion}  
> - *🎨 Designs :* ${data.designs}  
> - *🌐 Story :* ${data.story}  
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *📟 SOLDE :* ${data.solde}🧭  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

for (const nomCom in playerProfiles) {
  zokou(
    {
      nomCom: nomCom,
      categorie: 'DRPN'
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