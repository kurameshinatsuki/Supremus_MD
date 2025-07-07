const { zokou } = require('../framework/zokou');

// Suppression du verrou global des parties
let sessionStats = {};
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration des jeux
const GAMES_CONFIG = {
  ROULETTE: {
    name: "🎡 ROULETTE",
    min: 2000,
    description: "Faites tourner la roue de la fortune !",
    aliases: ['roulette', 'roul']
  },
  DICE: {
    name: "🎲 DICE",
    min: 1000,
    description: "Affrontez le croupier aux dés",
    aliases: ['des', 'dice', 'dé']
  },
  SLOTS: {
    name: "🎰 MACHINE A SOUS",
    min: 1000,
    description: "Tentez le jackpot !",
    aliases: ['slot', 'slots', 'machine']
  },
  BINGO: {
    name: "🎱 Bingo",
    min: 500,
    description: "Trouvez les numéros gagnants !",
    aliases: ['bingo', 'loto']
  }
};

const provocations = [
  "> *😏 Le croupier rigole doucement...*",
  "> *🎯 Encore raté ! La chance n'est pas avec toi.*",
  "> *🎲 Les dés t'ont trahi aujourd'hui.*",
  "> *🙏 Va prier Dame Fortune.*",
  "> *🌧️ Ce n'est clairement pas ton jour.*",
  "> *😂 Même les slots se moquent de toi.*",
  "> *🧿 Les dieux du jeu t'ont tourné le dos.*",
  "> *👻 Une malédiction pèse sur tes jetons.*",
  "> *💸 Le destin n'aime pas les faibles mises.*",
  "> *💀 Tu viens de nourrir le casino. Merci !*",
  "> *🪙 Tes jetons ont disparu dans l'oubli.*",
  "> *🏃 Même ton ombre te fuit aujourd'hui.*",
  "> *📉 Encore un échec légendaire à ton actif.*",
  "> *😶‍🌫️ La chance ? Elle t'a ghosté, frère*.",
  "> *🤡 Tu joues... mais le destin rit de toi.*",
  "> *🕊️ Un pigeon de plus dans la volière du casino.*",
  "> *👀 Le croupier t'observe... et compatit (un peu).*",
  "> *🏦 À ce rythme, tu deviens actionnaire du casino.*",
  "> *🪞 Ton karma est aussi vide que ton portefeuille.*",
  "> *🔮 Il faudrait un exorcisme à ta chance.*",
  "> *🚪 Le jackpot t'a vu... et il a fui.*",
  "> *😵‍💫 T'as perdu si vite que même le croupier est choqué.*",
  "> *🧠 La maison gagne toujours. Et toi ? Jamais.*",
  "> *🎭 Un vrai talent pour perdre sans classe.*",
  "> *🌀 Tu mises, tu pries, tu perds. Cycle complet.*",
  "> *🛌 C'est beau de rêver... mais pas ici.*",
  "> *🧊 Tu viens de financer la clim du casino. Merci !*",
  "> *🎨 Si perdre était un art, tu serais maître.*",
  "> *♻️ Allez, encore un essai... pour perdre plus.*",
  "> *👻 Même un fantôme aurait plus de chance que toi.*",
  "> *💧 Le solde pleure. Et le croupier se marre.*",
  "> *🪂 Encore une chute spectaculaire dans le vide.*",
  "> *🧲 La poisse t'a mis en favoris, on dirait.*",
  "> *😴 Même la roulette s'endort quand tu joues.*",
  "> *📜 Le croupier note ta défaite dans le livre des légendes.*",
  "> *👏 La banque t'applaudit en coulisse.*",
  "> *✨ Tu n'as pas juste perdu. Tu as brillé dans la perte.*",
  "> *📚 T'as joué. T'as perdu. T'as appris ?*",
  '> 🗣️ Le croupier murmure : *"Next !"*'
];


const slotSymbols = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏'];
const bingoCards = ["B5", "I18", "N42", "G60", "O75"];

// Fonction pour trouver un jeu par son alias
function getGameByAlias(alias) {
  return Object.values(GAMES_CONFIG).find(game => 
    game.aliases.includes(alias.toLowerCase())
  );
}

zokou({ 
  nomCom: 'recu', 
  reaction: '🧾', 
  categorie: 'TRANSACT' 
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage, from } = commandeOptions;
  const joueurId = `${from}_${auteurMessage}`;

  if (!sessionStats[joueurId]) {
    return repondre("*_📭 Aucun reçu disponible. Jouez d'abord avec la commande `-casino` !_*");
  }

  const recu = genererRecuCasino(sessionStats[joueurId], new Date());
  delete sessionStats[joueurId];

  return repondre(recu);
});

