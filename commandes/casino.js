const { zokou } = require('../framework/zokou');
const axios = require('axios');

let gameInProgress = {};
let sessionStats = {};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const provocations = [
  "> 😏 Le croupier rigole doucement...",
  "> 🎯 Encore raté ! La chance n'est pas avec toi.",
  "> 🎲 Les dés t'ont trahi aujourd'hui.",
  "> 🙏 Va prier Dame Fortune.",
  "> 🌧️ Ce n'est clairement pas ton jour.",
  "> 😂 Même les slots se moquent de toi.",
  "> 🧿 Les dieux du jeu t'ont tourné le dos.",
  "> 👻 Une malédiction pèse sur tes jetons.",
  "> 💸 Le destin n'aime pas les faibles mises.",
  "> 💀 Tu viens de nourrir le casino. Merci !",
  "> 🪙 Tes jetons ont disparu dans l'oubli.",
  "> 🏃 Même ton ombre te fuit aujourd'hui.",
  "> 📉 Encore un échec légendaire à ton actif.",
  "> 😶‍🌫️ La chance ? Elle t'a ghosté, frère.",
  "> 🤡 Tu joues... mais le destin rit de toi.",
  "> 🕊️ Un pigeon de plus dans la volière du casino.",
  "> 👀 Le croupier t'observe... et compatit (un peu).",
  "> 🏦 À ce rythme, tu deviens actionnaire du casino.",
  "> 🪞 Ton karma est aussi vide que ton portefeuille.",
  "> 🔮 Il faudrait un exorcisme à ta chance.",
  "> 🚪 Le jackpot t'a vu... et il a fui.",
  "> 😵‍💫 T'as perdu si vite que même le croupier est choqué.",
  "> 🧠 La maison gagne toujours. Et toi ? Jamais.",
  "> 🎭 Un vrai talent pour perdre sans classe.",
  "> 🌀 Tu mises, tu pries, tu perds. Cycle complet.",
  "> 🛌 C'est beau de rêver... mais pas ici.",
  "> 🧊 Tu viens de financer la clim du casino. Merci !",
  "> 🎨 Si perdre était un art, tu serais maître.",
  "> ♻️ Allez, encore un essai... pour perdre plus.",
  "> 👻 Même un fantôme aurait plus de chance que toi.",
  "> 💧 Le solde pleure. Et le croupier se marre.",
  "> 🪂 Encore une chute spectaculaire dans le vide.",
  "> 🧲 La poisse t'a mis en favoris, on dirait.",
  "> 😴 Même la roulette s'endort quand tu joues.",
  "> 📜 Le croupier note ta défaite dans le livre des légendes.",
  "> 👏 La banque t'applaudit en coulisse.",
  "> ✨ Tu n'as pas juste perdu. Tu as brillé dans la perte.",
  "> 📚 T'as joué. T'as perdu. T'as appris ?",
  '> 🗣️ Le croupier murmure : *"Next !"*'
];

async function envoyerAvecImage(zk, jid, message, imageUrl = 'https://i.imgur.com/rOWtE9b.png') {
  try {
    const imageBuffer = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;
    await zk.sendMessage(jid, {
      image: imageBuffer,
      caption: message
    });
  } catch {
    await zk.sendMessage(jid, { text: message });
  }
}

