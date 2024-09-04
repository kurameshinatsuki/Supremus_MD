const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'control',
    categorie: 'MONBOT'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    const message = arg.join(' ').toLowerCase(); // Collecte et met tout en minuscule pour faciliter la recherche
    
    // Liste de mots-clés et leurs réponses
    const motsCles = {
      'bonjour': 'Salut ! Comment puis-je t’aider aujourd’hui ?',
      'aide': 'Voici la liste des commandes disponibles...',
      'info': 'Pour en savoir plus sur le bot, tapez /info',
    };

    let reponse = null;
    
    // Vérifier si un mot-clé est présent dans le message
    for (let motCle in motsCles) {
      if (message.includes(motCle)) {
        reponse = motsCles[motCle];
        break;
      }
    }
    
    // Si un mot-clé est trouvé, le bot répond avec le message associé
    if (reponse) {
      await repondre(reponse);
    }
  }
);