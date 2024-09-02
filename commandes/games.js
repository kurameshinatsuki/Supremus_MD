const { zokou } = require('../framework/zokou');

// Nouvelle commande pour le jeu "Jackpot Whirl"
zokou(
    {
        nomCom: 'whirl',
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