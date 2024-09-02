const { zokou } = require('../framework/zokou');

// Fonction pour le jeu de cartes "Mystic Pairs"
const mysticPairs = async (origineMessage, zk, commandeOptions) => {
  const generateRandomCard = () => {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return cards[Math.floor(Math.random() * cards.length)];
  };

  const { repondre, auteurMessage } = commandeOptions;

  let card1 = generateRandomCard();
  let card2 = generateRandomCard();

  let message = `*🃏 Mystic Pairs* \nVous avez reçu les cartes : ${card1} et ${card2}.\n\nVoulez-vous changer une carte ? Répondez par \`1\` pour changer la première carte, \`2\` pour changer la deuxième, ou \`non\` pour garder les deux.`;
  await zk.sendMessage(origineMessage, { text: message });

  const rep = await zk.awaitForMessage({
    sender: auteurMessage,
    chatJid: origineMessage,
    timeout: 30000 // 30 secondes
  });

  let response;
  try {
    response = rep.message.extendedTextMessage.text;
  } catch {
    response = rep.message.conversation;
  }

  if (response === '1') {
    card1 = generateRandomCard();
  } else if (response === '2') {
    card2 = generateRandomCard();
  }

  let resultMessage = `Vos cartes finales sont : ${card1} et ${card2}.\n`;

  if (card1 === card2) {
    resultMessage += "🎉 Vous avez une paire identique ! Vous avez gagné !";
  } else {
    resultMessage += "😞 Pas de paire identique. Mieux vaut la prochaine fois.";
  }

  await repondre(resultMessage);
};

