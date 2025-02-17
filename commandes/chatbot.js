/*const { zokou } = require('../framework/zokou');
const axios = require('axios');

// Récupération de l'API Key depuis les variables d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Vérification si l'API Key est disponible
if (!OPENAI_API_KEY) {
  console.error("Erreur : l'API Key OpenAI n'est pas configurée. Veuillez l'ajouter aux variables d'environnement.");
  process.exit(1);
}

// Variable pour activer/désactiver la réponse automatique
let autoReplyEnabled = false;

// Commande pour activer/désactiver la réponse automatique
zokou({ nomCom: "auto", reaction: "⚙️", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg || arg.length === 0) {
    return repondre("Utilisez `!auto on` pour activer ou `!auto off` pour désactiver la réponse automatique.");
  }

  const action = arg[0].toLowerCase();

  if (action === "on") {
    autoReplyEnabled = true;
    return repondre("La réponse automatique est activée.");
  }

  if (action === "off") {
    autoReplyEnabled = false;
    return repondre("La réponse automatique est désactivée.");
  }

  return repondre("Commande inconnue. Utilisez `!auto on` ou `!auto off`.");
});

// Commande pour envoyer un message à l'IA
zokou({ nomCom: "message", reaction: "📡", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!autoReplyEnabled) {
    return; // Ne fait rien si la réponse automatique est désactivée
  }

  if (!arg || arg.length === 0) {
    return repondre("Veuillez entrer un message.");
  }

  try {
    const question = arg.join(" ");
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const botReply = response.data.choices[0].message.content.trim();
    repondre(botReply);
  } catch (error) {
    console.error("Erreur lors de la requête à OpenAI :", error.message || error);
    repondre("Une erreur est survenue lors du traitement de votre demande.");
  }
});*/
