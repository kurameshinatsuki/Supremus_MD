// ============================================================
// Nom du fichier : economy.js
// Auteur : Luffy
// GitHub : https://github.com/FaouzKK
//
// Description : Ce fichier contient les fonctions et les logiques
//               liées à l'économie du bot Supremus.
//
// Date de création : 06/03/2025
// Dernière modification : 06/03/2025
//
// ============================================================


const { zokou } = require('../framework/zokou');
const axios = require("axios");

/**
 * @type {string}
 * @description L'URL de l'API Supremus.
 * @docs https://supremus-api.vercel.app/api-doc Lien de la documentations de l'API Supremus.
 */
const supremusApi = 'https://supremus-api.vercel.app/api';

/**
 * @type {string}
 * @description Le token d'authentification pour l'API Supremus Necessaire pour s'authentifier a l'API.
 */
const supremusToken = 'no_token';


/**
 * 
 * @param {string} path - Chemin de la requete de la requête.
 * @param {string} method - Methode de la requête.
 * @param {object|null} params - Paramètres de la requête.
 * @param {object|null} body - Corps de la requête.
 * 
 * @description Fonction pour effectuer une requête sur l'API Supremus.
 * 
 * @returns {Promise<object>} - Les données de la requête.
 */
const requestOnApi = async (path, method, params = null, body = null) => {

    try {

        const requestOptions = {
            method: method,
            url: supremusApi + path,
            headers: {
                'Authorization': `Bearer ${supremusToken}`
            }
        }

        if (params) requestOptions.params = params;
        if (body) requestOptions.data = body;

        const response = await axios(requestOptions);

        if (response.data.status) {
            return response.data.data;
        }
        else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}



zokou({
    nomCom: "addplayer",
    categorie: "economy",
}, async (dest, zk, commandOptions) => {

    const { repondre, ms, arg, superUser, msgRepondu, auteurMsgRepondu } = commandOptions;

    if (!superUser) return repondre("Vous n'avez pas les permissions pour exécuter cette commande !");

    const consigne = `Veillez ajouter repondre a un message ou mentionner un utilisateur en suivant l'ordre:
addPlayer <mention> <nom> <coupons> <supremus_tokens> <supremus_gemmes>`

    if (arg?.length == 0 || arg.join("").trim("") == "") return repondre(consigne);

    let id = null
    let fetchIndex = null

    if (msgRepondu) {
        id = auteurMsgRepondu;
        fetchIndex = 0;
    }
    else if (arg[0].startsWith("@")) {
        id = arg[0].replace("@", "") + "@s.whatsapp.net";
        fetchIndex = 1;
    }
    else {
        return repondre(consigne);
    }

    let username = arg[fetchIndex] || "";
    let coupons = arg[fetchIndex + 1] || 0;
    let supremus_tokens = arg[fetchIndex + 2] || 0;
    let supremus_gemmes = arg[fetchIndex + 3] || 0;

    if (isNaN(coupons) || isNaN(supremus_tokens) || isNaN(supremus_gemmes)) return repondre("Les valeurs doivent être des nombres !");

    coupons = parseInt(coupons);
    supremus_tokens = parseInt(supremus_tokens);
    supremus_gemmes = parseInt(supremus_gemmes);

    try {
        const response = await requestOnApi(`/users/add`, "POST", null, {
            id: id,
            username: username,
            coupons: coupons,
            supremus_tokens: supremus_tokens,
            supremus_gemmes: supremus_gemmes
        });

        repondre(`Le joueur ${response.username} a été ajouté avec succès !`);
    }
    catch (error) {
        return repondre(error.message);
    }
});


zokou({
    nomCom: "getplayer",
    categorie: "economy",
}, async (dest, zk, commandOptions) => {

    const { repondre, ms, arg, superUser, msgRepondu, auteurMsgRepondu, auteurMessage } = commandOptions;

    let userId = null;

    if (msgRepondu) {
        userId = auteurMsgRepondu;
    }
    else if (arg?.length > 0 && arg[0].startsWith("@")) {
        userId = arg[0].replace("@", "") + "@s.whatsapp.net";
    }
    else {
        userId = auteurMessage;
    }

    try {
        const response = await requestOnApi(`/users/${userId}`, "GET");

        const rpgStyleMessage = `
        🧙‍♂️ *${response.username}* 🧙‍♂️
        ---------------------------------
        🏅 *Coupons*: ${response.coupons}
        💎 *Supremus Tokens*: ${response.supremus_tokens}
        💠 *Supremus Gemmes*: ${response.supremus_gemmes}
        ---------------------------------
        `;

        repondre(rpgStyleMessage);
    }
    catch (error) {
        return repondre(error.message);
    }
});



zokou({
    nomCom: "updateplayer",
    categorie: "economy",
}, async (dest, zk, commandOptions) => {

    const { repondre, ms, arg, superUser, msgRepondu, auteurMsgRepondu } = commandOptions;

    if (!superUser) return repondre("Vous n'avez pas les permissions pour exécuter cette commande !");

    const consigne = `
Veillez repondre au message d'un joueurs ou mentionner un joueurs en ajoutant un le prefix de la variable a modifier:
*exemple : updatePlayer @<tag> supremus_tokens=3495*
Vous pouvez ajouter un a plusieurs prefix et par default la valeurs entrer sera additionner a la valeurs existence pour ecraser une nouvelle valeurs ajouter l'argument )*--reset* a la commande`

    if (arg?.length == 0 || arg.join("").trim("") == "") return repondre(consigne);

    let id = null

    if (msgRepondu) {
        id = auteurMsgRepondu;
    }
    else if (arg[0].startsWith("@")) {
        id = arg[0].replace("@", "") + "@s.whatsapp.net";
    }
    else {
        return repondre(consigne);
    }

    let supremus_tokens = arg.find(e => e.startsWith("supremus_tokens"))?.replace("supremus_tokens=", "") || null;
    let coupons = arg.find(e => e.startsWith("coupons"))?.replace("coupons=", "") || null;
    let supremus_gemmes = arg.find(e => e.startsWith("supremus_gemmes"))?.replace("supremus_gemmes=", "") || null;

    if (supremus_tokens == null && coupons == null && supremus_gemmes == null) return repondre(consigne);

    // if (isNaN(coupons) || isNaN(supremus_tokens) || isNaN(supremus_gemmes)) return repondre("Les valeurs doivent être des nombres !");

    coupons = coupons ? parseInt(coupons) : null;
    supremus_tokens = coupons ? parseInt(supremus_tokens) : null;
    supremus_gemmes = coupons ? parseInt(supremus_gemmes) : null;

    let appendCurrency = !arg.includes("--reset");

    try {

        const response = await requestOnApi(`/users/${id}`, 'PUT', null, {
            coupons: coupons,
            supremus_tokens: supremus_tokens,
            supremus_gemmes: supremus_gemmes,
            appendCurrency: appendCurrency
        });

        const rpgStyleMessage = `
        🧙‍♂️ *${response.username}* 🧙‍♂️
        ---------------------------------
        🏅 *Coupons*: ${response.coupons}
        💎 *Supremus Tokens*: ${response.supremus_tokens}
        💠 *Supremus Gemmes*: ${response.supremus_gemmes}
        ---------------------------------
        `;

        repondre(rpgStyleMessage);
    }
    catch (error) {
        return repondre(error.message);
    }
});




zokou({
    nomCom: "buypack",
    categorie: "economy",
}, async (dest, zk, commandOptions) => {

    const { repondre, ms, arg, superUser, msgRepondu, auteurMsgRepondu,auteurMessage} = commandOptions;

    try {
        const packList = await requestOnApi('/packs/list', 'GET');

        let texte = `Packs disponibles choisissez un par son index\n\n`

        for (const pack in packList) {
            texte += `${pack + 1} :  ${packList[pack]}\n`
        }

        texte += `\n Choissiez un pack par son index et un grade (bronze, argent, or, special )\n Exemple 1 or`;

        repondre(texte);

        let userResponse;

        try {

            userResponse = await zk.awaitForMessage({
                sender: auteurMessage,
                chatJid: dest,
                timeout: 60000,
            });

        } catch (error) {
            return repondre(`Achat aborder`);
        }

        if (!userResponse) {
            return repondre('Aucune réponse reçue, achat annulé.');
        }

        let [index, grade] = userResponse.message?.extendedTextMessage?.text?.split(" ") || userResponse.message?.conversation?.text?.split(" ") || [];

        if (!index || !grade) {
            return repondre('Veuillez entrer un index et un grade');
        }

        if (isNaN(index)) {
            return repondre('Veuillez entrer un index valide');
        }

        if (!["bronze", "argent", "or", "special"].includes(grade)) {
            return repondre('Veuillez entrer un grade valide');
        }

        const response = await requestOnApi('/packs/buy', 'POST', null, {
            packType: packList[index - 1],
            packGrade: grade,
            userId: auteurMessage
        });

        repondre(response.summary);

    } catch (error) {
        repondre(error.message);
    }
});