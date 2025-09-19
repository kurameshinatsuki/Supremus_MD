// -----------------------------
// Casino interactif - CORRIGÉ
// -----------------------------

const { zokou } = require("../framework/zokou");

const GAMES_CONFIG = {
  ROULETTE: {
    name: "  🎡 *ROULETTE* 🎡",
    min: 1000,
    aliases: ['roulette', 'roul']
  },
  DICE: {
    name: "     🎲 *DICE* 🎲",
    min: 1000,
    aliases: ['des', 'dice', 'dé']
  },
  SLOTS: {
    name: "🎰 *MACHINE A SOUS* 🎰",
    min: 1000,
    aliases: ['slot', 'slots', 'machine']
  },
  BINGO: {
    name: "   🎱 *BINGO/LOTO* 🎱",
    min: 1000,
    aliases: ['bingo', 'loto']
  },
  BLACKJACK: {
    name: "    🃏 *BLACKJACK* 🃏",
    min: 1000,
    aliases: ['blackjack', 'bj', '21']
  },
  POKER: {
    name: "    ♠️ *POKER DICE* ♠️",
    min: 5000,
    aliases: ['poker', 'poker-dice']
  }
};

const slotSymbols = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏'];
const provocations = [
  "> Le croupier ricane... 😏",
  "> Encore raté. 🎯",
  "> Va prier Fortune. 🙏",
  "> Pas ton jour. 🌧️",
  "> Les dieux t'ont lâché. 🧿",
];
const encouragements = [
  "> La chance est avec toi 🎉",
  "> Tu es en feu 🔥",
  "> Maître du hasard 🎲",
  "> Victoire ! 🥂",
];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomProvocation() {
  return provocations[Math.floor(Math.random() * provocations.length)];
}

function randomEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

function getGameByAlias(alias) {
  return Object.values(GAMES_CONFIG).find(g => g.aliases.includes(alias.toLowerCase()));
}

// sessions de casino par joueur (pour interactions multi-étapes)
let casinoSessions = {};

// historique session pour la commande recu
let sessionStats = {};

function buildCasinoMenu() {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*🎰 CASINO SRPN : JEUX 🎰*

*Commandes :*
› casino <jeu> <mise> [args]
› recu (pour voir vos stats)

*Jeux disponibles :*
${Object.values(GAMES_CONFIG).map(game => `› ${game.name} (${game.aliases[0]})\n 💰 *Mise min:* ${game.min}🧭`).join('\n\n')}

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`.trim();
}

function genererRecuCasino(stats, fin) {
  const duration = ((fin - stats.debut) / 60000).toFixed(1);
  const bilan = stats.totalGain - stats.totalMise;
  const ratioVictoire = stats.nbJeux > 0 ? ((stats.nbVictoires / stats.nbJeux) * 100).toFixed(1) : 0;

  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
     *🧾 REÇU DE CASINO*

👤 *Joueur :* ${stats.joueur}
⏱️ *Durée :* ${duration} min
🎮 *Parties :* ${stats.nbJeux}
✅ *Victoires :* ${stats.nbVictoires} (${ratioVictoire}%)
❌ *Défaites :* ${stats.nbDefaites}
💰 *Total misé :* ${stats.totalMise}🧭
🏆 *Total gagné :* ${stats.totalGain}🧭
💸 *Bilan :* ${bilan >= 0 ? `+${bilan}` : bilan}🧭

${bilan > 0 ? '🎉 Bravo ! Vous repartez gagnant !' : bilan < 0 ? '💪 La prochaine sera la bonne !' : '🤝 Équilibre parfait !'}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`.trim();
}

