const { zokou } = require('../framework/zokou');

let gameInProgress = {};
let sessionStats = {};
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Nouveaux jeux ajoutés
const newGames = {
  BINGO: {
    name: "🎱 Bingo",
    min: 500,
    description: "Trouvez les numéros gagnants !"
  },
  HORSES: {
    name: "🐎 Courses",
    min: 1500,
    description: "Pariez sur le cheval gagnant"
  },
  POKER: {
    name: "🃏 Poker",
    min: 2000,
    description: "Main contre le croupier"
  }
};

// Amélioration des provocations
const provocations = [
  "Le croupier rigole doucement...",
  "Même ton ombre te fuit aujourd'hui!",
  "Le jackpot t'a vu... et il a fui!",
  "Si perdre était un art, tu serais maître!",
  "Tes jetons ont disparu dans l'oubli numérique!",
  "La chance ? Elle t'a ghosté, frère!",
  "Le destin n'aime pas les faibles mises!",
  "T'as perdu si vite que le croupier est choqué!",
  "À ce rythme, tu deviens actionnaire du casino!"
];

// Nouveaux effets visuels
const slotSymbols = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠', '⚡', '🌈'];
const horseNames = ["Éclair", "Tonnerre", "Tempête", "Foudre", "Vent"];
const bingoCards = ["B5", "I18", "N42", "G60", "O75"];

zokou({ nomCom: 'recu', reaction: '🧾', categorie: 'ECONOMY' }, async (origineMessage, zk, commandeOptions) => {
  // ... (le code existant reste inchangé)
});

