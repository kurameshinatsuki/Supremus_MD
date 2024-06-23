/*const { zokou } = require('../framework/zokou');
const { getData } = require('../bdd/testee');
const s = require("../set");

const dbUrl = s.SPDB;

zokou(
  {
    nomCom: 'john',
    categorie: 'Update'
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
        let mesg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
.            *| 𝐂𝐑𝐏𝐒 𝐑𝐎𝐋𝐈𝐒𝐓𝐄 |*
═══════════════════

> *👤 𝗜𝗗 :* ${data.e1}
> *♨️ 𝗗𝗶𝘃𝗶𝘀𝗶𝗼𝗻 :* ${data.e2}🥉
> *⚜️ 𝗦𝘁𝗮𝘁𝘂𝘁 :* ${data.e3}✅

░░░░░░░░░░░░░░░░░░░
> *🔥 𝗪𝗶𝘀𝗵 :* ${data.e4}/1J
> *🧘‍♂️ 𝗦𝗮𝗴𝗲 :* ${data.e5}pts
> *🏆 𝗖𝗵𝗮𝗺𝗽𝗶𝗼𝗻 :* ${data.e6}🥈
> *😎 𝗦𝗽𝗲𝗰𝗶𝗮𝗹𝗶𝘀𝘁𝗲 :* ${data.e7}⭐
> *🏅 𝗠𝗮𝗶𝘁𝗿𝗲 :* ${data.e8}/5
> *👺 𝗗𝗶𝗰𝘁𝗮𝘁𝗲𝘂𝗿 :* ${data.e9}🥉
> *🧠 𝗠𝗮𝗶𝘁𝗿𝗶𝘀𝗲 :* ${data.e10}🧠
> *🌐 𝗔𝗱𝘃𝗲𝗻𝘁𝘂𝗿𝗲𝗿 :* ${data.e11}
> *🤼‍♂️ 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲 :* ${data.e12}
> *💯 𝗟𝗲𝗴𝗲𝗻𝗱 :* ${data.e13}
░░░░░░░░░░░░░░░░░░░
> *👊 𝗙𝗶𝗴𝗵𝘁 :* 𝗩 : ${data.e14} 𝗗 : ${data.e15}
> *🏅 𝗧𝗢𝗣 3 :* ${data.e16}
> *🎭 𝗦𝘁𝗼𝗿𝘆 𝗠𝗼𝗱𝗲 :* ${data.e17}
> *🧠 𝗠𝗮𝗶𝘁𝗿𝗶𝘀𝗲 :* ${data.e18}
░░░░░░░░░░░░░░░░░░░
*👤 𝗣𝗲𝗿𝘀𝗼 :* ${data.e19}
*🀄 𝗖𝗮𝗿𝗱 :* ${data.e20}
*🎚️ 𝗡𝗶𝘃𝗲𝗮𝘂 :* ${data.e21}
*🔰 𝗫𝗽 :* ${data.e22} / 500
*🎒 𝗜𝘁𝗲𝗺𝘀 :* ${data.e23}
░░░░░░░░░░░░░░░░░░░
*💳𝗣𝗿𝗲𝗺𝘂𝗶𝗺 :* ${data.e24}💳
*🧭$ ₱𝗶𝗲𝗰𝗲𝘀 :* ${data.e25}🧭
*💎$ £𝗶𝗮𝗺𝗼𝗻𝗱 :* ${data.e26}💎
*♦️$ 𝐓𝗼𝗸𝗲𝗻 :* ${data.e27}♦️
═══════════════════
░░░░░░░░░░░░░░░░░░░
     『 🪀🎮 𝗖𝗥𝗣𝗦 𝗡𝗢 𝗟𝗜𝗠𝗜𝗧 🏆🔝 』`;
zk.sendMessage(dest, { image: { url: 'https://telegra.ph/file/debe6725c507da84c6a82.jpg' }, caption: mesg }, { quoted: ms });
       } else {
        if (superUser) { 
        //const dbUrl = "postgres://supremusprod:KMhs3rOCSqqcsV5FjXYywuibPPQXnJuE@dpg-cpoppueehbks73eog9u0-a.oregon-postgres.render.com/supremusprod";
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
    case "John":
      colonnesJoueur = {
        id: "e1",
        division: "e2",
        statut: "e3",
        wish: "e4",
        sage: "e5",
        champion: "e6",
        specialiste: "e7",
        maitre: "e8",
        dictateur: "e9",
        maitrise: "e10",
        adventurer: "e11",
        challenge: "e12",
        legend: "e13",
        v: "e14",
        d: "e15",
        top_3: "e16",
        story_mode: "e17",
        maitrise: "e18",
        perso: "e19",
        card: "e20",
        niveau: "e21",
        xp: "e22",
        items: "e23",
        premium: "e24",
        pièce: "e25",
        diamond: "e26",
        token: "e27",
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
            const query = `UPDATE testee SET ${colonneObjet} = ${data[colonneObjet]} ${signe} ${valeur} WHERE id = 1`;
            await client.query(query);

            console.log(`Données de l'utilisateur ${joueur} mises à jour`);
           await repondre(`Données du joueur mises à jour\n👤 *PLAYER:* ${joueur}\n⚙ *OBJECT*: ${object}\n💵 *VALEUR*: ${signe}${valeur}\n*NOUVEAU SOLDE*: ${solde}`);
          } else if (colonneObjet && signe === '=') {
            const query = `
            UPDATE testee
            SET ${colonneObjet} = $1
            WHERE id = 1
            `;

            await client.query(query, [texte]);

            console.log(`données du joueur: ${joueur} mise à jour`);
            await repondre(`Données du joueur mises à jour\n👤 *PLAYER:* ${joueur}\n⚙ *OBJECT*: ${object}\n💵 *VALEUR*: ${texte} \n *NOUVELLE DONNÉE*: ${texte}`);
          } else {
            console.log("Nom d'objet non reconnu ou signe invalide.");
            repondre(`Une erreur est survenue. Veuillez entrer correctement les données.`);
          }
        } else {
          console.log("Le message ne correspond pas au format attendu.");
          repondre(`Le format du message est incorrect.`);
        } 
        } else { repondre('✨🛂 Réservé aux membres de la *DRPS*');}
       

        client.release();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données de l'utilisateur:", error);
    }
  });
