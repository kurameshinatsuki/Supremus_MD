const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'speedrush',
        categorie: 'rpss'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/68927a30b61a341a1768f.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░░░
═════════════════════
        *| SPEED RUSH : RULE |* 
═════════════════════

*📇 RÈGLES DE BASE 📇:*

Chaque tour se compose de deux (2) sections et d'une zone info. Vous pouvez effectuer une (1) action par section (ex: accélération, ralentissement, utilisation de gadgets, etc...) et les actions doivent être clairement définies pour indiquer vos intentions.

*🛠 CAR STATISTICS ️🛠️*

- *Vitesse (⏫):* Détermine la rapidité du véhicule sur le circuit. La vitesse sur le circuit est convertie à 1km/s pour 100km/h, donc si vous roulez à 160km/h, la vitesse sur le circuit sera de 1,6km/s. La vitesse normale et maximale d'un véhicule est de 280km/h.

- *Maniabilité (🛞):* Détermine la capacité à manœuvrer le véhicule. Vous pouvez éviter les obstacles statiques ou mobiles lorsqu'ils sont hors de votre trajectoire. Par exemple, si vous roulez à 220km/h et rencontrez un obstacle à 1,8km sur votre ligne, c'est la collision, sauf si vous réduisez la vitesse en dessous de 180km/h et changez de ligne.

- *Résistance (🚘):* Indique la robustesse du véhicule. Percuter de simples obstacles vous fait perdre -20🚘 (panneau, collision, barrière en bois, feu de signalisation, etc...). Les obstacles solides coûtent -40🚘 (véhicule stationné, petits blocs, barrage en métal, etc...) et réduisent la vitesse de 50km/h. Les obstacles plus solides coûtent -60🚘, réduisent la vitesse de 100km/h et peuvent causer un crash, une collision en moto et c'est le crash assuré. Lorsque la résistance tombe à 0%, le véhicule explose.

- *Turbo (🛢️):* Permet d'augmenter la vitesse durant 1 tour. Le mode turbo compte 2 phases : la phase incomplète (jaune orangé) qui propulse votre véhicule jusqu'à 100km/h de plus pour -20 et la phase complète (bleu) qui propulse votre véhicule jusqu'à 200km/h de plus pour -40.
  *🔔 Vous ne pouvez passer à la phase complète sans être passé par la phase incomplète.*

- *Carburant (⛽):* Permet au véhicule de fonctionner. Lorsque votre vitesse est inférieure à 200km/h, vous perdez -10⛽. Lorsqu'elle est supérieure à 200km/h, vous perdez -20⛽. Lorsque votre carburant tombe à 0, c'est la fin.

*⚠️ TRACK DRIVING ⚠️*

1. *Virages :* Les virages sont une forme d'obstacles dangereuse car elles peuvent facilement causer un crash. Vous pouvez drifter un virage jusqu'à 90° quelle que soit votre vitesse. Un drift à plus de 200km/h vous fait dériver de 4m sur le côté, et un virage à plus de 90° est possible seulement si la vitesse est inférieure à 200km/h.

2. *Montées :* Les montées vous propulsent en hauteur et nécessitent une vitesse supérieure à 200km/h. Une propulsion peut se terminer en catastrophe si la vitesse est mal gérée, augmentant votre vitesse de 100km/h. Si vous roulez trop vite ou trop lentement, vous risquez de rater la piste d'atterrissage et de provoquer un crash.

3. *Descentes :* Les descentes vous font gagner en vitesse, mais peuvent se terminer en catastrophe si elles ne sont pas bien gérées. Elles augmentent la vitesse de 100km/h. Si vous roulez trop vite ou trop lentement, vous risquez de rencontrer des obstacles et de provoquer un accident.

4. *Lignes :* Les circuits sont divisés en plusieurs voies. Les petites voies ont deux lignes (⬇️,⬆️), les voies moyennes ont quatre lignes (⬇️⬇️,⬆️⬆️), et les grandes voies ont six lignes (⬇️⬇️⬇️, ⬆️⬆️⬆️), sauf les voies non bitumées. Elles mesurent 3m de large avec des obstacles en bordure (barrières, trottoirs, bancs, barricades, etc...) et les véhicules mesurent 2m de large.

