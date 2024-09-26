const { zokou } = require('../framework/zokou');


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