// -----------------------------
// Commandes casino
// -----------------------------
zokou({
  nomCom: 'recu',
  reaction: '🧾',
  categorie: 'TRANSACT'
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage, from } = commandeOptions;
  const joueurId = `${from}_${auteurMessage}`;

  if (!sessionStats[joueurId]) return repondre("📭 Aucun reçu disponible. Jouez d'abord avec la commande -casino !");

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

  if (!arg[0]) return repondre(buildCasinoMenu());

  const gameAlias = arg[0].toLowerCase();
  const gameConfig = getGameByAlias(gameAlias);

  if (!gameConfig) return repondre(`*_Jeu inconnu : ${gameAlias}_*`);

  const mise = parseInt(arg[1]);
  if (isNaN(mise) || mise < gameConfig.min) return repondre(`*_💰 Minimum pour_* ${gameConfig.name} : *_${gameConfig.min}🧭_*`);

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
    // Envoie message initial et stocke le message pour édition
    const initial = await zk.sendMessage(origineMessage, {
      text: `⏳ ${gameConfig.name} en cours...`
    });
    const lastMsg = initial.key;

    switch (gameConfig.name) {

      // ----------- Roulette (animation simple) -----------
      case GAMES_CONFIG.ROULETTE.name: {
        await zk.sendMessage(origineMessage, {
          text: `🎡 La roue tourne...`,
          edit: lastMsg
        });
        await wait(700);
        
        await zk.sendMessage(origineMessage, {
          text: `🎡 La roue tourne... 🎯`,
          edit: lastMsg
        });
        await wait(800);
        
        const r = Math.random();
        let gain = 0;
        let resultat = 'Perdu';
        
        if (r < 0.005) {
          gain = mise * 30;
          resultat = 'JACKPOT 30x';
        } else if (r < 0.03) {
          gain = mise * 3;
          resultat = 'Mise ×3';
        } else if (r < 0.15) {
          gain = mise * 2;
          resultat = 'Mise ×2';
        }
        
        stats.totalGain += gain;
        if (gain > 0) stats.nbVictoires++;
        else stats.nbDefaites++;
        
        await zk.sendMessage(origineMessage, {
          text: `🎡 *ROULETTE*\n💰 Mise: ${mise}🧭\n🧮 Résultat: ${resultat}\n${gain>0? `🎉 Vous gagnez ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`,
          edit: lastMsg
        });
        break;
      }
      
      // ---------------- Dice ----------------
      case GAMES_CONFIG.DICE.name: {
        await zk.sendMessage(origineMessage, {
          text: `🎲 Lancer des dés...`,
          edit: lastMsg
        });
        await wait(600);
        
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
        
        await zk.sendMessage(origineMessage, {
          text: `🎲 *DICE*\nVous: ${joueurDe} 🆚 Croupier: ${croupierDe}\n${gain>0? `🎉 Vous gagnez ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`,
          edit: lastMsg
        });
        break;
      }
      
      // ----------- Slots (correction de l'animation) -----------
      case GAMES_CONFIG.SLOTS.name: {
        let r1 = '▫️', r2 = '▫️', r3 = '▫️';
        
        // Message initial
        await zk.sendMessage(origineMessage, {
          text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |\n⏳ Les rouleaux tournent...`,
          edit: lastMsg
        });
        
        // Animation simplifiée et plus fiable
        const spinReel = async (reelIndex) => {
          for (let i = 0; i < 4; i++) {
            const tempSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            if (reelIndex === 0) r1 = tempSymbol;
            if (reelIndex === 1) r2 = tempSymbol;
            if (reelIndex === 2) r3 = tempSymbol;
            
            await zk.sendMessage(origineMessage, {
              text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |\n⏳ Les rouleaux tournent...`,
              edit: lastMsg
            });
            await wait(300);
          }
        };
        
        // Animation séquentielle pour éviter les conflits
        await spinReel(0);
        await spinReel(1);
        await spinReel(2);
        
        // Résultat final
        let gain = 0;
        if (r1 === r2 && r2 === r3) {
          if (r1 === '💎') gain = mise * 50;
          else if (r1 === '🃏') gain = mise * 25;
          else gain = mise * 10;
          stats.nbVictoires++;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          gain = mise * 2;
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }
        
        stats.totalGain += gain;
        
        await zk.sendMessage(origineMessage, {
          text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |\n${gain>0? `🎉 GAGNÉ ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`,
          edit: lastMsg
        });
        break;
      }
      
      // ----------- Bingo (augmentation des chances) -----------
      case GAMES_CONFIG.BINGO.name: {
        // Syntaxe attendue: -casino bingo <mise> n1 n2 n3 n4 n5
        // ou: -casino bingo <mise> auto
        const rawNums = arg.slice(2); // après jeu et mise
        let playerNumbers = [];
        
        if (rawNums.length === 1 && rawNums[0] && rawNums[0].toLowerCase() === 'auto') {
          // Génère 5 numéros aléatoires entre 1 et 75 (format B-I-N-G-O mais on garde 1-75)
          while (playerNumbers.length < 5) {
            const n = Math.floor(Math.random() * 75) + 1;
            if (!playerNumbers.includes(n)) playerNumbers.push(n);
          }
        } else if (rawNums.length >= 5) {
          // Parse et prend les 5 premiers valides
          for (let i = 0; i < rawNums.length && playerNumbers.length < 5; i++) {
            const v = parseInt(rawNums[i]);
            if (!isNaN(v) && v >= 1 && v <= 75 && !playerNumbers.includes(v)) playerNumbers.push(v);
          }
          
          // Si pas 5 valides, compléte aléatoirement
          while (playerNumbers.length < 5) {
            const n = Math.floor(Math.random() * 75) + 1;
            if (!playerNumbers.includes(n)) playerNumbers.push(n);
          }
        } else {
          // Pas assez d'arguments -> message d'aide
          await zk.sendMessage(origineMessage, {
            text: `🎱 *BINGO*\nUsage : -casino bingo <mise> <n1> <n2> <n3> <n4> <n5>\nOu : -casino bingo <mise> auto`,
            edit: lastMsg
          });
          return;
        }
        
        // Envoie carte initiale
        const cardText = `🎱 *BINGO*\nVos numéros: ${playerNumbers.join(', ')}\nTirage en cours...`;
        await zk.sendMessage(origineMessage, {
          text: cardText,
          edit: lastMsg
        });
        
        // Tirage : on tire 20 numéros uniques entre 1 et 75 (augmenté de 10 à 20)
        const draw = [];
        while (draw.length < 20) {
          const n = Math.floor(Math.random() * 75) + 1;
          if (!draw.includes(n)) draw.push(n);
        }
        
        // Animation : révéler les numéros un par un
        for (let i = 0; i < draw.length; i++) {
          await wait(700 + Math.random() * 300);
          await zk.sendMessage(origineMessage, {
            text: `🎱 *BINGO*\nVos numéros: ${playerNumbers.join(', ')}\nTirage: ${draw.slice(0, i + 1).join(', ')}`,
            edit: lastMsg
          });
        }
        
        const matches = playerNumbers.filter(n => draw.includes(n)).length;
        let gain = 0;
        
        if (matches === 5) {
          gain = mise * 30;  // Réduit de 50 à 30
          stats.nbVictoires++;
        } else if (matches === 4) {
          gain = mise * 10;  // Réduit de 15 à 10
          stats.nbVictoires++;
        } else if (matches === 3) {
          gain = mise * 5;
          stats.nbVictoires++;
        } else if (matches === 2) {
          gain = mise * 2;
          stats.nbVictoires++;
        } else if (matches === 1) {
          gain = Math.floor(mise * 0.5);  // NOUVEAU: gain même avec 1 match
          stats.nbVictoires++;
        } else {
          stats.nbDefaites++;
        }
        
        stats.totalGain += gain;
        
        const resultText = `🎱 *BINGO - Résultat*\nVos numéros: ${playerNumbers.join(', ')}\nTirage final: ${draw.join(', ')}\nMatches: ${matches}\n${gain>0? `🎉 Vous gagnez ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`;
        
        await zk.sendMessage(origineMessage, {
          text: resultText,
          edit: lastMsg
        });
        break;
      }
      
      // ---------------- Blackjack ----------------
      case GAMES_CONFIG.BLACKJACK.name: {
        // Création d'une session interactive pour le joueur
        casinoSessions[joueurId] = {
          type: 'BLACKJACK',
          mise,
          lastMsg,
          playerCards: [],
          dealerCards: [],
          finished: false
        };
        
        const drawCard = () => Math.floor(Math.random() * 11) + 1; // 1-11
        
        // Distribution initiale
        casinoSessions[joueurId].playerCards.push(drawCard(), drawCard());
        casinoSessions[joueurId].dealerCards.push(drawCard(), drawCard());
        
        const calcTotal = cards => cards.reduce((a, b) => a + b, 0);
        
        // Envoie état initial
        await zk.sendMessage(origineMessage, {
          text: `🃏 *BLACKJACK*\nVos cartes: ${casinoSessions[joueurId].playerCards.join(' + ')} = ${calcTotal(casinoSessions[joueurId].playerCards)}\nCroupier: ${casinoSessions[joueurId].dealerCards[0]} + ?\n\nRépondez par *tirer* ou *rester* pour continuer.`,
          edit: lastMsg
        });
        
        // On attend que l'utilisateur envoie une commande 'tirer' ou 'rester'
        await wait(10); // pas bloquant
        break;
      }
      
      // ---------------- Poker (simple) ----------------
      case GAMES_CONFIG.POKER.name: {
        // On simule une main rapide
        const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        const suits = ['♥','♦','♣','♠'];
        const hand = [];
        
        for (let i=0;i<5;i++) hand.push(values[Math.floor(Math.random()*values.length)]+suits[Math.floor(Math.random()*suits.length)]);
        
        // Evaluation simplifiée
        const combos = [
          {name:"CINQ D'AS",mult:20,prob:0.01},
          {name:"CARRÉ",mult:10,prob:0.03},
          {name:"FULL",mult:7,prob:0.06},
          {name:"SUITE",mult:5,prob:0.1},
          {name:"BRELAN",mult:3,prob:0.15},
          {name:"DOUBLE PAIRE",mult:2,prob:0.25}
        ];
        
        const found = combos.find(c=>Math.random()<c.prob) || {name:'RIEN',mult:0};
        const gain = mise * found.mult;
        
        if (gain>0) {
          stats.nbVictoires++;
          stats.totalGain+=gain;
        } else {
          stats.nbDefaites++;
        }
        
        await zk.sendMessage(origineMessage, {
          text: `♠️ *POKER DICE*\nMain: ${hand.join(' ')}\nCombinaison: ${found.name}\n${gain>0? `💰 Vous gagnez ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`,
          edit: lastMsg
        });
        break;
      }
    }
  } catch (err) {
    console.error('Erreur casino :', err);
    repondre("❌ Erreur pendant le jeu - réessayez");
  }
});

