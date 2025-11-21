const { zokou } = require('../framework/zokou');

zokou({
  nomCom: 'asura',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[🗺️MAP : ASURA  ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};

  const lien = 'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `*⏳ Chargement de la carte ${key}...*\n0% [░░░░░░░░░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape
    
    const pourcentage = i * 20;
    const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);
    
    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `*⏳ Chargement de la carte ${key}...*\n  ${pourcentage}% [${barre}]`,
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

zokou({
  nomCom: 'borealis',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;


// Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓[ 🗺️MAP : BOREALIS - CENTRE ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
        *\`↔️ COEUR DU TERRITOIRE ↕️\`*

> *🏰 Valkryn (Capitale) :* (X: 0, Y: 0)
> La forteresse volcanique noire qui domine la région. C'est le point de repère visible à des kilomètres à la ronde, crachant une fumée noire (les forges) vers le ciel blanc.
>
> *🏔️ Col du Titan :* (X: 0, Y: -2)
> La seule route praticable menant à la porte sud de la capitale. C'est un chemin escarpé bordé de statues de guerriers géants sculptées dans la glace, hautes de 10 mètres. Danger : Les vents y sont traîtres. (Risque de chute si pas d' équipement d'escalade ou monture adaptée).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
            *\`⬇️ VERS LE SUD ⬇️\`*

> *🌉 Pont des Soupirs Glacés :* (X: 0, Y: -8)
> Un pont naturel en arche de pierre givrée qui enjambe "La Gorge Sans Fond". Le vent qui s'y engouffre produit un son semblable à des lamentations. C'est un point de contrôle stratégique. PNJ : Garde-Pont Hvar (Rang C, Combativité Fort). Il ne demande pas d'argent pour passer, mais une "histoire de bravoure" ou une preuve de force.
>
> *⛺ Campement de Skar :* (X: 2, Y: -10)
> Un avant-poste de chasseurs de peaux. Des tentes en cuir épais regroupées autour de feux. C'est la dernière étape avant les terres sauvages du Sud. PNJ : Skar le Borgne (Rang C, Normal). Il achète les peaux à bon prix et vend des rations de viande séchée (très salée mais nourrissante). Ressources : Viandes (🥩), Peaux (🧥), Bois de chauffage (🪵).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`➡️ VERS L'EST ➡️\`*

> *🌲 Forêt de Fer-Blanc :* (X: 8, Y: 0)
> Une forêt dense de pins dont l'écorce est aussi dure que du métal et les aiguilles blanches. Le bois y est difficile à couper (Hache Niv 🥈 requise) mais brûle deux fois plus longtemps. Créatures : Loups des Neiges (Rang C, Meute). Ils chassent en groupe de 3 à 5. Ressources : Bois de Fer-Blanc (🪵 - Durabilité élevée), Champignons de Givre (🍄 - Toxiques si crus, médicinaux si cuits).
>
> *⛏️ Carrière de Basalte :* (X: 10, Y: -2)
> Une mine à ciel ouvert où les prisonniers et les ouvriers extraient la pierre noire pour renforcer Valkryn. PNJ : Contremaître Drogan (Rang B, Combativité Fort, Force Yellow). Il cherche toujours de la main-d'œuvre robuste. Il paie en minerai ou en protection. Opportunité : Possibilité de travailler pour gagner des 🧭 ou de la Force physique.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`⬅️ VERS L'OUEST ⬅️\`*

> *💎 Lac du Cœur Gelé :* (X: -8, Y: 0)
> Un immense lac parfaitement circulaire, gelé en surface sur une épaisseur de 5 mètres. La glace est si pure qu'on peut voir les profondeurs noires en dessous. On dit que l'eau, si on brise la glace, guérit les maladies de l'âme mais gèle le corps instantanément. Pêche : Possible, mais nécessite une perceuse à glace. Poissons : Anguille de Cristal (Restaure 🌀).
>
> *⛩️ Sanctuaire des Anciens :* (X: -10, Y: 2)
> Un cercle de menhirs en pierre runique au bord du lac. Les Chamans viennent y écouter le craquement de la glace, qu'ils interprètent comme la voix des Dieux. PNJ : La Silencieuse (Rang B, Mononature Glace). Une gardienne qui ne parle pas. Elle attaque quiconque souille la glace avec du sang ou du feu.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`⬆️ VERS LE NORD ⬆️\`*

> *🏔️ Marches d'Ymir :* (X: 0, Y: 8)
> Une série de plateaux naturels montant vers les plus hauts sommets derrière la capitale. L'air y est raréfié (Oxygène 🌬️ baisse 2x plus vite).
>
> *🦅 Nid des Aigles-Tempête :* (X: -3, Y: 10)
> Des pics rocheux où nichent des rapaces géants capables d'emporter un homme. Créature : Aigle-Tempête (Rang B, Volant). Plumes recherchées pour les flèches de haute qualité. Ressources : Œufs géants (🥚 - +50 🍽️), Plumes de Tempête (🪶 - Crafting magique).
>
> *❄️ Caverne du Yéti Solitaire :* (X: 4, Y: 9)
> Une grotte massive marquée par des ossements. C'est le territoire d'une créature légendaire locale. Boss de Zone : Le Vieux Yéti (Rang B, Extrême, Force Yellow). Il est vieux, borgne, et extrêmement territorial. Il garde un gisement de Cristal Bleu (Ressource magique rare pour les armes de glace).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : BOREALIS - NORD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
 *\`DOMAINE DES GÉANTS & NUIT ÉTERNELLE\`*

> *🏔️ Mur de Ymir :* (X: 0, Y: 30)
> Une chaîne de montagnes infranchissable qui marque la fin du monde connu. Les pics sont si hauts qu'ils percent les nuages. Légende : On dit que derrière ce mur dorment les Dieux Anciens.
>
> *🦴 Vallée des Mammouths :* (X: 5, Y: 25)
> Une vaste plaine de toundra gelée où migrent des troupeaux de Mammouths laineux et de Rhinocéros lanugineux. Chasse : Possible mais mortelle. Un Mammouth (Rang B, Force Yellow) peut nourrir un clan entier, mais écrase un homme comme une brindille. Ressources : Ivoire (💰), Viande massive (🥩), Fourrure Épaisse (🧥 - Protection Grand Froid).
>
> *👣 Bastion des Géants de Givre :* (X: -10, Y: 35)
> Des structures cyclopéennes faites de blocs de glace de 10 tonnes. C'est le territoire des Jötunns (Géants). Ils attaquent à vue tout humain. Boss de Zone : Thrym, Roi des Géants (Rang A, Combativité Extrême, Force Blue). Il manie une massue faite d'un arbre entier.
>
> *🌌 Pic de l'Aurore :* (X: 0, Y: 40)
> Le point le plus haut du continent. C'est le seul endroit où l'on peut toucher les aurores boréales. L'énergie magique (Mana) y est si dense qu'elle restaure +50🌀 par section, mais cause des hallucinations.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : BOREALIS - SUD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
       *\`LA BANQUISE & LES PILLARDS\`*

> *⚓ Port de Skallagrim :* (X: 0, Y: -30)
> Une cité côtière fortifiée, indépendante de Valkryn. C'est le repaire des Vikings des Glaces et des chasseurs de baleines. L'ambiance y est plus libre mais plus brutale que la capitale. PNJ : Jarl Ulfric "Dents-de-Sabre" (Rang B). Chef des pillards. Il loue des drakkars pour traverser l'océan vers d'autres continents. Commerce : Poissons rares, Huile de Léviathan, Esclaves (illégal mais pratiqué).
>
> *🧊 Mer des Icebergs (Zone de Navigation) :* (X: 0, Y: -40)
> L'océan est gelé sur des kilomètres. On peut marcher sur la banquise, mais attention aux failles et aux orques. Créature : Serpent de Mer Blanc (Rang B, Aquatique). Il brise la glace pour avaler les voyageurs.
>
> *🚢 Cimetière des Épaves :* (X: -15, Y: -35)
> Une zone où les courants marins ont empilé des centaines de navires brisés par la glace au fil des siècles. Exploration : On y trouve des trésors anciens (Or 🥇, Artefacts rouillés), mais la zone est hantée par des Draugrs (Morts-vivants gelés).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : BOREALIS - EST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *\`FORÊT DENSE & ESPRITS\`*

> *🌲 Grande Taïga Noire :* (X: 30, Y: 0)
> Une forêt immense qui couvre tout l'est. Les arbres sont si serrés que la lumière passe à peine. Le silence y est total. C'est le domaine des bêtes et des esprits. Danger : Désorientation. Sans compétence de pistage ou boussole, risque élevé de tourner en rond.
>
> *🐺 Village des Parias (Lycanthropes) :* (X: 35, Y: 5)
> Un hameau caché où vivent ceux qui sont maudits par la bête. Ils ne sont pas hostiles si on ne les provoque pas, mais la nuit de pleine lune, la zone devient un enfer. PNJ : Fenrir l'Ancien (Rang A sous forme bête). Il enseigne la maîtrise de la rage (Overdrive amélioré) aux guerriers dignes.
>
> *💧 Lac aux Miroirs :* (X: 40, Y: -5)
> Un lac d'eau liquide chauffée par une source géothermique souterraine. La brume y est permanente. Légende : On dit que le reflet dans l'eau montre la manière dont vous allez mourir. Ressources : Plantes Médicinales Rares (🌿 - Fleur de Lune, Racine de Sang).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▓▓▓[ 🗺️MAP : BOREALIS - OUEST ]▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
          *\`MONTAGNES & DRAGONS\`*

> *🌩️ Aiguilles de Pierre :* (X: -30, Y: 0)
> Une région de montagnes effilées comme des lances, constamment frappées par la foudre et les tempêtes de neige. Climat : Vent violent (-50% vitesse déplacement, risque de chute).
>
> *🐲 Nid de la Wyverne de Givre :* (X: -35, Y: 10)
> Au sommet d'un pic, une créature terrifiante a élu domicile. Boss : Wyverne Cristalline (Rang A, Volant, Souffle de Glace). Elle garde un nid rempli d'œufs et d'équipements d'aventuriers dévorés. Loot : Écailles de Dragon (Matériau Niv 🥇), Œuf de Wyverne (Valeur inestimable).
>
> *⛏️ Mine Oubliée (Entrée des Profondeurs) :* (X: -25, Y: -5)
> L'entrée d'un ancien complexe minier nain, abandonné suite à un réveil "d'une chose dans les ténèbres". Exploration (Donjon) : Des tunnels labyrinthiques descendant vers les racines du monde. On y trouve du Mithril (🪝) et de l'Adamantite (💠), mais il faut affronter des Golems de Glace.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[ 🗺️MAP : VALKRYN ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
               *\`⬇️ ZONE SUD ⬇️\`*

> *☠️ Porte des Crocs :* (X: 0, Y: -6)
> L'unique entrée terrestre de la forteresse. Une arche massive de 20 mètres de haut, constituée des mâchoires d'un Léviathan des Glaces abattu il y a des siècles. Gardes : 4 Gardes "Sentinelles du Givre". (Rang B, Combativité Fort, Force Yellow). Ils portent des armures en cuir de Mammouth et manient des marteaux de guerre en fer noir (Niv 🥈). Ils ne laissent entrer que ceux qui prouvent leur force (un duel ou une épreuve de levage de pierre).
>
> *🍖 Marché du Troc :* (X: 0, Y: -4)
> Ici, l'or a peu de valeur. On échange des peaux, de la viande séchée, de l'huile et des armes. L'ambiance est rude, les négociations se font parfois aux poings. Vous y trouverez Gorn le Boucher, un homme énorme couvert de cicatrices, vendant de la viande de Yéti et de l'Ours polaire. Il respecte ceux qui chassent leur propre nourriture. Ressources : Viandes (🥩), Fourrures (🧥), Huile (🛢️).
>
> *🍺 Taverne "Le Sang de l'Ours" :* (X: 2, Y: -5)
> Un bâtiment bas, enfoui à moitié dans le sol pour garder la chaleur. C'est le lieu le plus chaud et le plus bruyant de la ville. Les bagarres y sont fréquentes et encouragées. PNJ : Helga "Bras-de-Fer", la tavernière (Rang C, Combativité Extrême, Force Yellow). Elle sert un hydromel brûlant qui restaure +40🫀 mais intoxique rapidement. Elle brise les bras de ceux qui ne paient pas. 

> *Chambres :*
> - *🛖 Paillasse (Commune) :* 500🧭 (Chaleur partagée, sommeil agité).
> - *🛌 Chambre du Jarl (Privée) :* 2000🧭 (Peaux de bêtes épaisses, feu de cheminée privé, restaure 100% 🫀).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`➡️ ZONE OUEST ➡️\`*

> *🏠 Quartier des Clans :* (X: -4, Y: 0)
> Des rangées de "Longhouses" (maisons longues) en bois robuste et pierre, où vivent les familles guerrières. Chaque maison arbore le blason de son clan (Loup, Ours, Corbeau). L'honneur et la lignée sont vitaux ici.
>
> ♨️ *Sources de Vapeur :* (X: -6, Y: 0)
> Des bassins naturels d'eau bouillante provenant des entrailles du volcan éteint. C'est le seul endroit pour se laver et se réchauffer en profondeur. Effet : Un bain d'une heure (1 tour) supprime l'effet "Froid" et restaure 50% de la santé ❤️. PNJ : Vieux Bjorn (Non-combattant), le gardien des sources. Il est aveugle mais entend tout ce qui se dit dans la vapeur. Il vend des informations contre du tabac.
>
> *🦴 Ossuaire des Guerriers :* (X: -5, Y: 2)
> Un cimetière à ciel ouvert où les corps des guerriers morts sont laissés aux éléments et aux oiseaux charognards, selon la tradition, pour que leur esprit rejoigne le vent.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`↔️ CENTRE VILLE ↕️\`*

> *🏛️ Hall de Ymir (Palais) :* (X: 0, Y: 0)
> Le siège du pouvoir. Un bâtiment titanesque creusé directement dans le pic central. Le trône est fait d'un bloc de Glace Éternelle qui ne fond jamais. PNJ Majeur : Grand Jarl Torvin "Le Briseur" (Rang A, Combativité Extrême, Force Blue). Un colosse de 2m20, maniant une hache à deux mains en Adamantite (Niv 🥇). Il ne respecte que la force brute. Il méprise la magie. Un seul de ses coups vous enverra littéralement valser dans le décor si vous êtes moins fort avec un risque de saignement, d'étourdissement et de douleur. PNJ Majeur : La Prophétesse Valka (Rang B, Arcaniste, Combativité Normal). Une vieille femme aux yeux blancs, conseillère du Jarl. Elle lit l'avenir dans les entrailles.
>
> *🔥 Grand Brasier :* (X: 0, Y: -1)
> Une fosse de feu immense au centre de la place, maintenue par des prêtres du feu. C'est le cœur spirituel et thermique de la ville. Si ce feu s'éteint, la ville meurt.
> *⚔️ La Fosse aux Défis :* (X: 0, Y: 2)
> Une arène circulaire creusée dans le sol, entourée de piques. C'est ici que se règlent les conflits juridiques et politiques : par le combat à mort ou au premier sang. Il n'y a pas d'avocats à Valkryn, seulement des champions.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
               *\`⬅️ ZONE EST ⬅️\`*

> *⚒️ Forges de Magma :* (X: 4, Y: 0)
> Utilisant la chaleur résiduelle du volcan, ces forges produisent des armes lourdes et brutales. Le métal y est travaillé sans finesse mais avec une solidité incomparable. PNJ : Brok le Forgeron (Rang B, Combativité Fort, Force Yellow). Un nain exilé, maître artisan. Il peut travailler l'Argent, le Fer et même le Mithril si on lui en apporte. Service : Réparation (💰), Amélioration d'armes lourdes (+Dégâts), Vente d'armes Niv 🥈 et 🥇.
>
> *🐾 Enclos des Bêtes :* (X: 5, Y: -2)
> Un vaste enclos aux murs renforcés où sont dressés des Loups Géants (Direwolves) et des Ours de Guerre pour servir de montures. L'odeur y est féroce.

> *Montures disponibles :*
> - *Loup des Neiges :* (Vitesse: 2km/section, Endurance: 80🐾). Prix : 10000🧭.
> - *Ours de Guerre :* (Vitesse: 1.5km/section, Endurance: 120🐾, peut combattre). Prix : 15000🧭.

> PNJ : Kaira la Dompteuse (Rang B, Combativité Fort). Elle porte des cicatrices de griffes sur le visage. Elle ne vend ses bêtes qu'à ceux qui peuvent les regarder dans les yeux sans reculer.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`⬆️ ZONE NORD ⬆️\`*

> *🛡️ Rempart du Vide :* (X: 0, Y: 6)
> Une muraille donnant sur le versant nord de la montagne, face aux terres inexplorées et glaciales. C'est ici que les gardes surveillent l'arrivée des tempêtes... et des choses pires.
>
> *🌑 Autel d'Umbra :* (X: 2, Y: 7)
> Un sanctuaire silencieux, une grotte de glace naturelle où l'on vient prier le principe du Repos (Umbra). Il n'y a pas de prêtre, juste un silence absolu qui pèse sur l'âme. On dit que ceux qui y dorment une nuit reçoivent des visions de leur propre mort.
>
> *⛓️ Prison de Glace :* (X: -2, Y: 6)
> Des cellules ouvertes aux vents glaciaux. Les prisonniers ne sont pas enfermés par des barreaux, mais par le froid. S'ils tentent de fuir, ils gèlent. S'ils restent, ils survivent à peine.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};


  const lien = 'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `*⏳ Chargement de la carte ${key}...*\n0% [░░░░░░░░░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape

    const pourcentage = i * 20;
    const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);

    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `*⏳ Chargement de la carte ${key}...*\n  ${pourcentage}% [${barre}]`,
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

zokou({
  nomCom: 'ignara',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

// Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : IGNARA - CENTRE ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         *\`PLAINES CALCINÉES & MINES\`*

> *🌋 Pyraxis (Capitale) :* (X: 0, Y: 0)
> Le cratère noir visible à des lieues, d'où s'échappent des fumées constantes.
>
> *💀 Route des Crânes :* (X: 0, Y: -5)
> La voie principale pavée d'os blanchis menant à la capitale. Des cages suspendues contiennent les restes de ceux qui ont défié le Sultan. Rencontre : Patrouilles de Mamelouks (Rang C+) sur des Lézards de Monte rapides.
>
> *⛏️ Mines de Soufre :* (X: 5, Y: 0)
> Un paysage jaune et puant où des esclaves extraient le soufre pour les alchimistes. L'air y est toxique (-10🌬️/section sans masque). PNJ : Le Gardien des Fosses (Rang B, Sadique). Il dirige la mine d'une main de fer. Ressources : Soufre (💥 - Explosifs), Salpêtre.
>
> *🏜️ Dunes de Verre :* (X: -5, Y: 2)
> Une zone où la foudre frappe si souvent que le sable s'est vitrifié en structures tranchantes et fragiles. Danger : Sol coupant (-10❤️ si chute). Orages magnétiques fréquents.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : IGNARA - NORD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         *\`DÉSERT INFINI & NOMADES\`*

> *🐪 Oasis Mouvante (Mirage Réel) :* (Position Variable, approx X: 0, Y: 30)
> Une source d'eau pure et de végétation luxuriante qui se déplace magiquement chaque nuit. Seuls ceux qui "écoutent le vent" (ou possèdent une boussole enchantée) peuvent la trouver. Ressources : Eau Pure (🍶), Dattes Dorées (+20🫀).
>
> *🏛️ Ruines de Sol :* (X: 10, Y: 35)
> Les vestiges d'une civilisation antique adoratrice du Soleil, engloutie par le sable. On dit que les golems gardiens fonctionnent encore. Loot : Tablettes antiques, Orichalque (🏅).
>
> *🐍 Territoire du Ver des Sables :* (X: -10, Y: 25)
> Une vaste dépression de sable mouvant. Le sol tremble rythmiquement. Boss de Zone : Le Grand Dévoreur (Rang A, Monstre Géant). Un ver colosse capable d'engloutir une caravane entière. Sa peau est impénétrable sauf pour des armes Niv 🥇.
>
> *⛺ Campement des Tribus Oubliées :* (X: 5, Y: 20)
> Des nomades rebelles qui refusent l'autorité de Pyraxis. Ils montent des Scorpions Géants. PNJ : Kael'thas le Guide (Rang B, Archer). Il connaît les chemins sûrs à travers les dunes.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : IGNARA - SUD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
   *\`JUNGLE VÉNÉNEUSE & CHALEUR HUMIDE\`*

> *🌿 Jungle de Venin :* (X: 0, Y: -30)
> Une aberration écologique. La chaleur géothermique et l'humidité de la côte créent une jungle étouffante. Tout y est toxique : plantes, insectes, eau. Climat : Humidité 100%. Risque de maladies tropicales.
>
> *🐍 Temple du Dieu-Serpent :* (X: 5, Y: -35)
> Une ziggourat envahie par la végétation, dédiée à une divinité oubliée (probablement liée au Chaos). Les cultistes y pratiquent des rituels de sang. Créature : Naga Royal (Rang B, Extrême). Gardien du temple.
>
> *🧪 Marais d'Émeraude :* (X: -5, Y: -40)
> Des bassins d'acide naturel bouillonnant. Les vapeurs vertes sont mortelles. Ressources : Fleurs de Poison (☠️ - Base pour les assassins), Peaux de Reptile (🛡️ - Résistantes à l'acide).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   *▓▓▓[ 🗺️MAP : IGNARA - EST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *\`VOLCANS & DRAGONS\`*

> *🌋 Mont Ignis (Volcan Actif) :* (X: 30, Y: 0)
> Un volcan titanesque en éruption constante. Des rivières de lave coulent sur ses flancs. C'est la forge naturelle du monde. Danger : Chaleur extrême (+80°C). Protection magique ou combinaison alchimique requise pour approcher le cratère.
>
> *🐲 Gueule du Dragon :* (X: 35, Y: -5)
> Un lac de lave où vivent des Salamandres de Feu et des Drakes. Boss : Seigneur Pyromancien (Rang A, Élémentaire de Feu). Une entité née du magma.
>
> *⚔️ Champs d'Obsidienne :* (X: 25, Y: 5)
> Une plaine couverte de pics noirs tranchants comme des rasoirs. Ressources : Obsidienne brute (🪨 - Armes tranchantes), Cœur de Magma (💎 - Source d'énergie).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : IGNARA - OUEST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         *\`DÉSOLATION & SORCELLERIE\`*

> *🧂 Salines Aveuglantes :* (X: -30, Y: 0)
> Des kilomètres de plaines de sel blanc éblouissant sous le soleil. Le reflet brûle les yeux (Cécité sans protection). Économie : Le sel vaut son pesant d'or pour la conservation des aliments.
>
> *☠️ Côte des Squelettes :* (X: -35, Y: 5)
> Une plage où l'océan bouillonnant (chauffé par des failles sous-marines) rejette les carcasses de navires et de monstres marins. L'eau est trop chaude pour y nager sans protection.
>
> *🗼 Tour du Silence :* (X: -25, Y: -5)
> Une tour isolée où vivent des Sorciers exilés de Pyraxis. Ils étudient la nécromancie et les arts interdits loin du regard du Sultan. PNJ : Morvath l'Exilé (Rang A, Arcaniste Néant/Mort). Il n'est pas hostile, mais demande des prix terribles pour son savoir (années de vie, souvenirs).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[ 🗺️MAP : PYRAXIS ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`⬇️ ZONE NORD ⬇️\`*

> *🚪 Porte des Cendres :* (X: 0, Y: -8)
> L'entrée principale située au niveau le plus bas du cratère. Une arche de grès rouge gardée par des Mamelouks (Soldats-esclaves d'élite). On y fouille les voyageurs non pas pour des armes, mais pour taxer leur eau.
>
> *⛓️ Marché aux Chaînes :* (X: 0, Y: -6)
> Le plus grand marché d'esclaves d'Origamy World. Des estrades en bois où sont vendus des prisonniers de guerre, des endettés et des créatures exotiques. PNJ : Gorgos le Négrier (Rang B, Combativité Normal). Un homme obèse porté par quatre serviteurs. Il vend des esclaves "de combat" ou "de plaisir". Il possède des informations sur tout le monde. Opportunité : Acheter un PNJ serviteur (Coût variable selon la qualité).
>
> *💧 Puits des Pauvres :* (X: 2, Y: -7)
> Une citerne d'eau saumâtre gardée par des brutes. C'est le seul point d'eau gratuit (mais sale) pour la population basse. Boire ici donne +30🍶 mais 20% de chance de maladie (Nausée).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`➡️ ZONE OUEST ➡️\`*

> *⚗️ Allée des Alchimistes :* (X: -5, Y: 0)
> Une rue étroite où l'air est saturé de vapeurs colorées et toxiques. Les boutiques vendent des poisons, des explosifs et des élixirs interdits ailleurs. PNJ : Zahra "La Main Verte" (Rang B, Mononature Poison). Une vieille femme qui vend des antidotes et des toxines mortelles. Elle demande souvent des ingrédients bizarres (œil de basilic, venin de scorpion) en paiement. Ressources : Poisons (☠️), Potions explosives (💣), Acide.
>
> *🏭 Verrerie Infernale :* (X: -6, Y: -2)
> Des ateliers utilisant la chaleur naturelle du sol pour fondre le sable en verre pur et en armes d'obsidienne. La chaleur y est insoutenable (+10°C supplémentaires). Craft : Création de fioles vides et d'armes en Verre-Dragon (Tranchant extrême, Fragilité élevée).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`↔️ CENTRE VILLE ↕️\`*

> *🕌 Palais du Roi-Soleil :* (X: 0, Y: 0)
> Une structure magnifique suspendue au centre du cratère par d'énormes chaînes et piliers, surplombant la ville. C'est une zone de fraîcheur artificielle (magie). PNJ Majeur : Sultan Malekith (Rang A, Arcaniste Feu/Illusion). Un tyran hédoniste et paranoïaque. Il porte un masque d'or. Il possède une garde personnelle de Golems de Lave. Accès : Interdit sans invitation ou richesse extrême.
>
> *⚔️ Arène des Sables Rouges :* (X: 0, Y: -2)
> Un colisée où le sable est teint par le sang. Les combats y sont quotidiens pour divertir la noblesse. C'est ici que les esclaves peuvent gagner leur liberté... s'ils survivent à 100 combats. Événement : "Le Jugement du Feu". Les criminels sont jetés dans l'arène face à des bêtes du désert (Scorpions géants).
>
> *🏺 Grand Souk Doré :* (X: 0, Y: 2)
> Un labyrinthe d'étals couverts de soieries colorées pour protéger du soleil. On y trouve tout ce que l'or peut acheter : épices rares, bijoux enchantés, secrets. PNJ : Rashid le Changeur (Rang C, Fourbe). Il échange les devises étrangères et prête de l'argent à des taux usuriers (50% d'intérêt).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
               *\`⬅️ ZONE EST ⬅️\`*

> *🔥 Temple de la Flamme Éternelle :* (X: 5, Y: 0)
> Un ziggourat en pierre noire. Au sommet brûle un feu qui, selon la légende, est un morceau du soleil tombé sur terre. Culte : Les Prêtres d'Ignis vénèrent le principe du Pandemonium (Chaos) sous sa forme destructrice. Ils pratiquent des sacrifices pour "apaiser la terre". PNJ : Grand Prêtre Azar (Rang A, Mononature Feu). Fanatique. Il peut lire l'avenir dans les cendres.
>
> *🛡️ Caserne des Immortels :* (X: 6, Y: -2)
> Le QG de l'armée d'élite. Des soldats eunuques, conditionnés depuis l'enfance à ne ressentir ni douleur ni peur. Ils portent des masques en fer sans visage.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
               *\`⬆️ ZONE SUD ⬆️\`*

> *🌑 Citerne Royale (Les Bas-Fonds de l'Eau) : (X: 0, Y: 6)
> Un immense réservoir souterrain, sombre et frais. C'est un labyrinthe de piliers et d'eau. Officiellement gardé, mais officieusement contrôlé par la Guilde des Assassins.
>
> *🗡️ Repaire du Scorpion (Guilde) :* (X: -2, Y: 7)
> Caché dans les murs de la cité, accessible uniquement par les toits ou les égouts. C'est ici que l'on engage les tueurs. PNJ Majeur : Viper (Rang A, Profane, Spécialiste Dagues/Poison). La meilleure lame du continent. Elle ne tue pas pour l'idéologie, seulement pour le prix le plus élevé.
>
> *🎰 Le Casino "La Dernière Oasis" :* (X: 3, Y: 6)
> Un établissement de jeu luxueux creusé dans la roche, où l'on parie des vies, des âmes et des fortunes. L'alcool y coule à flots.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};


  const lien = 'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `*⏳ Chargement de la carte ${key}...*\n0% [░░░░░░░░░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape

    const pourcentage = i * 20;
    const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);

    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `*⏳ Chargement de la carte ${key}...*\n  ${pourcentage}% [${barre}]`,
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

zokou({
  nomCom: 'ocyrus',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

// Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : OCYRUS - CENTRE ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
       *\`CHEMINS DE FER & LE FILTRAGE\`*

> *⚙️ Galvanis (Capitale) :* (X: 0, Y: 0)
> La Citadelle des Rouages.
>
> *🛤️ Pôle Ferroviaire :* (X: 0, Y: 5)
> Un échangeur ferroviaire massif, où des dizaines de locomotives sifflent et se croisent. Les trains circulent sans arrêt vers les autres zones. Voyage : Le moyen le plus rapide de voyager. Nécessite un ticket ou une contrebande risquée.
>
> *⛽ Réservoir de Vapeur :* (X: -5, Y: 2)
> Un complexe de tuyauteries souterraines, fournissant le carburant (Vapeur d'Âme) à la capitale. Danger : Fuites de vapeur toxique. Explosion possible si les machines sont surchargées.
>
> *🗼 Tour de Surveillance Gamma :* (X: 5, Y: -2)
> Une antenne massive qui balaye le ciel et les terres pour détecter toute trace de magie "sauvage" ou de créatures non répertoriées. Elle envoie immédiatement des drones d'intervention.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : OCYRUS - NORD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
     *\`ZONE DE DÉFENSE & AUTOMATES\`*

> *🛡️ Mur des Cent Canons :* (X: 0, Y: 30)
> Une fortification défensive massive construite face à l'océan (la zone la plus proche de Borealis). Il est armé de tourelles automatiques. Danger : Zone militaire restreinte. L'accès est interdit. Tout mouvement non autorisé est bombardé.
>
> *🏭 Usine d'Assemblage S-13 :* (X: -10, Y: 35)
> L'usine principale de production d'Automates (Sentinelles). Elle tourne 24h/24. C'est l'endroit le plus surveillé d'Ocyrus. Intrigue : On raconte qu'ils essaient d'insuffler des esprits humains dans les corps des robots pour les rendre plus efficaces.
>
> *🤖 Casse aux Golems :* (X: 10, Y: 25)
> Un cimetière de machines brisées et obsolètes. C'est un labyrinthe de ferraille rouillée. Créature : Golems Défectueux (Rang C, Combativité Aléatoire). Ils attaquent par réflexe mais peuvent être reprogrammés. Ressources : Pièces Rares (🔩), Métal recyclable.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : OCYRUS - SUD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
 *\`ZONE DE POLLUTION & LA CONTREBANDE\`*

> *🕳️ Fosse de Scories :* (X: 0, Y: -30)
> Le lieu où Ocyrus déverse tous ses déchets industriels (métal lourd, produits chimiques toxiques). C'est un paysage lunaire de boue noire et de vapeurs. Climat : Toxique, sol instable.
>
> *🐀 Tunnels des Parias :* (X: -5, Y: -35)
> Sous la Fosse de Scories vivent les marginaux, les rebelles et ceux qui ont été rejetés par la société technocratique. Ils ont développé une résistance naturelle au poison. Factions : Le "Cercle des Cendres" (anarchistes). Ils vendent des drogues psychotropes et des informations sous le manteau.
>
> *⚓ Port Flottant (Contrebande) :* (X: 5, Y: -40)
> Un petit port clandestin, caché dans la brume polluée, utilisé par les marchands d'Ignara et les contrebandiers d'Asura pour faire passer des marchandises non taxées (Magie, Nourriture fraîche). PNJ : Le Capitaine Sans-Visage (Rang B, Profane, Expert en démolition). Il peut vous faire passer des frontières.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : OCYRUS - EST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
     *\`MINES & L'EXTRACTION DE MANA\`*

> *⛏️ Cœur de Cristal :* (X: 30, Y: 0)
> Une immense mine de cristaux de Mana (Arcanite) à ciel ouvert. Les cristaux sont extraits brutalement par des machines foreuses. La terre en est défigurée. Danger : Réactions de mana incontrôlées. Des "éclairs d'Arcanite" peuvent frapper sans avertissement.
>
> *🧪 Station de Raffinage :* (X: 35, Y: 5)
> L'endroit où l'énergie brute des cristaux est purifiée et transformée en Vapeur d'Âme et en piles. Monstre : Élémentaires de Mana Captifs (Rang B, Mononature Électrique/Arcaniste). Ils attaquent quiconque perturbe le processus.
>
> *🌲 Parc Biosphérique :* (X: 25, Y: -5)
> Une bulle artificielle d'air pur et de nature simulée, construite pour la haute noblesse de Galvanis qui ne supporte plus la pollution. C'est ironiquement la seule zone verte du continent. Accès : Strictement réservé aux détenteurs d'un badge de rang A.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : OCYRUS - OUEST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
      *\`FALAISES ET L'ÉNERGIE NATURELLE\`*

> *💨 Champ d'Éoliennes :* (X: -30, Y: 0)
> Des milliers d'éoliennes géantes couvrant les falaises côtières. Elles exploitent le vent de l'océan pour générer une énergie propre (l'énergie de secours d'Ocyrus). Danger : Les pales sont mortelles. Montée difficile et glissante.
>
> *💡 Phare du Jugement :* (X: -35, Y: 5)
> Un phare cyclopéen qui ne guide pas les bateaux, mais émet un rayon de lumière laser pour détecter et abattre les navires pirates (ou les aéronefs d'Aeterra) qui s'approchent sans permission.
>
> *🔬 Observatoire Météorologique :* (X: -25, Y: -5)
> Une base de recherche scientifique isolée, dédiée à l'étude des vents et des phénomènes climatiques, dans le but de les contrôler. PNJ : Professeur Eldrin (Rang B, Ingénieur). Il cherche à développer une machine à faire pleuvoir pour nettoyer la pollution de Galvanis.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓▓▓[ 🗺️MAP : GALVANIS ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`⬇️ ZONE SUD ⬇️\`*

> *⚓ Quais Blindés :* (X: 0, Y: -8)
> Un port artificiel titanesque où accostent des navires cuirassés (Ironclads) crachant de la fumée noire. Il n'y a pas de bois ici, tout est en métal riveté. Contrôle : Scanner de Mana. Si votre potentiel magique est trop élevé sans licence, vous êtes marqué comme "Sujet Dangereux".
>
> *🏭 Centre de Tri (Douane) :* (X: 0, Y: -6)
> Un complexe administratif kafkaïen. On y enregistre chaque visiteur. PNJ : Inspecteur 42 (Rang C, Profane, Équipé d'un bras mécanique). Froid, bureaucrate, incorruptible (sauf avec de la technologie rare).
>
> *🔧 Hangar des Réparations :* (X: 2, Y: -7)
> Un immense garage pour navires et machines. L'huile coule à flots. Opportunité : Réparer son équipement (Niv 🥈 et 🥇) grâce aux outils de précision, mais à un coût élevé.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`➡️ ZONE EST ➡️\`*

> *⚗️ Laboratoires de la Techno-Magie :* (X: 6, Y: 0)
> Des tours de verre et de cuivre où l'on extrait la magie des cristaux ou rarement des êtres vivants pour la transformer en carburant liquide : la "Vapeur d'Âme". PNJ : Docteur Arkeus (Rang A, Arcaniste/Ingénieur). Un génie fou qui cherche à fusionner l'homme et la machine. Il vend des prothèses augmentées (Boost Force/Vitesse) contre une perte d'humanité (Santé Max réduite). Ressources : Cartouches de Vapeur (🌀 - Recharge instantanée d'énergie), Batteries de Mana.
>
> *💡 Avenue des Néons :* (X: 5, Y: -2)
> Une rue éclairée par des tubes de gaz luminescent. C'est ici que vivent les inventeurs et les marchands de gadgets. Boutique : "Le Futur Immédiat". Vend des lunettes thermiques, des grappins mécaniques et des armes à feu primitives (Mousquets à vapeur).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
            *\`↔️ CENTRE VILLE ↕️\`*

> *⚙️ Tour du Grand Horloger (Palais) :* (X: 0, Y: 0)
> Une tour de 500 mètres de haut, bardée d'horloges géantes et de tuyaux. C'est le cerveau de la ville. PNJ Majeur : Chancelier Vektor (Rang A, Profane, Exosquelette de combat Niv 🥇). Il dirige Ocyrus selon la logique pure. Pour lui, les émotions sont des faiblesses. Sécurité : Gardée par des "Sentinelles" (Automates de combat, Rang B, Insensibles à la douleur et à la peur).
>
> *🏦 Banque Centrale de Données :* (X: -2, Y: 0)
> Ici, on ne stocke pas que de l'or, mais des informations et des brevets. C'est la forteresse la plus sécurisée du monde. Cambriolage : Possible (Rang S), butin technologique inestimable, mais risque de mort immédiate par lasers de mana.
>
> *🚉 Gare Centrale (Le Métro Aérien) :* (X: 2, Y: 0)
> Hub de transport pour les trains magnétiques qui relient les quartiers suspendus. C'est une merveille d'ingénierie.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
            *\`⬅️ ZONE OUEST ⬅️\`*

> *🔥 Hauts-Fourneaux :* (X: -6, Y: 0)
> Le quartier ouvrier. La chaleur et le bruit sont infernaux. C'est ici qu'on fond l'acier et l'Orichalque pour l'armée. Les ouvriers portent des masques et sont traités comme des numéros. PNJ : Roula "La Clé à Molette" (Rang C, Rebelle). Cheffe d'un syndicat secret qui sabote les machines pour protester contre les conditions de travail.
>
> *🦾 Arène des Bots :* (X: -5, Y: -2)
> Un lieu de divertissement illégal où l'on fait combattre des robots ou des humains augmentés. Paris : Très élevés. Possibilité de participer si on possède une armure ou un golem.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`⬆️ ZONE NORD ⬆️\`*

> *✈️ Aérodrome Céleste :* (X: 0, Y: 6)
> Une plateforme suspendue où sont amarrés les Zeppelins de Guerre. Ces dirigeables bombardiers sont la fierté d'Ocyrus. PNJ : Amiral Skyra (Rang B, Stratège). Elle commande la flotte aérienne. Transport : Possibilité de louer un petit aéronef pour voyager vers d'autres zones (Cher mais rapide et sûr).
>
> *🛡️ Bastion d'Acier :* (X: 0, Y: 8)
> Une caserne fortifiée abritant l'infanterie mécanisée. Armement : Canons à Vapeur, Fusils à lunette, Armures assistées.
>
> *📡 Tour de Transmission :* (X: -2, Y: 7)
> Une antenne émettant des ondes pour contrôler les automates de la ville. Point stratégique en cas de révolution.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};


  const lien = 'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `*⏳ Chargement de la carte ${key}...*\n0% [░░░░░░░░░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape

    const pourcentage = i * 20;
    const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);

    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `*⏳ Chargement de la carte ${key}...*\n  ${pourcentage}% [${barre}]`,
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

zokou({
  nomCom: 'aeterra',
  categorie: 'ORIGAMY',
  reaction: "🗺️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

// Cartes disponibles
const cartes = {
  centre: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓[ 🗺️MAP : AETERRA - CENTRE ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
        *\`CONNEXIONS & GRANDE MAGIE\`*

> *⛩️ Aerion (Capitale) :* (X: 0, Y: 0)
> L'île centrale et le siège du pouvoir spirituel.
>
> *🌀 Piliers du Flux :* (X: 0, Y: 5)
> Quatre monolithes gigantesques de cristal pur immensement résistant qui génèrent le champ de force maintenant l'île centrale en lévitation. C'est la source d'énergie magique du continent. Danger : Une destruction volontaire de ces piliers causerait la chute de l'île.
>
> *🌉 Pont de Cristal :* (X: 5, Y: 0)
> Un pont éthéré fait de lumière solidifiée, reliant Aerion à la Zone Est. Il n'est visible et utilisable que par ceux qui ont un certain niveau de Mana.
>
> *☁️ Portail des Songes :* (X: -5, Y: 0)
> Un cercle de brume flottante. Il sert de point de téléportation pour les mages, permettant de voyager instantanément vers Asura (le continent central) via un puissant sort d'ouverture dimensionnelle.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  nord: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[ 🗺️MAP : AETERRA - NORD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
     *\`ZONES DE COMBAT & PURIFICATION\`*

> *🌪️ Île-Tempête :* (X: 0, Y: 30)
> Une île battue par des vents magiques constants, utilisée comme terrain d'entraînement. C'est un lieu de silence absolu où les moines testent leur endurance mentale et physique. Effet : Le vent perturbe les sorts (50% de chance d'échec) mais renforce les attaques physiques (Profane).
>
> *⚔️ Archipel des Guerriers-Ailes :* (X: 10, Y: 35)
> Un groupe de petites îles où les soldats d'élite d'Aeterra (souvent des Elfes ou des Harpies) s'entraînent au combat aérien. Créature : Gryphons Sages (Montures militaires). PNJ : Général Kaelen (Rang A, Maître-Lame). Il n'accepte de défier que ceux qui peuvent voler aussi vite que lui.
>
> *⛓️ Prison de l'Air :* (X: -10, Y: 25)
> Une île rocheuse isolée, sans mur. Les prisonniers sont maintenus par des runes de Mana qui neutralisent leur lévitation et les clouent au sol. S'ils s'échappent, ils tombent.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  sud: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[🗺️MAP : AETERRA - SUD ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
          *\`MYSTÈRE DU MANA BRUT\`*

> *🌫️ Voile du Bas-Monde :* (X: 0, Y: -30)
> La couche de brume épaisse sous l'archipel. Elle n'est pas mortelle, mais y entrer désactive les sens. La visibilité est nulle. Danger : Créatures du rêve/illusion qui se cachent dans le brouillard.
>
> *💡 Plateforme des Rêves :* (X: 5, Y: -35)
> Une structure utilisée par les moines pour induire des rêves lucides collectifs et communiquer avec le principe Vastum (Dimension). Exploration : Possibilité d'entrer dans le plan des Rêves (Donjon onirique) pour affronter des peurs.
>
> *🐍 Île aux Lianes Géantes :* (X: -5, Y: -40)
> Une île connectée à d'autres par des lianes immenses. La seule zone qui permet de voyager au sol vers d'autres îles (par escalade). Créature : Plantes Sentinelles (Mononature, Végétal). Elles attaquent les intrus avec des épines. Ressources : Cordes de Liane (Résistance magique).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  est: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓[ 🗺️MAP : AETERRA - EST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
        *\`VÉGÉTATION MAGIQUE & PURETÉ\`*

> *🌲 Île-Forêt :* (X: 30, Y: 0)
> Une île entièrement recouverte d'une forêt de Séquoias géants dont le bois émet une faible lumière bleue (Mana stocké). Ressources : Bois de Mana (Matériau Niv 🥇 pour bâtons magiques), Écorce Guérisseuse.
>
> *🦌 Domaine des Cerfs-Esprits :* (X: 35, Y: 5)
> Un lieu sacré protégé par des Mononatures élémentaires. La chasse y est strictement interdite. Créature : Cerfs Astral (Rang B, Bête Magique). Leur corne est la clé de sorts de téléportation avancés.
>
> *🍄 Cercle des Fées :* (X: 25, Y: -5)
> Un champ de champignons lumineux qui s'illuminent la nuit. C'est le territoire des Fées et des Farfadets (êtres dimensionnels). Interaction : Ils peuvent vous donner des bonus aléatoires (chance, vitesse) ou vous transformer temporairement en un petit animal.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  ouest: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *▓▓▓[🗺️MAP : AETERRA - OUEST ]▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         *\`FLOTTEMENT & LE CONTRÔLE\`*

> *⚓ Îles de Lévitation :* (X: -30, Y: 0)
> De grandes plaques de roche plate utilisées pour charger les bateaux magiques d'énergie de vol. C'est le point de départ pour le voyage vers Ocyrus ou Asura. Transport : Location de navires volants (Chers, mais permettent de transporter une grande équipe).
>
> *🛡️ Rempart du Vent :* (X: -35, Y: 5)
> Un réseau de monolithes runiques qui créent une barrière cyclonique pour empêcher les Zeppelins d'Ocyrus d'approcher sans autorisation. Danger : Vents violents qui arrachent les objets non fixés.
>
> *💎 Gisement d'Arcanite Bleu :* (X: -25, Y: -5)
> Une petite île qui a été la cible de tentatives d'exploitation minière par Ocyrus. Les mages d'Aeterra ont dû l'enchanter pour la rendre invisible et la déplacer constamment. Loot : Arcanite de Haute Pureté (Meilleure ressource magique).
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`,
  capital: `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[ 🗺️MAP : AERION ]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
              *\`⬇️ ZONE SUD ⬇️\`*

> *☁️ Port de Brume :* (X: 0, Y: -8)
> Le seul point d'accès pour les navires extérieurs. Les vaisseaux doivent être amarrés à des balises d'ancrage en contrebas avant d'être hissés par des grues magiques. Contrôle : Les gardes (Mages de l'Air) filtrent les pensées. On ne rentre pas à Aerion si l'on a des intentions malveillantes.
>
> *🌿 Jardin des Nuages :* (X: 2, Y: -7)
> Des jardins publics luxuriants, entretenus par des Mononatures. L'air y est le plus pur. C'est un lieu de méditation silencieuse. Ressources : Fleurs de Mana (🌿 - +10🌀 instantané), Fruits Aériens.
>
> *🔮 École des Murmures :* (X: -5, Y: -6)
> Le lieu où les novices apprennent à contrôler la lévitation et les flux télépathiques.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`➡️ ZONE OUEST ➡️\`*

> *💎 Marché de l'Éther :* (X: 6, Y: 0)
> Un marché flottant sur des plateformes mobiles. On n'y vend pas d'armes ou de nourriture, mais de l'information, des sorts, des reliques purifiées et des gemmes enchantées. PNJ : Maître Li (Rang B, Arcaniste). Un marchand d'âmes (il achète les remords, les peurs). Il vend des prophéties (indice aléatoire pour le joueur).
>
> *🖌️ Atelier des Enlumineurs :* (X: 5, Y: 2)
> Des maîtres artisans spécialisés dans l'art des talismans (papier magique) et des parchemins (sorts pré-chargés). Craft : Création de Parchemins de Sort (Coût en Mana et en Or/Sagesse).
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
            *\`↔️ CENTRE VILLE ↕️\`*

> *⛩️ Temple du Vide (Palais) :* (X: 0, Y: 0)
> Une structure en bois de cèdre blanc, au centre de l'île, ouverte aux quatre vents. C'est le siège du pouvoir. Il est en lévitation au-dessus de l'île. PNJ Majeur : La Sage Viverra (La Voix d'Animus) (Rang S, Arcaniste). L'être le plus sage (et peut-être le plus puissant) du continent. Elle ne parle que par énigmes et est protégée par un champ de force de pure énergie.
>
> *🧘 Anneau de Méditation :* (X: 0, Y: 2)
> Un cercle de pierres où la concentration de Mana est maximale. C'est le lieu idéal pour la téléportation longue distance (si la destination à déjà été visité). Effet : Réussir un test de Sagesse (Wisdom) ici permet de regagner 100% de 🌀.
>
> *⛲ Source du Silence :* (X: -2, Y: 0)
> Une fontaine d'eau cristalline (non magique) qui émet une onde de calme, obligeant quiconque à proximité à ne plus parler.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`⬅️ ZONE OUEST ⬅️\`*

> *🏠 Quartiers des Exilés :* (X: -6, Y: 0)
> La zone d'habitation pour ceux qui ont fui la tyrannie des autres continents (Mages d'Ocyrus, Guerriers pacifistes d'Asura, etc.). Factions : Le "Cercle de l'Équilibre", un groupe cherchant à unifier les 5 principes (Umbra, Pandemonium, Lexis, Vastum, Animus).
>
> *📚 Bibliothèque des Vents :* (X: -8, Y: -2)
> Une structure faite de papier et de soie, qui flotte à l'intérieur d'un champ de force. Elle contient des connaissances interdites de tous les continents. Accès : Nécessite un test de discrétion. Le bibliothécaire est un Golem d'Air qui lit les pensées.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
             *\`⬆️ ZONE NORD ⬆️\`*

> *🐉 Perchoir des Dragons :* (X: 0, Y: 6)
> Un pic rocheux artificiel, au-dessus du niveau de la ville. C'est le lieu d'atterrissage des créatures volantes (Hippogriffes, Dragons amis, Gryphons). Transport : Location de montures aériennes. Coût : Élévé, mais rapide et offre une vue imprenable sur le monde.
>
> *🌌 Observatoire Astral :* (X: 2, Y: 7)
> Une coupole de verre permettant d'observer les étoiles même en plein jour. Les astronomes d'Aeterra sont les seuls à avoir cartographié correctement les cieux. Intrigue : Ils prédisent l'arrivée d'une menace venant de l'espace.
>
> *⚔️ École des Maîtres-Lames :* (X: -3, Y: 8)
> Un dojo à ciel ouvert, où l'on enseigne le combat spirituel (la capacité d'utiliser l'Énergie pour renforcer la lame et le corps). La finesse prime sur la force.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`
};


  const lien = 'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg';
  const key = (arg[0] || '').toLowerCase();
  const zonesValides = ['centre', 'nord', 'sud', 'est', 'ouest', 'capital'];

  // Vérification de la zone demandée
  if (!zonesValides.includes(key)) {
    return repondre(`*❌ Zone invalide*\nUsage : -asura [zone]\nZones disponibles: ${zonesValides.join(' | ')}`);
  }

  // Envoi du message initial avec l'image et le chargement
  const messageInitial = await zk.sendMessage(dest, { 
    image: { url: lien },
    caption: `*⏳ Chargement de la carte ${key}...*\n0% [░░░░░░░░░░░░░░░░░░]`
  }, { quoted: ms });

  // Simulation du chargement (5 secondes)
  const etapes = 5;
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape

    const pourcentage = i * 20;
    const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);

    try {
      await zk.sendMessage(dest, { 
        image: { url: lien },
        caption: `*⏳ Chargement de la carte ${key}...*\n  ${pourcentage}% [${barre}]`,
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
        nomCom: 'origamy_world',
        categorie: 'ORIGAMY',
        reaction: "🌐"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        const lien = 'https://i.ibb.co/LtFzy6j/Image-2024-10-05-12-16-43.jpg';
        const msg = `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
           *🌐 ORIGAMY WORLD 🌐*
▁▁▁▁▁▁▁▁▁ *SRPN*  ▁▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
*▷ LES DIVINITÉS, LES FRAGMENTS ET LE DESTIN*.

> Il y a bien longtemps, avant que les royaumes ne soient bâtis, le monde n'était qu'un champ de bataille entre les Divinités Primordiales. Chacune possédait un Fragment d'Origam, une parcelle d'énergie pure capable de créer ou de détruire. Après des siècles de guerre, ces divinités disparurent, laissant derrière elles des artefacts sacrés imprégnés de leur essence.

> Ces reliques ne sont pas de simples objets : elles portent en elles une volonté propre. Celui qui les manie n'hérite pas seulement de leur puissance, mais doit affronter la conscience même du dieu qui l'habitait. Certains héros devinrent des légendes… d'autres sombrèrent, consumés par une force trop grande pour eux.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▷ LES TEMPLES DES FRAGMENTS :*

> Les temples où reposent ces artefacts ne sont pas de simples ruines. Ce sont des poches d'univers façonnées par les divinités elles-mêmes. Chaque temple est vivant, changeant, et adapté à la nature de son dieu :

> - La montagne qui s'effondre sous les pas de l'intrus.
> - La jungle où les racines se referment comme des chaînes.
> - L'océan qui se soulève en mur de vagues pour repousser l'envahisseur.
> - La caverne dont les échos prennent forme et attaquent comme des ombres.

> Les épreuves ne mesurent pas seulement la force, mais aussi la volonté, la mémoire et le cœur de celui qui ose pénétrer ces lieux.
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*▷ LES TROIS VOIES DES COMBATTANTS :* 

> Dans ce monde fracturé entre légendes et ambitions, trois voies dominent :

🔻 *Les Profanes* – Dépourvus de toute aptitude magique, ces êtres ne possèdent aucun potentiel mystique. Pourtant, leur corps dépasse largement les limites humaines. Incapables d'utiliser la magie, leur restriction se transforme en avantage : leur force physique atteint un niveau hors du commun. Leur corps devient une véritable arme vivante, capable d'exploits dépassant l'entendement. Ils peuvent développer jusqu'à deux potentiels exceptionnels et manier l'Overdrive sans aucune restriction.

🔹 *Les Mononature* – Détenteurs d'une unique magie, ils la portent comme une marque indélébile. Feu, eau, gravité ou espace : leur élément devient leur essence même. Bien que limités à une seule nature magique, ils en explorent toutes les facettes, la perfectionnant jusqu'à l'extrême. Chaque technique découle de cette affinité particulière, leur permettant de concevoir des stratégies d'une redoutable complexité.

🔺 *Les Arcanistes* – Élus d'exception, ils sont capables de manier plusieurs natures magiques. Leur don rare leur permet de puiser dans diverses affinités, mais une règle immuable limite leur pouvoir : une seule technique par nature. Pourtant, cette contrainte devient leur plus grande force, car en combinant leurs différentes magies, ils déchaînent des stratégies imprévisibles, capables de renverser le cours d'un combat.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

▷ *LA QUÊTE DES ARTEFACTS :* 

> Désormais, les rumeurs courent : certains temples s'ouvrent à nouveau, attirant mercenaires, magiciens et arcanistes avides de gloire. Mais chaque artefact récupéré devient un fardeau : le monde observe, convoite, et se prépare à une guerre où la véritable menace n'est peut-être pas les aventuriers… mais les divinités elles-mêmes, prêtes à renaître à travers leurs fragments.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

        // Envoi du message initial avec l'image et le chargement
        const messageInitial = await zk.sendMessage(dest, { 
            image: { url: lien },
            caption: "*⏳ Chargement du monde Origamy...*\n0% [░░░░░░░░░░░░░░░░]"
        }, { quoted: ms });

        // Simulation du chargement (5 secondes)
        const etapes = 5;
        for (let i = 1; i <= etapes; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape
            
            const pourcentage = i * 20;
            const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);
            
            try {
                await zk.sendMessage(dest, { 
                    image: { url: lien },
                    caption: `*⏳ Chargement du monde Origamy...*\n   ${pourcentage}% [${barre}]`,
                    edit: messageInitial.key 
                });
            } catch (e) {
                console.error("Erreur modification message:", e);
            }
        }

        // Envoi du message final avec le contenu complet
        await zk.sendMessage(dest, { 
            image: { url: lien },
            caption: msg,
            edit: messageInitial.key 
        });
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
    'https://i.ibb.co/GQ2w5CgQ/astoria-vue-panoramique-nuit.jpg',
    'https://i.ibb.co/rKLYLXS8/astoria-vue-panoramique-jour.jpg',
    'https://i.ibb.co/fYmzBdp4/atelier-auriel-exterieur-jour.jpg',
    'https://i.ibb.co/v45V7qPX/atelier-auriel-exterieur-nuit.jpg',
    'https://i.ibb.co/NdRRFDhV/atelier-auriel-interieur-jour.jpg',
    'https://i.ibb.co/VcDBFhWv/atelier-auriel-interieur-nuit.jpg',
    'https://i.ibb.co/ynv5d54L/autel-chos-jour.jpg',
    'https://i.ibb.co/5gLvN8YZ/autel-chos-nuit.jpg',
    'https://i.ibb.co/Yqh4jn9/bastion-frigelance-exterieur-jour.jpg',
    'https://i.ibb.co/bM1QSKD7/bastion-frigelance-exterieur-nuit.jpg',
    'https://i.ibb.co/0j5cmV0r/bastion-frigelance-interieur.jpg',
    'https://i.ibb.co/Rp8qG8rZ/camp-prospecteurs-jour.jpg',
    'https://i.ibb.co/F4RC7TPB/camp-prospecteurs-nuit.jpg',
    'https://i.ibb.co/PyHZqDr/camp-sables-ardents-jour.jpg',
    'https://i.ibb.co/spqXmyhp/camp-sables-ardents-nuit.jpg',
    'https://i.ibb.co/bjwM1ycZ/camp-veilleurs-jour.jpg',
    'https://i.ibb.co/tMzHMzgc/camp-veilleurs-nuit.jpg',
    'https://i.ibb.co/7tvJJ92f/canyon-feu-jour.jpg',
    'https://i.ibb.co/x8q7kr0Y/canyon-feu-nuit.jpg',
    'https://i.ibb.co/V0QnH3Jm/canyon-feu-soleil-couchant.jpg',
    'https://i.ibb.co/j94d1VvP/cha-ne-brisecimes-jour.jpg',
    'https://i.ibb.co/TqLSQhQt/cha-ne-brisecimes-nuit.jpg',
    'https://i.ibb.co/XxnxsYx3/champs-dor-s-jour.jpg',
    'https://i.ibb.co/gL1qdJpL/champs-dor-s-nuit.jpg',
    'https://i.ibb.co/27QLzFhQ/chantier-naval-jour.jpg',
    'https://i.ibb.co/TDVQbFxL/chantier-naval-nuit.jpg',
    'https://i.ibb.co/rTFWrMP/citadelle-al-zahir-exterieur-jour.jpg',
    'https://i.ibb.co/pjqZg8wR/citadelle-al-zahir-exterieur-nuit.jpg',
    'https://i.ibb.co/YBwvVjZB/citadelle-al-zahir-interieur-jour.jpg',
    'https://i.ibb.co/4ZLZB5Kd/citadelle-al-zahir-interieur-nuit.jpg',
    'https://i.ibb.co/Y7bnFCdg/cit-velmira-jour.jpg',
    'https://i.ibb.co/zTnJHH9L/cit-velmira-nuit.jpg',
    'https://i.ibb.co/RG1r4xHD/cit-velmira-vue-panoramique-jour.jpg',
    'https://i.ibb.co/Q3YKrpfY/cit-velmira-vue-panoramique-nuit.jpg',
    'https://i.ibb.co/0jq4pnxs/clairi-re-anciens-jour.jpg',
    'https://i.ibb.co/jP1mp40p/clairi-re-anciens-nuit.jpg',
    'https://i.ibb.co/3PDDWDn/d-sert-sablechant-jour.jpg',
    'https://i.ibb.co/yb0vH22/d-sert-sablechant-nuit.jpg',
    'https://i.ibb.co/gbfpp6gN/ferme-eldrin-jour.jpg',
    'https://i.ibb.co/QvGpZ4wq/ferme-eldrin-nuit.jpg',
    'https://i.ibb.co/qM7Ng4rg/for-t-bor-ale-jour.jpg',
    'https://i.ibb.co/SDr3YWNj/for-t-bor-ale-nuit.jpg',
    'https://i.ibb.co/KxskLr73/for-t-sylvara-jour.jpg',
    'https://i.ibb.co/1GWv2ng8/for-t-sylvara-nuit.jpg',
    'https://i.ibb.co/Jwc89XNN/fort-givrec-ur-jour.jpg',
    'https://i.ibb.co/v4jRSByd/fort-givrec-ur-nuit.jpg',
    'https://i.ibb.co/SDhbpDwF/forteresse-durnholm-place-centrale-jour.jpg',
    'https://i.ibb.co/Xf7Qy07P/forteresse-durnholm-place-centrale-nuit.jpg',
    'https://i.ibb.co/Z6QNYrgx/forteresse-durnholm-seigneurie.jpg',
    'https://i.ibb.co/TqFkzhyN/forteresse-durnholm-vue-panoramique-jour.jpg',
    'https://i.ibb.co/0R5nf97Q/forteresse-durnholm-vue-panoramique-nuit.jpg',
    'https://i.ibb.co/sp3zwNZL/garnison-glaces-jour.jpg',
    'https://i.ibb.co/FLb5sp8m/garnison-glaces-nuit.jpg',
    'https://i.ibb.co/q3fYnSsj/garnison-nord-jour.jpg',
    'https://i.ibb.co/WvhYPDWh/garnison-nord-nuit.jpg',
    'https://i.ibb.co/yBddFXCn/garnison-sables-jour.jpg',
    'https://i.ibb.co/TMMV4FRf/garnison-sables-nuit.jpg',
    'https://i.ibb.co/39SX467r/hameau-alderon-jour.jpg',
    'https://i.ibb.co/qLNFvQrT/hameau-alderon-nuit.jpg',
    'https://i.ibb.co/qL3CNKvx/lac-c-leste-jour.jpg',
    'https://i.ibb.co/pvpqCsd9/lac-c-leste-nuit.jpg',
    'https://i.ibb.co/mfkyxHV/marais-s-l-ne-jour.jpg',
    'https://i.ibb.co/27jLNghJ/marais-s-l-ne-nuit.jpg',
    'https://i.ibb.co/zTcYQ65S/mine-onyx-exterieur-jour.jpg',
    'https://i.ibb.co/pBHQ04sk/mine-onyx-exterieur-nuit.jpg',
    'https://i.ibb.co/xS244gbk/mine-onyx-interieur.jpg',
    'https://i.ibb.co/Z1WWhkZQ/monts-glacepierre-jour.jpg',
    'https://i.ibb.co/p6KR1r3X/monts-glacepierre-nuit.jpg',
    'https://i.ibb.co/YBtYtQyK/oasis-kherem-jour.jpg',
    'https://i.ibb.co/Jj1nNGmw/oasis-kherem-nuit.jpg',
    'https://i.ibb.co/dsT9V34K/oasis-kherem-soleil-couchant.jpg',
    'https://i.ibb.co/vNzLdZ7/plaine-eldoria-jour.jpg',
    'https://i.ibb.co/S4pnH3XS/plaine-eldoria-nuit.jpg',
    'https://i.ibb.co/BKyt4T2d/pont-alliance-jour.jpg',
    'https://i.ibb.co/mr0m3B8T/pont-alliance-nuit.jpg',
    'https://i.ibb.co/NgffYYTY/port-vaeloria-jour.jpg',
    'https://i.ibb.co/d0Y96ZF9/port-vaeloria-nuit.jpg',
    'https://i.ibb.co/DfhGHGDd/quartier-dockers-jour.jpg',
    'https://i.ibb.co/pj7xDB6k/quartier-dockers-nuit.jpg',
    'https://i.ibb.co/yBQfbw3y/refuge-ourse-jour.jpg',
    'https://i.ibb.co/9HVqnZ3Q/refuge-ourse-nuit.jpg',
    'https://i.ibb.co/q3T351RQ/rivi-re-azurine-jour.jpg',
    'https://i.ibb.co/Z6d4HySR/rivi-re-azurine-nuit.jpg',
    'https://i.ibb.co/tP2vSzfg/ruines-valmora-jour.jpg',
    'https://i.ibb.co/m5YYnY5D/ruines-valmora-nuit.jpg',
    'https://i.ibb.co/d0t0cFSN/scierie-garn-jour.jpg',
    'https://i.ibb.co/BVmNt9qt/scierie-garn-nuit.jpg',
    'https://i.ibb.co/bZVT1nf/sommet-titan-jour.jpg',
    'https://i.ibb.co/RkKS70xV/sommet-titan-nuit.jpg',
    'https://i.ibb.co/7dLjxqRt/taverne-voyageur-exterieur-jour.jpg',
    'https://i.ibb.co/DDjGdQMs/taverne-voyageur-exterieur-nuit.jpg',
    'https://i.ibb.co/LDVFKXdZ/taverne-voyageur-interieur.jpg',
    'https://i.ibb.co/R4CLk67N/th-tre-opaline-exterieur-jour.jpg',
    'https://i.ibb.co/TMnpdh42/th-tre-opaline-exterieur-nuit.jpg',
    'https://i.ibb.co/BHV3vBJd/th-tre-opaline-interieur-jour.jpg',
    'https://i.ibb.co/h1Y9Rzt3/th-tre-opaline-interieur-nuit.jpg',
    'https://i.ibb.co/hR1cN2Tv/toundra-givrebrume-jour.jpg',
    'https://i.ibb.co/k642Pr6h/toundra-givrebrume-nuit.jpg',
    'https://i.ibb.co/tw4tJ9Xm/vall-e-brumes-jour.jpg',
    'https://i.ibb.co/SDTfSqv9/vall-e-brumes-nuit.jpg',
    'https://i.ibb.co/pBcFHSyP/village-icethorn-jour.jpg',
    'https://i.ibb.co/8LhKGTqg/village-icethorn-nuit.jpg',
    'https://i.ibb.co/zTPSqQk4/village-loryn-jour.jpg',
    'https://i.ibb.co/pjPCqwyH/village-loryn-nuit.jpg',
    'https://i.ibb.co/V08N4vYP/village-loryn-soleil-couchant.jpg',
    'https://i.ibb.co/jmYXVX1/village-nymir-jour.jpg',
    'https://i.ibb.co/hF81y0BS/village-nymir-nuit.jpg',
    'https://i.ibb.co/tPbXH82x/Image-2025-09-11-15-24-21-0.jpg',
    'https://i.ibb.co/JwkzW3LY/Image-2025-09-11-15-24-21-1.jpg',
    'https://i.ibb.co/1YJ1cH54/Image-2025-09-11-15-24-21-10.jpg',
    'https://i.ibb.co/5X2zPF9d/Image-2025-09-11-15-24-21-11.jpg',
    'https://i.ibb.co/LDK9wtZc/Image-2025-09-11-15-24-21-12.jpg',
    'https://i.ibb.co/JjvB1nMw/Image-2025-09-11-15-24-21-13.jpg',
    'https://i.ibb.co/ccYhg08t/Image-2025-09-11-15-24-21-14.jpg',
    'https://i.ibb.co/tw6t0ncZ/Image-2025-09-11-15-24-21-15.jpg',
    'https://i.ibb.co/nN8rvRzF/Image-2025-09-11-15-24-21-16.jpg',
    'https://i.ibb.co/bMpRWdL9/Image-2025-09-11-15-24-21-17.jpg',
    'https://i.ibb.co/tp9d11qT/Image-2025-09-11-15-24-21-18.jpg',
    'https://i.ibb.co/TDBjkznL/Image-2025-09-11-15-24-21-19.jpg',
    'https://i.ibb.co/8gjdVX6Y/Image-2025-09-11-15-24-21-20.jpg',
    'https://i.ibb.co/6RmBGvvv/Image-2025-09-11-15-24-21-21.jpg',
    'https://i.ibb.co/ZzLdS4q9/Image-2025-09-11-15-24-21-2.jpg',
    'https://i.ibb.co/3yw3HyDq/Image-2025-09-11-15-24-21-22.jpg',
    'https://i.ibb.co/7NyqdZ0v/Image-2025-09-11-15-24-21-23.jpg',
    'https://i.ibb.co/cXDjhmj2/Image-2025-09-11-15-24-21-24.jpg',
    'https://i.ibb.co/wTbz7zq/Image-2025-09-11-15-24-21-25.jpg',
    'https://i.ibb.co/n8N2DZTP/Image-2025-09-11-15-24-21-27.jpg',
    'https://i.ibb.co/WdVq3KT/Image-2025-09-11-15-24-21-26.jpg',
    'https://i.ibb.co/HpH0HxTh/Image-2025-09-11-15-24-21-28.jpg',
    'https://i.ibb.co/8nSTzQPR/Image-2025-09-11-15-24-21-29.jpg',
    'https://i.ibb.co/Qvr8B9Fx/Image-2025-09-11-15-24-21-30.jpg',
    'https://i.ibb.co/7JwDjJrB/Image-2025-09-11-15-24-21-31.jpg',
    'https://i.ibb.co/f3wxfN3/Image-2025-09-11-15-24-21-32.jpg',
    'https://i.ibb.co/HD4kjMNd/Image-2025-09-11-15-24-21-36.jpg',
    'https://i.ibb.co/wFkstW5x/Image-2025-09-11-15-24-21-33.jpg',
    'https://i.ibb.co/fdj90WJP/Image-2025-09-11-15-24-21-34.jpg',
    'https://i.ibb.co/JjWG7Rvy/Image-2025-09-11-15-24-21-35.jpg',
    'https://i.ibb.co/tpLjV95V/Image-2025-09-11-15-24-21-37.jpg',
    'https://i.ibb.co/FL783jcW/Image-2025-09-11-15-24-21-38.jpg',
    'https://i.ibb.co/wZ9421s7/Image-2025-09-11-15-24-21-39.jpg',
    'https://i.ibb.co/s9c5ybDm/Image-2025-09-11-15-24-21-4.jpg',
    'https://i.ibb.co/zhTsrrwF/Image-2025-09-11-15-24-21-40.jpg',
    'https://i.ibb.co/2r4d3T8/Image-2025-09-11-15-24-21-41.jpg',
    'https://i.ibb.co/vxQy5Q4z/Image-2025-09-11-15-24-21-42.jpg',
    'https://i.ibb.co/Kzs0dxhK/Image-2025-09-11-15-24-21-44.jpg',
    'https://i.ibb.co/gZs6WpKY/Image-2025-09-11-15-24-21-45.jpg',
    'https://i.ibb.co/Ld361vnn/Image-2025-09-11-15-24-21-43.jpg',
    'https://i.ibb.co/d4ZWSYX6/Image-2025-09-11-15-24-21-46.jpg',
    'https://i.ibb.co/8DTphcQq/Image-2025-09-11-15-24-21-47.jpg',
    'https://i.ibb.co/XrbhczVb/Image-2025-09-11-15-24-21-49.jpg',
    'https://i.ibb.co/V0ZPHwgp/Image-2025-09-11-15-24-21-48.jpg',
    'https://i.ibb.co/d0d02qv7/Image-2025-09-11-15-24-21-5.jpg',
    'https://i.ibb.co/VY6fThHH/Image-2025-09-11-15-24-21-51.jpg',
    'https://i.ibb.co/dsyR6sb8/Image-2025-09-11-15-24-21-50.jpg',
    'https://i.ibb.co/XrkhPDCm/Image-2025-09-11-15-24-21-52.jpg',
    'https://i.ibb.co/35M6zMqC/Image-2025-09-11-15-24-21-53.jpg',
    'https://i.ibb.co/zHbHQFWY/Image-2025-09-11-15-24-21-54.jpg',
    'https://i.ibb.co/BHnK4K1m/Image-2025-09-11-15-24-21-55.jpg',
    'https://i.ibb.co/QjPTXx2H/Image-2025-09-11-15-24-21-56.jpg',
    'https://i.ibb.co/cGSdBg3/Image-2025-09-11-15-24-21-57.jpg',
    'https://i.ibb.co/5XK9QZwh/Image-2025-09-11-15-24-21-58.jpg',
    'https://i.ibb.co/Fbpx51Bz/Image-2025-09-11-15-24-21-59.jpg',
    'https://i.ibb.co/b58Bh1p7/Image-2025-09-11-15-24-21-6.jpg',
    'https://i.ibb.co/fZnhDr6/Image-2025-09-11-15-24-21-61.jpg',
    'https://i.ibb.co/N2XnmP3b/Image-2025-09-11-15-24-21-60.jpg',
    'https://i.ibb.co/tMqyxmCt/Image-2025-09-11-15-24-21-62.jpg',
    'https://i.ibb.co/JWqg27Dk/Image-2025-09-11-15-24-21-7.jpg',
    'https://i.ibb.co/Gf5XcgQw/Image-2025-09-11-15-24-21-8.jpg',
    'https://i.ibb.co/qvjkNC7/Image-2025-09-11-15-24-21-9.jpg',
    'https://i.ibb.co/fzrqgQpg/Image-2025-09-11-15-24-22-100.jpg',
    'https://i.ibb.co/bgZM7r0w/Image-2025-09-11-15-24-22-101.jpg',
    'https://i.ibb.co/LzKG3qTK/Image-2025-09-11-15-24-22-103.jpg',
    'https://i.ibb.co/zVbs6jxV/Image-2025-09-11-15-24-22-104.jpg',
    'https://i.ibb.co/pBDVwsyT/Image-2025-09-11-15-24-22-102.jpg',
    'https://i.ibb.co/LhsQjbkj/Image-2025-09-11-15-24-22-105.jpg',
    'https://i.ibb.co/rGy7wfRj/Image-2025-09-11-15-24-22-106.jpg',
    'https://i.ibb.co/N2sC7vzr/Image-2025-09-11-15-24-22-107.jpg',
    'https://i.ibb.co/8LYvGrJR/Image-2025-09-11-15-24-22-108.jpg',
    'https://i.ibb.co/SLnSQQW/Image-2025-09-11-15-24-22-109.jpg',
    'https://i.ibb.co/ZR0yVmdh/Image-2025-09-11-15-24-22-110.jpg',
    'https://i.ibb.co/LhQWR2tp/Image-2025-09-11-15-24-22-111.jpg',
    'https://i.ibb.co/ch67MdfY/Image-2025-09-11-15-24-22-112.jpg',
    'https://i.ibb.co/GQR2nDyC/Image-2025-09-11-15-24-22-113.jpg',
    'https://i.ibb.co/KjQfV01f/Image-2025-09-11-15-24-22-114.jpg',
    'https://i.ibb.co/BHLdcnTN/Image-2025-09-11-15-24-22-116.jpg',
    'https://i.ibb.co/dJG6td2w/Image-2025-09-11-15-24-22-115.jpg',
    'https://i.ibb.co/fzCQqMdG/Image-2025-09-11-15-24-22-117.jpg',
    'https://i.ibb.co/Q7BLF1h9/Image-2025-09-11-15-24-22-118.jpg',
    'https://i.ibb.co/WNQyYgzJ/Image-2025-09-11-15-24-22-119.jpg',
    'https://i.ibb.co/n83NZcxN/Image-2025-09-11-15-24-22-120.jpg',
    'https://i.ibb.co/SDn9c2fj/Image-2025-09-11-15-24-22-121.jpg',
    'https://i.ibb.co/7FyTcK3/Image-2025-09-11-15-24-22-122.jpg',
    'https://i.ibb.co/hFWmwjNx/Image-2025-09-11-15-24-22-123.jpg',
    'https://i.ibb.co/5hTTGqhC/Image-2025-09-11-15-24-22-124.jpg',
    'https://i.ibb.co/pBbx1gf2/Image-2025-09-11-15-24-22-125.jpg',
    'https://i.ibb.co/fYsz8kbQ/Image-2025-09-11-15-24-22-126.jpg',
    'https://i.ibb.co/v48GKb51/Image-2025-09-11-15-24-22-63.jpg',
    'https://i.ibb.co/DP5kgLCq/Image-2025-09-11-15-24-22-64.jpg',
    'https://i.ibb.co/kRyx0Xb/Image-2025-09-11-15-24-22-65.jpg',
    'https://i.ibb.co/k2nFPLpn/Image-2025-09-11-15-24-22-66.jpg',
    'https://i.ibb.co/G3nP0yQw/Image-2025-09-11-15-24-22-68.jpg',
    'https://i.ibb.co/6JFBWrpY/Image-2025-09-11-15-24-22-67.jpg',
    'https://i.ibb.co/1tZCV9Bc/Image-2025-09-11-15-24-22-69.jpg',
    'https://i.ibb.co/xthvcsxC/Image-2025-09-11-15-24-22-71.jpg',
    'https://i.ibb.co/mCZXRXWX/Image-2025-09-11-15-24-22-72.jpg',
    'https://i.ibb.co/whnJ0YYs/Image-2025-09-11-15-24-22-70.jpg',
    'https://i.ibb.co/hJDLW7wH/Image-2025-09-11-15-24-22-73.jpg',
    'https://i.ibb.co/nsS5Jvzv/Image-2025-09-11-15-24-22-77.jpg',
    'https://i.ibb.co/vCkYch48/Image-2025-09-11-15-24-22-74.jpg',
    'https://i.ibb.co/tM8vg2zn/Image-2025-09-11-15-24-22-75.jpg',
    'https://i.ibb.co/qMWvVFVh/Image-2025-09-11-15-24-22-76.jpg',
    'https://i.ibb.co/rfQs5dmd/Image-2025-09-11-15-24-22-78.jpg',
    'https://i.ibb.co/sd2mLHtN/Image-2025-09-11-15-24-22-79.jpg',
    'https://i.ibb.co/mV3Vkvh2/Image-2025-09-11-15-24-22-80.jpg',
    'https://i.ibb.co/1f1jdHWB/Image-2025-09-11-15-24-22-81.jpg',
    'https://i.ibb.co/Kx6FgY2t/Image-2025-09-11-15-24-22-82.jpg',
    'https://i.ibb.co/gLXcbrQ8/Image-2025-09-11-15-24-22-83.jpg',
    'https://i.ibb.co/dsTxxkPc/Image-2025-09-11-15-24-22-84.jpg',
    'https://i.ibb.co/2YfT4RFG/Image-2025-09-11-15-24-22-85.jpg',
    'https://i.ibb.co/xPkQmzF/Image-2025-09-11-15-24-22-86.jpg',
    'https://i.ibb.co/5gqPyLMh/Image-2025-09-11-15-24-22-87.jpg',
    'https://i.ibb.co/bj8Nrp9Z/Image-2025-09-11-15-24-22-88.jpg',
    'https://i.ibb.co/WpFDSrFM/Image-2025-09-11-15-24-22-89.jpg',
    'https://i.ibb.co/F4PPkmd7/Image-2025-09-11-15-24-22-90.jpg',
    'https://i.ibb.co/zhXjXVQ9/Image-2025-09-11-15-24-22-91.jpg',
    'https://i.ibb.co/VpgNBH6K/Image-2025-09-11-15-24-22-93.jpg',
    'https://i.ibb.co/sdgwbCDq/Image-2025-09-11-15-24-22-92.jpg',
    'https://i.ibb.co/1fN13Wsh/Image-2025-09-11-15-24-22-95.jpg',
    'https://i.ibb.co/HTTWGsnJ/Image-2025-09-11-15-24-22-94.jpg',
    'https://i.ibb.co/3yJrNKL1/Image-2025-09-11-15-24-22-96.jpg',
    'https://i.ibb.co/pj623JPD/Image-2025-09-11-15-24-22-97.jpg',
    'https://i.ibb.co/XxSQxW3D/Image-2025-09-11-15-24-22-98.jpg',
    'https://i.ibb.co/DdFrn72/Image-2025-09-11-15-24-22-99.jpg',
    'https://i.ibb.co/cKGZRtXX/20250911-193010.jpg',
    'https://i.ibb.co/Vpzs1NZV/belle-etoile-chambre-eco-nuit.jpg',
    'https://i.ibb.co/N6hvdc3R/belle-etoile-chambre-eco-jour.jpg',
    'https://i.ibb.co/TMc7LzrR/belle-etoile-chambre-luxe.jpg',
    'https://i.ibb.co/N28BmT46/belle-etoile-chambre-standard.jpg',
    'https://i.ibb.co/8D1h6hxz/belle-etoile-exterieur-nuit.jpg',
    'https://i.ibb.co/cX7MCdgL/belle-etoile-interieur.jpg',
    'https://i.ibb.co/60xbZK0r/belle-etoile-exterieur-jour.jpg'
];
  
  let html = `
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Galerie Origamy World</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
      
      body {
        font-family: 'Noto Sans SC', sans-serif;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: #e0e0e0;
        margin: 0;
        padding: 20px;
        min-height: 100vh;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(90deg, rgba(74, 107, 156, 0.3) 0%, rgba(107, 74, 156, 0.3) 100%);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .title {
        font-size: 2.5em;
        font-weight: 700;
        background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        margin-bottom: 10px;
      }
      
      .subtitle {
        font-size: 1.1em;
        color: #b8b8b8;
        font-weight: 500;
      }
      
      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .image-card {
        background: linear-gradient(145deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 50, 0.9) 100%);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        transition: all 0.3s ease;
        position: relative;
      }
      
      .image-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #ffd700, #ff6b6b, #4ecdc4);
        z-index: 2;
      }
      
      .image-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        border-color: rgba(255, 215, 0, 0.3);
      }
      
      .image-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
      }
      
      .image-card:hover img {
        transform: scale(1.1);
      }
      
      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        padding: 20px 15px 15px;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }
      
      .image-card:hover .image-overlay {
        transform: translateY(0);
      }
      
      .image-name {
        font-size: 0.9em;
        color: #ffd700;
        font-weight: 500;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
      
      .footer {
        text-align: center;
        margin-top: 40px;
        padding: 20px;
        color: #888;
        font-size: 0.9em;
      }
      
      .element-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #ffd700;
        z-index: 3;
      }
      
      /* Animation d'entrée */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .image-card {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
      }
      
      .image-card:nth-child(odd) {
        animation-delay: 0.1s;
      }
      
      .image-card:nth-child(even) {
        animation-delay: 0.2s;
      }
      
      /* Scrollbar personnalisée */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(30, 30, 50, 0.8);
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #ffd700, #ff6b6b);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(45deg, #ffed4e, #ff8a8a);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="title">Origamy World Gallery</div>
      <div class="subtitle">Explore le monde fantastique de Origamy World</div>
    </div>
    
    <div class="gallery">
      ${liens.map((url, index) => {
        const fileName = url.split('/').pop().split('.')[0];
        const elementIcons = ['⚡', '🔥', '💧', '❄️', '🌪️', '🌱', '🪨'];
        const randomElement = elementIcons[Math.floor(Math.random() * elementIcons.length)];
        
        return `
          <div class="image-card">
            <div class="element-icon">${randomElement}</div>
            <img src="${url}" alt="Origamy World ${index + 1}" />
            <div class="image-overlay">
              <div class="image-name">${fileName.replace(/-/g, ' ')}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div class="footer">
      © 2025 Origamy World • Developer by SUPREMUS PROD
    </div>
  </body>
  </html>`;

const fileName = `origamy_galerie_genshin_${randomInt(10000)}.html`;
writeFileSync(fileName, html);

await zk.sendMessage(dest, {
  document: readFileSync(fileName),
  mimetype: 'text/html',
  fileName: 'origamy_galerie.html',
  caption: '*🖼 GALERIE ORIGAMY WORLD 🖼*'
}, { quoted: ms });

unlinkSync(fileName);
}); 
