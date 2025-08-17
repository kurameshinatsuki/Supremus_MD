const { zokou } = require('../framework/zokou');

zokou({
  nomCom: 'asura',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASURA  ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*\`↔️ CENTRE DE LA RÉGION ↕️\`*

> *🏰 Astoria, Capitale :* (X: 0, Y: 0)  
> Cœur politique et militaire d’Asura, ville cosmopolite abritant guildes de marchands, académies de magie et arènes de gladiateurs. Vous y pourriez y vivre paisiblement et trouver du travail.
> 
> *🌿 Plaine d’Eldoria :* (X: 0, Y: ±5)  
> Champs fertiles et pâturages bordant la capitale, peuplés de cerfs d’argent et de faucons royaux dressés par les chasseurs locaux. Vous pourriez y rencontré des marchands voyageurs en déplacement où mêmes des créatures sauvages.
> 
> *🌊 Rivière d’Azurine :* (X: 3, Y: 0)  
> Source de vie pour la région, où pêchent des pêcheurs spécialisés dans la capture des Carpes d’Azur, prisées pour leurs écailles scintillantes. Vous pourriez y péché 🎣 si vous possédez un appât.
> - *🌉 Pont de l’Alliance :* (X: 3, Y: -1)  
> Un pont monumental, symbole de paix entre les royaumes voisins. Vous devrez la traversé pour rejoindre Astoria ou la quitté.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASURA  ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
          *\`⬆️ ZONE NORD ⬆️\`*

> *🏞️ Vallée des Brumes :* (X: 0, Y: 12)  
> Lieu mystique où le brouillard ne se lève jamais. Les esprits des anciens rois y apparaissent parfois aux voyageurs égarés.  
> - *🔮 Autel des Échos :* (X: 1, Y: 13)  
> Un site sacré où les oracles viennent écouter les voix du passé.
> 
> *⚔️ Forteresse de Durnholm :* (X: 10, Y: 15)  
> Bastion imprenable, gardé par les Chevaliers de l’Ordre d’Argent.  
> - *🏹 Garnison Nord :* (X: 11, Y: 15)  
> Base de formation des archers d’élite, spécialisés dans les tirs à longue distance.
> 
> *🌊 Lac Céleste :* (X: -8, Y: 18)  
> Un lac pur aux eaux cristallines, réputé pour ses propriétés guérisseuses et ses poissons aux reflets d’étoile. 
> - *🎣 Village de Nymir :* (X: -8, Y: 17)  
> Communauté de pêcheurs vivant en harmonie avec les Ondins, esprits aquatiques du lac. Vous y trouverez les meilleurs remèdes naturels de tout Asura.
> 
> *🏔️ Monts de Glacepierre :* (X: -12, Y: 20)
> Une chaîne de montagnes glacées où règnent le froid et les créatures des neiges.
> - *🛡️ Bastion de Frigelance :* (X: -11, Y: 21)
> Gardé par les Guerriers du Givre, spécialistes en combat en milieu gelé.
> - *🌨️ Toundra de Givrebrume :* (X: -15, Y: 25)
> Une vaste plaine enneigée où les tempêtes de neige réduisent la visibilité à quelques mètres.
> - *🏚️ Refuge de l’Ourse :* (X: -16, Y: 26)
Un abri sommaire pour les voyageurs piégés par les blizzards.
> 
> *🏰 Fort de Givrecœur :* (X: -9, Y: 23)
> Une forteresse austère où la garde veille contre les créatures de glace.
> - *❄️ Garnison des Glaces :* (X: -8, Y: 24)
> Unité de soldats portant des armures renforcées contre le froid mordant.
> 
> *🌲 Forêt Boréale :* (X: -10, Y: 18)
> Une forêt dense d’arbres au tronc gelé, abritant des créatures mystiques et des esprits anciens.
> - *🏡 Village d’Icethorn :* (X: -11, Y: 19)
> Peuplé de chasseurs et de trappeurs vivant en symbiose avec la nature glaciale.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASURA  ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *\`⬇️ ZONE SUD ⬇️\`*

> *⛩️ Port de Vaeloria :* (X: 0, Y: -12)  
> Situé au sud de la capitale, ce port florissant est le centre du commerce maritime et de la défense navale d’Asura.  
> - *⚓ Chantier Naval :* (X: 1, Y: -12)  
> Ici, charpentiers de marine et forgerons travaillent à la construction et réparation des navires de commerce et de guerre. Vous pourriez y trouvé du Fer (🗜️).
> - *🏚️ Quartier des Dockers :* (X: -1, Y: -12)  
> Ce district animé abrite marins, pêcheurs et marchands venus de contrées lointaines. Taverne des Vents Salés, repaire de contrebandiers, y prospère.
> 
> *🏞️ Marais de Sélène :* (X: 5, Y: -9)  
> Zone marécageuse recouverte de brume, refuge d’alchimistes et de créatures telles que les Nagas des Brumes et les Grenouilles Luminescentes. Certains disent que les sorciers y pratiquent d’anciens rituels interdits. Vous pourriez y trouvé du poisson (🐟) et des herbes médicinales (🌿).
> 
> *🏡 Village de Loryn :* (X: -8, Y: -10)  
> Au sud-ouest d’Astoria, ce village agricole nourrit la capitale. Ses habitants sont réputés pour leur pain de blé doré et leur cidre de pomme. 
> - *🌾 Champs Dorés :* (X: -9, Y: -10)  
> Immenses champs de blé où travaillent fermiers et bœufs mécaniques enchantés.  
> - *🐄 Ferme d’Eldrin :* (X: -8, Y: -11)  
> Élevage de bovins à la viande réputée. La traite des vaches célestes, aux propriétés curatives, est un rituel sacré.
> Vous y trouverez toutes sortes de nourriture, fruits, légumes et viandes.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASURA  ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *\`⬅️ ZONE EST ⬅️\`*

> *🌲 Forêt de Sylvara :* (X: 10, Y: 0)  
> Vaste forêt magique, abritant les mystérieux Druides Sylvariens, les Lynx Ombrefeu et les Elfes Nocturnes.  
> - *🏕️ Camp des Veilleurs :* (X: 11, Y: 2)  
> Garnison de rôdeurs protégeant la forêt contre les braconniers et les pillards.  
> - *🦉 Clairière des Anciens :* (X: 9, Y: -1)  
> Sanctuaire naturel où d’anciens esprits murmurent des secrets aux élus.
> Vous y trouverez une variété de ressources, fruits(🍇), légumes(🥕), plantes médicinales (🌱), plantes toxiques (☠️), bois (🪵), mousses (🌿), animaux sauvages (🐺), créatures magiques (🦄) et herbes magiques (🪷). 
> 
> *🎭 Cité de Velmira :* (X: 20, Y: 0)  
> Berceau de la culture, connue pour ses festivals de masques et son art raffiné.  
> - *🏟️ Théâtre d’Opaline :* (X: 21, Y: 1)  
> Grand amphithéâtre où se jouent tragédies et épopées légendaires.  
> - *🖌️ Atelier d’Auriel :* (X: 20, Y: -1)  
> Lieu de création artistique où peintres et sculpteurs façonnent des œuvres enchantées.
> 
> *🏜️ Désert de Sablechant :* (X: 25, Y: -5)
> Une mer de dunes dorées où le vent chante des mélodies anciennes. On dit que les esprits des nomades reposent sous les vagues de sable. L’effet de canicule influence grandement vos hearts et soif mais aussi la disponibilité des ressources.
> - *🏯 Oasis de Kherem :* (X: 27, Y: -6)
> Un havre de fraîcheur où les voyageurs se reposent et échangent des histoires autour du feu.
> - *🐫 Camp des Sables Ardents :* (X: 26, Y: -4)
> Base des tribus nomades spécialisées dans l’élevage de chameaux rapides et résistants. Vous pourriez y loué une monture mais attention aux conditions de location.
> 
> *🏰 Citadelle d’Al-Zahir :* (X: 30, Y: -10)
> Une forteresse massive aux murs d’argile, défendant la région contre les bandits du désert.
> - *⚔️ Garnison des Sables :* (X: 29, Y: -11)
> Unité d’élite entraînée à la survie en milieu aride et aux combats sous la chaleur.
> 
> *🌅 Canyon de Feu :* (X: 23, Y: -3)
> Formation rocheuse aux teintes rouges et orangées, réputée pour ses tempêtes de sable brûlant.
> - *⛺ Camp des Prospecteurs :* (X: 22, Y: -2)
> Explorateurs et mineurs cherchant des pierres précieuses enfouies dans le sable.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASURA  ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
       *\`➡️ ZONE OUEST ➡️\`*

> *⛰️ Chaîne des Brisecimes :* (X: -15, Y: 0)  
> À l’ouest d’Astoria, ces montagnes escarpées regorgent de créatures féroces telles que les Griffons Sombres et les Trolls des Cavernes. Vous y trouverez des herbes médicinales (🌿) et des pierres (🪨).
> - *⛏️ Mine d’Onyx :* (X: -16, Y: -1)  
> Exploitation de minerais rares comme l’Onyx du Crépuscule et l’Argent Mystique, indispensables aux forgerons runiques. Vous y trouverez toutes sortes de minerais et métaux, diamant (💎), or (🥇), dwarven (🔩), mithril (🪝) et fer (🗜️).
> - *🏔️ Sommet du Titan :* (X: -15, Y: 3)  
> Le plus haut sommet de la région. Des ermites et moines Sha’kar y méditent sous des vents glacés. Vous pourriez y rencontré des créatures des neiges ou peut-être même le Grand Dragon Blanc aux Yeux Bleus.
> 
> *🏘️ Hameau d’Alderon :* (X: -12, Y: -7)  
> Village de bûcherons et d’artisans, réputé pour ses sculptures et ses arcs en bois d’if.  
> - *🪓 Scierie de Garn :* (X: -13, Y: -7)  
> Centre de transformation du bois, alimenté par des golems de pierre.  
> - *🎭 Taverne du Voyageur :* (X: -12, Y: -6)  
> Un lieu de halte où troubadours et mercenaires échangent nouvelles et secrets.
> 
> *🏚️ Ruines de Valmora :* (X: -15, Y: 5)  
> Vestiges d’une cité ancienne engloutie par la forêt. On dit que les âmes des anciens rois y errent encore, veillant sur un trésor oublié. Vous y trouverez sûrement des trésors mais peut-être aussi la mort.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : ASTORIA]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
          *\`⬇️ ZONE SUD ⬇️\`*

> *⛩️ Porte Principale :* (X: 0, Y: -5)
> L’entrée monumentale d’Astoria, protégée par quatre gardes asurans en faction. Les marchands et aventuriers y sont inspectés avant d’accéder à la ville.
> 
> *🛞 Transport Public :* (X: 0, Y: -7)
> Un carrefour de déplacements où navettes et montures sont à disposition. On y entend les crieurs vanter la rapidité de leurs services. Vous pouvez y loué une monture mais attention à respecter les conditions de location.
> 
> *🪦 Cimetière :* (X: 1.5, Y: -7)
> Lieu de repos des héros et érudits d’antan. Des statues et mausolées racontent les exploits de ceux qui ont marqué l’histoire d’Astoria.
> 
> *🌲 Bois Sacrés :* (X: 1, Y: -7)
> Forêt sanctuaire où les citoyens viennent méditer. Une rumeur parle d’un autel caché accordant des bénédictions à ceux qui le trouvent.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
        *\`➡️ ZONE OUEST ➡️\`*

> *🏟️ Colisée d'Aurelius :* (X: -4.5, Y: 0)
> Arène imposante où se déroulent tournois et combats de gladiateurs. Les tribunes vibrent sous les acclamations des spectateurs en quête de spectacle.
> - *🕳️ Arène Souterraine :* (X: -4.5, Y: 0)
> Cachée sous le Colisée, cette arène clandestine accueille des duels interdits. Ici, l’honneur importe peu : seule la victoire compte. Une certaine somme est réclamé pour démarrer un affrontement et vous ne pouvez généralement effectuer que 3 combats maximum par jours.
> 
> *🏛️ Centre de Commandement :* (X: -3, Y: 0)
> Cœur stratégique de la ville, où tacticiens et officiers planifient les défenses d’Astoria.
> - *🏹 Camp d’Entraînement :* (X: -3, Y: 0.5)
> Champ d’entraînement où soldats et aspirants viennent perfectionner leur art du combat.
> 
> *🎓 Académie d’Arcana :* (X: -4, Y: 0.5)
> Haut lieu du savoir, formant érudits et mages du royaume. Ses bibliothèques et laboratoires sont réputés pour leurs recherches en alchimie et arcanes.
> 
> *🏢 Caserne de la Garde :* (X: -6.5, Y: 0)
> Forteresse abritant la milice d’Astoria, avec dortoirs, forges et terrain de discipline.
> 
> *🚧 Entrée Restreinte :* (X: -7, Y: 0)
> Passage surveillé menant vers des installations militaires interdites au public.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
       *\`↔️ CENTRE VILLE ↕️\`*

> *🛍️ Marché Central :* (0, 0)
> Cœur commerçant d’Astoria, où résonnent les cris des marchands et artisans toujours bondées en journée.
> - *🍻 Luxury Taverne :* Un lieu de détente et de réunions, connu pour son hydromel et ses chambres confortables. Vous y trouverez Éloïse une jeune fille assez curieuse et bavarde qui fait généralement la serveuse, et son frère Lud un jeune homme timide et observateur qui s’occupe de la cuisson et autres ainsi que leur père Aeron un homme grand d’apparence colérique et radin il est généralement absent en raison de ses autres activités.
> - *🥖 Baguette Dorée :* Fournil réputé où s’entremêlent les arômes de pain chaud et de douceurs sucrées. Vous y trouverez Louisette une femme calme et réfléchi.
> - *⚒️ Forge d’Edward :* Atelier de forge où l’on peut commander, réparer ou améliorer armes et armures. Vous y trouverez Edward un homme robuste à la fois drôle et arrogant.
> - *🎎 Grand Bazar :* Immense échoppe vendant une multitude d’objets et d’artefacts d’origine exotique. Vous y trouverez Roland un homme opportuniste, charmeur et un brin menteur.
> 
> *🏤 Bureau des Missions :* (X: -1.5, Y: 0)
> Institution proposant diverses missions aux aventuriers, des chasses aux artefacts aux escortes de marchands. Un grand tableau affiche les annonces en cours. Afin d’être éligible vous devez vous inscrire et pour des raisons de sécurité vous ne recevez que des missions à la hauteur de vos compétences.
> - *🏦 Banque des Trésors :* Gardienne des richesses du royaume, cette banque stocke objets rares et pièces d’or. Vous y trouverez toutes sortes d’artefacts et objets magiques, elle est fortement gardé.
> 
> *🫧 Bains de Sagacia :* (X: 2, Y: 0)
> Oasis de sérénité où l’on vient se détendre après de longues journées d’efforts. Il y a le bain des filles et celui des garçons séparément.
> 
> *🏬 Galerie des Arts :* (X: 0, Y: 1.5)
> Centre culturel abritant tableaux, sculptures et expositions itinérantes.
> - *📚 Grande Bibliothèque :* Sanctuaire du savoir, recelant grimoires anciens et chroniques du royaume.
> 
> *🏥 Centre Médical :* (X: 1.5, Y: -2)
> Refuge pour les malades et blessés, dirigé par d’éminents guérisseurs.
> - *⚗️ Laboratoire d'Oris :* (X: 1.5, Y: -2.2) : Laboratoire souterrain menant des expériences secrètes sur des potions aux effets incertains. Vous y trouverez Mira une belle jeune fille Apothicaire, elle est très maline et perspicace.
> 
> *🏘️ Quartier Résidentiel :* NE (3, 3), NO (-3, 3)
> Regroupement d’habitations, allant des maisons modestes aux demeures de riches marchands. Vous pourriez y résider sous tutelle mais seul vous devrez loué.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *\`⬅️ ZONE EST ⬅️\`*

> *🎮 Salle des Jeux :* (X: 3.5, Y: 0)
> Complexe proposant divers jeux d’argent et de stratégie, souvent fréquenté par les nobles. Vous pourriez y faire des jeux de cartes, de fléchettes ou autres.
> 
> *🛀 Bains Royaux :* (X: 5, Y: 0)
> Étendus et luxueux, ces bains sont réservés aux élites d’Astoria.
> 
> *🏡 Résidences Nobles :* (X: 7, Y: 0)
> Demeures somptueuses où réside la haute société. Certains palais abritent des collections d’objets rares.
> 
> *🚪 Entrée Privée :* (X: 8.5, Y: 0)
> Passage contrôlé donnant accès aux quartiers des familles influentes.
> 
> *🧵 Nobles Couture :* (X: 7, Y: 0.5)
> Ateliers de mode produisant vêtements raffinés et broderies enchantées.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         *\`⬆️ ZONE NORD ⬆️\`*

> *⛲ Cour d'Honneur :* (X: 0, Y: 2.5)
> Grande place ornementée, avec la statue d’Iris et des fontaines éclatantes. Vous y trouverez 2 gardes asurans bloquant le chemin vers le palais royal.
> 
> *🏰 Palais Royal :* (X: 0, Y: 4)
> Somptueux château abritant la royauté, entouré de hautes murailles.
> - *🪴 Jardins Privés :* (X: -1.5, Y: 4)
> Jardin secret où se déroulent parfois des rencontres discrètes entre diplomates.
> - *🏯 Hall des Gardiens :* (X: 1.5, Y: 3.5)
> Quartier général de la garde royale, toujours en alerte pour protéger la famille royale.
> - *⚱️ Oubliettes :* (X: 0, Y: 3.5)
> Prison souterraine où croupissent les pires criminels du royaume.
> - *🐎 Écuries Royales :* (X: 2, Y: 4)
> Abri des chevaux les plus rapides et puissants, réservés aux cavaliers du roi.
> - *🔭 Tour Astral :* (X: -2, Y: 4.5)
> Observatoire où les astrologues et érudits étudient le ciel à la recherche d’augures.
> - *🗡️ Arsenal Royal :* (X: 1, Y: 3.5)
> Dépôt secret renfermant les armes les plus précieuses du royaume.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓▓▓▓[À SUIVRE...]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};

  const lien = 'https://i.ibb.co/LtFzy6j/Image-2024-10-05-12-16-43.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `⏳ Chargement de la carte ${key}...\n0% [░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape
    
    const pourcentage = i * 20;
    const barre = '█'.repeat(i) + '░'.repeat(etapes - i);
    
    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `⏳ Chargement de la carte ${key}... ${pourcentage}%\n${barre}`,
        edit: messageInitial.key 
      });
    } catch (e) {
      console.error("Erreur modification message:", e);
    }
  }

  // Envoi de la carte finale
  await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: cartes[key],
    edit: messageInitial.key 
  });
});

