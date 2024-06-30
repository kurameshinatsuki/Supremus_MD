const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'origamystory',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/f73c8e53bef1628ed78e9.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
   *🌏 ORIGAMY WORLD 🌏*
═══════════════════

*◀️ Flash Back:* Il y a des millénaires, avant l'ère des royaumes, des entités puissantes aux pouvoirs incommensurables, considérées comme des dieux, façonnaient les terres comme on plie une feuille de papier, donnant vie à des montagnes majestueuses, des rivières sinueuses, et des forêts luxuriantes. Chaque région du monde fut influencée par un dieu différent, conférant à chaque territoire des caractéristiques uniques. Pendant l'Âge des Mythes, les dieux vivaient parmi les mortels, guidant les premières civilisations. Des temples leurs étaient dédiés, sous la protection divine, devenant des centres de savoir et de pouvoir. Les peuples apprenaient l'art du negũra, une forme de magie basée sur la concentration et la canalisation de l'énergie pour l'invocation de créatures, des objets, des pouvoirs. Le monde connaissait une période de paix et de prospérité jusqu'à ce que...

*⏯️ Le Grand Schisme :* ...le Grand Schisme éclate. Un conflit entre les dieux, chacun désirant imposer sa vision du monde, provoqua une guerre cataclysmique. Les cieux se fendirent, les montagnes tremblèrent, et les océans déchaînèrent leur furie. Les peuples, autrefois unis, furent divisés et forcés de choisir leur allégeance. Les dieux se retirèrent finalement du monde mortel, épuisés par leurs propres batailles. Leurs temples devinrent des ruines, des lieux de légendes et de mystères.

*⏭️ L'ère des Royaumes :* En 1000 ap. G.S, les mortels se retrouvent seuls pour reconstruire leur monde. C’est le début de l’Ère des Royaumes. Les grandes puissances renaissent de leurs cendres, mais elles ne sont plus unies. Différents royaumes émergent, chacun revendiquant l'héritage des Dieux et l’art du Negũra. Les rivalités et les alliances se forment, et des guerres intermittentes éclatent. Aujourd'hui, Origamy est un monde de contrastes. Des royaumes puissants comme Asura et Pyrosia prospèrent, mais des régions entières restent marquées par les conflits passés. Les routes commerciales relient les cités, tandis que les légendes des Dieux et du negũra mystiques continuent d'inspirer les bardes et les sages. La paix reste précaire, menacée par des ambitions politiques, des factions rebelles, et les mystères non résolus de l'ancienne magie. Les habitants d'Origamy World vivent dans l'espoir de restaurer pleinement l'harmonie perdue, tout en étant prêts à défendre leurs terres contre les ténèbres qui pourraient resurgir à tout moment.

░░░░░░░░░░░░░░░░░░░
═══════════════════
*> 🏰 ASURA 🏰*

> *👥 Peuple :* Asurans
> *✨ Dinivité :* Iris, Déesse de la Force et de la Sagesse
> *📖 Particularités :* Les Asurans sont des guerriers et érudits, maîtres dans l'art du combat et de la stratégie. Leur société est basée sur l'honneur et la connaissance. La capitale, Astoria, est connue pour ses bibliothèques immenses et ses académies martiales.

*> 🏰 ZÉPHYR 🏰*

> *👥 Peuple :* Zephyriens
> *✨ Divinité :* Zeleph, Dieu du Vent et des Tempêtes.
> *📖 Particularités :* Les Zephyriens sont des navigateurs et des artistes, vivant principalement dans des cités flottantes et des îles célestes. Ils possèdent une affinité naturelle avec le vent et la météo, utilisant des cerfs-volants et des dirigeables magiques. Leur capitale, Zephyra, est une cité flottante suspendue par des courants aériens.

*> 🏰 TERRALIA 🏰*

> *👥 Peuple :* Terraliens
> *✨ Divinité :* Selenia, Déesse de la Terre et de la Fertilité.
> *📖 Particularités :* Les Terraliens sont des agriculteurs et des bâtisseurs, réputés pour leur connexion profonde avec la terre. Ils vivent dans des cités souterraines et des villages luxuriants. Leur société est axée sur l’harmonie avec la nature. La capitale, Terradia, est construite à l’intérieur d’une montagne.

