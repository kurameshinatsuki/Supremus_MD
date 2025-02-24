/*const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'test_abm',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        // Vérification si l'utilisateur a entré des noms de joueurs
        if (!arg || arg.length === 0) {
            return repondre("⚠️ Veuillez entrer les noms des joueurs (ex: Boruto vs Kawaki).");
        }

        // Liste des arènes avec leurs images associées
        const arenes = [
            { nom: "Onigashima", url: "https://i.ibb.co/mDvjVL0/20240925-123112.jpg" },
            { nom: "Exorcism School", url: "https://i.ibb.co/1z3LZhZ/20240925-121617.jpg" },
            { nom: "Plaine", url: "https://i.ibb.co/4R0WptC/20240925-114159.jpg" },
            { nom: "Fairy Tail Building", url: "https://i.ibb.co/sq8ymQC/20240925-113237.jpg" },
            { nom: "Orphelinat", url: "https://i.ibb.co/qB4ymwx/20240925-113608.jpg" }
        ];

        // Liste des latences possibles
        const latences = [
            "Retard de 200⚡",
            "Section 1 Annuler",
            "Nul"
        ];

        // Liste des conditions météorologiques possibles
        const meteos = [
            "Ensoleillé ☀️",
            "Pluvieux 🌧️",
            "Orageux ⛈️"
        ];

        // Sélection aléatoire des paramètres
        const arene = arenes[Math.floor(Math.random() * arenes.length)];
        const latence = latences[Math.floor(Math.random() * latences.length)];
        const meteo = meteos[Math.floor(Math.random() * meteos.length)];

        // Mélange des joueurs pour déterminer l'ordre de jeu
        let joueurs = arg.join(" ").split(" vs ");
        joueurs = joueurs.map(j => j.trim());
        joueurs = joueurs.sort(() => Math.random() - 0.5); // Mélange aléatoire

        // Génération du message de la fiche de combat
        const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
 🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
👊 𝐀𝐧𝐢𝐦𝐞 𝐁𝐚𝐭𝐭𝐥𝐞 𝐌𝐮𝐥𝐭𝐢𝐯𝐞𝐫𝐬 👊
═══════════════════
*\`👤 ${joueurs[0]} :\`* 
> ❤️: 100 | 🌀: 100 | 🫀: 100

                     *𝙑𝙎*

*\`👤 ${joueurs[1] || "À définir"} :\`* 
> ❤️: 100 | 🌀: 100 | 🫀: 100
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
          *\`FIGHTING RULE\`*

- *Wtf :* MC
- *Latence :* ${latence}
- *Items :* (voir perso)
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*🔄 Tourneur :* ${joueurs.join(" → ")}
*⚖️ Arbitre :* Auto Modo
*🌦️ Météo :* ${meteo}
*🌍 Zone :* ${arene.nom}
*📌 Distance initiale :* 5m
*⭕ Statistiques :* 50m
*⏱️ Délai :* 6 + 2min max
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*🌍 Environnement :* (voir image)

▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*Maîtrise initiale "⭐" : 5.*
> *❌ Média Non Descriptif :* -1⭐
> *❌ Pavé Lassant :* -2⭐
> *❌ Stats Incorrectes :* -1⭐
═══════════════════
> *🥇 Easy Win: 3:* Victory.
> *🥈 Medium Win: 2:* déf +30%🫀
> *🥉 Hard Win : 1:* def +50%🫀 & -70%❤️
> *🏅 Perfect Win: 5:* Stats no variation.
═══════════════════
> *⚠️ Si vous achevez l'adversaire d'un seul coup, c'est un "ONE SHOT" +2⭐. Si vous l'achevez en full power, c'est "RAMPAGE" +2⭐. Et si vous gagnez contre un personnage de rang supérieur, c'est "MONSTER KILLER" +4⭐.*
═══════════════════
> *⏱️ DELAY:* Si vous ne parvenez pas à battre l'adversaire avant la fin du compteur, la victoire revient au joueur en meilleure posture *(stats ou domination).*
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;

        // Envoi de l'image de l'arène avec la fiche de combat
        zk.sendMessage(dest, { image: { url: arene.url }, caption: msg }, { quoted: ms });
    }
);*/