const { zokou } = require('../framework/zokou');

let gameInProgress = {}; // Pour suivre les jeux en cours

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg, from } = commandeOptions;

    // Gestion du jeu en cours
    if (gameInProgress[from] && gameInProgress[from][auteurMessage]) {
      return repondre("⏳ Vous avez déjà un jeu en cours. Veuillez le terminer avant d'en lancer un autre.");
    }

    const game = arg[0]; // roulette / des / slot
    const mise = parseInt(arg[1]);

    if (!game) {
      const imageUrl = "https://i.ibb.co/dsLs6wn4/image.jpg"; // Image de bienvenue avec instructions
      const messageIntro = `🎰 *Bienvenue au Mini-Casino SRPN !*\n\nVoici les jeux disponibles :\n\n1. *casino roulette <mise>* - Roulette\n2. *casino des <mise>* - Lance les dés contre le croupier\n3. *casino slot <mise>* - Machine à sous`;
      try {
        await zk.sendMessage(from, {
          image: { url: imageUrl },
          caption: messageIntro
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi du message d'intro :", error);
        return repondre("❌ Erreur lors de l'affichage du menu.");
      }
      return;
    }

    if (isNaN(mise) || mise <= 0) {
      return repondre("💰 Veuillez spécifier une mise valide (une somme égale ou supérieur à 1000🧭).\n*Ex:* -casino <jeu> <mise>");
    }

    // Init de la session
    if (!gameInProgress[from]) {
      gameInProgress[from] = {};
    }
    gameInProgress[from][auteurMessage] = true;

    try {
      switch (game.toLowerCase()) {
        case 'roulette': {
          const imageRoulette = "https://i.ibb.co/dsLs6wn4/image.jpg"; // Image pour la roulette
          const rouletteResult = Math.random();
          let gain = 0;
          let resultatRoulette = '';

          if (rouletteResult < 0.2) {
            gain = mise + 2000;
            resultatRoulette = '2000🧭';
          } else if (rouletteResult < 0.4) {
            gain = mise + 5000;
            resultatRoulette = '5000🧭';
          } else {
            gain = 0;
            resultatRoulette = '0';
          }

          await new Promise(resolve => setTimeout(resolve, 2000));

          const message = `🎰 *Roulette Résultat* : ${resultatRoulette}\n${gain > mise ? `🎉 Vous avez gagné *${gain}* !` : '😢 Dommage, vous avez perdu votre mise.'}`;

          try {
            await zk.sendMessage(from, {
              image: { url: imageRoulette },
              caption: message
            });
          } catch (error) {
            console.error("Erreur lors de l'envoi du message de roulette :", error);
            repondre("❌ Erreur lors de l'affichage du résultat de la roulette.");
          }
          break;
        }

        case 'des': {
          const imageDes = "https://i.ibb.co/dsLs6wn4/image.jpg"; // Image pour les dés
          const joueurDe = Math.floor(Math.random() * 6) + 1;
          const croupierDe = Math.floor(Math.random() * 6) + 1;

          await new Promise(resolve => setTimeout(resolve, 2000));

          let message = `🎲 *Votre dé* : ${joueurDe}\n🎲 *Dé du croupier* : ${croupierDe}\n`;

          if (joueurDe > croupierDe) {
            message += `🎉 Vous avez gagné *${mise * 2}*!`;
          } else if (joueurDe === croupierDe) {
            message += `🤝 Égalité ! Vous récupérez votre mise.`;
          } else {
            message += `😞 Vous avez perdu votre mise.`;
          }

          try {
            await zk.sendMessage(from, {
              image: { url: imageDes },
              caption: message
            });
          } catch (error) {
            console.error("Erreur lors de l'envoi du message des dés :", error);
            repondre("❌ Erreur lors de l'affichage du résultat des dés.");
          }
          break;
        }

        case 'slot': {
          const imageSlot = "https://i.ibb.co/dsLs6wn4/image.jpg"; // Image pour les slots
          const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '💎', '🃏', '🧸', '💠'];
          const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
          const r1 = spin(), r2 = spin(), r3 = spin();
          const result = `${r1} | ${r2} | ${r3}`;
          let winMessage = 'Pas de chance cette fois...';

          await new Promise(resolve => setTimeout(resolve, 2000));

          if (r1 === r2 && r2 === r3) {
            winMessage = `🎊 *JACKPOT !* Vous gagnez *${mise * 5}* !`;
          } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            winMessage = `😉 Presque ! Vous gagnez *${mise * 2}* !`;
          }

          const message = `🎰 *Résultat* : ${result}\n\n${winMessage}`;

          try {
            await zk.sendMessage(from, {
              image: { url: imageSlot },
              caption: message
            });
          } catch (error) {
            console.error("Erreur lors de l'envoi du message du slot :", error);
            repondre("❌ Erreur lors de l'affichage du résultat du slot.");
          }
          break;
        }

        default:
          repondre('🎮 Jeu non reconnu. Utilisez *roulette*, *des* ou *slot*.');
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution du jeu :", error);
      repondre("❌ Une erreur est survenue lors du jeu.");
    } finally {
      // Fin du jeu
      delete gameInProgress[from][auteurMessage];
    }
  }
);