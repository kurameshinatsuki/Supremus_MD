const { zokou } = require('../framework/zokou');

// Nouvelle commande pour le jeu "Jackpot Whirl"
zokou(
    {
        nomCom: 'whirl',
        reaction: '🎰',
        categorie: 'SRPN-TRANSACT'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, origineMessage } = commandeOptions;

        // Affichage de l'image et de la légende personnalisée pour choisir la mise
        await zk.sendMessage(dest, { 
            image: { url: 'https://telegra.ph/file/4cc2712eee93c105f6739.jpg' }, 
            caption: `░░░░░░░░░░░░░░░░░░░
═══════════════════
  ✨ *🎰 Jackpot Whirl 🎰* ✨
═══════════════════
*💬 Tenté de remporté le double de votre mise en tirant sur la machine à sous et aligner les trois symboles.*

> *🎊Voulez-vous tenter votre chance, mise minimum 1.000🧭 ou 100💎* \`Oui\` *ou* \`Non\` ?*
═══════════════════
░░░░░░░░░░░░░░░░░░░`
        });

        // fonction pour détecter la confirmation de jeu
        const getConfirmation = async () => {
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

            if (response.toLowerCase() === 'oui') {
                return true;
            } else if (response.toLowerCase() === 'non') {
                return false;
            } else {
                await repondre('Veuillez répondre par Oui ou Non.');
                return await getConfirmation();
            }
        };

        if (!(await getConfirmation())) {
            delete ongoingGames[auteurMessage];
            return repondre('Jeu annulé. À la prochaine !');
        }

        // Fonction pour créer un délai (pause)
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Traitement de la réponse
        const generateSlotSymbols = () => {
            const symbols = ['🍒', '🍋', '🔔', '💎', '⭐','🎭'];
            return [
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ];
        };

        const [slot1, slot2, slot3] = generateSlotSymbols();
        const message = `🎰 *Jackpot Whirl* 🎰\n\n*🎲 Résultat :* ${slot1} | ${slot2} | ${slot3}`;

        if (slot1 === slot2 && slot2 === slot3) {
            await repondre(`${message}\n\n🎉 *Jackpot!* Vous avez gagné ! 🏆`);
        } else {
            await repondre(`${message}\n\n😢 *Pas de chance cette fois.* Réessayez !`);
        }
    }
);

// Nouvelle commande pour le jeu "Fortune Spin"
zokou(
    {
        nomCom: 'spin',
        reaction: '🎡',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
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
    }
);

