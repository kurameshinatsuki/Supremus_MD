const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const cloudinary = require('cloudinary').v2;

// Configurer les clés API
const imgbbAPIKey = "109d00b272a1b32c5552a60571660c54";
cloudinary.config({
  cloud_name: 'dwnofjjes',
  api_key: '793659492253343',
  api_secret: 't3PWjDL73aPjm0DqP_1RxNo6BTY',
});

// Fonction pour upload sur ImgBB (images)
async function uploadToImgBB(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("Fichier non existant");
    }

    try {
        const form = new FormData();
        form.append("image", fs.createReadStream(Path));

        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, form, {
            headers: { ...form.getHeaders() },
        });

        if (data && data.data && data.data.url) {
            return data.data.url;
        } else {
            throw new Error("Erreur lors de la récupération du lien de l'image.");
        }
    } catch (err) {
        throw new Error(String(err));
    }
}

// Fonction pour upload sur Cloudinary (vidéos)
async function uploadVideoToCloudinary(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("Fichier non existant");
    }

    try {
        const result = await cloudinary.uploader.upload(filePath, { resource_type: "video" });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Erreur lors de l'upload de la vidéo sur Cloudinary.`);
    }
}

// Commande pour l'upload d'image (via ImgBB)
zokou({ nomCom: "url", categorie: "MON-BOT", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
    const { msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu || !msgRepondu.imageMessage) {
        repondre('Veuillez mentionner une image.');
        return;
    }

    let mediaPath;

    try {
        // Télécharge l'image depuis le message
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);

        // Upload l'image sur ImgBB
        const imgbbUrl = await uploadToImgBB(mediaPath);

        // Supprime l'image après l'upload
        fs.unlinkSync(mediaPath);

        // Répond avec le lien de l'image
        repondre(imgbbUrl);
    } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image :', error);
        repondre('Erreur lors de l\'upload de l\'image.');
    }
});

// Commande pour l'upload de vidéo (via Cloudinary)
zokou({ nomCom: "urlv", categorie: "MON-BOT", reaction: "🎥" }, async (origineMessage, zk, commandeOptions) => {
    const { msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu || !msgRepondu.videoMessage) {
        repondre('Veuillez mentionner une vidéo.');
        return;
    }

    let mediaPath;

    try {
        // Télécharge la vidéo depuis le message
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);

        // Upload la vidéo sur Cloudinary
        const videoUrl = await uploadVideoToCloudinary(mediaPath);

        // Supprime la vidéo après l'upload
        fs.unlinkSync(mediaPath);

        // Répond avec le lien de la vidéo
        repondre(videoUrl);
    } catch (error) {
        console.error('Erreur lors de l\'upload de la vidéo :', error);
        repondre('Erreur lors de l\'upload de la vidéo.');
    }
});