// lieux.js

// Emojis de base pour les lieux principaux
const emojimap = {
    '⛩️': 'Porte Principale',
    '🛞': 'Transport Public',
    '🪦': 'Cimetière',
    '🌲': 'Bois Sacrés',
    '🏟️': 'Colisée d\'Aurelius',
    '🕳️': 'Arène Souterraine',
    '🏛️': 'Centre de Commandement',
    '🏹': 'Camp d\'Entraînement',
    '🎓': 'Académie d\'Arcana',
    '🏢': 'Caserne de la Garde',
    '🛍️': 'Marché Central',
    '🍻': 'Luxury Taverne',
    '🥖': 'Baguette Dorée',
    '⚒️': 'Forge d\'Edward',
    '🎎': 'Grand Bazar',
    '🏤': 'Bureau des Missions',
    '🏦': 'Salle des Trésors',
    '🫧': 'Bains Public',
    '🏬': 'Galerie des Arts',
    '📚': 'Grande Bibliothèque',
    '🏥': 'Centre Médical',
    '⚗️': 'Laboratoire d\'Oris',
    '🏘️': 'Quartier Résidentiel',
    '🎮': 'Salle des Jeux',
    '🛀': 'Bains Royaux',
    '🏡': 'Résidences Nobles',
    '⛲': 'Cour d\'Honneur',
    '🏰': 'Palais Royal',
    '👑': 'Salle du Trône',
    '🏯': 'Hall des Gardiens',
    '⚱️': 'Oubliettes',
    '🐎': 'Écuries Royales',
    '🔭': 'Tour Astral',
    '🗡️': 'Arsenal Royaux',
    '🗺️': 'Carte Astoria'
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
        completeEmojiMap[emoji] = lieu;

        // Ajout des événements et sous-lieux pour chaque lieu
        for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
            completeEmojiMap[emoji + eventEmoji] = lieu + ' ' + eventName;
        }
    }
    return completeEmojiMap;
}

// Messages personnalisés en cas d'absence de verdict
const customNoVerdictMessages = {
    'Porte Principale': '\`ORIGAMY STORY\`\n\n> Les gardes montent la garde avec vigilance, observant chaque nouvel arrivant. L’ambiance est remplie d’anticipation.\n\n - Parler aux gardes.\n - Inspecter les alentours.\n - Observer les nouveaux arrivants.\n\n*NEXT...*',
    'Transport Public': '\`ORIGAMY STORY\`\n\n> La navette est attendue avec impatience par des voyageurs de tous horizons. Les discussions sont animées.\n\n - Attendre une navette.\n - Discuter avec des voyageurs.\n - Explorer les itinéraires.\n\n*NEXT...*',
    'Cimetière': '\`ORIGAMY STORY\`\n\n> Un calme pesant enveloppe le cimetière. Des murmures lointains se font entendre, donnant un air mystique à l’endroit.\n\n - Écouter les murmures des esprits.\n - Déposer une offrande.\n - Méditer en silence.\n\n*NEXT...*',
    'Bois Sacrés': '\`ORIGAMY STORY\`\n\n> Les arbres majestueux semblent murmurer des secrets anciens. L’atmosphère est empreinte de magie.\n\n - Ramasser des herbes magiques.\n - Écouter les esprits des arbres.\n - Suivre une piste étrange.\n\n*NEXT...*',
    // ... ajouter le reste des messages personnalisés
};

module.exports = {
    generateCompleteEmojiMap,
    customNoVerdictMessages
};
