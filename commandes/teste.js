const { zokou } = require('../framework/zokou');

// Configuration des packs et des taux de loot
const packs = {
  "🥉": { prix: 150, loot: { commun: 80, rare: 15, epique: 5 } },
  "🥈": { prix: 200, loot: { commun: 60, rare: 30, epique: 10 } },
  "🥇": { prix: 250, loot: { commun: 40, rare: 40, epique: 15, legendaire: 5 } },
  "🏅": { prix: 300, loot: { commun: 20, rare: 40, epique: 30, legendaire: 10 } }
};

// Fonction pour générer du loot
const genererLoot = (typePack) => {
  const lootTable = [];
  for (const [rarete, taux] of Object.entries(typePack.loot)) {
    for (let i = 0; i < taux; i++) {
      lootTable.push(rarete);
    }
  }
  return lootTable[Math.floor(Math.random() * lootTable.length)];
};

// Commande /acheter
zokou(
  {
    nomCom: 'acheter',
    reaction: '🛒',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;
    
    try {
      // Demander le jeu concerné
      await repondre("📌 Choisissez le jeu pour votre pack :\n1️⃣ ABM\n2️⃣ Speed Rush\n3️⃣ Yu-Gi-Oh Speed Duel\n4️⃣ Origamy World");
      const reponseJeu = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const jeux = ["ABM", "Speed Rush", "Yu-Gi-Oh Speed Duel", "Origamy World"];
      const choixJeu = jeux[Number(reponseJeu.message.conversation) - 1] || reponseJeu.message.conversation;
      
      if (!jeux.includes(choixJeu)) {
        return await repondre("❌ Jeu invalide. Veuillez réessayer.");
      }

      // Demander le type de pack
      await repondre("📦 Choisissez votre pack :\n🥉 (150🎫)\n🥈 (200🎫)\n🥇 (250🎫)\n🏅 (300🎫)");
      const reponsePack = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const choixPack = packs[reponsePack.message.conversation];

      if (!choixPack) {
        return await repondre("❌ Pack invalide. Veuillez réessayer.");
      }

      // Vérifier si le joueur a assez de coupons (Remplace ceci par la vraie vérification plus tard)
      const soldeCoupons = 500; // Exemple : le joueur a 500 coupons
      if (soldeCoupons < choixPack.prix) {
        return await repondre("❌ Vous n'avez pas assez de coupons pour cet achat.");
      }

      // Générer le contenu du pack
      const lootObtenu = Array.from({ length: 3 }, () => genererLoot(choixPack));

      // Envoyer le message avec les gains
      await repondre(
        `✅ *Achat réussi !* 🎁\nVous avez ouvert un Pack *${choixJeu} ${reponsePack.message.conversation}* et obtenu :\n- ${lootObtenu.join("\n- ")}`
      );

    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);

// Liste des accessoires avec leur valeur en Supremus Tokens
const accessoires = [
  { nom: "Communs", valeur: 5000 },
  { nom: "Rares", valeur: 7500 },
  { nom: "Epiques", valeur: 12000 },
  { nom: "Legendaires", valeur: 15000 }
];

// Commande /vendre
zokou(
  {
    nomCom: 'vendre',
    reaction: '💸',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;

    try {
      // Demander au joueur quel accessoire il souhaite vendre
      await repondre("🛒 Voici les accessoires que vous pouvez vendre :\n" + accessoires.map((item, index) => `${index + 1}. ${item.nom} - Valeur : ${item.valeur}💸`).join("\n"));
      const reponseAccessoire = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });

      const accessoireChoisi = accessoires[Number(reponseAccessoire.message.conversation) - 1];
      if (!accessoireChoisi) {
        return await repondre("❌ Accessoire invalide. Veuillez réessayer.");
      }

      // Simuler la vérification des objets du joueur (ici on suppose qu'il a l'objet)
      const joueurPossedeObjet = true; // A remplacer par la vraie vérification
      if (!joueurPossedeObjet) {
        return await repondre("❌ Vous ne possédez pas cet objet.");
      }

      // Effectuer la vente et créditer le joueur avec les Supremus Tokens
      const montantGagne = accessoireChoisi.valeur;
      // Ajout de la somme dans le solde (à intégrer avec le vrai système de gestion de monnaie)
      const soldeTokens = 0; // Exemple : le joueur a 0 Supremus Tokens
      const nouveauSolde = soldeTokens + montantGagne;

      // Envoi de la confirmation de la vente
      await repondre(`✅ Vous avez vendu ${accessoireChoisi.nom} pour ${montantGagne}💸.\nNouveau solde : ${nouveauSolde}💸`);
      
      // Générer un reçu pour la transaction
      const receipt = `
        📜 **Reçu de Vente**
        Accessoire vendu : ${accessoireChoisi.nom}
        Valeur : ${montantGagne}💸
        Nouveau solde : ${nouveauSolde}💸
        Transaction ID : ${Math.floor(Math.random() * 1000000)}  #Vente
      `;
      await zk.sendMessage(origineMessage, { text: receipt });

    } catch (error) {
      console.error("Erreur lors de la vente :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);

// Taux de conversion avec une taxe de 10 %
const conversionRates = {
  tokensToGems: 1000, // 1000🪙 = 100💎
  gemsToTokens: 100 // 100💎 = 1000🪙
};

// Commande /échanger
zokou(
  {
    nomCom: 'echanger',
    reaction: '🔄',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;

    try {
      // Demander le type de conversion (Tokens vers Gemmes ou Gemmes vers Tokens)
      await repondre("🔄 Choisissez le type de conversion :\n1. Tokens 🪙 → Gemmes 💎\n2. Gemmes 💎 → Tokens 🪙");
      const reponseConversion = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });

      const conversionType = reponseConversion.message.conversation;
      let montantInitial, montantFinal;

      // Si l'utilisateur choisit Tokens → Gemmes
      if (conversionType === '1') {
        await repondre("🪙 Combien de Supremus Tokens souhaitez-vous convertir ?");
        const tokensToConvert = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
        montantInitial = Number(tokensToConvert.message.conversation);

        // Vérification si le joueur possède suffisamment de Tokens
        const soldeTokens = 10000; // Exemple : solde du joueur en tokens
        if (montantInitial > soldeTokens) {
          return await repondre("❌ Vous n'avez pas assez de Supremus Tokens.");
        }

        // Calcul de la conversion et de la taxe
        const montantApresTaxe = montantInitial * (1 - 0.1); // 10 % de taxe
        montantFinal = montantApresTaxe / conversionRates.tokensToGems;

        // Réaliser la conversion
        const nouveauSoldeTokens = soldeTokens - montantInitial;
        const nouveauSoldeGems = montantFinal;

        await repondre(`✅ Vous avez converti ${montantInitial}🪙 en ${montantFinal.toFixed(2)}💎.`);
        await repondre(`Nouveau solde : ${nouveauSoldeTokens}🪙 et ${nouveauSoldeGems.toFixed(2)}💎`);

      }
      // Si l'utilisateur choisit Gemmes → Tokens
      else if (conversionType === '2') {
        await repondre("💎 Combien de Supremus Gemmes souhaitez-vous convertir ?");
        const gemsToConvert = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
        montantInitial = Number(gemsToConvert.message.conversation);

        // Vérification si le joueur possède suffisamment de Gemmes
        const soldeGems = 5000; // Exemple : solde du joueur en gemmes
        if (montantInitial > soldeGems) {
          return await repondre("❌ Vous n'avez pas assez de Supremus Gemmes.");
        }

        // Calcul de la conversion et de la taxe
        const montantApresTaxe = montantInitial * (1 - 0.1); // 10 % de taxe
        montantFinal = montantApresTaxe * conversionRates.gemsToTokens;

        // Réaliser la conversion
        const nouveauSoldeTokens = montantFinal;
        const nouveauSoldeGems = soldeGems - montantInitial;

        await repondre(`✅ Vous avez converti ${montantInitial}💎 en ${montantFinal.toFixed(2)}🪙.`);
        await repondre(`Nouveau solde : ${nouveauSoldeTokens.toFixed(2)}🪙 et ${nouveauSoldeGems}💎`);
      } else {
        return await repondre("❌ Option invalide. Veuillez essayer à nouveau.");
      }

      // Générer un reçu pour la transaction
      const receipt = `
        📜 **Reçu de Conversion**
        Type de conversion : ${conversionType === '1' ? "Tokens 🪙 → Gemmes 💎" : "Gemmes 💎 → Tokens 🪙"}
        Montant initial : ${montantInitial}
        Montant après taxe : ${montantApresTaxe.toFixed(2)}
        Transaction ID : ${Math.floor(Math.random() * 1000000)}  #Conversion
      `;
      await zk.sendMessage(origineMessage, { text: receipt });

    } catch (error) {
      console.error("Erreur lors de l'échange :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);

// Taux de conversion pour les coupons
const couponRates = {
  tokensToCoupons: 1000, // 1000🪙 = 10🎫
  gemsToCoupons: 100 // 100💎 = 10🎫
};

// Commande /coupons
zokou(
  {
    nomCom: 'coupons',
    reaction: '🎫',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;

    try {
      // Demander le type de monnaie à convertir (Tokens ou Gemmes)
      await repondre("🎫 Choisissez la monnaie à convertir en coupons :\n1. Supremus Tokens 🪙\n2. Supremus Gemmes 💎");
      const reponseConversion = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });

      const conversionType = reponseConversion.message.conversation;
      let montantInitial, montantFinal;

      // Si l'utilisateur choisit Tokens 🪙 → Coupons 🎫
      if (conversionType === '1') {
        await repondre("🪙 Combien de Supremus Tokens souhaitez-vous convertir en coupons ?");
        const tokensToConvert = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
        montantInitial = Number(tokensToConvert.message.conversation);

        // Vérification si le joueur possède suffisamment de Tokens
        const soldeTokens = 10000; // Exemple : solde du joueur en tokens
        if (montantInitial > soldeTokens) {
          return await repondre("❌ Vous n'avez pas assez de Supremus Tokens.");
        }

        // Calcul de la conversion
        montantFinal = Math.floor(montantInitial / couponRates.tokensToCoupons) * 10;

        // Réaliser la conversion
        const nouveauSoldeTokens = soldeTokens - montantInitial;
        await repondre(`✅ Vous avez converti ${montantInitial}🪙 en ${montantFinal}🎫.`);
        await repondre(`Nouveau solde : ${nouveauSoldeTokens}🪙`);

      }
      // Si l'utilisateur choisit Gemmes 💎 → Coupons 🎫
      else if (conversionType === '2') {
        await repondre("💎 Combien de Supremus Gemmes souhaitez-vous convertir en coupons ?");
        const gemsToConvert = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
        montantInitial = Number(gemsToConvert.message.conversation);

        // Vérification si le joueur possède suffisamment de Gemmes
        const soldeGems = 5000; // Exemple : solde du joueur en gemmes
        if (montantInitial > soldeGems) {
          return await repondre("❌ Vous n'avez pas assez de Supremus Gemmes.");
        }

        // Calcul de la conversion
        montantFinal = Math.floor(montantInitial / couponRates.gemsToCoupons) * 10;

        // Réaliser la conversion
        const nouveauSoldeGems = soldeGems - montantInitial;
        await repondre(`✅ Vous avez converti ${montantInitial}💎 en ${montantFinal}🎫.`);
        await repondre(`Nouveau solde : ${nouveauSoldeGems}💎`);

      } else {
        return await repondre("❌ Option invalide. Veuillez essayer à nouveau.");
      }

      // Générer un reçu pour la transaction
      const receipt = `
        📜 **Reçu de Conversion en Coupons**
        Type de conversion : ${conversionType === '1' ? "Tokens 🪙 → Coupons 🎫" : "Gemmes 💎 → Coupons 🎫"}
        Montant initial : ${montantInitial}
        Coupons reçus : ${montantFinal}
        Transaction ID : ${Math.floor(Math.random() * 1000000)}  #Coupons
      `;
      await zk.sendMessage(origineMessage, { text: receipt });

    } catch (error) {
      console.error("Erreur lors de l'achat de coupons :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);

// Liste d'événements et leurs cotes associées
const events = [
  { nom: "ABM", cote: 2.0 },
  { nom: "SPEED RUSH", cote: 1.5 },
  { nom: "DUEL YU-GI-OH", cote: 3.0 }
];

// Commande /parier
zokou(
  {
    nomCom: 'parier',
    reaction: '💸',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;

    try {
      // Demander quel événement le joueur souhaite parier
      await repondre("🎯 Choisissez l'événement sur lequel vous souhaitez parier :\n" +
                     events.map((event, index) => `${index + 1}. ${event.nom} - Cote : ${event.cote}`).join("\n"));

      const reponseEvenement = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const selectedEventIndex = Number(reponseEvenement.message.conversation) - 1;

      // Vérifier si l'événement sélectionné est valide
      if (selectedEventIndex < 0 || selectedEventIndex >= events.length) {
        return await repondre("❌ Événement invalide. Veuillez réessayer.");
      }

      const selectedEvent = events[selectedEventIndex];

      // Demander le montant du pari
      await repondre(`💰 Vous avez choisi de parier sur : *${selectedEvent.nom}* avec une cote de ${selectedEvent.cote}. \nQuel montant souhaitez-vous parier ?`);

      const reponseMontant = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const montantPari = Number(reponseMontant.message.conversation);

      // Vérification du solde du joueur pour le pari
      const soldeJoueur = 5000; // Exemple : solde du joueur en 🪙
      if (montantPari > soldeJoueur) {
        return await repondre("❌ Vous n'avez pas assez de Supremus Tokens 🪙 pour parier ce montant.");
      }

      // Calcul des gains possibles
      const gainsPossibles = montantPari * selectedEvent.cote;
      await repondre(`🎉 Vous avez parié ${montantPari}🪙 sur ${selectedEvent.nom}. Vos gains possibles : ${gainsPossibles}🪙 si vous gagnez !`);

      // Simuler le résultat de l'événement (gagnant ou perdant)
      const resultat = Math.random() < 0.5 ? 'gagné' : 'perdu'; // 50% de chance de gagner
      const gainFinal = resultat === 'gagné' ? gainsPossibles : 0;
      const nouveauSolde = soldeJoueur - montantPari + gainFinal;

      // Résultat du pari
      if (resultat === 'gagné') {
        await repondre(`🎉 Félicitations ! Vous avez gagné ${gainFinal}🪙.`);
      } else {
        await repondre(`😞 Vous avez perdu votre pari. Vous avez perdu ${montantPari}🪙.`);
      }

      // Afficher le nouveau solde du joueur
      await repondre(`💸 Nouveau solde : ${nouveauSolde}🪙`);

      // Générer un reçu pour le pari
      const receipt = `
        📜 **Reçu du Pari**
        Événement : ${selectedEvent.nom}
        Montant du pari : ${montantPari}🪙
        Résultat : ${resultat === 'gagné' ? 'Gagné' : 'Perdu'}
        Gains : ${gainFinal}🪙
        Nouveau solde : ${nouveauSolde}🪙
        Transaction ID : ${Math.floor(Math.random() * 1000000)}  #Pari
      `;
      await zk.sendMessage(origineMessage, { text: receipt });

    } catch (error) {
      console.error("Erreur lors du pari :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);

// Liste des jeux de casino avec leurs cotes de gain
const casinoGames = [
  { nom: "Jeu de Dés", cote: 2.0, difficulte: "Facile" },
  { nom: "Roulette", cote: 3.0, difficulte: "Moyenne" },
  { nom: "Poker", cote: 5.0, difficulte: "Difficile" }
];

// Commande /casino
zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'TRANSACT'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;

    try {
      // Demander quel jeu le joueur souhaite jouer
      await repondre("🎲 Choisissez un jeu parmi ceux proposés :\n" +
                     casinoGames.map((game, index) => `${index + 1}. ${game.nom} - Cote : ${game.cote} - Difficulté : ${game.difficulte}`).join("\n"));

      const reponseJeu = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const selectedGameIndex = Number(reponseJeu.message.conversation) - 1;

      // Vérifier si le jeu sélectionné est valide
      if (selectedGameIndex < 0 || selectedGameIndex >= casinoGames.length) {
        return await repondre("❌ Jeu invalide. Veuillez réessayer.");
      }

      const selectedGame = casinoGames[selectedGameIndex];

      // Demander la mise du joueur
      await repondre(`🎯 Vous avez choisi de jouer à *${selectedGame.nom}* (Difficulté: ${selectedGame.difficulte}).\nQuel montant souhaitez-vous miser ?`);

      const reponseMise = await zk.awaitForMessage({ sender: auteurMessage, chatJid: origineMessage, timeout: 60000 });
      const mise = Number(reponseMise.message.conversation);

      // Vérification du solde du joueur pour la mise
      const soldeJoueur = 5000; // Exemple : solde du joueur en 🪙
      if (mise > soldeJoueur) {
        return await repondre("❌ Vous n'avez pas assez de Supremus Tokens 🪙 pour jouer à ce jeu.");
      }

      // Calcul des gains possibles en fonction de la cote du jeu
      const gainsPossibles = mise * selectedGame.cote;
      await repondre(`🎉 Vous avez misé ${mise}🪙. Vos gains possibles : ${gainsPossibles}🪙 si vous gagnez !`);

      // Simuler le résultat du jeu (gagnant ou perdant)
      const resultat = Math.random() < 0.5 ? 'gagné' : 'perdu'; // 50% de chance de gagner
      const gainFinal = resultat === 'gagné' ? gainsPossibles : 0;
      const nouveauSolde = soldeJoueur - mise + gainFinal;

      // Résultat du jeu
      if (resultat === 'gagné') {
        await repondre(`🎉 Félicitations ! Vous avez gagné ${gainFinal}🪙.`);
      } else {
        await repondre(`😞 Vous avez perdu votre mise. Vous avez perdu ${mise}🪙.`);
      }

      // Afficher le nouveau solde du joueur
      await repondre(`💸 Nouveau solde : ${nouveauSolde}🪙`);

      // Générer un reçu pour le jeu de casino
      const receipt = `
        📜 **Reçu du Casino**
        Jeu : ${selectedGame.nom}
        Mise : ${mise}🪙
        Résultat : ${resultat === 'gagné' ? 'Gagné' : 'Perdu'}
        Gains : ${gainFinal}🪙
        Nouveau solde : ${nouveauSolde}🪙
        Transaction ID : ${Math.floor(Math.random() * 1000000)}  #Casino
      `;
      await zk.sendMessage(origineMessage, { text: receipt });

    } catch (error) {
      console.error("Erreur lors du jeu de casino :", error);
      await repondre("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  }
);