const { zokou } = require('../framework/zokou');

// Configuration des JIDs autorisés (remplacez par vos IDs de groupe)
/*const authorizedJIDs = [
  '1234567890@g.us', // ID du groupe 1
  '0987654321@g.us'  // ID du groupe 2
];*/

let gameInProgress = {}; // Objet pour suivre les jeux en cours par JID

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg, from } = commandeOptions;

    // Vérification si la commande est exécutée dans un JID autorisé
    /*if (!authorizedJIDs.includes(from)) {
      return repondre("🚫 Cette commande n'est pas autorisée dans cette discussion.");
    }*/

    // Vérification si un jeu est déjà en cours pour cet utilisateur dans ce JID
    if (gameInProgress[from] && gameInProgress[from][auteurMessage]) {
      return repondre("⏳ Vous avez déjà un jeu en cours. Veuillez le terminer avant d'en lancer un autre.");
    }

    const game = arg[0]; // Le type de jeu à lancer
    const mise = parseInt(arg[1]); // La mise du joueur

    if (!game) {
      return repondre("*🎰 Bienvenue au Mini-Casino SRPN !*\nVoici les jeux disponibles :\n\n1. `casino roulette <mise>` - Roulette\n2. `casino des <mise>` - Lance les dés contre le croupier\n3. `casino slot <mise>` - Machine à sous");
    }

    if (isNaN(mise) || mise <= 0) {
      return repondre("💰 Veuillez spécifier une mise valide (un nombre supérieur à 0).");
    }

    // Initialisation de l'état du jeu pour cet utilisateur dans ce JID
    if (!gameInProgress[from]) {
      gameInProgress[from] = {};
    }
    gameInProgress[from][auteurMessage] = true;

    try {
      switch (game.toLowerCase()) {
        case 'roulette':
          const rouletteResult = Math.random(); // Génère un nombre aléatoire entre 0 et 1
          let gain = 0;
          let resultatRoulette = '';

          if (rouletteResult < 0.3) { // 30% de chance de gagner 1000 gemmes
            gain = mise + 1000;
            resultatRoulette = '1000💎 gemmes';
          } else if (rouletteResult < 0.6) { // 30% de chance de gagner 10000 tokens
            gain = mise + 10000;
            resultatRoulette = '10000🧭 tokens';
          } else { // 40% de chance de perdre
            gain = 0;
            resultatRoulette = '0 (Perdu)';
          }

          // Simuler un délai pour plus de suspense
          await new Promise(resolve => setTimeout(resolve, 2000));

          repondre(`
🎰 Roulette Résultat : ${resultatRoulette}
${gain > mise ? `🎉 Vous avez gagné ${gain} !` : 'Dommage, vous avez perdu votre mise.'}`);
          break;

        case 'des':
          const joueurDe = Math.floor(Math.random() * 6) + 1;
          const croupierDe = Math.floor(Math.random() * 6) + 1;

          // Simuler un délai pour plus de suspense
          await new Promise(resolve => setTimeout(resolve, 2000));

          if (joueurDe > croupierDe) {
            repondre(`🎲 Votre dé : ${joueurDe}, Dé du croupier : ${croupierDe}\n🎉 Vous avez gagné ${mise * 2} !`);
          } else if (joueurDe === croupierDe) {
            repondre(`🎲 Votre dé : ${joueurDe}, Dé du croupier : ${croupierDe}\n🤝 Égalité ! Vous récupérez votre mise.`);
          } else {
            repondre(`🎲 Votre dé : ${joueurDe}, Dé du croupier : ${croupierDe}\n😞 Vous avez perdu votre mise.`);
          }
          break;

        case 'slot':
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `${r1} | ${r2} | ${r3}`;
          let winMessage = 'Pas de chance cette fois...';

          // Simuler un délai pour plus de suspense
          await new Promise(resolve => setTimeout(resolve, 2000));

          if (r1 === r2 && r2 === r3) {
            winMessage = '✨ JACKPOT ! Vous gagnez ' + (mise * 5) + ' !';
          } else if (r1 === r2 || r2 === r3 ||

r1 === r3) {
            winMessage = '💰 Presque ! Vous gagnez ' + (mise * 2) + ' !';
          }

          repondre(`🎰 Résultat : ${result}\n${winMessage}`);
          break;

        default:
          repondre('Jeu non reconnu. Utilisez roulette, des ou slot.');
      }
    } finally {
      // Libérer le jeu en cours, que le joueur gagne ou perde
      delete gameInProgress[from][auteurMessage];
    }
  }
);