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
            throw new Error("Erreur lors de la récupération du lien de l'image/vidéo");
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

// Commande pour gérer les images et vidéos
zokou({ nomCom: "url", categorie: "MON-BOT", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
    const { msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu) {
        repondre('Veuillez mentionner une image ou une vidéo.');
        return;
    }

    let mediaPath;

    try {
        // Télécharge l'image ou la vidéo
        if (msgRepondu.videoMessage) {
            mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
            const videoUrl = await uploadVideoToCloudinary(mediaPath); // Upload de la vidéo sur Cloudinary
            repondre(videoUrl); // Répond avec le lien de la vidéo
        } else if (msgRepondu.imageMessage) {
            mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
            const imgbbUrl = await uploadToImgBB(mediaPath); // Upload de l'image sur ImgBB
            repondre(imgbbUrl); // Répond avec le lien de l'image
        } else {
            repondre('Veuillez mentionner une image ou une vidéo.');
        }

        fs.unlinkSync(mediaPath);  // Supprime le fichier après l'upload
    } catch (error) {
        console.error('Erreur lors de l\'upload :', error);
        repondre('Erreur lors de l\'upload de l\'image ou de la vidéo.');
    }
});