// Fonction pour le jeu "Jackpot Whirl"
const jackpotWhirl = async (origineMessage, zk, commandeOptions) => {
  const generateSlotSymbols = () => {
    const symbols = ['🍒', '🍋', '🔔', '💎', '⭐'];
    return [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
  };

  const { repondre } = commandeOptions;

  const [slot1, slot2, slot3] = generateSlotSymbols();
  const message = `*🎰 Jackpot Whirl*\nRésultat : ${slot1} | ${slot2} | ${slot3}`;

  if (slot1 === slot2 && slot2 === slot3) {
    await repondre(`${message}\n🎉 Jackpot ! Vous avez gagné !`);
  } else {
    await repondre(`${message}\n😞 Pas de chance cette fois. Réessayez !`);
  }
};

// Fonction pour le jeu "Mind Mastery"
const mindMastery = async (origineMessage, zk, commandeOptions) => {
  const quizQuestions = [
    {
      question: "Quelle est la capitale de la France ?",
      choices: ["1. Paris", "2. Londres", "3. Berlin"],
      correct: 1
    },
    // Ajoutez plus de questions ici
  ];

  const getRandomQuestion = () => {
    return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
  };

  const { repondre, auteurMessage } = commandeOptions;

  const question = getRandomQuestion();
  let message = `*🧠 Mind Mastery*\n${question.question}\n${question.choices.join('\n')}\nRépondez en choisissant le numéro de la bonne réponse.`;
  await zk.sendMessage(origineMessage, { text: message });

  const rep = await zk.awaitForMessage({
    sender: auteurMessage,
    chatJid: origineMessage,
    timeout: 30000 // 30 secondes
  });

  let response;
  try {
    response = rep.message.extendedTextMessage.text;
  } catch {
    response = rep.message.conversation;
  }

  const chosenAnswer = parseInt(response);
  if (chosenAnswer === question.correct) {
    await repondre("🎉 Correct ! Vous avez gagné !");
  } else {
    await repondre("😞 Mauvaise réponse. Mieux vaut la prochaine fois.");
  }
};

// Fonction pour le jeu "Fortune Spin"
const fortuneSpin = async (origineMessage, zk, commandeOptions) => {
  const spinWheel = () => {
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '⚪', '⚫', '🟤', '🟡', '🔵', '🟢'];
    const winningColors = ['🔴', '🔵', '🟢', '🟡', '🟣', '⚪'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    return { chosenColor, isWinner: winningColors.includes(chosenColor) };
  };

  const { repondre } = commandeOptions;

  const { chosenColor, isWinner } = spinWheel();
  let message = `*🎡 Fortune Spin*\nLa roue s'arrête sur : ${chosenColor}`;

  if (isWinner) {
    await repondre(`${message}\n🎉 Félicitations ! Vous avez gagné !`);
  } else {
    await repondre(`${message}\n😞 Pas de chance cette fois. Essayez encore !`);
  }
};

// Enregistrement des commandes
zokou({ nomCom: 'mysticpairs', reaction: '🃏', categorie: 'SRPN_GAMES' }, mysticPairs);
zokou({ nomCom: 'jackpotwhirl', reaction: '🎰', categorie: 'SRPN_GAMES' }, jackpotWhirl);
zokou({ nomCom: 'mindmastery', reaction: '🧠', categorie: 'SRPN_GAMES' }, mindMastery);
zokou({ nomCom: 'fortunespin', reaction: '🎡', categorie: 'SRPN-GAMES' }, fortuneSpin);

/*const { zokou } = require('../framework/zokou');

// Liste des questions et réponses
const quizQuestions = [
    { question: "Quel est le nom de la capitale du royaume d'Asura ?", answer: "Astoria" },
    { question: "Qui est le personnage principal du premier film Origamy World ?", answer: "Arès" },
    { question: "Quel pouvoir utilise la compagne d'Arès ?", answer: "Invocation" },
    { question: "Quel est l'objet que recherche Arès pour retourner dans le passé ?", answer: "Un objet magique" },
    // Ajoute plus de questions ici
];

// Fonction pour choisir une question aléatoire
const getRandomQuestion = () => {
    return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
};

// Suivi des parties en cours pour chaque joueur
const ongoingQuizzes = {};

zokou(
    {
        nomCom: 'quizrp',
        reaction: '❓',
        categorie: 'SRPN_GAMES🎰'
    },
    async (origineMessage, zk, commandeOptions) => {
        const { ms, repondre, auteurMessage } = commandeOptions;

        try {
            // Annuler un quiz en cours si le joueur en lance un nouveau
            if (ongoingQuizzes[auteurMessage]) {
                await zk.sendMessage(origineMessage, { text: 'Votre précédent quiz a été annulé.' });
                delete ongoingQuizzes[auteurMessage];
            }

            // Démarrer un nouveau quiz
            ongoingQuizzes[auteurMessage] = { status: 'started' };

            const { question, answer } = getRandomQuestion();
            const lienImage = 'https://telegra.ph/file/b9ed1612f868e83bbe6b4.jpg'; // Lien vers une image

            let msg = `*❓QUIZZ RP🎉!*
Voici votre question:
*${question}*

Répondez en tapant votre réponse dans les 60 secondes.`;

            await zk.sendMessage(origineMessage, { image: { url: lienImage }, caption: msg }, { quoted: ms });

            const getResponse = async () => {
                const rep = await zk.awaitForMessage({
                    sender: auteurMessage,
                    chatJid: origineMessage,
                    timeout: 60000 // 60 secondes
                });

                let playerAnswer;
                try {
                    playerAnswer = rep.message.extendedTextMessage.text;
                } catch {
                    playerAnswer = rep.message.conversation;
                }

                return playerAnswer.trim().toLowerCase();
            };

            let playerAnswer = await getResponse();

            if (playerAnswer === answer.toLowerCase()) {
                await repondre('✅ Bonne réponse ! Félicitations !');
            } else {
                await repondre(`❌ Mauvaise réponse. La bonne réponse était: *${answer}*`);
            }

            delete ongoingQuizzes[auteurMessage]; // Fin du quiz

        } catch (error) {
            console.error("Erreur lors du quiz RP:", error);
            repondre('Une erreur est survenue. Veuillez réessayer.');
        }
    }
);*/