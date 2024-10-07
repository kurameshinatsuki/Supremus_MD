// lieux.js

// Emojis de base pour les lieux principaux
const emojimap = {
    '⛩️': { nom: 'Porte Principale', image: 'https://i.ibb.co/MpxhHrd/20240927-212108.jpg' },
    '🛞': { nom: 'Transport Public', image: 'https://i.ibb.co/5WjszYy/20240927-221021.jpg' },
    '🪦': { nom: 'Cimetière', image: 'https://i.ibb.co/Kh3JdMK/20240927-221342.jpg' },
    '🌲': { nom: 'Bois Sacrés', image: 'https://i.ibb.co/3mpGZhf/20240927-221704.jpg' },
    '🏟️': { nom: 'Colisée d\'Aurelius', image: 'https://i.ibb.co/RBPVVNz/20240927-222034.jpg' },
    '🕳️': { nom: 'Arène Souterraine', image: 'https://i.ibb.co/SnqSzGk/20240927-222306.jpg' },
    '🏛️': { nom: 'Centre de Commandement', image: 'https://i.ibb.co/L091WtQ/20240927-222537.jpg' },
    '🏹': { nom: 'Camp d\'Entraînement', image: 'https://i.ibb.co/0MXQjcy/20240927-222739.jpg' },
    '🎓': { nom: 'Académie d\'Arcana', image: 'https://i.ibb.co/WvfbbgK/20240927-223020.jpg' },
    '🏢': { nom: 'Caserne de la Garde', image: 'https://i.ibb.co/MVFJzh1/20240927-223321.jpg' },
    '🛍️': { nom: 'Marché Central', image: 'https://i.ibb.co/nBZ08Lh/20240927-224242.jpg' },
    '🍻': { nom: 'Luxury Taverne', image: 'https://i.ibb.co/2N3ZKtr/20240927-224604.jpg' },
    '🥖': { nom: 'Baguette Dorée', image: 'https://i.ibb.co/4dKMmWq/20240927-224809.jpg' },
    '⚒️': { nom: 'Forge d\'Edward', image: 'https://i.ibb.co/Qd80mx4/20240927-225101.jpg' },
    '🎎': { nom: 'Grand Bazar', image: 'https://i.ibb.co/hRpgVLP/20240927-225518.jpg' },
    '🏤': { nom: 'Bureau des Missions', image: 'https://i.ibb.co/sWt3HFh/20240927-225230.jpg' },
    '🏦': { nom: 'Salle des Trésors', image: 'https://i.ibb.co/51qmnJJ/20240927-233900.jpg' },
    '🫧': { nom: 'Bains Public', image: 'https://i.ibb.co/bJPbxW2/20240927-230107.jpg' },
    '🏬': { nom: 'Galerie des Arts', image: 'https://i.ibb.co/4m005vx/20240927-233715.jpg' },
    '📚': { nom: 'Grande Bibliothèque', image: 'https://i.ibb.co/0YkNDvc/20240927-230702.jpg' },
    '🏥': { nom: 'Centre Médical', image: 'https://i.ibb.co/G3ztCpW/20240927-230914.jpg' },
    '⚗️': { nom: 'Laboratoire d\'Oris', image: 'https://i.ibb.co/mBqrG20/20240927-233225.jpg' },
    '🏘️': { nom: 'Quartier Résidentiel', image: 'https://i.ibb.co/G5jPJN8/20240927-233347.jpg' },
    '🎮': { nom: 'Salle des Jeux', image: 'https://i.ibb.co/jv8q587/20240927-234214.jpg' },
    '🛀': { nom: 'Bains Royaux', image: 'https://i.ibb.co/zX3NZrR/20240927-234341.jpg' },
    '🏡': { nom: 'Résidences Nobles', image: 'https://i.ibb.co/RCpMXYj/20240927-234545.jpg' },
    '⛲': { nom: 'Cour d\'Honneur', image: 'https://i.ibb.co/2YMF9QC/20240927-235106.jpg' },
    '🏰': { nom: 'Palais Royal', image: 'https://i.ibb.co/k4ZSCtD/20240927-235254.jpg' },
    '👑': { nom: 'Salle du Trône', image: 'https://i.ibb.co/5Tr77gw/20240927-235428.jpg' },
    '🏯': { nom: 'Hall des Gardiens', image: 'https://i.ibb.co/t2Txdd8/20240928-000303.jpg' },
    '⚱️': { nom: 'Oubliettes', image: 'https://i.ibb.co/CwZk2nF/20240927-235758.jpg' },
    '🐎': { nom: 'Écuries Royales', image: 'https://i.ibb.co/VgCPhyd/20240928-000526.jpg' },
    '🔭': { nom: 'Tour Astral', image: 'https://i.ibb.co/fCRgqwy/20240928-001305.jpg' },
    '🗡️': { nom: 'Arsenal Royaux', image: 'https://i.ibb.co/HGhxgDs/20240928-001444.jpg' },
    '🗺️': { nom: 'Carte Astoria', image: 'https://i.ibb.co/LtFzy6j/Image-2024-10-05-12-16-43.jpg' } // ajouter une image si nécessaire
};