*> 🏰 AQUALIS 🏰*

> *👥 Peuple :* Aqualins
> *✨ Divinité :* Aquarion, Dieu de l’Eau et des Océans.
> *📖 Particularités :* Les Aqualins sont des marins et des pêcheurs, habitant des villes portuaires et des cités submergées. Ils contrôlent les courants marins et peuvent respirer sous l'eau grâce à la magie aquatique. Leur capitale, Aquapolis, est une ville sous-marine protégée par un dôme magique.

*> 🏰 PYROSIA 🏰*

> *👥 Peuple :* Pyrosians
> *✨ Divinité :* Auriana, Déesse du Feu et de la Forge.
> *📖 Particularités : Les Pyrosians sont des forgerons et des artisans, experts en métallurgie et en forge magique. Ils vivent dans des cités volcaniques et des forteresses de lave. Leur société est centrée sur le feu et la création. La capitale, Pyropolis, est située à flanc de volcan et alimentée par des flux de magma.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapastoria',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/baefea97b8ba675750762.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️MAP :* Astoria, Capitale
═══════════════════
          *⬇️ Zone Sud ⬇️*

*> ⛩️ Porte Principale :* Située dans la partie Sud de la ville, on y trouve un poste de contrôle avec 4 gardes asurans.

*> 🛞 Transport Public :* Situé à 2km de la Porte principale dans la partie Centre, ce lieu offre un service de navettes et de montures pour traverser la ville.

*> 🪦 Cimetière :* Situé dans la partie Ouest à 1,5km du transport public, c'est un lieu de recueillement pour honorer les défunts, anciens guerriers et érudits.

*> 🌲 Bois Sacrés :* Situés dans la partie Est à 1km du transport public, c'est une forêt protégée où les citoyens viennent se ressourcer.

        *➡️ Zone Ouest ➡️*

*> 🏟️ Colisée d'Aurelius :* Situé dans la partie Centre à 3km du Centre de Commandement, c'est un lieu pour les combats, tournois et défis.

*> 🪧 Camp d'Entraînement :* Situé dans la partie Nord à 2km du Colisée, on y trouve divers terrains et salles d'exercices réservés au centre de commandement.

*> 🎓 Académie d'Arcana :* Située dans la partie Nord-Est à 0,5km du Colisée, du Camp et Centre de commandement, c'est l'institution académique la plus prestigieuse du royaume.

*> 🏛️ Centre de Commandement :* Situé dans la partie Est à 1,5km du Bureau des Missions, il abrite les autorités locales et les stratèges militaires.

*> 🛡️ Caserne de la Garde :* Située dans la partie Nord-Ouest et Sud-Ouest à 2km du Colisée, c'est le lieu d'entraînement et de résidence des gardes de la ville.

*> ⛩️ Entrée Restreinte :* Située dans la partie Ouest à 2,5km du Colisée, on y trouve un poste de contrôle sécurisé.

        *↔️ Centre Ville ↕️*

*> 🛍️ Marché Central :* Situé au centre d'Astoria, à 5km de la Porte principale, on y trouve des tavernes, boulangeries, ateliers de forge, et magasins.

*> 🏦 Bureau des Missions :* Situé dans la partie Ouest à 1,5km du Marché Central, il attribue des missions et des rémunérations aux aventuriers.

*> 🫧 Bains de Sagacia :* Situé dans la partie Est à 4km du Transport Public, c'est un lieu de détente et d'hygiène corporelle.

*> 🏬 Galerie des Arts :* Située dans la partie Nord à 1,5km du Marché Central, elle abrite des expositions et une grande bibliothèque.

*> 🏥 Centre Médical :* Situé dans la partie Sud-Est à 2km du Marché Central, il offre divers soins de santé.

*> 🏘️ Quartier Résidentiel :* Situé dans les parties Nord-Est et Nord-Ouest à 3km du Marché Central, on y trouve les résidences des habitants.

