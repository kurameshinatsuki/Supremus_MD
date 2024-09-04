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
*💬 Tenté de remporter le double de votre mise en tirant sur la machine à sous et en alignant les trois symboles.*

> *🎊 Voulez-vous tenter votre chance, mise minimum 1.000🧭 ou 100💎* \`Oui\` *ou* \`Non\` ?*
═══════════════════
░░░░░░░░░░░░░░░░░░░`
        });

        // Fonction pour détecter la confirmation de jeu
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

        // Ajout d'un délai avant l'affichage du résultat
        await repondre('Patientez un instant...'); 
        await delay(3000); // Pause de 3 secondes

        const [slot1, slot2, slot3] = generateSlotSymbols();
        const message = `🎰 *Jackpot Whirl* 🎰\n\n*🎲 Résultat :* ${slot1} | ${slot2} | ${slot3}`;

        if (slot1 === slot2 && slot2 === slot3) {
            await repondre(`${message}\n\n🎉 *Jackpot!* Vous avez gagné ! 🏆`);
        } else {
            await repondre(`${message}\n\n😢 *Pas de chance cette fois.* Réessayez !`);
        }

        delete ongoingGames[auteurMessage]; // Fin de la partie
    }
);