const { zokou } = require('../framework/zokou');

let gameInProgress = {};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const provocations = [
  "Le croupier rigole doucement...",
  "Encore raté ! La chance n'est pas avec toi.",
  "Les dés t’ont trahi aujourd’hui.",
  "Va prier Dame Fortune.",
  "Ce n’est clairement pas ton jour.",
  "Même les slots se moquent de toi."
];

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg, from } = commandeOptions;

    if (gameInProgress[from]?.[auteurMessage]) {
      return repondre("⏳ Vous avez déjà un jeu en cours. Veuillez le terminer avant d'en lancer un autre.");
    }

    const game = arg[0];
    const mise = parseInt(arg[1]);

    if (!game) {
      return repondre(
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
        "*🎰 Bienvenue au Mini-Casino SRPN !*\n\n" +
        "*Jeux disponibles :*\n\n" +
        "1. *casino roulette <mise>* - Roulette\n" +
        "2. *casino des <mise>* - Dé contre le croupier\n" +
        "3. *casino slot <mise>* - Machine à sous" +
        "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
      );
    }

    if (isNaN(mise) || mise < 1000) {
      return repondre("💰 Mise invalide. Minimum requis : 1000🧭.");
    }

    gameInProgress[from] = gameInProgress[from] || {};
    gameInProgress[from][auteurMessage] = true;

    try {
      switch (game.toLowerCase()) {
        case 'roulette': {
          const rouletteResult = Math.random();
          let gain = 0;
          let resultatRoulette = '';

          if (rouletteResult < 0.05) {
            gain = mise * 10;
            resultatRoulette = 'Mise ×10';
          } else if (rouletteResult < 0.15) {
            gain = mise * 5;
            resultatRoulette = 'Mise ×5';
          } else {
            gain = 0;
            resultatRoulette = '0 (Perdu)';
          }

          await wait(2000);

          const message = gain > 0
            ? `*🎉 Vous avez gagné ${gain} !*`
            : `*🥲 Dommage, vous avez perdu votre mise.*\n${provocations[Math.floor(Math.random() * provocations.length)]}`;

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
            `🎰 *Roulette Résultat :* ${resultatRoulette}\n\n${message}` +
            "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
          );
          break;
        }

        case 'des': {
          const joueurDe = Math.floor(Math.random() * 6) + 1;
          const croupierDe = Math.floor(Math.random() * 6) + 1;

          await wait(2000);

          let message = '';
          if (joueurDe > croupierDe) {
            message = `*🎉 Vous avez gagné ${mise * 2} !*`;
          } else if (joueurDe === croupierDe) {
            message = "*🤝 Égalité. Vous récupérez la moitié de votre mise.*";
          } else {
            message = `*😞 Vous avez perdu votre mise.*\n${provocations[Math.floor(Math.random() * provocations.length)]}`;
          }

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
            `🎲 *Votre dé :* ${joueurDe}\n*Dé du croupier :* ${croupierDe}\n\n${message}` +
            "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
          );
          break;
        }

        case 'slot': {
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `*${r1} | ${r2} | ${r3}*`;
          let gain = 0;
          let winMessage = '*Pas de chance cette fois...*';

          await wait(2000);

          if (r1 === r2 && r2 === r3) {
            gain = mise * 6;
            winMessage = `*🎉 JACKPOT ! Vous gagnez ${gain} !*`;
          } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            gain = mise * 2;
            winMessage = `*😉 Petit gain : ${gain} !*`;
          } else {
            winMessage += `\n${provocations[Math.floor(Math.random() * provocations.length)]}`;
          }

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
            `🎰 *Résultat :* ${result}\n\n${winMessage}` +
            "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
          );
          break;
        }

        default:
          repondre('🎮 Jeu non reconnu. Utilisez *roulette*, *des* ou *slot*.');
      }
    } catch (err) {
      console.error('Erreur dans le casino :', err);
      repondre("❌ Une erreur s'est produite pendant le jeu.");
    } finally {
      delete gameInProgress[from][auteurMessage];
    }
  }
);