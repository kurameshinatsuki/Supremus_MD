const { zokou } = require('../framework/zokou');

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

        let message = `*🃏 Mystic Pairs* \nVous avez reçu les cartes : ${card1} et ${card2}.\n\nVoulez-vous changer une carte ? Répondez par \`1\` pour changer la première carte, \`2\` pour changer la deuxième, ou \`non\` pour garder les deux.`;
        await zk.sendMessage(dest, { text: message });

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

        let resultMessage = `Vos cartes finales sont : ${card1} et ${card2}.\n`;

        if (card1 === card2) {
            resultMessage += "🎉 Vous avez une paire identique ! Vous avez gagné !";
        } else {
            resultMessage += "😞 Pas de paire identique. Mieux vaut la prochaine fois.";
        }

        await repondre(resultMessage);
    }
);

// Nouvelle commande pour le jeu "Jackpot Whirl"
zokou(
    {
        nomCom: 'jackpotwhirl',
        reaction: '🎰',
        categorie: 'SRPN-GAMES'
    },
    async (dest, zk, commandeOptions) => {
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
    }
);

// Nouvelle commande pour le jeu "Mind Mastery"
zokou(
    {
        nomCom: 'mindmastery',
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
        let message = `*🧠 Mind Mastery*\n${question.question}\n${question.choices.join('\n')}\nRépondez en choisissant le numéro de la bonne réponse.`;
        await zk.sendMessage(dest, { text: message });

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

        const chosenAnswer = parseInt(response);
        if (chosenAnswer === question.correct) {
            await repondre("🎉 Correct ! Vous avez gagné !");
        } else {
            await repondre("😞 Mauvaise réponse. Mieux vaut la prochaine fois.");
        }
    }
);

// Nouvelle commande pour le jeu "Fortune Spin"
zokou(
    {
        nomCom: 'fortunespin',
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