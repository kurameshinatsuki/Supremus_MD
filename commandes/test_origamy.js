const { zokou } = require('../framework/zokou');
const { getVerdictByKeyword, updateVerdict } = require('../bdd/test_origamy');

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
const completeEmojiMap = {};

// Remplir le completeEmojiMap avec les sous-lieux
for (const [emoji, lieu] of Object.entries(emojimap)) {
    completeEmojiMap[emoji] = lieu;

    // Ajout des événements et sous-lieux pour chaque lieu
    for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
        completeEmojiMap[emoji + eventEmoji] = lieu + ' ' + eventName;
    }
}

// Messages personnalisés en cas d'absence de verdict
const customNoVerdictMessages = {
    'Porte Principale': '\`ORIGAMY STORY\`\n\n> Les gardes montent la garde avec vigilance, observant chaque nouvel arrivant. L’ambiance est remplie d’anticipation.\n\n- Parler aux gardes.\n- Inspecter les alentours.\n- Observer les nouveaux arrivants.\n\n*NEXT...*',
    
    'Transport Public': '\`ORIGAMY STORY\`\n\n> La navette est attendue avec impatience par des voyageurs de tous horizons. Les discussions sont animées.\n\n- Attendre une navette.\n- Discuter avec des voyageurs.\n- Explorer les itinéraires.\n\n*NEXT...*',

    'Cimetière': '\`ORIGAMY STORY\`\n\n> Un calme pesant enveloppe le cimetière. Des murmures lointains se font entendre, donnant un air mystique à l’endroit.\n\n- Écouter les murmures des esprits.\n- Déposer une offrande.\n- Méditer en silence.\n\n*NEXT...*',

    'Bois Sacrés': '\`ORIGAMY STORY\`\n\n> Les arbres majestueux semblent murmurer des secrets anciens. L’atmosphère est empreinte de magie.\n\n- Ramasser des herbes magiques.\n- Écouter les esprits des arbres.\n- Suivre une piste étrange.\n\n*NEXT...*',

    'Colisée d\'Aurelius': '\`ORIGAMY STORY\`\n\n> L’arène résonne des échos de combats passés. L’excitation des spectateurs est palpable.\n\n- S\'entraîner dans l\'arène.\n- Défier un gladiateur.\n- Observer les combats passés.\n\n*NEXT...*',

    'Arène Souterraine': '\`ORIGAMY STORY\`\n\n> Des murmures de paris secrets flottent dans l’air. L’endroit est sombre et mystérieux.\n\n- Parier sur des combats clandestins.\n- Défier un adversaire.\n- Enquêter sur les rumeurs.\n\n*NEXT...*',

    'Centre de Commandement': '\`ORIGAMY STORY\`\n\n> La salle est animée par des discussions stratégiques. Les officiers se concertent sur la meilleure approche.\n\n- Discuter de stratégie avec un officier.\n- Proposer une mission.\n- Observer les cartes militaires.\n\n*NEXT...*',

    'Camp d\'Entraînement': '\`ORIGAMY STORY\`\n\n> Les soldats s’entraînent avec ardeur, faisant résonner leurs armes. L’atmosphère est dynamique.\n\n- S\'entraîner avec les soldats.\n- Apprendre une nouvelle technique.\n- Défier un instructeur.\n\n*NEXT...*',

    'Académie d\'Arcana': '\`ORIGAMY STORY\`\n\n> Les étudiants étudient attentivement, entourés de livres anciens. La magie est dans l’air.\n\n- Assister à un cours.\n- Étudier un grimoire ancien.\n- Pratiquer un sortilège.\n\n*NEXT...*',

    'Caserne de la Garde': '\`ORIGAMY STORY\`\n\n> L’odeur du cuir et du métal flotte dans l’air. Les gardes partagent des histoires captivantes.\n\n- Écouter les récits des gardes.\n- Aider à préparer une patrouille.\n- Découvrir les secrets de la Garde.\n\n*NEXT...*',

    'Marché Central': '\`ORIGAMY STORY\`\n\n> Le marché est animé, les cris des commerçants et les discussions des clients créent une ambiance vivante.\n\n- Marchander avec les commerçants.\n- Acheter des provisions.\n- Écouter les rumeurs des clients.\n\n*NEXT...*',

    'Luxury Taverne': '\`ORIGAMY STORY\`\n\n> L’atmosphère est chaleureuse et accueillante. Les aventuriers partagent leurs histoires autour d’une bonne bière.\n\n- Partager une boisson.\n- Écouter les récits des aventuriers.\n- Lancer un jeu de dés.\n\n*NEXT...*',

    'Baguette Dorée': '\`ORIGAMY STORY\`\n\n> L’odeur du pain frais embaume l’air. Les clients se pressent pour déguster les délices du boulanger.\n\n- Acheter du pain frais.\n- Discuter avec le boulanger.\n- Participer à une dégustation.\n\n*NEXT...*',

    'Forge d\'Edward': '\`ORIGAMY STORY\`\n\n> Le bruit des marteaux résonne, les étincelles volent. La passion du forgeron se ressent dans chaque création.\n\n- Commander une arme.\n- Aider à la forge.\n- Inspecter les dernières créations.\n\n*NEXT...*',

    'Grand Bazar': '\`ORIGAMY STORY\`\n\n> Des étals colorés se dressent tout autour. L’excitation de la recherche d’objets rares anime les lieux.\n\n- Chercher des objets rares.\n- Discuter avec les marchands.\n- Organiser un échange.\n\n*NEXT...*',

    'Bureau des Missions': '\`ORIGAMY STORY\`\n\n> Le tableau des quêtes est couvert de missions en attente. Les aventuriers affluent pour accepter des tâches.\n\n- Accepter une mission.\n- Recruter des aventuriers.\n- Consulter le tableau des quêtes.\n\n*NEXT...*',

    'Salle des Trésors': '\`ORIGAMY STORY\`\n\n> Les trésors scintillent sous la lumière, chaque objet a une histoire à raconter. L’émerveillement est palpable.\n\n- Observer les trésors exposés.\n- Enquêter sur une relique.\n- Discuter avec le gardien.\n\n*NEXT...*',

    'Bains Publics': '\`ORIGAMY STORY\`\n\n> La vapeur flotte dans l’air, créant une atmosphère relaxante. Les conversations vont bon train.\n\n- Se détendre.\n- Écouter les conversations.\n- Participer à une cérémonie de purification.\n\n*NEXT...*',

    'Galerie des Arts': '\`ORIGAMY STORY\`\n\n> Les œuvres d’art décorent les murs, chaque pièce témoigne d’un talent exceptionnel. L’inspiration est partout.\n\n- Admirer les œuvres.\n- Discuter avec un artiste.\n- Organiser une exposition.\n\n*NEXT...*',

    'Grande Bibliothèque': '\`ORIGAMY STORY\`\n\n> Les livres sont rangés avec soin, chaque page renferme un savoir ancien. Le silence est sacré ici.\n\n- Lire un manuscrit rare.\n- Étudier un sujet.\n- Parler à un érudit.\n\n*NEXT...*',

    'Centre Médical': '\`ORIGAMY STORY\`\n\n> L’odeur des herbes médicinales embaume l’air. Les blessés reçoivent des soins avec diligence.\n\n- Aider à soigner les blessés.\n- Consulter un médecin.\n- Récupérer après un combat.\n\n*NEXT...*',

    'Laboratoire d\'Oris': '\`ORIGAMY STORY\`\n\n> Les fioles colorées brillent sur les étagères. L’alchimiste s’affaire à ses expériences.\n\n- Expérimenter une nouvelle potion.\n- Discuter avec l’alchimiste.\n- Étudier les ingrédients.\n\n*NEXT...*',

    'Quartier Résidentiel': '\`ORIGAMY STORY\`\n\n> La vie quotidienne s’écoule paisiblement. Les habitants vaquent à leurs occupations.\n\n- Visiter un habitant.\n- Observer la vie quotidienne.\n- Découvrir un secret caché.\n\n*NEXT...*',

    'Salle des Jeux': '\`ORIGAMY STORY\`\n\n> L’excitation des jeux emplit l’air. Les rires et les cris de victoire résonnent autour des tables.\n\n- Participer à un tournoi.\n- Parier sur une partie.\n- Défier un champion.\n\n*NEXT...*',

    'Bains Royaux': '\`ORIGAMY STORY\`\n\n> Le luxe des bains royaux est inégalé. Des nobles se prélassent tout en échangeant des secrets.\n\n- Se relaxer.\n- Écouter les rumeurs des nobles.\n- Participer à une discussion secrète.\n\n*NEXT...*',

    'Résidences Nobles': '\`ORIGAMY STORY\`\n\n> Le raffinement est à chaque coin de rue. Les nobles se rencontrent pour discuter affaires et intrigues.\n\n- Visiter un noble.\n- Participer à un dîner.\n- Enquêter sur les intrigues de la cour.\n\n*NEXT...*',

    'Résidences Nobles': '\`ORIGAMY STORY\`\n\n> Le raffinement est à chaque coin de rue. Les nobles se rencontrent pour discuter affaires et intrigues.\n\n- Visiter un noble.\n- Participer à un dîner.\n- Enquêter sur les intrigues de la cour.\n\n*NEXT...*',

    'Cour d\'Honneur': '\`ORIGAMY STORY\`\n\n> Un silence sacré règne ici, brisé seulement par le murmure du vent. La majesté de la statue impose le respect.\n\n- Méditer devant la statue.\n- Organiser une cérémonie.\n- Assister à une audience.\n\n*NEXT...*',

    'Palais Royal': '\`ORIGAMY STORY\`\n\n> Les murs du palais résonnent des échos de l’histoire. Chaque coin abrite des secrets et des légendes.\n\n- Assister à une audience royale.\n- Discuter avec un conseiller.\n- Explorer les couloirs du palais.\n\n*NEXT...*',

    'Jardins Privés': '\`ORIGAMY STORY\`\n\n> Les jardins sont un havre de paix, remplis de fleurs rares et d’arbres majestueux. Un parfum envoûtant flotte dans l’air.\n\n- Se promener.\n- Cueillir des fleurs rares.\n- Méditer en silence.\n\n*NEXT...*',

    'Hall des Gardiens': '\`ORIGAMY STORY\`\n\n> L’atmosphère est chargée de tension, les préparatifs pour la protection du royaume sont en cours.\n\n- Observer les préparatifs.\n- Discuter avec un Gardien.\n- Inspecter les dispositifs de sécurité.\n\n*NEXT...*',

    'Oubliettes': '\`ORIGAMY STORY\`\n\n> Les murs de pierre semblent raconter des histoires oubliées. Un frisson parcourt l’échine.\n\n- Explorer les sous-sols.\n- Enquêter sur les prisonniers passés.\n- Écouter les échos des murs.\n\n*NEXT...*',

    'Écuries Royales': '\`ORIGAMY STORY\`\n\n> Les odeurs de foin et de cuir flottent dans l’air. Les montures nobles sont préparées pour de grandes aventures.\n\n- Soigner une monture.\n- Préparer une course.\n- Discuter avec un palefrenier.\n\n*NEXT...*',

    'Tour Astral': '\`ORIGAMY STORY\`\n\n> La tour offre une vue imprenable sur le ciel. Les étoiles brillent comme des diamants dans la nuit.\n\n- Observer les étoiles.\n- Consulter un astronome.\n- Rechercher une constellation disparue.\n\n*NEXT...*',

    'Arsenal Royaux': '\`ORIGAMY STORY\`\n\n> Les armements sont bien en place, la sécurité est optimale. Rien d\'extraordinaire à signaler ici non plus.\n\n- Inspecter les armes.\n- Aider à forger une lame.\n- Discuter avec le maître d\'armes.\n\n*NEXT...*',
};

