const { zokou } = require('../framework/zokou');
const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const { default: axios } = require('axios');

zokou(
    {
        nomCom: 'quiz',
        categorie: 'Transact-Zone'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;
        let niveau = 1;
        let score = 0;

        const questions = [
            // Niveau Facile
            {
                niveau: 1,
                question: "✨ Quel est le nom du colisée à Astoria dans Origamy World ?",
                options: ["A) Lorn", "B) Aurelus", "C) Aurelius"],
                reponse: "B"
            },
            {
                niveau: 1,
                question: "✨ La CRPS est dirigée par ?",
                options: ["A) Supremus-Prod", "B) John Supremus", "C) Team Supremus"],
                reponse: "A"
            },
            {
                niveau: 1,
                question: "✨ Quel est le but principal du jeu CRPS ?",
                options: ["A) Créer le meilleur RP jamais connu.", "B) Recruter et former des rôlistes.", "C) Création d'un RP Multivers réaliste."],
                reponse: "C"
            },
            // Niveau Normal
            {
                niveau: 2,
                question: "✨ Quelle est le nom du Dieu ou Déesse de Asura dans Origamy World ?",
                options: ["A) Zeleph", "B) Selenia", "C) Iris"],
                reponse: "C"
            },
            {
                niveau: 2,
                question: "✨ Lequel de ces actions est une action simultanée à une autre ?",
                options: ["A) Je lui donne un crochet du droit à la tête en lui donnant un coup de pied gauche à son genou droit.",
                         "B) J'effectue un saut avant de 2m de haut tête en bas en lui saisissant la tête avec les deux mains.",
                         "C) Il n'y en a pas."],
                reponse: "B"
            },
            {
                niveau: 2,
                question: "✨ Quel est la version du système de confrontation actuel de CRPS ?",
                options: ["A) CRPS FIGHT RULE 3.0.0", "B) CRPS NEW ERA", "C) CRPS FIGHT RULE UPDATE"],
                reponse: "A"
            },
            // Niveau Difficile
            {
                niveau: 3,
                question: "✨ À quelle température la santé est-elle affectée en raison du froid dans Origamy World ?",
                options: ["A) -30°C", "B) -40°C", "C) -20°C"],
                reponse: "A"
            },
            {
                niveau: 3,
                question: "✨ Dans un combat opposant J1 à J2, Section1: une offensive de J1 effectuant une course de 5m/s vers J2 à 5m qui lui libère son énergie. Section2: J1 donne un crochet droit à la tête de J2 qui lui active sa technique... Quel sera le verdict ?",
                options: ["A) J1 touchera J2 avant l'activation de la technique.",
                         "B) J2 activera sa technique avant le coup de J1.",
                         "C) Consulter les stats vitesse de J1 et J2 avant de donner un verdict."],
                reponse: "C"
            },
            {
                niveau: 3,
                question: "✨ Quelle est la date de création de CRPS NEW ERA ?",
                options: ["A) 01/07/2023", "B) 11/11/2023", "C) 17/06/2024"],
                reponse: "B"
            },
            // Question Bonus
            {
                niveau: "bonus",
                question: "✨ Quel est le surnom de John Supremus ?",
                options: ["A) Le renard", "B) Natsuki", "C) Supremus"],
                reponse: "A"
            }
        ];

        let currentLevelQuestions = questions.filter(q => q.niveau === niveau);
        
        while (niveau <= 3) {
            let correctAnswers = 0;
            for (let q of currentLevelQuestions) {
                await zk.sendMessage(dest, { text: `${q.question}\n${q.options.join("\n")}` }, { quoted: ms });

                const userAnswer = await getUserAnswerWithTimeout(30); // 30 secondes pour répondre

                if (userAnswer && userAnswer.toUpperCase() === q.reponse) {
                    correctAnswers++;
                } else {
                    repondre("✨ Mauvaise réponse ou délai dépassé, tu perds tout. 😔");
                    score = 0;
                    return;
                }
            }

            if (correctAnswers === currentLevelQuestions.length) {
                let reward = 0;
                if (niveau === 1) reward = 1500;
                if (niveau === 2) reward = 3000;
                if (niveau === 3) reward = 5000;

                score += reward;
                repondre(`✨🎉 Bravo ! Tu as terminé le niveau ${niveau} et gagné ${reward}💎. Ton score actuel est de ${score}💎.`);

                if (niveau === 3) {
                    repondre(`✨🤩 Tu as terminé tous les niveaux ! Tu peux tenter la question bonus pour 10,000💎 ou encaisser tes gains.`);
                    break;
                } else {
                    repondre(`✨🙋 Veux-tu continuer ou réclamer tes gains ? Réponds par "Continuer" ou "Réclamer".`);
                    const continuer = await getUserDecisionWithTimeout(30); // 30 secondes pour décider
                    if (!continuer) {
                        repondre(`✨😂 Tu as décidé d'encaisser tes gains. Ton score final est de ${score}💎.`);
                        return;
                    }
                }
                niveau++;
                currentLevelQuestions = questions.filter(q => q.niveau === niveau);
            }
        }

        // Question Bonus
        if (niveau === 3) {
            const bonusQuestion = questions.find(q => q.niveau === "bonus");
            await zk.sendMessage(dest, { text: `${bonusQuestion.question}\n${bonusQuestion.options.join("\n")}` }, { quoted: ms });

            const userAnswer = await getUserAnswerWithTimeout(30);
            if (userAnswer && userAnswer.toUpperCase() === bonusQuestion.reponse) {
                score += 10000;
                repondre(`✨🎊 Incroyable ! Tu as gagné la question bonus et empoches un total de ${score}💎 !`);
            } else {
                repondre("✨ Mauvaise réponse à la question bonus ou délai dépassé, tu perds tout. 😔");
                score = 0;
            }
        }

        repondre(`✨🙂 Quiz terminé ! Ton score final est de ${score}💎.`);
    }
);

// Fonction pour obtenir la réponse du joueur avec un délai
async function getUserAnswerWithTimeout(timeoutSeconds) {
    return new Promise((resolve) => {
        let answered = false;

        // Écoute le message du joueur
        zk.onMessage(async (message) => {
            if (!answered) {
                answered = true;
                resolve(message.body.trim().toUpperCase());
            }
        });

        // Timer de 30 secondes
        setTimeout(() => {
            if (!answered) {
                resolve(null); // Le délai est écoulé sans réponse
            }
        }, timeoutSeconds * 1000);
    });
}

// Fonction pour obtenir la décision du joueur avec un délai
async function getUserDecisionWithTimeout(timeoutSeconds) {
    return new Promise((resolve) => {
        let decided = false;

        // Écoute la décision du joueur
        zk.onMessage(async (message) => {
            if (!decided) {
                const decision = message.body.trim().toUpperCase();
                if (decision === 'CONTINUER') {
                    decided = true;
                    resolve(true);
                } else if (decision === 'RÉCLAMER') {
                    decided = true;
                    resolve(false);
                }
            }
        });

        // Timer de 30 secondes
        setTimeout(() => {
            if (!decided) {
                resolve(false); // Par défaut, réclamer si le délai est écoulé
            }
        }, timeoutSeconds * 1000);
    });
                                     }