*> 📚 Grande Bibliothèque :*
- Situées dans la partie Sud-Ouest à 1km du cimetière, elles abritent des documents et manuscrits anciens ainsi que très grand nombre de livres.

          *⬅️ Zone Est ⬅️*

*> 🏣 Salle des Jeux :* Située dans la partie Ouest à 1,5km du Marché Central, on y trouve une taverne luxueuse et divers jeux.

*> 🫧 Bains Royaux :* Situés dans la partie Centre à 2,5km du Marché Central, c'est un lieu d'hygiène corporelle et de détente.

*> 🏡 Résidences Nobles :* Situées dans les parties Nord et Sud à 2km des Bains Royaux, elles abritent les hautes personnalités.

*> ⛩️ Entrée Privée :* Située dans la partie Est à 1,5km des Résidences Nobles, on y trouve un poste de contrôle particulier.

         *⬆️ Zone Nord ⬆️*

*> ⛲ Cour d'Honneur :* Située dans la partie Sud à 2,5km du Marché Central, on y trouve la statue d'Iris et une grande place.

*> 🏰 Palais Royal :* Recouvrant la partie Nord, Est et Ouest, il est situé à 1,5km de la Cour d'Honneur, et abrite la demeure du roi.

*> 🪴 Jardins Privés :* Situés dans la partie Ouest du Palais, c'est un lieu de détente privé.

*> ⚔️ Hall des Gardiens :️* Situé dans la partie Sud-Est, c'est le quartier général de la garde royale.

*> 🐎 Écuries Royales :* Situées dans la partie Est du Palais, elles abritent les montures royales et un terrain d'exercice.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapregional',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/45767087652245f66fd7c.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Asura, Région
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏘️ Ville de Noralis :*
- Situé à 2 km au nord de la Ferme de Séraphine, une petite ville connue pour ses artisans et ses marchés.

*> 🚜 Ferme de Séraphine :*
- Situé à 3 km à l'est du Bois de lune, une ferme prospère produisant des fruits et légumes.

*> 🌲 Bois de Lune :*
- Situé à 1,5 km au nord-ouest du Village de Brisevent, une forêt dense célèbre pour ses clairières illuminées par la lune.

*> 🛖 Village de Brisevent :*
- Situé à 2 km à l'ouest des Ruines de Valoria, un village entouré de champs de blé et de moulins à vent.

*> 🏺 Ruines de Valoria :*
- Situé à 4 km au nord-est d'Astoria, la capitale, des ruines antiques riches en artefacts et histoires.

        *➡️ Zone Ouest ➡️*

*> 🌳 Forêt de Mirador :*
- Situé à 3 km à l'ouest du Plateau de l'Aube, une forêt abritant une flore et une faune diversifiées.

*> 🕍 Forteresse de Lorn :*
- Situé à 2 km au sud de la Forêt de Mirador, une ancienne forteresse, témoin de nombreuses batailles.

*> 🌄 Plateau de l'Aube :*
- Situé à 1 km au nord de la Vallée des Braves, un plateau offrant une vue panoramique sur les environs.

*> 🌾 Vallée des Braves :*
- Situé à 2 km à l'ouest d'Astoria, la capitale, une vallée célèbre pour ses prairies verdoyantes et ses monuments historiques.

       *↔️ Zone Centre ↕️*

*> 🏰 Astoria, Capitale :*
- Situé au point central de la région, La capitale d'Asura, centre de la vie politique, économique et culturelle.

          *⬅️ Zone Est ⬅️*