*⚠️ Zones À Risques ⚠️:*

- *Section ensablée :* Réduit la vitesse de 50km/h et peut enfoncer le véhicule si la vitesse est inférieure à 280km/h.

- *Section glissante :* Perturbe la maniabilité du véhicule. Un virage ou un dérapage à plus de 200km/h peut entraîner un crash.

- *Section piège :* Zones imprévisibles avec des événements soudains. Attention aux obstacles et aux dangers inattendus.

*📦 RACING GADGETS 📦*

- *🛢️ Turbo Thunder* : Restaure le turbo du véhicule de 50%.

- *💠 Velocity Thruster* : Propulse le véhicule à 200km/h pendant une (1) section.

- *🛡️ Guardian Shield* : Protège le véhicule des dommages pendant deux (2) tours.

- *🪞 Mirror Armor* : Reflète les dommages causés par les autres concurrents pendant deux (2) tours.

- *🎳 Plasma Cannon* : Tire des projectiles à 200km/h sur une ligne droite, infligeant -50 au véhicule adverse s'il est touché.

- *🔊 Shockwave Blaster* : Déclenche une onde de choc pour ralentir les concurrents à proximité de 100km/h.

- *🔧 Instant Repair* : Répare instantanément 100% des dommages du véhicule.

- *♾️ Revival* : Ramène votre véhicule dans la course et restaure ses statistiques d'origine.

═════════════════════
░░░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);

