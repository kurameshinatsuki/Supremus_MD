// game_data.js
const GAME_DATA = {
  'ABM': {
    name: 'Anime Battle Multivers',
    contents: {
      common: [
        { name: 'Naruto: Mode Sage', description: 'Maîtrise des techniques senjutsu' },
        { name: 'Goku: Base Form', description: 'Forme de combat standard' },
        { name: 'Luffy: Gear Second', description: 'Augmentation de la vitesse' },
        { name: 'Ichigo: Shikai', description: 'Forme initiale de Zanpakutō' },
        { name: 'Saitama: Normal Punch', description: 'Coup normal mais puissant' }
      ],
      rare: [
        { name: 'Naruto: Mode Kurama', description: 'Contrôle partiel du renard à neuf queues' },
        { name: 'Goku: Super Saiyan', description: 'Transformation légendaire' },
        { name: 'Luffy: Gear Fourth', description: 'Forme de combat avancée' },
        { name: 'Ichigo: Bankai', description: 'Forme ultime de Zanpakutō' },
        { name: 'Saitama: Serious Punch', description: 'Coup sérieux extrêmement puissant' }
      ],
      epic: [
        { name: 'Naruto: Mode Baryon', description: 'Fusion d\'énergie avec Kurama' },
        { name: 'Goku: Ultra Instinct', description: 'Technique divine de combat' },
        { name: 'Luffy: Gear Fifth', description: 'Forme mythique de libération' },
        { name: 'Ichigo: Full Hollow', description: 'Forme hollow complète' },
        { name: 'Saitama: Ultimate Technique', description: 'Technique ultime imprévisible' }
      ],
      legendary: [
        { name: 'Naruto: Six Paths Sage Mode', description: 'Mode sage des six chemins' },
        { name: 'Goku: Ultra Instinct Mastered', description: 'Maîtrise complète de l\'instinct ultime' },
        { name: 'Luffy: Sun God Nika', description: 'Forme divine de libération' },
        { name: 'Ichigo: True Bankai', description: 'Forme véritable de Zanpakutō' },
        { name: 'Saitama: Cosmic Fear', description: 'Puissance cosmique illimitée' }
      ]
    }
  },
  'Speed Rush': {
    name: 'Speed Rush',
    contents: {
      common: [
        { name: 'Toyota AE86', description: 'Légendaire coureur des montagnes' },
        { name: 'Nissan Skyline R34', description: 'Icône de la culture JDM' },
        { name: 'Mazda RX-7', description: 'Voiture à moteur rotatif' },
        { name: 'Honda Civic Type R', description: 'Compacte performante' },
        { name: 'Subaru Impreza WRX STI', description: 'Traction intégrale rallye' }
      ],
      rare: [
        { name: 'Nissan GT-R R35', description: 'Supercar japonaise' },
        { name: 'Porsche 911 GT3', description: 'Précision allemande' },
        { name: 'Chevrolet Corvette C8', description: 'Sportive américaine' },
        { name: 'BMW M4 GTS', description: 'Performance track-focused' },
        { name: 'Audi R8 V10', description: 'Supercar quotidienne' }
      ],
      epic: [
        { name: 'Ferrari 488 Pista', description: 'Pur-sang italien' },
        { name: 'Lamborghini Huracan STO', description: 'Supercar extreme' },
        { name: 'McLaren 720S', description: 'Engineering excellence' },
        { name: 'Porsche 918 Spyder', description: 'Hybride hypercar' },
        { name: 'Ford GT', description: 'Héritage racing' }
      ],
      legendary: [
        { name: 'Bugatti Chiron Super Sport', description: 'Ultimate speed machine' },
        { name: 'Koenigsegg Jesko Absolut', description: 'Hypercar suédoise' },
        { name: 'Pagani Huayra BC', description: 'Œuvre d\'art mécanique' },
        { name: 'Aston Martin Valkyrie', description: 'Hypercar F1-inspired' },
        { name: 'McLaren Speedtail', description: 'Hyper-GT ultime' }
      ]
    }
  },
  'Yu-Gi-Oh': {
    name: 'Yu-Gi-Oh Speed Duel',
    contents: {
      common: [
        { name: 'Dark Magician', description: 'Magicien sombre légendaire' },
        { name: 'Blue-Eyes White Dragon', description: 'Dragon blanc aux yeux bleus' },
        { name: 'Red-Eyes Black Dragon', description: 'Dragon noir aux yeux rouges' },
        { name: 'Summoned Skull', description: 'Démon invoqué' },
        { name: 'Celtic Guardian', description: 'Garde celte' }
      ],
      rare: [
        { name: 'Dark Magician Girl', description: 'Apprentie magicienne' },
        { name: 'Blue-Eyes Ultimate Dragon', description: 'Fusion ultime' },
        { name: 'Red-Eyes Darkness Dragon', description: 'Évolution ténébreuse' },
        { name: 'Buster Blader', description: 'Pourfendeur de dragons' },
        { name: 'Gaia The Fierce Knight', description: 'Chevalier féroce' }
      ],
      epic: [
        { name: 'Slifer the Sky Dragon', description: 'Dragon divin égyptien' },
        { name: 'Obelisk the Tormentor', description: 'Dieu égyptien du jugement' },
        { name: 'The Winged Dragon of Ra', description: 'Dieu égyptien suprême' },
        { name: 'Exodia the Forbidden One', description: 'Créature scellée' },
        { name: 'Black Luster Soldier', description: 'Soldat du chaos' }
      ],
      legendary: [
        { name: 'Stardust Dragon', description: 'Dragon des souhaits' },
        { name: 'Number 39: Utopia', description: 'Guerrier de l\'espoir' },
        { name: 'Firewall Dragon', description: 'Dragon cyberse' },
        { name: 'Ash Blossom & Joyous Spring', description: 'Spirit hand trap' },
        { name: 'Accesscode Talker', description: 'Final boss cyberse' }
      ]
    }
  },
  'Origamy World': {
    name: 'Origamy World',
    contents: {
      common: [
        { name: 'Paper Crane', description: 'Grue en papier traditionnelle' },
        { name: 'Paper Samurai', description: 'Guerrier japonais en papier' },
        { name: 'Paper Dragon', description: 'Dragon légendaire en papier' },
        { name: 'Paper Phoenix', description: 'Phénix renaissant en papier' },
        { name: 'Paper Ninja', description: 'Assassin silencieux en papier' }
      ],
      rare: [
        { name: 'Origami Beast', description: 'Créature mythique en papier' },
        { name: 'Paper Elemental', description: 'Être élémentaire en papier' },
        { name: 'Folding Guardian', description: 'Protecteur en papier plié' },
        { name: 'Paper Sorcerer', description: 'Mage manipulant le papier' },
        { name: 'Crane Warrior', description: 'Guerrier-grue en papier' }
      ],
      epic: [
        { name: 'Thousand Paper Cranes', description: 'Armée de grues en papier' },
        { name: 'Origami Dragon Lord', description: 'Seigneur dragon en papier' },
        { name: 'Paper Kingdom', description: 'Royaume entier en papier' },
        { name: 'Folding Titan', description: 'Géant de papier plié' },
        { name: 'Origami Deity', description: 'Divinité du papier plié' }
      ],
      legendary: [
        { name: 'Infinite Fold', description: 'Technique de pliage infinie' },
        { name: 'Paper Universe', description: 'Univers complet en papier' },
        { name: 'Origami Creator', description: 'Créateur de réalités en papier' },
        { name: 'Eternal Crane', description: 'Grue éternelle en papier' },
        { name: 'World Folder', description: 'Maître du pliage mondial' }
      ]
    }
  }
};

module.exports = { GAME_DATA };