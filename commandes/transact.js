const { zokou } = require('../framework/zokou');

// Catalogue des articles disponibles à la vente
const catalogue = [
  { nom: "Packs Standard", prix: "2.000💎" },
  { nom: "Pack Premium", prix: "5.000💎" },
  { nom: "Pack Special", prix: "3.000💎" }
];

// Liste des options de transactions
const transactions = [
  { option: "Acheter des packs ou des coupons", commande: "achat" },
  { option: "Vendre des accessoires", commande: "vente" },
  { option: "Échanger des monnaies ou accessoires", commande: "echange" },
  { option: "S'inscrire à un événement", commande: "inscription" },
  { option: "Obtenir un pass de jeu Story Mode", commande: "pass" },
  { option: "Parier sur des confrontations", commande: "pari" },
  { option: "Jouer au casino", commande: "casino" }
];

// Suivi des transactions en cours pour chaque joueur
const ongoingTransactions = {};

// Fonction pour envoyer une image par défaut
const sendDefaultImage = async (zk, origineMessage) => {
  await zk.sendMessage(origineMessage, {
    image: { url: 'https://i.ibb.co/16p6w2D/image.jpg' }, // Remplacez par l'URL de votre image
    caption: 'Image par défaut'
  });
};

// Fonction pour obtenir la réponse du joueur avec un délai
const getPlayerResponse = async (zk, auteurMessage, origineMessage, timeout = 60000) => {
  try {
    const rep = await zk.awaitForMessage({
      sender: auteurMessage,
      chatJid: origineMessage,
      timeout: timeout
    });

    let selection;
    try {
      selection = rep.message.extendedTextMessage.text;
    } catch {
      selection = rep.message.conversation;
    }
    return selection;
  } catch (error) {
    throw new Error('Délai dépassé ou erreur de réception de message.');
  }
};

zokou(
  {
    nomCom: 'transact',
    reaction: '💰',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    try {
      // Si une transaction est déjà en cours, l'annuler
      if (ongoingTransactions[auteurMessage]) {
        await repondre('Votre précédente transaction a été annulée.');
        delete ongoingTransactions[auteurMessage];
      }

      // Démarrer une nouvelle transaction
      ongoingTransactions[auteurMessage] = { status: 'started' };

      let bienvenueMsg = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
*Bienvenue dans la Transact Zone💸 !*\n\nVeuillez choisir une option parmi les suivantes :\n`;
      transactions.forEach((t, i) => {
        bienvenueMsg += `${i + 1}. ${t.option}\n`;
      });
      bienvenueMsg += `\nTapez le numéro de l'option ou le nom de la commande (ex: "achat, vente, echange, etc...").`;

      await sendDefaultImage(zk, origineMessage);
      await zk.sendMessage(origineMessage, { text: bienvenueMsg });

      // Fonction pour obtenir la sélection du joueur
      const getSelection = async () => {
        const selection = await getPlayerResponse(zk, auteurMessage, origineMessage);

        let selectedTransaction = transactions.find(
          (t, i) => selection == (i + 1) || selection.toLowerCase() === t.commande
        );

        if (!selectedTransaction) {
          await repondre("Veuillez choisir une option valide.");
          return await getSelection();
        }

        return selectedTransaction;
      };

      const selectedTransaction = await getSelection();

      switch (selectedTransaction.commande) {
        case 'achat':
          await repondre('Voici les packs et coupons disponibles à l\'achat :');
          await sendDefaultImage(zk, origineMessage);
          await zk.sendMessage(origineMessage, {
            text: catalogue.map(item => `${item.nom} - Prix : ${item.prix}`).join('\n')
          });
          await repondre('Tapez "pack" pour voir les packs ou "coupon" pour acheter des coupons.');
          
          const achatSelection = await getSelection();

          if (achatSelection.toLowerCase() === 'pack') {
            await repondre('Utilisez la commande "-catalogue" pour voir les packs disponibles.');
            await sendDefaultImage(zk, origineMessage);
          } else if (achatSelection.toLowerCase() === 'coupon') {
            await repondre('Entrez le montant souhaité en 🔰 ou en 💎, ou en 🧭 pour acheter des coupons.');
            // Logique pour calculer la valeur des coupons
            await sendDefaultImage(zk, origineMessage);
          } else {
            await repondre('Option invalide.');
          }
          break;

        case 'vente':
          await repondre('Veuillez lister les accessoires que vous souhaitez vendre.');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour la vente d'accessoires
          break;

        case 'echange':
          await repondre('Choisissez le type d\'échange :\n1. 💎 -> 🧭\n2. 💎 <- 🧭\n3. Transférer un pack vers un autre compte.');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour les échanges et les transferts
          break;

        case 'inscription':
          await repondre('Voici la liste des événements disponibles et leurs tarifs.');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour l'inscription à un événement
          break;

        case 'pass':
          await repondre('Voici les pass disponibles et leurs tarifs, par exemple :\n- *Origamy Story :* 1.000💎');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour obtenir un pass
          break;

        case 'pari':
          await repondre('Placez votre pari sur une confrontation à venir.\nMise minimale : 1.000🧭\nVeuillez spécifier la confrontation.');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour les paris
          break;

        case 'casino':
          await repondre('Bienvenue au casino ! Tapez "-casino" pour accéder aux jeux.');
          await sendDefaultImage(zk, origineMessage);
          // Logique pour jouer au casino
          break;

        default:
          await repondre("Option invalide.");
          await sendDefaultImage(zk, origineMessage);
      }

      delete ongoingTransactions[auteurMessage]; // Fin de la transaction
    } catch (error) {
      console.error("Erreur lors de la transaction:", error);
      await repondre('Une erreur est survenue. Veuillez réessayer.');
      await sendDefaultImage(zk, origineMessage);
    }
  }
);