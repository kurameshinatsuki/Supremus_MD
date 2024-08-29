const { zokou } = require('../framework/zokou');

// Définition des lieux et des objets
const world = {
    "taverne": {
        description: "Vous êtes dans une taverne chaleureuse. Il y a une cheminée, quelques tables, et un comptoir.",
        objects: ["pinte de bière", "carte ancienne"],
        connections: ["rue principale"]
    },
    "rue principale": {
        description: "Vous êtes dans la rue principale de la ville, animée et pleine de vie.",
        objects: ["marchand ambulant"],
        connections: ["taverne", "place du marché"]
    },
    "place du marché": {
        description: "La place du marché est remplie de stands et de marchands criant leurs marchandises.",
        objects: ["fruits", "épée rouillée"],
        connections: ["rue principale"]
    }
    // Ajoute d'autres lieux ici
};

// Suivi des positions des joueurs
const playerPositions = {};

zokou(
    {
        nomCom: 'explore',
        reaction: '🧭',
        categorie: 'NEO_GAMES🎰'
    },
    async (origineMessage, zk, commandeOptions) => {
        const { ms, repondre, auteurMessage, texte } = commandeOptions;

        try {
            // Initialisation de la position du joueur s'il n'a pas encore commencé à jouer
            if (!playerPositions[auteurMessage]) {
                playerPositions[auteurMessage] = "taverne";
            }

            const location = playerPositions[auteurMessage];
            const currentLocation = world[location];

            if (texte && typeof texte === 'string' && texte.trim().toLowerCase() === 'explore') {
                let response = `Vous êtes actuellement à la *${location}*.\n${currentLocation.description}\n\nVous voyez: ${currentLocation.objects.join(", ")}.\n\nVous pouvez aller vers: ${currentLocation.connections.join(", ")}.`;
                await repondre(response);

            } else if (texte && typeof texte === 'string' && currentLocation.connections.includes(texte.trim().toLowerCase())) {
                playerPositions[auteurMessage] = texte.trim().toLowerCase();
                const newLocation = world[playerPositions[auteurMessage]];
                let response = `Vous êtes maintenant à la *${playerPositions[auteurMessage]}*.\n${newLocation.description}\n\nVous voyez: ${newLocation.objects.join(", ")}.`;
                await repondre(response);

            } else {
                await repondre(`Commande inconnue. Tapez 'explore' pour voir où vous êtes ou tapez un lieu pour vous y rendre.`);
            }

        } catch (error) {
            console.error("Erreur lors du jeu d'exploration:", error);
            repondre('Une erreur est survenue. Veuillez réessayer.');
        }
    }
);