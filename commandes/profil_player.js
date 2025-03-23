const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');


// Configuration des profils de joueurs
const joueurs = [
  {
    nomCom: 'tenno',         // Nom de la commande
    playerName: 'Tenno Supremus', // Pseudo du joueur
    imageUrl: 'https://i.ibb.co/3mp1zty/image.jpg'  // Lien de l'image du profil
  },
  {
    nomCom: 'limule',
    playerName: 'Shadow Tempest',
    imageUrl: 'https://i.ibb.co/3mp1zty/image.jpg'
  },
  {
    nomCom: 'yu',
    playerName: 'Yû Blaqs',
    imageUrl: 'https://i.ibb.co/example/mike.jpg'
  }
];

// Fonction pour trouver un joueur par nom de commande
function trouverJoueur(nomCom) {
  return joueurs.find(joueur => joueur.nomCom === nomCom);
}

zokou(
  {
    nomCom: 'profil',   // Commande générique
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser, nomCom } = commandeOptions;

    // Récupération du joueur correspondant à la commande
    const joueur = trouverJoueur(nomCom);
    if (!joueur) {
      repondre(`Le joueur avec la commande *${nomCom}* n'existe pas.`);
      return;
    }

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
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
    }

    try {
      let data = await getPlayerProfile(joueur.playerName);

      if (!data) {
        await insertPlayerProfile(joueur.playerName);
        data = await getPlayerProfile(joueur.playerName);
        repondre(`Le profil du joueur ${joueur.playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        try {
          await fetch(joueur.imageUrl);
          zk.sendMessage(dest, { image: { url: joueur.imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
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
              changes.push(`- *${field}* : ${oldValue} ➡️ ${newValue}`);
              updates[field] = newValue;
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          await updatePlayerProfile(joueur.playerName, updates);
          let changeMessage = `La fiche du joueur *${joueur.playerName}* a été mise à jour avec succès :\n\n${changes.join('\n')}`;
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

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile
};

zokou(
  {
    nomCom: 'john',
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
      const playerName = 'John Supremus';  // Par défaut, "John Supremus"

      // Récupération des données du joueur
      let data = await getPlayerProfile(playerName);

      // Si les données du joueur n'existent pas, créer un nouveau profil
      if (!data) {
        await insertPlayerProfile(playerName);
        data = await getPlayerProfile(playerName);
        repondre(`Le profil du joueur ${playerName} a été créé.`);
      }

      if (!arg || arg.length === 0) {
        // Si aucun argument n'est fourni, afficher le profil du joueur
        const imageUrl = 'https://i.ibb.co/3mp1zty/image.jpg';
        try {
          await fetch(imageUrl); // Vérifier que l'image est accessible
          zk.sendMessage(dest, { image: { url: imageUrl }, caption: formatProfileMessage(data) }, { quoted: ms });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
          zk.sendMessage(dest, { text: formatProfileMessage(data) }, { quoted: ms }); // Envoyer uniquement le texte
        }
      } else if (superUser) {
        // Logique de mise à jour multiple
        let updates = {};
        let fields = arg.join(' ').split(';'); // Séparer par points-virgules

        fields.forEach(fieldPair => {
          let [field, value] = fieldPair.split('=').map(item => item.trim()); // Séparer par `=` et retirer les espaces
          if (field && value) {
            updates[field] = !isNaN(parseFloat(value)) && isFinite(value) ? Number(value) : value; // Convertir en nombre si possible
          }
        });

        if (Object.keys(updates).length > 0) {
          try {
            await updatePlayerProfile(playerName, updates); // Mise à jour multiple
            repondre(`La fiche du joueur ${playerName} a été mise à jour avec succès.`);
          } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            repondre("Une erreur est survenue lors de la mise à jour du profil.");
          }
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

module.exports = {
  insertPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile
};