zokou(
    {
        nomCom: 'character',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
*RANG : C | Normal*

> *NOM :* 
> *DESCRIPTION :* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*POTENTIELS*

> *FORCE :* Brown
> *VITESSE (V.D) :* 5m/s🎯
> *VITESSE (V.R) :* 500ms⚡
> *RÉSISTANCE :* Brown
> *DURABILITÉ :* Brown
> *SENSORIALITÉ :* 2,5m🎯 de rayon.
═══════════════════
*COMPÉTENCES*

> *NIV B :* [Nom + Description de la technique]

> *NIV A :* [Nom + Description de la technique]

> *NIV S :* [Nom + Description de la technique]
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'origamy_world',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://i.ibb.co/LtFzy6j/Image-2024-10-05-12-16-43.jpg';
            const msg = `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
      *🌐 ORIGAMY WORLD 🌐*
▁▁▁▁▁▁▁ *SRPN*  ▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  *▷ DIVINITÉS & ARTEFACTS ◁*

> Dans l'univers fascinant d'Origamy World, les légendes racontent l'existence de puissantes divinités anciennes, gardiennes d'artefacts aux pouvoirs uniques et redoutables. Ces artefacts, disséminés dans des temples mystérieux, recèlent des capacités capables de renverser le destin d'un royaume ou d'octroyer à leur porteur une puissance divine.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▷ LES TEMPLES MYSTÉRIEUX :*

> Chaque temple est un chef-d'œuvre d'architecture ancienne, dissimulé dans des lieux où la nature reprend ses droits. Montagnes escarpées, jungles luxuriantes, cavernes profondes et îles perdues en mer abritent ces édifices, chacun dédié à une divinité spécifique. Les épreuves à l'intérieur sont autant de défis que d'énigmes, conçues pour tester la valeur, la force ou la sagesse de ceux qui osent s'y aventurer. Seuls les élus parviendront à surmonter les dangers et à arracher l'artefact sacré de son socle.

> Ces épreuves peuvent inclure des énigmes millénaires, des combats contre des créatures mythiques ou des parcours semés de pièges mortels. Une fois l'artefact obtenu, son porteur devient la cible de quiconque convoite son pouvoir.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*▷ LES DIFFÉRENTES CATÉGORIES :* 

> Au cœur d'Origamy World, les habitants et combattants se divisent en trois grandes catégories, chacune dotée d'un potentiel unique et distinct.

1. *🔻LES PROFANES :* Ces créatures sont incapables d'utiliser la magie, mais leur restriction compensent cette carence par un potentiel physique hors norme. Leur corps est une arme vivante, capable de performances surpassant l'entendement humain. Il peuvent possédé jusqu'à 2 potentiel exceptionnel, utiliser l'overdrive sans restriction, *Par exemple :* Se déplacer à une vitesse fulgurante, esquivant les attaques en un éclair. Briser la roche d’un coup de poing et soulever des poids titanesques. Endurer des coups mortels sans faiblir. Effectuer des acrobaties impossibles avec précision et fluidité. Répondre aux attaques adverses avant même qu'elles ne soient pleinement déclenchées. 

> Ces combattants sont souvent des mercenaires, des gladiateurs ou des protecteurs de villages, usant de leur force brute pour dominer le champ de bataille.

2. *🔹LES MONONATURE :* Ces individus sont capables d'utiliser une seule nature magique, mais peuvent la décliner sous différentes formes de techniques. Ils exploitent leur affinité avec une nature spécifique pour façonner des stratégies complexes. *Par exemple :* Feu : Créer des flammes tourbillonnantes, des murs de feu ou des explosions ardentes. Eau : Générer des vagues destructrices, des lames d'eau ou de la vapeur brûlante. Gravité : Manipuler la pesanteur pour écraser ou alléger des objets. Téléportation : Se déplacer instantanément d'un point à un autre ou échanger de place.

> Les magiciens mononature sont des experts de leur élément, développant des techniques raffinées et variées pour exploiter au mieux leur potentiel. Leur diversité tactique les rend imprévisibles en combat.

3. *🔺LES ARCANISTES :* Ces êtres rares possèdent la capacité de manipuler plusieurs natures magiques, mais avec une contrainte majeure : une seule technique par nature. *Par exemple :* Téléportation Rapide : Se déplacer d'un point A à un point B. Bouclier de Feu : Former une barrière enflammée pour se protéger. Griffe de Glace : Créer une griffe tranchante en glace pure. Et Orbe de Gravité : Condenser la pesanteur en une sphère pour attirer les ennemis.

> Bien que moins polyvalents dans chaque élément, leur capacité à puiser dans plusieurs arts magiques fait d'eux des stratèges redoutables, capables de surprendre leurs adversaires avec des combinaisons inattendues.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

▷ *LA QUÊTE DES ARTEFACTS :* 

> Peu importe leur catégorie, les aventuriers d'Origamy World cherchent à obtenir les artefacts pour devenir des légendes vivantes. Pourtant, posséder un artefact n'est que le début, car sa maîtrise nécessite de l'entraînement, de la force d'âme et de la volonté pour ne pas se laisser consumer par son pouvoir.

> Alors que les rumeurs sur de nouveaux temples et d'anciens artefacts refont surface, les aventuriers affluent des quatre coins du monde, prêts à affronter les divinités elles-mêmes pour saisir leur destin. Le monde est en effervescence, et seuls les plus dignes pourront espérer laisser leur nom dans l'histoire d'Origamy World.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
        }
    }
);


const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

zokou( { nomCom: 'origamy_visuel', categorie: 'CENTRAL' }, async (dest, zk, commandeOptions) => { 
  const { ms, superUser, repondre } = commandeOptions;

  if (!superUser) {
    return repondre("❌ Accès refusé : vous n'êtes pas autorisé à exécuter cette commande !");
  }

  const liens = [
    'https://i.ibb.co/LtFzy6j/Image-2024-10-05-12-16-43.jpg',
    'https://i.ibb.co/G3ztCpW/20240927-230914.jpg',
    'https://i.ibb.co/vmN0SSr/20240927-231229.jpg',
    'https://i.ibb.co/mBqrG20/20240927-233225.jpg',
    'https://i.ibb.co/G5jPJN8/20240927-233347.jpg',
    'https://i.ibb.co/51qmnJJ/20240927-233900.jpg',
    'https://i.ibb.co/bJPbxW2/20240927-230107.jpg',
    'https://i.ibb.co/4m005vx/20240927-233715.jpg',
    'https://i.ibb.co/0YkNDvc/20240927-230702.jpg',
    'https://i.ibb.co/HGhxgDs/20240928-001444.jpg',
    'https://i.ibb.co/jv8q587/20240927-234214.jpg',
    'https://i.ibb.co/QmMF8B6/20240927-223830.jpg',
    'https://i.ibb.co/VgCPhyd/20240928-000526.jpg',
    'https://i.ibb.co/zX3NZrR/20240927-234341.jpg',
    'https://i.ibb.co/nBZ08Lh/20240927-224242.jpg',
    'https://i.ibb.co/sj9z6jC/20240928-000853.jpg',
    'https://i.ibb.co/fCRgqwy/20240928-001305.jpg',
    'https://i.ibb.co/MpxhHrd/20240927-212108.jpg',
    'https://i.ibb.co/RCpMXYj/20240927-234545.jpg',
    'https://i.ibb.co/5WjszYy/20240927-221021.jpg',
    'https://i.ibb.co/5Tr77gw/20240927-235428.jpg',
    'https://i.ibb.co/L091WtQ/20240927-222537.jpg',
    'https://i.ibb.co/j8R23mF/20240927-235952.jpg',
    'https://i.ibb.co/0MXQjcy/20240927-222739.jpg',
    'https://i.ibb.co/t2Txdd8/20240928-000303.jpg',
    'https://i.ibb.co/QYzgXNg/20240928-001822.jpg',
    'https://i.ibb.co/WvfbbgK/20240927-223020.jpg',
    'https://i.ibb.co/3mcQzpb/20240927-235656.jpg',
    'https://i.ibb.co/4dKMmWq/20240927-224809.jpg',
    'https://i.ibb.co/MVFJzh1/20240927-223321.jpg',
    'https://i.ibb.co/thkwBjn/20240927-234927.jpg',
    'https://i.ibb.co/Kh3JdMK/20240927-221342.jpg',
    'https://i.ibb.co/tKQCYHb/20240927-223933.jpg',
    'https://i.ibb.co/3mpGZhf/20240927-221704.jpg',
    'https://i.ibb.co/2YMF9QC/20240927-235106.jpg',
    'https://i.ibb.co/RBPVVNz/20240927-222034.jpg',
    'https://i.ibb.co/k4ZSCtD/20240927-235254.jpg',
    'https://i.ibb.co/2N3ZKtr/20240927-224604.jpg',
    'https://i.ibb.co/SnqSzGk/20240927-222306.jpg',
    'https://i.ibb.co/CwZk2nF/20240927-235758.jpg',
    'https://i.ibb.co/Qd80mx4/20240927-225101.jpg',
    'https://i.ibb.co/hRpgVLP/20240927-225518.jpg',
    'https://i.ibb.co/sWt3HFh/20240927-225230.jpg'
  ];

  let html = `
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Galerie Origamy World</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #1a1a1a;
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
      }
      .image {
        margin: 10px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 10px #000;
      }
      .image img {
        max-width: 300px;
        border-radius: 12px;
        transition: transform 0.3s ease;
      }
      .image img:hover {
        transform: scale(1.05);
      }
    </style>
  </head>
  <body>
    ${liens.map(url => `<div class="image"><img src="${url}" alt="Origamy" /></div>`).join('')}
  </body>
  </html>`;

  const fileName = `origamy_galerie_${randomInt(10000)}.html`;
  writeFileSync(fileName, html);

  await zk.sendMessage(dest, {
    document: readFileSync(fileName),
    mimetype: 'text/html',
    fileName: 'origamy_galerie.html',
    caption: '*📸 GALERIE ORIGAMY WORLD*'
  }, { quoted: ms });

  unlinkSync(fileName);
});