// Jeu des Dices
zokou(
    {
        nomCom: 'dice',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;
        const rollDice = () => Math.floor(Math.random() * 6) + 1;
        
        const dice1 = rollDice();
        const dice2 = rollDice();
        const sum = dice1 + dice2;

        let resultMessage;
        if (sum === 7 || sum === 11) {
            resultMessage = `🎲 Vous avez lancé ${dice1} et ${dice2}. Somme: ${sum}.\n🎉 Félicitations! Vous avez gagné!`;
        } else if (sum === 2, 3, 12) {
            resultMessage = `🎲 Vous avez lancé ${dice1} et ${dice2}. Somme: ${sum}.\n😢 Désolé, vous avez perdu.`;
        } else {
            resultMessage = `🎲 Vous avez lancé ${dice1} et ${dice2}. Somme: ${sum}.\n🤔 Vous pouvez rejouer!`;
        }

        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

// Jeu du Multiplicateur
zokou(
    {
        nomCom: 'madness',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;
        const multiplier = Math.floor(Math.random() * 5) + 1;
        
        let message = `🎰 Choisissez un chiffre entre 1 et 5.`;
        zk.sendMessage(dest, { text: message }, { quoted: ms });

        const rep = await zk.awaitForMessage({
          sender: auteurMessage,
          chatJid: dest,
          timeout: 30000 // 30 secondes
        });

        let chosenNumber;
        try {
            chosenNumber = parseInt(rep.message.extendedTextMessage.text);
        } catch {
            chosenNumber = parseInt(rep.message.conversation);
        }

        if (isNaN(chosenNumber) || chosenNumber < 1 || chosenNumber > 5) {
            return repondre('Veuillez choisir un chiffre valide entre 1 et 5.');
        }

        let resultMessage;
        if (chosenNumber === multiplier) {
            resultMessage = `🎰 Le multiplicateur est ${multiplier}. Vous avez choisi ${chosenNumber}.\n🎉 Félicitations! Vous avez gagné ${multiplier} fois votre mise!`;
        } else {
            resultMessage = `🎰 Le multiplicateur est ${multiplier}. Vous avez choisi ${chosenNumber}.\n😢 Désolé, vous avez perdu.`;
        }

        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

// Nouvelle commande pour le jeu "Mind Mastery"
zokou(
    {
        nomCom: 'mastery',
        reaction: '🧠',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
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
        const message = `*🧠 Mind Mastery*\n${question.question}\n${question.choices.join('\n')}\nRépondez en choisissant le numéro de la bonne réponse.`;

        await zk.sendMessage(dest, { text: message });

        // Fonction pour créer un délai (pause)
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Attente de la réponse pendant 30 secondes
        const rep = await zk.awaitForMessage({
            sender: auteurMessage,
            chatJid: dest,
            timeout: 30000 // 30 secondes
        });

        let response;
        try {
            response = rep.message?.extendedTextMessage?.text || rep.message?.conversation;
        } catch (error) {
            response = "";
        }

        // Création d'un délai de 30 secondes avant de vérifier la réponse
        await delay(30000);

        const chosenAnswer = parseInt(response);
        if (isNaN(chosenAnswer) || chosenAnswer < 1 || chosenAnswer > question.choices.length) {
            await repondre("⚠️ Réponse invalide ou pas de réponse. Veuillez répondre avec un numéro correspondant à une des options proposées.");
        } else if (chosenAnswer === question.correct) {
            await repondre("🎉 Correct ! Vous avez gagné !");
        } else {
            await repondre("😞 Mauvaise réponse. Mieux vaut la prochaine fois.");
        }
    }
);

// Nouvelle commande pour le jeu "Mystic Pairs"
zokou(
    {
        nomCom: 'mysticpairs',
        reaction: '🃏',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
        const generateRandomCard = () => {
            const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            return cards[Math.floor(Math.random() * cards.length)];
        };

        const { repondre, auteurMessage } = commandeOptions;

        let card1 = generateRandomCard();
        let card2 = generateRandomCard();

        // Envoyer les cartes au joueur sans révéler les valeurs
        let message = `*🃏 Mystic Pairs*\nVous avez reçu deux cartes.\n\nVoulez-vous changer une carte avant de poser les cartes sur la table ? Répondez par \`1\` pour changer la première carte, \`2\` pour changer la deuxième, ou \`non\` pour garder les deux.`;
        await zk.sendMessage(dest, { text: message });

        // Fonction pour créer un délai (pause)
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Attente de la réponse du joueur pour changer les cartes
        const rep = await zk.awaitForMessage({
            sender: auteurMessage,
            chatJid: dest,
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

        // Demander au joueur de poser les cartes sur la table
        let revealMessage = `Tapez \`table\` pour poser vos cartes sur la table et révéler leurs valeurs.`;
        await zk.sendMessage(dest, { text: revealMessage });

        // Attente du mot-clé "table" pour révéler les cartes
        const revealRep = await zk.awaitForMessage({
            sender: auteurMessage,
            chatJid: dest,
            timeout: 30000 // 30 secondes
        });

        let revealResponse;
        try {
            revealResponse = revealRep.message.extendedTextMessage.text;
        } catch {
            revealResponse = revealRep.message.conversation;
        }

        if (revealResponse.toLowerCase() === 'table') {
            // Révéler les cartes et déterminer le résultat
            let resultMessage = `Vos cartes finales sont : ${card1} et ${card2}.\n`;

            if (card1 === card2) {
                resultMessage += "🎉 Vous avez une paire identique ! Vous avez gagné !";
            } else {
                resultMessage += "😞 Pas de paire identique. Mieux vaut la prochaine fois.";
            }

            await repondre(resultMessage);
        } else {
            await repondre("⏳ Temps écoulé ou commande invalide. Les cartes n'ont pas été révélées.");
        }
    }
);