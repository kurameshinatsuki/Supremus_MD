const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'choix',
    categorie: 'INTERACTIF'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, buttonId } = commandeOptions;

    // Si l'utilisateur clique sur un bouton
    if (buttonId) {
      try {
        // Gestion des différentes options en fonction du buttonId
        if (buttonId === 'option1') {
          await repondre("Vous avez choisi l'Option 1");
        } else if (buttonId === 'option2') {
          await repondre("Vous avez choisi l'Option 2");
        } else if (buttonId === 'option3') {
          await repondre("Vous avez choisi l'Option 3");
        } else {
          await repondre("Option inconnue.");
        }
      } catch (error) {
        console.error("Erreur lors du traitement du bouton:", error);
        repondre('Une erreur est survenue lors du traitement du choix.');
      }
    } else {
      // Si aucun bouton n'a été cliqué, on envoie les options
      try {
        // Création des boutons
        const boutons = [
          {
            buttonId: 'option1',
            buttonText: { displayText: 'Option 1' },
            type: 1,
          },
          {
            buttonId: 'option2',
            buttonText: { displayText: 'Option 2' },
            type: 1,
          },
          {
            buttonId: 'option3',
            buttonText: { displayText: 'Option 3' },
            type: 1,
          }
        ];

        // Message contenant les boutons
        const messageBoutons = {
          text: "Choisissez une option :",
          buttons: boutons,
          headerType: 1 // Type d'en-tête de message (texte)
        };

        // Envoi du message avec les boutons
        await zk.sendMessage(dest, messageBoutons, { quoted: ms });

      } catch (error) {
        console.error("Erreur lors de l'envoi des boutons:", error);
        repondre('Une erreur est survenue lors de l\'envoi des options.');
      }
    }
  }
);