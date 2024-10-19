const { zokou } = require('../framework/zokou');
const { insertPlayerProfile, getPlayerProfile, updatePlayerProfile } = require('../bdd/player_bdd');

zokou(
  {
    nomCom: 'john',
    categorie: 'PLAYER-PROFIL'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

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
        let profilMessage = `
        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
        ═══════════════════  
        *..........| SRPN PROFIL |..........*  
        ═══════════════════  
        > *👤 ID :* ${data.id}  
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
        > *👊 Battles :* V : ${data.victoires} | D : ${data.defaites} | L : ${data.forfaits}  
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
        > *📟 Compteur :* ${data.compteur}FCFA💸  
        ═══════════════════  
        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`;

        zk.sendMessage(dest, { img: 'https://i.ibb.co/Y2byHsh/image.jpg', text: profilMessage }, { quoted: ms });
      } else if (superUser) {
        // Logique de mise à jour via le module `player_bdd`
        let columnMap = {
          id: "id",
          statut: "statut",
          mode: "mode",
          rang_abm: "rang_abm",
          rang_speed_rush: "rang_speed_rush",
          rang_yugioh: "rang_yugioh",
          champion: "champion",
          specialite: "specialite",
          leader: "leader",
          defis_remportes: "defis_remportes",
          legende: "legende",
          victoires: "victoires",
          defaites: "defaites",
          forfaits: "forfaits",
          top3: "top3",
          missions_reussies: "missions_reussies",
          missions_echouees: "missions_echouees",
          amb_cards: "amb_cards",
          vehicles: "vehicles",
          yugioh_deck: "yugioh_deck",
          skins: "skins",
          items: "items",
          s_tokens: "s_tokens",
          s_gemmes: "s_gemmes",
          coupons: "coupons",
          box_vip: "box_vip",
          compteur: "compteur"
        };

        let field = columnMap[arg[1]];
        let newValue = arg[2];

        if (field && newValue) {
          await updatePlayerProfile(arg[0], field, newValue); // Mise à jour via `player_bdd`
          repondre(`La fiche du joueur a été mise à jour : ${field} = ${newValue}`);
        } else {
          repondre("Champ ou valeur invalide.");
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