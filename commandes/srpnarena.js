const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'abm_rule',
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
);

zokou(
    {
        nomCom: 'abm_fight',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*........| 🎮 PAVE ABM 🎮 |......*
═══════════════════
*\`[Player Name] :\`*

> .

> .

> .

> .

*\`💠 Techniques\` :* 
*\`📌 Distance\` :* 
═══════════════════
> ❤️: 100 | 🌀: 100 | 🫀: 100
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);



zokou(
    {
        nomCom: 'yugi_fight',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*......| 🎴 SPEED DUEL 🎴 |.....*
═══════════════════
        *\`👤 Duelliste :\`* 

> .[Pioche / Effet de Carte]

> .[Invoquer/Poser/Activer/Changer]

> .[Attaquer / Calcul / Fin.]
═══════════════════
> *\`❤️ LIFE POINTS:\`* 4000
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'yugi_rule',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
 🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
           🎴 𝐒𝐩𝐞𝐞𝐝 𝐃𝐮𝐞𝐥 🎴
═══════════════════
*\`👤 DUELLISTE 1 :\`* 
> *LP❤️:* 4000 | *CM🀄:* 4

                     *𝙑𝙎*

*\`👤 DUELLISTE 2 :\`* 
> *LP❤️:* 4000 | *CM🀄:* 4
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 *\`⚠️ RÈGLES DU DUEL ⚠️\`*

- *Triche :* Game Over
- *Latence :* -1⭐
- *Zones de Monstres :* 3
- *Zones de Magie/Piège :* 3
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*🔄 Tourneur  :* 
*⚖️ Arbitre :* 
*⌚ Délai :* 8 + 2 min max
*💥 Conditions :* Life Points ou Deck out.
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*🧠 Maîtrise du Duel : 5⭐.*
> *❌ Mauvais Contre :* -1⭐
> *❌ Oubli de Règle :* -2⭐
> *❌ Tour Trop Long :* -1⭐
═══════════════════
> *🥇 Easy Win: 3:* Victory
> *🥈 Medium Win: 2:* Main Deck -20🀄
> *🥉 Hard Win: 1:* Main Deck -10🀄 ou - 2000LP❤️.
> *🏅 Perfect Win: 5:* LP❤️ no variation.
═══════════════════
> *⚠️ Si vous infligez des dégâts directs supérieurs à 2000 en un seul coup, c'est un "POWER STRIKE" +2⭐. Si vous gagnez avec une carte combo, c'est "COMBO MASTER" +2⭐.*
═══════════════════
> *⏱️ TEMPS LIMITE:* Si aucun des deux joueurs n'a gagné avant la fin du temps, le joueur avec le plus de Points de Vie gagne le duel.
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

// Jeu de pile ou face simple
zokou(
    {
        nomCom: 'coinflip',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;

        // Fonction pour simuler un pile ou face
        const flipCoin = () => (Math.random() < 0.5) ? 'Pile' : 'Face';
        
        const coin = flipCoin();
        
        // Message affichant le résultat du pile ou face
        const resultMessage = `🪙 Vous avez lancé une pièce et obtenu : ${coin}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

// Jeu de dés simple
zokou(
    {
        nomCom: 'dice',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;
        
        // Fonction pour lancer un dé à 6 faces
        const rollDice = () => Math.floor(Math.random() * 6) + 1;
        
        const dice = rollDice();
        
        // Message affichant le résultat du dé
        const resultMessage = `🎲 Vous avez lancé un dé et obtenu un ${dice}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

zokou(
    {
        nomCom: 'speed_fight',
        categorie: 'SPEED-RUSH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*......| 🚘 SPEED RUSH 🚘 |.....*
═══════════════════
           *\`🚏POSITION\` :* 

*\`[Pilote] :\`*

> .
═══════════════════
*\`💠 GADGET\` :* 
> .
> .
> .
═══════════════════
> 🚘: 100 | ⛽: 100 | 🛢️: 100
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'speed_rule',
        categorie: 'SPEED-RUSH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
 🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
          🏁 𝐒𝐩𝐞𝐞𝐝 𝐑𝐮𝐬𝐡 🏁
═══════════════════
*\`🏎️ PILOTE 1 :\`* 
> 🚘: 100 | ⛽: 100 | 🛢️: 100

*\`🏎️ PILOTE 2 :\`* 
> 🚘: 100 | ⛽: 100 | 🛢️: 100

*\`🏎️ PILOTE 3 :\`* 
> 🚘: 100 | ⛽: 100 | 🛢️: 100
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 *\`⚠️ RÈGLES DE COURSE ⚠️\`*

- *Saut de défi :* Reboot 🔄
- *Latence :* Tour Suivant
- *Gadgets :* 3 max
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*🔄 Tourneur :* 
*⚖️ Master :*
*🌦️ Conditions :* 
*🌐 Circuit :* 
*📌 Départ :* 
*⏱️ Latence :* 6 + 2min max
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*Maîtrise initiale "⭐" : 5.*
> *❌ Sortie de Piste :* -1⭐
> *❌ Collision obstacle :* -2⭐
> *❌ Saut de défi :* -1⭐
═══════════════════
> *🥇 1ère PLACE:* 3
> *🥈 2ème PLACE:* 2
> *🥉 3ème PLACE:* 1
═══════════════════
> *⚠️ Si vous dépassez vos adversaires dans le dernier tour, c'est un "OVERTAKE" +2⭐. Si vous finissez la course avec boost total, c'est "TURBO MASTER" +2⭐. Et si vous gagnez sans avoir reçu de dégâts au véhicule, c'est "KING OF THE ROAD" +4⭐.*
═══════════════════
> *⏱️ TEMPS LIMITE:* Si vous ne terminez pas avant la fin du chrono, la victoire revient au pilote avec le meilleur chrono ou la meilleure position.
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'speed_master',
        categorie: 'DRPN'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*......| 🏁 SPEED RUSH 🏁 |.....*
═══════════════════
> *\`[SECTION] :\`*

═══════════════════
      *\`RACING GADGETS\`*

> . *Ligne 1️⃣:* null
> . *Ligne 2️⃣:* null
> . *Ligne 3️⃣:* null
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'pave_story',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
..| *🎭 ORIGAMY STORY 🎭* |..
═══════════════════
          *\`[Player Name] :\`*

> .

> .

*\`💠 Pouvoirs\` :* 
*\`🌐 Position\` :* 
═══════════════════
> ❤️: 100 | 🌀: 100 | 🫀: 100
> 🍽️: 100 | 🍶: 100 | 🎭: 000
═══════════════════
     *\`📦INVENTAIRES:\`* 0/2

> . 000.000💰
> .
> .
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'story_master',
        categorie: 'DRPN'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
..| *🌐 ORIGAMY STORY 🌐* |..
═══════════════════
*\`PLAYER :\`*  

> .
═══════════════════
             *\`SECTION PNJ\`*

> .
> .
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);