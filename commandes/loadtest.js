/*const { zokou } = require('../framework/zokou');

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


zokou(
    {
        nomCom: 'load2',
        categorie: 'MON-BOT'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            const lienImage = 'https://files.catbox.moe/ol0i4m.jpg';
            const lienGif = 'https://files.catbox.moe/0ua28c.mp4';

            const frames = [
                "▱▱▱▱▱▱▱▱▱▱ 🔷0%",
                "▰▱▱▱▱▱▱▱▱▱ 🔷10%",
                "▰▰▱▱▱▱▱▱▱▱ 🔷20%",
                "▰▰▰▱▱▱▱▱▱▱ 🔷30%",
                "▰▰▰▰▱▱▱▱▱▱ 🔷40%",
                "▰▰▰▰▰▱▱▱▱▱ 🔷50%",
                "▰▰▰▰▰▰▱▱▱▱ 🔷60%",
                "▰▰▰▰▰▰▰▱▱▱ 🔷70%",
                "▰▰▰▰▰▰▰▰▱▱ 🔷80%",
                "▰▰▰▰▰▰▰▰▰▱ 🔷90%",
                "▰▰▰▰▰▰▰▰▰▰ 🔷100%",
            ];

            try {
                let imageMessage = await zk.sendMessage(dest, { text: frames[0] });

                for (let i = 1; i < frames.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await zk.sendMessage(dest, {
                        text: frames[i],
                        edit: imageMessage.key,
                    });
                }

                // On attend un petit moment pour que l'effet soit visible
                await new Promise(resolve => setTimeout(resolve, 500));

                // On envoie maintenant le GIF et l'image
                await zk.sendMessage(dest, {
                    video: { url: lienGif },
                    gifPlayback: true,
                    caption: ""
                });

                await zk.sendMessage(dest, {
                    image: { url: lienImage },
                    caption: ""
                });

            } catch (error) {
                console.error("Erreur lors de l'animation :", error);
                await zk.sendMessage(dest, { text: "Une erreur s'est produite. 😢" });
            }
        }
    }
);



zokou(
    {
        nomCom: 'load3',
        categorie: 'MON-BOT'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            const liens = [
                'https://files.catbox.moe/1nvz4f.jpg', 
                'https://files.catbox.moe/qihh25.jpg',
                'https://files.catbox.moe/55skbu.jpg', 
                'https://files.catbox.moe/69eev8.jpg', 
                'https://files.catbox.moe/6ckd48.jpg', 
                'https://files.catbox.moe/qnjv5p.jpg', 
                'https://files.catbox.moe/y90lsj.jpg'
            ];

            for (const lien of liens) {
                await zk.sendMessage(dest, { image: { url: lien }, caption: "" }, { quoted: ms });
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
);*/