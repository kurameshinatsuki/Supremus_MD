/* casino_monitor_interactive.js Version réécrite : Casino interactif + système de monitoring
Utilise la capacité du bot à éditer ses propres messages pour rendre les parties immersives
Bingo : le joueur peut choisir ses numéros (ou demander une sélection aléatoire)
Commandes incluses : monitor, stopmonitor, monitorstatus, monitorlogs, casino, recu
Remarque : adapté à ton framework zokou et à l'API zk.sendMessage(origineMessage, { text, edit }). */

const { zokou } = require("../framework/zokou");
const axios = require("axios");

// -----------------------------
// Utilitaires généraux
// -----------------------------
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const logEvent = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// -----------------------------
// Monitoring (repris et légèrement amélioré)
// -----------------------------
let monitoringTasks = {};

const createMonitor = async (origineMessage, zk, url, intervalMinutes) => {
  const id = url;

  monitoringTasks[id] = {
    active: true,
    url,
    interval: null,
    intervalMinutes,
    checkCount: 0,
    lastMessage: null,
    logs: []
  };

  const initialMessage = await zk.sendMessage(origineMessage, {
    text: `🌐 *Surveillance démarrée* 🌐\n━━━━━━━━━━━━━━━\n🔗 URL: ${url}\n⏱ Intervalle: ${intervalMinutes} min\n📊 Vérifications: 0\n🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}\n━━━━━━━━━━━━━━━`
  });

  monitoringTasks[id].lastMessage = initialMessage.key;
  logEvent(`Surveillance démarrée sur ${url} toutes les ${intervalMinutes} minutes`);

  const checkWebsite = async () => {
    if (!monitoringTasks[id] || !monitoringTasks[id].active) return;

    try {
      monitoringTasks[id].checkCount++;
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      const statusText = `#${monitoringTasks[id].checkCount} | ✅ *OK*\n📡 Code: ${response.status}\n⚡ Temps: ${responseTime}ms\n🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}`;
      
      monitoringTasks[id].logs.push({
        time: new Date(),
        success: true,
        status: response.status,
        responseTime
      });
      
      await zk.sendMessage(origineMessage, {
        text: statusText,
        edit: monitoringTasks[id].lastMessage
      });
      
      logEvent(`Check #${monitoringTasks[id].checkCount} OK pour ${url} - ${response.status} en ${responseTime}ms`);
    } catch (error) {
      monitoringTasks[id].checkCount++;
      const errorText = `#${monitoringTasks[id].checkCount} | ❌ *Erreur*\n📡 Code: ${error.code || error.message}\n🕒 Prochain: ${new Date(Date.now() + intervalMinutes * 60000).toLocaleTimeString()}`;
      
      monitoringTasks[id].logs.push({
        time: new Date(),
        success: false,
        error: error.code || error.message
      });
      
      await zk.sendMessage(origineMessage, {
        text: errorText,
        edit: monitoringTasks[id].lastMessage
      });
      
      logEvent(`Erreur check #${monitoringTasks[id].checkCount} pour ${url} - ${error.code || error.message}`);
    }
  };

  await checkWebsite();
  monitoringTasks[id].interval = setInterval(checkWebsite, intervalMinutes * 60000);
};

zokou({
  nomCom: "monitor",
  categorie: "MON-BOT",
  reaction: "🌐",
  description: "Surveille une URL web"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0]?.match(/https?:\/\/[^ \s]+/)?.toString();
  const intervalMinutes = parseInt(arg[1]) || 5;

  if (!url) return repondre("❌ URL manquante !\nUsage : -monitor [url] [intervalle-en-min]\nExemple : -monitor https://monbot.com 10");
  if (intervalMinutes < 1 || intervalMinutes > 1440) return repondre("❌ Intervalle invalide (1-1440 minutes)");
  if (monitoringTasks[url]) return repondre("❌ Cette URL est déjà surveillée !");

  await createMonitor(origineMessage, zk, url, intervalMinutes);
  repondre(`✅ Surveillance activée pour ${url} (toutes les ${intervalMinutes} minutes)`);
});

zokou({
  nomCom: "stopmonitor",
  categorie: "MON-BOT",
  reaction: "🛑",
  description: "Arrête la surveillance d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];

  if (!url || !monitoringTasks[url]) return repondre("❌ Aucune surveillance active pour cette URL !");

  clearInterval(monitoringTasks[url].interval);

  const finalText = `🛑 *Surveillance arrêtée* 🛑\n━━━━━━━━━━━━━━━\n🔗 URL: ${monitoringTasks[url].url}\n📊 Vérifications: ${monitoringTasks[url].checkCount}\n🕒 Fin: ${new Date().toLocaleTimeString()}\n━━━━━━━━━━━━━━━`;

  await zk.sendMessage(origineMessage, {
    text: finalText,
    edit: monitoringTasks[url].lastMessage
  });

  delete monitoringTasks[url];
  logEvent(`Surveillance arrêtée pour ${url}`);
});