// ---------------- Commande pour continuer une session interactive (ex: BJ tirer/rester) ----------------
zokou({
  nomCom: 'casino-bj',
  reaction: '🃏',
  categorie: 'TRANSACT',
  description: 'Continuer une session blackjack: -casino-bj tirer|rester'
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage, arg, from } = commandeOptions;
  const joueurId = `${from}_${auteurMessage}`;
  const session = casinoSessions[joueurId];
  
  if (!session || session.type !== 'BLACKJACK') return repondre("❌ Aucune session Blackjack en cours. Démarrez avec -casino blackjack <mise>");

  const action = (arg[0] || '').toLowerCase();
  const drawCard = () => Math.floor(Math.random() * 11) + 1;
  const calcTotal = cards => cards.reduce((a,b)=>a+b,0);

  if (action === 'tirer') {
    session.playerCards.push(drawCard());
    const total = calcTotal(session.playerCards);
    
    if (total > 21) {
      session.finished = true;
      sessionStats[`${from}_${auteurMessage}`].nbDefaites++;
      
      await zk.sendMessage(origineMessage, {
        text: `🃏 *BLACKJACK*\nVos cartes: ${session.playerCards.join(' + ')} = ${total}\n\n*VOUS BRÛLEZ !* 🔥\n${randomProvocation()}`,
        edit: session.lastMsg
      });
      
      delete casinoSessions[joueurId];
      return;
    }
    
    await zk.sendMessage(origineMessage, {
      text: `🃏 *BLACKJACK*\nVos cartes: ${session.playerCards.join(' + ')} = ${total}\nCroupier: ${session.dealerCards[0]} + ?\n\nRépondez par *tirer* ou *rester*.`,
      edit: session.lastMsg
    });
    
    return;
  }

  if (action === 'rester') {
    // Le croupier joue
    let dealerTotal = calcTotal(session.dealerCards);
    while (dealerTotal < 17) {
      session.dealerCards.push(drawCard());
      dealerTotal = calcTotal(session.dealerCards);
    }

    const playerTotal = calcTotal(session.playerCards);
    let gain = 0;
    let resultText = '';
    
    if (playerTotal === 21 && session.playerCards.length === 2) {
      gain = session.mise * 3;
      resultText = '*BLACKJACK NATUREL !*';
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
      gain = session.mise * 2;
      resultText = '🎉 *VOUS GAGNEZ !*';
    } else if (playerTotal === dealerTotal) {
      gain = session.mise;
      resultText = '*ÉGALITÉ !* 🤝';
    } else {
      resultText = '*CROUPIER GAGNE* ❌';
    }
    
    const stats = sessionStats[`${from}_${auteurMessage}`];
    if (gain>0) {
      stats.nbVictoires++;
      stats.totalGain += gain;
    } else {
      stats.nbDefaites++;
    }
    
    await zk.sendMessage(origineMessage, {
      text: `🃏 *BLACKJACK - Résultat*\nVos cartes: ${session.playerCards.join(' + ')} = ${playerTotal}\nCroupier: ${session.dealerCards.join(' + ')} = ${dealerTotal}\n\n${resultText}\n${gain>0? `💰 Vous gagnez ${gain}🧭 !\n${randomEncouragement()}`: randomProvocation()}`,
      edit: session.lastMsg
    });
    
    delete casinoSessions[joueurId];
    return;
  }

  repondre("❌ Action inconnue. Utilisez -casino-bj tirer ou rester.");
});