zokou(
    {
        nomCom: 'test_astoria',
        categorie: 'ORIGAMY'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        try {
            const message = arg.join(' ');
            let found = false;

            // Parcours des lieux et des événements
            for (const [eventEmoji, eventName] of Object.entries(eventEmojis)) {
                for (const [emoji, lieu] of Object.entries(emojimap)) {
                    // Génération dynamique des sous-lieux avec le format `${lieu}_${event}`
                    const subLieuEmoji = emoji + eventEmoji;
                    const subLieuEventKey = `${lieu}_${eventName}`; // clé dynamique

                    if (message.includes(subLieuEmoji)) {
                        found = true;

                        // Récupération du verdict pour le sous-lieu et l'événement spécifique
                        const verdictData = await getVerdictByKeyword(subLieuEventKey); // Utilisation de la clé dynamique
                        if (verdictData) {
                            const { verdict, image_url } = verdictData;
                            if (image_url) {
                                // Envoi de l'image avec le verdict en légende
                                await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                            } else {
                                repondre(verdict);
                            }
                        } else {
                            // Réponse personnalisée si aucun verdict n'est trouvé pour ce sous-lieu
                            repondre(customNoVerdictMessages[lieu] || `\`ORIGAMY STORY\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT... Veuillez continuer votre exploration.*`);
                        }
                        return; // On sort de la fonction après avoir trouvé un sous-lieu
                    }
                }
            }

            // Si aucun sous-lieu n'est trouvé, vérifie les lieux principaux
            for (const [emoji, lieu] of Object.entries(emojimap)) {
                if (message.includes(emoji)) {
                    found = true;

                    // Récupération du verdict pour ce lieu principal
                    const verdictData = await getVerdictByKeyword(lieu);
                    if (verdictData) {
                        const { verdict, image_url } = verdictData;
                        if (image_url) {
                            // Envoi de l'image avec le verdict en légende
                            await zk.sendMessage(dest, { image: { url: image_url }, caption: verdict }, { quoted: ms });
                        } else {
                            repondre(verdict);
                        }
                    } else {
                        // Réponse personnalisée si aucun verdict n'est trouvé
                        repondre(customNoVerdictMessages[lieu] || `\`ORIGAMY STORY\`\n\n> Aucun verdict trouvé pour '${lieu}'.\n\n*NEXT... Veuillez continuer votre exploration.*`);
                    }
                    break; // On sort de la boucle après avoir trouvé un lieu principal
                }
            }

            if (!found) {
                // Si aucun emoji correspondant n'a été trouvé
                repondre("♼ *NEXT...*");
            }

        } catch (error) {
            // Gestion des erreurs avec informations détaillées sur le lieu et l'emoji
            console.error(`Erreur lors du traitement du lieu avec l'emoji correspondant: ` + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);

zokou(
    {
        nomCom: 'test_master',
        categorie: 'DRPN',
    }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, superUser } = commandeOptions;

        if (!superUser) {
            return repondre("Commande réservée aux *🌐STORY MASTER🎭*.");
        }

        try {
            const [motCle, verdict, imageUrl, etat] = arg.join(' ').split(';');

            if (motCle && verdict && etat) {
                await updateVerdict(motCle, verdict, imageUrl, etat);
                repondre(`Verdict pour '${motCle}' mis à jour avec succès.`);
            } else {
                repondre("*Format incorrect.*\n*Utilisez:*  -astoria_master motCle;verdict;imageUrl;normal");
            }
        } catch (error) {
            console.log("Erreur lors de la mise à jour du verdict : " + error);
            repondre("Une erreur est survenue. Veuillez réessayer.");
        }
    }
);