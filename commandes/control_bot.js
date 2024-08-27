async function maine({ zk, texte, origineMessage, repondre, ms }) {
    // Conversion du texte en minuscules pour une comparaison insensible à la casse
    const lowerText = texte.toLowerCase();

    // Vérifie si le texte contient 'taverne' et 'comptoir'
    const isInTavern = lowerText.includes('taverne');
    const isAtCounter = lowerText.includes('comptoir');

    // URL de l'image de la serveuse
    const serveuseImage = 'https://telegra.ph/file/serveuse-image.jpg';

    // Vérifie si le message vient d'un joueur spécifique et s'il a les bons mots-clés
    if (origineMessage == '2250554191184@s.whatsapp.net') {
        if (isInTavern && isAtCounter) {
            // Envoie l'image de la serveuse avec une légende appropriée
            const caption = "Vous entrez dans la taverne et vous approchez du comptoir. Une serveuse vous accueille.";
            await zk.sendMessage(origineMessage, { image: { url: serveuseImage }, caption: caption }, { quoted: ms });
        }
    }
}

module.exports = maine;