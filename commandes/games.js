const { zokou } = require('../framework/zokou');

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
);