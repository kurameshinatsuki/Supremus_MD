const { zokou } = require('../framework/zokou');
const { characters } = require('../commandes/catalogue');

/**
 * Fonction pour envoyer l'image et les informations d'un personnage spécifique.
 * @param {string} dest - L'identifiant du destinataire.
 * @param {object} zk - Instance du bot.
 * @param {object} ms - Message source pour la citation.
 * @param {string} personnage - Nom du personnage recherché.
 */
async function envoyerCarte(dest, zk, ms, personnage) {
    let personnageTrouve = false;
    const personnageUpper = personnage.toUpperCase(); // Transformation en majuscules pour éviter les erreurs de casse.

    // Parcourir tous les rangs et univers pour trouver le personnage
    for (const [rang, univers] of Object.entries(characters)) {
        for (const [verse, personnages] of Object.entries(univers)) {
            if (personnages[personnageUpper]) {
                personnageTrouve = true;
                const { lien } = personnages[personnageUpper];

                // Envoi de l'image avec une légende contenant le nom du personnage, son univers et son rang.
                zk.sendMessage(dest, { 
                    image: { url: lien }, 
                    caption: `${personnageUpper} (${verse}) - Rang ${rang}` 
                }, { quoted: ms });

                return; // On arrête la recherche dès qu'on trouve un personnage correspondant.
            }
        }
    }

    // Message d'erreur si le personnage n'est pas trouvé.
    if (!personnageTrouve) {
        zk.sendMessage(dest, { text: `Personnage ${personnage} non trouvé.` }, { quoted: ms });
    }
}

/**
 * Fonction pour envoyer la liste complète des personnages disponibles, triés par rang et univers.
 * @param {string} dest - L'identifiant du destinataire.
 * @param {object} zk - Instance du bot.
 * @param {object} ms - Message source pour la citation.
 */
async function envoyerListe(dest, zk, ms) {
    let message = '*Liste des personnages disponibles :*\n\n';

    // Parcours des rangs et des univers pour construire la liste
    for (const [rang, univers] of Object.entries(characters)) {
        message += `*Rang ${rang} :*\n`;
        for (const [verse, personnages] of Object.entries(univers)) {
            message += `\n_${verse}_ :\n`;
            message += Object.keys(personnages).join(', ') + '\n'; // Ajout des noms des personnages séparés par des virgules.
        }
        message += '\n'; // Ajout d'un espace entre chaque rang pour une meilleure lisibilité.
    }

    // Envoi de la liste complète au joueur
    zk.sendMessage(dest, { text: message }, { quoted: ms });
}

/**
 * Fonction pour sélectionner un personnage aléatoire en fonction des critères donnés.
 * @param {string} dest - L'identifiant du destinataire.
 * @param {object} zk - Instance du bot.
 * @param {object} ms - Message source pour la citation.
 * @param {string|null} rang - Rang du personnage (optionnel).
 * @param {string|null} verse - Univers du personnage (optionnel).
 */
async function personnageAleatoire(dest, zk, ms, rang = null, verse = null) {
    let personnagesFiltres = [];

    // Filtrage des personnages selon les critères (rang et univers)
    for (const [r, univers] of Object.entries(characters)) {
        if (rang && r !== rang.toUpperCase()) continue; // Vérifie si un rang spécifique est demandé.

        for (const [v, personnages] of Object.entries(univers)) {
            if (verse && v !== verse.toUpperCase()) continue; // Vérifie si un univers spécifique est demandé.

            // Ajout des personnages correspondant aux critères dans la liste.
            for (const [nom, data] of Object.entries(personnages)) {
                personnagesFiltres.push({ nom, verse: v, rang: r, lien: data.lien });
            }
        }
    }

    // Si aucun personnage ne correspond aux critères, on envoie un message d'erreur.
    if (personnagesFiltres.length === 0) {
        zk.sendMessage(dest, { text: 'Aucun personnage trouvé avec ces critères.' }, { quoted: ms });
        return;
    }

    // Sélection d'un personnage au hasard dans la liste filtrée.
    const randomPerso = personnagesFiltres[Math.floor(Math.random() * personnagesFiltres.length)];

    // Envoi du personnage sélectionné aléatoirement avec son image et sa description.
    zk.sendMessage(dest, { 
        image: { url: randomPerso.lien }, 
        caption: `${randomPerso.nom} (${randomPerso.verse}) - Rang ${randomPerso.rang}` 
    }, { quoted: ms });
}

// Commande principale pour la gestion des personnages
zokou(
    {
        nomCom: 'perso',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms } = commandeOptions;

        // Si aucune argument n'est donné, afficher la liste des personnages.
        if (!arg || arg.length === 0) {
            await envoyerListe(dest, zk, ms);
        } 
        // Si l'argument "RANDOM" est donné, sélectionner un personnage aléatoire.
        else if (arg[0].toUpperCase() === 'RANDOM') {
            const rang = arg[1] ? arg[1].toUpperCase() : null;
            const verse = arg[2] ? arg[2].toUpperCase() : null;
            await personnageAleatoire(dest, zk, ms, rang, verse);
        } 
        // Sinon, chercher directement le personnage donné en argument.
        else {
            await envoyerCarte(dest, zk, ms, arg[0]);
        }
    }
);