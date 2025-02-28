const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

zokou(
  {
    nomCom: 'john',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    // Fonction pour formater le message de profil du joueur
    function formatProfileMessage(data) {
      return `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
═══════════════════  
*..........| SRPN PROFIL |..........*  
═══════════════════  
> *👤 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*..............| EXPLOITS |.............*  
═══════════════════  
> *🧘‍♂️ Rang :*  
- *ABM :* ${data.rang_abm}  
- *SPEED RUSH :* ${data.rang_speed_rush}  
- *YU-GI-OH :* ${data.rang_yugioh}  
> *🏆 Champion :* ${data.champion}  
> *😎 Spécialité :* ${data.specialite}  
> *👑 Leader :* ${data.leader}  
> *🤼‍♂️ Challenge :* ${data.defis_remportes}  
> *💯 Légende :* ${data.legende}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*................| STATS |................*  
═══════════════════  
> *👊 Battles :* 
> V : ${data.victoires} | D : ${data.defaites} | L : ${data.forfaits}   
> *🏅 TOP 3 :* ${data.top3}  
> *🎭 Story Mode :* M.W : ${data.missions_reussies} / M.L : ${data.missions_echouees}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.........| HEROES GAME |.........*  
═══════════════════  
> *🀄 Cards AMB :* ${data.amb_cards}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🪐 Origamy Skins :*  
- *🚻 Skins :* ${data.skins}  
- *🎒 Items :* ${data.items}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.............| CURRENCY |............* 
═══════════════════ 
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
> *🎁 Box VIP :* ${data.box_vip}🎁
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 
*.............| COMPTE |..............*
═══════════════════  
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`;
    }

    try {
      const playerName = 'john';  // Par défaut, "john"

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