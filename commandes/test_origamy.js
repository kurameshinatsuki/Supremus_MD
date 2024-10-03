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
    'Porte Principale': '\`ORIGAMY STORY\`\n\n> À l\'entrée de la ville, les gardes semblent vigilants. Une atmosphère calme, mais les rumeurs de voyageurs alertent l\'attention.\n\n*NEXT...*',
    'Transport Public': '\`ORIGAMY STORY\`\n\n> Les navettes sont prêtes à partir, mais l\'activité est au ralenti. Les passants semblent discuter des nouvelles.\n\n*NEXT...*',
    'Cimetière': '\`ORIGAMY STORY\`\n\n> Le cimetière est paisible, un lieu de mémoire. Les ombres des anciens guerriers murmurent des histoires oubliées.\n\n*NEXT...*',
    'Bois Sacrés': '\`ORIGAMY STORY\`\n\n> Les feuilles murmurent des secrets. Une sensation d\'énergie douce flotte dans l\'air, promettant de la magie.\n\n*NEXT...*',
    'Colisée d\'Aurelius': '\`ORIGAMY STORY\`\n\n> L\'arène est vide pour l\'instant, mais l\'écho des cris des foules résonne encore dans les murs. L\'excitation est palpable.\n\n*NEXT...*',
    'Arène Souterraine': '\`ORIGAMY STORY\`\n\n> Des murmures d\'affrontements clandestins parviennent à vos oreilles. L\'adrénaline est présente, même en l\'absence de combats.\n\n*NEXT...*',
    'Centre de Commandement': '\`ORIGAMY STORY\`\n\n> L\'activité militaire est en cours, mais l\'absence de nouvelles directives laisse place à l\'incertitude. Les stratèges semblent préoccupés.\n\n*NEXT...*',
    'Camp d\'Entraînement': '\`ORIGAMY STORY\`\n\n> Les soldats s\'entraînent sous le regard vigilant de leurs instructeurs. Une détermination palpable dans l\'air, mais pas de combats en vue.\n\n*NEXT...*',
    'Académie d\'Arcana': '\`ORIGAMY STORY\`\n\n> Les étudiants se livrent à des discussions animées, mais la magie semble suspendue, attendant d\'être libérée.\n\n*NEXT...*',
    'Caserne de la Garde': '\`ORIGAMY STORY\`\n\n> Les gardes sont en pause, partageant des histoires de bravoure. L\'endroit est calme, mais prêt à réagir à tout moment.\n\n*NEXT...*',
    'Marché Central': '\`ORIGAMY STORY\`\n\n> L\'animation est au rendez-vous, les vendeurs crient leurs offres. Une ambiance vivante, mais rien d\'inhabituel à signaler.\n\n*NEXT...*',
    'Luxury Taverne': '\`ORIGAMY STORY\`\n\n> Les rires et les conversations emplissent l\'air. Un lieu de détente, mais les rumeurs d\'aventures intrigantes circulent.\n\n*NEXT...*',
    'Baguette Dorée': '\`ORIGAMY STORY\`\n\n> Les arômes de pain frais flottent dans l\'air. Les clients se bousculent pour obtenir le meilleur des produits.\n\n*NEXT...*',
    'Forge d\'Edward': '\`ORIGAMY STORY\`\n\n> Les sons du marteau résonnent. La forge est animée, mais aucune commande urgente n\'est en attente.\n\n*NEXT...*',
    'Grand Bazar': '\`ORIGAMY STORY\`\n\n> Les étals sont pleins de trésors variés. Les marchands discutent, mais l\'atmosphère est calme, sans agitation.\n\n*NEXT...*',
    'Bureau des Missions': '\`ORIGAMY STORY\`\n\n> Les aventuriers attendent des missions, mais aujourd\'hui, rien de nouveau à signaler. Un moment de calme avant l\'action.\n\n*NEXT...*',
    'Salle des Trésors': '\`ORIGAMY STORY\`\n\n> Les trésors sont bien gardés, scintillant dans la pénombre. Aucun aventurier en vue pour le moment.\n\n*NEXT...*',
    'Bains Public': '\`ORIGAMY STORY\`\n\n> Un endroit idéal pour se détendre. Les conversations se mêlent aux éclats d\'eau, mais pas d\'événements marquants à l\'horizon.\n\n*NEXT...*',
    'Galerie des Arts': '\`ORIGAMY STORY\`\n\n> Les œuvres d\'art sont exposées avec soin. Les visiteurs admirent en silence, mais l\'inspiration semble en attente.\n\n*NEXT...*',
    'Grande Bibliothèque': '\`ORIGAMY STORY\`\n\n> Les pages tournent lentement, empreintes de connaissances. Le silence est d\'or, mais les secrets dorment ici.\n\n*NEXT...*',
    'Centre Médical': '\`ORIGAMY STORY\`\n\n> Les médecins s\'affairent, mais aujourd\'hui, les blessures semblent rares. Une ambiance calme et professionnelle.\n\n*NEXT...*',
    'Laboratoire d\'Oris': '\`ORIGAMY STORY\`\n\n> Les effluves d\'alchimie flottent dans l\'air. Rien de nouveau à signaler pour l\'instant, mais l\'innovation est toujours en marche.\n\n*NEXT...*',
    'Quartier Résidentiel': '\`ORIGAMY STORY\`\n\n> Les habitants vaquent à leurs occupations. Une atmosphère paisible, mais des secrets peuvent se cacher ici.\n\n*NEXT...*',
    'Salle des Jeux': '\`ORIGAMY STORY\`\n\n> Les dés roulent et les rires s\'élèvent. Une ambiance de compétition, mais pas d\'événements majeurs à signaler.\n\n*NEXT...*',
    'Bains Royaux': '\`ORIGAMY STORY\`\n\n> Un havre de paix, l\'eau apaise les esprits. Les murmures de nobles discutant résonnent, mais rien d\'extraordinaire.\n\n*NEXT...*',
    'Résidences Nobles': '\`ORIGAMY STORY\`\n\n> Les nobles se rassemblent, mais les portes sont fermées. Un lieu de mystère, calme et préservé.\n\n*NEXT...*',
    'Cour d\'Honneur': '\`ORIGAMY STORY\`\n\n> La statue d\'Iris se tient majestueusement. L\'endroit est calme, mais un sentiment de grandeur persiste.\n\n*NEXT...*',
    'Palais Royal': '\`ORIGAMY STORY\`\n\n> Les gardes surveillent avec rigueur. L\'opulence est présente, mais aucune audience ne se déroule aujourd\'hui.\n\n*NEXT...*',
    'Jardins Privés': '\`ORIGAMY STORY\`\n\n> La sérénité règne parmi les fleurs. Un endroit pour la méditation, sans événements notables pour l\'instant.\n\n*NEXT...*',
    'Hall des Gardiens': '\`ORIGAMY STORY\`\n\n> Les préparatifs de sécurité sont en cours, mais rien d\'urgent ne semble se passer. L\'équipe est prête à agir.\n\n*NEXT...*',
    'Oubliettes': '\`ORIGAMY STORY\`\n\n> Les murs de pierre racontent des histoires sombres. Aucun écho de vie n\'est présent, un lieu à éviter.\n\n*NEXT...*',
    'Écuries Royales': '\`ORIGAMY STORY\`\n\n> Les montures se reposent, l\'activité est tranquille. Les écuries, bien entretenues, n\'attendent que les nobles pour les chevaucher.\n\n*NEXT...*',
    'Tour Astral': '\`ORIGAMY STORY\`\n\n> Les étoiles sont observées avec soin, mais aujourd\'hui, aucune nouvelle constellation ne se dévoile. Un moment de calme dans l\'étude.\n\n*NEXT...*',
    'Arsenal Royaux': '\`ORIGAMY STORY\`\n\n> Les armements sont bien en place, la sécurité est optimale. Rien d\'extraordinaire à signaler ici non plus.\n\n*NEXT...*',
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