zokou(
  {
    nomCom: 'recu',
    reaction: '🎰',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, from } = commandeOptions;
    const joueurId = `${from}_${auteurMessage}`;
    const stats = sessionStats[joueurId];
    if (!stats) {
      return envoyerAvecImage(zk, from, "*_📭 Aucun reçu disponible. Lance une session avec la commande *-casino* !_*");
    }
    const recu = genererRecuCasino(stats, new Date());
    delete sessionStats[joueurId];
    return envoyerAvecImage(zk, from, recu);
  }
);

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, arg, from } = commandeOptions;
    if (gameInProgress[from]?.[auteurMessage]) {
      return envoyerAvecImage(zk, from, "*_⏳ Vous avez déjà un jeu en cours. Veuillez le terminer avant d'en lancer un autre._*");
    }
    const game = arg[0];
    const mise = parseInt(arg[1]);
    if (!game) {
      return envoyerAvecImage(zk, from,
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
        "*🎰 BIENVENUE AU CASINO SRPN !*\n\n" +
        "*Jeux Disponibles :*\n\n" +
        "1. *casino roulette <mise>* - 🎡 Roulette\n" +
        "2. *casino des <mise>* - 🎲 Dé contre le croupier\n" +
        "3. *casino slot <mise>* - 🎰 Machine à sous" +
        "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
      );
    }
    if (isNaN(mise) || mise < 1000) {
      return envoyerAvecImage(zk, from, "*_💰 Mise invalide. Minimum requis :_* 1000🧭.");
    }
    gameInProgress[from] = gameInProgress[from] || {};
    gameInProgress[from][auteurMessage] = true;
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
          } else if (rouletteResult < 0.30) {
            gain = mise * 2;
            resultat = '🎯 *Mise ×2*';
            stats.nbVictoires++;
          } else {
            resultat = '❌ *0 (Perdu)*';
            stats.nbDefaites++;
          }
          stats.totalGain += gain;
          await wait(2000);
          const message = gain > 0
            ? `*🎉 Félicitations, vous avez gagné ${gain} !*`
            : `*🥲 Dommage, vous avez perdu votre mise.*\n${randomProvocation()}`;
          return envoyerAvecImage(zk, from,
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎡 *JEU : Roulette*\n" +
            `🧮 *RÉSULTAT :* ${resultat}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
          );
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
            gain = Math.floor(mise);
            message = `*🤝 Égalité ! Vous récupérez ${gain}.*`;
          } else {
            message = `*💀 Défaite. Mise perdue.*\n${randomProvocation()}`;
            stats.nbDefaites++;
          }
          stats.totalGain += gain;
          return envoyerAvecImage(zk, from,
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎲 *JEU : Dés*\n" +
            `🎲 *Votre dé :* ${joueurDe} 🆚 *Croupier :* ${croupierDe}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
          );
        }
        case 'slot': {
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `*| ${r1} | ${r2} | ${r3} |*`;
          let gain = 0;
          let message = '*Pas de chance cette fois...*';
          await wait(2000);
          if (r1 === r2 && r2 === r3) {
            gain = mise * 10;
            message = `*🎉 JACKPOT ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            gain = mise * 5;
            message = `*✨ Deux alignés ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else {
            message += `\n${randomProvocation()}`;
            stats.nbDefaites++;
          }
          stats.totalGain += gain;
          return envoyerAvecImage(zk, from,
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎰 *JEU : Machine À Sous*\n" +
            `🧮 *RÉSULTAT :* ${result}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
          );
        }
        default:
          return envoyerAvecImage(zk, from, "🎮 *_Jeu inconnu.* Utilisez `roulette`, `des` ou `slot`._");
      }
    } catch {
      return envoyerAvecImage(zk, from, "*_❌ Une erreur s'est produite pendant le jeu._*");
    } finally {
      delete gameInProgress[from][auteurMessage];
    }
  }
);

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

function genererRecuCasino(stats, fin) {
  const bilan = stats.totalGain - stats.totalMise;
  const bilanTexte = bilan >= 0 ? `🔺 *+${bilan}🧭*` : `🔻 *${Math.abs(bilan)}🧭*`;
  const commentaire = bilan > 0
    ? "🎉 Quelle session ! Tu ressors gagnant du casino !"
    : bilan < 0
      ? "😓 La chance t’a fui… mais tu reviendras plus fort !"
      : "🙃 Tu repars sans gain ni perte.";
  return (
    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🪀 *Reçu Transact — Casino* 🪀\n" +
    `👤 *Joueur :* ${stats.joueur}\n` +
    `📆 *Date :* ${formatDate(stats.debut)}\n` +
    `🕰️ *Début :* ${formatHeure(stats.debut)} | *Fin :* ${formatHeure(fin)}\n` +
    `🎮 *Jeux :* ${stats.nbJeux} | ✅ ${stats.nbVictoires} | ❌ ${stats.nbDefaites}\n` +
    `💰 *Total misé :* ${stats.totalMise} tokens\n` +
    `🏆 *Total gagné :* ${stats.totalGain} tokens\n` +
    `📊 *Bilan :* ${bilanTexte}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n` +
    `*_💬${commentaire}_*`
  );
}
 


/*const { zokou } = require('../framework/zokou');

let gameInProgress = {};
let sessionStats = {}; // Pour suivre les stats de chaque joueur

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const provocations = [
  "> Le croupier rigole doucement...",
  "> Encore raté ! La chance n'est pas avec toi.",
  "> Les dés t’ont trahi aujourd’hui.",
  "> Va prier Dame Fortune.",
  "> Ce n’est clairement pas ton jour.",
  "> Même les slots se moquent de toi.",
  "> Les dieux du jeu t’ont tourné le dos.",
  "> Une malédiction pèse sur tes jetons.",
  "> Le destin n’aime pas les faibles mises.",
  "> Tu viens de nourrir le casino. Merci !",
  "> Tes jetons ont disparu dans l'oubli.",
  "> Même ton ombre te fuit aujourd'hui.",
  "> Encore un échec légendaire à ton actif.",
  "> La chance ? Elle t’a ghosté, frère.",
  "> Tu joues... mais le destin rit de toi.",
  "> Un pigeon de plus dans la volière du casino.",
  "> Le croupier t’observe... et compatit (un peu).",
  "> À ce rythme, tu deviens actionnaire du casino.",
  "> Ton karma est aussi vide que ton portefeuille.",
  "> Il faudrait un exorcisme à ta chance.",
  "> Le jackpot t’a vu... et il a fui.",
  "> T’as perdu si vite que même le croupier est choqué.",
  "> La maison gagne toujours. Et toi ? Jamais.",
  "> Un vrai talent pour perdre sans classe.",
  "> Tu mises, tu pries, tu perds. Cycle complet.",
  "> C’est beau de rêver... mais pas ici.",
  "> Tu viens de financer la clim du casino. Merci !",
  "> Si perdre était un art, tu serais maître.",
  "> Allez, encore un essai... pour perdre plus.",
  "> Même un fantôme aurait plus de chance que toi.",
  "> Le solde pleure. Et le croupier se marre.",
  "> Encore une chute spectaculaire dans le vide.",
  "> La poisse t’a mis en favoris, on dirait.",
  "> Même la roulette s'endort quand tu joues.",
  "> Le croupier note ta défaite dans le livre des légendes.",
  "> La banque t’applaudit en coulisse.",
  "> Tu n’as pas juste perdu. Tu as brillé dans la perte.",
  "> T'as joué. T'as perdu. T'as appris ?",
  "> Le croupier murmure : *“Next !”*"
];

zokou(
  {
    nomCom: 'recu',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, from } = commandeOptions;
    const joueurId = `${from}_${auteurMessage}`;
    const stats = sessionStats[joueurId];

    if (!stats) {
      return repondre("*_📭 Aucun reçu disponible. Lance une session avec la commande *-casino* !_*");
    }

    const recu = genererRecuCasino(stats, new Date());
    delete sessionStats[joueurId]; // Réinitialisation après affichage

    return repondre(recu);
  }
);

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg, from } = commandeOptions;

    if (gameInProgress[from]?.[auteurMessage]) {
      return repondre("*_⏳ Vous avez déjà un jeu en cours. Veuillez le terminer avant d'en lancer un autre._*");
    }

    const game = arg[0];
    const mise = parseInt(arg[1]);

    if (!game) {
      return repondre(
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
        "*🎰 BIENVENUE AU CASINO SRPN !*\n\n" +
        "*Jeux Disponibles :*\n\n" +
        "1. *casino roulette <mise>* - 🎡 Roulette\n" +
        "2. *casino des <mise>* - 🎲 Dé contre le croupier\n" +
        "3. *casino slot <mise>* - 🎰 Machine à sous" +
        "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
      );
    }

    if (isNaN(mise) || mise < 1000) {
      return repondre("*_💰 Mise invalide. Minimum requis :_* 1000🧭.");
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
} else if (rouletteResult < 0.30) {
  gain = mise * 2;
  resultat = '🎯 *Mise ×2*';
  stats.nbVictoires++;
} else {
  resultat = '❌ *0 (Perdu)*';
  stats.nbDefaites++;
}

          stats.totalGain += gain;
          await wait(2000);

          const message = gain > 0
            ? `*🎉 Félicitations, vous avez gagné ${gain} !*`
            : `*🥲 Dommage, vous avez perdu votre mise.*\n${randomProvocation()}`;

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎡 *JEU : Roulette*\n" +
            `🧮 *RÉSULTAT :* ${resultat}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔` 
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
            gain = Math.floor(mise);
            message = `*🤝 Égalité ! Vous récupérez ${gain}.*`;
          } else {
            message = `*💀 Défaite. Mise perdue.*\n${randomProvocation()}`;
            stats.nbDefaites++;
          }

          stats.totalGain += gain;

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎲 *JEU : Dés*\n" +
            `🎲 *Votre dé :* ${joueurDe} 🆚 *Croupier :* ${croupierDe}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
          );
          break;
        }

        case 'slot': {
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `*| ${r1} | ${r2} | ${r3} |*`;

          let gain = 0;
          let message = '*Pas de chance cette fois...*';

          await wait(2000);

          if (r1 === r2 && r2 === r3) {
            gain = mise * 10;
            message = `*🎉 JACKPOT ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            gain = mise * 5;
            message = `*✨ Deux alignés ! Vous gagnez ${gain} !*`;
            stats.nbVictoires++;
          } else {
            message += `\n${randomProvocation()}`;
            stats.nbDefaites++;
          }

          stats.totalGain += gain;

          repondre(
            "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🎰 *JEU : Machine À Sous*\n" +
            `🧮 *RÉSULTAT :* ${result}\n\n${message}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
          );
          break;
        }

        default:
          repondre("🎮 *_Jeu inconnu.* Utilisez `roulette`, `des` ou `slot`._");
      }
    } catch (err) {
      console.error('Erreur dans le casino :', err);
      repondre("*_❌ Une erreur s'est produite pendant le jeu._*");
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
    ? `🔺 *+${bilan}🧭*`
    : `🔻 *${Math.abs(bilan)}🧭*`;

  const commentaire =
    bilan > 0
      ? "🎉 Quelle session ! Tu ressors gagnant du casino !"
      : bilan < 0
        ? "😓 La chance t’a fui… mais tu reviendras plus fort !"
        : "🙃 Tu repars sans gain ni perte.";

  return (
    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n🪀 *Reçu Transact — Casino* 🪀\n" +
    `👤 *Joueur :* ${stats.joueur}\n` +
    `📆 *Date :* ${formatDate(stats.debut)}\n` +
    `🕰️ *Début :* ${formatHeure(stats.debut)} | *Fin :* ${formatHeure(fin)}\n` +
    `🎮 *Jeux :* ${stats.nbJeux} | ✅ ${stats.nbVictoires} | ❌ ${stats.nbDefaites}\n` +
    `💰 *Total misé :* ${stats.totalMise} tokens\n` +
    `🏆 *Total gagné :* ${stats.totalGain} tokens\n` +
    `📊 *Bilan :* ${bilanTexte}\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n` +
    `*_💬${commentaire}_*`
  );
}*/