zokou({
  nomCom: "monitorstatus",
  categorie: "MON-BOT",
  reaction: "ℹ️",
  description: "Affiche le statut de la surveillance d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];
  if (!url || !monitoringTasks[url]) return repondre("❌ Aucune surveillance active pour cette URL !");

  const task = monitoringTasks[url];
  const statusText = `🌐 *Surveillance active* 🌐\n━━━━━━━━━━━━━━━\n🔗 URL: ${task.url}\n⏱ Intervalle: ${task.intervalMinutes} min\n📊 Vérifications: ${task.checkCount}\n🕒 Prochain: ${new Date(Date.now() + task.intervalMinutes * 60000).toLocaleTimeString()}\n━━━━━━━━━━━━━━━`;
  
  repondre(statusText);
});

zokou({
  nomCom: "monitorlogs",
  categorie: "MON-BOT",
  reaction: "📜",
  description: "Affiche les derniers logs d'une URL"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  const url = arg[0];

  if (!url || !monitoringTasks[url]) return repondre("❌ Aucune surveillance active pour cette URL !");

  const logs = monitoringTasks[url].logs.slice(-5).map((log, i) => `${i + 1}. ${log.success ? "✅" : "❌"} | ${log.status || log.error} | ${log.responseTime || "-"}ms | ${log.time.toLocaleTimeString()}`).join("\n");

  repondre(`📜 *Derniers logs* 📜\n━━━━━━━━━━━━━━━\n${logs}\n━━━━━━━━━━━━━━━`);
});

// -----------------------------
// Casino interactif
// -----------------------------
const GAMES_CONFIG = {
  ROULETTE: {
    name: "🎡 ROULETTE 🎡",
    min: 1000,
    aliases: ['roulette', 'roul']
  },
  DICE: {
    name: "🎲 DICE 🎲",
    min: 1000,
    aliases: ['des', 'dice', 'dé']
  },
  SLOTS: {
    name: "🎰 MACHINE A SOUS 🎰",
    min: 1000,
    aliases: ['slot', 'slots', 'machine']
  },
  BINGO: {
    name: "🎱 BINGO/LOTO 🎱",
    min: 1000,
    aliases: ['bingo', 'loto']
  },
  BLACKJACK: {
    name: "🃏 BLACKJACK 🃏",
    min: 1000,
    aliases: ['blackjack', 'bj', '21']
  },
  POKER: {
    name: "♠️ POKER DICE ♠️",
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
${Object.values(GAMES_CONFIG).map(game => `› ${game.name} (${game.aliases[0]})\n 💰 Mise min: ${game.min}🧭`).join('\n\n')}

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`.trim();
}

function genererRecuCasino(stats, fin) {
  const duration = ((fin - stats.debut) / 60000).toFixed(1);
  const bilan = stats.totalGain - stats.totalMise;
  const ratioVictoire = stats.nbJeux > 0 ? ((stats.nbVictoires / stats.nbJeux) * 100).toFixed(1) : 0;

  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
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
      text: `⏳ *${gameConfig.name}* en cours...\nPréparation...`
    });
    const lastMsg = initial.key;

    switch (gameConfig.name) {
      // ---------------- Roulette (animation simple) ----------------
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
      
      // ---------------- Slots (animation rouleaux) ----------------
      case GAMES_CONFIG.SLOTS.name: {
        let r1 = '▫️', r2 = '▫️', r3 = '▫️';
        
        await zk.sendMessage(origineMessage, {
          text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |`,
          edit: lastMsg
        });
        
        for (let i = 0; i < 5; i++) {
          r1 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
          await zk.sendMessage(origineMessage, {
            text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |`,
            edit: lastMsg
          });
          await wait(300 + Math.random() * 200);
          
          r2 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
          await zk.sendMessage(origineMessage, {
            text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |`,
            edit: lastMsg
          });
          await wait(300 + Math.random() * 200);
          
          r3 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
          await zk.sendMessage(origineMessage, {
            text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |`,
            edit: lastMsg
          });
          await wait(300 + Math.random() * 200);
        }
        
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
          text: `🎰 *MACHINE A SOUS*\n| ${r1} | ${r2} | ${r3} |\n${gain>0? `*GAGNÉ ${gain}🧭*\n${randomEncouragement()}`: randomProvocation()}`,
          edit: lastMsg
        });
        break;
      }
      
      // ---------------- Bingo (interactif, choix des numéros possible) ----------------
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
        
        // Tirage : on tire 10 numéros uniques entre 1 et 75
        const draw = [];
        while (draw.length < 10) {
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
          gain = mise * 50;
          stats.nbVictoires++;
        } else if (matches === 4) {
          gain = mise * 15;
          stats.nbVictoires++;
        } else if (matches === 3) {
          gain = mise * 5;
          stats.nbVictoires++;
        } else if (matches === 2) {
          gain = mise * 2;
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
      
      // ---------------- Blackjack (interaction simplifiée - choix tirer/rester) ----------------
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

  repondre("❌ Action inconnue. Utilisez tirer ou rester.");
});

// -----------------------------
// FIN
// -----------------------------
logEvent('Module Casino & Monitor chargé.');