zokou(
    {
        nomCom: 'yugioh',
        categorie: 'rpss'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/f6a9287d4c008ac6dfee0.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░░░
═════════════════════
*RÈGLES POUR LE SPEED DUEL !*
═════════════════════
            *👤 DUELLISTE 👤*

*💓 Points de Vie (LP) :*
   - Chaque joueur commence avec 4000 LP. Si vos LP tombent à zéro ou ne pouvez plus piocher de carte, vous perdez le Duel.

*🎴 Extra Deck :*
   - Les Monstres Fusion (cartes violettes), comme *Dragon Millénaire*, sont placés dans la zone Extra Deck.
   - Votre Extra Deck peut contenir entre 0 et 5 cartes.

*🀄 Deck Principal :* 
   - Votre Deck Principal contient 30 cartes.
   - Les cartes de votre Deck Principal doivent être mélangé avant le Duel (mais pas votre Extra Deck).
   - Vous ne pouvez pas avoir plus de 3 exemplaires de la même carte dans votre Deck Principal.

*🃏 Carte Compétence :*
   - Chaque joueur choisit une Carte Compétence avant le Duel et la place face verso (face cachée) devant lui.

*🆚 Début du Duel :* 
   - Chaque joueur pioche les 5 premières cartes de son Deck pour constituer sa main de départ.

*🔄 Tour de Jeu :*
   - Au début de votre tour, vous piochez autant de carte possible jusqu'en avoir 5 en main, donc s'il vous 2 cartes de votre précédent tour vous en piocher 3 ce tour ci.
   - Ensuite, vous pouvez Poser des Pièges, jouer des Magies, et Invoquer un monstre dans l'ordre que vous voulez.
   - Après cela, vous pouvez attaquer.
   - Lorsque vous avez fini d'attaquer, votre tour prend fin et celui de votre adversaire commence.

*🆎️ Invocation et Pose de Monstres :*
   - Vous pouvez Invoquer Normalement un monstre depuis votre main en Position d'Attaque (position horizontale), ou Poser un monstre face verso en Position de Défense (position verticale).
   - Regardez le nombre d'étoiles sur la carte représentant le Niveau du monstre que vous Invoquez :
     - *Niveau 1 à 4 :* Invoquez ou Posez sans Sacrifice.
     - *Niveau 5 et 6 :* Sacrifiez 1 monstre.
     - *Niveau 7 ou plus :* Sacrifiez 2 monstres.
   - Les Invocations Spéciales ne nécessitent pas de Sacrifices et ne comptent pas dans la limite d'Invocation/Pose Normale.

*✳️ Cartes Magie et Piège :*
   - Les Magies peuvent être jouées directement depuis votre main dans la Zone Magie & Piège. Suivez les instructions de la carte.
   - Les Magies de Terrain sont placées dans la Zone Terrain.
   - Les Magies et Pièges d'Équipement ou Continus restent en jeu dans la Zone Magie & Piège.
   - Les autres Magies et Pièges vont au Cimetière après usage.

*🪤 Cartes Piège :*
    - Les Pièges doivent être Posés face verso. Ils peuvent être activés à partir de n'importe quel tour après avoir été Posés (le vôtre OU celui de votre adversaire).
    - Après activation et usage, envoyez-les au Cimetière.

*🔥 Phase de Combat :*
    - Chaque monstre en Position d'Attaque peut attaquer une fois par tour.
    - Choisissez un monstre adverse à attaquer. Si votre adversaire n'a pas de monstre, vous pouvez attaquer directement ses LP.
    - Lors d'une attaque directe, votre adversaire perd des LP égaux à l'ATK de votre monstre.
    - Si vous attaquez un monstre face verso, retournez-le face recto. S'il survit au combat, il reste face recto.

════════════════════
La *Rôle Play Station Supremus* est plus qu'un jeu, c'est une expérience !!
════════════════════
░░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);

zokou(
    {
        nomCom: 'yugimodo',
        categorie: 'rpss'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/1a63d9f43d5620d630e01.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░░░
═════════════════════
          *🛂 MODERATION 🛂*
═════════════════════

> ⚠️ Les duellistes doivent présenter leur deck mélanger dans le ib/dm de l'arbitre, vous pioché du haut vers le bas si vous le faites barré les cartes pioché, les cartes face cachée ou tout autre action dissimulé doit-être présenté dans le dm/ib de l'arbitre.

> 🪙 Les jeux pile ou face ce déroule comme suite: chaque joueur choisi (pierre/papier/ciseaux) et l'envoi dans le ib/dm de l'arbitre pour désigner le gagnant.
*Par exemple:*
J1: Ciseaux / J2: Papier (J1:Win)
J1: Pierre / J2: Pierre (Reboot)

> 🎲 Le jeu des dés ce déroule comme suite: L'arbitre dispose les chiffres 1 à 6 en ordre aléatoire inconnu au joueur celui-ci choisi entre (A, B, C, D, E ou F) représentant l'un des chiffres disposé.
*Par exemple:* 

2 -> A
4 -> B
5 -> C
1 -> D
6 -> E
3 -> F

═════════════════════
░░░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'yugifight',
        categorie: 'rpss'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/6eb220225b4253e21b053.jpg';
            const msg = `.       *🎮 PAVÉ DE JEU 🎮*
░░░░░░░░░░░░░░░░░░░
═══════════════════
>> *[ ID Player ]*

💬 

> .

> .

*⭕ Zone Terrain:* 
*🎴 Extra Deck:* 
*🀄 Monstre Main:* 
*⚠️ Magie & Piège:* 
*🀄 Deck Main:* 
*🪦 Cimetière:* 
░░░░░░░░░░░░░░░░░░░
*❤️ Life Points:* 4000
░░░░░░░░░░░░░░░░░░░
═══════════════════
   『 🪀 𝗦𝗨𝗣𝗥𝗘𝗠𝗨𝗦™ 🪀 』`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);

zokou(
    {
        nomCom: 'fightspeed',
        categorie: 'rpss'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/d261050b624c7f5a7d104.jpg';
            const msg = `.  🎮 𝐏𝐀𝐕𝐄 𝐃𝐄 𝐂𝐎𝐔𝐑𝐒𝐄 🎮
░░░░░░░░░░░░░░░░░░░
═══════════════════
>> *[ Player Name ]*

💬 

▪️ 

▪️

*📌 Distance:* 
░░░░░░░░░░░░░░░░░░░
🚘: 100% 🛢️: 100% ⛽: 100%
░░░░░░░░░░░░░░░░░░░
═══════════════════
   『 🪀 𝗦𝗨𝗣𝗥𝗘𝗠𝗨𝗦™️ 🪀 』`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);
