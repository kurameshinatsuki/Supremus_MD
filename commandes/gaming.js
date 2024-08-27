const { zokou } = require('../framework/zokou');

// Fonction utilitaire pour générer des nombres aléatoires uniques
const generateRandomNumbers = (min, max, count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
};

// Fonction utilitaire pour générer des récompenses aléatoires
const generateRewards = () => {
  const rewards = ['10🔷', '50.000 G🧭', '10🎟'];
  return rewards.sort(() => 0.5 - Math.random()).slice(0, 3);
};

// Suivi des parties en cours pour chaque joueur
const ongoingGames = {};

// Fonction du jeu "Devinez le Mot"
const devinezLeMot = async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage } = commandeOptions;

  if (ongoingGames[auteurMessage]) {
    await zk.sendMessage(origineMessage, { text: 'Vous avez déjà une partie en cours.' });
    return;
  }

  let words = ['CODE', 'GAME', 'PLAY', 'TEST', 'WORD', 'CHAT', 'JAVASCRIPT', 'ZOKOU'];
  let wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
  let attempts = 6;
  ongoingGames[auteurMessage] = { wordToGuess, attempts };

  await zk.sendMessage(origineMessage, { text: `Le jeu commence ! Vous avez ${attempts} tentatives pour deviner le mot mystère.` });

  const checkGuess = (guess) => {
    let result = '';
    for (let i = 0; i < wordToGuess.length; i++) {
      if (guess[i] === wordToGuess[i]) {
        result += guess[i];
      } else if (wordToGuess.includes(guess[i])) {
        result += '*';
      } else {
        result += '_';
      }
    }
    return result;
  };

  const getGuess = async () => {
    const rep = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
    let guess;
    try {
      guess = rep.message.extendedTextMessage.text;
    } catch {
      guess = rep.message.conversation;
    }
    return guess.toUpperCase();
  };

  while (ongoingGames[auteurMessage].attempts > 0) {
    let guess = await getGuess();
    let result = checkGuess(guess);

    await zk.sendMessage(origineMessage, { text: result });

    if (result === wordToGuess) {
      await zk.sendMessage(origineMessage, { text: 'Félicitations! Vous avez trouvé le mot.' });
      break;
    } else {
      ongoingGames[auteurMessage].attempts--;
      await zk.sendMessage(origineMessage, { text: `Il vous reste ${ongoingGames[auteurMessage].attempts} tentatives.` });
    }

    if (ongoingGames[auteurMessage].attempts === 0) {
      await zk.sendMessage(origineMessage, { text: `Dommage! Le mot était: ${wordToGuess}` });
    }
  }

  delete ongoingGames[auteurMessage];
};

// Fonction du jeu "Roue"
const roue = async (origineMessage, zk, commandeOptions) => {
  const { repondre, auteurMessage } = commandeOptions;

  if (ongoingGames[auteurMessage]) {
    await zk.sendMessage(origineMessage, { text: 'Votre précédente partie a été annulée.' });
    delete ongoingGames[auteurMessage];
  }

  ongoingGames[auteurMessage] = { status: 'started' };

  let numbers = generateRandomNumbers(0, 50, 50);
  let winningNumbers = generateRandomNumbers(0, 50, 3);
  let rewards = generateRewards();

  let msga = `*🎰Tentez votre chance !*\nChoisissez un numéro parmi les 50 suivants :\n${numbers.join(', ')}`;
  await zk.sendMessage(origineMessage, { text: msga });

  const getChosenNumber = async () => {
    const rep = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
    let chosenNumber;
    try {
      chosenNumber = parseInt(rep.message.extendedTextMessage.text);
    } catch {
      chosenNumber = parseInt(rep.message.conversation);
    }
    return chosenNumber;
  };

  let chosenNumber = await getChosenNumber();

  const checkWinningNumber = (number) => {
    if (winningNumbers.includes(number)) {
      let rewardIndex = winningNumbers.indexOf(number);
      let reward = rewards[rewardIndex];
      return `🎊 Félicitations ! Vous avez gagné ${reward}`;
    } else {
      return '😞 Désolé, ce n’était pas le bon numéro.';
    }
  };

  let messageResult = checkWinningNumber(chosenNumber);

  if (!winningNumbers.includes(chosenNumber)) {
    delete ongoingGames[auteurMessage];
    await repondre('Vous avez une deuxième chance ! Choisissez un autre numéro.');
    chosenNumber = await getChosenNumber();
    messageResult = checkWinningNumber(chosenNumber);
  }

  await repondre(messageResult);
  delete ongoingGames[auteurMessage];
};

// Commande pour le jeu "Devinez le Mot"
zokou(
  {
    nomCom: 'devinezLeMot',
    reaction: '🧠',
    categorie: 'NEO_GAMES🧠'
  },
  async (origineMessage, zk, commandeOptions) => {
    await devinezLeMot(origineMessage, zk, commandeOptions);
  }
);

// Commande pour le jeu "Roue"
zokou(
  {
    nomCom: 'roue',
    reaction: '🎰',
    categorie: 'SRPC_GAMES🎰'
  },
  async (origineMessage, zk, commandeOptions) => {
    await roue(origineMessage, zk, commandeOptions);
  }
);