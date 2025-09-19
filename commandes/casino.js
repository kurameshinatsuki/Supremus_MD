const { zokou } = require('../framework/zokou');

// Gestion de la session de jeu
let sessionStats = {};
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration des jeux
const GAMES_CONFIG = {
  ROULETTE: {
    name: "🎡 *ROULETTE* 🎡",
    min: 1000,
    description: "> Faites tourner la roue de la fortune !",
    aliases: ['roulette', 'roul']
  },
  DICE: {
    name: "🎲 *DICE* 🎲",
    min: 1000,
    description: "> Affrontez le croupier aux dés",
    aliases: ['des', 'dice', 'dé']
  },
  SLOTS: {
    name: "🎰 *MACHINE A SOUS* 🎰",
    min: 1000,
    description: "> Tentez le jackpot !",
    aliases: ['slot', 'slots', 'machine']
  },
  BINGO: {
    name: "🎱 *BINGO/LOTO* 🎱",
    min: 1000,
    description: "> Trouvez les numéros gagnants !",
    aliases: ['bingo', 'loto']
  },
  BLACKJACK: {
    name: "🃏 *BLACKJACK* 🃏",
    min: 1000,
    description: "> Approchez-vous du 21 sans le dépasser",
    aliases: ['blackjack', 'bj', '21']
  },
  POKER: {
    name: "♠️ *POKER DICE* ♠️",
    min: 5000,
    description: "> Formez la meilleure combinaison",
    aliases: ['poker', 'poker-dice']
  }
};

const provocations = [
  "> *Le croupier ricane...* 😏",
  "> *Encore raté.* 🎯",
  "> *Les dés t'ont trahi.* 🎲",
  "> *Va prier Fortune.* 🙏",
  "> *Pas ton jour.* 🌧️",
  "> *Même les slots se moquent.* 😂",
  "> *Les dieux t'ont lâché.* 🧿",
  "> *Tes jetons sont maudits.* 👻",
  "> *Mises trop faibles.* 💸",
  "> *Tu nourris le casino.* 💀",
  "> *Tes jetons s'évaporent.* 🪙",
  "> *Même ton ombre te fuit.* 🏃",
  "> *Échec légendaire.* 📉",
  "> *La chance t'a ghosté.* 😶‍🌫️",
  "> *Le destin se fout de toi.* 🤡",
  "> *Un pigeon de plus.* 🕊️",
  "> *Le croupier compatit.* 👀",
  "> *Tu finances le casino.* 🏦",
  "> *Ton karma est vide.* 🪞",
  "> *Un exorcisme te sauverait.* 🔮",
  "> *Le jackpot a fui.* 🚪",
  "> *Même le croupier choque.* 😵‍💫",
  "> *La maison gagne, pas toi.* 🧠",
  "> *Perdre sans classe.* 🎭",
  "> *Cycle : miser, prier, perdre.* 🌀",
  "> *Tu rêves trop.* 🛌",
  "> *Tu payes la clim.* 🧊",
  "> *Perdre est ton art.* 🎨",
  "> *Encore un essai perdu.* ♻️",
  "> *Un fantôme ferait mieux.* 👻",
  "> *Ton solde pleure.* 💧",
  "> *Encore une chute.* 🪂",
  "> *La poisse t'adore.* 🧲",
  "> *Même la roulette s'endort.* 😴",
  "> *Ta défaite est notée.* 📜",
  "> *La banque applaudit.* 👏",
  "> *Tu brilles dans la perte.* ✨",
  "> *T'as joué, t'as perdu.* 📚",
  '> *"Next !"* 🗣️'
];

const encouragements = [
  "> *La chance est avec toi* 🎉",
  "> *Tu es en feu* 🔥",
  "> *Le casino pleure* 💰",
  "> *Roi/Reine du jeu* 👑",
  "> *Les dieux te soutiennent* ✨",
  "> *Rien ne t’arrête* 🚀",
  "> *Main de diamant* 💎",
  "> *Tir parfait* 🎯",
  "> *Énergie électrisante* ⚡",
  "> *Tu brilles fort* 🌟",
  "> *Champion(ne) !* 🏆",
  "> *Ton portefeuille explose* 🤑",
  "> *Style vétéran* 🥇",
  "> *Maître du hasard* 🎲",
  "> *Adopté par la chance* 🍀",
  "> *Coup critique* 💥",
  "> *Ton hymne résonne* 🎶",
  "> *Tu domines tout* 🦾",
  "> *Stats brisées* 📈",
  "> *Victoire !* 🥂",
  "> *Le monde applaudit* 🌍",
  "> *Légende vivante* 🔥",
  "> *Chaque mise, un cadeau* 🎁",
  "> *Protégé(e) du destin* 🧿",
  "> *Tu changes l’or* 🌈",
  "> *Bénédiction oraculaire* 🔮",
  "> *Héros/Héroïne* 🦸",
  "> *Chance de dragon* 🐉",
  "> *Instinct parfait* 💡",
  "> *Feu d’artifice* 🎇",
  "> *La banque tremble* 💀",
  "> *Les clowns t’applaudissent* 🤡",
  "> *Les croupiers paniquent* 🚑",
  "> *Interdit de perdre* 📵",
  "> *Plus rapide qu’un menu* 🍔",
  "> *Trop stylé(e)* 🕶️",
  "> *Stop, laisse-les jouer* 🛑",
  "> *Tu gagnes easy* 🐒",
  "> *Tu voles le casino* 🚨",
  "> *Les perdants ragent* 😂",
  "> *Victoire en sueur* 🥵",
  "> *Explosion de succès* 🧨"
];

