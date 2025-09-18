const { zokou } = require('../framework/zokou');

// Gestion de la session de jeu
let sessionStats = {};
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration des jeux avec nouveaux jeux
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
    name: "🎱 BINGO/LOTO",
    min: 500,
    description: "Trouvez les numéros gagnants !",
    aliases: ['bingo', 'loto']
  },
  BLACKJACK: {
    name: "🃏 BLACKJACK",
    min: 1500,
    description: "Approchez-vous du 21 sans le dépasser",
    aliases: ['blackjack', 'bj', '21']
  },
  POKER: {
    name: "♠️ POKER DICE",
    min: 2500,
    description: "Formez la meilleure combinaison",
    aliases: ['poker', 'poker-dice']
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

const encouragements = [
  "> *🎉 Incroyable ! La chance te sourit aujourd'hui !*",
  "> *🔥 Tu es en feu ! Continue comme ça !*",
  "> *💰 Le casino pleure, toi tu ris !*",
  "> *👑 Roi/Reine du casino !*",
  "> *✨ Les dieux du jeu sont avec toi !*",
  "> *🚀 Rien ne peut t'arrêter !*",
  "> *💎 Main de diamant !*",
  "> *🎯 Tir parfait !*",

  // Nouveaux encouragements variés
  "> *⚡ Ton énergie électrise la table !*",
  "> *🌟 Tu brilles plus fort que les néons du casino !*",
  "> *🏆 Champion(ne) incontesté(e) !*",
  "> *🤑 Ton portefeuille grossit à vue d’œil !*",
  "> *🥇 Tu joues comme un(e) vétéran(ne) !*",
  "> *🎲 Maître/Maîtresse du hasard !*",
  "> *🍀 Le trèfle à 4 feuilles t’a adopté !*",
  "> *💥 Coup critique magistral !*",
  "> *🎶 Même la musique du casino est ton hymne !*",
  "> *🦾 Tu domines la partie sans pitié !*",
  "> *📈 Tes gains explosent les statistiques !*",
  "> *🥂 Santé à tes victoires !*",
  "> *🌍 Le monde entier t’applaudit !*",
  "> *🔥 La légende du casino, c’est toi !*",
  "> *🎁 Chaque mise devient un cadeau magique !*",
  "> *🧿 Protégé(e) par l’œil du destin !*",
  "> *🌈 Tu transformes la malchance en or !*",
  "> *🔮 Les oracles avaient raison, tu es béni(e) !*",
  "> *🦸 Héros/Héroïne du casino !*",
  "> *🐉 Ta chance rugit plus fort qu’un dragon !*",
  "> *💡 Ton instinct est infaillible !*",
  "> *🎇 Feu d’artifice pour ton succès !*",

  // Humour & Taquinerie
  "> *💀 La banque tremble rien qu’en te voyant !*",
  "> *🤡 Même les clowns du casino applaudissent !*",
  "> *🚑 Appelle un médecin, tu fais des arrêts cardiaques aux croupiers !*",
  "> *📵 Interdit de perdre, ce n’est pas dans ton contrat !*",
  "> *🍔 Tu gagnes plus vite qu’un fast-food sert un menu !*",
  "> *🕶️ Trop stylé(e), même la malchance n’ose pas t’approcher !*",
  "> *🛑 Stop ! Laisse une chance aux autres !*",
  "> *🐒 Tu joues avec la facilité d’un singe qui appuie sur un bouton !*",
  "> *🚨 Le casino appelle la police, tu voles tout !*",
  "> *😂 Tes gains donnent des crises de nerfs aux perdants !*",
  "> *🥵 Tu transpires la victoire !*",
  "> *🧨 Chaque partie avec toi est une explosion !*"
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
    { name: "⚡ CINQ D'AS", multiplier: 20, prob: 0.01 },
    { name: "🎯 CARRÉ", multiplier: 10, prob: 0.03 },
    { name: "🔥 FULL", multiplier: 7, prob: 0.05 },
    { name: "✨ SUITE", multiplier: 5, prob: 0.08 },
    { name: "🎲 BRELAN", multiplier: 3, prob: 0.15 },
    { name: "🤝 DOUBLE PAIRE", multiplier: 2, prob: 0.25 }
  ];
  
  return combinations.find(comb => Math.random() < comb.prob) || { name: "❌ RIEN", multiplier: 0 };
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

        // Rééquilibré pour moins de gains faciles
        if (rouletteResult < 0.005) {
          gain = mise * 30;
          resultat = '🎯 *JACKPOT 30x*';
        } else if (rouletteResult < 0.03) {
          gain = mise * 3;
          resultat = '🔥 *Mise ×3*';
        } else if (rouletteResult < 0.15) {
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `🎰 *Résultat :* | ${r1} | ${r2} | ${r3} |\n\n` +
          (gain > 0 ? 
            (r1 === r2 && r2 === r3 ? `🎰 *JACKPOT ! ${gain}🧭*\n${randomEncouragement()}` : 
             `✨ *2 symboles ! ${gain}🧭*`) : 
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
          `🔢 *Vos numéros :* ${playerNumbers.join(' ')}\n\n` +
          `🏆 *Tirage :* ${currentBingoCard.join(' ')}\n\n` +
          (matches >= 3 ? 
            (matches === 5 ? `🎱 *BINGO COMPLET ! ${gain}🧭*\n${randomEncouragement()}` : 
             matches === 4 ? `✨ 4 NUMÉROS ! ${gain}🧭*` : 
             `🎯 3 NUMÉROS ! ${gain}🧭*`) : 
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
          resultat = '🃏 *BLACKJACK NATUREL !*';
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
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
          `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n     ${gameConfig.name}\n` +
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
*🎰 CASINO SRPN : ULTRA PREMIUM 🎰*

*Commandes :*
› casino <jeu> <mise>
› recu (pour voir vos stats)

*Jeux disponibles :*
${Object.values(GAMES_CONFIG).map(game => 
  `› ${game.name} (${game.aliases[0]})
  ${game.description}
  💰 Mise min: ${game.min}🧭`
).join('\n\n')}

💡 *Nouveautés :* Blackjack 21 et Poker Dice !

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