const { zokou } = require('../framework/zokou');

async function simulateLoading(zk, origineMessage, ms) {
const frames = [
    "*`⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ [0%]`*",
    "*`🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜ [10%]`*",
    "*`🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜ [20%]`*",
    "*`🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜ [30%]`*",
    "*`🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜ [40%]`*",
    "*`🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜ [50%]`*",
    "*`🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜ [60%]`*",
    "*`🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜ [70%]`*",
    "*`🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ [80%]`*",
    "*`🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ [90%]`*",
    "*`🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 [100%]`*",
];

    try {
        let loadingMessage = await zk.sendMessage(origineMessage, { text: frames[0] });

        for (let i = 1; i < frames.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            await zk.sendMessage(origineMessage, {
                text: frames[i],
                edit: loadingMessage.key,
            });
        }

    } catch (error) {
        console.error("Erreur lors de la simulation du chargement :", error);
        await zk.sendMessage(origineMessage, { text: "Une erreur s'est produite lors du chargement. 😢" });
    }
}


zokou(
    { nomCom: 'load', categorie: 'MON-BOT' }, 
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, verifGroupe } = commandeOptions;

        // Suppression de la ligne qui empêche l'exécution dans les groupes
        // if (verifGroupe) return;

        await simulateLoading(zk, dest, ms);
    }
);