const { zokou } = require('../framework/zokou');

// Simulation d'un solde de joueur (pour simplifier)
let playerBalances = {};

zokou(
    {
        nomCom: 'slots',
        reaction: '🎰',
        categorie: 'NEO_GAMES🎰'
    },
    async (origineMessage, zk, commandeOptions) => {
        const { ms, repondre, auteurMessage, texte } = commandeOptions;

        const betAmount = 5; // Montant misé par défaut (tu peux le rendre dynamique)
        if (!playerBalances[auteurMessage]) {
            playerBalances[auteurMessage] = 100; // Solde initial
        }

        if (playerBalances[auteurMessage] < betAmount) {
            await repondre("Vous n'avez pas assez de fonds pour jouer aux machines à sous.");
            return;
        }

        const result = spinSlotMachine();

        let response = `🎰 Résultat de la machine à sous 🎰\n\n${result.join(' | ')}\n\n`;

        let win = false;
        if (result[0] === result[1] && result[1] === result[2]) {
            win = true;
        }

        if (win) {
            const winnings = betAmount * 10;
            playerBalances[auteurMessage] += winnings;
            response += `Jackpot ! Vous avez gagné ${winnings} pièces. Solde actuel: ${playerBalances[auteurMessage]} pièces. 🤑`;
        } else {
            playerBalances[auteurMessage] -= betAmount;
            response += `Dommage! Vous avez perdu ${betAmount} pièces. Solde actuel: ${playerBalances[auteurMessage]} pièces. Réessayez !`;
        }

        await repondre(response);
    }
);