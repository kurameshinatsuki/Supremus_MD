/*const { zokou } = require('../framework/zokou');

const generateRandomNumbers = (min, max, count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
};

const generateRewards = () => {
  return ['1.000💎', '10.000🧭', '10💳', '1🎭', '1🎁']; // Récompenses non nulles seulement
};

const sendImageWithCaption = async (zk, origineMessage, imageUrl, caption, ms) => {
  try {
    await zk.sendMessage(origineMessage, { image: { url: imageUrl }, caption }, { quoted: ms });
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'image avec la légende: ${caption}`, error);
  }
};

const getPlayerResponse = async (zk, origineMessage, auteurMessage, timeout) => {
  try {
    const response = await zk.awaitForMessage({
      sender: auteurMessage,
      chatJid: origineMessage,
      timeout
    });

    return response.message.extendedTextMessage?.text || response.message.conversation || '';
  } catch (error) {
    console.error('Erreur lors de l\'attente de la réponse du joueur:', error);
    return '';
  }
};

const handleGame = async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, auteurMessage } = commandeOptions;
  const imageUrl = 'https://telegra.ph/file/9a411be3bf362bd0bcea4.jpg';
  const timeout = 60000; // 60 secondes

  // Si une partie est déjà en cours, annulez-la
  if (ongoingGames[auteurMessage]) {
    await zk.sendMessage(origineMessage, { text: 'Votre précédente partie a été annulée.' });
    delete ongoingGames[auteurMessage];
  }

  ongoingGames[auteurMessage] = { status: 'started' };

  const numbers = generateRandomNumbers(0, 50, 10);
  const rewards = generateRewards();
  const winningNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const winningReward = rewards[Math.floor(Math.random() * rewards.length)];

  const message = `*🎰𝗧𝗘𝗡𝗧𝗘𝗭 𝗩𝗢𝗧𝗥𝗘 𝗖𝗛𝗔𝗡𝗖𝗘🥳 !!*
▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬🎉🎉🎉
Jouez à la roulette des chiffres et tentez de choisir le numéro gagnant parmi les *🔟* proposés ci-dessous.
Vous avez *2 chances* pour gagner une magnifique récompense ! *⚠️ Répondez avec le numéro choisi pour jouer.*
▔▔🎊▔🎊▔🎊▔▔🎊▔▔🎊▔🎊▔🎊▔▔🎊▔🎊▔🎊▔🎊▔🎊▔▔
${numbers.join(', ')}
▔▔🎊▔🎊▔🎊▔▔🎊▔▔🎊▔🎊▔🎊▔▔🎊▔🎊▔🎊▔🎊▔🎊▔▔
▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬🎉🎉🎉

*🎊 Voulez-vous tenter votre chance ?*
✅: \`Oui\`
❌: \`Non\``;

  await sendImageWithCaption(zk, origineMessage, imageUrl, message, ms);

  const confirmation = await getPlayerResponse(zk, origineMessage, auteurMessage, timeout);

  if (confirmation.toLowerCase() !== 'oui') {
    delete ongoingGames[auteurMessage];
    return repondre('Jeu annulé. À la prochaine !');
  }

  const chosenNumber = await getChosenNumber(zk, origineMessage, auteurMessage, timeout);

  if (chosenNumber === winningNumber) {
    await sendImageWithCaption(zk, origineMessage, 'https://telegra.ph/file/dc157f349cd8045dff559.jpg', 
      `🎉🎊 Félicitations ! Vous avez choisi le bon numéro ${winningNumber} et gagné ${winningReward} ! 🎊🎉
      Vous pouvez toujours continuer à jouer pour plus de surprises !`, 
      ms);
  } else {
    delete ongoingGames[auteurMessage];
    await repondre('Dommage ! Ce n\'était pas le bon numéro. Vous avez encore une chance de gagner.');
    const secondChanceNumber = await getChosenNumber(zk, origineMessage, auteurMessage, timeout);

    if (secondChanceNumber === winningNumber) {
      await sendImageWithCaption(zk, origineMessage, 'https://telegra.ph/file/dc157f349cd8045dff559.jpg', 
        `🎉🎊 Félicitations ! Vous avez choisi le bon numéro ${winningNumber} et gagné ${winningReward} ! 🎊🎉
        Vous avez réussi lors de votre deuxième chance !`, 
        ms);
    } else {
      await sendImageWithCaption(zk, origineMessage, 'https://telegra.ph/file/222cefbcd18ba50012d05.jpg', 
        `😫💔 Dommage ! Ce n'était pas le bon numéro. Le numéro gagnant était ${winningNumber}. 
        Merci d'avoir joué et à la prochaine ! 💔😫`, 
        ms);
    }
  }

  delete ongoingGames[auteurMessage]; // Fin de la partie
};

const getChosenNumber = async (zk, origineMessage, auteurMessage, timeout) => {
  const message = '🎊😃: *Choisissez un numéro parmi les proposés vous avez 1min pour répondre⚠️* (Répondre à ce message)';
  const imageUrl = 'https://telegra.ph/file/9a411be3bf362bd0bcea4.jpg';

  await sendImageWithCaption(zk, origineMessage, imageUrl, message, ms);

  let chosenNumber = await getPlayerResponse(zk, origineMessage, auteurMessage, timeout);
  chosenNumber = parseInt(chosenNumber);

  if (isNaN(chosenNumber) || chosenNumber < 0 || chosenNumber > 50) {
    await repondre('Veuillez choisir un numéro valide parmi ceux proposés.');
    return await getChosenNumber(zk, origineMessage, auteurMessage, timeout);
  }

  return chosenNumber;
};

// Suivi des parties en cours pour chaque joueur
const ongoingGames = {};

zokou(
  {
    nomCom: 'roue',
    reaction: '🎰',
    categorie: 'SRPC_GAMES🎰'
  },
  handleGame
);*/