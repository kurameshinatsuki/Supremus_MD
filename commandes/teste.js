const { zokou } = require('../framework/zokou');

// IDs des discussions autorisées (remplacez par les vrais JIDs)
const jidsAutorises = [
    '120363334477094721@g.us', // Exemple de JID de groupe
    '22554191184@s.whatsapp.net' // Exemple de JID individuel
];

let jeuEnCours = {}; // Objet pour suivre les jeux en cours par utilisateur

zokou(
  {
    nomCom: 'casino1',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg, from } = commandeOptions;
    const joueur = auteurMessage; // Identifiant unique du joueur
    const jid = from; // JID de la discussion

    // 1. Vérification du JID
    if (!jidsAutorises.includes(jid)) {
      return repondre("Désolé, cette commande n'est pas autorisée dans cette discussion.");
    }

    const game = arg[0]; // Le type de jeu à lancer
    const mise = parseInt(arg[1]); // La mise du joueur

    if (!game) {
      return repondre("*🎰 Bienvenue au Mini-Casino SRPN !*\nVoici les jeux disponibles :\n\n1. `casino roulette <mise>` - Roue de la fortune\n2. `casino de <mise>` - Lance un dé contre le croupier\n3. `casino slot <mise>` - Machine à sous");
    }

    if (jeuEnCours[joueur]) {
      return repondre("Tu as déjà un jeu en cours. Termine-le avant d'en lancer un autre.");
    }

    if (!mise || isNaN(mise) || mise <= 0) {
      return repondre("Tu dois spécifier une mise valide (un nombre supérieur à zéro).");
    }

    // Demande de confirmation
    repondre(`Tu veux miser ${mise} pour jouer à ${game} ? Réponds avec 'oui' pour confirmer.`);

    // Mise en place de l'attente de la confirmation
    zokou.attendreReponse(origineMessage, zk, {
      auteurMessage: joueur,
      callback: async (confirmation) => {
        if (confirmation.toLowerCase() !== 'oui') {
          repondre("Mise annulée.");
          return;
        }

        jeuEnCours[joueur] = true; // Indique qu'un jeu est en cours

        switch (game.toLowerCase()) {
          case 'roulette':
            // Logique de la roulette
            const gainsPossibles = [1000, 10000, 0, 500, 2000, 0, 1500, 3000]; // Exemple de gains
            const resultatRoulette = gainsPossibles[Math.floor(Math.random() * gainsPossibles.length)];

            if (resultatRoulette > 0) {
              repondre(`La roulette a donné ${resultatRoulette} ! Tu gagnes !`);
              // TODO: Ajouter les gains au joueur
            } else {
              repondre("La roulette a donné 0... Tu perds ta mise.");
              // TODO: Déduire la mise du joueur
            }
            break;

          case 'de':
            // Logique du dé
            const deJoueur = Math.floor(Math.random() * 6) + 1;
            const deCroupier = Math.floor(Math.random() * 6) + 1;

            repondre(`Tu as lancé ${deJoueur}, le croupier a lancé ${deCroupier}.`);

            if (deJoueur > deCroupier) {
              repondre("Tu gagnes !");
              // TODO: Ajouter les gains au joueur
            } else if (deJoueur === deCroupier) {
              repondre("Égalité ! Tu récupères ta mise.");
              // TODO: Rembourser la mise au joueur
            } else {
              repondre("Tu perds ta mise.");
              // TODO: Déduire la mise du joueur
            }
            break;

          case 'slot':
            // Logique du slot
            const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔'];
            const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
            const r1 = spin(), r2 = spin(), r3 = spin();
            const result = `${r1} | ${r2} | ${r3}`;
            const win = r1 === r2 && r2 === r3;

            repondre(`🎰 Résultat : ${result}\n${win ? '✨ JACKPOT ! Tu gagnes !' : 'Pas de chance cette fois...'}`);
            // TODO: Gérer les gains/pertes du joueur
            break;

          default:
            repondre('Jeu non reconnu. Utilise roulette, de ou slot.');
        }

        jeuEnCours[

joueur] = false; // Libère le joueur pour un nouveau jeu
      }
    });
  }
);