zokou({ nomCom: 'casino', reaction: '🎰', categorie: 'ECONOMY' }, async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage, arg, from } = commandeOptions;

  if (!arg[0]) {
    return repondre(
      "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
      "*🎰 CASINO SRPN PREMIUM 🎰*\n\n" +
      "*Jeux Disponibles :*\n\n" +
      "1. *roulette <mise>* - 🎡 Roulette premium\n" +
      "2. *des <mise>* - 🎲 Dé contre le croupier\n" +
      "3. *slot <mise>* - 🎰 Machine à sous DELUXE\n" +
      "4. *bingo <mise>* - " + newGames.BINGO.name + "\n" +
      "5. *courses <mise>* - " + newGames.HORSES.name + "\n" +
      "6. *poker <mise>* - " + newGames.POKER.name +
      "\n\n💡 *Tips :* Mise min. variable selon les jeux" +
      "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
    );
  }

  // ... (code existant pour la gestion des sessions)

  try {
    switch (game.toLowerCase()) {
      case 'roulette': 
        // Amélioration de la roulette
        const rouletteOptions = ["Rouge", "Noir", "Pair", "Impair", "1-18", "19-36"];
        const selectedOption = rouletteOptions[Math.floor(Math.random() * rouletteOptions.length)];
        
        // Nouveaux multiplicateurs
        if (Math.random() < 0.01) {
          gain = mise * 50;
          resultat = '🎯 *JACKPOT 50x !*';
        } else if (Math.random() < 0.05) {
          gain = mise * 10;
          resultat = '🔥 *Mise ×10*';
        } 
        // ... (autres cas)

        break;

      case 'bingo':
        if (mise < newGames.BINGO.min) {
          return repondre(`*Mise minimale pour le Bingo : ${newGames.BINGO.min}🧭*`);
        }

        await wait(2500);
        const playerNumbers = [
          `B${Math.floor(Math.random()*15)+1}`,
          `I${Math.floor(Math.random()*15)+16}`,
          `N${Math.floor(Math.random()*15)+31}`,
          `G${Math.floor(Math.random()*15)+46}`,
          `O${Math.floor(Math.random()*15)+61}`
        ];

        const matches = playerNumbers.filter(num => bingoCards.includes(num)).length;
        
        if (matches === 5) {
          gain = mise * 20;
          resultat = '🎯 *BINGO COMPLET ! x20*';
        } else if (matches >= 3) {
          gain = mise * (matches);
          resultat = `✨ ${matches} numéros gagnants ! x${matches}`;
        } else {
          resultat = '❌ *Aucun match*';
        }

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n${newGames.BINGO.name}\n` +
          `🔢 *Vos numéros :* ${playerNumbers.join(' ')}\n` +
          `🏆 *Numéros gagnants :* ${bingoCards.join(' ')}\n\n` +
          `🧮 *RÉSULTAT :* ${resultat}\n` +
          (gain > 0 
            ? `*🎉 Vous gagnez ${gain} !*`
            : `*😢 Perdu... ${randomProvocation()}*`) +
          "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
        );
        break;

      case 'courses':
        if (mise < newGames.HORSES.min) {
          return repondre(`*Mise minimale pour les courses : ${newGames.HORSES.min}🧭*`);
        }

        await wait(3000);
        const horses = [...horseNames];
        let raceResult = "";
        
        // Animation de course
        for (let i = 0; i < 5; i++) {
          raceResult = horses.map((h, idx) => 
            `${h} ${'▬'.repeat(i === idx ? 8 : Math.floor(Math.random()*5))}${i === idx ? '🐎' : ''}`
          ).join('\n');
          
          repondre(
            `🐎 *DÉPART !*\n\n${raceResult}\n\n` +
            `⏳ *Course en cours...*`
          );
          await wait(1500);
        }

        const winner = horses[Math.floor(Math.random() * horses.length)];
        const selectedHorse = horses[Math.floor(Math.random() * horses.length)];
        
        if (selectedHorse === winner) {
          gain = mise * 4;
          resultat = `🏆 *Vainqueur : ${winner}*`;
        } else {
          resultat = `💨 *Perdant : ${selectedHorse}* | *Vainqueur : ${winner}*`;
        }

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n${newGames.HORSES.name}\n` +
          `🐎 *Votre cheval : ${selectedHorse}*\n\n` +
          `🧮 *RÉSULTAT :* ${resultat}\n` +
          (gain > 0 
            ? `*🎉 Vous gagnez ${gain} !*` 
            : `*💔 Perdu... ${randomProvocation()}*`) +
          "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
        );
        break;

      case 'poker':
        if (mise < newGames.POKER.min) {
          return repondre(`*Mise minimale pour le Poker : ${newGames.POKER.min}🧭*`);
        }

        await wait(2000);
        const pokerHands = [
          { name: "Paire", value: 2, multiplier: 2 },
          { name: "Double Paire", value: 3, multiplier: 3 },
          { name: "Brelan", value: 4, multiplier: 5 },
          { name: "Quinte", value: 8, multiplier: 10 },
          { name: "Couleur", value: 12, multiplier: 15 },
          { name: "Full", value: 16, multiplier: 25 },
          { name: "Carre", value: 20, multiplier: 50 },
          { name: "Quinte Flush", value: 100, multiplier: 100 }
        ];

        const playerHand = pokerHands[Math.floor(Math.random() * 5)];
        const dealerHand = pokerHands[Math.floor(Math.random() * 7)];

        if (playerHand.value > dealerHand.value) {
          gain = mise * playerHand.multiplier;
          resultat = `🃏 *${playerHand.name}* vs ${dealerHand.name}`;
        } else {
          resultat = `💀 ${playerHand.name} vs *${dealerHand.name}*`;
        }

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n${newGames.POKER.name}\n` +
          `👤 *Votre main : ${playerHand.name}*\n` +
          `🎩 *Croupier : ${dealerHand.name}*\n\n` +
          `🧮 *RÉSULTAT :* ${resultat}\n` +
          (gain > 0 
            ? `*💰 Vous empochez ${gain} !*` 
            : `*☠️ Défaite... ${randomProvocation()}*`) +
          "\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔"
        );
        break;

      // ... (les autres jeux existants)
    }
  } catch (err) {
    console.error('Erreur casino :', err);
    repondre("*❌ Échec du jeu - réessayez plus tard*");
  } finally {
    delete gameInProgress[from][auteurMessage];
  }
});

// ... (fonctions utilitaires existantes)

// Nouveau système de bonus
function applyBonuses(stats) {
  let bonus = 0;
  if (stats.nbJeux > 20) bonus += 500;
  if (stats.nbVictoires > 10) bonus += 1000;
  if (stats.totalMise > 50000) bonus += 2000;
  return bonus;
}

// Amélioration du reçu
function genererRecuCasino(stats, fin) {
  const bonus = applyBonuses(stats);
  const totalWithBonus = stats.totalGain + bonus;
  
  return (
    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n" +
    "*💎 RÉCAPITULATIF CASINO 💎*\n\n" +
    `⭐ *Joueur :* ${stats.joueur}\n` +
    `⏱️ *Durée :* ${((fin - stats.debut)/60000).toFixed(1)} min\n` +
    `🎮 *Parties :* ${stats.nbJeux} | ✅ ${stats.nbVictoires} | ❌ ${stats.nbDefaites}\n` +
    `💰 *Misé :* ${stats.totalMise} tokens\n` +
    `🏆 *Gagné :* ${stats.totalGain} tokens\n` +
    `🎁 *Bonus :* +${bonus} tokens\n` +
    `💸 *Total :* ${totalWithBonus} tokens\n` +
    "▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n" +
    (bonus > 0 ? "*🎉 Bonus offert pour votre fidélité !*\n" : "") +
    "*Merci de votre visite au Casino SRPN !*"
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