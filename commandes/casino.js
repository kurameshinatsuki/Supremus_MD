/*const { zokou } = require('../framework/zokou');

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
);*/

const { zokou } = require('../framework/zokou');

let gameInProgress = {};
let sessionStats = {}; // Pour suivre les stats de chaque joueur

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const provocations = [
  "> Le croupier rigole doucement...",
  "> Encore raté ! La chance n'est pas avec toi.",
  "> Les dés t’ont trahi aujourd’hui.",
  "> Va prier Dame Fortune.",
  "> Ce n’est clairement pas ton jour.",
  "> Même les slots se moquent de toi."
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
        "1. *casino roulette <mise>* - 🎯 Roulette\n" +
        "2. *casino des <mise>* - 🎲 Dé contre le croupier\n" +
        "3. *casino slot <mise>* - 🎰 Machine à sous" +
        "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
      );
    }

    if (isNaN(mise) || mise < 1000) {
      return repondre("💰 Mise invalide. Minimum requis : 1000🧭.");
    }

    gameInProgress[from] = gameInProgress[from] || {};
    gameInProgress[from][auteurMessage] = true;

    // Init stats si pas encore
    const joueurId = `${from}_${auteurMessage}`;
    if (!sessionStats[joueurId]) {
      sessionStats[joueurId] = {
        joueur: auteurMessage,
        debut: new Date(),
        nbJeux: 0,
        nbVictoires: 0,
        nbDefaites: 0,
        totalMise: 0,
        totalGain: 0
      };
    }

    const stats = sessionStats[joueurId];
    stats.nbJeux++;
    stats.totalMise += mise;

    try {
      switch (game.toLowerCase()) {
        case 'roulette': {
          const rouletteResult = Math.random();
          let gain = 0;
          let resultat = '';

          if (rouletteResult < 0.05) {
            gain = mise * 10;
            resultat = '🎯 *Mise ×10*';
            stats.nbVictoires++;
          } else if (rouletteResult < 0.15) {
            gain = mise * 5;
            resultat = '🎯 *Mise ×5*';
            stats.nbVictoires++;
          } else {
            resultat = '❌ *0 (Perdu)*';
            stats.nbDefaites++;
          }

          stats.totalGain += gain;
          await wait(2000);

          const message = gain > 0
            ? `*🎉 Vous avez gagné ${gain} !*`
            : `*🥲 Dommage, vous avez perdu votre mise.*\n${randomProvocation()}`;

          repondre(
            "🎰 *Jeu : ROULETTE*\n" +
            `🎯 *Résultat :* ${resultat}\n\n${message}\n\n` +
            genererRecuCasino(stats, new Date())
          );
          break;
        }

        case 'des': {
          const joueurDe = lancerDe();
          const croupierDe = lancerDe();
          let gain = 0;
          let message = '';

          await wait(2000);

          if (joueurDe > croupierDe) {
            gain = mise * 2;
            message = `*🎉 Victoire ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else if (joueurDe === croupierDe) {
            gain = Math.floor(mise / 2);
            message = `*🤝 Égalité ! Vous récupérez ${gain}.*`;
          } else {
            message = `*💀 Défaite. Mise perdue.*\n${randomProvocation()}`;
            stats.nbDefaites++;
          }

          stats.totalGain += gain;

          repondre(
            "🎰 *Jeu : DÉS*\n" +
            `🎲 *Votre dé :* ${joueurDe} vs *Croupier :* ${croupierDe}\n\n${message}\n\n` +
            genererRecuCasino(stats, new Date())
          );
          break;
        }

        case 'slot': {
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `*${r1} | ${r2} | ${r3}*`;

          let gain = 0;
          let message = '*Pas de chance cette fois...*';

          await wait(2000);

          if (r1 === r2 && r2 === r3) {
            gain = mise * 6;
            message = `*🎉 JACKPOT ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            gain = mise * 2;
            message = `*✨ Deux alignés ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else {
            message += `\n${randomProvocation()}`;
            stats.nbDefaites++;
          }

          stats.totalGain += gain;

          repondre(
            "🎰 *Jeu : MACHINE À SOUS*\n" +
            `🎰 *Résultat :* ${result}\n\n${message}\n\n` +
            genererRecuCasino(stats, new Date())
          );
          break;
        }

        default:
          repondre("🎮 *Jeu inconnu.* Utilisez `roulette`, `des` ou `slot`.");
      }
    } catch (err) {
      console.error('Erreur dans le casino :', err);
      repondre("❌ Une erreur s'est produite pendant le jeu.");
    } finally {
      delete gameInProgress[from][auteurMessage];
    }
  }
);

// 📦 Fonctions utilitaires
function lancerDe() {
  return Math.floor(Math.random() * 6) + 1;
}

function randomProvocation() {
  return provocations[Math.floor(Math.random() * provocations.length)];
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR');
}

function formatHeure(date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// 🧾 Générateur de reçu Casino
function genererRecuCasino(stats, fin) {
  const bilan = stats.totalGain - stats.totalMise;
  const bilanTexte = bilan >= 0
    ? `➕ *+${bilan} tokens*`
    : `➖ *${Math.abs(bilan)} tokens*`;

  const commentaire =
    bilan > 0
      ? "🎉 Quelle session ! Tu ressors gagnant du casino !"
      : bilan < 0
        ? "😓 La chance t’a fui… mais tu reviendras plus fort !"
        : "😐 Tu repars sans gain ni perte.";

  return (
    "📄 *Reçu Transact - Casino*\n" +
    `👤 *Joueur :* ${stats.joueur}\n` +
    `📆 *Date :* ${formatDate(stats.debut)}\n` +
    `🕰️ *Début :* ${formatHeure(stats.debut)} | *Fin :* ${formatHeure(fin)}\n` +
    `🎮 *Jeux :* ${stats.nbJeux} | ✅ ${stats.nbVictoires} | ❌ ${stats.nbDefaites}\n` +
    `💰 *Total misé :* ${stats.totalMise} tokens\n` +
    `🏆 *Total gagné :* ${stats.totalGain} tokens\n` +
    `📊 *Bilan :* ${bilanTexte}\n` +
    `💬 ${commentaire}`
  );
}