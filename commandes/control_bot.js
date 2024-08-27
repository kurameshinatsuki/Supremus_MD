async function maine({ zk, texte, origineMessage, repondre, ms }) {
    console.log("Début de la fonction 'maine'");
    console.log("Texte reçu:", texte);
    console.log("Origine du message:", origineMessage);

    // Conversion du texte en minuscules pour une comparaison insensible à la casse
    const lowerText = texte.toLowerCase();
    console.log("Texte converti en minuscules:", lowerText);

    // Vérifie si le texte contient 'taverne' et 'comptoir'
    const isInTavern = lowerText.includes('taverne');
    const isAtCounter = lowerText.includes('comptoir');
    console.log("'taverne' trouvé dans le texte:", isInTavern);
    console.log("'comptoir' trouvé dans le texte:", isAtCounter);

    // URL de l'image de la serveuse
    const serveuseImage = 'https://telegra.ph/file/serveuse-image.jpg';
    console.log("URL de l'image de la serveuse:", serveuseImage);

    // Vérifie si le message vient d'un joueur spécifique et s'il a les bons mots-clés
    if (origineMessage === '22554191184@s.whatsapp.net') {
        console.log("Le message provient de l'utilisateur spécifique.");
        if (isInTavern && isAtCounter) {
            console.log("Les mots-clés 'taverne' et 'comptoir' sont présents.");
            // Envoie l'image de la serveuse avec une légende appropriée
            const caption = "Vous entrez dans la taverne et vous approchez du comptoir. Une serveuse vous accueille.";
            try {
                await zk.sendMessage(origineMessage, { image: { url: serveuseImage }, caption: caption }, { quoted: ms });
                console.log("Image envoyée avec succès.");
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'image:", error);
            }
        } else {
            console.log("Les mots-clés ne sont pas présents, aucun message n'a été envoyé.");
        }
    } else {
        console.log("Le message ne provient pas de l'utilisateur spécifique.");
    }

    console.log("Fin de la fonction 'maine'");
}

module.exports = maine;