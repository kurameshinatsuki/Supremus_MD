const { zokou } = require('../framework/zokou');
const { getData } = require('../bdd/crpsfiche');
const s = require("../set");

const dbUrl = s.SPDB;

zokou(
  {
    nomCom: 'john',
    categorie: 'AAA'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    try {
      const data = await getData('1');
      let joueur = arg[1];
      let object = arg[3];
      let signe = arg[4];
      let valeur = arg[5];
      let texte = arg.slice(5).join(' ');

      if (!arg || arg.length === 0) {
        let mesg = `*💠 CRPS FICHE*
⬕ *👤Joueur*: ${data.joueur}
⬕ *💳 Premium*: ${data.premium}
⬕ *🧭 $₱ieces*: ${data.pieces}🧭
⬕ *💎 $£iamond*: ${data.diamonds}💎
⬕ *👊 Fight*: V: ${data.victories} D: ${data.defeats}
⬕ *👤 Perso*: ${data.perso}
⬕ *🀄 Card*: ${data.card}
⬕ *🔰 XP*: ${data.xp} / ${data.max_xp}
⬕ *💠 Stats:* 🍽️: ${data.stats_food} 🍶: ${data.stats_drink} ❤️: ${data.stats_health}
░░░░░░░░░░░░░░░░░░░
        *『 🎮 𝗣𝗟𝗔𝗬 𝗡𝗢 𝗟𝗜𝗠𝗜𝗧 🔝 』*`;
        zk.sendMessage(dest, { image: { url: 'https://exemple.com/image.jpg' }, caption: mesg }, { quoted: ms });
      } else {
        if (superUser) {
          const proConfig = {
            connectionString: dbUrl,
            ssl: {
              rejectUnauthorized: false,
            },
          };

          const { Pool } = require('pg');
          const pool = new Pool(proConfig);
          const client = await pool.connect();

          if (arg[0] === 'joueur:') {
            let colonnesJoueur;
            
            switch (joueur) {
              case "NomDuJoueur":
                colonnesJoueur = {
                  premium: "premium",
                  pieces: "pieces",
                  diamonds: "diamonds",
                  victories: "victories",
                  defeats: "defeats",
                  perso: "perso",
                  card: "card",
                  xp: "xp",
                  stats_food: "stats_food",
                  stats_drink: "stats_drink",
                  stats_health: "stats_health",
                  // Ajoute d'autres colonnes si nécessaire
                };
                break;
              default:
                console.log("Nom de joueur non reconnu.");
                repondre(`joueur: ${joueur} non reconnu`);
                return;
            }
            
            const colonneObjet = colonnesJoueur[object];
            const solde = `${data[colonneObjet]} ${signe} ${valeur}`;

            if (colonneObjet && (signe === '+' || signe === '-')) {
              const query = `UPDATE crpsfiche SET ${colonneObjet} = ${data[colonneObjet]} ${signe} ${valeur} WHERE id = 1`;
              await client.query(query);

              console.log(`Données de l'utilisateur ${joueur} mises à jour`);
              await repondre(`Données du joueur mises à jour\n👤 *JOUEUR*: ${joueur}\n⚙ *OBJECT*: ${object}\n💵 *VALEUR*: ${signe}${valeur}\n*NOUVEAU SOLDE*: ${solde}`);
            } else if (colonneObjet && signe === '=') {
              const query = `
                UPDATE crpsfiche
                SET ${colonneObjet} = $1
                WHERE id = 1
              `;

              await client.query(query, [texte]);

              console.log(`Données du joueur: ${joueur} mises à jour`);
              await repondre(`Données du joueur mises à jour\n👤 *JOUEUR*: ${joueur}\n⚙ *OBJECT*: ${object}\n💵 *VALEUR*: ${texte} \n*NOUVELLE DONNÉE*: ${texte}`);
            } else {
              console.log("Nom d'objet non reconnu ou signe invalide.");
              repondre(`Une erreur est survenue. Veuillez entrer correctement les données.`);
            }
          } else {
            console.log("Le message ne correspond pas au format attendu.");
            repondre(`Le format du message est incorrect.`);
          }
          
          client.release();
        } else {
          repondre('Seuls les SuperUsers ont le droit de modifier cette fiche.');
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données de l'utilisateur:", error);
    }
  }
);