*> ⛰️ Colline des Anciens :*
- Une colline sacrée où les anciens sages tenaient leurs conseils. (3 km à l'est de la Forêt de Sylveria)

*> 🏯 Sanctuaire d'Iris :*
- Situé à 2 km au sud de la Colline des Anciens, un sanctuaire dédié à la déesse Iris, fréquenté par les pèlerins.

*> 🌳 Forêt de Sylveria :*
- Situé à 4 km au nord de la Ville de Drakenholm, une forêt ancienne peuplée d'arbres majestueux et de créatures mystiques.

*> 🏘️ Ville de Drakenholm :*
- Situé à 3 km à l'ouest du Marais de l'Ombre, une ville fortifiée connue pour ses marchés et ateliers d'artisanat.

*> 🌫️ Marais de l'Ombre :*
- Situé à 2 km à l'est de la Ville de Drakenholm, un marais mystérieux abritant des créatures étranges et des plantes rares.

         *⬇️ Zone Sud ⬇️*

*> 🛖 Village de Verdalia :*
- Situé à 3 km au nord des Montagnes de Fer, une ville au climat agréable, entourée de vergers et de vignes.

*> 🏔️ Montagnes de Fer :*
- Situé à 2 km au nord-est du Village de Pierrefeu, des montagnes riches en minerais et pierres précieuses.

*> 🏞️ Lac d'Azur :*
- Situé à 4 km au sud-ouest d'Astoria, la capitale, un lac aux eaux cristallines entouré de collines boisées.

*> 🛖 Village de Pierrefeu :*
- Situé à 1,5 km au sud des Montagnes de Fer, un village minier célèbre pour ses gisements de pierres précieuses.

═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapverdalia',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/2074f3fc3411ffb23aa2b.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Verdalia
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏛️ Centre de la Nature :* 
- Situé au centre de Verdalia, c'est un lieu de préservation de la faune et de la flore. (0 km)

*> 🌳 Parc Central :* 
- Situé à 0,5 km au nord du Centre de la Nature, ce parc est le cœur vert de la ville, avec des sentiers pour se promener et se détendre.

*> 🏥 Centre Médical de Verdalia :* 
- Situé à 1 km au nord du Parc Central, ce centre fournit des soins de santé aux habitants.

        *➡️ Zone Ouest ➡️*

*> 🏡 Quartier Résidentiel :* 
- Situé à 1,5 km à l'ouest du Centre de la Nature, on y trouve les maisons des citoyens de Verdalia.

*> 🏫 Académie de Verdalia :* 
- Située à 0,5 km au nord du Quartier Résidentiel, cette académie est connue pour son enseignement de qualité.

*> 🛖 Village Agricole :* 
- Situé à 2 km à l'ouest du Quartier Résidentiel, ce village est dédié à l'agriculture et à l'élevage.

       *↔️ Zone Centre ↕️*

*> 🌺 Jardin Botanique :* 
- Situé à 1 km à l'est du Centre de la Nature, ce jardin présente une variété de plantes locales et exotiques.

*> 🏰 Manoir de Verdalia :* 
- Situé à 1,5 km au sud du Jardin Botanique, c'est la résidence des gouverneurs de Verdalia.

*> 🛍️ Marché de Verdalia :* 
- Situé à 0,5 km au sud du Centre de la Nature, on y trouve des étals vendant des produits frais et artisanaux.

          *⬅️ Zone Est ⬅️*

*> 🏯 Temple de la Terre :* 
- Situé à 1 km à l'est du Jardin Botanique, ce temple est dédié aux esprits de la nature et est un lieu de culte important.

*> 🌾 Champs de Verdalia :* 
- Situés à 1,5 km à l'est du Temple de la Terre, ces champs sont cultivés par les villageois.

*> 🛡️ Garnison de Verdalia :* 
- Située à 2 km au sud-est du Temple de la Terre, cette garnison abrite les forces de défense locales.

         *⬇️ Zone Sud ⬇️*

*> 🏚️ Village Pêcheur :* 
- Situé à 1 km au sud du Manoir de Verdalia, ce village est spécialisé dans la pêche et le commerce de poissons.

*> 🏞️ Rivière de l'Aube :* 
- Située à 2 km au sud du Village Pêcheur, cette rivière traverse la région et est essentielle à l'irrigation des champs.

*> 🌲 Forêt de Lune :* 
- Située à 3 km au sud-est du Village Pêcheur, cette forêt est un lieu mystique et sacré.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'montagnedefer',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/5d289e2f4215197599cc4.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Montagnes de Fer
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> ⛏️ Mines des Montagnes :* 
- Situées au nord des Montagnes de Fer, ces mines sont exploitées pour leurs minerais. (0 km)

*> 🏚️ Campement des Mineurs :* 
- Situé à 1 km au sud des Mines des Montagnes, ce campement abrite les mineurs et leurs familles.

*> 🏠 Habitations des Forgerons :* 
- Situées à 0,5 km à l'ouest du Campement des Mineurs, ces habitations sont où résident les artisans.

       *↔️ Zone Centre ↕️*

*> 🏰 Forteresse de Fer :* 
- Située au centre des Montagnes de Fer, cette forteresse protège les mines et abrite les dirigeants locaux.

*> 🌋 Forge des Montagnes :* 
- Située à 0,5 km au nord-est de la Forteresse de Fer, cette forge est renommée pour ses armes et armures.

          *⬅️ Zone Est ⬅️*

*> 🌲 Forêt des Montagnes :* 
- Située à 1 km à l'est des Mines des Montagnes, cette forêt est riche en bois et gibier.

*> 🛡️ Poste de Garde :* 
- Situé à 0,5 km au sud-est de la Forteresse de Fer, ce poste surveille les frontières des Montagnes.

         *⬇️ Zone Sud ⬇️*

*> 🏞️ Lac de Cristal :* 
- Situé à 1,5 km au sud des Mines des Montagnes, ce lac est réputé pour ses eaux claires et poissonneuses.

*> 🛶 Port de Montagne :* 
- Situé à 2 km à l'est du Lac de Cristal, ce port permet le commerce avec les régions voisines.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapnoralis',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/2aa2265bf00846a8cb4fa.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Noralis
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏰 Palais de Noralis :* 
- Situé au nord de Noralis, ce palais est la résidence royale et le siège du gouvernement. (0 km)

*> 🏛️ Académie Royale :* 
- Située à 1 km au sud-est du Palais de Noralis, cette académie forme les futurs dirigeants et savants.

*> 🌳 Jardins Royaux :* 
- Situés à 0,5 km à l'ouest du Palais de Noralis, ces jardins sont un lieu de beauté et de tranquillité.

       *↔️ Zone Centre ↕️*

*> 🏫 Quartier des Marchands :* 
- Situé au centre de Noralis, ce quartier est le cœur économique de la ville.

*> 🏥 Hôpital Royal :* 
- Situé à 0,5 km au nord du Quartier des Marchands, cet hôpital offre des soins avancés aux citoyens.

          *⬅️ Zone Est ⬅️*

*> 🏠 Quartier Résidentiel :* 
- Situé à 1 km à l'est du Palais de Noralis, ce quartier abrite les habitants de la classe supérieure.

*> 🌲 Parc Urbain :* 
- Situé à 0,5 km au sud-est de l'Académie Royale, ce parc offre un espace de loisirs pour les résidents.

         *⬇️ Zone Sud ⬇️*

*> 🏞️ Lac de Noralis :* 
- Situé à 1,5 km au sud-est du Palais de Noralis, ce lac est un lieu de détente et de loisirs pour les habitants.

*> 🏘️ Quartier des Artisans :* 
- Situé à 2 km au sud-ouest du Palais de Noralis, ce quartier est où vivent et travaillent les artisans de la ville.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapbrisevent',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/5a9075bddc7c432eb168b.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Brisevent
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🌾 Champs de Blé :* 
- Situés au nord de Brisevent, ces champs sont essentiels pour la production de blé. (0 km)

*> 🏡 Maisons de Brisevent :* 
- Situées à 0,5 km au sud des Champs de Blé, ces maisons offrent un cadre pittoresque pour les habitants.

*> 🛖 Moulin à Vent :* 
- Situé à 1 km à l'ouest des Maisons de Brisevent, ce moulin est crucial pour la transformation du blé en farine.

       *↔️ Zone Centre ↕️*

*> ⛪ Église de Brisevent :* 
- Située au centre de Brisevent, cette église est un lieu de culte et de rassemblement pour les habitants.

*> 🏫 École de Brisevent :* 
- Située à 0,5 km au nord de l'Église de Brisevent, cette école offre une éducation aux enfants de la région.

          *⬅️ Zone Est ⬅️*

*> 🌲 Bois de Brisevent :* 
- Situé à 1 km à l'est de Brisevent, ce bois est idéal pour la chasse et la cueillette.

*> 🌳 Clairière de Brisevent :* 
- Située à 0,5 km au sud-est de l'Église de Brisevent, cette clairière est utilisée pour les rassemblements communautaires.

         *⬇️ Zone Sud ⬇️*

*> 🏞️ Rivière de Brisevent :* 
- Située à 1 km au sud de la ville, cette rivière est propice à la pêche et à la baignade.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mappierrefeu',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/87882c706f22e335c2dda.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Pierrefeu
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏔️ Mines de Pierrefeu :* 
- Situées au nord de Pierrefeu, ces mines sont exploitées pour extraire des pierres précieuses. (0 km)

*> 🏘️ Quartier des Mineurs :* 
- Situé à 1 km au sud des Mines de Pierrefeu, ce quartier abrite les travailleurs des mines.

*> 🛖 Forge de Pierrefeu :* 
- Située à 0,5 km à l'est du Quartier des Mineurs, c'est ici que les pierres précieuses sont transformées en bijoux et objets d'art.

       *↔️ Zone Centre ↕️*

*> 🏰 Château de Pierrefeu :* 
- Situé au centre de Pierrefeu, ce château est la résidence du seigneur local et abrite les administrations de la ville.

*> 🛍️ Marché de Pierrefeu :* 
- Situé à 0,5 km au nord-ouest du Château de Pierrefeu, ce marché est animé par le commerce des pierres précieuses et des produits locaux.

          *⬅️ Zone Est ⬅️*

*> 🌲 Forêt d'Émeraude :* 
- Située à 2 km à l'est de Pierrefeu, cette forêt est connue pour ses arbres aux feuilles émeraude brillantes et ses animaux rares.

*> 🌾 Ferme de Pierrefeu :* 
- Située à 1 km au sud-est du Château de Pierrefeu, cette ferme fournit des produits agricoles à la ville.

         *⬇️ Zone Sud ⬇️*

*> 🏞️ Cascade de Pierrefeu :* 
- Située à 1,5 km au sud de la ville, cette cascade est un lieu de beauté naturelle et de détente pour les habitants.

*> 🏚️ Village des Artisans :* 
- Situé à 2 km à l'est de la Cascade de Pierrefeu, ce village abrite les artisans qui créent des œuvres d'art avec les matériaux locaux.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapdrakenholm',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/da5a7e19bbf348a734f75.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Drakenholm
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏛️ Grand Marché :* 
- Situé au centre de Drakenholm, c'est le cœur commerçant de la ville. (0 km)

*> 🏰 Château de Drakenholm :* 
- Situé à 1 km au nord du Grand Marché, ce château est la résidence du seigneur local.

*> 🏫 Académie de Drakenholm :* 
- Située à 0,5 km au nord-est du Grand Marché, elle est réputée pour son enseignement en artisanat et en stratégie militaire.

        *➡️ Zone Ouest ➡️*

*> 🛡️ Caserne de la Garde :* 
- Située à 1,5 km à l'ouest du Grand Marché, cette caserne abrite les forces de défense de Drakenholm.

*> 🏚️ Quartier Artisan :* 
- Situé à 1 km à l'ouest du Grand Marché, on y trouve des ateliers de forgerons, de couturiers et d'autres artisans.

*> 🌳 Parc des Héros :* 
- Situé à 2 km au nord-ouest du Quartier Artisan, ce parc honore les héros de la ville avec des statues et des monuments.

       *↔️ Zone Centre ↕️*

*> 🏥 Centre Médical de Drakenholm :* 
- Situé à 0,5 km à l'est du Grand Marché, ce centre médical est équipé pour traiter les blessés et les malades.

*> 🏘️ Quartier Résidentiel :* 
- Situé à 1,5 km au sud-est du Grand Marché, c'est là que vivent les habitants de Drakenholm.

*> 🛍️ Place du Commerce :* 
- Située à 0,5 km au sud du Grand Marché, cette place est entourée de boutiques et de tavernes.

          *⬅️ Zone Est ⬅️*

*> 🏞️ Rivière de Drakenholm :* 
- Située à 1 km à l'est du Centre Médical, cette rivière est essentielle à l'approvisionnement en eau de la ville.

*> 🏯 Sanctuaire de l'Aube :* 
- Situé à 1,5 km à l'est du Quartier Résidentiel, ce sanctuaire est un lieu de culte et de méditation.

*> 🌾 Champs de Drakenholm :* 
- Situés à 2 km au sud-est du Sanctuaire de l'Aube, ces champs sont cultivés pour nourrir la population.

         *⬇️ Zone Sud ⬇️*

*> 🏚️ Village Agricole :* 
- Situé à 2 km au sud de la Place du Commerce, ce village est dédié à l'agriculture et à l'élevage.

*> 🏞️ Lac de Drakenholm :* 
- Situé à 3 km au sud du Village Agricole, ce lac est une source de poisson et un lieu de détente.

*> 🌲 Forêt de l'Ombre :* 
- Située à 2,5 km au sud-est du Village Agricole, cette forêt est réputée pour ses créatures mystérieuses.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapmirador',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/f036c850931020f7d97df.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Forêt de Mirador
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🌲 Clairière des Anciens :* 
- Située au centre de la forêt, cette clairière est un lieu de rassemblement. (0 km)

*> 🏕️ Campement des Éclaireurs :* 
- Situé à 0,5 km au nord de la Clairière des Anciens, ce camp est utilisé par les explorateurs.

*> 🌳 Arbre Sacré :* 
- Situé à 1 km au nord-est du Campement, cet arbre est vénéré par les druides.

        *➡️ Zone Ouest ➡️*

*> 🏞️ Rivière Cristalline :* 
- Située à 1,5 km à l'ouest de la Clairière des Anciens, cette rivière traverse la forêt.

*> 🐺 Territoire des Loups :* 
- Situé à 2 km à l'ouest de la Rivière Cristalline, cette zone est connue pour sa population de loups.

*> 🌾 Champs de Baies :* 
- Situés à 1 km au sud-ouest du Territoire des Loups, ces champs sont riches en baies sauvages.

       *↔️ Zone Centre ↕️*

*> 🏡 Hameau Forestier :* 
- Situé à 1 km à l'est de la Clairière des Anciens, ce hameau abrite des habitants de la forêt.

*> 🛖 Maison des Sages :* 
- Située à 0,5 km au sud-est du Hameau Forestier, cette maison est le lieu de résidence des anciens.

*> 🪓 Scierie de Mirador :* 
- Située à 1,5 km au sud du Hameau Forestier, cette scierie fournit du bois à la région.

          *⬅️ Zone Est ⬅️*

*> 🏞️ Étang des Nymphes :* 
- Situé à 1 km à l'est de la Scierie, cet étang est connu pour ses eaux claires et ses nymphes mystiques.

*> 🏚️ Cabane du Chasseur :* 
- Située à 1,5 km au nord de l'Étang des Nymphes, cette cabane est utilisée par les chasseurs de la région.

*> 🌿 Clairière des Herboristes :* 
- Située à 2 km à l'est de la Clairière des Anciens, cette clairière est riche en plantes médicinales.

         *⬇️ Zone Sud ⬇️*

*> 🏕️ Campement Nomade :* 
- Situé à 2 km au sud de la Clairière des Anciens, ce campement est utilisé par les tribus nomades.

*> 🏞️ Rivière de la Lune :* 
- Située à 1,5 km au sud du Campement Nomade, cette rivière est réputée pour sa beauté nocturne.

*> 🌲 Bosquet Enchanté :* 
- Situé à 2,5 km au sud-ouest du Campement Nomade, ce bosquet est un lieu de magie et de mystères.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'mapsylveria',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/49c81bc0794598c959c0d.jpg';
            const msg = `░░░░░░░░░░░░░░░░░░░
═══════════════════
*🗺️ MAP :* Forêt de Sylveria
═══════════════════
         *⬆️ Zone Nord ⬆️*

*> 🏕️ Campement Sylvestre :* 
- Situé au centre de la forêt, ce campement est utilisé par les gardiens de la forêt. (0 km)

*> 🌳 Chêne Millénaire :* 
- Situé à 0,5 km au nord du Campement Sylvestre, cet arbre ancien est le cœur spirituel de la forêt.

*> 🌲 Bosquet Sacré :* 
- Situé à 1 km au nord-ouest du Chêne Millénaire, ce bosquet est un lieu de rituels.

        *➡️ Zone Ouest ➡️*

*> 🏞️ Rivière de Sylveria :* 
- Située à 1,5 km à l'ouest du Campement Sylvestre, cette rivière traverse la forêt.

*> 🐻 Territoire des Ours :* 
- Situé à 2 km à l'ouest de la Rivière de Sylveria, cette zone est habitée par des ours.

*> 🌿 Prairie des Herbes :* 
- Située à 1 km au sud-ouest du Territoire des Ours, cette prairie est riche en herbes médicinales.

       *↔️ Zone Centre ↕️*

*> 🏡 Village Sylvestre :* 
- Situé à 1 km à l'est du Campement Sylvestre, ce village abrite les habitants de la forêt.

*> 🛖 Maison des Druides :* 
- Située à 0,5 km au sud-est du Village Sylvestre, cette maison est le lieu de résidence des druides.

*> 🪓 Scierie de Sylveria :* 
- Située à 1,5 km au sud du Village Sylvestre, cette scierie fournit du bois à la région.

          *⬅️ Zone Est ⬅️*

*> 🏞️ Étang Enchanté :* 
- Situé à 1 km à l'est de la Scierie, cet étang est connu pour ses eaux magiques.

*> 🏚️ Cabane du Chasseur :* 
- Située à 1,5 km au nord de l'Étang Enchanté, cette cabane est utilisée par les chasseurs de la région.

*> 🌿 Clairière des Herboristes :* 
- Située à 2 km à l'est du Campement Sylvestre, cette clairière est riche en plantes médicinales.

         *⬇️ Zone Sud ⬇️*

*> 🏕️ Campement Nomade :* 
- Situé à 2 km au sud du Campement Sylvestre, ce campement est utilisé par les tribus nomades.

*> 🏞️ Rivière de la Lune :* 
- Située à 1,5 km au sud du Campement Nomade, cette rivière est réputée pour sa beauté nocturne.

*> 🌲 Bosquet Enchanté :* 
- Situé à 2,5 km au sud-ouest du Campement Nomade, ce bosquet est un lieu de magie et de mystères.
═══════════════════
░░░░░░░░░░░░░░░░░░░`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'story',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `.  🎮 𝗣𝗔𝗩𝗘 𝗗𝗘 𝗖𝗢𝗠𝗕𝗔𝗧 🎮
░░░░░░░░░░░░░░░░░░░
═══════════════════
>> *[Player Name]*

💬:

>

💬:

>

*💠 𝐏𝐨𝐮𝐯𝐨𝐢𝐫 :* Aucun
*📌 𝐃𝐢𝐬𝐭𝐚𝐧𝐜𝐞 :* [Destination]
░░░░░░░░░░░░░░░░░░░
❤️ : 100  🌀 : 050  🫀 : 000
💪 : 000  🏃 : 000  👊 : 000
🍽️ : 100  🍶 : 100
💰 : 000.000

📦Inventaires: 0/2
- 
- 
░░░░░░░░░░░░░░░░░░░
═══════════════════
        『 🎮 𝗣𝗟𝗔𝗬 𝗡𝗢 𝗟𝗜𝗠𝗜𝗧 🔝 』`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);

zokou(
    {
        nomCom: 'scenariste',
        categorie: 'Origamy-World'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `*🎭ORIGAMY WORLD STORY🌎*
░░░░░░░░░░░░░░░░░░░
═══════════════════
*⌚ Heure:* [montre requise]





░░░░░░░░░░░░░░░░░░░
═══════════════════
        『 🎮 𝗣𝗟𝗔𝗬 𝗡𝗢 𝗟𝗜𝗠𝗜𝗧 🔝 』`;
            zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   
        }
    }
);