const slotSymbols = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏'];
const bingoCards = generateBingoCard(); // Nouvelle fonction pour générer des cartes aléatoires

// Fonctions pour les nouveaux jeux
function generateBingoCard() {
  return [
    `B${Math.floor(Math.random()*15)+1}`,
    `I${Math.floor(Math.random()*15)+16}`,
    `N${Math.floor(Math.random()*15)+31}`,
    `G${Math.floor(Math.random()*15)+46}`,
    `O${Math.floor(Math.random()*15)+61}`
  ];
}

function generatePokerHand() {
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['♥', '♦', '♣', '♠'];
  const hand = [];
  
  for (let i = 0; i < 5; i++) {
    hand.push(values[Math.floor(Math.random() * values.length)] + suits[Math.floor(Math.random() * suits.length)]);
  }
  return hand;
}

function evaluatePokerHand(hand) {
  // Simplifié pour le jeu de dés
  const combinations = [
    { name: "CINQ D'AS", multiplier: 20, prob: 0.01 },
    { name: "CARRÉ", multiplier: 10, prob: 0.03 },
    { name: "FULL", multiplier: 7, prob: 0.05 },
    { name: "SUITE", multiplier: 5, prob: 0.08 },
    { name: "BRELAN", multiplier: 3, prob: 0.15 },
    { name: "DOUBLE PAIRE", multiplier: 2, prob: 0.25 }
  ];
  
  return combinations.find(comb => Math.random() < comb.prob) || { name: "RIEN", multiplier: 0 };
}

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
    return repondre(`*_Jeu inconnu : ${gameAlias}_*`);
  }

  const mise = parseInt(arg[1]);

  if (isNaN(mise) || mise < gameConfig.min) {
    return repondre(`*_💰 Minimum pour ${gameConfig.name} : ${gameConfig.min}🧭_*`);
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

        // Rééquilibré pour moins de gains faciles
        if (rouletteResult < 0.005) {
          gain = mise * 30;
          resultat = '*JACKPOT 30x*';
        } else if (rouletteResult < 0.03) {
          gain = mise * 3;
          resultat = '*Mise ×3*';
        } else if (rouletteResult < 0.15) {
          gain = mise * 2;
          resultat = '*Mise ×2*';
        } else {
          resultat = '*Perdu*';
        }

        stats.totalGain += gain;
        if (gain > 0) stats.nbVictoires++; else stats.nbDefaites++;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `💰 *Mise :* ${mise}🧭\n` +
          `🧮 *Résultat :* ${resultat}\n\n` +
          (gain > 0 ? `🎉 *Vous gagnez ${gain}🧭 !*\n${randomEncouragement()}` : `${randomProvocation()}`) +
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `🎲 *Vous :* ${joueurDe} 🆚 *Croupier :* ${croupierDe}\n\n` +
          (joueurDe > croupierDe ? `🎉 *Vous gagnez ${gain}🧭 !*\n${randomEncouragement()}` : 
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

        // Probabilités rééquilibrées
        if (r1 === r2 && r2 === r3) {
          if (r1 === '💎') {
            gain = mise * 50; // Jackpot diamant
          } else if (r1 === '🃏') {
            gain = mise * 25; // Jackpot joker
          } else {
            gain = mise * 10;
          }
          stats.nbVictoires++;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          gain = mise * 3;
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `🎰 *Résultat :* | ${r1} | ${r2} | ${r3} |\n\n` +
          (gain > 0 ? 
            (r1 === r2 && r2 === r3 ? `*JACKPOT ! ${gain}🧭*\n${randomEncouragement()}` : 
             `*2 symboles ! ${gain}🧭*`) : 
            `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.BINGO.name: {
        await wait(2500);

        const currentBingoCard = generateBingoCard(); // Carte change à chaque jeu
        const playerNumbers = generateBingoCard();
        
        const matches = playerNumbers.filter(num => currentBingoCard.includes(num)).length;
        let gain = 0;

        // Probabilités rendues plus équitables
        if (matches === 5) {
          gain = mise * 50; // Gros jackpot pour 5/5
          stats.nbVictoires++;
        } else if (matches === 4) {
          gain = mise * 10;
          stats.nbVictoires++;
        } else if (matches === 3) {
          gain = mise * 3;
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `🔢 *Vos numéros :* ${playerNumbers.join(' ')}\n\n` +
          `🏆 *N° de Tirage :* ${currentBingoCard.join(' ')}\n\n` +
          (matches >= 3 ? 
            (matches === 5 ? `BINGO COMPLET ! ${gain}🧭\n${randomEncouragement()}` : 
             matches === 4 ? `4 NUMÉROS ! ${gain}🧭*` : 
             `3 NUMÉROS ! ${gain}🧭`) : 
            `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.BLACKJACK.name: {
        await wait(1800);
        
        // Simulation simplifiée de blackjack
        const playerCards = [Math.floor(Math.random() * 11) + 1, Math.floor(Math.random() * 11) + 1];
        const dealerCards = [Math.floor(Math.random() * 11) + 1, Math.floor(Math.random() * 11) + 1];
        
        const playerTotal = playerCards.reduce((a, b) => a + b, 0);
        const dealerTotal = dealerCards.reduce((a, b) => a + b, 0);
        
        let gain = 0;
        let resultat = '';

        if (playerTotal === 21 && playerCards.length === 2) {
          gain = mise * 3; // Blackjack naturel
          resultat = '🃏*BLACKJACK NATUREL !*';
          stats.nbVictoires++;
        } else if (playerTotal > 21) {
          resultat = '💥 *VOUS BRÛLEZ !*';
          stats.nbDefaites++;
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
          gain = mise * 2;
          resultat = '🎉 *VOUS GAGNEZ !*';
          stats.nbVictoires++;
        } else if (playerTotal === dealerTotal) {
          gain = mise;
          resultat = '🤝 *ÉGALITÉ !*';
        } else {
          resultat = '❌ *CROUPIER GAGNE*';
          stats.nbDefaites++;
        }

        stats.totalGain += gain;

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `🃏 *Vos cartes :* ${playerCards.join(' + ')} = ${playerTotal}\n` +
          `🎭 *Croupier :* ${dealerCards[0]} + ? = ${dealerCards[0]} + ?\n\n` +
          `🧮 *Résultat :* ${resultat}\n\n` +
          (gain > 0 ? `💰 *Vous gagnez ${gain}🧭 !*\n${randomEncouragement()}` : `${randomProvocation()}`) +
          `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
        );
        break;
      }

      case GAMES_CONFIG.POKER.name: {
        await wait(2200);
        
        const hand = generatePokerHand();
        const evaluation = evaluatePokerHand(hand);
        const gain = mise * evaluation.multiplier;

        if (gain > 0) {
          stats.nbVictoires++;
          stats.totalGain += gain;
        } else {
          stats.nbDefaites++;
        }

        repondre(
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n\n` +
          `🃏 *Votre main :* ${hand.join(' ')}\n\n` +
          `📊 *Combinaison :* ${evaluation.name}\n\n` +
          (gain > 0 ? `💰 *Vous gagnez ${gain}🧭 !*\n${randomEncouragement()}` : `${randomProvocation()}`) +
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

function randomEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

function buildCasinoMenu() {
  return `
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
    *🎰 CASINO SRPN : JEUX 🎰*

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
  const ratioVictoire = stats.nbJeux > 0 ? ((stats.nbVictoires / stats.nbJeux) * 100).toFixed(1) : 0;

  return `
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   *🧾 RECAPITULATIF CASINO*

👤 *Joueur :* ${stats.joueur}
⏱️ *Durée :* ${duration} min
🎮 *Parties :* ${stats.nbJeux}
✅ *Victoires :* ${stats.nbVictoires} (${ratioVictoire}%)
❌ *Défaites :* ${stats.nbDefaites}
💰 *Total misé :* ${stats.totalMise}🧭
🏆 *Total gagné :* ${stats.totalGain}🧭
💸 *Bilan :* ${bilan >= 0 ? `+${bilan}` : bilan}🧭

${bilan > 0 ? '🎉 Bravo ! Vous repartez gagnant !' : bilan < 0 ? '💪 La prochaine sera la bonne !' : '🤝 Équilibre parfait !'}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
`.trim();
}