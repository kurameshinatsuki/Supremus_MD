const { zokou } = require('../framework/zokou');


zokou(
    {
        nomCom: 'article',
        categorie: 'Transact-Zone'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            // Liste des images avec leurs légendes correspondantes
            const imagesAvecLegendes = [
                {
                    url: 'https://telegra.ph/file/a374b96c7674a3d6378d7.jpg',
                    legende: '*🛍️ Article 1:* Paire de Griffes.'
                },
                {
                    url: 'https://telegra.ph/file/a9c764acf27e3a235bebb.jpg',
                    legende: '*🛍️ Article 2:* Montre.'
                },
                {
                    url: 'https://telegra.ph/file/c7dc4492631033f375259.jpg',
                    legende: '*🛍️ Article 3:* Crystal d Amplification.'
                }
                {
                    url: 'https://telegra.ph/file/ed00b10ae16a00f91c63c.jpg',
                    legende: '*🛍️ Article 4:* Épée Ordinaire.'
                },
                {
                    url: 'https://telegra.ph/file/41fe261053df5794bd732.jpg',
                    legende: '*🛍️ Article 5:* Épée Violette.'
                },
                {
                    url: 'https://telegra.ph/file/e1f2aefeeee3ff8cdfb91.jpg',
                    legende: '*🛍️ Article 6:* Dague.'
                }
                {
                    url: 'https://telegra.ph/file/49afb31ee5d5211c82e5b.jpg',
                    legende: '*🛍️ Article 7:* Épée Terraliens.'
                },
                {
                    url: 'https://telegra.ph/file/b675e1aab798f8c98ea1e.jpg',
                    legende: '*🛍️ Article 8:* Potion Énergétique.'
                },
                {
                    url: 'https://telegra.ph/file/9ac81c71047b7f5c10f65.jpg',
                    legende: '*🛍️ Article 9:* Crystal de Communication.'
                }
                {
                    url: 'https://telegra.ph/file/7929c49687b484a60145f.jpg',
                    legende: '*🛍️ Article 10:* Potion de Soins.'
                },
                {
                    url: 'https://telegra.ph/file/deae5ffc579ec14fb5642.jpg',
                    legende: '*🛍️ Article 11:* Anneau de Charité.'
                },
                {
                    url: 'https://telegra.ph/file/39dfbbc6215220cb7665d.jpg',
                    legende: '*🛍️ Article 12:* Anneau du Lien Éternel.'
                }
                {
                    url: 'https://telegra.ph/file/669f181d0b76c2889fd24.jpg',
                    legende: '*🛍️ Article 13:* Fiole Empoisonné.'
                },
                {
                    url: 'https://telegra.ph/file/86ef73e1d0d2a3d2e6585.jpg',
                    legende: '*🛍️ Article 14:* Paire de Gants Vert.'
                },
                {
                    url: 'https://telegra.ph/file/34ed2758cc6ef60cb3f8d.jpg',
                    legende: '*🛍️ Article 15:* Pommade Médicinal.'
                }
                {
                    url: 'https://telegra.ph/file/6fe610b5987c6fcd826dd.jpg',
                    legende: '*🛍️ Article 16:* Hache.'
                },
                {
                    url: 'https://telegra.ph/file/da0c204b34fff75bf751f.jpg',
                    legende: '*🛍️ Article 17:* Arc.'
                },
                {
                    url: 'https://telegra.ph/file/0996b4d4435161f804c5c.jpg',
                    legende: '*🛍️ Article 18:* Paire d Épée.'
                }
                {
                    url: 'https://telegra.ph/file/3db859baa39b33466125c.jpg',
                    legende: '*🛍️ Article 19:* Épée Noire.'
                },
                {
                    url: 'https://telegra.ph/file/50b1e57ef0dceab1733bb.jpg',
                    legende: '*🛍️ Article 20:* Lance.'
                },
                {
                    url: 'https://telegra.ph/file/3e435b8da97f5991553e4.jpg',
                    legende: '*🛍️ Article 21:* Nunchaku Trio.'
                }
                {
                    url: 'https://telegra.ph/file/badb0bb097134299d77da.jpg',
                    legende: '*🛍️ Article 22:* Sac à Dos.'
                },
                {
                    url: 'https://telegra.ph/file/dd3d362a9a8ac03240ad0.jpg',
                    legende: '*🛍️ Article 23:* Lance Émeraude.'
                },
                {
                    url: 'https://telegra.ph/file/f74756044bab205f1b334.jpg',
                    legende: '*🛍️ Article 24:* Fouet Épineux.'
                }
                {
                    url: 'https://telegra.ph/file/c72c0f9c375c1aacb17e1.jpg',
                    legende: '*🛍️ Article 25:* Couteau A.'
                },
                {
                    url: 'https://telegra.ph/file/1acaabdfecd25e1b35e7e.jpg',
                    legende: '*🛍️ Article 26:* Lot d Aiguilles.'
                },
                {
                    url: 'https://telegra.ph/file/6fa3ba579b0d7bb39ab19.jpg',
                    legende: '*🛍️ Article 27:* Lance Dorée.'
                }
                {
                    url: 'https://telegra.ph/file/ef301501877697ab4b416.jpg',
                    legende: '*🛍️ Article 28:* Couteau Croissant.'
                },
                {
                    url: 'https://telegra.ph/file/cbe78a622c4468c6b2040.jpg',
                    legende: '*🛍️ Article 29:* Fouet à pointe.'
                },
                {
                    url: 'https://telegra.ph/file/2758cb958e2a5e8d79561.jpg',
                    legende: '*🛍️ Article 30:* Fouet à Rubans.'
                }
            ];

            // Envoi des images avec légendes
            for (const image of imagesAvecLegendes) {
                await zk.sendMessage(
                    dest,
                    {
                        image: { url: image.url },
                        caption: image.legende
                    },
                    { quoted: ms }
                );
            }
        }
    }
);

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
