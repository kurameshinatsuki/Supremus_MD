const { zokou } = require('../framework/zokou');

// Liste des questions du quiz multiverse animes avec questions et réponses
const questions = [
  {
    question: "Quel est le nom complet de Luffy dans One Piece ?",
    reponse: "Monkey D. Luffy",
  },
  {
    question: "Qui est le créateur de Naruto ?",
    reponse: "Masashi Kishimoto",
  },
  {
    question: "Dans quel anime trouve-t-on un carnet qui tue ceux dont le nom est écrit dedans ?",
    reponse: "Death Note",
  },
  {
    question: "Quel est le nom de l'épée de Kirito dans Sword Art Online ?",
    reponse: "Elucidator",
  },
  {
    question: "Quel est le premier Pokémon légendaire apparu dans l'anime Pokémon ?",
    reponse: "Ho-Oh",
  },
];

// Liste des joueurs ayant rejoint le quiz
let joueurs = [];

// Liste des scores des joueurs
let scores = {};

// Fonction pour créer une pause/délai en millisecondes
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

zokou({ nomCom: "quiz", categorie: "OTAKU" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  // Réinitialiser les joueurs et les scores à chaque début de quiz
  joueurs = [];
  scores = {};

  // Inviter les joueurs à rejoindre le quiz
  await zk.sendMessage(dest, {
    text: `Le quiz multiverse d'animes commence ! Répondez "go" dans la prochaine minute pour rejoindre le jeu.`,
  }, { quoted: ms });

  // Collecter les joueurs pendant 1 minute
  const filterGo = (message) => message.text.toLowerCase() === 'go';
  const participants = await zk.collectMessages(dest, filterGo, 60000);

  // Ajouter les joueurs ayant répondu "go"
  participants.forEach((participant) => {
    if (!joueurs.includes(participant.author)) {
      joueurs.push(participant.author);
      scores[participant.author] = 0; // Initialiser le score de chaque joueur à 0
    }
  });

  // Démarrer le quiz si des joueurs ont rejoint
  if (joueurs.length === 0) {
    await zk.sendMessage(dest, {
      text: `Aucun joueur n'a rejoint le quiz.`,
    }, { quoted: ms });
    return;
  }

  await zk.sendMessage(dest, {
    text: `Le quiz commence avec ${joueurs.length} joueur(s) !`,
  }, { quoted: ms });

  // Boucle à travers chaque question du quiz
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // Envoyer la question
    await zk.sendMessage(dest, {
      text: `Question ${i + 1}: ${question.question}`,
    }, { quoted: ms });

    // Collecter les réponses des joueurs pendant 10 secondes
    const filterReponse = (message) => joueurs.includes(message.author);
    const reponses = await zk.collectMessages(dest, filterReponse, 10000);

    // Vérifier qui a donné la bonne réponse en premier
    const bonneReponse = reponses.find(
      (reponse) => reponse.text.toLowerCase() === question.reponse.toLowerCase()
    );

    if (bonneReponse) {
      // Le premier joueur avec la bonne réponse gagne un point
      scores[bonneReponse.author]++;
      await zk.sendMessage(dest, {
        text: `${bonneReponse.author} a donné la bonne réponse et gagne 1 point !`,
      }, { quoted: ms });
    } else {
      await zk.sendMessage(dest, {
        text: `Personne n'a trouvé la bonne réponse dans le temps imparti.`,
      }, { quoted: ms });
    }

    // Petite pause entre les questions
    await delay(2000);
  }

  // Envoyer le tableau des scores à la fin du quiz
  let tableauDesScores = `Tableau des scores final :\n`;
  for (const joueur of joueurs) {
    tableauDesScores += `${joueur}: ${scores[joueur]} point(s)\n`;
  }

  await zk.sendMessage(dest, {
    text: tableauDesScores,
  }, { quoted: ms });
});