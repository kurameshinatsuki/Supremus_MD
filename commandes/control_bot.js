async function maine({ zk, texte, origineMessage, repondre, ms }) {
    // Détection d'emojis spécifiques dans le texte du message
    const emoji_1 = texte.includes('🏛️');
    const emoji_2 = texte.includes('👨‍🍳');

    // URL de l'image à envoyer en réponse
    const urlimage = 'https://telegra.ph/file/b9ed1612f868e83bbe6b4.jpg';

    // Vérifier si les deux emojis sont présents
    if (emoji_1 && emoji_2) {
        // Envoyer une image en réponse
        zk.sendMessage(origineMessage, { image: { url: urlimage }, caption: "" }, { quoted: ms });
    }
}

module.exports = maine;