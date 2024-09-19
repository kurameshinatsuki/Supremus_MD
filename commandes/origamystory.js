const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'control_astoria',
    categorie: 'MONBOT'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    const message = arg.join(' ').toLowerCase(); // Collecte et met tout en minuscule pour faciliter la recherche

    // Liste de mots-clés et leurs réponses
    const motsCles = {
      '🍽️': {
        text: 'Bienvenue dans notre taverne !',
        image: 'https://telegra.ph/file/2df6f7324d3733153f4d8.jpg'
      },
      '⛲': {
        text: 'Vous êtes à la fontaine d astoria...',
        image: 'https://telegra.ph/file/2df6f7324d3733153f4d8.jpg'
      }
    };

    let reponse = null;
    
    // Vérifier si un mot-clé est présent dans le message
    for (let motCle in motsCles) {
      if (message.includes(motCle)) {
        reponse = motsCles[motCle];
        break;
      }
    }
    
    // Si un mot-clé est trouvé, le bot envoie un message avec texte et image dans le groupe spécifique
    if (reponse) {
      const jidGroupe = '22554191184@s.whatsapp.net'; // Le JID du groupe

      // Envoyer un message avec image dans le groupe
      zk.sendMessage(jidGroupe, { image: { url: reponse.image }, caption: reponse.text }, { quoted: ms });
    }
  }
);
