const { zokou } = require('../framework/zokou');


zokou(
    {
        nomCom: 'origamy_movie',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://i.ibb.co/TMQjn5H/Image-2024-09-26-17-05-58.jpg';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*`Origamy World:`* The Movie
═══════════════════
*🎞️ `Prologue :`* La naissance d'une légende

> Le film commence avec une narration épique sur la création du monde d'Origamy. Des images des divinités, démons, humains et monstres en guerre traversent l'écran. L'Ordre d'Asura, protecteur de la paix, est introduit. Le spectateur apprend que le Royaume d'Asura a longtemps été un havre de paix, mais une ancienne prophétie annonce le retour des démons dans la région d'Astoria.

> La scène se termine avec la découverte d'un mystérieux artefact dans les *Ruines de Valoria* par un groupe d'explorateurs, révélant des visions troublantes dans la *Grotte des Songes*.
═══════════════════
*`Section 1 :`* La capitale menacée

> L'histoire s'ouvre sur *Astoria*, la capitale du royaume d'Asura. Le protagoniste, un jeune homme *"Kaelan"* en formation à l' *Académie d'Arcana*, entend parler des récentes tensions à la frontière.

> Des rumeurs circulent sur l'apparition d'une force maléfique dans le *Cimetière des Héros* et des disparitions mystérieuses près du *Sanctuaire d'Iris*. Kaelan est convoqué au *Centre de Commandement* pour enquêter.
═══════════════════
*`Section 2 :`* L' Alliance !

> *MALDRACK & ELOWEN :* Kaelan explore les *Ruines de Valoria* à la recherche d'un artefact légendaire lorsqu'une embuscade démoniaque le surprend. Envoyées par *"Maldrak"* (Seigneur Démoniaque), les créatures le forcent à lutter pour sa vie. Soudain, *"Elowen"*, une jeune magicienne, intervient avec des sorts redoutable, sauvant Kaelan. Elle traquait aussi l'artefact, croyant que leur destin était lié par la même prophétie. Convaincue de leur cause commune, elle s'allie à lui.

> *THORNE :* En route vers Astoria, ils traversent la *Forêt de Fenrieth* où *"Thorne"*, un épéiste exilé et rongé par son passé, mène une vie de mercenaire. Quand Thorne les attaquent, Elowen comprends qu'il est possédé par un démon, Kaelan le délivre et lui propose de les rejoindre. Mais ce dernier hésite, il est finalement convaincu par la promesse de Kaelan de rédemption en combattant Maldrak.

> *SYLIS :* En approchant du *Village d’Ashcroft*, le trio découvre une horde de brigands menaçant les habitants. *"Sylis"*, un archer solitaire au sens aigu de la justice, défend le village avec une précision impressionnante. Kaelan voit en lui un atout crucial, et en échange de la protection des villages, Sylis accepte de se joindre à eux.

> *NYRA :*  Arrivés à Astoria, Kaelan et son équipe se retrouvent au cœur d'une altercation sur le marché où *"Nyra"*, une voleuse redoutable, est accusée d’avoir dérobé un artefact rare. Bien qu’elle le nie au départ, elle admet l’avoir vendu en comprenant son importance. Animée par une vengeance personnelle contre Maldrak, elle rejoint le groupe, déterminée à le faire tomber.

> L’alliance est scellée. Leur quête pour arrêter Maldrak prend une nouvelle dimension, chaque membre apportant ses talents uniques pour affronter les ténèbres qui s’abattent sur Asura. 
═══════════════════
*` Section 3 :`* L'invasion démoniaque

> Alors que le groupe progresse dans son enquête, une force démoniaque, dirigée par un puissant seigneur des démons, commence à envahir la région d'Asura. Des scènes d'attaque montrent les Ruines de Valoria sous le feu ennemi, et l'armée d'Astoria se prépare à défendre la capitale dans une grande bataille au *Colisée d'Aurelius*.

> Kaelan et son équipe interviennent pour participer à la défense du *Palais Royal*, qui est également attaqué.
═══════════════════
*`Section 4 :`* La bataille pour Astoria

> Dans un affrontement épique, l'armée du royaume défend les murs d'Astoria, tandis que l'équipe du héros tente de repousser les envahisseurs au sein du Palais Royal et de la capitale. Des révélations sur le véritable pouvoir de l'artefacts trouvés dans les Ruines de Valoria plongent nos héros dans une lutte désespérée.

> La bataille atteint son paroxysme dans la *Cour d'Honneur*, où le héros doit affronter *"Gorran"* un lieutenant démoniaque redoutable.
═══════════════════
*`Section 5 :`* Le sacrifice et la victoire

> Après de nombreuses pertes et sacrifices, le protagoniste, ayant maîtrisé de nouvelles compétences mystiques, mène l'équipe dans une dernière bataille contre le seigneur démoniaque dans le *Temple de la Lune*, durant cette pleine lune. La scène finale présente un affrontement spectaculaire, où le héros doit choisir entre sauver ses camarades ou sceller définitivement les démons dans les Ruines de Valoria.

> Le film se termine sur une note douce-amère avec la victoire du royaume, mais la menace des démons reste en suspens, laissant la porte ouverte à une suite.
═══════════════════
*`Épilogue :`* Un nouveau départ

> Alors que la paix revient temporairement, le protagoniste est intronisé comme chevalier au Palais Royal. L'équipe se sépare, chacun retournant à ses responsabilités respectives. Le film se conclut avec une vue panoramique du *Bois de Lune* et du *Sanctuaire d'Iris*, où l’on voit un personnage mystérieux qui observe les événements de loin, laissant présager des aventures futures.
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);


zokou(
    {
        nomCom: 'map_astoria',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://i.ibb.co/TMQjn5H/Image-2024-09-26-17-05-58.jpg';
            const msg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*🗺️ MAP :* Astoria, Capitale
═══════════════════
       *\`⬇️ ZONE SUD ⬇️\`*

> *⛩️ Porte Principale:* Située dans la partie Sud de la ville, on y trouve un poste de contrôle avec 4 gardes asurans.
> 
> *🛞 Transport Public :* À 2km de la Porte Principale, ce lieu offre un service de navettes et de montures pour traverser la ville.
> 
> *🪦 Cimetière :* À 1,5km à l'Ouest du Transport Public, c'est un lieu de recueillement pour honorer les défunts, anciens guerriers et érudits.
> 
> *🌲 Bois Sacrés :* À 1km à l'Est du Transport Public, c'est une forêt protégée où les citoyens viennent se ressourcer.
═══════════════════
      *\`➡️ ZONE OUEST ➡️\`*

> *🏟️ Colisée d'Aurelius :* À 3km du Centre de Commandement, c'est un lieu pour les combats, tournois et défis.
> - *🕳️ Arène Souterraine :* Sous le Colisée, des combats illégaux sont organisés dans cette arène cachée.
> 
> *🏛️ Centre de Commandement :* À 1,5km du Bureau des Missions, il abrite les autorités locales et les stratèges militaires.
> - *🏹 Camp d'Entraînement :* Divers terrains et salles d'exercices réservés au Centre de Commandement.
> 
> *🎓 Académie d'Arcana :* À 0,5km au Nord-Est du Colisée, c'est l'institution académique la plus prestigieuse du royaume.
> 
> *🏢 Caserne de la Garde :* À 2km du Colisée, c'est le lieu d'entraînement et de résidence des gardes de la ville.
> 
> *🚧 Entrée Restreinte :* À 2,5km à l'Ouest du Colisée, un poste de contrôle sécurisé.
═══════════════════
      *\`↔️ CENTRE VILLE ↕️\`*

> *🛍️ Marché Central :* Au centre d'Astoria, à 5km de la Porte Principale, on y trouve des tavernes, boulangeries, ateliers de forge, et magasins.
> - *🍻 Luxury Taverne :* Un lieu de rassemblement pour boire, manger et socialiser (chambres 1️⃣, 2️⃣, 3️⃣).
> - *🥖 Baguette Dorée :* Une boulangerie où vous trouverez toutes sortes de produits.
> - *⚒️ Forge d'Edward :* Un endroit pour créer, améliorer ou réparer vos inventaires.
> - *🎎 Grand Bazar :* Un magasin spécialisé dans la vente divers items et autres.
> 
> *🏤 Bureau des Missions :* À 1,5km à l'Ouest du Marché Central, il attribue des missions et des rémunérations aux aventuriers.
> - *🏦 Banque des Trésors :* Garde des objets magiques inestimables.
> 
> *🫧 Bains de Sagacia :* À 2km à l'Est du Marché Central, c'est un lieu de détente et d'hygiène corporelle.
> 
> *🏬 Galerie des Arts :* À 1,5km au Nord du Marché Central, abritant des expositions et une grande bibliothèque.
> - *📚 Grande Bibliothèque :* Où l'on trouve diverses livres et manuscrits anciens.
> 
> *🏥 Centre Médical :* À 2km au Sud-Est du Marché Central, offrant divers soins de santé.
> - *⚗️ Laboratoire d'Oris :* Un laboratoire d'alchimie clandestin près du Centre Médical.
> 
> *🏘️ Quartier Résidentiel :* À 3km des parties Nord-Est et Nord-Ouest du Marché Central, résidences des habitants.
═══════════════════
           *\`⬅️ ZONE EST ⬅️\`*

> *🎮 Salle des Jeux :* À 1,5km à l'Ouest des Bains Royaux, avec une taverne luxueuse et divers jeux.
> 
> *🛀 Bains Royaux :* À 1,5km au Centre des Salle des Jeux, lieu d'hygiène corporelle et de détente.
> 
> *🏡 Résidences Nobles :* À 2km des Bains Royaux, abritant les hautes personnalités.
> 
> *🚪 Entrée Privée :* À 1,5km à l'Est des Résidences Nobles, avec un poste de contrôle particulier.
> 
> *🧵 Nobles Couture :* Près des Résidences Nobles, ateliers produisant des vêtements particuliers.
═══════════════════
       *\`⬆️ ZONE NORD ⬆️\`*

> *⛲ Cour d'Honneur :* À 2,5km au Sud du Palais Royal, avec la statue d'Iris et une grande place.
> 
> *🏰 Palais Royal :* S'étendant sur le Nord, Est et Ouest, à 1,5km de la Cour d'Honneur, il abrite la demeure du roi.
> - *🪴 Jardins Privés :* À l'Ouest du Palais, lieu de détente privé.
> - *🏯 Hall des Gardiens :* Au Sud-Est, quartier général de la garde royale.
> - *⚱️ Oubliettes :* Sous le Palais, prison réservée aux criminels les plus dangereux.
> - *🐎 Écuries Royales :* À l'Est, abritant les montures royales et un terrain d'exercice.
> - *🔭 Tour Astral :* Près des Jardins Privés, lieu d'étude des étoiles.
> - *🗡️ Arsenal Royaux :* Près du Hall des Gardiens, contenant l’armement le plus avancé du royaume.
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });

        }
    }
);