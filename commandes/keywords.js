// keywords.js

const keywords = {
    "bonjour": "Salut, comment puis-je t'aider aujourd'hui ?",
    "aide": "Je suis ici pour t'aider avec les commandes du bot.",
    "merci": "De rien ! N'hésite pas si tu as d'autres questions."
};

function checkForKeywords(message) {
    for (let keyword in keywords) {
        if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
            return keywords[keyword]; // Retourne la réponse correspondante
        }
    }
    return null; // Aucun mot-clé trouvé
}

module.exports = checkForKeywords;