zokou({ 
  nomCom: 'casino', 
  reaction: '🎰', 
  categorie: 'TRANSACT' 
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage, arg, from } = commandeOptions;

  // Gestion des commandes sans arguments
  if (!arg[0]) {
    return repondre(buildCasinoMenu());
  }

  const gameAlias = arg[0].toLowerCase();
  const gameConfig = getGameByAlias(gameAlias);

  if (!gameConfig) {
    return repondre(`*🚫 Jeu inconnu : ${gameAlias}*\n${buildCasinoMenu()}`);
  }

  const mise = parseInt(arg[1]);

  if (isNaN(mise) || mise < gameConfig.min) {
    return repondre(`*_💰 Mise invalide. Minimum pour ${gameConfig.name} : ${gameConfig.min}🧭_*`);
  }

  // Initialisation des stats
  const joueurId = `${from}_${auteurMessage}`;
  sessionStats[joueurId] = sessionStats[joueurId] || {
    joueur: auteurMessage,
    debut: new Date(),
    nbJeux: 0,
    nbVictoires: 0,
    nbDefaites: 0,
    totalMise: 0,
    totalGain: 0
  };

  const stats = sessionStats[joueurId];
  stats.nbJeux++;
  stats.totalMise += mise;

  try {
    switch (gameConfig.name) {
      case GAMES_CONFIG.ROULETTE.name: {
        await wait(1500);

        const rouletteResult = Math.random();
        let gain = 0;
        let resultat = '';

        if (rouletteResult < 0.02) {
          gain = mise * 15;
          resultat = '🎯 *JACKPOT 15x*';
        } else if (rouletteResult < 0.1) {
          gain = mise * 5;
          resultat = '🔥 *Mise ×5*';
        } else if (rouletteResult < 0.3) {
          gain = mise * 2;
          resultat = '✨ *Mise ×2*';
        } else {
          resultat = '❌ *Perdu*';
        }

        stats.totalGain += gain;
        if (gain > 0) stats.nbVictoires++; else stats.nbDefaites++;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `💰 *Mise :* ${mise}🧭\n` +
          `🧮 *Résultat :* ${resultat}\n\n` +
          (gain > 0 ? `🎉 *Vous gagnez ${gain}🧭 !*` : `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.DICE.name: {
        await wait(1000);

        const joueurDe = Math.floor(Math.random() * 6) + 1;
        const croupierDe = Math.floor(Math.random() * 6) + 1;
        let gain = 0;

        if (joueurDe > croupierDe) {
          gain = mise * 2;
          stats.nbVictoires++;
        } else if (joueurDe === croupierDe) {
          gain = mise;
        } else {
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `🎲 *Vous :* ${joueurDe} 🆚 *Croupier :* ${croupierDe}\n\n` +
          (joueurDe > croupierDe ? `🎉 *Vous gagnez ${gain}🧭 !*` : 
           joueurDe === croupierDe ? `🤝 *Égalité ! Vous récupérez ${gain}🧭.*` : 
           `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.SLOTS.name: {
        await wait(2000);

        const spin = () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        const r1 = spin(), r2 = spin(), r3 = spin();
        let gain = 0;

        if (r1 === r2 && r2 === r3) {
          gain = mise * 10;
          stats.nbVictoires++;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          gain = mise * 3;
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `🎰 *Résultat :* | ${r1} | ${r2} | ${r3} |\n\n` +
          (gain > 0 ? 
            (r1 === r2 && r2 === r3 ? `🎰 *JACKPOT ! ${gain}🧭*` : `✨ *2 symboles ! ${gain}🧭*`) : 
            `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.BINGO.name: {
        await wait(2500);

        const playerNumbers = [
          `B${Math.floor(Math.random()*15)+1}`,
          `I${Math.floor(Math.random()*15)+16}`,
          `N${Math.floor(Math.random()*15)+31}`,
          `G${Math.floor(Math.random()*15)+46}`,
          `O${Math.floor(Math.random()*15)+61}`
        ];

        const matches = playerNumbers.filter(num => bingoCards.includes(num)).length;
        let gain = 0;

        if (matches === 5) {
          gain = mise * 20;
          stats.nbVictoires++;
        } else if (matches >= 3) {
          gain = mise * matches;
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `🔢 *Vos numéros :* ${playerNumbers.join(' ')}\n\n` +
          `🏆 *Tirage :* ${bingoCards.join(' ')}\n\n` +
          (matches >= 3 ? 
            (matches === 5 ? `🎱 *BINGO ! ${gain}🧭*` : `✨ ${matches} matchs ! ${gain}🧭`) : 
            `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }
    }
  } catch (err) {
    console.error('Erreur casino :', err);
    repondre("*❌ Erreur pendant le jeu - réessayez*");
  }
});

// Fonctions utilitaires
function randomProvocation() {
  return provocations[Math.floor(Math.random() * provocations.length)];
}

function buildCasinoMenu() {
  return `
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*🎰 CASINO SRPN : PREMIUM 🎰*

*Commandes :*
› casino <jeu> <mise>
› recu (pour voir vos stats)

*Jeux disponibles :*
${Object.values(GAMES_CONFIG).map(game => 
  `› ${game.name} (${game.aliases[0]})
  ${game.description}
  💰 Mise min: ${game.min}🧭`
).join('\n\n')}

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
`.trim();
}

function genererRecuCasino(stats, fin) {
  const duration = ((fin - stats.debut) / 60000).toFixed(1);
  const bilan = stats.totalGain - stats.totalMise;

  return `
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   *🧾 RECAPITULATIF CASINO*

👤 *Joueur :* ${stats.joueur}
⏱️ *Durée :* ${duration} min
🎮 *Parties :* ${stats.nbJeux}
✅ *Victoires :* ${stats.nbVictoires}
❌ *Défaites :* ${stats.nbDefaites}
💰 *Total misé :* ${stats.totalMise}🧭
🏆 *Total gagné :* ${stats.totalGain}🧭
💸 *Bilan :* ${bilan >= 0 ? `+${bilan}` : bilan}🧭

${bilan > 0 ? '🎉 Bravo ! Vous repartez gagnant !' : '💪 La prochaine sera la bonne !'}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
`.trim();
}