// Suffixes pour les sous-lieux et événements
const eventEmojis = {
    'ℹ️': 'Event',
    '⬇️': 'Sud',
    '⬆️': 'Nord',
    '➡️': 'Est',
    '⬅️': 'Ouest',
    '🧑‍🍳': 'Comptoir',
    '🪑': 'Place',
    '1️⃣': 'Chambre 1',
    '2️⃣': 'Chambre 2',
    '3️⃣': 'Chambre 3'
};

// Fonction pour générer la carte complète des emojis avec leurs sous-lieux et événements
function generateCompleteEmojiMap() {
    const completeEmojiMap = {};

    // Remplir le completeEmojiMap avec les sous-lieux
    for (const [emoji, lieu] of Object.entries(emojimap)) {
        completeEmojiMap[emoji] = lieu.nom; // Enregistre juste le nom

        // Ajout des événements et sous-lieux pour chaque lieu
        for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
            completeEmojiMap[emoji + eventEmoji] = lieu.nom + ' ' + eventName;
        }
    }
    return completeEmojiMap;
}

// Messages personnalisés en cas d'absence de verdict
const customNoVerdictMessages = {
    'Porte Principale': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les gardes montent la garde avec vigilance, observant chaque nouvel arrivant. L’ambiance est remplie d’anticipation.\n\n*NEXT...*',

    'Transport Public': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> La navette est attendue avec impatience par des voyageurs de tous horizons. Les discussions sont animées.\n\n*NEXT...*',

    'Cimetière': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Un calme pesant enveloppe le cimetière. Des murmures lointains se font entendre, donnant un air mystique à l’endroit.\n\n*NEXT...*',

    'Bois Sacrés': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les arbres majestueux semblent murmurer des secrets anciens. L’atmosphère est empreinte de magie.\n\n*NEXT...*',

    'Colisée d\'Aurelius': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L’arène semble fermé pour aujourd'hui, le calme y règne pour le moment.\n\n*NEXT...*',

    'Arène Souterraine': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Des murmures de paris secrets flottent dans l’air. L’atmosphère est sombre et mystérieux.\n\n*NEXT...*',

    'Centre de Commandement': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le bâtiment se dresse en bordure, la rue est animée par des discussions en tout genre. Un officiers se tient à l'entrée.\n\n*NEXT...*',

    'Camp d\'Entraînement': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les bruits émit des soldats qui s’entraînent avec ardeur, faisant résonner leurs armes parviennent à vous. L’atmosphère est dynamique.\n\n*NEXT...*',

    'Académie d\'Arcana': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L\`Academie est majestueux, certains étudiants fréquente la cour. La magie est dans l’air.\n\n*NEXT...*',

    'Caserne de la Garde': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L’odeur du cuir et du métal flotte dans l’air. Deux gardes se partagent des histoires captivantes, se tenant prêt du bâtiment.\n\n*NEXT...*',

    'Marché Central': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le marché est animé, les cris des commerçants et les discussions des clients créent une ambiance vivante.\n\n*NEXT...*',

    'Luxury Taverne': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L’atmosphère est chaleureuse et accueillante. Les aventuriers partagent leurs histoires autour d’une bonne bière, vous remarquez un comptoir (🧑‍🍳) en face.\n\n*NEXT...*',

    'Baguette Dorée': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L’odeur du pain frais embaume l’air mais elle semble fermé.\n\n*NEXT...*',

    'Forge d\'Edward': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le bruit des marteaux et les étincelles ont cessé. Le forgeron est peut-être en pose.\n\n*NEXT...*',

    'Grand Bazar': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les vitrines montrent des étals colorés dressé tout autour. L’excitation de la recherche d’objets rares anime les lieux.\n\n*NEXT...*',

    'Bureau des Missions': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le tableau des quêtes est couvert de missions en attente. Les aventuriers affluent pour accepter des tâches.\n\n*NEXT...*',

    'Salle des Trésors': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les trésors scintillent sous la lumière, chaque objet a une histoire à raconter. L’émerveillement est palpable.\n\n*NEXT...*',

    'Bains Publics': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> La vapeur flotte dans l’air, créant une atmosphère relaxante. Les conversations vont bon train.\n\n*NEXT...*',

    'Galerie des Arts': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les œuvres d’art décorent les murs, chaque pièce témoigne d’un talent exceptionnel. L’inspiration est partout.\n\n*NEXT...*',

    'Grande Bibliothèque': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les livres sont rangés avec soin, chaque page renferme un savoir ancien. Le silence est sacré ici.\n\n*NEXT...*',

    'Centre Médical': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le bâtiment est imposant. Les bruits lointain ont baissé.\n\n*NEXT...*',

    'Laboratoire d\'Oris': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les vitrines montrent des fioles colorées brillent sur les étagères. L’alchimiste semble absent.\n\n*NEXT...*',

    'Quartier Résidentiel': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> La vie quotidienne s’écoule paisiblement. Les habitants vaquent à leurs occupations.\n\n*NEXT...*',

    'Salle des Jeux': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L’excitation des jeux emplit l’air. Les rires et les cris de victoire résonnent jusqu'à vous, un homme apparemment fort ce tiens à l'entrée.\n\n*NEXT...*',

    'Bains Royaux': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le luxe des bains royaux est inégalé. Des nobles se prélassent tout en échangeant des secrets.\n\n*NEXT...*',

    'Résidences Nobles': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le raffinement est à chaque coin de rue. Les nobles se rencontrent pour discuter affaires et intrigues.\n\n*NEXT...*',

    'Cour d\'Honneur': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Un silence sacré règne ici, brisé seulement par le murmure du vent. La majesté de la statue d'Iris impose le respect.\n\n*NEXT...*',

    'Palais Royal': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le palais est immense et semble difficile d'accès, des chevaliers visiblement bien équipée garde l'entrée.\n\n*NEXT...*',

    'Jardins Privés': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Le jardin est un havre de paix, remplis de fleurs rares et d’arbres majestueux. Un parfum envoûtant flotte dans l’air.\n\n*NEXT...*',

    'Hall des Gardiens': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les gardes semble absent, l\'atmosphère est chargée de tension.\n\n*NEXT...*',

    'Oubliettes': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les murs de pierre et couloir sont peu éclairé. Un frisson parcourt l’échine.\n\n*NEXT...*',

    'Écuries Royales': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> Les odeurs de foin et de cuir flottent dans l’air. Les montures nobles sont au repos.\n\n*NEXT...*',

    'Tour Astral': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> La tour offre une vue imprenable sur le ciel. Les étoiles brillent comme des diamants dans la nuit.\n\n*NEXT...*',

   'Arsenal Royaux': '\`𝗢𝗥𝗜𝗚𝗔𝗠𝗬 𝗪𝗢𝗥𝗟𝗗\`\n\n> L\'arsenal est rempli d'armes et d'armures rares, chaque pièce portant la marque des meilleurs artisans du royaume.\n\n*NEXT...*'

}; 

module.exports = {
    generateCompleteEmojiMap,
    customNoVerdictMessages,
    emojimap // Exporter emojimap pour y accéder dans Astoria
};