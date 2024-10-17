const { zokou } = require('../framework/zokou');
const { getData } = require('../bdd/player_bdd');

const dbUrl = s.DB;

zokou(
  {
    nomCom: 'profilSRPN👤',
    categorie: 'SRPN📋'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;
    let client;
    
    try {
      // Récupération des données du joueur
      const data = await getData(arg[0]); // arg[0] est l'ID du joueur

      // Si aucun argument n'est fourni, afficher le profil du joueur
      if (!arg || arg.length === 0) {
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
        - *ABM :* ${data.abm_rang}  
        - *SPEED RUSH :* ${data.speed_rush_rang}  
        - *YU-GI-OH :* ${data.yugioh_rang}  
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
        > *🀄 Cards AMB :* ${data.cards_amb}  
        > *🚗 Vehicles :* ${data.vehicles_speedrush}  
        > *🃏 Yu-Gi-Oh :* ${data.deck_yugioh}  
        > *🪐 Origamy Skins :*  
        - *🚻 Skins :* ${data.skins_origamy}  
        - *🎒 Items :* ${data.items_origamy}  
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
        // Logique de mise à jour (simplifiée)
        const proConfig = { connectionString: dbUrl, ssl: { rejectUnauthorized: false } };
        const { Pool } = require('pg');
        const pool = new Pool(proConfig);
        client = await pool.connect();

        let columnMap = {
          id: "id",
          statut: "statut",
          mode: "mode",
          abm_rang: "abm_rang",
          speed_rush_rang: "speed_rush_rang",
          yugioh_rang: "yugioh_rang",
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
          cards_amb: "cards_amb",
          vehicles_speedrush: "vehicles_speedrush",
          deck_yugioh: "deck_yugioh",
          skins_origamy: "skins_origamy",
          items_origamy: "items_origamy",
          s_tokens: "s_tokens",
          s_gemmes: "s_gemmes",
          coupons: "coupons",
          box_vip: "box_vip",
          compteur: "compteur"
        };

        let field = columnMap[arg[1]];
        let newValue = arg[2];

        if (field && newValue) {
          await client.query(`UPDATE srpn_data SET ${field} = $1 WHERE id = $2`, [newValue, arg[0]]);
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
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);