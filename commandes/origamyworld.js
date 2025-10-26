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
