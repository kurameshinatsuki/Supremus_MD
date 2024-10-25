const { zokou } = require('../framework/zokou');

// Catalogue des articles disponibles à la vente
const catalogue = [
  { nom: "Packs Standard", prix: 2000 },
  { nom: "Pack Premium", prix: 5000 },
  { nom: "Pack Special", prix: 3000 }
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
    image: { url: 'https://i.ibb.co/16p6w2D/image.jpg' },
    caption: message
  });
};

// Fonction pour obtenir la réponse du joueur avec un délai
const getPlayerResponse = async (zk, auteurMessage, origineMessage, timeout = 60000) => {
  try {
    const rep = await zk.awaitForMessage({
      sender: auteurMessage,
      chatJid: origineMessage,
      timeout
    });

    return rep.message.extendedTextMessage?.text || rep.message.conversation;
  } catch (error) {
    throw new Error('Délai dépassé ou erreur de réception de message.');
  }
};

// Fonction pour calculer le montant total d'un achat
const calculerMontant = (quantite, prixUnitaire) => quantite * prixUnitaire;

// Fonction pour générer un message de bienvenue et d'options de transaction
const generateWelcomeMessage = () => {
  let message = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n═══════════════════\n*Bienvenue dans la Transact Zone💸 !*\n\nVeuillez choisir une option parmi les suivantes :\n`;
  transactions.forEach((t, i) => {
    message += `${i + 1}. ${t.option}\n`;
  });
  message += `\nTapez le numéro de l'option ou le nom de la commande (ex: "achat, vente, echange, etc...").\n═══════════════════\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`;
  return message;
};

// Fonction pour obtenir la sélection du joueur avec vérification
const getSelection = async (zk, auteurMessage, origineMessage, options, repondre) => {
  const selection = await getPlayerResponse(zk, auteurMessage, origineMessage);
  const selectedOption = options.find((t, i) => selection == (i + 1) || selection.toLowerCase() === t.commande);

  if (!selectedOption) {
    await repondre("Veuillez choisir une option valide.");
    return await getSelection(zk, auteurMessage, origineMessage, options, repondre);
  }
  return selectedOption;
};

zokou(
  {
    nomCom: 'control_transact',
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

      await sendDefaultImage(zk, origineMessage);
      await zk.sendMessage(origineMessage, { text: generateWelcomeMessage() });

      const selectedTransaction = await getSelection(zk, auteurMessage, origineMessage, transactions, repondre);

      switch (selectedTransaction.commande) {
        case 'achat':
          await repondre('Voici les packs et coupons disponibles à l\'achat :');
          await zk.sendMessage(origineMessage, {
            text: catalogue.map(item => `${item.nom} - Prix : ${item.prix}💎`).join('\n')
          });

          const achatSelection = await getSelection(zk, auteurMessage, origineMessage, [
            { commande: 'pack' }, { commande: 'coupon' }
          ], repondre);

          if (achatSelection.commande === 'pack') {
            await repondre('Veuillez entrer le nom du pack que vous souhaitez acheter :');
            const packChoisi = await getSelection(zk, auteurMessage, origineMessage, catalogue, repondre);

            await repondre(`Vous avez choisi ${packChoisi.nom}. Combien en voulez-vous ?`);
            const quantite = await getPlayerResponse(zk, auteurMessage, origineMessage);
            const total = calculerMontant(Number(quantite), packChoisi.prix);
            await repondre(`Le montant total pour ${quantite} ${packChoisi.nom} est de ${total}💎.`);

            await sendDefaultImage(zk, origineMessage);
          } else if (achatSelection.commande === 'coupon') {
            await repondre('Entrez le montant souhaité en 💎 ou en 🧭 pour acheter des coupons.');
            await sendDefaultImage(zk, origineMessage);
          }
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